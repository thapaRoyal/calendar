import * as React from 'react';
import {
  calendarReducer,
  createInitialState,
  selectionReducer,
  createInitialSelectionState,
  getWeeksInMonth,
  formatMonthYear,
  getWeekdayMinNames,
  formatDay,
  enhanceWeekDayWithSelection,
  type CalendarConfig,
  type CalendarDate,
  type DateRangeValue,
  type SelectionEvent,
  type Week,
} from '@thaparoyal/calendar-core';
import { RangeCalendarContext, type RangeCalendarContextValue } from './range-calendar-context';
import { cn } from '../utils/cn';

/**
 * Range calendar root component props
 */
export interface RangeCalendarRootProps {
  /** Calendar configuration */
  config?: Partial<CalendarConfig>;
  /** Controlled range value */
  value?: DateRangeValue | null;
  /** Default value (uncontrolled) */
  defaultValue?: DateRangeValue | null;
  /** Callback when range changes */
  onValueChange?: (value: DateRangeValue | null) => void;
  /** Disabled dates */
  disabledDates?: CalendarDate[];
  /** Additional class name */
  className?: string;
  /** Children */
  children?: React.ReactNode;
}

/**
 * Range calendar root component
 *
 * Provides context for range selection calendar with start and end date selection.
 *
 * @example
 * ```tsx
 * <RangeCalendar.Root
 *   value={{ start: startDate, end: endDate }}
 *   onValueChange={setRange}
 * >
 *   <RangeCalendar.Header>
 *     <RangeCalendar.PrevButton />
 *     <RangeCalendar.Title />
 *     <RangeCalendar.NextButton />
 *   </RangeCalendar.Header>
 *   <RangeCalendar.Grid>
 *     <RangeCalendar.GridHead />
 *     <RangeCalendar.GridBody />
 *   </RangeCalendar.Grid>
 * </RangeCalendar.Root>
 * ```
 */
