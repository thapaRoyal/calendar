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
