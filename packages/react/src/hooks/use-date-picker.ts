import * as React from 'react';
import {
  datePickerReducer,
  createInitialDatePickerState,
  createDatePickerActions,
  getWeeksInMonth,
  formatMonthYear,
  getWeekdayShortNames,
  formatDate,
  type DatePickerState,
  type DatePickerEvent,
  type CalendarConfig,
  type CalendarDate,
  type Week,
} from '@thaparoyal/calendar-core';

/**
 * Options for useDatePicker hook
 */
export interface UseDatePickerOptions {
  /** Initial calendar configuration */
  config?: Partial<CalendarConfig>;
  /** Initial selected date */
  defaultValue?: CalendarDate;
  /** Controlled selected date */
  value?: CalendarDate | null;
  /** Callback when date is selected */
  onValueChange?: (date: CalendarDate | null) => void;
  /** Dates that should be disabled */
  disabledDates?: CalendarDate[];
  /** Date format for input display */
  format?: string;
  /** Whether the picker is disabled */
  disabled?: boolean;
}

/**
 * Return type for useDatePicker hook
 */
export interface UseDatePickerReturn {
  /** Current date picker state */
  state: DatePickerState;
  /** Date picker actions */
  actions: ReturnType<typeof createDatePickerActions>;
  /** Weeks array for rendering calendar grid */
  weeks: Week[];
  /** Formatted month/year title */
  title: string;
  /** Weekday names for header */
  weekdayNames: readonly string[];
  /** Input props */
  inputProps: {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur: () => void;
    disabled?: boolean;
  };
  /** Trigger button props */
  triggerProps: {
    onClick: () => void;
    'aria-expanded': boolean;
    'aria-haspopup': 'dialog';
    disabled?: boolean;
  };
  /** Formatted selected date for display */
  formattedValue: string;
  /** Whether previous month navigation is disabled */
  isPrevMonthDisabled: boolean;
  /** Whether next month navigation is disabled */
  isNextMonthDisabled: boolean;
}

/**
 * Hook for date picker state management
 */
export function useDatePicker(options: UseDatePickerOptions = {}): UseDatePickerReturn {
  const {
    config,
    defaultValue,
    value,
    onValueChange,
    disabledDates,
    format = 'YYYY-MM-DD',
    disabled = false,
  } = options;

  // Controlled vs uncontrolled
  const isControlled = value !== undefined;

  // Initialize state
  const [internalState, dispatch] = React.useReducer(
    datePickerReducer,
    { config, initialDate: defaultValue },
    ({ config: cfg, initialDate }) => createInitialDatePickerState(cfg, initialDate)
  );

  // Handle controlled value
  const state = React.useMemo<DatePickerState>(() => {
    if (isControlled) {
      return {
        ...internalState,
        selectedDate: value,
        inputValue: value ? formatDate(value, format, internalState.config.locale) : '',
      };
    }
    return internalState;
  }, [internalState, isControlled, value, format]);

  // Wrap dispatch to handle onValueChange callback
  const wrappedDispatch = React.useCallback(
    (event: DatePickerEvent) => {
      if (event.type === 'SELECT_DATE' && onValueChange) {
        onValueChange(event.date);
      }
      if (event.type === 'CLEAR' && onValueChange) {
        onValueChange(null);
      }
      if (!isControlled || (event.type !== 'SELECT_DATE' && event.type !== 'CLEAR')) {
        dispatch(event);
      }
    },
    [isControlled, onValueChange]
  );

  // Create actions
  const actions = React.useMemo(
    () => createDatePickerActions(wrappedDispatch),
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

  // Compute weekday names
  const weekdayNames = React.useMemo(
    () => getWeekdayShortNames(state.config.locale),
    [state.config.locale]
  );

  // Compute formatted value
  const formattedValue = React.useMemo(() => {
    if (!state.selectedDate) return '';
    return formatDate(state.selectedDate, format, state.config.locale);
  }, [state.selectedDate, format, state.config.locale]);

  // Input props
  const inputProps = React.useMemo(
    () => ({
      value: state.inputValue,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        actions.onInputChange(e.target.value);
      },
      onBlur: () => {
        actions.onInputBlur();
      },
      disabled,
    }),
    [state.inputValue, actions, disabled]
  );

  // Trigger props
  const triggerProps = React.useMemo(
    () => ({
      onClick: () => {
        if (!disabled) {
          actions.toggle();
        }
      },
      'aria-expanded': state.isOpen,
      'aria-haspopup': 'dialog' as const,
      disabled,
    }),
    [state.isOpen, actions, disabled]
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
    inputProps,
    triggerProps,
    formattedValue,
    isPrevMonthDisabled,
    isNextMonthDisabled,
  };
}
