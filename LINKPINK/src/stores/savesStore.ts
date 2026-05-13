// LINKPINK — Saves Store (Zustand)

import { create } from 'zustand';
import type { Save, SaveTag, Tag, ContentSource, ContentType, AIClassification, ProcessingStatus } from '../types';
import { supabase } from '../services/api/supabase';

interface SavesState {
  saves: Save[];
  currentSave: Save | null;
  isLoading: boolean;
  error: string | null;
  processingJobs: Map<string, ProcessingStatus>;

  // Actions
  fetchSaves: (userId: string) => Promise<void>;
  createSave: (save: Partial<Save>) => Promise<Save | null>;
  updateSave: (id: string, updates: Partial<Save>) => Promise<void>;
  deleteSave: (id: string) => Promise<void>;
  togglePin: (id: string) => Promise<void>;
  getSaveById: (id: string) => Promise<void>;
  getSavesByCollection: (collectionId: string) => Promise<Save[]>;
  getRecentSaves: (limit?: number) => Save[];
  getPinnedSaves: () => Save[];
}

export const useSavesStore = create<SavesState>((set, get) => ({
  saves: [],
  currentSave: null,
  isLoading: false,
  error: null,
  processingJobs: new Map(),

  fetchSaves: async (userId) => {
    try {
      set({ isLoading: true, error: null });
      const { data, error } = await supabase
        .from('saves')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ saves: data || [], isLoading: false });
    } catch (e: any) {
      set({ isLoading: false, error: e.message });
    }
  },

  createSave: async (save) => {
    try {
      set({ isLoading: true, error: null });
      const { data, error } = await supabase
        .from('saves')
        .insert(save)
        .select()
        .single();

      if (error) throw error;
      set((state) => ({
        saves: [data, ...state.saves],
        isLoading: false,
      }));
      return data;
    } catch (e: any) {
      set({ isLoading: false, error: e.message });
      return null;
    }
  },

  updateSave: async (id, updates) => {
    try {
      const { error } = await supabase
        .from('saves')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      set((state) => ({
        saves: state.saves.map((s) => (s.id === id ? { ...s, ...updates } : s)),
        currentSave: state.currentSave?.id === id
          ? { ...state.currentSave, ...updates }
          : state.currentSave,
      }));
    } catch (e: any) {
      set({ error: e.message });
    }
  },

  deleteSave: async (id) => {
    try {
      const { error } = await supabase.from('saves').delete().eq('id', id);
      if (error) throw error;
      set((state) => ({
        saves: state.saves.filter((s) => s.id !== id),
        currentSave: state.currentSave?.id === id ? null : state.currentSave,
      }));
    } catch (e: any) {
      set({ error: e.message });
    }
  },

  togglePin: async (id) => {
    const save = get().saves.find((s) => s.id === id);
    if (!save) return;
    await get().updateSave(id, { is_pinned: !save.is_pinned });
  },

  getSaveById: async (id) => {
    try {
      set({ isLoading: true });
      const { data, error } = await supabase
        .from('saves')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      set({ currentSave: data, isLoading: false });
    } catch (e: any) {
      set({ isLoading: false, error: e.message });
    }
  },

  getSavesByCollection: async (collectionId) => {
    try {
      const { data, error } = await supabase
        .from('collection_saves')
        .select('save_id')
        .eq('collection_id', collectionId);

      if (error) throw error;
      const saveIds = data?.map((cs) => cs.save_id) || [];
      return get().saves.filter((s) => saveIds.includes(s.id));
    } catch {
      return [];
    }
  },

  getRecentSaves: (limit = 10) => {
    return get().saves.slice(0, limit);
  },

  getPinnedSaves: () => {
    return get().saves.filter((s) => s.is_pinned);
  },
}));
