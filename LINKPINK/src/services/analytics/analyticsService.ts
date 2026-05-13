// LINKPINK — Analytics Service (PostHog + custom events)

import { Platform } from 'react-native';

// PostHog would be initialized here in production
// import PostHog from 'posthog-react-native';

interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
  timestamp?: Date;
}

class AnalyticsService {
  private isInitialized = false;
  private userId: string | null = null;
  private eventQueue: AnalyticsEvent[] = [];

  async initialize(userId?: string) {
    this.userId = userId || null;
    this.isInitialized = true;

    // Flush queued events
    for (const event of this.eventQueue) {
      this.track(event.name, event.properties);
    }
    this.eventQueue = [];
  }

  identify(userId: string, traits?: Record<string, any>) {
    this.userId = userId;
    // PostHog.identify(userId, traits);
    console.log('[Analytics] Identify:', userId, traits);
  }

  track(name: string, properties?: Record<string, any>) {
    if (!this.isInitialized) {
      this.eventQueue.push({ name, properties, timestamp: new Date() });
      return;
    }

    const event = {
      name,
      properties: {
        ...properties,
        platform: Platform.OS,
        timestamp: new Date().toISOString(),
      },
    };

    // PostHog.capture(name, event.properties);
    console.log('[Analytics] Track:', event.name, event.properties);
  }

  screen(screenName: string, properties?: Record<string, any>) {
    this.track('screen_view', { screen: screenName, ...properties });
  }

  // Pre-defined LINKPINK events
  trackSave(source: string, type: string) {
    this.track('content_saved', { source, content_type: type });
  }

  trackSearch(query: string, resultCount: number, isSemanticSearch: boolean) {
    this.track('search_performed', {
      query_length: query.length,
      result_count: resultCount,
      is_semantic: isSemanticSearch,
    });
  }

  trackAIProcessing(saveId: string, duration: number, success: boolean) {
    this.track('ai_processing', {
      save_id: saveId,
      duration_ms: duration,
      success,
    });
  }

  trackCollectionAction(action: 'create' | 'add_save' | 'remove_save', collectionId: string) {
    this.track('collection_action', { action, collection_id: collectionId });
  }

  trackShareExtension(source: string) {
    this.track('share_extension_used', { source });
  }

  trackOnboarding(step: string) {
    this.track('onboarding_step', { step });
  }

  trackError(error: string, context?: string) {
    this.track('app_error', { error, context });
  }

  reset() {
    this.userId = null;
    // PostHog.reset();
  }
}

export const analytics = new AnalyticsService();
