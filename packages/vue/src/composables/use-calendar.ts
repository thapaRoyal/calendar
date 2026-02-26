import { ref, computed, watch, type Ref } from 'vue';
import {
  calendarReducer,
  createInitialState,
  createCalendarActions,
  getWeeksInMonth,
  formatMonthYear,
  getWeekdayShortNames,
  type CalendarState,
  type CalendarEvent,
  type CalendarConfig,
  type CalendarDate,
  type Week,
} from '@thaparoyal/calendar-core';

/**
 * Options for useCalendar composable
 */
export interface UseCalendarOptions {
  config?: Partial<CalendarConfig>;
  defaultValue?: CalendarDate;
  modelValue?: Ref<CalendarDate | null>;
  disabledDates?: CalendarDate[];
}

/**
 * Composable for calendar state management
 */
export function useCalendar(options: UseCalendarOptions = {}) {
  const { config, defaultValue, modelValue, disabledDates = [] } = options;

  // Internal state
  const state = ref<CalendarState>(createInitialState(config, defaultValue));

  // Dispatch function
  const dispatch = (event: CalendarEvent) => {
    state.value = calendarReducer(state.value, event);
  };

  // Actions
  const actions = createCalendarActions(dispatch);

  // Watch for external model changes
  if (modelValue) {
    watch(modelValue, (newValue) => {
      if (newValue) {
        state.value = {
          ...state.value,
          selectedDate: newValue,
        };
      }
    });
  }

  // Computed values
  const weeks = computed<Week[]>(() =>
    getWeeksInMonth(
      state.value.focusedDate.year,
      state.value.focusedDate.month,
      state.value.config.calendarType,
      state.value.config,
      state.value.selectedDate,
      disabledDates
    )
  );

  const title = computed(() =>
    formatMonthYear(
      state.value.focusedDate.year,
      state.value.focusedDate.month,
      state.value.config.calendarType,
      state.value.config.locale
    )
  );

  const weekdayNames = computed(() => getWeekdayShortNames(state.value.config.locale));

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

  // Select date with emit
  const selectDate = (date: CalendarDate) => {
    actions.selectDate(date);
    if (modelValue) {
      modelValue.value = date;
    }
  };

  return {
    state,
    actions: {
      ...actions,
      selectDate,
    },
    weeks,
    title,
    weekdayNames,
    isPrevMonthDisabled,
    isNextMonthDisabled,
  };
}
