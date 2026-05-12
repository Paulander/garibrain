import { Reminder } from "@/src/domain/models";
import { deleteJson, getJson, listJson, upsertJson } from "@/src/db/repositories/baseRepo";

export const reminderRepo = {
  get: (id: string) => getJson<Reminder>("reminders", id),
  list: (partnerId?: string) => listJson<Reminder>("reminders", partnerId ? "WHERE partner_id = ?" : "", partnerId ? [partnerId] : []),
  save: (reminder: Reminder) => upsertJson("reminders", reminder, { partner_id: reminder.partnerId, event_id: reminder.eventId ?? null, status: reminder.status }),
  delete: (id: string) => deleteJson("reminders", id)
};
