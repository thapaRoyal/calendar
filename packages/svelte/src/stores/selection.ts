import { writable, derived, type Readable } from 'svelte/store';
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
  type CalendarDate,
  type DateRangeValue,
  type SelectionMode,
  type Week,
  type Locale,
} from '@thaparoyal/calendar-core';

/**
 * Options for createSelection store
 */
export interface CreateSelectionOptions {
  mode?: SelectionMode;
  config?: Partial<SelectionConfig>;
  defaultValue?: CalendarDate | CalendarDate[] | DateRangeValue | null;
  disabledDates?: CalendarDate[];
}

/**
 * Selection store return type
 */
export interface SelectionStore {
  state: Readable<SelectionState>;
  weeks: Readable<Week[]>;
  title: Readable<string>;
  weekdayNames: Readable<readonly string[]>;
  value: Readable<CalendarDate | CalendarDate[] | DateRangeValue | null>;
  isComplete: Readable<boolean>;
  isPrevMonthDisabled: Readable<boolean>;
  isNextMonthDisabled: Readable<boolean>;
  locale: Readable<Locale>;
  formatDayNumber: (day: number) => string;
  // Actions
  select: (date: CalendarDate) => void;
  toggle: (date: CalendarDate) => void;
  hover: (date: CalendarDate | null) => void;
  clear: () => void;
  clearAll: () => void;
  nextMonth: () => void;
  prevMonth: () => void;
  nextYear: () => void;
  prevYear: () => void;
  setViewMode: (mode: 'day' | 'month' | 'year') => void;
  goToToday: () => void;
}

/**
 * Create a selection store
 */
export function createSelection(options: CreateSelectionOptions = {}): SelectionStore {
  const { mode = 'single', config = {}, defaultValue, disabledDates = [] } = options;

  const selectionConfig: Partial<SelectionConfig> = {
    ...config,
    selectionMode: mode,
  };

  // Internal state store
  const internalState = writable<SelectionState>(
    createInitialSelectionState(selectionConfig, defaultValue ?? undefined)
  );

  // Dispatch function
  const dispatch = (event: SelectionEvent) => {
    internalState.update((state) => selectionReducer(state, event));
  };

  // Create actions using the core factory
  const actions = createSelectionActions(dispatch);

  // Derived stores
  const state = derived(internalState, ($state) => $state);

  const weeks = derived(internalState, ($state) => {
    const baseWeeks = getWeeksInMonth(
      $state.focusedDate.year,
      $state.focusedDate.month,
      $state.config.calendarType,
      $state.config,
      $state.selectedDate,
      disabledDates
    );

    // Enhance weeks with selection state (range/multi-select highlights)
    return baseWeeks.map((week) =>
      week.map((day) => enhanceWeekDayWithSelection(day, $state))
    );
  });

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

  const value = derived(internalState, ($state) => getSelectionValue($state));

  const isComplete = derived(internalState, ($state) => {
    switch ($state.selectionMode) {
      case 'single':
        return $state.selectedDate !== null;
      case 'range':
        return $state.startDate !== null && $state.endDate !== null;
      case 'multiple':
        return $state.selectedDates.length > 0;
      default:
        return false;
    }
  });

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

  const locale = derived(internalState, ($state) => $state.config.locale);

  // Format day number according to locale (Nepali numerals for 'ne')
  let currentLocale: Locale = 'en';
  internalState.subscribe(($state) => {
    currentLocale = $state.config.locale;
  });
  const formatDayNumber = (day: number) => formatDay(day, currentLocale);

  return {
    state,
    weeks,
    title,
    weekdayNames,
    value,
    isComplete,
    isPrevMonthDisabled,
    isNextMonthDisabled,
    locale,
    formatDayNumber,
    // Actions
    select: actions.select,
    toggle: actions.toggle,
    hover: actions.hover,
    clear: actions.clear,
    clearAll: actions.clearAll,
    nextMonth: actions.nextMonth,
    prevMonth: actions.prevMonth,
    nextYear: actions.nextYear,
    prevYear: actions.prevYear,
    setViewMode: actions.setViewMode,
    goToToday: actions.goToToday,
  };
}
