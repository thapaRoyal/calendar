import * as React from 'react';
import { useCalendarContext } from '../context/calendar-context';
import { cn } from '../utils/cn';
import {
  getMonthGrid,
  formatYear,
} from '@thaparoyal/calendar-core';

/**
 * Calendar month dropdown component props
 */
export interface CalendarMonthDropdownProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'value' | 'onChange'> {
  /** Additional class name */
  className?: string;
}

/**
 * Month dropdown select component
 *
 * Alternative to the month picker grid - provides a dropdown select for quick month navigation.
 *
 * @example
 * ```tsx
 * <Calendar.Root>
 *   <Calendar.Header>
 *     <Calendar.PrevButton />
 *     <Calendar.MonthDropdown />
 *     <Calendar.YearDropdown />
 *     <Calendar.NextButton />
 *   </Calendar.Header>
 *   <Calendar.Grid>
 *     <Calendar.GridHead />
 *     <Calendar.GridBody />
 *   </Calendar.Grid>
 * </Calendar.Root>
 * ```
 */
export const CalendarMonthDropdown = React.forwardRef<
  HTMLSelectElement,
  CalendarMonthDropdownProps
>(({ className, ...props }, ref) => {
  const { state, actions, locale, calendarType, focusedDate } = useCalendarContext();

  const months = React.useMemo(
    () =>
      getMonthGrid(
        focusedDate.year,
        calendarType,
        locale,
        focusedDate.month,
        state.config.minDate,
        state.config.maxDate
      ),
    [focusedDate.year, focusedDate.month, calendarType, locale, state.config.minDate, state.config.maxDate]
  );

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const month = parseInt(e.target.value, 10);
    actions.focusDate({
      ...focusedDate,
      month,
    });
  };

  return (
    <select
      ref={ref}
      className={cn('trc-calendar-dropdown', 'trc-calendar-dropdown-month', className)}
      value={focusedDate.month}
      onChange={handleChange}
      aria-label="Select month"
      {...props}
    >
      {months.map((month) => (
        <option
          key={month.month}
          value={month.month}
          disabled={month.disabled}
        >
          {month.name}
        </option>
      ))}
    </select>
  );
});

CalendarMonthDropdown.displayName = 'Calendar.MonthDropdown';

/**
 * Calendar year dropdown component props
 */
export interface CalendarYearDropdownProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'value' | 'onChange'> {
  /** Additional class name */
  className?: string;
  /** Start year for the range */
  startYear?: number;
  /** End year for the range */
  endYear?: number;
}

/**
 * Year dropdown select component
 *
 * Alternative to the year picker grid - provides a dropdown select for quick year navigation.
 *
 * @example
 * ```tsx
 * <Calendar.Root>
 *   <Calendar.Header>
 *     <Calendar.PrevButton />
 *     <Calendar.MonthDropdown />
 *     <Calendar.YearDropdown startYear={2000} endYear={2100} />
 *     <Calendar.NextButton />
 *   </Calendar.Header>
 *   <Calendar.Grid>
 *     <Calendar.GridHead />
 *     <Calendar.GridBody />
 *   </Calendar.Grid>
 * </Calendar.Root>
 * ```
 */
export const CalendarYearDropdown = React.forwardRef<
  HTMLSelectElement,
  CalendarYearDropdownProps
>(({ className, startYear, endYear, ...props }, ref) => {
  const { state, actions, locale, calendarType, focusedDate } = useCalendarContext();

  // Determine year range based on calendar type and config
  const defaultStartYear = calendarType === 'BS' ? 2000 : 1944;
  const defaultEndYear = calendarType === 'BS' ? 2100 : 2100;

  const start = startYear ?? state.config.minDate?.year ?? defaultStartYear;
  const end = endYear ?? state.config.maxDate?.year ?? defaultEndYear;

  const years = React.useMemo(() => {
    const result: number[] = [];
    for (let year = start; year <= end; year++) {
      result.push(year);
    }
    return result;
  }, [start, end]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const year = parseInt(e.target.value, 10);
    actions.focusDate({
      ...focusedDate,
      year,
    });
  };

  return (
    <select
      ref={ref}
      className={cn('trc-calendar-dropdown', 'trc-calendar-dropdown-year', className)}
      value={focusedDate.year}
      onChange={handleChange}
      aria-label="Select year"
      {...props}
    >
      {years.map((year) => (
        <option key={year} value={year}>
          {formatYear(year, locale)}
        </option>
      ))}
    </select>
  );
});

CalendarYearDropdown.displayName = 'Calendar.YearDropdown';
