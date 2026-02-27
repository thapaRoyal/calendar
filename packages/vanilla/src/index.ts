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
