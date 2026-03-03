/**
 * Relative Date Formatting
 *
 * Provides human-friendly relative time strings like "yesterday", "3 days ago",
 * "in 2 weeks" etc., with full Nepali (Devanagari) locale support.
 */

import { toNepaliNumeral } from '../data/bs-calendar-data';
import { isSameDate } from '../converters/bs-converter';
import type { CalendarDate } from '../types';

// ---------------------------------------------------------------------------
// String tables
// ---------------------------------------------------------------------------

const RELATIVE_STRINGS = {
  en: {
    today: 'Today',
    yesterday: 'Yesterday',
    tomorrow: 'Tomorrow',
    daysAgo: (n: number) => `${n} day${n === 1 ? '' : 's'} ago`,
    inDays: (n: number) => `In ${n} day${n === 1 ? '' : 's'}`,
    weeksAgo: (n: number) => `${n} week${n === 1 ? '' : 's'} ago`,
    inWeeks: (n: number) => `In ${n} week${n === 1 ? '' : 's'}`,
    monthsAgo: (n: number) => `${n} month${n === 1 ? '' : 's'} ago`,
    inMonths: (n: number) => `In ${n} month${n === 1 ? '' : 's'}`,
    yearsAgo: (n: number) => `${n} year${n === 1 ? '' : 's'} ago`,
    inYears: (n: number) => `In ${n} year${n === 1 ? '' : 's'}`,
  },
  ne: {
    today: 'आज',
    yesterday: 'हिजो',
    tomorrow: 'भोलि',
    daysAgo: (n: number) => `${toNepaliNumeral(n)} दिन अघि`,
    inDays: (n: number) => `${toNepaliNumeral(n)} दिनमा`,
    weeksAgo: (n: number) => `${toNepaliNumeral(n)} हप्ता अघि`,
    inWeeks: (n: number) => `${toNepaliNumeral(n)} हप्तामा`,
    monthsAgo: (n: number) => `${toNepaliNumeral(n)} महिना अघि`,
    inMonths: (n: number) => `${toNepaliNumeral(n)} महिनामा`,
    yearsAgo: (n: number) => `${toNepaliNumeral(n)} वर्ष अघि`,
    inYears: (n: number) => `${toNepaliNumeral(n)} वर्षमा`,
  },
} as const;

// ---------------------------------------------------------------------------
// Helper: approximate total days between two BS CalendarDates
// We use the year/month/day differences as an approximation.
// For exact day-level arithmetic use addDaysBs / bsToJsDate.
// ---------------------------------------------------------------------------

function approxDaysBetween(from: CalendarDate, to: CalendarDate): number {
  // Convert to approximate AD day count using a simple formula:
  // average BS year ≈ 365.25 days, average BS month ≈ 30.44 days
  const toAbsolute = (d: CalendarDate) =>
    d.year * 365.25 + d.month * 30.44 + d.day;
  return Math.round(toAbsolute(to) - toAbsolute(from));
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export interface FormatRelativeOptions {
  /** Locale: 'en' (default) or 'ne' (Nepali) */
  locale?: 'en' | 'ne';
  /**
   * Thresholds control when the label changes unit.
   * Defaults: days < 7 → days, days < 30 → weeks, days < 365 → months, else years.
   */
  thresholds?: {
    week?: number;    // default 7
    month?: number;   // default 30
    year?: number;    // default 365
  };
}

/**
 * Format the difference between `date` and `baseDate` as a human-readable
 * relative string in English or Nepali.
 *
 * @param date      - The date to describe
 * @param baseDate  - The reference point (usually "today")
 * @param options   - Locale and threshold options
 *
 * @example
 * ```ts
 * const today = getTodayBs();
 * const yesterday = addDaysBs(today, -1);
 *
 * formatRelative(yesterday, today);         // "Yesterday"
 * formatRelative(yesterday, today, { locale: 'ne' }); // "हिजो"
 *
 * const future = addDaysBs(today, 5);
 * formatRelative(future, today);            // "In 5 days"
 * formatRelative(future, today, { locale: 'ne' }); // "५ दिनमा"
 * ```
 */
export function formatRelative(
  date: CalendarDate,
  baseDate: CalendarDate,
  options: FormatRelativeOptions = {}
): string {
  const locale = options.locale ?? 'en';
  const strings = RELATIVE_STRINGS[locale];
  const thresholds = {
    week: options.thresholds?.week ?? 7,
    month: options.thresholds?.month ?? 30,
    year: options.thresholds?.year ?? 365,
  };

  if (isSameDate(date, baseDate)) {
    return strings.today;
  }

  const diff = approxDaysBetween(baseDate, date); // positive = future, negative = past
  const absDiff = Math.abs(diff);
  const isPast = diff < 0;

  // Yesterday / Tomorrow
  if (absDiff === 1) {
    return isPast ? strings.yesterday : strings.tomorrow;
  }

  // Days
  if (absDiff < thresholds.week) {
    return isPast ? strings.daysAgo(absDiff) : strings.inDays(absDiff);
  }

  // Weeks
  if (absDiff < thresholds.month) {
    const weeks = Math.round(absDiff / 7);
    return isPast ? strings.weeksAgo(weeks) : strings.inWeeks(weeks);
  }

  // Months
  if (absDiff < thresholds.year) {
    const months = Math.round(absDiff / 30.44);
    return isPast ? strings.monthsAgo(months) : strings.inMonths(months);
  }

  // Years
  const years = Math.round(absDiff / 365.25);
  return isPast ? strings.yearsAgo(years) : strings.inYears(years);
}

/**
 * Format the difference between a date and today's BS date.
 * Pass `todayBs` explicitly to avoid circular imports.
 *
 * @example
 * ```ts
 * import { getTodayBs, addDaysBs, formatRelative } from '@thaparoyal/calendar-core';
 *
 * const today = getTodayBs();
 * const past  = addDaysBs(today, -10);
 * formatRelative(past, today);                    // "1 week ago"
 * formatRelative(past, today, { locale: 'ne' });  // "१ हप्ता अघि"
 * ```
 */
// (No separate formatRelativeToToday export — callers pass getTodayBs() as baseDate.)
