import { describe, expect, it } from "vitest";
import { generateCycleSupportWindows } from "../src/domain/cycleEngine";
import { CycleSettings } from "../src/domain/models";

function settings(overrides: Partial<CycleSettings> = {}): CycleSettings {
  return {
    id: "cycle-1",
    partnerId: "partner-1",
    enabled: true,
    lastPeriodStartDate: "2026-01-31",
    averageCycleLengthDays: 28,
    periodDurationDays: 5,
    prePeriodSupportDays: 3,
    regularity: "regular",
    supportActions: ["handle dinner", "no unsolicited advice"],
    notifyDayBefore: true,
    notifyMorningOf: false,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    ...overrides
  };
}

describe("cycleEngine", () => {
  it("generates pre-period and period windows across month boundaries", () => {
    const windows = generateCycleSupportWindows(settings(), "2026-02-20", 20);
    expect(windows).toEqual(expect.arrayContaining([
      expect.objectContaining({ kind: "pre_period", startDate: "2026-02-25", endDate: "2026-02-27" }),
      expect.objectContaining({ kind: "period", startDate: "2026-02-28", endDate: "2026-03-04" })
    ]));
  });

  it("marks irregular cycles as low confidence", () => {
    const windows = generateCycleSupportWindows(settings({ regularity: "irregular" }), "2026-02-20", 20);
    expect(windows.every((window) => window.confidence === "low")).toBe(true);
  });

  it("returns no windows when disabled", () => {
    expect(generateCycleSupportWindows(settings({ enabled: false }), "2026-02-20", 20)).toEqual([]);
  });
});
