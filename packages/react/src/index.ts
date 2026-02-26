/**
 * @thaparoyal/calendar-react
 *
 * React components for AD and BS (Bikram Sambat) calendars.
 */

// Components
export { Calendar } from './calendar';
export type {
  CalendarRootProps,
  CalendarHeaderProps,
  CalendarTitleProps,
  CalendarPrevButtonProps,
  CalendarNextButtonProps,
  CalendarGridProps,
  CalendarGridHeadProps,
  CalendarGridBodyProps,
  CalendarRowProps,
  CalendarDayCellProps,
} from './calendar';

export { DatePicker } from './date-picker';
export type {
  DatePickerRootProps,
  DatePickerInputProps,
  DatePickerTriggerProps,
  DatePickerContentProps,
  DatePickerCalendarProps,
  DatePickerClearButtonProps,
} from './date-picker';

// Hooks
export { useCalendar, type UseCalendarOptions, type UseCalendarReturn } from './hooks';
export { useDatePicker, type UseDatePickerOptions, type UseDatePickerReturn } from './hooks';
export { useDateConverter, type UseDateConverterOptions, type UseDateConverterReturn } from './hooks';

// Context
export { useCalendarContext, CalendarProvider, type CalendarContextValue } from './context/calendar-context';

// Re-export core types for convenience
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
