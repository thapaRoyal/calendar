import { RangeCalendarRoot, type RangeCalendarRootProps } from './range-calendar-root';
import {
  RangeCalendarHeader,
  RangeCalendarTitle,
  RangeCalendarPrevButton,
  RangeCalendarNextButton,
  type RangeCalendarHeaderProps,
  type RangeCalendarTitleProps,
  type RangeCalendarPrevButtonProps,
  type RangeCalendarNextButtonProps,
} from './range-calendar-header';
import {
  RangeCalendarGrid,
  RangeCalendarGridHead,
  RangeCalendarGridBody,
  type RangeCalendarGridProps,
  type RangeCalendarGridHeadProps,
  type RangeCalendarGridBodyProps,
} from './range-calendar-grid';

/**
 * Range Calendar compound component
 *
 * A calendar component for selecting date ranges with start and end date support.
 *
 * @example
 * ```tsx
 * import { RangeCalendar } from '@thaparoyal/calendar-react';
 *
 * function MyRangeCalendar() {
 *   const [range, setRange] = useState<DateRangeValue | null>(null);
 *
 *   return (
 *     <RangeCalendar.Root
 *       config={{ calendarType: 'BS', locale: 'en' }}
 *       value={range}
 *       onValueChange={setRange}
 *     >
 *       <RangeCalendar.Header>
 *         <RangeCalendar.PrevButton />
 *         <RangeCalendar.Title />
 *         <RangeCalendar.NextButton />
 *       </RangeCalendar.Header>
 *       <RangeCalendar.Grid>
 *         <RangeCalendar.GridHead />
 *         <RangeCalendar.GridBody />
 *       </RangeCalendar.Grid>
 *     </RangeCalendar.Root>
 *   );
 * }
 * ```
 */
export const RangeCalendar = {
  Root: RangeCalendarRoot,
  Header: RangeCalendarHeader,
  Title: RangeCalendarTitle,
  PrevButton: RangeCalendarPrevButton,
  NextButton: RangeCalendarNextButton,
  Grid: RangeCalendarGrid,
  GridHead: RangeCalendarGridHead,
  GridBody: RangeCalendarGridBody,
};

// Export types
export type {
  RangeCalendarRootProps,
  RangeCalendarHeaderProps,
  RangeCalendarTitleProps,
  RangeCalendarPrevButtonProps,
  RangeCalendarNextButtonProps,
  RangeCalendarGridProps,
  RangeCalendarGridHeadProps,
  RangeCalendarGridBodyProps,
};

// Export individual components for tree-shaking
export {
  RangeCalendarRoot,
  RangeCalendarHeader,
  RangeCalendarTitle,
  RangeCalendarPrevButton,
  RangeCalendarNextButton,
  RangeCalendarGrid,
  RangeCalendarGridHead,
  RangeCalendarGridBody,
};

// Export context hook for custom components
export { useRangeCalendarContext, type RangeCalendarContextValue } from './range-calendar-context';
