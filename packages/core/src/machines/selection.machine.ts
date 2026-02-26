/**
 * Unified Selection State Machine
 *
 * Supports single, range, and multiple date selection modes.
 * This is the recommended machine for new calendar implementations.
 */

import type {
  CalendarState,
  CalendarEvent,
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
 * Selection mode types
 */
export type SelectionMode = 'single' | 'range' | 'multiple';

/**
 * Date range value
 */
export interface DateRangeValue {
  start: CalendarDate | null;
  end: CalendarDate | null;
}

/**
 * Unified selection state
 */
export interface SelectionState extends CalendarState {
  selectionMode: SelectionMode;
  // Single mode (inherited from CalendarState)
  // selectedDate: CalendarDate | null;
  // Range mode
  startDate: CalendarDate | null;
  endDate: CalendarDate | null;
  selectingEnd: boolean;
  hoveredDate: CalendarDate | null;
  // Multiple mode
  selectedDates: CalendarDate[];
}

/**
 * Selection events
 */
export type SelectionEvent =
  | CalendarEvent
  | { type: 'SELECT'; date: CalendarDate }
  | { type: 'TOGGLE'; date: CalendarDate }
  | { type: 'HOVER'; date: CalendarDate | null }
  | { type: 'CLEAR' }
  | { type: 'CLEAR_ALL' }
  | { type: 'SET_SELECTION_MODE'; mode: SelectionMode }
  | { type: 'SET_RANGE'; start: CalendarDate | null; end: CalendarDate | null }
  | { type: 'SET_DATES'; dates: CalendarDate[] };

/**
 * Selection configuration
 */
export interface SelectionConfig extends CalendarConfig {
  selectionMode?: SelectionMode;
  maxSelections?: number; // For multiple mode
  allowSameDay?: boolean; // For range mode - allow start and end on same day
}

/**
 * Create initial selection state
 */
export function createInitialSelectionState(
  config: Partial<SelectionConfig> = {},
  initialValue?: CalendarDate | DateRangeValue | CalendarDate[] | null
): SelectionState {
  const { selectionMode = 'single', ...calendarConfig } = config;
  const calendarState = createCalendarInitialState(calendarConfig);

  let selectedDate: CalendarDate | null = null;
  let startDate: CalendarDate | null = null;
  let endDate: CalendarDate | null = null;
  let selectedDates: CalendarDate[] = [];

  if (initialValue) {
    if (selectionMode === 'single' && !Array.isArray(initialValue) && !('start' in initialValue)) {
      selectedDate = initialValue as CalendarDate;
    } else if (selectionMode === 'range' && initialValue && 'start' in initialValue) {
      const rangeValue = initialValue as DateRangeValue;
      startDate = rangeValue.start;
      endDate = rangeValue.end;
    } else if (selectionMode === 'multiple' && Array.isArray(initialValue)) {
      selectedDates = initialValue;
    }
  }

  return {
    ...calendarState,
    selectedDate,
    selectionMode,
    startDate,
    endDate,
    selectingEnd: false,
    hoveredDate: null,
    selectedDates,
  };
}

/**
 * Check if a date is in the selected dates array
 */
export function isDateMultiSelected(date: CalendarDate, selectedDates: CalendarDate[]): boolean {
  return selectedDates.some(d => isSameDate(d, date));
}

/**
 * Check if a date is within the selected range (including preview)
 */
export function isDateInSelectionRange(
  date: CalendarDate,
  startDate: CalendarDate | null,
  endDate: CalendarDate | null,
  hoveredDate: CalendarDate | null,
  selectingEnd: boolean
): boolean {
  if (!startDate) return false;

  const effectiveEnd = selectingEnd && hoveredDate ? hoveredDate : endDate;
  if (!effectiveEnd) return false;

  // Handle case where hovered date is before start
  let rangeStart = startDate;
  let rangeEnd = effectiveEnd;
  if (compareDates(rangeEnd, rangeStart) < 0) {
    [rangeStart, rangeEnd] = [rangeEnd, rangeStart];
  }

  const compStart = compareDates(date, rangeStart);
  const compEnd = compareDates(date, rangeEnd);

  return compStart >= 0 && compEnd <= 0;
}

/**
 * Check if date is the start of range
 */
export function isSelectionRangeStart(
  date: CalendarDate,
  startDate: CalendarDate | null,
  endDate: CalendarDate | null,
  hoveredDate: CalendarDate | null,
  selectingEnd: boolean
): boolean {
  if (!startDate) return false;

  const effectiveEnd = selectingEnd && hoveredDate ? hoveredDate : endDate;

  // If no end, start is whatever startDate is
  if (!effectiveEnd) {
    return isSameDate(date, startDate);
  }

  // Determine actual start (may be swapped if end < start)
  const actualStart = compareDates(effectiveEnd, startDate) < 0 ? effectiveEnd : startDate;
  return isSameDate(date, actualStart);
}

/**
 * Check if date is the end of range
 */
export function isSelectionRangeEnd(
  date: CalendarDate,
  startDate: CalendarDate | null,
  endDate: CalendarDate | null,
  hoveredDate: CalendarDate | null,
  selectingEnd: boolean
): boolean {
  if (!startDate) return false;

  const effectiveEnd = selectingEnd && hoveredDate ? hoveredDate : endDate;
  if (!effectiveEnd) return false;

  // Determine actual end (may be swapped if end < start)
  const actualEnd = compareDates(effectiveEnd, startDate) < 0 ? startDate : effectiveEnd;
  return isSameDate(date, actualEnd);
}

/**
 * Check if date is in the middle of range (not start or end)
 */
export function isSelectionRangeMiddle(
  date: CalendarDate,
  startDate: CalendarDate | null,
  endDate: CalendarDate | null,
  hoveredDate: CalendarDate | null,
  selectingEnd: boolean
): boolean {
  return (
    isDateInSelectionRange(date, startDate, endDate, hoveredDate, selectingEnd) &&
    !isSelectionRangeStart(date, startDate, endDate, hoveredDate, selectingEnd) &&
    !isSelectionRangeEnd(date, startDate, endDate, hoveredDate, selectingEnd)
  );
}

/**
 * Selection state reducer
 */
export function selectionReducer(state: SelectionState, event: SelectionEvent): SelectionState {
  switch (event.type) {
    case 'SELECT': {
      const { date } = event;

      // Check if date is in valid range
      if (!isDateInRange(date, state.config.minDate, state.config.maxDate)) {
        return state;
      }

      switch (state.selectionMode) {
        case 'single':
          return {
            ...state,
            selectedDate: date,
            focusedDate: date,
            viewMode: 'day',
          };

        case 'range':
          // If no start date or we've completed a selection, start new range
          if (!state.startDate || (!state.selectingEnd && state.endDate)) {
            return {
              ...state,
              startDate: date,
              endDate: null,
              selectingEnd: true,
              focusedDate: date,
              hoveredDate: null,
            };
          }

          // Selecting end date
          if (state.selectingEnd) {
            let newStart = state.startDate;
            let newEnd = date;

            // Swap if end is before start
            if (compareDates(newEnd, newStart) < 0) {
              [newStart, newEnd] = [newEnd, newStart];
            }

            return {
              ...state,
              startDate: newStart,
              endDate: newEnd,
              selectingEnd: false,
              focusedDate: date,
              hoveredDate: null,
            };
          }

          return state;

        case 'multiple':
          // Toggle date in selection
          const isAlreadySelected = isDateMultiSelected(date, state.selectedDates);
          let newSelectedDates: CalendarDate[];

          if (isAlreadySelected) {
            newSelectedDates = state.selectedDates.filter(d => !isSameDate(d, date));
          } else {
            newSelectedDates = [...state.selectedDates, date];
          }

          return {
            ...state,
            selectedDates: newSelectedDates,
            focusedDate: date,
          };

        default:
          return state;
      }
    }

    case 'TOGGLE': {
      const { date } = event;

      if (!isDateInRange(date, state.config.minDate, state.config.maxDate)) {
        return state;
      }

      // Toggle is primarily for multiple mode
      if (state.selectionMode === 'multiple') {
        const isAlreadySelected = isDateMultiSelected(date, state.selectedDates);
        let newSelectedDates: CalendarDate[];

        if (isAlreadySelected) {
          newSelectedDates = state.selectedDates.filter(d => !isSameDate(d, date));
        } else {
          newSelectedDates = [...state.selectedDates, date];
        }

        return {
          ...state,
          selectedDates: newSelectedDates,
          focusedDate: date,
        };
      }

      // For single mode, toggle means select or clear
      if (state.selectionMode === 'single') {
        const isSelected = state.selectedDate && isSameDate(state.selectedDate, date);
        return {
          ...state,
          selectedDate: isSelected ? null : date,
          focusedDate: date,
        };
      }

      return state;
    }

    case 'HOVER': {
      return {
        ...state,
        hoveredDate: event.date,
      };
    }

    case 'CLEAR': {
      return {
        ...state,
        selectedDate: null,
        startDate: null,
        endDate: null,
        selectingEnd: false,
        hoveredDate: null,
        selectedDates: [],
      };
    }

    case 'CLEAR_ALL': {
      return {
        ...state,
        selectedDate: null,
        startDate: null,
        endDate: null,
        selectingEnd: false,
        hoveredDate: null,
        selectedDates: [],
        focusedDate: getToday(state.config.calendarType),
      };
    }

    case 'SET_SELECTION_MODE': {
      return {
        ...state,
        selectionMode: event.mode,
        // Clear selections when changing mode
        selectedDate: null,
        startDate: null,
        endDate: null,
        selectingEnd: false,
        hoveredDate: null,
        selectedDates: [],
      };
    }

    case 'SET_RANGE': {
      return {
        ...state,
        startDate: event.start,
        endDate: event.end,
        selectingEnd: false,
        hoveredDate: null,
      };
    }

    case 'SET_DATES': {
      return {
        ...state,
        selectedDates: event.dates,
      };
    }

    // Delegate navigation and other events to calendar reducer
    default: {
      const calendarResult = calendarReducer(state, event as CalendarEvent);
      return {
        ...state,
        ...calendarResult,
        // Preserve selection state
        selectionMode: state.selectionMode,
        startDate: state.startDate,
        endDate: state.endDate,
        selectingEnd: state.selectingEnd,
        hoveredDate: state.hoveredDate,
        selectedDates: state.selectedDates,
      };
    }
  }
}

/**
 * Selection actions factory
 */
export function createSelectionActions(dispatch: (event: SelectionEvent) => void) {
  return {
    // Selection actions
    select: (date: CalendarDate) => dispatch({ type: 'SELECT', date }),
    toggle: (date: CalendarDate) => dispatch({ type: 'TOGGLE', date }),
    hover: (date: CalendarDate | null) => dispatch({ type: 'HOVER', date }),
    clear: () => dispatch({ type: 'CLEAR' }),
    clearAll: () => dispatch({ type: 'CLEAR_ALL' }),
    setSelectionMode: (mode: SelectionMode) => dispatch({ type: 'SET_SELECTION_MODE', mode }),
    setRange: (start: CalendarDate | null, end: CalendarDate | null) =>
      dispatch({ type: 'SET_RANGE', start, end }),
    setDates: (dates: CalendarDate[]) => dispatch({ type: 'SET_DATES', dates }),

    // Navigation actions (delegated to calendar)
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
 * Type for selection actions
 */
export type SelectionActions = ReturnType<typeof createSelectionActions>;

/**
 * Get the current selection value based on mode
 */
export function getSelectionValue(
  state: SelectionState
): CalendarDate | DateRangeValue | CalendarDate[] | null {
  switch (state.selectionMode) {
    case 'single':
      return state.selectedDate;
    case 'range':
      return { start: state.startDate, end: state.endDate };
    case 'multiple':
      return state.selectedDates;
    default:
      return null;
  }
}
