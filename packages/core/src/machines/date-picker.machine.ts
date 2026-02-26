/**
 * Date Picker State Machine
 *
 * Extends the calendar state machine with input handling and popup state.
 */

import type {
  DatePickerState,
  DatePickerEvent,
  CalendarConfig,
  CalendarDate,
} from '../types';
import {
  calendarReducer,
  createInitialState as createCalendarInitialState,
} from './calendar.machine';
import { formatDate, parseDate } from '../utils/format';
import { isDateInRange, getToday } from '../utils/calendar-utils';

/**
 * Create initial date picker state
 */
export function createInitialDatePickerState(
  config: Partial<CalendarConfig> = {},
  initialDate?: CalendarDate
): DatePickerState {
  const calendarState = createCalendarInitialState(config, initialDate);

  return {
    ...calendarState,
    isOpen: false,
    inputValue: initialDate ? formatDate(initialDate, 'YYYY-MM-DD', calendarState.config.locale) : '',
  };
}

/**
 * Date picker state reducer
 */
export function datePickerReducer(state: DatePickerState, event: DatePickerEvent): DatePickerState {
  switch (event.type) {
    case 'OPEN': {
      return {
        ...state,
        isOpen: true,
      };
    }

    case 'CLOSE': {
      return {
        ...state,
        isOpen: false,
      };
    }

    case 'TOGGLE': {
      return {
        ...state,
        isOpen: !state.isOpen,
      };
    }

    case 'INPUT_CHANGE': {
      return {
        ...state,
        inputValue: event.value,
      };
    }

    case 'INPUT_BLUR': {
      // Try to parse the input value
      const parsed = parseDate(state.inputValue, state.config.calendarType);

      if (parsed && isDateInRange(parsed, state.config.minDate, state.config.maxDate)) {
        return {
          ...state,
          selectedDate: parsed,
          focusedDate: parsed,
          inputValue: formatDate(parsed, 'YYYY-MM-DD', state.config.locale),
        };
      }

      // If parsing failed or date is out of range, restore the previous value
      if (state.selectedDate) {
        return {
          ...state,
          inputValue: formatDate(state.selectedDate, 'YYYY-MM-DD', state.config.locale),
        };
      }

      return {
        ...state,
        inputValue: '',
      };
    }

    case 'CLEAR': {
      return {
        ...state,
        selectedDate: null,
        inputValue: '',
        focusedDate: getToday(state.config.calendarType),
      };
    }

    case 'SELECT_DATE': {
      // Handle date selection from calendar
      const calendarResult = calendarReducer(state, event);

      return {
        ...calendarResult,
        isOpen: state.isOpen,
        inputValue: event.date
          ? formatDate(event.date, 'YYYY-MM-DD', state.config.locale)
          : state.inputValue,
        isOpen: false, // Close after selection
      };
    }

    // Delegate to calendar reducer for other events
    default: {
      const calendarResult = calendarReducer(state, event as any);
      return {
        ...calendarResult,
        isOpen: state.isOpen,
        inputValue: state.inputValue,
      };
    }
  }
}

/**
 * Date picker actions factory
 */
export function createDatePickerActions(dispatch: (event: DatePickerEvent) => void) {
  return {
    open: () => dispatch({ type: 'OPEN' }),
    close: () => dispatch({ type: 'CLOSE' }),
    toggle: () => dispatch({ type: 'TOGGLE' }),
    onInputChange: (value: string) => dispatch({ type: 'INPUT_CHANGE', value }),
    onInputBlur: () => dispatch({ type: 'INPUT_BLUR' }),
    clear: () => dispatch({ type: 'CLEAR' }),
    selectDate: (date: CalendarDate) => dispatch({ type: 'SELECT_DATE', date }),
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
 * Type for date picker actions
 */
export type DatePickerActions = ReturnType<typeof createDatePickerActions>;
