import { ref, computed, watch, type Ref } from 'vue';
import {
  selectionReducer,
  createInitialSelectionState,
  createSelectionActions,
  getSelectionValue,
  getMultiMonthWeeks,
  getMultiMonthTitles,
  canNavigatePrev,
  canNavigateNext,
  navigateMultiCalendar,
  getWeekdayMinNames,
  formatDay,
  type SelectionState,
  type SelectionEvent,
  type SelectionConfig,
  type SelectionActions,
  type CalendarDate,
  type DateRangeValue,
  type SelectionMode,
  type MultiCalendarConfig,
  type Week,
  type Locale,
} from '@thaparoyal/calendar-core';

/**
 * Options for useMultiCalendar composable
 */
export interface UseMultiCalendarOptions {
  numberOfMonths?: number;
  mode?: SelectionMode;
  config?: Partial<SelectionConfig>;
  pagedNavigation?: boolean;
  defaultValue?: CalendarDate | CalendarDate[] | DateRangeValue | null;
  modelValue?: Ref<CalendarDate | CalendarDate[] | DateRangeValue | null>;
  onValueChange?: (value: CalendarDate | CalendarDate[] | DateRangeValue | null) => void;
  disabledDates?: CalendarDate[];
}

/**
 * Represents a single month in the multi-calendar display
 */
export interface MultiCalendarMonth {
  year: number;
  month: number;
  title: string;
  weeks: Week[];
}

/**
 * Composable for multi-calendar (side-by-side months) with unified selection
 */
export function useMultiCalendar(options: UseMultiCalendarOptions = {}) {
  const {
    numberOfMonths = 2,
    mode = 'single',
    config,
    pagedNavigation = false,
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

  // Actions from selection machine
  const baseActions: SelectionActions = createSelectionActions(dispatch);

  // Custom navigation: offset by 1 or numberOfMonths depending on pagedNavigation
  const nextMonth = () => {
    const newFocused = navigateMultiCalendar(
      state.value.focusedDate,
      'next',
      numberOfMonths,
      pagedNavigation
    );
    state.value = {
      ...state.value,
      focusedDate: newFocused,
    };
  };

  const prevMonth = () => {
    const newFocused = navigateMultiCalendar(
      state.value.focusedDate,
      'prev',
      numberOfMonths,
      pagedNavigation
    );
    state.value = {
      ...state.value,
      focusedDate: newFocused,
    };
  };

  // Override navigation actions with multi-calendar-aware versions
  const actions = {
    ...baseActions,
    nextMonth,
    prevMonth,
  };

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

  // Computed: array of month data with weeks enhanced by selection state
  const months = computed<MultiCalendarMonth[]>(() => {
    const multiWeeks = getMultiMonthWeeks(
      state.value.focusedDate,
      numberOfMonths,
      state.value.config,
      state.value,
      disabledDates
    );

    const titles = getMultiMonthTitles(
      state.value.focusedDate,
      numberOfMonths,
      state.value.config.calendarType,
      state.value.config.locale
    );

    return titles.map((titleInfo, index) => ({
      year: titleInfo.year,
      month: titleInfo.month,
      title: titleInfo.title,
      weeks: multiWeeks[index] || [],
    }));
  });

  // Computed: weekday header names (same for all months)
  const weekdayNames = computed(() => getWeekdayMinNames(state.value.config.locale));

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

  // Build multi-calendar config for navigation checks
  const multiConfig = computed<MultiCalendarConfig>(() => ({
    ...state.value.config,
    numberOfMonths,
    pagedNavigation,
  }));

  // Computed: navigation constraints
  const isPrevDisabled = computed(() =>
    !canNavigatePrev(state.value.focusedDate, multiConfig.value)
  );

  const isNextDisabled = computed(() =>
    !canNavigateNext(state.value.focusedDate, numberOfMonths, multiConfig.value)
  );

  // Computed: current locale
  const locale = computed<Locale>(() => state.value.config.locale);

  // Format day number with locale
  const formatDayNumber = (day: number) => formatDay(day, state.value.config.locale);

  return {
    state,
    actions,
    dispatch,
    months,
    weekdayNames,
    value,
    isComplete,
    isPrevDisabled,
    isNextDisabled,
    locale,
    formatDayNumber,
  };
}
