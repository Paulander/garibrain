import * as Notifications from "expo-notifications";
import { Reminder, UserSettings } from "@/src/domain/models";
import { notificationPayload } from "@/src/domain/notificationText";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true
  })
});

export async function ensureNotificationPermission(): Promise<boolean> {
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  const requested = await Notifications.requestPermissionsAsync();
  return requested.granted;
}

export async function scheduleReminderNotification(reminder: Reminder, settings: UserSettings): Promise<string | undefined> {
  const privacy = reminder.notificationPrivacy ?? settings.notificationPrivacy;
  const payload = notificationPayload(privacy, reminder);
  if (!payload.shouldSchedule) return undefined;
  const allowed = await ensureNotificationPermission();
  if (!allowed) return undefined;

  return Notifications.scheduleNotificationAsync({
    content: {
      title: payload.title,
      body: payload.body
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: new Date(reminder.dueAt)
    }
  });
}

export async function cancelReminderNotification(notificationId?: string): Promise<void> {
  if (notificationId) {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  }
}
