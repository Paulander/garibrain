import { RelationshipEvent } from "@/src/domain/models";
import { addDaysISO, addMonthsISO, daysBetween, formatISODate, nextYearlyOccurrence, parseISODate } from "@/src/utils/dates";

export function nextEventOccurrence(event: RelationshipEvent, fromDate: string): string {
  if (event.recurrence === "custom" && event.recurrenceRule) {
    return nextCustomOccurrence(event.recurrenceRule, fromDate) ?? event.date;
  }
  if (event.recurrence === "none" || event.recurrence === "custom") return event.date;
  if (event.recurrence === "yearly") return nextYearlyOccurrence(event.date, fromDate);

  let candidate = event.date;
  const bump = event.recurrence === "weekly"
    ? (date: string) => addDaysISO(date, 7)
    : (date: string) => addMonthsISO(date, 1);

  while (candidate < fromDate) {
    candidate = bump(candidate);
  }
  return candidate;
}

export function nextCustomOccurrence(rule: string, fromDate: string): string | undefined {
  const year = parseISODate(fromDate).getUTCFullYear();
  const current = customOccurrenceForYear(rule, year);
  if (current && current >= fromDate) return current;
  return customOccurrenceForYear(rule, year + 1);
}

export function customOccurrenceForYear(rule: string, year: number): string | undefined {
  if (rule === "US_MOTHERS_DAY_SECOND_SUNDAY_MAY") return nthWeekdayOfMonth(year, 4, 0, 2);
  if (rule === "SE_MOTHERS_DAY_LAST_SUNDAY_MAY") return lastWeekdayOfMonth(year, 4, 0);
  return undefined;
}

function nthWeekdayOfMonth(year: number, zeroBasedMonth: number, weekday: number, nth: number): string {
  const first = new Date(Date.UTC(year, zeroBasedMonth, 1));
  const offset = (weekday - first.getUTCDay() + 7) % 7;
  const day = 1 + offset + (nth - 1) * 7;
  return formatISODate(new Date(Date.UTC(year, zeroBasedMonth, day)));
}

function lastWeekdayOfMonth(year: number, zeroBasedMonth: number, weekday: number): string {
  const last = new Date(Date.UTC(year, zeroBasedMonth + 1, 0));
  const offset = (last.getUTCDay() - weekday + 7) % 7;
  last.setUTCDate(last.getUTCDate() - offset);
  return formatISODate(last);
}

export function getEventOccurrences(event: RelationshipEvent, fromDate: string, daysAhead = 365): string[] {
  const end = addDaysISO(fromDate, daysAhead);
  const occurrences: string[] = [];
  let candidate = nextEventOccurrence(event, fromDate);

  while (candidate <= end) {
    occurrences.push(candidate);
    if (event.recurrence === "none" || event.recurrence === "custom") break;
    if (event.recurrence === "yearly") {
      candidate = nextYearlyOccurrence(event.date, addDaysISO(candidate, 1));
    } else if (event.recurrence === "weekly") {
      candidate = addDaysISO(candidate, 7);
    } else {
      candidate = addMonthsISO(candidate, 1);
    }
  }
  return occurrences;
}

export function getLeadReminderDates(event: RelationshipEvent, fromDate: string, daysAhead = 365): string[] {
  return getEventOccurrences(event, fromDate, daysAhead)
    .flatMap((occurrence) => event.leadTimeDays.map((days) => addDaysISO(occurrence, -days)))
    .filter((date) => daysBetween(fromDate, date) >= 0);
}
