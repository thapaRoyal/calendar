import * as React from 'react';
import { useCalendarContext } from '../context/calendar-context';
import { useCalendarCustomization } from '../context/customization-context';
import { useCalendarInternal } from './calendar-root';
import { cn } from '../utils/cn';
import type { WeekDay, CalendarDate } from '@thaparoyal/calendar-core';
import type { CalendarClassNames, CalendarComponents } from '../types';

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
 * Automatically hides itself when viewMode is 'month' or 'year',
 * so that Calendar.MonthPicker / YearPicker can take its place.
 */
export const CalendarGrid = React.forwardRef<HTMLTableElement, CalendarGridProps>(
  ({ className, children }, ref) => {
    const { classNames } = useCalendarCustomization();
    const { viewMode } = useCalendarContext();

    if (viewMode !== 'day') {
      return null;
    }

    return (
      <table
        ref={ref}
        className={cn('trc-calendar-grid', classNames.grid, className)}
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
    const { classNames } = useCalendarCustomization();

    if (children) {
      return <thead ref={ref}>{children(weekdayNames)}</thead>;
    }

    return (
      <thead ref={ref} className={cn('trc-calendar-grid-head', classNames.gridHead, className)}>
        <tr>
          {weekdayNames.map((day, index) => (
            <th key={index} className={cn('trc-calendar-weekday', classNames.weekday)} aria-label={day}>
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
    const { weeks, formatDayNumber } = useCalendarInternal();
    const { actions } = useCalendarContext();
    const { classNames, components } = useCalendarCustomization();

    return (
      <tbody ref={ref} className={cn('trc-calendar-grid-body', classNames.gridBody, className)}>
        {weeks.map((week, weekIndex) => (
          <tr key={weekIndex} className={cn('trc-calendar-week', classNames.week)}>
            {week.map((day, dayIndex) => {
              if (renderDay) {
                return (
                  <td key={dayIndex} className={cn('trc-calendar-cell', classNames.cell)}>
                    {renderDay(day, dayIndex)}
                  </td>
                );
              }

              return (
                <CalendarCell
                  key={dayIndex}
                  day={day}
                  onSelect={actions.selectDate}
                  formatDayNumber={formatDayNumber}
                  classNames={classNames}
                  components={components}
                />
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
  formatDayNumber: (day: number) => string;
  classNames: CalendarClassNames;
  components: CalendarComponents;
}

/**
 * Individual calendar day cell
 */
function CalendarCell({ day, onSelect, formatDayNumber, classNames, components }: CalendarCellProps) {
  const formattedDay = formatDayNumber(day.date.day);

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

  const DayComponent = components.Day;
  const DayContentComponent = components.DayContent;

  // If custom Day component is provided, use it
  if (DayComponent) {
    return (
      <td
        className={cn(
          'trc-calendar-cell',
          classNames.cell,
          day.isToday && cn('trc-calendar-cell-today', classNames.dayToday),
          day.isSelected && cn('trc-calendar-cell-selected', classNames.daySelected),
          day.isDisabled && cn('trc-calendar-cell-disabled', classNames.dayDisabled),
          day.isOutsideMonth && cn('trc-calendar-cell-outside', classNames.dayOutside)
        )}
        role="gridcell"
        aria-selected={day.isSelected}
        aria-disabled={day.isDisabled}
      >
        <DayComponent
          day={day}
          onClick={handleClick}
          formattedDay={formattedDay}
          disabled={day.isDisabled}
        />
      </td>
    );
  }

  return (
    <td
      className={cn(
        'trc-calendar-cell',
        classNames.cell,
        day.isToday && cn('trc-calendar-cell-today', classNames.dayToday),
        day.isSelected && cn('trc-calendar-cell-selected', classNames.daySelected),
        day.isDisabled && cn('trc-calendar-cell-disabled', classNames.dayDisabled),
        day.isOutsideMonth && cn('trc-calendar-cell-outside', classNames.dayOutside)
      )}
      role="gridcell"
      aria-selected={day.isSelected}
      aria-disabled={day.isDisabled}
    >
      <button
        type="button"
        className={cn('trc-calendar-day', classNames.day)}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        disabled={day.isDisabled}
        tabIndex={day.isDisabled ? -1 : 0}
        aria-label={`${day.date.day}`}
      >
        {DayContentComponent ? (
          <DayContentComponent day={day} formattedDay={formattedDay} />
        ) : (
          formattedDay
        )}
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
    const { formatDayNumber } = useCalendarInternal();

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
          {children ?? formatDayNumber(day.date.day)}
        </button>
      </td>
    );
  }
);

CalendarDayCell.displayName = 'Calendar.DayCell';
