import * as React from 'react';
import { useCalendarContext } from '../context/calendar-context';
import { cn } from '../utils/cn';
import {
  getMonthGrid,
  type MonthPickerItem,
} from '@thaparoyal/calendar-core';

/**
 * Calendar month picker component props
 */
export interface CalendarMonthPickerProps {
  /** Additional class name */
  className?: string;
  /** Custom render function for month cells */
  renderMonth?: (month: MonthPickerItem, index: number) => React.ReactNode;
}

/**
 * Month picker grid component (3x4 grid of months)
 *
 * Displays when viewMode is 'month' and allows quick month selection.
 * Clicking a month switches back to day view for that month.
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
export const CalendarMonthPicker = React.forwardRef<HTMLDivElement, CalendarMonthPickerProps>(
  ({ className, renderMonth }, ref) => {
    const { state, actions, viewMode, locale, calendarType, focusedDate } = useCalendarContext();

    // Only render when in month view mode
    if (viewMode !== 'month') {
      return null;
    }

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

    const handleMonthSelect = (month: MonthPickerItem) => {
      if (month.disabled) return;

      // Navigate to the selected month
      actions.focusDate({
        ...focusedDate,
        month: month.month,
      });
      // Switch back to day view
      actions.setViewMode('day');
    };

    return (
      <div
        ref={ref}
        className={cn('trc-calendar-month-picker', className)}
        role="grid"
        aria-label="Month selection"
      >
        {months.map((month, index) => {
          if (renderMonth) {
            return (
              <div key={month.month} className="trc-calendar-month-cell-wrapper">
                {renderMonth(month, index)}
              </div>
            );
          }

          return (
            <button
              key={month.month}
              type="button"
              className={cn(
                'trc-calendar-month-cell',
                month.isCurrentMonth && 'trc-calendar-month-current',
                month.disabled && 'trc-calendar-month-disabled'
              )}
              onClick={() => handleMonthSelect(month)}
              disabled={month.disabled}
              aria-label={month.name}
              aria-selected={month.isCurrentMonth}
              aria-disabled={month.disabled}
            >
              {month.shortName}
            </button>
          );
        })}
      </div>
    );
  }
);

CalendarMonthPicker.displayName = 'Calendar.MonthPicker';
