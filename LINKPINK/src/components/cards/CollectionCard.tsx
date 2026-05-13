// LINKPINK — CollectionCard Component

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS, RADIUS, FONT_SIZE, FONT_WEIGHT, SPACING } from '../../constants/theme';
import type { Collection } from '../../types';

interface CollectionCardProps {
  collection: Collection;
  onPress: (collection: Collection) => void;
}

export function CollectionCard({ collection, onPress }: CollectionCardProps) {
  return (
    <TouchableOpacity
      onPress={() => onPress(collection)}
      activeOpacity={0.7}
      style={styles.container}
    >
      <View style={[styles.iconWrap, { backgroundColor: `${collection.color}20` }]}>
        <Text style={styles.iconText}>{collection.icon}</Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.name} numberOfLines={1}>{collection.name}</Text>
        <Text style={styles.count}>{collection.save_count} saves</Text>
      </View>
      <Feather name="chevron-right" size={16} color={COLORS.dim} />
    </TouchableOpacity>
  );
}

// Grid variant for collections overview
export function CollectionGridCard({ collection, onPress }: CollectionCardProps) {
  return (
    <TouchableOpacity
      onPress={() => onPress(collection)}
      activeOpacity={0.7}
      style={styles.gridContainer}
    >
      <View style={[styles.gridIconWrap, { backgroundColor: `${collection.color}15` }]}>
        <Text style={styles.gridIcon}>{collection.icon}</Text>
      </View>
      <Text style={styles.gridName} numberOfLines={1}>{collection.name}</Text>
      <Text style={styles.gridCount}>{collection.save_count} saves</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  // List variant
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 18,
  },
  body: {
    flex: 1,
  },
  name: {
    fontSize: FONT_SIZE.base,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.text,
  },
  count: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.sub,
    marginTop: 1,
  },

  // Grid variant
  gridContainer: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.lg,
    gap: SPACING.sm,
    minWidth: 140,
  },
  gridIconWrap: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridIcon: {
    fontSize: 22,
  },
  gridName: {
    fontSize: FONT_SIZE.base,
    fontWeight: FONT_WEIGHT.semibold,
    color: COLORS.text,
    marginTop: SPACING.xs,
  },
  gridCount: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.sub,
  },
});
