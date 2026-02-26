/**
 * @thaparoyal/calendar-vue
 *
 * Vue components for AD and BS (Bikram Sambat) calendars.
 */

// Composables
export { useCalendar, type UseCalendarOptions } from './composables/use-calendar';

// Re-export core types
export type {
  CalendarType,
  CalendarDate,
  CalendarConfig,
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
