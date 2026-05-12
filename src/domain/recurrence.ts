import { RelationshipEvent } from "@/src/domain/models";
import { addDaysISO, addMonthsISO, daysBetween, nextYearlyOccurrence } from "@/src/utils/dates";

export function nextEventOccurrence(event: RelationshipEvent, fromDate: string): string {
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
