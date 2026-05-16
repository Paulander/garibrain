import { RelationshipEvent } from "@/src/domain/models";
import { customOccurrenceForYear } from "@/src/domain/recurrence";
import { id, nowUtcISO, parseISODate } from "@/src/utils/dates";

export interface HolidayPreset {
  key: string;
  title: string;
  eventType: RelationshipEvent["eventType"];
  month?: number;
  day?: number;
  recurrence: RelationshipEvent["recurrence"];
  recurrenceRule?: string;
  leadTimeDays: number[];
  notes: string;
}

export const holidayPresets: HolidayPreset[] = [
  {
    key: "valentines-day",
    title: "Valentine's Day",
    eventType: "valentines_day",
    month: 2,
    day: 14,
    recurrence: "yearly",
    leadTimeDays: [30, 14, 7, 1],
    notes: "Typical gift/date planning holiday."
  },
  {
    key: "christmas-eve",
    title: "Christmas Eve",
    eventType: "custom",
    month: 12,
    day: 24,
    recurrence: "yearly",
    leadTimeDays: [45, 30, 14, 7],
    notes: "Useful in Sweden and much of the Nordics; remove if not relevant."
  },
  {
    key: "christmas-day",
    title: "Christmas Day",
    eventType: "custom",
    month: 12,
    day: 25,
    recurrence: "yearly",
    leadTimeDays: [45, 30, 14, 7],
    notes: "Common gift/family planning holiday."
  },
  {
    key: "new-years-eve",
    title: "New Year's Eve",
    eventType: "custom",
    month: 12,
    day: 31,
    recurrence: "yearly",
    leadTimeDays: [30, 14, 7, 1],
    notes: "Good for date-night or travel planning."
  },
  {
    key: "mothers-day-us",
    title: "Mother's Day (US)",
    eventType: "mothers_day",
    recurrence: "custom",
    recurrenceRule: "US_MOTHERS_DAY_SECOND_SUNDAY_MAY",
    leadTimeDays: [30, 14, 7, 1],
    notes: "Second Sunday in May. Use this if her family follows the US date."
  },
  {
    key: "mothers-day-sweden",
    title: "Mother's Day (Sweden)",
    eventType: "mothers_day",
    recurrence: "custom",
    recurrenceRule: "SE_MOTHERS_DAY_LAST_SUNDAY_MAY",
    leadTimeDays: [30, 14, 7, 1],
    notes: "Last Sunday in May. Use this if her family follows the Swedish date."
  }
];

export const defaultSuggestedHolidayKeys = new Set([
  "valentines-day",
  "christmas-eve",
  "christmas-day",
  "new-years-eve",
  "mothers-day-sweden"
]);

export function buildHolidayEvent(preset: HolidayPreset, partnerId: string, todayIso: string): RelationshipEvent {
  const now = nowUtcISO();
  return {
    id: id("event"),
    partnerId,
    title: preset.title,
    eventType: preset.eventType,
    date: dateForPreset(preset, todayIso),
    recurrence: preset.recurrence,
    recurrenceRule: preset.recurrenceRule,
    leadTimeDays: preset.leadTimeDays,
    notes: preset.notes,
    linkedPreferenceIds: [],
    isSensitive: false,
    createdAt: now,
    updatedAt: now
  };
}

export function missingHolidayPresets(events: RelationshipEvent[]): HolidayPreset[] {
  return holidayPresets.filter((preset) => !events.some((event) => (
    event.recurrenceRule === preset.recurrenceRule ||
    event.title.toLowerCase() === preset.title.toLowerCase() ||
    (event.eventType === preset.eventType && preset.eventType !== "custom")
  )));
}

export function missingDefaultHolidayPresets(events: RelationshipEvent[]): HolidayPreset[] {
  return missingHolidayPresets(events).filter((preset) => defaultSuggestedHolidayKeys.has(preset.key));
}

function dateForPreset(preset: HolidayPreset, todayIso: string): string {
  const year = parseISODate(todayIso).getUTCFullYear();
  if (preset.recurrenceRule) {
    return customOccurrenceForYear(preset.recurrenceRule, year) ?? todayIso;
  }
  const month = String(preset.month).padStart(2, "0");
  const day = String(preset.day).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
