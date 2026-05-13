// LINKPINK — Design System (Light + Dark Mode)

import { create } from 'zustand';

// ─── Theme Store ───
interface ThemeState {
  mode: 'dark' | 'light';
  toggle: () => void;
  setMode: (mode: 'dark' | 'light') => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  mode: 'dark',
  toggle: () => set((s) => ({ mode: s.mode === 'dark' ? 'light' : 'dark' })),
  setMode: (mode) => set({ mode }),
}));

// ─── Color Palettes ───
const DARK = {
  bg: '#09090F',
  surface: '#12121A',
  elevated: '#1A1A25',
  hover: '#201E2E',
  card: '#15151F',
  rail: '#0C0C14',

  accent: '#A855F7',
  accentSoft: '#C084FC',
  accentMuted: 'rgba(168, 85, 247, 0.14)',
  pink: '#E879F9',
  pinkMuted: 'rgba(232, 121, 249, 0.12)',
  gradient1: '#A855F7',
  gradient2: '#E879F9',

  text: '#F5F3FF',
  sub: '#C4B5FD',
  dim: '#7C6FA0',
  muted: '#4C4363',

  success: '#34D399',
  warning: '#FBBF24',
  error: '#F87171',
  info: '#A855F7',

  border: 'rgba(168,85,247,0.10)',
  borderLight: 'rgba(168,85,247,0.16)',
  borderActive: 'rgba(168,85,247,0.45)',

  overlay: 'rgba(0,0,0,0.75)',
  glass: 'rgba(9,9,15,0.90)',

  // Source colors
  youtube: '#FF0000',
  instagram: '#E4405F',
  twitter: '#1DA1F2',
  github: '#8B949E',
  medium: '#00AB6C',
  reddit: '#FF4500',
  tiktok: '#69C9D0',
  web: '#C084FC',

  tabBg: '#0C0C14',
  tabActive: '#A855F7',
  tabInactive: '#4C4363',
  suggestionBg: '#1A1A25',
} as const;

const LIGHT = {
  bg: '#F2F3F5',
  surface: '#FFFFFF',
  elevated: '#FFFFFF',
  hover: '#E9EAED',
  card: '#FFFFFF',
  rail: '#E3E5E8',

  accent: '#9333EA',
  accentSoft: '#7E22CE',
  accentMuted: 'rgba(147, 51, 234, 0.10)',
  pink: '#D946EF',
  pinkMuted: 'rgba(217, 70, 239, 0.10)',
  gradient1: '#9333EA',
  gradient2: '#D946EF',

  text: '#060607',
  sub: '#4E5058',
  dim: '#80848E',
  muted: '#B5BAC1',

  success: '#248046',
  warning: '#E0A400',
  error: '#DA373C',
  info: '#4752C4',

  border: 'rgba(0,0,0,0.08)',
  borderLight: 'rgba(0,0,0,0.05)',
  borderActive: 'rgba(88,101,242,0.35)',

  overlay: 'rgba(0,0,0,0.50)',
  glass: 'rgba(255,255,255,0.90)',

  youtube: '#FF0000',
  instagram: '#E4405F',
  twitter: '#1DA1F2',
  github: '#24292F',
  medium: '#00AB6C',
  reddit: '#FF4500',
  tiktok: '#010101',
  web: '#7C3AED',

  tabBg: '#E3E5E8',
  tabActive: '#9333EA',
  tabInactive: '#80848E',
  suggestionBg: '#EBEDEF',
} as const;

export type ThemeColors = typeof DARK;

// ─── Get colors for current mode ───
export function getColors(mode: 'dark' | 'light'): ThemeColors {
  return mode === 'dark' ? DARK : LIGHT;
}

// Default export (dark) for backward compat
export const COLORS = DARK;

// ─── Spacing ───
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 40,
} as const;

// ─── Radius ───
export const RADIUS = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  round: 9999,
} as const;

// ─── Font Size ───
export const FONT_SIZE = {
  xs: 10,
  sm: 12,
  md: 13,
  base: 15,
  lg: 17,
  xl: 19,
  xxl: 22,
  xxxl: 28,
  title: 32,
  hero: 36,
} as const;

// ─── Font Weight ───
export const FONT_WEIGHT = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  heavy: '800' as const,
};

// ─── Shadows ───
export const SHADOWS = {
  sm: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.12, shadowRadius: 3, elevation: 2 },
  md: { shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.18, shadowRadius: 6, elevation: 4 },
  lg: { shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.22, shadowRadius: 12, elevation: 8 },
  accent: { shadowColor: '#5865F2', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 12, elevation: 6 },
  glow: { shadowColor: '#5865F2', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.20, shadowRadius: 20, elevation: 0 },
} as const;

// ─── Categories ───
export const CATEGORIES = [
  { id: 'all', icon: 'layers', label: 'All', color: '#A855F7' },
  { id: 'ai', icon: 'cpu', label: 'AI & Tech', color: '#8B5CF6' },
  { id: 'coding', icon: 'code', label: 'Coding', color: '#6366F1' },
  { id: 'study', icon: 'book-open', label: 'Study', color: '#34D399' },
  { id: 'design', icon: 'pen-tool', label: 'Design', color: '#E879F9' },
  { id: 'startups', icon: 'trending-up', label: 'Startups', color: '#FBBF24' },
  { id: 'finance', icon: 'dollar-sign', label: 'Finance', color: '#2DD4BF' },
  { id: 'health', icon: 'heart', label: 'Health', color: '#F87171' },
] as const;

// ─── Source Config ───
export const SOURCE_CONFIG: Record<string, { color: string; label: string; icon: string }> = {
  instagram: { color: DARK.instagram, label: 'Instagram', icon: 'instagram' },
  youtube: { color: DARK.youtube, label: 'YouTube', icon: 'youtube' },
  twitter: { color: DARK.twitter, label: 'Twitter/X', icon: 'twitter' },
  github: { color: DARK.github, label: 'GitHub', icon: 'github' },
  medium: { color: DARK.medium, label: 'Medium', icon: 'book' },
  reddit: { color: DARK.reddit, label: 'Reddit', icon: 'message-circle' },
  tiktok: { color: DARK.tiktok, label: 'TikTok', icon: 'film' },
  pdf: { color: '#FF5722', label: 'PDF', icon: 'file' },
  web: { color: DARK.web, label: 'Web', icon: 'globe' },
  manual: { color: DARK.dim, label: 'Manual', icon: 'edit' },
};

// ─── Rail Dimensions (Discord-style) ───
export const RAIL = {
  width: 56,
  iconSize: 40,
  gap: 6,
} as const;

// ─── API ───
export const API = {
  SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL || '',
  SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '',
  OPENAI_API_KEY: process.env.EXPO_PUBLIC_OPENAI_API_KEY || '',
  BACKEND_URL: process.env.EXPO_PUBLIC_BACKEND_URL || 'http://localhost:3001',
};
