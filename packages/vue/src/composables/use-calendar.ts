import { ref, computed, watch, type Ref } from 'vue';
import {
  calendarReducer,
  createInitialState,
  createCalendarActions,
  getWeeksInMonth,
  formatMonthYear,
  getWeekdayMinNames,
  formatDay,
  getMonthGrid,
  getYearGrid,
  getDecadeRange,
  type CalendarState,
  type CalendarEvent,
  type CalendarConfig,
  type CalendarDate,
  type Week,
  type Locale,
  type MonthPickerItem,
  type YearPickerItem,
  type DecadeRange,
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

  const weekdayNames = computed(() => getWeekdayMinNames(state.value.config.locale));

  const locale = computed<Locale>(() => state.value.config.locale);

  const formatDayNumber = (day: number) => formatDay(day, state.value.config.locale);

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

  // Computed: month picker items
  const monthPickerItems = computed<MonthPickerItem[]>(() =>
    getMonthGrid(
      state.value.focusedDate.year,
      state.value.config.calendarType,
      state.value.config.locale,
      state.value.focusedDate.month,
      state.value.config.minDate,
      state.value.config.maxDate
    )
  );

  // Computed: year picker items
  const yearPickerItems = computed<YearPickerItem[]>(() =>
    getYearGrid(
      state.value.focusedDate.year,
      state.value.config.calendarType,
      12,
      state.value.config.minDate,
      state.value.config.maxDate
    )
  );

  // Computed: decade range for year picker navigation
  const decadeRange = computed<DecadeRange>(() =>
    getDecadeRange(state.value.focusedDate.year)
  );

  // Computed: current view mode
  const viewMode = computed(() => state.value.viewMode);

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
    locale,
    formatDayNumber,
    monthPickerItems,
    yearPickerItems,
    decadeRange,
    viewMode,
  };
}
