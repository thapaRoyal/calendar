/**
 * @thaparoyal/calendar-core
 *
 * Core date conversion and calendar utilities for AD and BS (Bikram Sambat) calendars.
 * This package provides framework-agnostic logic that can be used with React, Vue, Svelte, or any other framework.
 */

// Types
export type {
  CalendarType,
  CalendarDate,
  DateComponents,
  DateRange,
  WeekDay,
  Week,
  Locale,
  MonthInfo,
  FormatOptions,
  CalendarConfig,
  CalendarState,
  CalendarEvent,
  DatePickerState,
  DatePickerEvent,
  DateRangeState,
  DateRangeEvent,
} from './types';

// Converters
export {
  adToBs,
  bsToAd,
  bsToJsDate,
  jsDateToBs,
  isValidBsDate,
  isValidAdDate,
  isLeapYear,
  getTodayBs,
  getTodayAd,
  compareDates,
  isSameDate,
  isSameMonth,
  addDaysBs,
  addMonthsBs,
  addYearsBs,
  startOfMonthBs,
  endOfMonthBs,
  getDayOfWeekBs,
  getDaysInAdMonth,
  getTotalDaysInAdYear,
} from './converters';

// Calendar data
export {
  BS_MONTH_DAYS,
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
  BS_EPOCH,
  BS_YEAR_RANGE,
  TODAY_TEXT,
  CLEAR_TEXT,
  SELECT_DATE_TEXT,
  PREV_MONTH_TEXT,
  NEXT_MONTH_TEXT,
  getTotalDaysInBsYear,
  getDaysInBsMonth,
  isBsYearSupported,
  toNepaliNumeral,
  fromNepaliNumeral,
} from './data/bs-calendar-data';

// Formatting utilities
export {
  formatDate,
  parseDate,
  formatMonthYear,
  formatDateRange,
  getMonthName,
  getMonthShortName,
  getMonthNames,
  getWeekdayName,
  getWeekdayShortName,
  getWeekdayNames,
  getWeekdayShortNames,
  getWeekdayMinName,
  getWeekdayMinNames,
  getBsMonthShortNames,
  formatDay,
  formatYear,
} from './utils/format';

// Calendar utilities
export {
  getDaysInMonth,
  getDayOfWeek,
  startOfMonth,
  addDays,
  isToday,
  isDateInRange,
  isDateDisabled,
  getWeeksInMonth,
  getYearsRange,
  getMonthsForPicker,
  getNextMonth,
  getPrevMonth,
  getNextYear,
  getPrevYear,
  getToday,
} from './utils/calendar-utils';

// State machines
export {
  // Calendar
  calendarReducer,
  createInitialState,
  createCalendarActions,
  defaultCalendarConfig,
  type CalendarActions,

  // Date picker
  datePickerReducer,
  createInitialDatePickerState,
  createDatePickerActions,
  type DatePickerActions,

  // Date range
  dateRangeReducer,
  createInitialDateRangeState,
  createDateRangeActions,
  isDateInSelectedRange,
  isRangeStart,
  isRangeEnd,
  type DateRangeActions,
} from './machines';
