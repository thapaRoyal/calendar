/**
 * Calendar Grid Utilities
 *
 * Functions for generating calendar grid data for UI rendering.
 */

import {
  getDaysInBsMonth,
  isBsYearSupported,
} from '../data/bs-calendar-data';
import {
  getDayOfWeekBs,
  startOfMonthBs,
  addDaysBs,
  isSameDate,
  isSameMonth,
  getDaysInAdMonth,
  bsToJsDate,
} from '../converters/bs-converter';
import type { CalendarDate, Week, WeekDay, CalendarType, CalendarConfig } from '../types';

/**
 * Get days in a month for any calendar type
 */
export function getDaysInMonth(year: number, month: number, calendarType: CalendarType): number {
  if (calendarType === 'BS') {
    return getDaysInBsMonth(year, month);
  }
  return getDaysInAdMonth(year, month);
}

/**
 * Get the day of week for any date
 */
export function getDayOfWeek(date: CalendarDate): number {
  if (date.calendarType === 'BS') {
    return getDayOfWeekBs(date);
  }
  const jsDate = new Date(date.year, date.month - 1, date.day);
  return jsDate.getDay();
}

/**
 * Get the start of a month for any calendar type
 */
export function startOfMonth(date: CalendarDate): CalendarDate {
  if (date.calendarType === 'BS') {
    return startOfMonthBs(date);
  }
  return {
    year: date.year,
    month: date.month,
    day: 1,
    calendarType: 'AD',
  };
}

/**
 * Add days to any calendar date
 */
export function addDays(date: CalendarDate, days: number): CalendarDate {
  if (date.calendarType === 'BS') {
    return addDaysBs(date, days);
  }

  const jsDate = new Date(date.year, date.month - 1, date.day);
  jsDate.setDate(jsDate.getDate() + days);

  return {
    year: jsDate.getFullYear(),
    month: jsDate.getMonth() + 1,
    day: jsDate.getDate(),
    calendarType: 'AD',
  };
}

/**
 * Check if a date is today
 */
export function isToday(date: CalendarDate): boolean {
  const today = new Date();

  if (date.calendarType === 'BS') {
    const jsDate = bsToJsDate(date);
    return (
      jsDate.getFullYear() === today.getFullYear() &&
      jsDate.getMonth() === today.getMonth() &&
      jsDate.getDate() === today.getDate()
    );
  }

  return (
    date.year === today.getFullYear() &&
    date.month === today.getMonth() + 1 &&
    date.day === today.getDate()
  );
}

/**
 * Check if a date is within a valid range
 */
export function isDateInRange(
  date: CalendarDate,
  minDate?: CalendarDate,
  maxDate?: CalendarDate
): boolean {
  if (minDate) {
    if (date.year < minDate.year) return false;
    if (date.year === minDate.year && date.month < minDate.month) return false;
    if (date.year === minDate.year && date.month === minDate.month && date.day < minDate.day)
      return false;
  }

  if (maxDate) {
    if (date.year > maxDate.year) return false;
    if (date.year === maxDate.year && date.month > maxDate.month) return false;
    if (date.year === maxDate.year && date.month === maxDate.month && date.day > maxDate.day)
      return false;
  }

  return true;
}

/**
 * Check if a date is disabled
 */
export function isDateDisabled(
  date: CalendarDate,
  config: CalendarConfig,
  disabledDates?: CalendarDate[]
): boolean {
  // Check range constraints
  if (!isDateInRange(date, config.minDate, config.maxDate)) {
    return true;
  }

  // Check BS year support
  if (date.calendarType === 'BS' && !isBsYearSupported(date.year)) {
    return true;
  }

  // Check specific disabled dates
  if (disabledDates) {
    return disabledDates.some((d) => isSameDate(d, date));
  }

  return false;
}

/**
 * Generate weeks array for a month (for calendar grid)
 */
