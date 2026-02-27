import { writable, derived, type Readable } from 'svelte/store';
import {
  selectionReducer,
  createInitialSelectionState,
  getSelectionValue,
  getWeeksInMonth,
  formatMonthYear,
  getWeekdayMinNames,
  formatDay,
  enhanceWeekDayWithSelection,
  offsetMonth,
  canNavigatePrev,
  canNavigateNext,
  navigateMultiCalendar,
  type SelectionState,
  type SelectionEvent,
  type SelectionConfig,
  type CalendarDate,
  type DateRangeValue,
  type SelectionMode,
  type Week,
  type Locale,
  type MultiCalendarConfig,
} from '@thaparoyal/calendar-core';

/**
 * Options for createMultiCalendar store
 */
export interface CreateMultiCalendarOptions {
  numberOfMonths?: number;
  mode?: SelectionMode;
  config?: Partial<SelectionConfig>;
  pagedNavigation?: boolean;
  defaultValue?: CalendarDate | CalendarDate[] | DateRangeValue | null;
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
 * Multi-calendar store return type
 */
export interface MultiCalendarStore {
  state: Readable<SelectionState>;
  months: Readable<MultiCalendarMonth[]>;
  weekdayNames: Readable<readonly string[]>;
  value: Readable<CalendarDate | CalendarDate[] | DateRangeValue | null>;
  isComplete: Readable<boolean>;
  isPrevDisabled: Readable<boolean>;
  isNextDisabled: Readable<boolean>;
  locale: Readable<Locale>;
  formatDayNumber: (day: number) => string;
  select: (date: CalendarDate) => void;
  toggle: (date: CalendarDate) => void;
  hover: (date: CalendarDate | null) => void;
  clear: () => void;
  focusDate: (date: CalendarDate) => void;
  nextMonth: () => void;
  prevMonth: () => void;
}

/**
 * Create a multi-calendar store
 */
export function createMultiCalendar(options: CreateMultiCalendarOptions = {}): MultiCalendarStore {
  const {
    numberOfMonths = 2,
    mode = 'range',
    config = {},
    pagedNavigation = false,
    defaultValue,
    disabledDates = [],
  } = options;

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

  // Derived stores
  const state = derived(internalState, ($state) => $state);

  const months = derived(internalState, ($state) => {
    const result: MultiCalendarMonth[] = [];

    for (let i = 0; i < numberOfMonths; i++) {
      const monthDate = offsetMonth($state.focusedDate, i, $state.config.calendarType);

      const baseWeeks = getWeeksInMonth(
        monthDate.year,
        monthDate.month,
        $state.config.calendarType,
        $state.config,
        $state.selectedDate,
        disabledDates
      );

      // Enhance weeks with selection state (range/multi-select highlights)
      const enhancedWeeks = baseWeeks.map((week) =>
        week.map((day) => enhanceWeekDayWithSelection(day, $state))
      );

      const title = formatMonthYear(
        monthDate.year,
        monthDate.month,
        $state.config.calendarType,
        $state.config.locale
      );

      result.push({
        year: monthDate.year,
        month: monthDate.month,
        title,
        weeks: enhancedWeeks,
      });
    }

    return result;
  });

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

  const isPrevDisabled = derived(internalState, ($state) => {
    const multiConfig: MultiCalendarConfig = {
      ...$state.config,
      numberOfMonths,
      pagedNavigation,
    };
    return !canNavigatePrev($state.focusedDate, multiConfig);
  });

  const isNextDisabled = derived(internalState, ($state) => {
    const multiConfig: MultiCalendarConfig = {
      ...$state.config,
      numberOfMonths,
      pagedNavigation,
    };
    return !canNavigateNext($state.focusedDate, numberOfMonths, multiConfig);
  });

  const locale = derived(internalState, ($state) => $state.config.locale);

  // Format day number according to locale (Nepali numerals for 'ne')
  let currentLocale: Locale = 'en';
  internalState.subscribe(($state) => {
    currentLocale = $state.config.locale;
  });
  const formatDayNumber = (day: number) => formatDay(day, currentLocale);

  // Actions
  const select = (date: CalendarDate) => {
    dispatch({ type: 'SELECT', date });
  };

  const toggle = (date: CalendarDate) => {
    dispatch({ type: 'TOGGLE', date });
  };

  const hover = (date: CalendarDate | null) => {
    dispatch({ type: 'HOVER', date });
  };

  const clear = () => {
    dispatch({ type: 'CLEAR' });
  };

  const focusDate = (date: CalendarDate) => {
    internalState.update(($state) => ({
      ...$state,
      focusedDate: date,
    }));
  };

  const nextMonth = () => {
    internalState.update(($state) => {
      const newFocused = navigateMultiCalendar(
        $state.focusedDate,
        'next',
        numberOfMonths,
        pagedNavigation
      );
      return { ...$state, focusedDate: newFocused };
    });
  };

  const prevMonth = () => {
    internalState.update(($state) => {
      const newFocused = navigateMultiCalendar(
        $state.focusedDate,
        'prev',
        numberOfMonths,
        pagedNavigation
      );
      return { ...$state, focusedDate: newFocused };
    });
  };

  return {
    state,
    months,
    weekdayNames,
    value,
    isComplete,
    isPrevDisabled,
    isNextDisabled,
    locale,
    formatDayNumber,
    select,
    toggle,
    hover,
    clear,
    focusDate,
    nextMonth,
    prevMonth,
  };
}
