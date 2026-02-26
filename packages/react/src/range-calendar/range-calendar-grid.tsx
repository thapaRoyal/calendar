import * as React from 'react';
import { useRangeCalendarContext } from './range-calendar-context';
import { cn } from '../utils/cn';
import type { WeekDay, CalendarDate } from '@thaparoyal/calendar-core';

/**
 * Range calendar grid props
 */
export interface RangeCalendarGridProps {
  className?: string;
  children?: React.ReactNode;
}

/**
 * Range calendar grid container
 */
export const RangeCalendarGrid = React.forwardRef<HTMLTableElement, RangeCalendarGridProps>(
  ({ className, children }, ref) => {
    return (
      <table
        ref={ref}
        className={cn('trc-calendar-grid', className)}
        role="grid"
        aria-label="Range Calendar"
      >
        {children}
      </table>
    );
  }
);

RangeCalendarGrid.displayName = 'RangeCalendar.Grid';

/**
 * Range calendar grid head props
 */
export interface RangeCalendarGridHeadProps {
  className?: string;
  children?: (weekdayNames: readonly string[]) => React.ReactNode;
}

/**
 * Range calendar grid header with weekday names
 */
export const RangeCalendarGridHead = React.forwardRef<
  HTMLTableSectionElement,
  RangeCalendarGridHeadProps
>(({ className, children }, ref) => {
  const { weekdayNames } = useRangeCalendarContext();

  if (children) {
    return <thead ref={ref}>{children(weekdayNames)}</thead>;
  }

  return (
    <thead ref={ref} className={cn('trc-calendar-grid-head', className)}>
      <tr>
        {weekdayNames.map((day, index) => (
          <th key={index} className="trc-calendar-weekday" aria-label={day}>
            {day}
          </th>
        ))}
      </tr>
    </thead>
  );
});

RangeCalendarGridHead.displayName = 'RangeCalendar.GridHead';

/**
 * Range calendar grid body props
 */
export interface RangeCalendarGridBodyProps {
  className?: string;
  renderDay?: (day: WeekDay, index: number) => React.ReactNode;
}

/**
 * Range calendar grid body with day cells
 */
export const RangeCalendarGridBody = React.forwardRef<
  HTMLTableSectionElement,
  RangeCalendarGridBodyProps
>(({ className, renderDay }, ref) => {
  const { weeks, selectDate, hoverDate, formatDayNumber } = useRangeCalendarContext();

  return (
    <tbody ref={ref} className={cn('trc-calendar-grid-body', className)}>
      {weeks.map((week, weekIndex) => (
        <tr key={weekIndex} className="trc-calendar-week">
          {week.map((day, dayIndex) => {
            if (renderDay) {
              return (
                <td key={dayIndex} className="trc-calendar-cell">
                  {renderDay(day, dayIndex)}
                </td>
              );
            }

            return (
              <RangeCalendarCell
                key={dayIndex}
                day={day}
                onSelect={selectDate}
                onHover={hoverDate}
                formatDayNumber={formatDayNumber}
              />
            );
          })}
        </tr>
      ))}
    </tbody>
  );
});

RangeCalendarGridBody.displayName = 'RangeCalendar.GridBody';

/**
 * Range calendar cell props
 */
interface RangeCalendarCellProps {
  day: WeekDay;
  onSelect: (date: CalendarDate) => void;
  onHover: (date: CalendarDate | null) => void;
  formatDayNumber: (day: number) => string;
}

/**
 * Individual range calendar day cell
 */
function RangeCalendarCell({ day, onSelect, onHover, formatDayNumber }: RangeCalendarCellProps) {
  const handleClick = () => {
    if (!day.isDisabled) {
      onSelect(day.date);
    }
  };

  const handleMouseEnter = () => {
    if (!day.isDisabled) {
      onHover(day.date);
    }
  };

  const handleMouseLeave = () => {
    onHover(null);
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
        day.isDisabled && 'trc-calendar-cell-disabled',
        day.isOutsideMonth && 'trc-calendar-cell-outside',
        // Range-specific classes
        day.isRangeStart && 'trc-calendar-cell-range-start',
        day.isRangeEnd && 'trc-calendar-cell-range-end',
        day.isInRange && !day.isRangeStart && !day.isRangeEnd && 'trc-calendar-cell-range-middle',
        day.isRangeHover && 'trc-calendar-cell-range-hover'
      )}
      role="gridcell"
      aria-selected={day.isRangeStart || day.isRangeEnd}
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
