import { ref, computed, watch, type Ref } from 'vue';
import {
  datePickerReducer,
  createInitialDatePickerState,
  createDatePickerActions,
  getWeeksInMonth,
  formatMonthYear,
  getWeekdayMinNames,
  formatDay,
  formatDate,
  type DatePickerState,
  type DatePickerEvent,
  type DatePickerActions,
  type CalendarConfig,
  type CalendarDate,
  type Week,
  type Locale,
} from '@thaparoyal/calendar-core';

/**
 * Options for useDatePicker composable
 */
export interface UseDatePickerOptions {
  config?: Partial<CalendarConfig>;
  defaultValue?: CalendarDate;
  modelValue?: Ref<CalendarDate | null>;
  format?: string;
  disabled?: boolean;
  disabledDates?: CalendarDate[];
}

/**
 * Composable for date picker state management (calendar + input + popup)
 */
export function useDatePicker(options: UseDatePickerOptions = {}) {
  const {
    config,
    defaultValue,
    modelValue,
    format = 'YYYY-MM-DD',
    disabled = false,
    disabledDates = [],
  } = options;

  // Internal state
  const state = ref<DatePickerState>(
    createInitialDatePickerState(config, defaultValue)
  );

  // Dispatch function
  const dispatch = (event: DatePickerEvent) => {
    if (disabled) return;
    state.value = datePickerReducer(state.value, event);
  };

  // Actions
  const baseActions: DatePickerActions = createDatePickerActions(dispatch);

  // Watch for external model changes
  if (modelValue) {
    watch(modelValue, (newValue) => {
      if (newValue) {
        state.value = {
          ...state.value,
          selectedDate: newValue,
          focusedDate: newValue,
          inputValue: formatDate(newValue, format, state.value.config.locale),
        };
      } else {
        state.value = {
          ...state.value,
          selectedDate: null,
          inputValue: '',
        };
      }
    });
  }

  // Select date: auto-closes popup and syncs modelValue
  const selectDate = (date: CalendarDate) => {
    baseActions.selectDate(date);
    if (modelValue) {
      modelValue.value = date;
    }
  };

  // Computed: whether the picker popup is open
  const isOpen = computed(() => state.value.isOpen);

  // Computed: current input value string
  const inputValue = computed(() => state.value.inputValue);

  // Computed: currently selected date
  const selectedDate = computed(() => state.value.selectedDate);

  // Computed: calendar weeks grid
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

  // Computed: formatted value using the specified format string
  const formattedValue = computed(() => {
    if (!state.value.selectedDate) return '';
    return formatDate(state.value.selectedDate, format, state.value.config.locale);
  });

  // Format day number with locale
  const formatDayNumber = (day: number) => formatDay(day, state.value.config.locale);

  // Computed: current locale
  const locale = computed<Locale>(() => state.value.config.locale);

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
    actions: {
      ...baseActions,
      selectDate,
    },
    isOpen,
    inputValue,
    selectedDate,
    weeks,
    title,
    weekdayNames,
    formattedValue,
    formatDayNumber,
    isPrevMonthDisabled,
    isNextMonthDisabled,
    locale,
  };
}
