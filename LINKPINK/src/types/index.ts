// LINKPINK — Core Type Definitions

export type ContentSource = 'instagram' | 'youtube' | 'twitter' | 'github' | 'medium' | 'reddit' | 'tiktok' | 'pdf' | 'web' | 'manual';
export type ContentType = 'link' | 'image' | 'video' | 'text' | 'pdf' | 'document' | 'reel';
export type SubscriptionType = 'free' | 'pro' | 'premium';
export type AuthProvider = 'google' | 'apple' | 'github' | 'email';
export type ProcessingStatus = 'pending' | 'processing' | 'completed' | 'failed';
export type ReminderStatus = 'pending' | 'sent' | 'dismissed';

// ── Database Models (matching architecture tables) ──

export interface User {
  id: string;
  email: string;
  username: string;
  avatar_url: string | null;
  provider: AuthProvider;
  created_at: string;
  last_active: string;
  subscription_type: SubscriptionType;
  instagram_scoped_id?: string;
  sync_code?: string;
}

export interface Save {
  id: string;
  user_id: string;
  source: ContentSource;
  type: ContentType;
  title: string;
  content: string | null;
  url: string | null;
  thumbnail_url: string | null;
  summary: string | null;
  language: string;
  created_at: string;
  updated_at: string;
  is_pinned: boolean;
  processing_status: ProcessingStatus;
  ai_category?: AIClassification;
}

export interface Collection {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  icon: string;
  color: string;
  created_at: string;
  save_count: number;
}

export interface Tag {
  id: string;
  name: string;
  category: string;
}

export interface SaveTag {
  save_id: string;
  tag_id: string;
}

export interface Embedding {
  save_id: string;
  embedding: number[]; // vector(1536)
}

export interface Reminder {
  id: string;
  save_id: string;
  remind_at: string;
  status: ReminderStatus;
}

export interface AnalyticsEvent {
  event_name: string;
  user_id: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

// ── AI Pipeline Types ──

export interface AIClassification {
  main_category: string;
  subcategories: string[];
  confidence: number;
}

export interface AIProcessingJob {
  id: string;
  save_id: string;
  type: 'ocr' | 'embedding' | 'summary' | 'transcript' | 'notification' | 'cleanup' | 'recommendation';
  status: ProcessingStatus;
  progress: number;
  created_at: string;
  completed_at?: string;
  error?: string;
}

export interface SearchResult {
  save: Save;
  score: number;
  tags: Tag[];
  collection?: Collection;
}

// ── Share Extension Types ──

export interface SharePayload {
  type: ContentType;
  url?: string;
  text?: string;
  image_uri?: string;
  title?: string;
}

// ── Instagram Bot Types ──

export interface WebhookPayload {
  sender_id: string;
  message_type: 'text' | 'media' | 'story_reply';
  content: string;
  timestamp: number;
}

// ── Navigation Types ──

export type RootStackParamList = {
  '(tabs)': undefined;
  'auth': undefined;
  'save-detail': { saveId: string };
  'collection-detail': { collectionId: string };
  'save-modal': { payload?: SharePayload };
  'ai-assistant': undefined;
};

export type TabParamList = {
  home: undefined;
  search: undefined;
  collections: undefined;
  profile: undefined;
};
