/**
 * Date Converters
 *
 * This module exports all date conversion utilities for AD and BS calendars.
 */

export {
  // AD/BS Conversion
  adToBs,
  bsToAd,
  bsToJsDate,
  jsDateToBs,

  // Validation
  isValidBsDate,
  isValidAdDate,
  isLeapYear,

  // Today
  getTodayBs,
  getTodayAd,

  // Comparison
  compareDates,
  isSameDate,
  isSameMonth,

  // Date manipulation
  addDaysBs,
  addMonthsBs,
  addYearsBs,
  startOfMonthBs,
  endOfMonthBs,

  // Utilities
  getDayOfWeekBs,
  getDaysInAdMonth,
  getTotalDaysInAdYear,
} from './bs-converter';
