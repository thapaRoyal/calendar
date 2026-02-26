/**
 * @thaparoyal/calendar-svelte
 *
 * Svelte components and stores for AD and BS (Bikram Sambat) calendars.
 */

// Stores
export { createCalendar, type CreateCalendarOptions, type CalendarStore } from './stores/calendar';

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
