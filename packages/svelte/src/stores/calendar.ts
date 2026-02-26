import { writable, derived, type Readable, type Writable } from 'svelte/store';
import {
  calendarReducer,
  createInitialState,
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
 * Options for createCalendar store
 */
export interface CreateCalendarOptions {
  config?: Partial<CalendarConfig>;
  defaultValue?: CalendarDate;
  disabledDates?: CalendarDate[];
}

/**
 * Calendar store return type
 */
export interface CalendarStore {
  state: Readable<CalendarState>;
  weeks: Readable<Week[]>;
  title: Readable<string>;
  weekdayNames: Readable<readonly string[]>;
  isPrevMonthDisabled: Readable<boolean>;
  isNextMonthDisabled: Readable<boolean>;
  selectedDate: Writable<CalendarDate | null>;
  selectDate: (date: CalendarDate) => void;
  focusDate: (date: CalendarDate) => void;
  nextMonth: () => void;
  prevMonth: () => void;
  nextYear: () => void;
  prevYear: () => void;
  setViewMode: (mode: 'day' | 'month' | 'year') => void;
  goToToday: () => void;
}

/**
 * Create a calendar store
 */
export function createCalendar(options: CreateCalendarOptions = {}): CalendarStore {
  const { config, defaultValue, disabledDates = [] } = options;

  // Internal state store
  const internalState = writable<CalendarState>(createInitialState(config, defaultValue));

  // Selected date store (for two-way binding)
  const selectedDate = writable<CalendarDate | null>(defaultValue ?? null);

  // Dispatch function
  const dispatch = (event: CalendarEvent) => {
    internalState.update((state) => calendarReducer(state, event));
  };

  // Sync selected date
  selectedDate.subscribe((date) => {
    if (date) {
      internalState.update((state) => ({
        ...state,
        selectedDate: date,
      }));
    }
  });

  // Derived stores
  const state = derived(internalState, ($state) => $state);

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
    getWeekdayShortNames($state.config.locale)
  );

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

  // Actions
  const selectDate = (date: CalendarDate) => {
    dispatch({ type: 'SELECT_DATE', date });
    selectedDate.set(date);
  };

  const focusDate = (date: CalendarDate) => {
    dispatch({ type: 'FOCUS_DATE', date });
  };

  const nextMonth = () => dispatch({ type: 'NEXT_MONTH' });
  const prevMonth = () => dispatch({ type: 'PREV_MONTH' });
  const nextYear = () => dispatch({ type: 'NEXT_YEAR' });
  const prevYear = () => dispatch({ type: 'PREV_YEAR' });

  const setViewMode = (mode: 'day' | 'month' | 'year') => {
    dispatch({ type: 'SET_VIEW_MODE', mode });
  };

  const goToToday = () => dispatch({ type: 'TODAY' });

  return {
    state,
    weeks,
    title,
    weekdayNames,
    isPrevMonthDisabled,
    isNextMonthDisabled,
    selectedDate,
    selectDate,
    focusDate,
    nextMonth,
    prevMonth,
    nextYear,
    prevYear,
    setViewMode,
    goToToday,
  };
}
