// LINKPINK — Save Detail Screen

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { COLORS, SPACING, FONT_SIZE, FONT_WEIGHT, RADIUS, SOURCE_CONFIG } from '../src/constants/theme';

export default function SaveDetailScreen() {
  const router = useRouter();
  const { saveId } = useLocalSearchParams<{ saveId: string }>();

  // Mock data — would fetch from store in production
  const save = {
    id: saveId,
    title: 'Building AI Agents with LangChain',
    source: 'youtube',
    type: 'video',
    url: 'https://youtube.com/watch?v=abc123',
    summary: 'Comprehensive tutorial on building production-ready AI agents using the LangChain framework. Covers ReAct pattern, tool usage, memory management, and deployment strategies.',
    content: 'Full transcript of the video would appear here after Whisper processing...',
    created_at: new Date(Date.now() - 2 * 3600000).toISOString(),
    language: 'en',
    ai_category: {
      main_category: 'AI',
      subcategories: ['Agents', 'LangChain', 'Programming'],
      confidence: 0.94,
    },
    processing_status: 'completed',
    tags: ['AI', 'LangChain', 'Agents', 'Tutorial'],
  };

  const sourceConfig = SOURCE_CONFIG[save.source] || SOURCE_CONFIG.web;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color={COLORS.text} />
        </TouchableOpacity>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerBtn}>
            <Feather name="bookmark" size={18} color={COLORS.accent} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerBtn}>
            <Feather name="share-2" size={18} color={COLORS.sub} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerBtn}>
            <Feather name="more-horizontal" size={18} color={COLORS.sub} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Source Badge */}
        <View style={styles.sourceBadge}>
          <View style={[styles.sourceDot, { backgroundColor: sourceConfig.color }]} />
          <Text style={styles.sourceLabel}>{sourceConfig.label}</Text>
          <Text style={styles.sourceType}>{save.type}</Text>
        </View>

        {/* Title */}
        <Text style={styles.title}>{save.title}</Text>

        {/* Meta */}
        <View style={styles.metaRow}>
          <Feather name="clock" size={13} color={COLORS.dim} />
          <Text style={styles.metaText}>Saved 2 hours ago</Text>
          <Text style={styles.metaDot}>·</Text>
          <Text style={styles.metaText}>{save.language.toUpperCase()}</Text>
        </View>

        {/* AI Category */}
        <View style={styles.categorySection}>
          <View style={styles.sectionHeader}>
            <Feather name="cpu" size={14} color={COLORS.accentSoft} />
            <Text style={styles.sectionTitle}>AI Classification</Text>
            <Text style={styles.confidence}>
              {Math.round(save.ai_category.confidence * 100)}% confidence
            </Text>
          </View>
          <View style={styles.tagsRow}>
            <View style={styles.mainTag}>
              <Text style={styles.mainTagText}>{save.ai_category.main_category}</Text>
            </View>
            {save.ai_category.subcategories.map((sub, i) => (
              <View key={i} style={styles.subTag}>
                <Text style={styles.subTagText}>{sub}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Summary */}
        <View style={styles.summarySection}>
          <View style={styles.sectionHeader}>
            <Feather name="align-left" size={14} color={COLORS.sub} />
            <Text style={styles.sectionTitle}>AI Summary</Text>
          </View>
          <Text style={styles.summaryText}>{save.summary}</Text>
        </View>

        {/* Tags */}
        <View style={styles.tagsSection}>
          <View style={styles.sectionHeader}>
            <Feather name="tag" size={14} color={COLORS.sub} />
            <Text style={styles.sectionTitle}>Tags</Text>
          </View>
          <View style={styles.tagsRow}>
            {save.tags.map((tag, i) => (
              <View key={i} style={styles.hashTag}>
                <Text style={styles.hashTagText}>#{tag}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actionsSection}>
          {save.url && (
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => Linking.openURL(save.url!)}
            >
              <Feather name="external-link" size={18} color={COLORS.accent} />
              <Text style={styles.actionText}>Open Original</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.actionBtn}>
            <Feather name="folder-plus" size={18} color={COLORS.sub} />
            <Text style={styles.actionText}>Add to Collection</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <Feather name="bell" size={18} color={COLORS.sub} />
            <Text style={styles.actionText}>Set Reminder</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, styles.actionDanger]}>
            <Feather name="trash-2" size={18} color={COLORS.error} />
            <Text style={[styles.actionText, styles.actionDangerText]}>Delete</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingTop: 56,
    paddingBottom: SPACING.md,
  },
  headerBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    gap: SPACING.xs,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: 120,
    gap: SPACING.xl,
  },

  // Source
  sourceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  sourceDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  sourceLabel: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.sub,
  },
  sourceType: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.dim,
    textTransform: 'uppercase',
  },

  // Title
  title: {
    fontSize: FONT_SIZE.xxl + 2,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.text,
    lineHeight: 30,
    letterSpacing: -0.3,
  },

  // Meta
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  metaText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.dim,
  },
  metaDot: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.dim,
  },

  // Category
  categorySection: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.lg,
    gap: SPACING.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  sectionTitle: {
    flex: 1,
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.sub,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  confidence: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.success,
    fontWeight: FONT_WEIGHT.medium,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  mainTag: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 1,
    borderRadius: RADIUS.round,
    backgroundColor: COLORS.accentMuted,
  },
  mainTagText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.accentSoft,
  },
  subTag: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 1,
    borderRadius: RADIUS.round,
    backgroundColor: COLORS.hover,
  },
  subTagText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.sub,
  },

  // Summary
  summarySection: {
    gap: SPACING.md,
  },
  summaryText: {
    fontSize: FONT_SIZE.base,
    color: COLORS.text,
    lineHeight: 22,
  },

  // Tags
  tagsSection: {
    gap: SPACING.md,
  },
  hashTag: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 1,
    borderRadius: RADIUS.round,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  hashTagText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.sub,
  },

  // Actions
  actionsSection: {
    gap: SPACING.sm,
    marginTop: SPACING.md,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    paddingVertical: SPACING.md + 2,
    paddingHorizontal: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  actionText: {
    fontSize: FONT_SIZE.base,
    color: COLORS.text,
  },
  actionDanger: {
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  actionDangerText: {
    color: COLORS.error,
  },
});
