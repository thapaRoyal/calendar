import { writable, derived, type Readable, type Writable } from 'svelte/store';
import {
  datePickerReducer,
  createInitialDatePickerState,
  createDatePickerActions,
  getWeeksInMonth,
  formatMonthYear,
  getWeekdayMinNames,
  formatDay,
  formatDate,
  getMonthGrid,
  getYearGrid,
  getDecadeRange,
  type DatePickerState,
  type DatePickerEvent,
  type CalendarConfig,
  type CalendarDate,
  type Week,
  type Locale,
  type MonthPickerItem,
  type YearPickerItem,
  type DecadeRange,
} from '@thaparoyal/calendar-core';

/**
 * Options for createDatePicker store
 */
export interface CreateDatePickerOptions {
  config?: Partial<CalendarConfig>;
  defaultValue?: CalendarDate;
  format?: string;
  disabledDates?: CalendarDate[];
}

/**
 * Date picker store return type
 */
export interface DatePickerStore {
  state: Readable<DatePickerState>;
  isOpen: Readable<boolean>;
  inputValue: Readable<string>;
  selectedDate: Writable<CalendarDate | null>;
  weeks: Readable<Week[]>;
  title: Readable<string>;
  weekdayNames: Readable<readonly string[]>;
  formattedValue: Readable<string>;
  locale: Readable<Locale>;
  monthPickerItems: Readable<MonthPickerItem[]>;
  yearPickerItems: Readable<YearPickerItem[]>;
  decadeRange: Readable<DecadeRange>;
  viewMode: Readable<'day' | 'month' | 'year'>;
  isPrevMonthDisabled: Readable<boolean>;
  isNextMonthDisabled: Readable<boolean>;
  formatDayNumber: (day: number) => string;
  focusDate: (date: CalendarDate) => void;
  // Actions
  open: () => void;
  close: () => void;
  toggle: () => void;
  selectDate: (date: CalendarDate) => void;
  clear: () => void;
  onInputChange: (value: string) => void;
  onInputBlur: () => void;
  nextMonth: () => void;
  prevMonth: () => void;
  nextYear: () => void;
  prevYear: () => void;
  setViewMode: (mode: 'day' | 'month' | 'year') => void;
  goToToday: () => void;
}

/**
 * Create a date picker store
 */
export function createDatePicker(options: CreateDatePickerOptions = {}): DatePickerStore {
  const { config, defaultValue, format = 'YYYY-MM-DD', disabledDates = [] } = options;

  // Internal state store
  const internalState = writable<DatePickerState>(
    createInitialDatePickerState(config, defaultValue)
  );

  // Selected date store (for two-way binding)
  const selectedDate = writable<CalendarDate | null>(defaultValue ?? null);

  // Dispatch function
  const dispatch = (event: DatePickerEvent) => {
    internalState.update((state) => datePickerReducer(state, event));
  };

  // Create actions using the core factory
  const actions = createDatePickerActions(dispatch);

  // Sync selected date from external changes
  selectedDate.subscribe((date) => {
    if (date) {
      internalState.update((state) => ({
        ...state,
        selectedDate: date,
        inputValue: formatDate(date, format, state.config.locale),
      }));
    }
  });

  // Derived stores
  const state = derived(internalState, ($state) => $state);

  const isOpen = derived(internalState, ($state) => $state.isOpen);

  const inputValue = derived(internalState, ($state) => $state.inputValue);

  const weeks = derived(internalState, ($state) =>
    getWeeksInMonth(
      $state.focusedDate.year,
      $state.focusedDate.month,
      $state.config.calendarType,
      $state.config,
      $state.selectedDate,
      disabledDates
    )
  );

  const title = derived(internalState, ($state) =>
    formatMonthYear(
      $state.focusedDate.year,
      $state.focusedDate.month,
      $state.config.calendarType,
      $state.config.locale
    )
  );

  const weekdayNames = derived(internalState, ($state) =>
    getWeekdayMinNames($state.config.locale)
  );

  const formattedValue = derived(internalState, ($state) => {
    if (!$state.selectedDate) return '';
    return formatDate($state.selectedDate, format, $state.config.locale);
  });

  const locale = derived(internalState, ($state) => $state.config.locale);

  const monthPickerItems = derived(internalState, ($state) =>
    getMonthGrid(
      $state.focusedDate.year,
      $state.config.calendarType,
      $state.config.locale,
      $state.focusedDate.month,
      $state.config.minDate,
      $state.config.maxDate
    )
  );

  const yearPickerItems = derived(internalState, ($state) =>
    getYearGrid(
      $state.focusedDate.year,
      $state.config.calendarType,
      12,
      $state.config.minDate,
      $state.config.maxDate
    )
  );

  const decadeRangeStore = derived(internalState, ($state) =>
    getDecadeRange($state.focusedDate.year)
  );

  const viewModeStore = derived(internalState, ($state) => $state.viewMode);

  const isPrevMonthDisabled = derived(internalState, ($state) => {
    if (!$state.config.minDate) return false;
    const { year, month } = $state.focusedDate;
    return (
      year < $state.config.minDate.year ||
      (year === $state.config.minDate.year && month <= $state.config.minDate.month)
    );
  });

  const isNextMonthDisabled = derived(internalState, ($state) => {
    if (!$state.config.maxDate) return false;
    const { year, month } = $state.focusedDate;
    return (
      year > $state.config.maxDate.year ||
      (year === $state.config.maxDate.year && month >= $state.config.maxDate.month)
    );
  });

  // Format day number according to locale (Nepali numerals for 'ne')
  let currentLocale: Locale = 'en';
  internalState.subscribe(($state) => {
    currentLocale = $state.config.locale;
  });
  const formatDayNumber = (day: number) => formatDay(day, currentLocale);

  const focusDate = (date: CalendarDate) => {
    dispatch({ type: 'FOCUS_DATE', date } as any);
    internalState.update(($state) => ({
      ...$state,
      focusedDate: date,
    }));
  };

  // Wrapped selectDate that also syncs the selectedDate writable
  const selectDate = (date: CalendarDate) => {
    actions.selectDate(date);
    selectedDate.set(date);
  };

  // Wrapped clear that also syncs the selectedDate writable
  const clear = () => {
    actions.clear();
    selectedDate.set(null);
  };

  return {
    state,
    isOpen,
    inputValue,
    selectedDate,
    weeks,
    title,
    weekdayNames,
    formattedValue,
    locale,
    monthPickerItems,
    yearPickerItems,
    decadeRange: decadeRangeStore,
    viewMode: viewModeStore,
    isPrevMonthDisabled,
    isNextMonthDisabled,
    formatDayNumber,
    focusDate,
    // Actions
    open: actions.open,
    close: actions.close,
    toggle: actions.toggle,
    selectDate,
    clear,
    onInputChange: actions.onInputChange,
    onInputBlur: actions.onInputBlur,
    nextMonth: actions.nextMonth,
    prevMonth: actions.prevMonth,
    nextYear: actions.nextYear,
    prevYear: actions.prevYear,
    setViewMode: actions.setViewMode,
    goToToday: actions.goToToday,
  };
}
