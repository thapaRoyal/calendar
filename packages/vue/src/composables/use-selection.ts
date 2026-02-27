import { ref, computed, watch, type Ref } from 'vue';
import {
  selectionReducer,
  createInitialSelectionState,
  createSelectionActions,
  getSelectionValue,
  getWeeksInMonth,
  formatMonthYear,
  getWeekdayMinNames,
  formatDay,
  enhanceWeekDayWithSelection,
  type SelectionState,
  type SelectionEvent,
  type SelectionConfig,
  type SelectionActions,
  type CalendarDate,
  type DateRangeValue,
  type SelectionMode,
  type Week,
  type Locale,
} from '@thaparoyal/calendar-core';

/**
 * Options for useSelection composable
 */
export interface UseSelectionOptions {
  mode?: SelectionMode;
  config?: Partial<SelectionConfig>;
  defaultValue?: CalendarDate | CalendarDate[] | DateRangeValue | null;
  modelValue?: Ref<CalendarDate | CalendarDate[] | DateRangeValue | null>;
  onValueChange?: (value: CalendarDate | CalendarDate[] | DateRangeValue | null) => void;
  disabledDates?: CalendarDate[];
}

/**
 * Composable for unified selection state management (single, range, multiple)
 */
export function useSelection(options: UseSelectionOptions = {}) {
  const {
    mode = 'single',
    config,
    defaultValue,
    modelValue,
    onValueChange,
    disabledDates = [],
  } = options;

  // Build selection config with mode
  const selectionConfig: Partial<SelectionConfig> = {
    ...config,
    selectionMode: mode,
  };

  // Internal state
  const state = ref<SelectionState>(
    createInitialSelectionState(selectionConfig, defaultValue ?? undefined)
  );

  // Dispatch function with value change callback
  const dispatch = (event: SelectionEvent) => {
    state.value = selectionReducer(state.value, event);

    // Notify value change after dispatch
    if (onValueChange) {
      const currentValue = getSelectionValue(state.value);
      onValueChange(currentValue);
    }
  };

  // Actions
  const actions: SelectionActions = createSelectionActions(dispatch);

  // Watch for external model changes
  if (modelValue) {
    watch(modelValue, (newValue) => {
      if (newValue === null || newValue === undefined) {
        dispatch({ type: 'CLEAR' });
        return;
      }

      const currentMode = state.value.selectionMode;

      if (currentMode === 'single' && !Array.isArray(newValue) && !('start' in newValue)) {
        state.value = {
          ...state.value,
          selectedDate: newValue as CalendarDate,
        };
      } else if (currentMode === 'range' && newValue && 'start' in newValue) {
        const rangeValue = newValue as DateRangeValue;
        state.value = {
          ...state.value,
          startDate: rangeValue.start,
          endDate: rangeValue.end,
          selectingEnd: false,
        };
      } else if (currentMode === 'multiple' && Array.isArray(newValue)) {
        state.value = {
          ...state.value,
          selectedDates: newValue as CalendarDate[],
        };
      }
    });
  }

  // Computed: weeks enhanced with selection state
  const weeks = computed<Week[]>(() => {
    const baseWeeks = getWeeksInMonth(
      state.value.focusedDate.year,
      state.value.focusedDate.month,
      state.value.config.calendarType,
      state.value.config,
      state.value.selectedDate,
      disabledDates
    );

    // Enhance with selection state (range highlights, multi-select flags)
    return baseWeeks.map(week =>
      week.map(day => enhanceWeekDayWithSelection(day, state.value))
    );
  });

  // Computed: month/year title
  const title = computed(() =>
    formatMonthYear(
      state.value.focusedDate.year,
      state.value.focusedDate.month,
      state.value.config.calendarType,
      state.value.config.locale
    )
  );

  // Computed: weekday header names
  const weekdayNames = computed(() => getWeekdayMinNames(state.value.config.locale));

  // Computed: current locale
  const locale = computed<Locale>(() => state.value.config.locale);

  // Format day number with locale
  const formatDayNumber = (day: number) => formatDay(day, state.value.config.locale);

  // Computed: current selection value
  const value = computed(() => getSelectionValue(state.value));

  // Computed: whether selection is complete
  const isComplete = computed(() => {
    switch (state.value.selectionMode) {
      case 'single':
        return state.value.selectedDate !== null;
      case 'range':
        return state.value.startDate !== null && state.value.endDate !== null;
      case 'multiple':
        return state.value.selectedDates.length > 0;
      default:
        return false;
    }
  });

  // Computed: navigation constraints
  const isPrevMonthDisabled = computed(() => {
    if (!state.value.config.minDate) return false;
    const { year, month } = state.value.focusedDate;
    return (
      year < state.value.config.minDate.year ||
      (year === state.value.config.minDate.year && month <= state.value.config.minDate.month)
    );
  });

  const isNextMonthDisabled = computed(() => {
    if (!state.value.config.maxDate) return false;
    const { year, month } = state.value.focusedDate;
    return (
      year > state.value.config.maxDate.year ||
      (year === state.value.config.maxDate.year && month >= state.value.config.maxDate.month)
    );
  });

  return {
    state,
    actions,
    dispatch,
    weeks,
    title,
    weekdayNames,
    locale,
    formatDayNumber,
    value,
    isComplete,
    isPrevMonthDisabled,
    isNextMonthDisabled,
  };
}