export const RangeCalendarRoot = React.forwardRef<HTMLDivElement, RangeCalendarRootProps>(
  ({ config, value, defaultValue, onValueChange, disabledDates, className, children }, ref) => {
    const isControlled = value !== undefined;

    // Calendar state (for navigation)
    const [calendarState, calendarDispatch] = React.useReducer(
      calendarReducer,
      { config, initialDate: defaultValue?.start ?? undefined },
      ({ config: cfg, initialDate }) => createInitialState(cfg, initialDate)
    );

    // Selection state (for range selection)
    const [selectionState, selectionDispatch] = React.useReducer(
      selectionReducer,
      { mode: 'range', startDate: defaultValue?.start, endDate: defaultValue?.end },
      () =>
        createInitialSelectionState({ selectionMode: 'range', ...calendarState.config })
    );

    // Apply controlled value
    const effectiveSelectionState = React.useMemo(() => {
      if (!isControlled) return selectionState;
      return {
        ...selectionState,
        startDate: value?.start ?? null,
        endDate: value?.end ?? null,
      };
    }, [selectionState, isControlled, value]);

    // Compute weeks with selection enhancement
    const weeks: Week[] = React.useMemo(() => {
      const baseWeeks = getWeeksInMonth(
        calendarState.focusedDate.year,
        calendarState.focusedDate.month,
        calendarState.config.calendarType,
        calendarState.config,
        null, // No single date selection
        disabledDates
      );

      // Enhance with selection state
      return baseWeeks.map((week) =>
        week.map((day) =>
          enhanceWeekDayWithSelection(day, {
            selectionMode: 'range',
            startDate: effectiveSelectionState.startDate,
            endDate: effectiveSelectionState.endDate,
            hoveredDate: effectiveSelectionState.hoveredDate,
            selectingEnd: effectiveSelectionState.selectingEnd,
          })
        )
      );
    }, [
      calendarState.focusedDate,
      calendarState.config,
      effectiveSelectionState.startDate,
      effectiveSelectionState.endDate,
      effectiveSelectionState.hoveredDate,
      effectiveSelectionState.selectingEnd,
      disabledDates,
    ]);

    // Compute title
    const title = React.useMemo(
      () =>
        formatMonthYear(
          calendarState.focusedDate.year,
          calendarState.focusedDate.month,
          calendarState.config.calendarType,
          calendarState.config.locale
        ),
      [calendarState.focusedDate, calendarState.config]
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

    // Navigation disabled states
    const isPrevDisabled = React.useMemo(() => {
      if (!calendarState.config.minDate) return false;
      const { year, month } = calendarState.focusedDate;
      return (
        year < calendarState.config.minDate.year ||
        (year === calendarState.config.minDate.year && month <= calendarState.config.minDate.month)
      );
    }, [calendarState.focusedDate, calendarState.config.minDate]);

    const isNextDisabled = React.useMemo(() => {
      if (!calendarState.config.maxDate) return false;
      const { year, month } = calendarState.focusedDate;
      return (
        year > calendarState.config.maxDate.year ||
        (year === calendarState.config.maxDate.year && month >= calendarState.config.maxDate.month)
      );
    }, [calendarState.focusedDate, calendarState.config.maxDate]);

    // Actions
    const selectDate = React.useCallback(
      (date: CalendarDate) => {
        const event: SelectionEvent = { type: 'SELECT', date };
        selectionDispatch(event);

        // Compute new state to call onValueChange
        const newState = selectionReducer(effectiveSelectionState, event);
        if (onValueChange && (newState.startDate || newState.endDate)) {
          onValueChange({
            start: newState.startDate,
            end: newState.endDate,
          });
        }
      },
      [effectiveSelectionState, onValueChange]
    );

    const hoverDate = React.useCallback((date: CalendarDate | null) => {
      selectionDispatch({ type: 'HOVER', date });
    }, []);

    const focusDate = React.useCallback((date: CalendarDate) => {
      calendarDispatch({ type: 'FOCUS_DATE', date });
    }, []);

    const nextMonth = React.useCallback(() => {
      calendarDispatch({ type: 'NEXT_MONTH' });
    }, []);

    const prevMonth = React.useCallback(() => {
      calendarDispatch({ type: 'PREV_MONTH' });
    }, []);

    const nextYear = React.useCallback(() => {
      calendarDispatch({ type: 'NEXT_YEAR' });
    }, []);

    const prevYear = React.useCallback(() => {
      calendarDispatch({ type: 'PREV_YEAR' });
    }, []);

    const clear = React.useCallback(() => {
      selectionDispatch({ type: 'CLEAR' });
      if (onValueChange) {
        onValueChange(null);
      }
    }, [onValueChange]);

    // Check if range is complete
    const isComplete = effectiveSelectionState.startDate !== null && effectiveSelectionState.endDate !== null;

    const contextValue: RangeCalendarContextValue = React.useMemo(
      () => ({
        calendarType: calendarState.config.calendarType,
        locale: calendarState.config.locale,
        focusedDate: calendarState.focusedDate,
        selectionState: effectiveSelectionState,
        value: isComplete
          ? { start: effectiveSelectionState.startDate, end: effectiveSelectionState.endDate }
          : null,
        isComplete,
        weeks,
        title,
        weekdayNames,
        isPrevDisabled,
        isNextDisabled,
        selectDate,
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
        calendarState.config,
        calendarState.focusedDate,
        effectiveSelectionState,
        isComplete,
        weeks,
        title,
        weekdayNames,
        isPrevDisabled,
        isNextDisabled,
        selectDate,
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
      <RangeCalendarContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={cn('trc-calendar', 'trc-range-calendar', className)}
          role="application"
          aria-label="Range Calendar"
          data-locale={calendarState.config.locale}
          data-calendar-type={calendarState.config.calendarType}
        >
          {children}
        </div>
      </RangeCalendarContext.Provider>
    );
  }
);

RangeCalendarRoot.displayName = 'RangeCalendar.Root';
