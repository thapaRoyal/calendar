/**
 * @thaparoyal/calendar-svelte
 *
 * Svelte components and stores for AD and BS (Bikram Sambat) calendars.
 */

// Stores
export { createCalendar, type CreateCalendarOptions, type CalendarStore } from './stores/calendar';
export { createSelection, type CreateSelectionOptions, type SelectionStore } from './stores/selection';
export { createDatePicker, type CreateDatePickerOptions, type DatePickerStore } from './stores/date-picker';
export {
  createMultiCalendar,
  type CreateMultiCalendarOptions,
  type MultiCalendarMonth,
  type MultiCalendarStore,
} from './stores/multi-calendar';

// Re-export core types
export type {
  CalendarType,
  CalendarDate,
  CalendarConfig,
  CalendarState,
  CalendarEvent,
  Locale,
  WeekDay,
  Week,
  DatePickerState,
  DatePickerEvent,
  SelectionMode,
  SelectionConfig,
  SelectionState,
  SelectionEvent,
  SelectionActions,
  DateRangeValue,
  MultiCalendarConfig,
  MonthPickerItem,
  YearPickerItem,
  DecadeRange,
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
  formatMonthYear,
  formatDateRange,
  getMonthsForPicker,
  getMonthGrid,
  getYearGrid,
  getDecadeRange,
  enhanceWeekDayWithSelection,
  getSelectionValue,
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
