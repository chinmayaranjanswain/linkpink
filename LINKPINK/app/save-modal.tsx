// LINKPINK — Save Modal (Quick Save)

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { COLORS, SPACING, FONT_SIZE, FONT_WEIGHT, RADIUS } from '../src/constants/theme';
import { Button } from '../src/components/ui/Button';

const CONTENT_TYPES = [
  { key: 'link', icon: 'link', label: 'Paste Link' },
  { key: 'text', icon: 'file-text', label: 'Save Text' },
  { key: 'image', icon: 'image', label: 'Upload Image' },
  { key: 'pdf', icon: 'file', label: 'Upload PDF' },
  { key: 'camera', icon: 'camera', label: 'AI Scan' },
];

export default function SaveModal() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState('link');
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Simulate save + AI processing
    setTimeout(() => {
      setIsSaving(false);
      router.back();
    }, 1500);
  };

  return (
    <View style={styles.container}>
      {/* Handle bar */}
      <View style={styles.handle} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="x" size={22} color={COLORS.sub} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Quick Save</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Content Type Selector */}
        <View style={styles.typeGrid}>
          {CONTENT_TYPES.map((type) => (
            <TouchableOpacity
              key={type.key}
              style={[styles.typeCard, selectedType === type.key && styles.typeCardActive]}
              onPress={() => {
                setSelectedType(type.key);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
            >
              <Feather
                name={type.icon as any}
                size={20}
                color={selectedType === type.key ? COLORS.accent : COLORS.dim}
              />
              <Text
                style={[
                  styles.typeLabel,
                  selectedType === type.key && styles.typeLabelActive,
                ]}
              >
                {type.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* URL Input */}
        {selectedType === 'link' && (
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>URL</Text>
            <View style={styles.urlInput}>
              <Feather name="link" size={16} color={COLORS.dim} />
              <TextInput
                value={url}
                onChangeText={setUrl}
                placeholder="https://..."
                placeholderTextColor={COLORS.dim}
                style={styles.textInput}
                keyboardType="url"
                autoCapitalize="none"
                selectionColor={COLORS.accent}
              />
            </View>
          </View>
        )}

        {/* Title */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Title (optional)</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="AI will generate if empty"
            placeholderTextColor={COLORS.dim}
            style={[styles.textInput, styles.standaloneInput]}
            selectionColor={COLORS.accent}
          />
        </View>

        {/* Notes */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Notes (optional)</Text>
          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder="Add personal notes..."
            placeholderTextColor={COLORS.dim}
            style={[styles.textInput, styles.standaloneInput, styles.multiline]}
            multiline
            numberOfLines={3}
            selectionColor={COLORS.accent}
          />
        </View>

        {/* AI Processing Info */}
        <View style={styles.aiInfo}>
          <Feather name="cpu" size={14} color={COLORS.accentSoft} />
          <Text style={styles.aiInfoText}>
            AI will auto-categorize, generate summary, and create searchable embeddings
          </Text>
        </View>
      </ScrollView>

      {/* Save Button */}
      <View style={styles.bottomBar}>
        <Button
          title={isSaving ? 'Saving...' : 'Save to LINKPINK'}
          onPress={handleSave}
          isLoading={isSaving}
          disabled={selectedType === 'link' && !url.trim()}
          fullWidth
          size="lg"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.elevated,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.dim,
    alignSelf: 'center',
    marginTop: SPACING.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.text,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.lg,
    gap: SPACING.xl,
  },

  // Type Grid
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  typeCard: {
    flex: 1,
    minWidth: '28%',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.sm,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  typeCardActive: {
    borderColor: COLORS.accent,
    backgroundColor: COLORS.accentMuted,
  },
  typeLabel: {
    fontSize: FONT_SIZE.xs,
    fontWeight: FONT_WEIGHT.medium,
    color: COLORS.dim,
    textAlign: 'center',
  },
  typeLabelActive: {
    color: COLORS.accentSoft,
  },

  // Inputs
  inputGroup: {
    gap: SPACING.xs,
  },
  inputLabel: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.medium,
    color: COLORS.sub,
  },
  urlInput: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
  },
  textInput: {
    flex: 1,
    color: COLORS.text,
    fontSize: FONT_SIZE.base,
    height: 44,
  },
  standaloneInput: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
  },
  multiline: {
    height: 80,
    textAlignVertical: 'top',
    paddingTop: SPACING.md,
  },

  // AI Info
  aiInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
    padding: SPACING.md,
    backgroundColor: COLORS.accentMuted,
    borderRadius: RADIUS.md,
  },
  aiInfoText: {
    flex: 1,
    fontSize: FONT_SIZE.sm,
    color: COLORS.accentSoft,
    lineHeight: 18,
  },

  // Bottom
  bottomBar: {
    padding: SPACING.lg,
    paddingBottom: 36,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
});
