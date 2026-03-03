/**
 * @thaparoyal/calendar-vanilla
 *
 * Vanilla JS calendar components for AD and BS (Bikram Sambat) calendars.
 * Uses the core package for all date logic and state management.
 */

export { Calendar } from './calendar';
export type { CalendarOptions } from './calendar';

import { Calendar } from './calendar';
import type { CalendarOptions } from './calendar';

// Re-export commonly used core types for convenience
export type {
  CalendarDate,
  CalendarConfig,
  CalendarType,
  SelectionMode,
  DateRangeValue,
  Locale,
  WeekDay,
  Week,
} from '@thaparoyal/calendar-core';

// Re-export useful core utilities
export {
  adToBs,
  bsToAd,
  formatDate,
  parseDate,
  getTodayBs,
  getTodayAd,
  isValidBsDate,
  isValidAdDate,
} from '@thaparoyal/calendar-core';

// Re-export calendar data constants (month/weekday names in English and Nepali)
export {
  BS_MONTHS_EN,
  BS_MONTHS_NP,
  BS_MONTHS_SHORT_EN,
  BS_MONTHS_SHORT_NP,
  WEEKDAYS_EN,
  WEEKDAYS_NP,
  WEEKDAYS_SHORT_EN,
  WEEKDAYS_SHORT_NP,
  WEEKDAYS_MIN_EN,
  WEEKDAYS_MIN_NP,
  NEPALI_DIGITS,
  TODAY_TEXT,
  CLEAR_TEXT,
  SELECT_DATE_TEXT,
  PREV_MONTH_TEXT,
  NEXT_MONTH_TEXT,
  toNepaliNumeral,
  fromNepaliNumeral,
  getMonthName,
  getMonthShortName,
  getMonthNames,
  getWeekdayName,
  getWeekdayShortName,
  getWeekdayNames,
  getWeekdayShortNames,
  getWeekdayMinName,
  getWeekdayMinNames,
} from '@thaparoyal/calendar-core';

/**
 * Convenience function to create and render a calendar.
 *
 * @example
 * ```js
 * import { render } from '@thaparoyal/calendar-vanilla';
 *
 * const cal = render('#calendar', {
 *   config: { calendarType: 'BS', locale: 'ne' },
 *   selectionMode: 'single',
 *   onValueChange: (val) => console.log(val),
 * });
 *
 * // Later:
 * cal.destroy();
 * ```
 */
export function render(
  element: HTMLElement | string,
  options: Omit<CalendarOptions, 'element'> = {}
): Calendar {
  return new Calendar({ element, ...options });
}

// Re-export holiday utilities and relative date formatting
export type { NepaliHoliday, FormatRelativeOptions } from '@thaparoyal/calendar-core';
export {
  FIXED_HOLIDAYS,
  VARIABLE_HOLIDAYS,
  getHolidaysForYear,
  isHoliday,
  getHolidayInfo,
  getHolidayName,
  getHolidaysInMonth,
  fetchHolidays,
  setHolidayCache,
  clearHolidayCache,
  formatRelative,
  formatDateInput,
} from '@thaparoyal/calendar-core';
