import { MultiCalendarRoot, type MultiCalendarRootProps } from './multi-calendar-root';
import {
  MultiCalendarHeader,
  MultiCalendarTitle,
  MultiCalendarPrevButton,
  MultiCalendarNextButton,
  type MultiCalendarHeaderProps,
  type MultiCalendarTitleProps,
  type MultiCalendarPrevButtonProps,
  type MultiCalendarNextButtonProps,
} from './multi-calendar-header';
import {
  MultiCalendarCalendars,
  type MultiCalendarCalendarsProps,
} from './multi-calendar-calendars';

/**
 * Multi-Calendar compound component
 *
 * Displays multiple calendar months side by side with synchronized navigation.
 * Supports single, range, and multiple selection modes.
 *
 * @example
 * ```tsx
 * import { MultiCalendar } from '@thaparoyal/calendar-react';
 *
 * function MyMultiCalendar() {
 *   const [range, setRange] = useState<DateRangeValue | null>(null);
 *
 *   return (
 *     <MultiCalendar.Root numberOfMonths={2} mode="range" onValueChange={setRange}>
 *       <MultiCalendar.Header>
 *         <MultiCalendar.PrevButton />
 *         <MultiCalendar.Title />
 *         <MultiCalendar.NextButton />
 *       </MultiCalendar.Header>
 *       <MultiCalendar.Calendars />
 *     </MultiCalendar.Root>
 *   );
 * }
 * ```
 */
export const MultiCalendar = {
  Root: MultiCalendarRoot,
  Header: MultiCalendarHeader,
  Title: MultiCalendarTitle,
  PrevButton: MultiCalendarPrevButton,
  NextButton: MultiCalendarNextButton,
  Calendars: MultiCalendarCalendars,
};

// Export types
export type {
  MultiCalendarRootProps,
  MultiCalendarHeaderProps,
  MultiCalendarTitleProps,
  MultiCalendarPrevButtonProps,
  MultiCalendarNextButtonProps,
  MultiCalendarCalendarsProps,
};

// Export individual components for tree-shaking
export {
  MultiCalendarRoot,
  MultiCalendarHeader,
  MultiCalendarTitle,
  MultiCalendarPrevButton,
  MultiCalendarNextButton,
  MultiCalendarCalendars,
};

// Export context hook for custom components
export {
  useMultiCalendarContext,
  type MultiCalendarContextValue,
  type MultiCalendarMonth,
} from './multi-calendar-context';
