import * as React from 'react';
import { useCalendarContext } from '../context/calendar-context';
import { useCalendarInternal } from './calendar-root';
import { cn } from '../utils/cn';
import type { WeekDay, CalendarDate } from '@thaparoyal/calendar-core';

/**
 * Calendar grid component props
 */
export interface CalendarGridProps {
  /** Additional class name */
  className?: string;
  /** Children */
  children?: React.ReactNode;
}

/**
 * Calendar grid container (table)
 */
export const CalendarGrid = React.forwardRef<HTMLTableElement, CalendarGridProps>(
  ({ className, children }, ref) => {
    return (
      <table
        ref={ref}
        className={cn('trc-calendar-grid', className)}
        role="grid"
        aria-label="Calendar"
      >
        {children}
      </table>
    );
  }
);

CalendarGrid.displayName = 'Calendar.Grid';

/**
 * Calendar grid head props
 */
export interface CalendarGridHeadProps {
  /** Additional class name */
  className?: string;
  /** Custom render function for weekday cells */
  children?: (weekdayNames: readonly string[]) => React.ReactNode;
}

/**
 * Calendar grid header with weekday names
 */
export const CalendarGridHead = React.forwardRef<HTMLTableSectionElement, CalendarGridHeadProps>(
  ({ className, children }, ref) => {
    const { weekdayNames } = useCalendarInternal();

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
  }
);

CalendarGridHead.displayName = 'Calendar.GridHead';

/**
 * Calendar grid body props
 */
export interface CalendarGridBodyProps {
  /** Additional class name */
  className?: string;
  /** Custom render function for day cells */
  renderDay?: (day: WeekDay, index: number) => React.ReactNode;
}

/**
 * Calendar grid body with day cells
 */
export const CalendarGridBody = React.forwardRef<HTMLTableSectionElement, CalendarGridBodyProps>(
  ({ className, renderDay }, ref) => {
    const { weeks } = useCalendarInternal();
    const { actions } = useCalendarContext();

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
                <CalendarCell key={dayIndex} day={day} onSelect={actions.selectDate} />
              );
            })}
          </tr>
        ))}
      </tbody>
    );
  }
);

CalendarGridBody.displayName = 'Calendar.GridBody';

/**
 * Calendar cell props
 */
interface CalendarCellProps {
  day: WeekDay;
  onSelect: (date: CalendarDate) => void;
}

/**
 * Individual calendar day cell
 */
function CalendarCell({ day, onSelect }: CalendarCellProps) {
  const handleClick = () => {
    if (!day.isDisabled) {
      onSelect(day.date);
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
        day.isOutsideMonth && 'trc-calendar-cell-outside'
      )}
      role="gridcell"
      aria-selected={day.isSelected}
      aria-disabled={day.isDisabled}
    >
      <button
        type="button"
        className="trc-calendar-day"
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        disabled={day.isDisabled}
        tabIndex={day.isDisabled ? -1 : 0}
        aria-label={`${day.date.day}`}
      >
        {day.date.day}
      </button>
    </td>
  );
}

/**
 * Calendar row props (for custom rendering)
 */
export interface CalendarRowProps {
  /** Additional class name */
  className?: string;
  /** Children */
  children?: React.ReactNode;
}

/**
 * Calendar row component for custom grid layouts
 */
export const CalendarRow = React.forwardRef<HTMLTableRowElement, CalendarRowProps>(
  ({ className, children }, ref) => {
    return (
      <tr ref={ref} className={cn('trc-calendar-week', className)}>
        {children}
      </tr>
    );
  }
);

CalendarRow.displayName = 'Calendar.Row';

/**
 * Calendar day cell props (for custom rendering)
 */
export interface CalendarDayCellProps {
  /** Day data */
  day: WeekDay;
  /** Additional class name */
  className?: string;
  /** Children override */
  children?: React.ReactNode;
}

/**
 * Calendar day cell component for custom rendering
 */
export const CalendarDayCell = React.forwardRef<HTMLTableCellElement, CalendarDayCellProps>(
  ({ day, className, children }, ref) => {
    const { actions } = useCalendarContext();

    const handleClick = () => {
      if (!day.isDisabled) {
        actions.selectDate(day.date);
      }
    };

    return (
      <td
        ref={ref}
        className={cn(
          'trc-calendar-cell',
          day.isToday && 'trc-calendar-cell-today',
          day.isSelected && 'trc-calendar-cell-selected',
          day.isDisabled && 'trc-calendar-cell-disabled',
          day.isOutsideMonth && 'trc-calendar-cell-outside',
          className
        )}
        role="gridcell"
        aria-selected={day.isSelected}
        aria-disabled={day.isDisabled}
      >
        <button
          type="button"
          className="trc-calendar-day"
          onClick={handleClick}
          disabled={day.isDisabled}
          tabIndex={day.isDisabled ? -1 : 0}
        >
          {children ?? day.date.day}
        </button>
      </td>
    );
  }
);

CalendarDayCell.displayName = 'Calendar.DayCell';
