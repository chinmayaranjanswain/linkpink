// LINKPINK — Tab Navigator Layout (Fixed Bottom Bar)

import React from 'react';
import { Tabs } from 'expo-router';
import { View, StyleSheet, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { getColors, useThemeStore, RADIUS } from '../../src/constants/theme';

const TAB_BAR_HEIGHT = Platform.OS === 'ios' ? 88 : 68;
export const TAB_BAR_TOTAL = TAB_BAR_HEIGHT;

export default function TabLayout() {
  const { mode } = useThemeStore();
  const C = getColors(mode);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: C.accent,
        tabBarInactiveTintColor: C.dim,
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          letterSpacing: 0.3,
          marginTop: 2,
          marginBottom: Platform.OS === 'ios' ? 0 : 6,
        },
        tabBarItemStyle: {
          paddingTop: 6,
        },
        tabBarStyle: {
          backgroundColor: C.surface,
          borderTopColor: C.border,
          borderTopWidth: 1,
          height: TAB_BAR_HEIGHT,
          paddingBottom: Platform.OS === 'ios' ? 24 : 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? [styles.iconPill, { backgroundColor: `${C.accent}18` }] : styles.iconWrap}>
              <Feather name="home" size={20} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? [styles.iconPill, { backgroundColor: `${C.accent}18` }] : styles.iconWrap}>
              <Feather name="search" size={20} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="collections"
        options={{
          title: 'Collections',
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? [styles.iconPill, { backgroundColor: `${C.accent}18` }] : styles.iconWrap}>
              <Feather name="folder" size={20} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? [styles.iconPill, { backgroundColor: `${C.accent}18` }] : styles.iconWrap}>
              <Feather name="user" size={20} color={color} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconPill: {
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: RADIUS.round,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
});
