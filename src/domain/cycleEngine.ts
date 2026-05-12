import { CycleSettings } from "@/src/domain/models";
import { addDaysISO, daysBetween, isWithinInclusive } from "@/src/utils/dates";

export interface SupportWindow {
  id: string;
  partnerId: string;
  kind: "pre_period" | "period";
  label: string;
  startDate: string;
  endDate: string;
  confidence: "high" | "medium" | "low";
  supportActions: string[];
}

export function confidenceForCycle(settings: CycleSettings): "high" | "medium" | "low" {
  if (settings.regularity === "irregular") return "low";
  if (settings.regularity === "somewhat_irregular") return "medium";
  return "high";
}

export function generateCycleSupportWindows(settings: CycleSettings, fromDate: string, daysAhead = 90): SupportWindow[] {
  if (!settings.enabled) return [];
  const cycleLength = Math.max(14, settings.averageCycleLengthDays);
  const periodDuration = Math.max(1, settings.periodDurationDays);
  const preDays = Math.max(0, settings.prePeriodSupportDays);
  const horizonEnd = addDaysISO(fromDate, daysAhead);
  const windows: SupportWindow[] = [];
  let cycleStart = settings.lastPeriodStartDate;

  while (daysBetween(cycleStart, fromDate) > cycleLength) {
    cycleStart = addDaysISO(cycleStart, cycleLength);
  }

  while (cycleStart <= horizonEnd) {
    if (preDays > 0) {
      const startDate = addDaysISO(cycleStart, -preDays);
      const endDate = addDaysISO(cycleStart, -1);
      if (endDate >= fromDate && startDate <= horizonEnd) {
        windows.push({
          id: `${settings.id}:pre:${cycleStart}`,
          partnerId: settings.partnerId,
          kind: "pre_period",
          label: "Pre-period support window",
          startDate,
          endDate,
          confidence: confidenceForCycle(settings),
          supportActions: settings.supportActions
        });
      }
    }

    const periodEnd = addDaysISO(cycleStart, periodDuration - 1);
    if (periodEnd >= fromDate && cycleStart <= horizonEnd) {
      windows.push({
        id: `${settings.id}:period:${cycleStart}`,
        partnerId: settings.partnerId,
        kind: "period",
        label: "Period support window",
        startDate: cycleStart,
        endDate: periodEnd,
        confidence: confidenceForCycle(settings),
        supportActions: settings.supportActions
      });
    }
    cycleStart = addDaysISO(cycleStart, cycleLength);
  }

  return windows;
}

export function activeOrUpcomingSupportWindow(windows: SupportWindow[], today: string): SupportWindow | undefined {
  return windows
    .filter((window) => isWithinInclusive(today, window.startDate, window.endDate) || window.startDate >= today)
    .sort((a, b) => a.startDate.localeCompare(b.startDate))[0];
}
