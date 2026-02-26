/**
 * Bikram Sambat (BS) to AD (Gregorian) Date Converter
 *
 * This module provides accurate conversion between BS and AD dates
 * using a lookup table approach (required due to the lunisolar nature of BS calendar).
 */

import {
  BS_MONTH_DAYS,
  BS_EPOCH,
  BS_YEAR_RANGE,
  getDaysInBsMonth,
  isBsYearSupported,
} from '../data/bs-calendar-data';
import type { CalendarDate, DateComponents } from '../types';

/**
 * Check if a Gregorian year is a leap year
 */
export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/**
 * Get days in a Gregorian month
 */
export function getDaysInAdMonth(year: number, month: number): number {
  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (month === 2 && isLeapYear(year)) {
    return 29;
  }
  return daysInMonth[month - 1];
}

/**
 * Get total days in a Gregorian year
 */
export function getTotalDaysInAdYear(year: number): number {
  return isLeapYear(year) ? 366 : 365;
}

/**
 * Calculate the number of days from the reference AD date to a target AD date
 */
function daysSinceAdEpoch(year: number, month: number, day: number): number {
  const { year: epochYear, month: epochMonth, day: epochDay } = BS_EPOCH.ad;

  let totalDays = 0;

  // Add days for complete years
  if (year > epochYear) {
    for (let y = epochYear; y < year; y++) {
      totalDays += getTotalDaysInAdYear(y);
    }
  } else if (year < epochYear) {
    for (let y = year; y < epochYear; y++) {
      totalDays -= getTotalDaysInAdYear(y);
    }
  }

  // Add days for complete months in the target year
  for (let m = 1; m < month; m++) {
    totalDays += getDaysInAdMonth(year, m);
  }
  totalDays += day;

  // Subtract days for the epoch date
  for (let m = 1; m < epochMonth; m++) {
    totalDays -= getDaysInAdMonth(epochYear, m);
  }
  totalDays -= epochDay;

  return totalDays;
}

/**
 * Calculate the number of days from the reference BS date to a target BS date
 */
function daysSinceBsEpoch(year: number, month: number, day: number): number {
  const { year: epochYear, month: epochMonth, day: epochDay } = BS_EPOCH.bs;

  let totalDays = 0;

  // Add days for complete years
  if (year > epochYear) {
    for (let y = epochYear; y < year; y++) {
      const monthDays = BS_MONTH_DAYS[y];
      if (monthDays) {
        totalDays += monthDays.reduce((sum, d) => sum + d, 0);
      }
    }
  } else if (year < epochYear) {
    for (let y = year; y < epochYear; y++) {
      const monthDays = BS_MONTH_DAYS[y];
      if (monthDays) {
        totalDays -= monthDays.reduce((sum, d) => sum + d, 0);
      }
    }
  }

  // Add days for complete months in the target year
  const monthDays = BS_MONTH_DAYS[year];
  if (monthDays) {
    for (let m = 0; m < month - 1; m++) {
      totalDays += monthDays[m];
    }
  }
  totalDays += day;

  // Subtract days for the epoch date
  const epochMonthDays = BS_MONTH_DAYS[epochYear];
  if (epochMonthDays) {
    for (let m = 0; m < epochMonth - 1; m++) {
      totalDays -= epochMonthDays[m];
    }
  }
  totalDays -= epochDay;

  return totalDays;
}

/**
 * Convert AD date to number of days since epoch, then to BS date
 */
function daysToBS(totalDays: number): DateComponents {
  let year = BS_EPOCH.bs.year;
  let month = BS_EPOCH.bs.month;
  let day = BS_EPOCH.bs.day + totalDays;

  // Handle negative days (dates before epoch)
  while (day <= 0) {
    month--;
    if (month < 1) {
      year--;
      month = 12;
    }
    if (!isBsYearSupported(year)) {
      throw new Error(`Date conversion resulted in unsupported BS year: ${year}`);
    }
    day += getDaysInBsMonth(year, month);
  }

  // Handle positive overflow
  while (true) {
    const daysInMonth = getDaysInBsMonth(year, month);
    if (day <= daysInMonth) {
      break;
    }
    day -= daysInMonth;
    month++;
    if (month > 12) {
      year++;
      month = 1;
    }
    if (!isBsYearSupported(year)) {
      throw new Error(`Date conversion resulted in unsupported BS year: ${year}`);
    }
  }

  return { year, month, day };
}

/**
 * Convert BS date to number of days since epoch, then to AD date
 */
function daysToAD(totalDays: number): DateComponents {
  let year = BS_EPOCH.ad.year;
  let month = BS_EPOCH.ad.month;
  let day = BS_EPOCH.ad.day + totalDays;

  // Handle negative days (dates before epoch)
  while (day <= 0) {
    month--;
    if (month < 1) {
      year--;
      month = 12;
    }
    day += getDaysInAdMonth(year, month);
  }

  // Handle positive overflow
  while (true) {
    const daysInMonth = getDaysInAdMonth(year, month);
    if (day <= daysInMonth) {
      break;
    }
    day -= daysInMonth;
    month++;
    if (month > 12) {
      year++;
      month = 1;
    }
  }

  return { year, month, day };
}

/**
 * Convert AD (Gregorian) date to BS (Bikram Sambat) date
 */
