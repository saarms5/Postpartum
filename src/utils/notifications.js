import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure notification handler
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

/**
 * Request notification permissions
 */
export const requestNotificationPermissions = async () => {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    if (finalStatus !== 'granted') {
        console.warn('Notification permissions not granted');
        return false;
    }

    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#6B9BD1',
        });
    }

    return true;
};

/**
 * Cancel all scheduled notifications
 */
export const cancelAllNotifications = async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();
};

/**
 * Schedule wake window warning notification (15 min before max)
 */
export const scheduleWakeWindowWarning = async (wakeTime, warningMinutes) => {
    const trigger = new Date(wakeTime);
    trigger.setMinutes(trigger.getMinutes() + warningMinutes);

    await Notifications.scheduleNotificationAsync({
        content: {
            title: '⏰ Wake Window Ending Soon',
            body: `Baby has been up for ${warningMinutes} mins. Look for sleepy cues (staring off, rubbing eyes). Start wind-down routine now.`,
            sound: true,
            priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger,
    });
};

/**
 * Schedule wake window urgent notification (at max window)
 */
export const scheduleWakeWindowUrgent = async (wakeTime, maxMinutes) => {
    const trigger = new Date(wakeTime);
    trigger.setMinutes(trigger.getMinutes() + maxMinutes);

    await Notifications.scheduleNotificationAsync({
        content: {
            title: '🚨 Max Wake Window Reached',
            body: 'Sleep pressure is high. Offer a nap immediately to avoid overtiredness.',
            sound: true,
            priority: Notifications.AndroidNotificationPriority.MAX,
        },
        trigger,
    });
};

/**
 * Schedule feeding reminder
 */
export const scheduleFeedingReminder = async (lastFeedTime, intervalHours) => {
    const trigger = new Date(lastFeedTime);
    trigger.setHours(trigger.getHours() + intervalHours);

    await Notifications.scheduleNotificationAsync({
        content: {
            title: '🍼 Feeding Time',
            body: `It's been ${intervalHours} hours since the last feed. Time to offer a feeding.`,
            sound: true,
            priority: Notifications.AndroidNotificationPriority.DEFAULT,
        },
        trigger,
    });
};

/**
 * Schedule daily Vitamin D reminder (9:00 AM)
 */
export const scheduleDailyVitaminDReminder = async () => {
    await Notifications.scheduleNotificationAsync({
        content: {
            title: '💊 Vitamin D Time',
            body: 'Time for the daily Vitamin D drop.',
            sound: true,
        },
        trigger: {
            hour: 9,
            minute: 0,
            repeats: true,
        },
    });
};

/**
 * Schedule safe sleep audit reminder (every 3 days)
 */
export const scheduleSafeSleepReminder = async () => {
    await Notifications.scheduleNotificationAsync({
        content: {
            title: '🛏️ Safe Sleep Check',
            body: 'Quick check: Crib should be empty. No blankets, no bumpers, no toys. Just baby on their back.',
            sound: false,
        },
        trigger: {
            seconds: 3 * 24 * 60 * 60, // 3 days
            repeats: true,
        },
    });
};

/**
 * Send immediate notification (for emergencies/alerts)
 */
export const sendImmediateNotification = async (title, body, priority = 'high') => {
    await Notifications.scheduleNotificationAsync({
        content: {
            title,
            body,
            sound: true,
            priority: priority === 'max'
                ? Notifications.AndroidNotificationPriority.MAX
                : Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: null, // Send immediately
    });
};

/**
 * Setup all wake window notifications
 */
export const setupWakeWindowNotifications = async (wakeTime, warningMinutes, maxMinutes) => {
    // Cancel existing wake window notifications
    await cancelAllNotifications();

    // Schedule new ones
    await scheduleWakeWindowWarning(wakeTime, warningMinutes);
    await scheduleWakeWindowUrgent(wakeTime, maxMinutes);
};
