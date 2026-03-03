/**
 * @thaparoyal/calendar-vue
 *
 * Vue components for AD and BS (Bikram Sambat) calendars.
 */

// Composables
export { useCalendar, type UseCalendarOptions } from './composables/use-calendar';
export { useSelection, type UseSelectionOptions } from './composables/use-selection';
export { useDatePicker, type UseDatePickerOptions } from './composables/use-date-picker';
export {
  useMultiCalendar,
  type UseMultiCalendarOptions,
  type MultiCalendarMonth,
} from './composables/use-multi-calendar';

// Re-export core types
export type {
  CalendarType,
  CalendarDate,
  CalendarConfig,
  Locale,
  WeekDay,
  Week,
  SelectionMode,
  DateRangeValue,
  SelectionState,
  MonthPickerItem,
  YearPickerItem,
  DatePickerState,
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
