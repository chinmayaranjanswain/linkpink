// LINKPINK — Search Store (Zustand)

import { create } from 'zustand';
import type { Save, SearchResult } from '../types';
import { supabase } from '../services/api/supabase';
import axios from 'axios';
import { API } from '../constants/theme';

interface SearchState {
  query: string;
  results: SearchResult[];
  recentSearches: string[];
  isSearching: boolean;
  filters: {
    type: string | null;
    source: string | null;
    dateRange: string | null;
    category: string | null;
  };

  setQuery: (query: string) => void;
  search: (query: string) => Promise<void>;
  semanticSearch: (query: string) => Promise<void>;
  setFilter: (key: string, value: string | null) => void;
  clearFilters: () => void;
  clearResults: () => void;
  addRecentSearch: (query: string) => void;
}

export const useSearchStore = create<SearchState>((set, get) => ({
  query: '',
  results: [],
  recentSearches: [],
  isSearching: false,
  filters: {
    type: null,
    source: null,
    dateRange: null,
    category: null,
  },

  setQuery: (query) => set({ query }),

  // Text-based search (fallback)
  search: async (query) => {
    if (!query.trim()) {
      set({ results: [] });
      return;
    }

    try {
      set({ isSearching: true });
      const { filters } = get();

      let dbQuery = supabase
        .from('saves')
        .select('*')
        .or(`title.ilike.%${query}%,content.ilike.%${query}%,summary.ilike.%${query}%`)
        .order('created_at', { ascending: false })
        .limit(20);

      if (filters.type) dbQuery = dbQuery.eq('type', filters.type);
      if (filters.source) dbQuery = dbQuery.eq('source', filters.source);

      const { data, error } = await dbQuery;
      if (error) throw error;

      const results: SearchResult[] = (data || []).map((save) => ({
        save,
        score: 1,
        tags: [],
      }));

      set({ results, isSearching: false });
      get().addRecentSearch(query);
    } catch {
      set({ isSearching: false });
    }
  },

  // Vector semantic search (production path)
  semanticSearch: async (query) => {
    if (!query.trim()) {
      set({ results: [] });
      return;
    }

    try {
      set({ isSearching: true });

      // Generate query embedding via backend
      const response = await axios.post(`${API.BACKEND_URL}/api/search/semantic`, {
        query,
        filters: get().filters,
        limit: 20,
      });

      const results: SearchResult[] = response.data.results;
      set({ results, isSearching: false });
      get().addRecentSearch(query);
    } catch {
      // Fallback to text search
      await get().search(query);
    }
  },

  setFilter: (key, value) => {
    set((state) => ({
      filters: { ...state.filters, [key]: value },
    }));
  },

  clearFilters: () => {
    set({
      filters: { type: null, source: null, dateRange: null, category: null },
    });
  },

  clearResults: () => set({ results: [], query: '' }),

  addRecentSearch: (query) => {
    set((state) => ({
      recentSearches: [
        query,
        ...state.recentSearches.filter((q) => q !== query),
      ].slice(0, 10),
    }));
  },
}));
