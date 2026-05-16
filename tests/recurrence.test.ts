import { describe, expect, it } from "vitest";
import { getLeadReminderDates, nextEventOccurrence } from "../src/domain/recurrence";
import { RelationshipEvent } from "../src/domain/models";

function event(overrides: Partial<RelationshipEvent> = {}): RelationshipEvent {
  return {
    id: "event-1",
    partnerId: "partner-1",
    title: "Birthday",
    eventType: "birthday",
    date: "2024-02-29",
    recurrence: "yearly",
    leadTimeDays: [14, 7, 1],
    linkedPreferenceIds: [],
    isSensitive: false,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    ...overrides
  };
}

describe("recurrence", () => {
  it("handles leap year birthdays on non-leap years", () => {
    expect(nextEventOccurrence(event(), "2025-02-01")).toBe("2025-02-28");
  });

  it("generates yearly lead reminder dates", () => {
    expect(getLeadReminderDates(event({ date: "2026-06-15" }), "2026-06-01", 30)).toEqual(["2026-06-01", "2026-06-08", "2026-06-14"]);
  });

  it("advances weekly recurring events", () => {
    expect(nextEventOccurrence(event({ date: "2026-05-01", recurrence: "weekly" }), "2026-05-12")).toBe("2026-05-15");
  });

  it("handles custom Mother's Day recurrence rules", () => {
    expect(nextEventOccurrence(event({
      date: "2026-05-31",
      recurrence: "custom",
      recurrenceRule: "SE_MOTHERS_DAY_LAST_SUNDAY_MAY"
    }), "2027-01-01")).toBe("2027-05-30");

    expect(nextEventOccurrence(event({
      date: "2026-05-10",
      recurrence: "custom",
      recurrenceRule: "US_MOTHERS_DAY_SECOND_SUNDAY_MAY"
    }), "2027-01-01")).toBe("2027-05-09");
  });
});
