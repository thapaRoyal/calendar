/**
 * Calendar State Machine
 *
 * A framework-agnostic state machine for calendar component logic.
 * This can be consumed by React, Vue, Svelte, or any other framework.
 */

import type {
  CalendarState,
  CalendarEvent,
  CalendarConfig,
  CalendarDate,
  CalendarType,
} from '../types';
import {
  getNextMonth,
  getPrevMonth,
  getNextYear,
  getPrevYear,
  getToday,
  isDateInRange,
} from '../utils/calendar-utils';

/**
 * Default calendar configuration
 */
export const defaultCalendarConfig: CalendarConfig = {
  calendarType: 'BS',
  locale: 'en',
  weekStartsOn: 0, // Sunday
};

/**
 * Create initial calendar state
 */
export function createInitialState(
  config: Partial<CalendarConfig> = {},
  initialDate?: CalendarDate
): CalendarState {
  const mergedConfig = { ...defaultCalendarConfig, ...config };
  const today = initialDate || getToday(mergedConfig.calendarType);

  return {
    focusedDate: today,
    selectedDate: null,
    viewMode: 'day',
    config: mergedConfig,
  };
}

/**
 * Calendar state reducer
 */
export function calendarReducer(state: CalendarState, event: CalendarEvent): CalendarState {
  switch (event.type) {
    case 'SELECT_DATE': {
      const { date } = event;

      // Check if date is in valid range
      if (!isDateInRange(date, state.config.minDate, state.config.maxDate)) {
        return state;
      }

      return {
        ...state,
        selectedDate: date,
        focusedDate: date,
        viewMode: 'day',
      };
    }

    case 'FOCUS_DATE': {
      return {
        ...state,
        focusedDate: event.date,
      };
    }

    case 'NEXT_MONTH': {
      const nextMonth = getNextMonth(state.focusedDate);

      // Check if we can navigate to next month (maxDate constraint)
      if (state.config.maxDate) {
        if (nextMonth.year > state.config.maxDate.year) {
          return state;
        }
        if (
          nextMonth.year === state.config.maxDate.year &&
          nextMonth.month > state.config.maxDate.month
        ) {
          return state;
        }
      }

      return {
        ...state,
        focusedDate: nextMonth,
      };
    }

    case 'PREV_MONTH': {
      const prevMonth = getPrevMonth(state.focusedDate);

      // Check if we can navigate to previous month (minDate constraint)
      if (state.config.minDate) {
        if (prevMonth.year < state.config.minDate.year) {
          return state;
        }
        if (
          prevMonth.year === state.config.minDate.year &&
          prevMonth.month < state.config.minDate.month
        ) {
          return state;
        }
      }

      return {
        ...state,
        focusedDate: prevMonth,
      };
    }

    case 'NEXT_YEAR': {
      const nextYear = getNextYear(state.focusedDate);

      // Check maxDate constraint
      if (state.config.maxDate && nextYear.year > state.config.maxDate.year) {
        return state;
      }

      return {
        ...state,
        focusedDate: nextYear,
      };
    }

    case 'PREV_YEAR': {
      const prevYear = getPrevYear(state.focusedDate);

      // Check minDate constraint
      if (state.config.minDate && prevYear.year < state.config.minDate.year) {
        return state;
      }

      return {
        ...state,
        focusedDate: prevYear,
      };
    }

    case 'SET_VIEW_MODE': {
      return {
        ...state,
        viewMode: event.mode,
      };
    }

    case 'SET_CALENDAR_TYPE': {
      // When changing calendar type, we need to convert the current dates
      const newCalendarType = event.calendarType;

      // For simplicity, we'll reset to today in the new calendar
      // In a real implementation, you'd convert the dates
      const today = getToday(newCalendarType);

      return {
        ...state,
        focusedDate: { ...today },
        selectedDate: state.selectedDate
          ? { ...state.selectedDate, calendarType: newCalendarType }
          : null,
        config: {
          ...state.config,
          calendarType: newCalendarType,
        },
      };
    }

    case 'TODAY': {
      const today = getToday(state.config.calendarType);

      // Check if today is in valid range
      if (!isDateInRange(today, state.config.minDate, state.config.maxDate)) {
        return {
          ...state,
          focusedDate: today,
        };
      }

      return {
        ...state,
        focusedDate: today,
        selectedDate: today,
        viewMode: 'day',
      };
    }

    default:
      return state;
  }
}

/**
 * Calendar actions factory
 */
export function createCalendarActions(
  dispatch: (event: CalendarEvent) => void
) {
  return {
    selectDate: (date: CalendarDate) => dispatch({ type: 'SELECT_DATE', date }),
    focusDate: (date: CalendarDate) => dispatch({ type: 'FOCUS_DATE', date }),
    nextMonth: () => dispatch({ type: 'NEXT_MONTH' }),
    prevMonth: () => dispatch({ type: 'PREV_MONTH' }),
    nextYear: () => dispatch({ type: 'NEXT_YEAR' }),
    prevYear: () => dispatch({ type: 'PREV_YEAR' }),
    setViewMode: (mode: 'day' | 'month' | 'year') => dispatch({ type: 'SET_VIEW_MODE', mode }),
    setCalendarType: (calendarType: CalendarType) =>
      dispatch({ type: 'SET_CALENDAR_TYPE', calendarType }),
    goToToday: () => dispatch({ type: 'TODAY' }),
  };
}

/**
 * Type for calendar actions
 */
export type CalendarActions = ReturnType<typeof createCalendarActions>;