export function adToBs(date: Date | DateComponents): CalendarDate {
  let year: number, month: number, day: number;

  if (date instanceof Date) {
    year = date.getFullYear();
    month = date.getMonth() + 1;
    day = date.getDate();
  } else {
    year = date.year;
    month = date.month;
    day = date.day;
  }

  const totalDays = daysSinceAdEpoch(year, month, day);
  const bsDate = daysToBS(totalDays);

  return {
    ...bsDate,
    calendarType: 'BS',
  };
}

/**
 * Convert BS (Bikram Sambat) date to AD (Gregorian) date
 */
export function bsToAd(date: CalendarDate | DateComponents): CalendarDate {
  const { year, month, day } = date;

  if (!isBsYearSupported(year)) {
    throw new Error(
      `BS year ${year} is out of supported range (${BS_YEAR_RANGE.min}-${BS_YEAR_RANGE.max})`
    );
  }

  const totalDays = daysSinceBsEpoch(year, month, day);
  const adDate = daysToAD(totalDays);

  return {
    ...adDate,
    calendarType: 'AD',
  };
}

/**
 * Convert BS date to JavaScript Date object
 */
export function bsToJsDate(date: CalendarDate | DateComponents): Date {
  const adDate = bsToAd(date);
  return new Date(adDate.year, adDate.month - 1, adDate.day);
}

/**
 * Convert JavaScript Date to BS date
 */
export function jsDateToBs(date: Date): CalendarDate {
  return adToBs(date);
}

/**
 * Validate if a BS date is valid
 */
export function isValidBsDate(year: number, month: number, day: number): boolean {
  if (!isBsYearSupported(year)) {
    return false;
  }

  if (month < 1 || month > 12) {
    return false;
  }

  const daysInMonth = getDaysInBsMonth(year, month);
  return day >= 1 && day <= daysInMonth;
}

/**
 * Validate if an AD date is valid
 */
export function isValidAdDate(year: number, month: number, day: number): boolean {
  if (month < 1 || month > 12) {
    return false;
  }

  const daysInMonth = getDaysInAdMonth(year, month);
  return day >= 1 && day <= daysInMonth;
}

/**
 * Get today's date in BS
 */
export function getTodayBs(): CalendarDate {
  return adToBs(new Date());
}

/**
 * Get today's date in AD
 */
export function getTodayAd(): CalendarDate {
  const today = new Date();
  return {
    year: today.getFullYear(),
    month: today.getMonth() + 1,
    day: today.getDate(),
    calendarType: 'AD',
  };
}

/**
 * Compare two calendar dates
 * Returns: -1 if a < b, 0 if a === b, 1 if a > b
 */
export function compareDates(a: CalendarDate | DateComponents, b: CalendarDate | DateComponents): number {
  if (a.year !== b.year) {
    return a.year < b.year ? -1 : 1;
  }
  if (a.month !== b.month) {
    return a.month < b.month ? -1 : 1;
  }
  if (a.day !== b.day) {
    return a.day < b.day ? -1 : 1;
  }
  return 0;
}

/**
 * Check if two dates are the same
 */
export function isSameDate(a: CalendarDate | DateComponents, b: CalendarDate | DateComponents): boolean {
  return a.year === b.year && a.month === b.month && a.day === b.day;
}

/**
 * Check if two dates are in the same month
 */
export function isSameMonth(a: CalendarDate | DateComponents, b: CalendarDate | DateComponents): boolean {
  return a.year === b.year && a.month === b.month;
}

/**
 * Add days to a BS date
 */
export function addDaysBs(date: CalendarDate | DateComponents, days: number): CalendarDate {
  const jsDate = bsToJsDate(date);
  jsDate.setDate(jsDate.getDate() + days);
  return adToBs(jsDate);
}

/**
 * Add months to a BS date
 */
export function addMonthsBs(date: CalendarDate | DateComponents, months: number): CalendarDate {
  let { year, month, day } = date;

  month += months;

  while (month > 12) {
    year++;
    month -= 12;
  }

  while (month < 1) {
    year--;
    month += 12;
  }

  // Clamp day to max days in the new month
  const maxDay = getDaysInBsMonth(year, month);
  if (day > maxDay) {
    day = maxDay;
  }

  return { year, month, day, calendarType: 'BS' };
}

/**
 * Add years to a BS date
 */
export function addYearsBs(date: CalendarDate | DateComponents, years: number): CalendarDate {
  let { year, month, day } = date;
  year += years;

  // Clamp day to max days in the new month
  const maxDay = getDaysInBsMonth(year, month);
  if (day > maxDay) {
    day = maxDay;
  }

  return { year, month, day, calendarType: 'BS' };
}

/**
 * Get the start of a BS month
 */
export function startOfMonthBs(date: CalendarDate | DateComponents): CalendarDate {
  return {
    year: date.year,
    month: date.month,
    day: 1,
    calendarType: 'BS',
  };
}

/**
 * Get the end of a BS month
 */
export function endOfMonthBs(date: CalendarDate | DateComponents): CalendarDate {
  return {
    year: date.year,
    month: date.month,
    day: getDaysInBsMonth(date.year, date.month),
    calendarType: 'BS',
  };
}

/**
 * Get the day of week for a BS date (0 = Sunday, 6 = Saturday)
 */
export function getDayOfWeekBs(date: CalendarDate | DateComponents): number {
  const jsDate = bsToJsDate(date);
  return jsDate.getDay();
}
