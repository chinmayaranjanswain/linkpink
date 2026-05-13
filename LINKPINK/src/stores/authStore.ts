// LINKPINK — Auth Store (Zustand)

import { create } from 'zustand';
import type { User } from '../types';
import { authService } from '../services/auth/authService';
import { supabase, isSupabaseConfigured } from '../services/api/supabase';

// Demo user for when Supabase isn't configured
const DEMO_USER: User = {
  id: 'demo-user',
  email: 'demo@linkpink.app',
  username: 'Chinmaya',
  avatar_url: null,
  provider: 'email',
  created_at: new Date().toISOString(),
  last_active: new Date().toISOString(),
  subscription_type: 'free',
};

interface AuthState {
  user: User | null;
  session: any | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;

  // Actions
  initialize: () => Promise<void>;
  signInWithOTP: (email: string) => Promise<void>;
  verifyOTP: (email: string, token: string) => Promise<void>;
  signInWithGoogle: (idToken: string) => Promise<void>;
  signInWithApple: () => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  isLoading: true,
  isAuthenticated: false,
  error: null,

  initialize: async () => {
    try {
      set({ isLoading: true });

      // Demo mode when Supabase not configured
      if (!isSupabaseConfigured()) {
        set({
          user: DEMO_USER,
          session: { user: DEMO_USER },
          isAuthenticated: true,
          isLoading: false,
        });
        return;
      }

      const session = await authService.getSession();
      if (session) {
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        set({
          session,
          user: profile,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
    } catch {
      set({ isLoading: false });
    }

    // Listen for auth changes
    authService.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        set({
          session,
          user: profile,
          isAuthenticated: true,
        });
      } else if (event === 'SIGNED_OUT') {
        set({
          session: null,
          user: null,
          isAuthenticated: false,
        });
      }
    });
  },

  signInWithOTP: async (email) => {
    try {
      set({ isLoading: true, error: null });
      await authService.signInWithOTP(email);
      set({ isLoading: false });
    } catch (e: any) {
      set({ isLoading: false, error: e.message });
    }
  },

  verifyOTP: async (email, token) => {
    try {
      set({ isLoading: true, error: null });
      await authService.verifyOTP(email, token);
      set({ isLoading: false });
    } catch (e: any) {
      set({ isLoading: false, error: e.message });
    }
  },

  signInWithGoogle: async (idToken) => {
    try {
      set({ isLoading: true, error: null });
      await authService.signInWithGoogle(idToken);
      set({ isLoading: false });
    } catch (e: any) {
      set({ isLoading: false, error: e.message });
    }
  },

  signInWithApple: async () => {
    try {
      set({ isLoading: true, error: null });
      await authService.signInWithApple();
      set({ isLoading: false });
    } catch (e: any) {
      set({ isLoading: false, error: e.message });
    }
  },

  signOut: async () => {
    try {
      set({ isLoading: true });
      await authService.signOut();
      set({ user: null, session: null, isAuthenticated: false, isLoading: false });
    } catch (e: any) {
      set({ isLoading: false, error: e.message });
    }
  },

  clearError: () => set({ error: null }),

  updateProfile: async (updates) => {
    const { user } = get();
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();
      if (error) throw error;
      set({ user: data });
    } catch (e: any) {
      set({ error: e.message });
    }
  },
}));
