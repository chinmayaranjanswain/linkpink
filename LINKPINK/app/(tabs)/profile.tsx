// LINKPINK — Profile Screen with Theme Toggle

import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform, Switch,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import {
  getColors, useThemeStore, SPACING, RADIUS, FONT_SIZE, FONT_WEIGHT,
} from '../../src/constants/theme';
import { useAuthStore } from '../../src/stores/authStore';

export default function ProfileScreen() {
  const { mode, toggle: toggleTheme } = useThemeStore();
  const C = getColors(mode);
  const { user, signOut } = useAuthStore();

  const [notificationsOn, setNotificationsOn] = React.useState(true);
  const [aiProcessing, setAiProcessing] = React.useState(true);
  const [autoTag, setAutoTag] = React.useState(true);

  const handleSignOut = async () => {
    await signOut();
    router.replace('/auth');
  };

  const stats = [
    { value: '138', label: 'Saves', icon: 'bookmark' as const },
    { value: '6', label: 'Collections', icon: 'folder' as const },
    { value: '47', label: 'This Month', icon: 'calendar' as const },
  ];

  const SettingRow = ({
    icon, label, right, onPress, destructive,
  }: {
    icon: string; label: string; right?: React.ReactNode; onPress?: () => void; destructive?: boolean;
  }) => (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress && !right}
      style={[styles.settingRow, { borderBottomColor: C.border }]}
      activeOpacity={0.7}
    >
      <View style={[styles.settingIcon, { backgroundColor: destructive ? `${C.error}14` : C.accentMuted }]}>
        <Feather name={icon as any} size={16} color={destructive ? C.error : C.accent} />
      </View>
      <Text style={[styles.settingLabel, { color: destructive ? C.error : C.text }]}>{label}</Text>
      <View style={styles.settingRight}>
        {right || (onPress && <Feather name="chevron-right" size={18} color={C.muted} />)}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.root, { backgroundColor: C.bg }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <LinearGradient
            colors={[C.accent, C.gradient2 || C.accent]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.avatarGradient}
          >
            <View style={[styles.avatar, { backgroundColor: C.surface }]}>
              <Text style={[styles.avatarInitial, { color: C.accent }]}>
                {(user?.username || 'C').charAt(0).toUpperCase()}
              </Text>
            </View>
          </LinearGradient>

          <Text style={[styles.userName, { color: C.text }]}>{user?.username || 'Chinmaya'}</Text>
          <Text style={[styles.userEmail, { color: C.sub }]}>{user?.email || 'demo@linkpink.app'}</Text>

          <View style={[styles.planBadge, { borderColor: C.accent }]}>
            <Feather name="star" size={12} color={C.accent} />
            <Text style={[styles.planText, { color: C.accent }]}>Free Plan</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          {stats.map((stat) => (
            <View key={stat.label} style={[styles.statCard, { backgroundColor: C.card, borderColor: C.border }]}>
              <Feather name={stat.icon} size={16} color={C.accent} />
              <Text style={[styles.statValue, { color: C.text }]}>{stat.value}</Text>
              <Text style={[styles.statLabel, { color: C.dim }]}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* APPEARANCE */}
        <Text style={[styles.sectionLabel, { color: C.dim }]}>APPEARANCE</Text>
        <View style={[styles.settingsGroup, { backgroundColor: C.card, borderColor: C.border }]}>
          <SettingRow
            icon={mode === 'dark' ? 'moon' : 'sun'}
            label="Dark Mode"
            right={
              <Switch
                value={mode === 'dark'}
                onValueChange={toggleTheme}
                trackColor={{ false: C.muted, true: `${C.accent}55` }}
                thumbColor={mode === 'dark' ? C.accent : C.sub}
              />
            }
          />
        </View>

        {/* ACCOUNT */}
        <Text style={[styles.sectionLabel, { color: C.dim }]}>ACCOUNT</Text>
        <View style={[styles.settingsGroup, { backgroundColor: C.card, borderColor: C.border }]}>
          <SettingRow icon="user" label="Edit Profile" onPress={() => {}} />
          <SettingRow icon="credit-card" label="Subscription" onPress={() => {}}
            right={<Text style={[styles.settingMeta, { color: C.dim }]}>Free</Text>}
          />
          <SettingRow icon="link" label="Instagram Bot" onPress={() => {}}
            right={<Text style={[styles.settingMeta, { color: C.success }]}>Connected</Text>}
          />
          <SettingRow icon="download" label="Export Data" onPress={() => {}} />
        </View>

        {/* PREFERENCES */}
        <Text style={[styles.sectionLabel, { color: C.dim }]}>PREFERENCES</Text>
        <View style={[styles.settingsGroup, { backgroundColor: C.card, borderColor: C.border }]}>
          <SettingRow
            icon="bell"
            label="Notifications"
            right={
              <Switch
                value={notificationsOn}
                onValueChange={setNotificationsOn}
                trackColor={{ false: C.muted, true: `${C.accent}55` }}
                thumbColor={notificationsOn ? C.accent : C.sub}
              />
            }
          />
          <SettingRow
            icon="cpu"
            label="AI Processing"
            right={
              <Switch
                value={aiProcessing}
                onValueChange={setAiProcessing}
                trackColor={{ false: C.muted, true: `${C.accent}55` }}
                thumbColor={aiProcessing ? C.accent : C.sub}
              />
            }
          />
          <SettingRow
            icon="tag"
            label="Auto-Tag Content"
            right={
              <Switch
                value={autoTag}
                onValueChange={setAutoTag}
                trackColor={{ false: C.muted, true: `${C.accent}55` }}
                thumbColor={autoTag ? C.accent : C.sub}
              />
            }
          />
        </View>

        {/* SUPPORT */}
        <Text style={[styles.sectionLabel, { color: C.dim }]}>SUPPORT</Text>
        <View style={[styles.settingsGroup, { backgroundColor: C.card, borderColor: C.border }]}>
          <SettingRow icon="help-circle" label="Help & FAQ" onPress={() => {}} />
          <SettingRow icon="message-circle" label="Send Feedback" onPress={() => {}} />
          <SettingRow icon="shield" label="Privacy Policy" onPress={() => {}} />
        </View>

        {/* DANGER */}
        <View style={[styles.settingsGroup, { backgroundColor: C.card, borderColor: C.border, marginTop: SPACING.xl }]}>
          <SettingRow icon="log-out" label="Sign Out" onPress={handleSignOut} destructive />
        </View>

        <Text style={[styles.version, { color: C.muted }]}>LINKPINK v1.0.0 · Build 42</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
  },

  profileHeader: {
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
    gap: SPACING.sm,
  },
  avatarGradient: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontSize: FONT_SIZE.xxxl,
    fontWeight: FONT_WEIGHT.bold,
  },
  userName: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: FONT_WEIGHT.bold,
  },
  userEmail: {
    fontSize: FONT_SIZE.sm,
  },
  planBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderRadius: RADIUS.round,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    marginTop: SPACING.xs,
  },
  planText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.semibold,
  },

  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
    marginBottom: SPACING.xl,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SPACING.lg,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    gap: 4,
  },
  statValue: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: FONT_WEIGHT.bold,
  },
  statLabel: {
    fontSize: FONT_SIZE.xs,
  },

  sectionLabel: {
    fontSize: FONT_SIZE.xs,
    fontWeight: FONT_WEIGHT.semibold,
    letterSpacing: 0.8,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.sm,
  },
  settingsGroup: {
    marginHorizontal: SPACING.lg,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    overflow: 'hidden',
  },

  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 0.5,
    gap: SPACING.md,
  },
  settingIcon: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingLabel: {
    flex: 1,
    fontSize: FONT_SIZE.base,
    fontWeight: FONT_WEIGHT.medium,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingMeta: {
    fontSize: FONT_SIZE.sm,
    marginRight: 4,
  },

  version: {
    textAlign: 'center',
    fontSize: FONT_SIZE.xs,
    marginTop: SPACING.xxl,
    paddingBottom: SPACING.xxxl,
  },
});
