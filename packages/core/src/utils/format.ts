/**
 * Date Formatting Utilities
 *
 * Provides formatting functions for both AD and BS dates with locale support.
 */

import {
  BS_MONTHS_EN,
  BS_MONTHS_NP,
  BS_MONTHS_SHORT_EN,
  WEEKDAYS_EN,
  WEEKDAYS_NP,
  WEEKDAYS_SHORT_EN,
  WEEKDAYS_SHORT_NP,
  toNepaliNumeral,
} from '../data/bs-calendar-data';
import { getDayOfWeekBs } from '../converters/bs-converter';
import type { CalendarDate, Locale } from '../types';

/**
 * AD month names in English
 */
const AD_MONTHS_EN = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

/**
 * AD month short names in English
 */
const AD_MONTHS_SHORT_EN = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const;

/**
 * Get month name based on calendar type and locale
 */
export function getMonthName(
  month: number,
  calendarType: 'AD' | 'BS',
  locale: Locale = 'en'
): string {
  const index = month - 1;

  if (calendarType === 'BS') {
    return locale === 'ne' ? BS_MONTHS_NP[index] : BS_MONTHS_EN[index];
  }

  return AD_MONTHS_EN[index];
}

/**
 * Get short month name based on calendar type and locale
 */
export function getMonthShortName(
  month: number,
  calendarType: 'AD' | 'BS',
  locale: Locale = 'en'
): string {
  const index = month - 1;

  if (calendarType === 'BS') {
    return locale === 'ne' ? BS_MONTHS_NP[index].slice(0, 3) : BS_MONTHS_SHORT_EN[index];
  }

  return AD_MONTHS_SHORT_EN[index];
}

/**
 * Get all month names for a calendar type and locale
 */
export function getMonthNames(calendarType: 'AD' | 'BS', locale: Locale = 'en'): readonly string[] {
  if (calendarType === 'BS') {
    return locale === 'ne' ? BS_MONTHS_NP : BS_MONTHS_EN;
  }
  return AD_MONTHS_EN;
}

/**
 * Get weekday name
 */
export function getWeekdayName(dayOfWeek: number, locale: Locale = 'en'): string {
  return locale === 'ne' ? WEEKDAYS_NP[dayOfWeek] : WEEKDAYS_EN[dayOfWeek];
}

/**
 * Get short weekday name
 */
export function getWeekdayShortName(dayOfWeek: number, locale: Locale = 'en'): string {
  return locale === 'ne' ? WEEKDAYS_SHORT_NP[dayOfWeek] : WEEKDAYS_SHORT_EN[dayOfWeek];
}

/**
 * Get all weekday names
 */
export function getWeekdayNames(locale: Locale = 'en'): readonly string[] {
  return locale === 'ne' ? WEEKDAYS_NP : WEEKDAYS_EN;
}

/**
 * Get all short weekday names
 */
export function getWeekdayShortNames(locale: Locale = 'en'): readonly string[] {
  return locale === 'ne' ? WEEKDAYS_SHORT_NP : WEEKDAYS_SHORT_EN;
}

/**
 * Pad a number with leading zeros
 */
function padZero(num: number, length: number = 2): string {
  return num.toString().padStart(length, '0');
}

/**
 * Format a number for display, optionally in Nepali numerals
 */
function formatNumber(num: number, locale: Locale, pad: number = 0): string {
  const str = pad > 0 ? padZero(num, pad) : num.toString();
  return locale === 'ne' ? toNepaliNumeral(num).padStart(pad, '०') : str;
}

/**
 * Format tokens:
 * YYYY - 4-digit year
 * YY   - 2-digit year
 * MMMM - Full month name
 * MMM  - Short month name
 * MM   - 2-digit month (01-12)
 * M    - Month (1-12)
 * DD   - 2-digit day (01-31)
 * D    - Day (1-31)
 * dddd - Full weekday name
 * ddd  - Short weekday name
 * d    - Day of week (0-6)
 */
export function formatDate(date: CalendarDate, format: string = 'YYYY-MM-DD', locale: Locale = 'en'): string {
  const dayOfWeek = getDayOfWeekBs(date);

  const tokens: Record<string, string> = {
    YYYY: formatNumber(date.year, locale, 4),
    YY: formatNumber(date.year % 100, locale, 2),
    MMMM: getMonthName(date.month, date.calendarType, locale),
    MMM: getMonthShortName(date.month, date.calendarType, locale),
    MM: formatNumber(date.month, locale, 2),
    M: formatNumber(date.month, locale),
    DD: formatNumber(date.day, locale, 2),
    D: formatNumber(date.day, locale),
    dddd: getWeekdayName(dayOfWeek, locale),
    ddd: getWeekdayShortName(dayOfWeek, locale),
    d: dayOfWeek.toString(),
  };

  // Sort tokens by length (longest first) to avoid partial replacements
  const sortedTokens = Object.keys(tokens).sort((a, b) => b.length - a.length);

  let result = format;
  for (const token of sortedTokens) {
    result = result.replace(new RegExp(token, 'g'), tokens[token]);
  }

  return result;
}

/**
 * Parse a date string in YYYY-MM-DD format
 */
export function parseDate(dateString: string, calendarType: 'AD' | 'BS'): CalendarDate | null {
  // Try ISO format first (YYYY-MM-DD)
  const isoMatch = dateString.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (isoMatch) {
    return {
      year: parseInt(isoMatch[1], 10),
      month: parseInt(isoMatch[2], 10),
      day: parseInt(isoMatch[3], 10),
      calendarType,
    };
  }

  // Try slash format (YYYY/MM/DD)
  const slashMatch = dateString.match(/^(\d{4})\/(\d{1,2})\/(\d{1,2})$/);
  if (slashMatch) {
    return {
      year: parseInt(slashMatch[1], 10),
      month: parseInt(slashMatch[2], 10),
      day: parseInt(slashMatch[3], 10),
      calendarType,
    };
  }

  return null;
}

/**
 * Get a display string for a month and year
 */
export function formatMonthYear(
  year: number,
  month: number,
  calendarType: 'AD' | 'BS',
  locale: Locale = 'en'
): string {
  const monthName = getMonthName(month, calendarType, locale);
  const yearStr = locale === 'ne' ? toNepaliNumeral(year) : year.toString();
  return `${monthName} ${yearStr}`;
}

/**
 * Format date range
 */
export function formatDateRange(
  start: CalendarDate,
  end: CalendarDate,
  format: string = 'YYYY-MM-DD',
  locale: Locale = 'en'
): string {
  return `${formatDate(start, format, locale)} - ${formatDate(end, format, locale)}`;
}
