import { NotificationPrivacy, Reminder } from "@/src/domain/models";

export function notificationPayload(
  privacy: NotificationPrivacy,
  reminder: Pick<Reminder, "title" | "body">
): { title: string; body?: string; shouldSchedule: boolean } {
  if (privacy === "silent") {
    return { title: "", shouldSchedule: false };
  }
  if (privacy === "minimal") {
    return { title: "Reminder.", shouldSchedule: true };
  }
  if (privacy === "neutral") {
    return { title: "Important reminder.", body: "Check PartnerOps.", shouldSchedule: true };
  }
  return { title: reminder.title, body: reminder.body, shouldSchedule: true };
}

export function supportNotificationPayload(privacy: NotificationPrivacy): { title: string; body?: string; shouldSchedule: boolean } {
  if (privacy === "silent") return { title: "", shouldSchedule: false };
  if (privacy === "minimal") return { title: "Reminder.", shouldSchedule: true };
  return { title: "Care reminder.", body: privacy === "full" ? "Support window reminder. Check saved actions in PartnerOps." : "Check PartnerOps.", shouldSchedule: true };
}
