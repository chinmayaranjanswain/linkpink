// LINKPINK — Share Extension Handler
// Handles content shared FROM other apps INTO LINKPINK

import { Platform, Linking } from 'react-native';
import { router } from 'expo-router';
import { aiPipeline } from '../../features/ai/aiPipeline';
import { supabase, isSupabaseConfigured } from '../api/supabase';

interface SharedContent {
  type: 'text' | 'url' | 'image' | 'file';
  data: string; // URL, text, or file URI
  mimeType?: string;
  title?: string;
}

export const shareExtension = {
  // Initialize share listener
  init() {
    // Handle deep links (linkpink://share?url=...)
    Linking.addEventListener('url', (event) => {
      this.handleIncomingURL(event.url);
    });

    // Check if app was opened via a share
    Linking.getInitialURL().then((url) => {
      if (url) this.handleIncomingURL(url);
    });
  },

  // Process incoming URL
  handleIncomingURL(url: string) {
    try {
      const parsed = new URL(url);

      if (parsed.protocol === 'linkpink:') {
        const sharedUrl = parsed.searchParams.get('url');
        const sharedText = parsed.searchParams.get('text');

        if (sharedUrl) {
          this.saveContent({ type: 'url', data: sharedUrl });
        } else if (sharedText) {
          // Check if the text contains a URL
          const urlMatch = sharedText.match(/(https?:\/\/[^\s]+)/);
          if (urlMatch) {
            this.saveContent({
              type: 'url',
              data: urlMatch[1],
              title: sharedText.replace(urlMatch[1], '').trim() || undefined,
            });
          } else {
            this.saveContent({ type: 'text', data: sharedText });
          }
        }
      }
    } catch (e) {
      console.error('Error handling incoming URL:', e);
    }
  },

  // Save shared content
  async saveContent(content: SharedContent) {
    const contentType = content.type === 'url'
      ? aiPipeline.detectContentType(content.data)
      : content.type;

    const source = content.type === 'url'
      ? aiPipeline.detectSource(content.data)
      : 'share';

    if (!isSupabaseConfigured()) {
      // Navigate to save modal with prefilled data in demo mode
      router.push({
        pathname: '/save-modal',
        params: {
          sharedUrl: content.data,
          sharedTitle: content.title || '',
        },
      });
      return;
    }

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        // Not logged in — open save modal
        router.push({
          pathname: '/save-modal',
          params: { sharedUrl: content.data },
        });
        return;
      }

      // Quick save to database
      const { data: save, error } = await supabase
        .from('saves')
        .insert({
          user_id: user.id,
          source,
          type: contentType,
          url: content.type === 'url' ? content.data : null,
          content: content.type === 'text' ? content.data : null,
          title: content.title || null,
          processing_status: 'pending',
        })
        .select()
        .single();

      if (error) throw error;

      // Trigger AI processing in background
      if (save) {
        aiPipeline.processContent(save.id, {
          url: content.type === 'url' ? content.data : undefined,
          text: content.type === 'text' ? content.data : undefined,
          imageUri: content.type === 'image' ? content.data : undefined,
          type: contentType as any,
        }).catch(console.error);

        // Navigate to the saved item
        router.push({
          pathname: '/save-detail',
          params: { saveId: save.id },
        });
      }
    } catch (e) {
      console.error('Error saving shared content:', e);
      // Fallback to save modal
      router.push({
        pathname: '/save-modal',
        params: { sharedUrl: content.data },
      });
    }
  },

  // Handle Android intent filter (receives shared content)
  handleAndroidShare(intentData: { type: string; value: string }) {
    const { type, value } = intentData;

    if (type === 'text/plain') {
      const urlMatch = value.match(/(https?:\/\/[^\s]+)/);
      if (urlMatch) {
        this.saveContent({ type: 'url', data: urlMatch[1] });
      } else {
        this.saveContent({ type: 'text', data: value });
      }
    } else if (type.startsWith('image/')) {
      this.saveContent({ type: 'image', data: value, mimeType: type });
    } else {
      this.saveContent({ type: 'file', data: value, mimeType: type });
    }
  },
};
