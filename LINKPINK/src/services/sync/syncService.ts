// LINKPINK — Background Sync Service
// Handles offline queue, retry logic, and sync state management

import NetInfo from '@react-native-community/netinfo';
import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';
import { supabase, isSupabaseConfigured } from '../api/supabase';
import { aiPipeline } from '../../features/ai/aiPipeline';

interface QueuedAction {
  id: string;
  type: 'save' | 'update' | 'delete' | 'process';
  payload: any;
  retries: number;
  created_at: string;
}

class SyncService {
  private isOnline = true;
  private isSyncing = false;
  private queue: QueuedAction[] = [];
  private listeners: Set<(status: SyncStatus) => void> = new Set();

  async initialize() {
    // Monitor network status
    NetInfo.addEventListener((state) => {
      const wasOffline = !this.isOnline;
      this.isOnline = !!state.isConnected;

      if (wasOffline && this.isOnline) {
        // Just came back online — flush queue
        this.processQueue();
      }

      this.notifyListeners();
    });

    // Check initial state
    const state = await NetInfo.fetch();
    this.isOnline = !!state.isConnected;
  }

  // Add action to offline queue
  enqueue(action: Omit<QueuedAction, 'id' | 'retries' | 'created_at'>) {
    const queuedAction: QueuedAction = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      retries: 0,
      created_at: new Date().toISOString(),
      ...action,
    };

    this.queue.push(queuedAction);
    this.notifyListeners();

    if (this.isOnline) {
      this.processQueue();
    }
  }

  // Process offline queue
  async processQueue() {
    if (this.isSyncing || !this.isOnline || this.queue.length === 0) return;
    if (!isSupabaseConfigured()) return;

    this.isSyncing = true;
    this.notifyListeners();

    const failedActions: QueuedAction[] = [];

    for (const action of this.queue) {
      try {
        await this.executeAction(action);
      } catch (error) {
        if (action.retries < 3) {
          failedActions.push({ ...action, retries: action.retries + 1 });
        } else {
          console.error('Action permanently failed after 3 retries:', action);
        }
      }
    }

    this.queue = failedActions;
    this.isSyncing = false;
    this.notifyListeners();
  }

  // Execute a single queued action
  private async executeAction(action: QueuedAction) {
    switch (action.type) {
      case 'save':
        await supabase.from('saves').insert(action.payload);
        break;
      case 'update':
        await supabase
          .from('saves')
          .update(action.payload.updates)
          .eq('id', action.payload.id);
        break;
      case 'delete':
        await supabase.from('saves').delete().eq('id', action.payload.id);
        break;
      case 'process':
        await aiPipeline.processContent(action.payload.saveId, action.payload.content);
        break;
    }
  }

  // Get current sync status
  getStatus(): SyncStatus {
    return {
      isOnline: this.isOnline,
      isSyncing: this.isSyncing,
      pendingCount: this.queue.length,
      lastSyncedAt: null, // TODO: persist
    };
  }

  // Subscribe to sync status changes
  subscribe(listener: (status: SyncStatus) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners() {
    const status = this.getStatus();
    this.listeners.forEach((fn) => fn(status));
  }
}

export interface SyncStatus {
  isOnline: boolean;
  isSyncing: boolean;
  pendingCount: number;
  lastSyncedAt: string | null;
}

export const syncService = new SyncService();