export function getWeeksInMonth(
  year: number,
  month: number,
  calendarType: CalendarType,
  config: CalendarConfig,
  selectedDate?: CalendarDate | null,
  disabledDates?: CalendarDate[]
): Week[] {
  const weeks: Week[] = [];
  // daysInMonth is used for validation in future enhancements
  const _daysInMonth = getDaysInMonth(year, month, calendarType);
  void _daysInMonth;

  // Get the first day of the month
  const firstDay: CalendarDate = {
    year,
    month,
    day: 1,
    calendarType,
  };

  // Get the day of week for the first day (0 = Sunday)
  const firstDayOfWeek = getDayOfWeek(firstDay);

  // Adjust for week start preference
  const weekStartsOn = config.weekStartsOn;
  let offset = firstDayOfWeek - weekStartsOn;
  if (offset < 0) offset += 7;

  // Start from the first visible day (may be from previous month)
  let currentDate = addDays(firstDay, -offset);

  // Generate 6 weeks (max possible for any month view)
  for (let week = 0; week < 6; week++) {
    const weekDays: WeekDay[] = [];

    for (let day = 0; day < 7; day++) {
      const isOutsideMonth = !isSameMonth(currentDate, firstDay);
      const dayOfWeek = getDayOfWeek(currentDate);

      weekDays.push({
        date: { ...currentDate },
        isToday: isToday(currentDate),
        isSelected: selectedDate ? isSameDate(currentDate, selectedDate) : false,
        isDisabled: isDateDisabled(currentDate, config, disabledDates),
        isOutsideMonth,
        dayOfWeek,
      });

      currentDate = addDays(currentDate, 1);
    }

    weeks.push(weekDays);

    // Stop if we've gone past the current month and into the next
    if (weeks.length > 1 && weekDays[0].date.month !== month && weekDays[0].date.month !== month - 1) {
      // Check if we actually need this week (has any days from current month)
      const hasCurrentMonthDays = weekDays.some((d) => d.date.month === month);
      if (!hasCurrentMonthDays) {
        weeks.pop();
        break;
      }
    }
  }

  return weeks;
}

/**
 * Get years range for year picker
 */
export function getYearsRange(
  currentYear: number,
  calendarType: CalendarType,
  rangeSize: number = 12
): number[] {
  const years: number[] = [];
  const startYear = Math.floor(currentYear / rangeSize) * rangeSize;

  for (let i = 0; i < rangeSize; i++) {
    const year = startYear + i;
    if (calendarType === 'BS' && !isBsYearSupported(year)) {
      continue;
    }
    years.push(year);
  }

  return years;
}

/**
 * Get months for month picker
 */
export function getMonthsForPicker(
  year: number,
  calendarType: CalendarType
): Array<{ month: number; disabled: boolean }> {
  return Array.from({ length: 12 }, (_, i) => ({
    month: i + 1,
    disabled: calendarType === 'BS' && !isBsYearSupported(year),
  }));
}

/**
 * Navigate to next month
 */
export function getNextMonth(date: CalendarDate): CalendarDate {
  let { year, month } = date;
  month++;
  if (month > 12) {
    month = 1;
    year++;
  }
  return { year, month, day: 1, calendarType: date.calendarType };
}

/**
 * Navigate to previous month
 */
export function getPrevMonth(date: CalendarDate): CalendarDate {
  let { year, month } = date;
  month--;
  if (month < 1) {
    month = 12;
    year--;
  }
  return { year, month, day: 1, calendarType: date.calendarType };
}

/**
 * Navigate to next year
 */
export function getNextYear(date: CalendarDate): CalendarDate {
  return { ...date, year: date.year + 1 };
}

/**
 * Navigate to previous year
 */
export function getPrevYear(date: CalendarDate): CalendarDate {
  return { ...date, year: date.year - 1 };
}

/**
 * Get today's date in specified calendar type
 */
export function getToday(calendarType: CalendarType): CalendarDate {
  const today = new Date();

  if (calendarType === 'AD') {
    return {
      year: today.getFullYear(),
      month: today.getMonth() + 1,
      day: today.getDate(),
      calendarType: 'AD',
    };
  }

  // For BS, we need to convert from AD
  const { adToBs } = require('../converters/bs-converter');
  return adToBs(today);
}
