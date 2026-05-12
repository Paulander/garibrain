export function todayISO(now = new Date()): string {
  return formatISODate(now);
}

export function nowUtcISO(now = new Date()): string {
  return now.toISOString();
}

export function formatISODate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function parseISODate(date: string): Date {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

export function addDaysISO(date: string, days: number): string {
  const parsed = parseISODate(date);
  parsed.setUTCDate(parsed.getUTCDate() + days);
  return formatISODate(parsed);
}

export function daysBetween(start: string, end: string): number {
  const ms = parseISODate(end).getTime() - parseISODate(start).getTime();
  return Math.round(ms / 86400000);
}

export function daysUntil(date: string, today = todayISO()): number {
  return daysBetween(today, date);
}

export function isWithinInclusive(date: string, start: string, end: string): boolean {
  return date >= start && date <= end;
}

export function isLeapYear(year: number): boolean {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

export function nextYearlyOccurrence(monthDayDate: string, fromDate: string): string {
  const from = parseISODate(fromDate);
  const source = parseISODate(monthDayDate);
  const month = source.getUTCMonth();
  const day = source.getUTCDate();
  let year = from.getUTCFullYear();
  let candidate = makeSafeDate(year, month, day);
  if (candidate < fromDate) {
    year += 1;
    candidate = makeSafeDate(year, month, day);
  }
  return candidate;
}

export function makeSafeDate(year: number, zeroBasedMonth: number, day: number): string {
  if (zeroBasedMonth === 1 && day === 29 && !isLeapYear(year)) {
    return formatISODate(new Date(Date.UTC(year, 1, 28)));
  }
  return formatISODate(new Date(Date.UTC(year, zeroBasedMonth, day)));
}

export function addMonthsISO(date: string, months: number): string {
  const parsed = parseISODate(date);
  const day = parsed.getUTCDate();
  parsed.setUTCDate(1);
  parsed.setUTCMonth(parsed.getUTCMonth() + months);
  const lastDay = new Date(Date.UTC(parsed.getUTCFullYear(), parsed.getUTCMonth() + 1, 0)).getUTCDate();
  parsed.setUTCDate(Math.min(day, lastDay));
  return formatISODate(parsed);
}

export function id(prefix = "id"): string {
  const random = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  return `${prefix}_${random}`;
}
