import * as React from 'react';
import {
  calendarReducer,
  createInitialState,
  selectionReducer,
  createInitialSelectionState,
  getMultiMonthWeeks,
  getMultiMonthTitles,
  getWeekdayMinNames,
  formatDay,
  canNavigatePrev,
  canNavigateNext,
  navigateMultiCalendar,
  getSelectionValue,
  type CalendarConfig,
  type CalendarDate,
  type SelectionMode,
  type SelectionEvent,
  type DateRangeValue,
  type MultiCalendarConfig,
} from '@thaparoyal/calendar-core';
import {
  MultiCalendarContext,
  type MultiCalendarContextValue,
  type MultiCalendarMonth,
} from './multi-calendar-context';
import { cn } from '../utils/cn';

/**
 * Multi-calendar root component props
 */
export interface MultiCalendarRootProps {
  /** Number of months to display (default: 2) */
  numberOfMonths?: number;
  /** Selection mode */
  mode?: SelectionMode;
  /** Calendar configuration */
  config?: Partial<CalendarConfig>;
  /** Paged navigation (jump by numberOfMonths instead of 1) */
  pagedNavigation?: boolean;
  /** Controlled value */
  value?: CalendarDate | CalendarDate[] | DateRangeValue | null;
  /** Default value (uncontrolled) */
  defaultValue?: CalendarDate | CalendarDate[] | DateRangeValue | null;
  /** Callback when value changes */
  onValueChange?: (value: CalendarDate | CalendarDate[] | DateRangeValue | null) => void;
  /** Disabled dates */
  disabledDates?: CalendarDate[];
  /** Additional class name */
  className?: string;
  /** Children */
  children?: React.ReactNode;
}

/**
 * Get initial date from value based on mode
 */
function getInitialDate(
  mode: SelectionMode,
  value: CalendarDate | CalendarDate[] | DateRangeValue | null | undefined
): CalendarDate | undefined {
  if (!value) return undefined;

  switch (mode) {
    case 'single':
      return value as CalendarDate;
    case 'multiple':
      return (value as CalendarDate[])[0];
    case 'range':
      return (value as DateRangeValue).start ?? undefined;
    default:
      return undefined;
  }
}

/**
 * Parse selection value based on mode
 */
