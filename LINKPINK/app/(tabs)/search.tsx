// LINKPINK — Search Screen (Premium + Theme-aware)

import React, { useState, useCallback } from 'react';
import {
  View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet, Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import {
  getColors, useThemeStore, SPACING, RADIUS, FONT_SIZE, FONT_WEIGHT,
  CATEGORIES, SOURCE_CONFIG,
} from '../../src/constants/theme';

const FILTER_TYPES = ['All', 'Links', 'Videos', 'Images', 'Articles', 'PDFs'] as const;

const SUGGESTED = [
  '🔥 that coding reel from last week',
  '💡 startup idea from last month',
  '🤖 AI study video',
  '⚛️ React Native tutorial',
  '🎨 design inspiration',
  '📐 system design notes',
];

const RECENT_SEARCHES = [
  'langchain agents',
  'react 19 changes',
  'figma auto layout',
];

const MOCK_RESULTS = [
  { id: '1', title: 'Building AI Agents with LangChain', source: 'youtube', type: 'video', time: '2h', category: 'ai' },
  { id: '3', title: 'React 19 — What Actually Changed', source: 'twitter', type: 'thread', time: '8h', category: 'coding' },
  { id: '6', title: 'Figma Auto-Layout Mastery', source: 'youtube', type: 'video', time: '4h', category: 'design' },
];

export default function SearchScreen() {
  const { mode } = useThemeStore();
  const C = getColors(mode);
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [isFocused, setIsFocused] = useState(false);

  const hasQuery = query.length > 0;

  return (
    <View style={[styles.root, { backgroundColor: C.bg }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: C.text }]}>Search</Text>
        <Text style={[styles.subtitle, { color: C.dim }]}>Find anything you've saved</Text>
      </View>

      {/* Search bar */}
      <View style={[
        styles.searchBar,
        {
          backgroundColor: C.elevated,
          borderColor: isFocused ? C.accent : C.border,
        },
      ]}>
        <Feather name="search" size={18} color={isFocused ? C.accent : C.dim} />
        <TextInput
          style={[styles.searchInput, { color: C.text }]}
          placeholder="Search your memories..."
          placeholderTextColor={C.dim}
          value={query}
          onChangeText={setQuery}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {hasQuery && (
          <TouchableOpacity onPress={() => setQuery('')}>
            <Feather name="x" size={16} color={C.dim} />
          </TouchableOpacity>
        )}
      </View>

      {/* Filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={styles.filterContent}>
        {FILTER_TYPES.map((filter) => {
          const active = activeFilter === filter;
          return (
            <TouchableOpacity
              key={filter}
              onPress={() => setActiveFilter(filter)}
              style={[
                styles.filterChip,
                {
                  backgroundColor: active ? C.accent : C.elevated,
                  borderColor: active ? C.accent : C.border,
                },
              ]}
            >
              <Text style={[
                styles.filterText,
                { color: active ? '#FFF' : C.sub },
              ]}>
                {filter}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {!hasQuery ? (
          <>
            {/* Recent searches */}
            {RECENT_SEARCHES.length > 0 && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: C.dim }]}>RECENT</Text>
                {RECENT_SEARCHES.map((search) => (
                  <TouchableOpacity
                    key={search}
                    style={[styles.recentItem, { borderBottomColor: C.border }]}
                    onPress={() => setQuery(search)}
                  >
                    <Feather name="clock" size={14} color={C.dim} />
                    <Text style={[styles.recentText, { color: C.sub }]}>{search}</Text>
                    <Feather name="arrow-up-left" size={14} color={C.muted} />
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Suggestions */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: C.dim }]}>TRY SEARCHING</Text>
              <View style={styles.suggestGrid}>
                {SUGGESTED.map((s) => (
                  <TouchableOpacity
                    key={s}
                    style={[styles.suggestChip, { backgroundColor: C.elevated, borderColor: C.border }]}
                    onPress={() => setQuery(s.replace(/^[^\s]+ /, ''))}
                  >
                    <Text style={[styles.suggestText, { color: C.sub }]}>{s}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </>
        ) : (
          /* Search Results */
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: C.dim }]}>
              {MOCK_RESULTS.length} RESULTS
            </Text>
            {MOCK_RESULTS.map((r) => (
              <TouchableOpacity
                key={r.id}
                style={[styles.resultItem, { backgroundColor: C.card, borderColor: C.border }]}
                onPress={() => router.push({ pathname: '/save-detail', params: { saveId: r.id } })}
              >
                <View style={[styles.resultIcon, { backgroundColor: `${SOURCE_CONFIG[r.source]?.color || C.accent}18` }]}>
                  <Feather
                    name={SOURCE_CONFIG[r.source]?.icon as any || 'globe'}
                    size={16}
                    color={SOURCE_CONFIG[r.source]?.color || C.accent}
                  />
                </View>
                <View style={styles.resultContent}>
                  <Text style={[styles.resultTitle, { color: C.text }]} numberOfLines={1}>{r.title}</Text>
                  <View style={styles.resultMeta}>
                    <Text style={[styles.resultSource, { color: SOURCE_CONFIG[r.source]?.color }]}>
                      {SOURCE_CONFIG[r.source]?.label}
                    </Text>
                    <Text style={[styles.resultDot, { color: C.muted }]}>·</Text>
                    <Text style={[styles.resultTime, { color: C.dim }]}>{r.time}</Text>
                  </View>
                </View>
                <Feather name="chevron-right" size={16} color={C.muted} />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, paddingTop: Platform.OS === 'ios' ? 50 : 30 },
  header: { paddingHorizontal: SPACING.xl, paddingBottom: SPACING.md },
  title: { fontSize: FONT_SIZE.xxxl, fontWeight: FONT_WEIGHT.bold },
  subtitle: { fontSize: FONT_SIZE.sm, marginTop: 2 },

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    height: 46,
    borderRadius: RADIUS.lg,
    borderWidth: 1.5,
    gap: SPACING.sm,
  },
  searchInput: { flex: 1, fontSize: FONT_SIZE.base },

  filterScroll: { maxHeight: 44, marginTop: SPACING.md },
  filterContent: { paddingHorizontal: SPACING.lg, gap: SPACING.sm },
  filterChip: { paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm, borderRadius: RADIUS.round, borderWidth: 1 },
  filterText: { fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.medium },

  section: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.xl },
  sectionTitle: { fontSize: FONT_SIZE.xs, fontWeight: FONT_WEIGHT.semibold, letterSpacing: 0.8, marginBottom: SPACING.md },

  recentItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: SPACING.md, borderBottomWidth: 0.5, gap: SPACING.md },
  recentText: { flex: 1, fontSize: FONT_SIZE.base },

  suggestGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  suggestChip: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, borderRadius: RADIUS.round, borderWidth: 1 },
  suggestText: { fontSize: FONT_SIZE.sm },

  resultItem: { flexDirection: 'row', alignItems: 'center', padding: SPACING.md, borderRadius: RADIUS.lg, borderWidth: 1, marginBottom: SPACING.sm, gap: SPACING.md },
  resultIcon: { width: 40, height: 40, borderRadius: RADIUS.md, alignItems: 'center', justifyContent: 'center' },
  resultContent: { flex: 1, gap: 2 },
  resultTitle: { fontSize: FONT_SIZE.base, fontWeight: FONT_WEIGHT.semibold },
  resultMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  resultSource: { fontSize: FONT_SIZE.xs, fontWeight: FONT_WEIGHT.medium },
  resultDot: { fontSize: FONT_SIZE.xs },
  resultTime: { fontSize: FONT_SIZE.xs },
});
