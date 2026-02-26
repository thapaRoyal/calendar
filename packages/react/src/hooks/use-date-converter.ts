import * as React from 'react';
import {
  adToBs,
  bsToAd,
  bsToJsDate,
  jsDateToBs,
  formatDate,
  parseDate,
  isValidBsDate,
  isValidAdDate,
  type CalendarDate,
  type CalendarType,
  type Locale,
} from '@thaparoyal/calendar-core';

/**
 * Options for useDateConverter hook
 */
export interface UseDateConverterOptions {
  /** Default locale for formatting */
  locale?: Locale;
}

/**
 * Return type for useDateConverter hook
 */
export interface UseDateConverterReturn {
  /** Convert AD date to BS date */
  adToBs: (date: Date | { year: number; month: number; day: number }) => CalendarDate;
  /** Convert BS date to AD date */
  bsToAd: (date: CalendarDate | { year: number; month: number; day: number }) => CalendarDate;
  /** Convert BS date to JavaScript Date */
  toJsDate: (date: CalendarDate | { year: number; month: number; day: number }) => Date;
  /** Convert JavaScript Date to BS */
  fromJsDate: (date: Date) => CalendarDate;
  /** Format a date to string */
  format: (date: CalendarDate, formatStr?: string) => string;
  /** Parse a date string */
  parse: (dateStr: string, calendarType: CalendarType) => CalendarDate | null;
  /** Validate a BS date */
  isValidBs: (year: number, month: number, day: number) => boolean;
  /** Validate an AD date */
  isValidAd: (year: number, month: number, day: number) => boolean;
}

/**
 * Hook for date conversion utilities
 */
export function useDateConverter(
  options: UseDateConverterOptions = {}
): UseDateConverterReturn {
  const { locale = 'en' } = options;

  return React.useMemo(
    () => ({
      adToBs,
      bsToAd,
      toJsDate: bsToJsDate,
      fromJsDate: jsDateToBs,
      format: (date: CalendarDate, formatStr = 'YYYY-MM-DD') =>
        formatDate(date, formatStr, locale),
      parse: parseDate,
      isValidBs: isValidBsDate,
      isValidAd: isValidAdDate,
    }),
    [locale]
  );
}
