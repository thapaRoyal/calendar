import * as React from 'react';
import { useMultiCalendarContext, type MultiCalendarMonth } from './multi-calendar-context';
import { cn } from '../utils/cn';
import type { WeekDay, CalendarDate } from '@thaparoyal/calendar-core';

/**
 * Multi-calendar calendars container props
 */
export interface MultiCalendarCalendarsProps {
  className?: string;
  /** Custom render function for each month */
  renderMonth?: (month: MultiCalendarMonth, index: number) => React.ReactNode;
  /** Show individual month titles */
  showMonthTitles?: boolean;
}

/**
 * Multi-calendar calendars container
 *
 * Renders all months side by side.
 */
export const MultiCalendarCalendars = React.forwardRef<HTMLDivElement, MultiCalendarCalendarsProps>(
  ({ className, renderMonth, showMonthTitles = false }, ref) => {
    const { months, weekdayNames, selectDate, hoverDate, formatDayNumber, selectionMode } =
      useMultiCalendarContext();

    return (
      <div ref={ref} className={cn('trc-multi-calendar-calendars', className)}>
        {months.map((month, index) => {
          if (renderMonth) {
            return (
              <div key={`${month.year}-${month.month}`} className="trc-multi-calendar-month">
                {renderMonth(month, index)}
              </div>
            );
          }

          return (
            <div key={`${month.year}-${month.month}`} className="trc-multi-calendar-month">
              {showMonthTitles && (
                <div className="trc-multi-calendar-month-title">{month.title}</div>
              )}
              <table className="trc-calendar-grid" role="grid" aria-label={month.title}>
                <thead className="trc-calendar-grid-head">
                  <tr>
                    {weekdayNames.map((day, dayIndex) => (
                      <th key={dayIndex} className="trc-calendar-weekday" aria-label={day}>
                        {day}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="trc-calendar-grid-body">
                  {month.weeks.map((week, weekIndex) => (
                    <tr key={weekIndex} className="trc-calendar-week">
                      {week.map((day, dayIndex) => (
                        <MultiCalendarCell
                          key={dayIndex}
                          day={day}
                          onSelect={selectDate}
                          onHover={selectionMode === 'range' ? hoverDate : undefined}
                          formatDayNumber={formatDayNumber}
                        />
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })}
      </div>
    );
  }
);

MultiCalendarCalendars.displayName = 'MultiCalendar.Calendars';

/**
 * Multi-calendar cell props
 */
interface MultiCalendarCellProps {
  day: WeekDay;
  onSelect: (date: CalendarDate) => void;
  onHover?: (date: CalendarDate | null) => void;
  formatDayNumber: (day: number) => string;
}

/**
 * Individual multi-calendar day cell
 */
function MultiCalendarCell({ day, onSelect, onHover, formatDayNumber }: MultiCalendarCellProps) {
  const handleClick = () => {
    if (!day.isDisabled) {
      onSelect(day.date);
    }
  };

  const handleMouseEnter = () => {
    if (!day.isDisabled && onHover) {
      onHover(day.date);
    }
  };

  const handleMouseLeave = () => {
    if (onHover) {
      onHover(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && !day.isDisabled) {
      e.preventDefault();
      onSelect(day.date);
    }
  };

  return (
    <td
      className={cn(
        'trc-calendar-cell',
        day.isToday && 'trc-calendar-cell-today',
        day.isSelected && 'trc-calendar-cell-selected',
        day.isDisabled && 'trc-calendar-cell-disabled',
        day.isOutsideMonth && 'trc-calendar-cell-outside',
        // Range-specific classes
        day.isRangeStart && 'trc-calendar-cell-range-start',
        day.isRangeEnd && 'trc-calendar-cell-range-end',
        day.isInRange && !day.isRangeStart && !day.isRangeEnd && 'trc-calendar-cell-range-middle',
        day.isRangeHover && 'trc-calendar-cell-range-hover',
        // Multi-select class
        day.isMultiSelected && 'trc-calendar-cell-multi-selected'
      )}
      role="gridcell"
      aria-selected={day.isSelected || day.isRangeStart || day.isRangeEnd || day.isMultiSelected}
      aria-disabled={day.isDisabled}
    >
      <button
        type="button"
        className="trc-calendar-day"
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onKeyDown={handleKeyDown}
        disabled={day.isDisabled}
        tabIndex={day.isDisabled ? -1 : 0}
        aria-label={`${day.date.day}`}
      >
        {formatDayNumber(day.date.day)}
      </button>
    </td>
  );
}
