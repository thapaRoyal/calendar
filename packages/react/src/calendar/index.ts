import { CalendarRoot, type CalendarRootProps } from './calendar-root';
import {
  CalendarHeader,
  CalendarTitle,
  CalendarPrevButton,
  CalendarNextButton,
  type CalendarHeaderProps,
  type CalendarTitleProps,
  type CalendarPrevButtonProps,
  type CalendarNextButtonProps,
} from './calendar-header';
import {
  CalendarGrid,
  CalendarGridHead,
  CalendarGridBody,
  CalendarRow,
  CalendarDayCell,
  type CalendarGridProps,
  type CalendarGridHeadProps,
  type CalendarGridBodyProps,
  type CalendarRowProps,
  type CalendarDayCellProps,
} from './calendar-grid';

/**
 * Calendar compound component
 *
 * A flexible calendar component that supports both AD (Gregorian) and BS (Bikram Sambat) calendars.
 *
 * @example
 * ```tsx
 * import { Calendar } from '@thaparoyal/calendar-react';
 *
 * function MyCalendar() {
 *   const [date, setDate] = useState<CalendarDate | null>(null);
 *
 *   return (
 *     <Calendar.Root
 *       config={{ calendarType: 'BS', locale: 'en' }}
 *       value={date}
 *       onValueChange={setDate}
 *     >
 *       <Calendar.Header>
 *         <Calendar.PrevButton />
 *         <Calendar.Title />
 *         <Calendar.NextButton />
 *       </Calendar.Header>
 *       <Calendar.Grid>
 *         <Calendar.GridHead />
 *         <Calendar.GridBody />
 *       </Calendar.Grid>
 *     </Calendar.Root>
 *   );
 * }
 * ```
 */
export const Calendar = {
  Root: CalendarRoot,
  Header: CalendarHeader,
  Title: CalendarTitle,
  PrevButton: CalendarPrevButton,
  NextButton: CalendarNextButton,
  Grid: CalendarGrid,
  GridHead: CalendarGridHead,
  GridBody: CalendarGridBody,
  Row: CalendarRow,
  DayCell: CalendarDayCell,
};

// Export types
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
};

// Export individual components for tree-shaking
export {
  CalendarRoot,
  CalendarHeader,
  CalendarTitle,
  CalendarPrevButton,
  CalendarNextButton,
  CalendarGrid,
  CalendarGridHead,
  CalendarGridBody,
  CalendarRow,
  CalendarDayCell,
};
