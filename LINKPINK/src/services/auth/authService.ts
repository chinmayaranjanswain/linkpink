// LINKPINK — Auth Service

import { supabase, isSupabaseConfigured } from '../api/supabase';

export const authService = {
  // Email OTP login
  async signInWithOTP(email: string) {
    if (!isSupabaseConfigured()) return;
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true },
    });
    if (error) throw error;
  },

  // Verify OTP
  async verifyOTP(email: string, token: string) {
    if (!isSupabaseConfigured()) return null;
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email',
    });
    if (error) throw error;
    return data;
  },

  // Magic link
  async signInWithMagicLink(email: string) {
    if (!isSupabaseConfigured()) return;
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: 'linkpink://auth/callback',
      },
    });
    if (error) throw error;
  },

  // Google OAuth
  async signInWithGoogle(idToken: string) {
    if (!isSupabaseConfigured()) return null;
    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: 'google',
      token: idToken,
    });
    if (error) throw error;
    return data;
  },

  // Apple Sign-In (iOS only, lazy loaded)
  async signInWithApple() {
    try {
      const AppleAuthentication = require('expo-apple-authentication');
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (credential.identityToken) {
        if (!isSupabaseConfigured()) return null;
        const { data, error } = await supabase.auth.signInWithIdToken({
          provider: 'apple',
          token: credential.identityToken,
        });
        if (error) throw error;
        return data;
      }
      throw new Error('No identity token from Apple');
    } catch (e: any) {
      if (e.code === 'ERR_REQUEST_CANCELED') return null;
      throw e;
    }
  },

  // GitHub OAuth (opens browser)
  async signInWithGitHub() {
    if (!isSupabaseConfigured()) return null;
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: 'linkpink://auth/callback',
      },
    });
    if (error) throw error;
    return data;
  },

  // Get current session
  async getSession() {
    if (!isSupabaseConfigured()) return null;
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  },

  // Get current user
  async getUser() {
    if (!isSupabaseConfigured()) return null;
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  // Sign out
  async signOut() {
    if (!isSupabaseConfigured()) return;
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // Listen to auth changes
  onAuthStateChange(callback: (event: string, session: any) => void) {
    if (!isSupabaseConfigured()) {
      return { data: { subscription: { unsubscribe: () => {} } } };
    }
    return supabase.auth.onAuthStateChange(callback);
  },
};
