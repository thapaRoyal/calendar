/**
 * Multi-Calendar Utilities
 *
 * Functions for handling multiple calendar months display and synchronized navigation.
 */

import type {
  CalendarDate,
  CalendarType,
  CalendarConfig,
  Week,
  WeekDay,
  MultiCalendarConfig,
} from '../types';
import {
  getWeeksInMonth,
  getNextMonth,
  getPrevMonth,
  getDaysInMonth,
} from './calendar-utils';
import type { SelectionState } from '../machines/selection.machine';
import {
  isDateInSelectionRange,
  isSelectionRangeStart,
  isSelectionRangeEnd,
  isDateMultiSelected,
} from '../machines/selection.machine';

/**
 * Offset a date by N months
 */
export function offsetMonth(
  date: CalendarDate,
  offset: number,
  calendarType: CalendarType
): CalendarDate {
  let result = { ...date, calendarType };

  if (offset > 0) {
    for (let i = 0; i < offset; i++) {
      result = getNextMonth(result);
    }
  } else if (offset < 0) {
    for (let i = 0; i < Math.abs(offset); i++) {
      result = getPrevMonth(result);
    }
  }

  return result;
}

/**
 * Get weeks for multiple months starting from a base date
 */
export function getMultiMonthWeeks(
  startDate: CalendarDate,
  numberOfMonths: number,
  config: CalendarConfig,
  selectionState?: Partial<SelectionState>,
  disabledDates?: CalendarDate[]
): Week[][] {
  const allWeeks: Week[][] = [];

  for (let i = 0; i < numberOfMonths; i++) {
    const monthDate = offsetMonth(startDate, i, config.calendarType);
    const weeks = getWeeksInMonth(
      monthDate.year,
      monthDate.month,
      config.calendarType,
      config,
      selectionState?.selectedDate,
      disabledDates
    );

    // Enhance weeks with selection state if provided
    if (selectionState) {
      const enhancedWeeks = weeks.map(week =>
        week.map(day => enhanceWeekDayWithSelection(day, selectionState))
      );
      allWeeks.push(enhancedWeeks);
    } else {
      allWeeks.push(weeks);
    }
  }

  return allWeeks;
}

/**
 * Enhance a WeekDay with selection state information
 */
export function enhanceWeekDayWithSelection(
  day: WeekDay,
  selectionState: Partial<SelectionState>
): WeekDay {
  const {
    selectionMode = 'single',
    startDate,
    endDate,
    hoveredDate,
    selectingEnd = false,
    selectedDates = [],
  } = selectionState;

  const enhanced: WeekDay = { ...day };

  switch (selectionMode) {
    case 'range':
      enhanced.isRangeStart = isSelectionRangeStart(
        day.date,
        startDate ?? null,
        endDate ?? null,
        hoveredDate ?? null,
        selectingEnd
      );
      enhanced.isRangeEnd = isSelectionRangeEnd(
        day.date,
        startDate ?? null,
        endDate ?? null,
        hoveredDate ?? null,
        selectingEnd
      );
      enhanced.isInRange = isDateInSelectionRange(
        day.date,
        startDate ?? null,
        endDate ?? null,
        hoveredDate ?? null,
        selectingEnd
      );
      enhanced.isRangeHover = selectingEnd && hoveredDate
        ? isDateInSelectionRange(day.date, startDate ?? null, null, hoveredDate, true)
        : false;
      // Also set isSelected for range endpoints
      enhanced.isSelected = enhanced.isRangeStart || enhanced.isRangeEnd;
      break;

    case 'multiple':
      enhanced.isMultiSelected = isDateMultiSelected(day.date, selectedDates);
      enhanced.isSelected = enhanced.isMultiSelected;
      break;

    case 'single':
    default:
      // isSelected is already set from getWeeksInMonth
      break;
  }

  return enhanced;
}

/**
 * Get month titles for multi-calendar display
 */
export function getMultiMonthTitles(
  startDate: CalendarDate,
  numberOfMonths: number,
  calendarType: CalendarType,
  locale: 'en' | 'ne' = 'en'
): Array<{ year: number; month: number; title: string }> {
  const { formatMonthYear } = require('./format');
  const titles: Array<{ year: number; month: number; title: string }> = [];

  for (let i = 0; i < numberOfMonths; i++) {
    const monthDate = offsetMonth(startDate, i, calendarType);
    titles.push({
      year: monthDate.year,
      month: monthDate.month,
      title: formatMonthYear(monthDate.year, monthDate.month, calendarType, locale),
    });
  }

  return titles;
}

/**
 * Check if navigation to previous period is allowed for multi-calendar
 */
export function canNavigatePrev(
  startDate: CalendarDate,
  config: MultiCalendarConfig
): boolean {
  if (!config.minDate) return true;

  const prevMonth = getPrevMonth(startDate);
  return (
    prevMonth.year > config.minDate.year ||
    (prevMonth.year === config.minDate.year && prevMonth.month >= config.minDate.month)
  );
}

/**
 * Check if navigation to next period is allowed for multi-calendar
 */
export function canNavigateNext(
  startDate: CalendarDate,
  numberOfMonths: number,
  config: MultiCalendarConfig
): boolean {
  if (!config.maxDate) return true;

  // Check the last visible month
  const lastMonth = offsetMonth(startDate, numberOfMonths - 1, config.calendarType);
  const nextMonth = getNextMonth(lastMonth);

  return (
    nextMonth.year < config.maxDate.year ||
    (nextMonth.year === config.maxDate.year && nextMonth.month <= config.maxDate.month)
  );
}

/**
 * Navigate multi-calendar by one month or by numberOfMonths (paged)
 */
export function navigateMultiCalendar(
  startDate: CalendarDate,
  direction: 'prev' | 'next',
  numberOfMonths: number,
  pagedNavigation: boolean = false
): CalendarDate {
  const offset = pagedNavigation ? numberOfMonths : 1;
  return direction === 'next'
    ? offsetMonth(startDate, offset, startDate.calendarType)
    : offsetMonth(startDate, -offset, startDate.calendarType);
}

/**
 * Get the visible date range for multi-calendar
 */
export function getVisibleDateRange(
  startDate: CalendarDate,
  numberOfMonths: number,
  calendarType: CalendarType
): { start: CalendarDate; end: CalendarDate } {
  const firstMonth = { ...startDate, day: 1 };
  const lastMonthDate = offsetMonth(startDate, numberOfMonths - 1, calendarType);
  const lastDay = getDaysInMonth(lastMonthDate.year, lastMonthDate.month, calendarType);

  return {
    start: firstMonth,
    end: {
      year: lastMonthDate.year,
      month: lastMonthDate.month,
      day: lastDay,
      calendarType,
    },
  };
}
