// LINKPINK — Notification Service

import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { supabase, isSupabaseConfigured } from '../api/supabase';

// Configure notification handling
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    priority: Notifications.AndroidNotificationPriority.HIGH,
  }),
});

export const notificationService = {
  // Register for push notifications
  async registerForPushNotifications(): Promise<string | null> {
    if (!Device.isDevice) {
      console.log('Push notifications require a physical device');
      return null;
    }

    // Check existing permissions
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Notification permission not granted');
      return null;
    }

    // Get push token
    const tokenData = await Notifications.getExpoPushTokenAsync({
      projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
    });

    const token = tokenData.data;

    // Store token in backend
    if (isSupabaseConfigured()) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('push_tokens')
          .upsert({
            user_id: user.id,
            token,
            platform: Platform.OS,
          });
      }
    }

    // Android notification channel
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'LINKPINK',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#5865F2',
      });

      await Notifications.setNotificationChannelAsync('processing', {
        name: 'AI Processing',
        importance: Notifications.AndroidImportance.DEFAULT,
        description: 'Updates when AI finishes processing your saves',
      });

      await Notifications.setNotificationChannelAsync('reminders', {
        name: 'Reminders',
        importance: Notifications.AndroidImportance.HIGH,
        description: 'Content review reminders',
      });
    }

    return token;
  },

  // Schedule a local reminder notification
  async scheduleReminder(saveId: string, title: string, scheduledTime: Date) {
    const trigger = {
      type: 'date' as const,
      date: scheduledTime,
    };

    await Notifications.scheduleNotificationAsync({
      content: {
        title: '📌 Content Reminder',
        body: `Review: ${title}`,
        data: { saveId, type: 'reminder' },
        sound: true,
      },
      trigger,
    });
  },

  // Send a local "processing complete" notification
  async notifyProcessingComplete(saveTitle: string, category: string) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '✨ AI Processing Complete',
        body: `"${saveTitle}" has been categorized as ${category}`,
        data: { type: 'processing_complete' },
        categoryIdentifier: 'processing',
      },
      trigger: null, // Immediate
    });
  },

  // Listen for notification interactions
  addNotificationResponseListener(
    handler: (response: Notifications.NotificationResponse) => void
  ) {
    return Notifications.addNotificationResponseReceivedListener(handler);
  },

  // Listen for incoming notifications while app is open
  addNotificationReceivedListener(
    handler: (notification: Notifications.Notification) => void
  ) {
    return Notifications.addNotificationReceivedListener(handler);
  },

  // Get badge count
  async getBadgeCount(): Promise<number> {
    return await Notifications.getBadgeCountAsync();
  },

  // Set badge count
  async setBadgeCount(count: number) {
    await Notifications.setBadgeCountAsync(count);
  },

  // Cancel all scheduled notifications
  async cancelAll() {
    await Notifications.cancelAllScheduledNotificationsAsync();
  },
};
