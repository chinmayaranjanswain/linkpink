// LINKPINK — Collections Screen (Premium + Theme-aware)

import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform,
  Modal, TextInput,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import {
  getColors, useThemeStore, SPACING, RADIUS, FONT_SIZE, FONT_WEIGHT,
} from '../../src/constants/theme';

const MOCK_COLLECTIONS = [
  { id: '1', name: 'AI & Machine Learning', icon: '🤖', color: '#8B5CF6', saves: 23 },
  { id: '2', name: 'React Ecosystem', icon: '⚛️', color: '#3B82F6', saves: 15 },
  { id: '3', name: 'Startup Playbook', icon: '🚀', color: '#F59E0B', saves: 31 },
  { id: '4', name: 'Design Vault', icon: '🎨', color: '#EC4899', saves: 18 },
  { id: '5', name: 'Study Notes', icon: '📚', color: '#10B981', saves: 42 },
  { id: '6', name: 'Finance & Crypto', icon: '💰', color: '#14B8A6', saves: 9 },
];

export default function CollectionsScreen() {
  const { mode } = useThemeStore();
  const C = getColors(mode);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const totalSaves = MOCK_COLLECTIONS.reduce((a, c) => a + c.saves, 0);

  return (
    <View style={[styles.root, { backgroundColor: C.bg }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.title, { color: C.text }]}>Collections</Text>
            <Text style={[styles.subtitle, { color: C.dim }]}>
              {MOCK_COLLECTIONS.length} collections · {totalSaves} saves
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.addBtn, { backgroundColor: C.accent }]}
            onPress={() => setShowCreate(true)}
          >
            <Feather name="plus" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          {[
            { icon: 'bookmark', value: totalSaves.toString(), label: 'Total Saves', color: C.accent },
            { icon: 'zap', value: '12', label: 'This Week', color: C.warning },
            { icon: 'cpu', value: '98%', label: 'AI Processed', color: C.success },
          ].map((stat) => (
            <View key={stat.label} style={[styles.statCard, { backgroundColor: C.card, borderColor: C.border }]}>
              <Feather name={stat.icon as any} size={18} color={stat.color} />
              <Text style={[styles.statValue, { color: C.text }]}>{stat.value}</Text>
              <Text style={[styles.statLabel, { color: C.dim }]}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Collection Grid */}
        <Text style={[styles.sectionLabel, { color: C.dim }]}>YOUR COLLECTIONS</Text>
        <View style={styles.grid}>
          {MOCK_COLLECTIONS.map((col) => (
            <TouchableOpacity
              key={col.id}
              style={[styles.colCard, { backgroundColor: C.card, borderColor: C.border }]}
              activeOpacity={0.7}
            >
              <View style={[styles.colIcon, { backgroundColor: `${col.color}18` }]}>
                <Text style={{ fontSize: 24 }}>{col.icon}</Text>
              </View>
              <Text style={[styles.colName, { color: C.text }]} numberOfLines={1}>{col.name}</Text>
              <Text style={[styles.colCount, { color: C.dim }]}>{col.saves} saves</Text>

              {/* Progress bar */}
              <View style={[styles.progressBg, { backgroundColor: C.border }]}>
                <View
                  style={[styles.progressFill, { backgroundColor: col.color, width: `${Math.min((col.saves / 50) * 100, 100)}%` }]}
                />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Create Modal */}
      <Modal visible={showCreate} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setShowCreate(false)} activeOpacity={1}>
          <View style={[styles.modalContent, { backgroundColor: C.surface }]}>
            <Text style={[styles.modalTitle, { color: C.text }]}>New Collection</Text>
            <TextInput
              style={[styles.modalInput, { backgroundColor: C.elevated, borderColor: C.border, color: C.text }]}
              placeholder="Collection name..."
              placeholderTextColor={C.dim}
              value={newName}
              onChangeText={setNewName}
              autoFocus
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: C.elevated }]}
                onPress={() => setShowCreate(false)}
              >
                <Text style={[styles.modalBtnText, { color: C.sub }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: C.accent }]}
                onPress={() => { setShowCreate(false); setNewName(''); }}
              >
                <Text style={[styles.modalBtnText, { color: '#FFF' }]}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, paddingTop: Platform.OS === 'ios' ? 50 : 30 },

  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: SPACING.xl, paddingBottom: SPACING.md,
  },
  title: { fontSize: FONT_SIZE.xxxl, fontWeight: FONT_WEIGHT.bold },
  subtitle: { fontSize: FONT_SIZE.sm, marginTop: 2 },
  addBtn: { width: 40, height: 40, borderRadius: RADIUS.round, alignItems: 'center', justifyContent: 'center' },

  statsRow: { flexDirection: 'row', paddingHorizontal: SPACING.lg, gap: SPACING.sm, marginBottom: SPACING.lg },
  statCard: {
    flex: 1, alignItems: 'center', paddingVertical: SPACING.lg,
    borderRadius: RADIUS.lg, borderWidth: 1, gap: 4,
  },
  statValue: { fontSize: FONT_SIZE.xxl, fontWeight: FONT_WEIGHT.bold },
  statLabel: { fontSize: FONT_SIZE.xs },

  sectionLabel: { fontSize: FONT_SIZE.xs, fontWeight: FONT_WEIGHT.semibold, letterSpacing: 0.8, paddingHorizontal: SPACING.xl, marginBottom: SPACING.md },

  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: SPACING.lg, gap: SPACING.sm },
  colCard: {
    width: '31%',
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    gap: SPACING.sm,
    minWidth: 100,
    flexGrow: 1,
  },
  colIcon: { width: 44, height: 44, borderRadius: RADIUS.md, alignItems: 'center', justifyContent: 'center' },
  colName: { fontSize: FONT_SIZE.sm, fontWeight: FONT_WEIGHT.semibold },
  colCount: { fontSize: FONT_SIZE.xs },

  progressBg: { height: 3, borderRadius: 2, marginTop: 2 },
  progressFill: { height: 3, borderRadius: 2 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '85%', borderRadius: RADIUS.xl, padding: SPACING.xl, gap: SPACING.lg },
  modalTitle: { fontSize: FONT_SIZE.xl, fontWeight: FONT_WEIGHT.bold },
  modalInput: { height: 46, borderRadius: RADIUS.md, borderWidth: 1, paddingHorizontal: SPACING.lg, fontSize: FONT_SIZE.base },
  modalActions: { flexDirection: 'row', gap: SPACING.sm },
  modalBtn: { flex: 1, height: 42, borderRadius: RADIUS.md, alignItems: 'center', justifyContent: 'center' },
  modalBtnText: { fontSize: FONT_SIZE.base, fontWeight: FONT_WEIGHT.semibold },
});
