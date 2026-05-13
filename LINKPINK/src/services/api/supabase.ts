// LINKPINK — Supabase Client

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { API } from '../../constants/theme';

// Secure storage adapter for Supabase auth tokens
const SecureStoreAdapter = {
  getItem: async (key: string): Promise<string | null> => {
    if (Platform.OS === 'web') {
      try { return localStorage.getItem(key); } catch { return null; }
    }
    try {
      return await SecureStore.getItemAsync(key);
    } catch {
      return null;
    }
  },
  setItem: async (key: string, value: string): Promise<void> => {
    if (Platform.OS === 'web') {
      try { localStorage.setItem(key, value); } catch {}
      return;
    }
    try {
      await SecureStore.setItemAsync(key, value);
    } catch {
      console.error('SecureStore setItem error:', key);
    }
  },
  removeItem: async (key: string): Promise<void> => {
    if (Platform.OS === 'web') {
      try { localStorage.removeItem(key); } catch {}
      return;
    }
    try {
      await SecureStore.deleteItemAsync(key);
    } catch {
      console.error('SecureStore removeItem error:', key);
    }
  },
};

// Check if Supabase is properly configured
export const isSupabaseConfigured = (): boolean => {
  return !!API.SUPABASE_URL && !!API.SUPABASE_ANON_KEY &&
    API.SUPABASE_URL.startsWith('https://');
};

// Only create real client when configured — otherwise return a mock
let _supabase: SupabaseClient | null = null;

export const getSupabase = (): SupabaseClient => {
  if (!_supabase && isSupabaseConfigured()) {
    _supabase = createClient(
      API.SUPABASE_URL,
      API.SUPABASE_ANON_KEY,
      {
        auth: {
          storage: SecureStoreAdapter,
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: false,
        },
      }
    );
  }
  return _supabase!;
};

// For backwards compat — lazy accessor
export const supabase = new Proxy({} as SupabaseClient, {
  get(_, prop) {
    const client = getSupabase();
    if (!client) {
      // Return no-op stubs for unconfigured state
      if (prop === 'from') return () => ({
        select: () => ({ data: null, error: null, eq: () => ({ data: null, error: null, single: () => ({ data: null, error: null }) }) }),
        insert: () => ({ select: () => ({ single: () => ({ data: null, error: null }) }), data: null, error: null }),
        update: () => ({ eq: () => ({ data: null, error: null, select: () => ({ single: () => ({ data: null, error: null }) }) }) }),
        delete: () => ({ eq: () => ({ data: null, error: null }) }),
        upsert: () => ({ select: () => ({ single: () => ({ data: null, error: null }) }), data: null, error: null }),
      });
      if (prop === 'auth') return {
        getSession: () => Promise.resolve({ data: { session: null } }),
        getUser: () => Promise.resolve({ data: { user: null } }),
        signInWithOtp: () => Promise.resolve({ error: new Error('Supabase not configured') }),
        verifyOtp: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
        signInWithIdToken: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
        signInWithOAuth: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
        signOut: () => Promise.resolve({ error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      };
      return undefined;
    }
    return (client as any)[prop];
  },
});
