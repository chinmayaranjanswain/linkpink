// LINKPINK — AI Pipeline Service
// Handles: content type detection, OCR, transcription, categorization, embeddings, summaries

import axios from 'axios';
import { API } from '../../constants/theme';
import type { AIClassification, ContentType, ProcessingStatus } from '../../types';
import { supabase } from '../api/supabase';

interface ProcessingResult {
  title?: string;
  summary?: string;
  classification?: AIClassification;
  tags?: string[];
  embedding?: number[];
  transcript?: string;
  ocrText?: string;
}

export const aiPipeline = {
  // Detect content type from URL or payload
  detectContentType(url?: string, mimeType?: string): ContentType {
    if (mimeType) {
      if (mimeType.startsWith('image/')) return 'image';
      if (mimeType.startsWith('video/')) return 'video';
      if (mimeType === 'application/pdf') return 'pdf';
      return 'document';
    }

    if (!url) return 'text';

    const lower = url.toLowerCase();
    if (lower.includes('youtube.com') || lower.includes('youtu.be')) return 'video';
    if (lower.includes('instagram.com/reel')) return 'reel';
    if (lower.includes('tiktok.com')) return 'reel';
    if (lower.endsWith('.pdf')) return 'pdf';
    if (/\.(jpg|jpeg|png|gif|webp)/.test(lower)) return 'image';
    if (/\.(mp4|mov|avi|webm)/.test(lower)) return 'video';
    return 'link';
  },

  // Detect source from URL
  detectSource(url?: string): string {
    if (!url) return 'manual';
    const lower = url.toLowerCase();
    if (lower.includes('youtube.com') || lower.includes('youtu.be')) return 'youtube';
    if (lower.includes('instagram.com')) return 'instagram';
    if (lower.includes('twitter.com') || lower.includes('x.com')) return 'twitter';
    if (lower.includes('github.com')) return 'github';
    if (lower.includes('medium.com')) return 'medium';
    if (lower.includes('reddit.com')) return 'reddit';
    if (lower.includes('tiktok.com')) return 'tiktok';
    return 'web';
  },

  // Full AI processing pipeline — sends to backend
  async processContent(saveId: string, content: {
    url?: string;
    text?: string;
    imageUri?: string;
    type: ContentType;
  }): Promise<ProcessingResult> {
    try {
      // Update status to processing
      await supabase
        .from('saves')
        .update({ processing_status: 'processing' })
        .eq('id', saveId);

      // Send to backend for full pipeline processing
      const response = await axios.post(`${API.BACKEND_URL}/api/ai/process`, {
        save_id: saveId,
        ...content,
      });

      const result: ProcessingResult = response.data;

      // Update save with AI results
      await supabase
        .from('saves')
        .update({
          title: result.title,
          summary: result.summary,
          ai_category: result.classification,
          processing_status: 'completed',
        })
        .eq('id', saveId);

      // Store embedding if generated
      if (result.embedding) {
        await supabase
          .from('embeddings')
          .upsert({
            save_id: saveId,
            embedding: result.embedding,
          });
      }

      // Store tags
      if (result.tags && result.tags.length > 0) {
        for (const tagName of result.tags) {
          // Upsert tag
          const { data: tag } = await supabase
            .from('tags')
            .upsert({ name: tagName, category: result.classification?.main_category || 'general' })
            .select()
            .single();

          if (tag) {
            await supabase
              .from('save_tags')
              .upsert({ save_id: saveId, tag_id: tag.id });
          }
        }
      }

      return result;
    } catch (error) {
      // Mark as failed
      await supabase
        .from('saves')
        .update({ processing_status: 'failed' })
        .eq('id', saveId);

      throw error;
    }
  },

  // Generate embedding for search query
  async generateQueryEmbedding(query: string): Promise<number[]> {
    const response = await axios.post(`${API.BACKEND_URL}/api/ai/embed`, {
      text: query,
    });
    return response.data.embedding;
  },

  // AI-powered categorization (client-side fallback)
  categorizeContent(title: string, content?: string): AIClassification {
    const text = `${title} ${content || ''}`.toLowerCase();

    const categories: Record<string, string[]> = {
      'AI': ['ai', 'machine learning', 'neural', 'gpt', 'llm', 'agent', 'langchain', 'openai', 'deep learning'],
      'Coding': ['react', 'javascript', 'typescript', 'python', 'css', 'api', 'backend', 'frontend', 'code'],
      'Study': ['calculus', 'study', 'notes', 'exam', 'lecture', 'academic', 'research', 'paper'],
      'Design': ['ui', 'ux', 'design', 'figma', 'prototype', 'layout', 'color', 'typography'],
      'Startups': ['startup', 'founder', 'yc', 'venture', 'mvp', 'growth', 'business', 'product'],
      'Finance': ['finance', 'crypto', 'trading', 'investment', 'money', 'stripe', 'payment'],
    };

    let bestCategory = 'General';
    let bestScore = 0;
    const subcategories: string[] = [];

    for (const [category, keywords] of Object.entries(categories)) {
      const matches = keywords.filter((k) => text.includes(k));
      if (matches.length > bestScore) {
        bestScore = matches.length;
        bestCategory = category;
        subcategories.push(...matches.slice(0, 3));
      }
    }

    return {
      main_category: bestCategory,
      subcategories: [...new Set(subcategories)].slice(0, 3),
      confidence: Math.min(0.5 + bestScore * 0.15, 0.98),
    };
  },
};
