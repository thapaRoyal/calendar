import * as React from 'react';
import type {
  CalendarDate,
  CalendarType,
  Locale,
  Week,
  SelectionState,
  DateRangeValue,
} from '@thaparoyal/calendar-core';

/**
 * Range calendar context value
 */
export interface RangeCalendarContextValue {
  /** Current calendar state */
  calendarType: CalendarType;
  locale: Locale;
  focusedDate: CalendarDate;
  /** Selection state */
  selectionState: SelectionState;
  /** Selection value */
  value: DateRangeValue | null;
  /** Whether range is complete */
  isComplete: boolean;
  /** Computed weeks */
  weeks: Week[];
  /** Formatted title */
  title: string;
  /** Weekday names */
  weekdayNames: readonly string[];
  /** Navigation state */
  isPrevDisabled: boolean;
  isNextDisabled: boolean;
  /** Actions */
  selectDate: (date: CalendarDate) => void;
  hoverDate: (date: CalendarDate | null) => void;
  focusDate: (date: CalendarDate) => void;
  nextMonth: () => void;
  prevMonth: () => void;
  nextYear: () => void;
  prevYear: () => void;
  clear: () => void;
  /** Format day number */
  formatDayNumber: (day: number) => string;
}

export const RangeCalendarContext = React.createContext<RangeCalendarContextValue | null>(null);

export function useRangeCalendarContext(): RangeCalendarContextValue {
  const context = React.useContext(RangeCalendarContext);
  if (!context) {
    throw new Error('RangeCalendar components must be used within RangeCalendar.Root');
  }
  return context;
}