function parseSelectionValue(
  mode: SelectionMode,
  value: CalendarDate | CalendarDate[] | DateRangeValue | null | undefined
): Partial<{
  selectedDate: CalendarDate | null;
  selectedDates: CalendarDate[];
  startDate: CalendarDate | null;
  endDate: CalendarDate | null;
}> {
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
 * Multi-calendar root component
 *
 * Displays multiple months side by side with synchronized navigation.
 * Supports single, range, and multiple selection modes.
 *
 * @example
 * ```tsx
 * <MultiCalendar.Root numberOfMonths={2} mode="range">
 *   <MultiCalendar.Header>
 *     <MultiCalendar.PrevButton />
 *     <MultiCalendar.Title />
 *     <MultiCalendar.NextButton />
 *   </MultiCalendar.Header>
 *   <MultiCalendar.Calendars />
 * </MultiCalendar.Root>
 * ```
 */
export const MultiCalendarRoot = React.forwardRef<HTMLDivElement, MultiCalendarRootProps>(
  (
    {
      numberOfMonths = 2,
      mode = 'range',
      config,
      pagedNavigation = false,
      value,
      defaultValue,
      onValueChange,
      disabledDates,
      className,
      children,
    },
    ref
  ) => {
    const isControlled = value !== undefined;

    // Calendar state (for navigation)
    const [calendarState, calendarDispatch] = React.useReducer(
      calendarReducer,
      { config, initialDate: getInitialDate(mode, defaultValue) },
      ({ config: cfg, initialDate }) => createInitialState(cfg, initialDate)
    );

    // Selection state
    const [selectionState, selectionDispatch] = React.useReducer(
      selectionReducer,
      { mode, ...parseSelectionValue(mode, defaultValue) },
      () => createInitialSelectionState({ selectionMode: mode, ...calendarState.config })
    );

    // Apply controlled value
    const effectiveSelectionState = React.useMemo(() => {
      if (!isControlled) return selectionState;
      const parsed = parseSelectionValue(mode, value);
      return {
        ...selectionState,
        selectedDate: parsed.selectedDate ?? selectionState.selectedDate,
        selectedDates: parsed.selectedDates ?? selectionState.selectedDates,
        startDate: parsed.startDate ?? selectionState.startDate,
        endDate: parsed.endDate ?? selectionState.endDate,
      };
    }, [selectionState, isControlled, value, mode]);

    // Multi-calendar config
    const multiConfig: MultiCalendarConfig = React.useMemo(
      () => ({
        ...calendarState.config,
        numberOfMonths,
        pagedNavigation,
      }),
      [calendarState.config, numberOfMonths, pagedNavigation]
    );

    // Compute weeks for all months
    const allWeeks = React.useMemo(
      () =>
        getMultiMonthWeeks(
          calendarState.focusedDate,
          numberOfMonths,
          calendarState.config,
          effectiveSelectionState,
          disabledDates
        ),
      [
        calendarState.focusedDate,
        numberOfMonths,
        calendarState.config,
        effectiveSelectionState,
        disabledDates,
      ]
    );

    // Compute month titles
    const monthTitles = React.useMemo(
      () =>
        getMultiMonthTitles(
          calendarState.focusedDate,
          numberOfMonths,
          calendarState.config.calendarType,
          calendarState.config.locale
        ),
      [calendarState.focusedDate, numberOfMonths, calendarState.config]
    );

    // Combine into months array
    const months: MultiCalendarMonth[] = React.useMemo(
      () =>
        monthTitles.map((titleInfo, index) => ({
          year: titleInfo.year,
          month: titleInfo.month,
          title: titleInfo.title,
          weeks: allWeeks[index] ?? [],
        })),
      [monthTitles, allWeeks]
    );

    // Weekday names
    const weekdayNames = React.useMemo(
      () => getWeekdayMinNames(calendarState.config.locale),
      [calendarState.config.locale]
    );

    // Format day number
    const formatDayNumber = React.useCallback(
      (day: number) => formatDay(day, calendarState.config.locale),
      [calendarState.config.locale]
    );

    // Navigation state
    const isPrevDisabled = !canNavigatePrev(calendarState.focusedDate, multiConfig);
    const isNextDisabled = !canNavigateNext(
      calendarState.focusedDate,
      numberOfMonths,
      multiConfig
    );

    // Actions
    const selectDate = React.useCallback(
      (date: CalendarDate) => {
        const event: SelectionEvent =
          mode === 'multiple' ? { type: 'TOGGLE', date } : { type: 'SELECT', date };
        selectionDispatch(event);

        if (onValueChange) {
          const newState = selectionReducer(effectiveSelectionState, event);
          const newValue = getSelectionValue(newState);
          onValueChange(newValue);
        }
      },
      [mode, effectiveSelectionState, onValueChange]
    );

    const toggleDate = React.useCallback(
      (date: CalendarDate) => {
        const event: SelectionEvent = { type: 'TOGGLE', date };
        selectionDispatch(event);

        if (onValueChange) {
          const newState = selectionReducer(effectiveSelectionState, event);
          const newValue = getSelectionValue(newState);
          onValueChange(newValue);
        }
      },
      [effectiveSelectionState, onValueChange]
    );

    const hoverDate = React.useCallback((date: CalendarDate | null) => {
      if (mode === 'range') {
        selectionDispatch({ type: 'HOVER', date });
      }
    }, [mode]);

    const focusDate = React.useCallback((date: CalendarDate) => {
      calendarDispatch({ type: 'FOCUS_DATE', date });
    }, []);

    const nextMonth = React.useCallback(() => {
      const newDate = navigateMultiCalendar(
        calendarState.focusedDate,
        'next',
        numberOfMonths,
        pagedNavigation
      );
      calendarDispatch({ type: 'FOCUS_DATE', date: newDate });
    }, [calendarState.focusedDate, numberOfMonths, pagedNavigation]);

    const prevMonth = React.useCallback(() => {
      const newDate = navigateMultiCalendar(
        calendarState.focusedDate,
        'prev',
        numberOfMonths,
        pagedNavigation
      );
      calendarDispatch({ type: 'FOCUS_DATE', date: newDate });
    }, [calendarState.focusedDate, numberOfMonths, pagedNavigation]);

    const nextYear = React.useCallback(() => {
      calendarDispatch({ type: 'NEXT_YEAR' });
    }, []);

    const prevYear = React.useCallback(() => {
      calendarDispatch({ type: 'PREV_YEAR' });
    }, []);

    const clear = React.useCallback(() => {
      selectionDispatch({ type: mode === 'multiple' ? 'CLEAR_ALL' : 'CLEAR' });
      if (onValueChange) {
        onValueChange(null);
      }
    }, [mode, onValueChange]);

    // Compute current value
    const currentValue = React.useMemo(
      () => getSelectionValue(effectiveSelectionState),
      [effectiveSelectionState]
    );

    const contextValue: MultiCalendarContextValue = React.useMemo(
      () => ({
        numberOfMonths,
        calendarType: calendarState.config.calendarType,
        locale: calendarState.config.locale,
        focusedDate: calendarState.focusedDate,
        selectionMode: mode,
        selectionState: effectiveSelectionState,
        value: currentValue,
        months,
        weekdayNames,
        isPrevDisabled,
        isNextDisabled,
        selectDate,
        toggleDate,
        hoverDate,
        focusDate,
        nextMonth,
        prevMonth,
        nextYear,
        prevYear,
        clear,
        formatDayNumber,
      }),
      [
        numberOfMonths,
        calendarState.config,
        calendarState.focusedDate,
        mode,
        effectiveSelectionState,
        currentValue,
        months,
        weekdayNames,
        isPrevDisabled,
        isNextDisabled,
        selectDate,
        toggleDate,
        hoverDate,
        focusDate,
        nextMonth,
        prevMonth,
        nextYear,
        prevYear,
        clear,
        formatDayNumber,
      ]
    );

    return (
      <MultiCalendarContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={cn('trc-multi-calendar', className)}
          role="application"
          aria-label="Multi Calendar"
          data-months={numberOfMonths}
          data-mode={mode}
          data-locale={calendarState.config.locale}
          data-calendar-type={calendarState.config.calendarType}
        >
          {children}
        </div>
      </MultiCalendarContext.Provider>
    );
  }
);

MultiCalendarRoot.displayName = 'MultiCalendar.Root';
