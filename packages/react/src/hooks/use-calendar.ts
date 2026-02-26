import * as React from 'react';
import {
  calendarReducer,
  createInitialState,
  createCalendarActions,
  getWeeksInMonth,
  formatMonthYear,
  getWeekdayMinNames,
  formatDay,
  type CalendarState,
  type CalendarEvent,
  type CalendarConfig,
  type CalendarDate,
  type Week,
  type Locale,
} from '@thaparoyal/calendar-core';

/**
 * Options for useCalendar hook
 */
export interface UseCalendarOptions {
  /** Initial calendar configuration */
  config?: Partial<CalendarConfig>;
  /** Initial selected date */
  defaultValue?: CalendarDate;
  /** Controlled selected date */
  value?: CalendarDate | null;
  /** Callback when date is selected */
  onValueChange?: (date: CalendarDate) => void;
  /** Dates that should be disabled */
  disabledDates?: CalendarDate[];
}

/**
 * Return type for useCalendar hook
 */
export interface UseCalendarReturn {
  /** Current calendar state */
  state: CalendarState;
  /** Calendar actions */
  actions: ReturnType<typeof createCalendarActions>;
  /** Weeks array for rendering calendar grid */
  weeks: Week[];
  /** Formatted month/year title */
  title: string;
  /** Weekday names for header */
  weekdayNames: readonly string[];
  /** Whether previous month navigation is disabled */
  isPrevMonthDisabled: boolean;
  /** Whether next month navigation is disabled */
  isNextMonthDisabled: boolean;
  /** Current locale */
  locale: Locale;
  /** Format a day number according to locale */
  formatDayNumber: (day: number) => string;
}

/**
 * Hook for calendar state management
 */
export function useCalendar(options: UseCalendarOptions = {}): UseCalendarReturn {
  const {
    config,
    defaultValue,
    value,
    onValueChange,
    disabledDates,
  } = options;

  // Controlled vs uncontrolled
  const isControlled = value !== undefined;

  // Initialize state
  const [internalState, dispatch] = React.useReducer(
    calendarReducer,
    { config, initialDate: defaultValue },
    ({ config: cfg, initialDate }) => createInitialState(cfg, initialDate)
  );

  // Handle controlled value
  const state = React.useMemo<CalendarState>(() => {
    if (isControlled) {
      return {
        ...internalState,
        selectedDate: value,
      };
    }
    return internalState;
  }, [internalState, isControlled, value]);

  // Wrap dispatch to handle onValueChange callback
  const wrappedDispatch = React.useCallback(
    (event: CalendarEvent) => {
      if (event.type === 'SELECT_DATE' && onValueChange) {
        onValueChange(event.date);
      }
      if (!isControlled || event.type !== 'SELECT_DATE') {
        dispatch(event);
      }
    },
    [isControlled, onValueChange]
  );

  // Create actions
  const actions = React.useMemo(
    () => createCalendarActions(wrappedDispatch),
    [wrappedDispatch]
  );

  // Compute weeks for the current month
  const weeks = React.useMemo(
    () =>
      getWeeksInMonth(
        state.focusedDate.year,
        state.focusedDate.month,
        state.config.calendarType,
        state.config,
        state.selectedDate,
        disabledDates
      ),
    [state.focusedDate, state.config, state.selectedDate, disabledDates]
  );

  // Compute title
  const title = React.useMemo(
    () =>
      formatMonthYear(
        state.focusedDate.year,
        state.focusedDate.month,
        state.config.calendarType,
        state.config.locale
      ),
    [state.focusedDate, state.config.calendarType, state.config.locale]
  );

  // Compute weekday names (using minimal/short names for cleaner UI)
  const weekdayNames = React.useMemo(
    () => getWeekdayMinNames(state.config.locale),
    [state.config.locale]
  );

  // Format day number with locale support (Nepali numerals when locale is 'ne')
  const formatDayNumber = React.useCallback(
    (day: number) => formatDay(day, state.config.locale),
    [state.config.locale]
  );

  // Compute navigation disabled states
  const isPrevMonthDisabled = React.useMemo(() => {
    if (!state.config.minDate) return false;
    const { year, month } = state.focusedDate;
    return (
      year < state.config.minDate.year ||
      (year === state.config.minDate.year && month <= state.config.minDate.month)
    );
  }, [state.focusedDate, state.config.minDate]);

  const isNextMonthDisabled = React.useMemo(() => {
    if (!state.config.maxDate) return false;
    const { year, month } = state.focusedDate;
    return (
      year > state.config.maxDate.year ||
      (year === state.config.maxDate.year && month >= state.config.maxDate.month)
    );
  }, [state.focusedDate, state.config.maxDate]);

  return {
    state,
    actions,
    weeks,
    title,
    weekdayNames,
    isPrevMonthDisabled,
    isNextMonthDisabled,
    locale: state.config.locale,
    formatDayNumber,
  };
}
