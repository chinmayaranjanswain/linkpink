// LINKPINK — Collections Store (Zustand)

import { create } from 'zustand';
import type { Collection } from '../types';
import { supabase } from '../services/api/supabase';

interface CollectionsState {
  collections: Collection[];
  currentCollection: Collection | null;
  isLoading: boolean;
  error: string | null;

  fetchCollections: (userId: string) => Promise<void>;
  createCollection: (collection: Partial<Collection>) => Promise<Collection | null>;
  updateCollection: (id: string, updates: Partial<Collection>) => Promise<void>;
  deleteCollection: (id: string) => Promise<void>;
  addSaveToCollection: (collectionId: string, saveId: string) => Promise<void>;
  removeSaveFromCollection: (collectionId: string, saveId: string) => Promise<void>;
}

export const useCollectionsStore = create<CollectionsState>((set, get) => ({
  collections: [],
  currentCollection: null,
  isLoading: false,
  error: null,

  fetchCollections: async (userId) => {
    try {
      set({ isLoading: true, error: null });
      const { data, error } = await supabase
        .from('collections')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ collections: data || [], isLoading: false });
    } catch (e: any) {
      set({ isLoading: false, error: e.message });
    }
  },

  createCollection: async (collection) => {
    try {
      set({ isLoading: true, error: null });
      const { data, error } = await supabase
        .from('collections')
        .insert(collection)
        .select()
        .single();

      if (error) throw error;
      set((state) => ({
        collections: [data, ...state.collections],
        isLoading: false,
      }));
      return data;
    } catch (e: any) {
      set({ isLoading: false, error: e.message });
      return null;
    }
  },

  updateCollection: async (id, updates) => {
    try {
      const { error } = await supabase
        .from('collections')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      set((state) => ({
        collections: state.collections.map((c) =>
          c.id === id ? { ...c, ...updates } : c
        ),
      }));
    } catch (e: any) {
      set({ error: e.message });
    }
  },

  deleteCollection: async (id) => {
    try {
      const { error } = await supabase.from('collections').delete().eq('id', id);
      if (error) throw error;
      set((state) => ({
        collections: state.collections.filter((c) => c.id !== id),
      }));
    } catch (e: any) {
      set({ error: e.message });
    }
  },

  addSaveToCollection: async (collectionId, saveId) => {
    try {
      const { error } = await supabase
        .from('collection_saves')
        .insert({ collection_id: collectionId, save_id: saveId });
      if (error) throw error;

      // Update save count
      set((state) => ({
        collections: state.collections.map((c) =>
          c.id === collectionId ? { ...c, save_count: c.save_count + 1 } : c
        ),
      }));
    } catch (e: any) {
      set({ error: e.message });
    }
  },

  removeSaveFromCollection: async (collectionId, saveId) => {
    try {
      const { error } = await supabase
        .from('collection_saves')
        .delete()
        .eq('collection_id', collectionId)
        .eq('save_id', saveId);
      if (error) throw error;

      set((state) => ({
        collections: state.collections.map((c) =>
          c.id === collectionId
            ? { ...c, save_count: Math.max(0, c.save_count - 1) }
            : c
        ),
      }));
    } catch (e: any) {
      set({ error: e.message });
    }
  },
}));
