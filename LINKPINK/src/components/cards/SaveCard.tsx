// LINKPINK — SaveCard Component

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { COLORS, RADIUS, FONT_SIZE, FONT_WEIGHT, SPACING, SOURCE_CONFIG } from '../../constants/theme';
import type { Save } from '../../types';

interface SaveCardProps {
  save: Save;
  onPress: (save: Save) => void;
  onLongPress?: (save: Save) => void;
  compact?: boolean;
}

export function SaveCard({ save, onPress, onLongPress, compact = false }: SaveCardProps) {
  const sourceConfig = SOURCE_CONFIG[save.source] || SOURCE_CONFIG.web;
  const timeAgo = getTimeAgo(save.created_at);

  const handleLongPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onLongPress?.(save);
  };

  return (
    <TouchableOpacity
      onPress={() => onPress(save)}
      onLongPress={handleLongPress}
      activeOpacity={0.7}
      style={[styles.container, save.is_pinned && styles.pinned]}
    >
      {/* Thumbnail */}
      <View style={styles.thumbWrap}>
        {save.thumbnail_url ? (
          <Image source={{ uri: save.thumbnail_url }} style={styles.thumb} />
        ) : (
          <View style={[styles.thumbPlaceholder, { backgroundColor: `${sourceConfig.color}15` }]}>
            <Feather
              name={getTypeIcon(save.type)}
              size={18}
              color={sourceConfig.color}
            />
          </View>
        )}
        {/* Source indicator */}
        <View style={styles.sourceIndicator}>
          <View style={[styles.sourceDot, { backgroundColor: sourceConfig.color }]} />
        </View>
      </View>

      {/* Body */}
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={1}>
          {save.title || 'Untitled Save'}
        </Text>
        <View style={styles.meta}>
          <Text style={styles.sub} numberOfLines={1}>
            {sourceConfig.label}
            {save.summary ? ` · ${save.summary}` : ''}
          </Text>
          {save.ai_category && (
            <View style={styles.tag}>
              <Text style={styles.tagText}>{save.ai_category.main_category}</Text>
            </View>
          )}
        </View>
      </View>

      {/* Time + Status */}
      <View style={styles.rightCol}>
        <Text style={styles.time}>{timeAgo}</Text>
        {save.processing_status === 'processing' && (
          <View style={styles.processingDot} />
        )}
        {save.is_pinned && (
          <Feather name="bookmark" size={12} color={COLORS.accent} />
        )}
      </View>
    </TouchableOpacity>
  );
}

function getTypeIcon(type: string): any {
  const map: Record<string, string> = {
    link: 'link',
    image: 'image',
    video: 'play-circle',
    text: 'file-text',
    pdf: 'file',
    document: 'file',
    reel: 'film',
  };
  return map[type] || 'link';
}

function getTimeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  const weeks = Math.floor(days / 7);
  return `${weeks}w`;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.sm,
    borderRadius: RADIUS.md,
  },
  pinned: {
    backgroundColor: COLORS.surface,
  },
  thumbWrap: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    position: 'relative',
  },
  thumb: {
    width: '100%',
    height: '100%',
  },
  thumbPlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADIUS.md,
  },
  sourceIndicator: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.bg,
    borderWidth: 1.5,
    borderColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sourceDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  body: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.text,
    lineHeight: 18,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs + 2,
    marginTop: 2,
  },
  sub: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.sub,
    flex: 1,
  },
  tag: {
    backgroundColor: COLORS.accentMuted,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: RADIUS.xs,
  },
  tagText: {
    fontSize: FONT_SIZE.xs - 1,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.accentSoft,
  },
  rightCol: {
    alignItems: 'flex-end',
    gap: 4,
  },
  time: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.dim,
  },
  processingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.warning,
  },
});
