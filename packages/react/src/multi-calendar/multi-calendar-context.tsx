import * as React from 'react';
import type {
  CalendarDate,
  CalendarType,
  Locale,
  Week,
  SelectionMode,
  SelectionState,
  DateRangeValue,
} from '@thaparoyal/calendar-core';

/**
 * Multi-calendar month data
 */
export interface MultiCalendarMonth {
  /** Year */
  year: number;
  /** Month */
  month: number;
  /** Title */
  title: string;
  /** Weeks */
  weeks: Week[];
}

/**
 * Multi-calendar context value
 */
export interface MultiCalendarContextValue {
  /** Number of months to display */
  numberOfMonths: number;
  /** Calendar type */
  calendarType: CalendarType;
  /** Locale */
  locale: Locale;
  /** Base/focused date */
  focusedDate: CalendarDate;
  /** Selection mode */
  selectionMode: SelectionMode;
  /** Selection state */
  selectionState: SelectionState;
  /** Current value (based on mode) */
  value: CalendarDate | CalendarDate[] | DateRangeValue | null;
  /** Month data for each month */
  months: MultiCalendarMonth[];
  /** Weekday names */
  weekdayNames: readonly string[];
  /** Navigation state */
  isPrevDisabled: boolean;
  isNextDisabled: boolean;
  /** Actions */
  selectDate: (date: CalendarDate) => void;
  toggleDate: (date: CalendarDate) => void;
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

export const MultiCalendarContext = React.createContext<MultiCalendarContextValue | null>(null);

export function useMultiCalendarContext(): MultiCalendarContextValue {
  const context = React.useContext(MultiCalendarContext);
  if (!context) {
    throw new Error('MultiCalendar components must be used within MultiCalendar.Root');
  }
  return context;
}
