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
