/**
 * Date Range Picker State Machine
 *
 * Handles selection of date ranges with start and end dates.
 */

import type {
  DateRangeState,
  DateRangeEvent,
  CalendarConfig,
  CalendarDate,
} from '../types';
import {
  calendarReducer,
  createInitialState as createCalendarInitialState,
} from './calendar.machine';
import { compareDates, isSameDate } from '../converters/bs-converter';
import { isDateInRange, getToday } from '../utils/calendar-utils';

/**
 * Create initial date range state
 */
export function createInitialDateRangeState(
  config: Partial<CalendarConfig> = {},
  initialStart?: CalendarDate,
  initialEnd?: CalendarDate
): DateRangeState {
  const calendarState = createCalendarInitialState(config, initialStart);

  return {
    ...calendarState,
    startDate: initialStart || null,
    endDate: initialEnd || null,
    selectingEnd: false,
  };
}

/**
 * Check if a date is within the selected range
 */
export function isDateInSelectedRange(
  date: CalendarDate,
  startDate: CalendarDate | null,
  endDate: CalendarDate | null
): boolean {
  if (!startDate || !endDate) return false;

  const comparison = compareDates(date, startDate);
  if (comparison < 0) return false;

  const comparisonEnd = compareDates(date, endDate);
  if (comparisonEnd > 0) return false;

  return true;
}

/**
 * Check if a date is the start of the range
 */
export function isRangeStart(date: CalendarDate, startDate: CalendarDate | null): boolean {
  if (!startDate) return false;
  return isSameDate(date, startDate);
}

/**
 * Check if a date is the end of the range
 */
export function isRangeEnd(date: CalendarDate, endDate: CalendarDate | null): boolean {
  if (!endDate) return false;
  return isSameDate(date, endDate);
}

/**
 * Date range state reducer
 */
export function dateRangeReducer(state: DateRangeState, event: DateRangeEvent): DateRangeState {
  switch (event.type) {
    case 'SELECT_START': {
      const { date } = event;

      // Check if date is in valid range
      if (!isDateInRange(date, state.config.minDate, state.config.maxDate)) {
        return state;
      }

      // If selecting a new start after an end, check if it's before the end
      if (state.endDate && compareDates(date, state.endDate) > 0) {
        // Start is after current end, reset the range
        return {
          ...state,
          startDate: date,
          endDate: null,
          selectingEnd: true,
          focusedDate: date,
        };
      }

      return {
        ...state,
        startDate: date,
        selectingEnd: true,
        focusedDate: date,
      };
    }

    case 'SELECT_END': {
      const { date } = event;

      // Check if date is in valid range
      if (!isDateInRange(date, state.config.minDate, state.config.maxDate)) {
        return state;
      }

      // If no start date, treat this as selecting start
      if (!state.startDate) {
        return {
          ...state,
          startDate: date,
          selectingEnd: true,
          focusedDate: date,
        };
      }

      // If end is before start, swap them
      if (compareDates(date, state.startDate) < 0) {
        return {
          ...state,
          startDate: date,
          endDate: state.startDate,
          selectingEnd: false,
          focusedDate: date,
        };
      }

      return {
        ...state,
        endDate: date,
        selectingEnd: false,
        focusedDate: date,
      };
    }

    case 'HOVER_DATE': {
      // This could be used to show preview of range while hovering
      // For now, we just update focused date
      return {
        ...state,
        focusedDate: event.date,
      };
    }

    case 'CLEAR': {
      return {
        ...state,
        startDate: null,
        endDate: null,
        selectingEnd: false,
        focusedDate: getToday(state.config.calendarType),
      };
    }

    // Delegate to calendar reducer for navigation events
    default: {
      const calendarResult = calendarReducer(state, event as any);
      return {
        ...calendarResult,
        startDate: state.startDate,
        endDate: state.endDate,
        selectingEnd: state.selectingEnd,
      };
    }
  }
}

/**
 * Date range actions factory
 */
export function createDateRangeActions(dispatch: (event: DateRangeEvent) => void) {
  return {
    selectStart: (date: CalendarDate) => dispatch({ type: 'SELECT_START', date }),
    selectEnd: (date: CalendarDate) => dispatch({ type: 'SELECT_END', date }),
    hoverDate: (date: CalendarDate) => dispatch({ type: 'HOVER_DATE', date }),
    clear: () => dispatch({ type: 'CLEAR' }),
    focusDate: (date: CalendarDate) => dispatch({ type: 'FOCUS_DATE', date }),
    nextMonth: () => dispatch({ type: 'NEXT_MONTH' }),
    prevMonth: () => dispatch({ type: 'PREV_MONTH' }),
    nextYear: () => dispatch({ type: 'NEXT_YEAR' }),
    prevYear: () => dispatch({ type: 'PREV_YEAR' }),
    setViewMode: (mode: 'day' | 'month' | 'year') => dispatch({ type: 'SET_VIEW_MODE', mode }),
    goToToday: () => dispatch({ type: 'TODAY' }),
  };
}

/**
 * Type for date range actions
 */
export type DateRangeActions = ReturnType<typeof createDateRangeActions>;
