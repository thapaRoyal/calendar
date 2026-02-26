import * as React from 'react';
import { useCalendarContext } from '../context/calendar-context';
import { cn } from '../utils/cn';
import {
  getYearGrid,
  getDecadeRange,
  formatYear,
  type YearPickerItem,
} from '@thaparoyal/calendar-core';

/**
 * Calendar year picker component props
 */
export interface CalendarYearPickerProps {
  /** Additional class name */
  className?: string;
  /** Number of years to show (default: 12) */
  rangeSize?: number;
  /** Custom render function for year cells */
  renderYear?: (year: YearPickerItem, index: number) => React.ReactNode;
}

/**
 * Year picker grid component (3x4 grid of years)
 *
 * Displays when viewMode is 'year' and allows quick year selection.
 * Shows a decade of years centered around the current year.
 * Clicking a year switches back to month view for that year.
 *
 * @example
 * ```tsx
 * <Calendar.Root>
 *   <Calendar.Header>
 *     <Calendar.PrevButton />
 *     <Calendar.Title /> {/* Click to cycle through views *\/}
 *     <Calendar.NextButton />
 *   </Calendar.Header>
 *   <Calendar.Grid>
 *     <Calendar.GridHead />
 *     <Calendar.GridBody />
 *   </Calendar.Grid>
 *   <Calendar.MonthPicker /> {/* Shows when viewMode='month' *\/}
 *   <Calendar.YearPicker />  {/* Shows when viewMode='year' *\/}
 * </Calendar.Root>
 * ```
 */
export const CalendarYearPicker = React.forwardRef<HTMLDivElement, CalendarYearPickerProps>(
  ({ className, rangeSize = 12, renderYear }, ref) => {
    const { state, actions, viewMode, locale, calendarType, focusedDate } = useCalendarContext();

    // Only render when in year view mode
    if (viewMode !== 'year') {
      return null;
    }

    const years = React.useMemo(
      () =>
        getYearGrid(
          focusedDate.year,
          calendarType,
          rangeSize,
          state.config.minDate,
          state.config.maxDate
        ),
      [focusedDate.year, calendarType, rangeSize, state.config.minDate, state.config.maxDate]
    );

    const decadeRange = React.useMemo(
      () => getDecadeRange(focusedDate.year, rangeSize),
      [focusedDate.year, rangeSize]
    );

    const handleYearSelect = (year: YearPickerItem) => {
      if (year.disabled) return;

      // Navigate to the selected year
      actions.focusDate({
        ...focusedDate,
        year: year.year,
      });
      // Switch to month view to select month
      actions.setViewMode('month');
    };

    return (
      <div
        ref={ref}
        className={cn('trc-calendar-year-picker', className)}
        role="grid"
        aria-label={`Year selection: ${decadeRange.start} - ${decadeRange.end}`}
      >
        {years.map((year, index) => {
          if (renderYear) {
            return (
              <div key={year.year} className="trc-calendar-year-cell-wrapper">
                {renderYear(year, index)}
              </div>
            );
          }

          return (
            <button
              key={year.year}
              type="button"
              className={cn(
                'trc-calendar-year-cell',
                year.isCurrentYear && 'trc-calendar-year-current',
                year.disabled && 'trc-calendar-year-disabled'
              )}
              onClick={() => handleYearSelect(year)}
              disabled={year.disabled}
              aria-label={String(year.year)}
              aria-selected={year.isCurrentYear}
              aria-disabled={year.disabled}
            >
              {formatYear(year.year, locale)}
            </button>
          );
        })}
      </div>
    );
  }
);

CalendarYearPicker.displayName = 'Calendar.YearPicker';
