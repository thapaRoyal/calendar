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
  CalendarMonthPickerProps,
  CalendarYearPickerProps,
  CalendarMonthDropdownProps,
  CalendarYearDropdownProps,
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

// Range Calendar
export { RangeCalendar } from './range-calendar';
export type {
  RangeCalendarRootProps,
  RangeCalendarHeaderProps,
  RangeCalendarTitleProps,
  RangeCalendarPrevButtonProps,
  RangeCalendarNextButtonProps,
  RangeCalendarGridProps,
  RangeCalendarGridHeadProps,
  RangeCalendarGridBodyProps,
} from './range-calendar';
export { useRangeCalendarContext, type RangeCalendarContextValue } from './range-calendar';

// Multi-Calendar
export { MultiCalendar } from './multi-calendar';
export type {
  MultiCalendarRootProps,
  MultiCalendarHeaderProps,
  MultiCalendarTitleProps,
  MultiCalendarPrevButtonProps,
  MultiCalendarNextButtonProps,
  MultiCalendarCalendarsProps,
} from './multi-calendar';
export { useMultiCalendarContext, type MultiCalendarContextValue, type MultiCalendarMonth } from './multi-calendar';

// Hooks
export { useCalendar, type UseCalendarOptions, type UseCalendarReturn } from './hooks';
export { useDatePicker, type UseDatePickerOptions, type UseDatePickerReturn } from './hooks';
export { useDateConverter, type UseDateConverterOptions, type UseDateConverterReturn } from './hooks';
export { useSelection, type UseSelectionOptions, type UseSelectionReturn } from './hooks/use-selection';

// Context
export { useCalendarContext, CalendarProvider, type CalendarContextValue } from './context/calendar-context';
export { useCalendarCustomization, CalendarCustomizationProvider, type CalendarCustomizationProviderProps } from './context/customization-context';

// Customization types (shadcn-style)
export type {
  CalendarClassNames,
  CalendarComponents,
  CalendarCustomizationContextValue,
  DayComponentProps,
  DayContentProps,
  NavIconProps,
} from './types';
export { defaultClassNames, defaultComponents } from './types';

// Re-export core types for convenience
export type {
  CalendarType,
  CalendarDate,
  CalendarConfig,
  Locale,
  WeekDay,
  Week,
  SelectionMode,
  DateRangeValue,
  MonthPickerItem,
  YearPickerItem,
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
