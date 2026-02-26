import * as React from 'react';
import {
  selectionReducer,
  createInitialSelectionState,
  createSelectionActions,
  getSelectionValue,
  type SelectionState,
  type SelectionEvent,
  type SelectionConfig,
  type SelectionActions,
  type CalendarDate,
  type DateRangeValue,
  type SelectionMode,
} from '@thaparoyal/calendar-core';

/**
 * Options for useSelection hook
 */
export interface UseSelectionOptions {
  /** Selection mode */
  mode?: SelectionMode;
  /** Calendar configuration */
  config?: SelectionConfig;
  /** Default value (uncontrolled) */
  defaultValue?: CalendarDate | CalendarDate[] | DateRangeValue | null;
  /** Controlled value */
  value?: CalendarDate | CalendarDate[] | DateRangeValue | null;
  /** Callback when selection changes */
  onValueChange?: (value: CalendarDate | CalendarDate[] | DateRangeValue | null) => void;
  /** Disabled dates */
  disabledDates?: CalendarDate[];
}

/**
 * Return type for useSelection hook
 */
export interface UseSelectionReturn {
  /** Current selection state */
  state: SelectionState;
  /** Selection actions */
  actions: SelectionActions;
  /** Dispatch function for direct event dispatching */
  dispatch: (event: SelectionEvent) => void;
  /** Current selection value (normalized) */
  value: CalendarDate | CalendarDate[] | DateRangeValue | null;
  /** Whether selection is complete (for range: both dates selected) */
  isComplete: boolean;
}

/**
 * Parse default value based on mode
 */
function parseDefaultValue(
  mode: SelectionMode,
  value: CalendarDate | CalendarDate[] | DateRangeValue | null | undefined
): { selectedDate?: CalendarDate | null; selectedDates?: CalendarDate[]; startDate?: CalendarDate | null; endDate?: CalendarDate | null } {
  if (!value) return {};

  switch (mode) {
    case 'single':
      return { selectedDate: value as CalendarDate };
    case 'multiple':
      return { selectedDates: value as CalendarDate[] };
    case 'range':
      const rangeValue = value as DateRangeValue;
      return { startDate: rangeValue.start, endDate: rangeValue.end };
    default:
      return {};
  }
}

/**
 * Hook for unified selection state management
 *
 * Supports single, range, and multiple selection modes with a consistent API.
 *
 * @example
 * ```tsx
 * // Single selection
 * const { state, actions, value } = useSelection({ mode: 'single' });
 *
 * // Range selection
 * const { state, actions, value, isComplete } = useSelection({
 *   mode: 'range',
 *   onValueChange: (range) => console.log(range),
 * });
 *
 * // Multiple selection
 * const { state, actions, value } = useSelection({
 *   mode: 'multiple',
 *   defaultValue: [date1, date2],
 * });
 * ```
 */
export function useSelection(options: UseSelectionOptions = {}): UseSelectionReturn {
  const {
    mode = 'single',
    config,
    defaultValue,
    value,
    onValueChange,
  } = options;

  const isControlled = value !== undefined;
  const parsedDefault = parseDefaultValue(mode, defaultValue);

  // Initialize state
  const [internalState, dispatch] = React.useReducer(
    selectionReducer,
    {
      selectionMode: mode,
      config,
      ...parsedDefault,
    },
    (init) => createInitialSelectionState({ selectionMode: init.selectionMode, ...init.config }, init.selectedDate)
  );

  // Apply controlled value
  const state = React.useMemo<SelectionState>(() => {
    if (!isControlled) return internalState;

    const parsed = parseDefaultValue(mode, value);
    return {
      ...internalState,
      selectedDate: parsed.selectedDate ?? internalState.selectedDate,
      selectedDates: parsed.selectedDates ?? internalState.selectedDates,
      startDate: parsed.startDate ?? internalState.startDate,
      endDate: parsed.endDate ?? internalState.endDate,
    };
  }, [internalState, isControlled, value, mode]);

  // Handle value change callback
  const wrappedDispatch = React.useCallback(
    (event: SelectionEvent) => {
      dispatch(event);

      // Call onValueChange if selection changed
      if (onValueChange) {
        const newState = selectionReducer(state, event);
        const newValue = getSelectionValue(newState);
        onValueChange(newValue);
      }
    },
    [state, onValueChange]
  );

  // Create actions
  const actions = React.useMemo(
    () => createSelectionActions(wrappedDispatch),
    [wrappedDispatch]
  );

  // Compute current value
  const currentValue = React.useMemo(
    () => getSelectionValue(state),
    [state]
  );

  // Compute completion state (for range)
  const isComplete = React.useMemo(() => {
    if (mode !== 'range') return true;
    return state.startDate !== null && state.endDate !== null;
  }, [mode, state.startDate, state.endDate]);

  return {
    state,
    actions,
    dispatch: wrappedDispatch,
    value: currentValue,
    isComplete,
  };
}
