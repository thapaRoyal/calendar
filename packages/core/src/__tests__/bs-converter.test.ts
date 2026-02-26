import { describe, it, expect } from 'vitest';
import {
  adToBs,
  bsToAd,
  bsToJsDate,
  jsDateToBs,
  isValidBsDate,
  isValidAdDate,
  isLeapYear,
  getTodayBs,
  getTodayAd,
  compareDates,
  isSameDate,
  isSameMonth,
  addDaysBs,
  addMonthsBs,
  addYearsBs,
} from '../converters/bs-converter';
import { getDaysInBsMonth } from '../data/bs-calendar-data';

describe('BS Converter', () => {
  describe('adToBs', () => {
    it('should convert reference date correctly', () => {
      // Reference: April 14, 1943 AD = Baisakh 1, 2000 BS
      const result = adToBs(new Date(1943, 3, 14)); // April is month 3 (0-indexed)
      expect(result.year).toBe(2000);
      expect(result.month).toBe(1);
      expect(result.day).toBe(1);
      expect(result.calendarType).toBe('BS');
    });

    it('should convert known dates correctly', () => {
      // January 1, 2024 AD = Poush 16, 2080 BS
      const result = adToBs(new Date(2024, 0, 1));
      expect(result.year).toBe(2080);
      expect(result.month).toBe(9); // Poush
      expect(result.day).toBe(16);
    });

    it('should convert April 14, 2024 (BS New Year 2081)', () => {
      const result = adToBs(new Date(2024, 3, 13)); // April 13, 2024
      expect(result.year).toBe(2080);
      expect(result.month).toBe(12); // Chaitra
      expect(result.day).toBe(31);

      const result2 = adToBs(new Date(2024, 3, 14)); // April 14, 2024
      expect(result2.year).toBe(2081);
      expect(result2.month).toBe(1); // Baisakh
      expect(result2.day).toBe(1);
    });

    it('should handle date components object', () => {
      const result = adToBs({ year: 2024, month: 1, day: 1 });
      expect(result.year).toBe(2080);
      expect(result.month).toBe(9);
      expect(result.day).toBe(16);
    });
  });

  describe('bsToAd', () => {
    it('should convert reference date correctly', () => {
      const result = bsToAd({ year: 2000, month: 1, day: 1, calendarType: 'BS' });
      expect(result.year).toBe(1943);
      expect(result.month).toBe(4); // April
      expect(result.day).toBe(14);
      expect(result.calendarType).toBe('AD');
    });

    it('should convert known dates correctly', () => {
      // Poush 16, 2080 BS = January 1, 2024 AD
      const result = bsToAd({ year: 2080, month: 9, day: 16, calendarType: 'BS' });
      expect(result.year).toBe(2024);
      expect(result.month).toBe(1);
      expect(result.day).toBe(1);
    });

    it('should be inverse of adToBs', () => {
      const adDate = new Date(2024, 5, 15); // June 15, 2024
      const bsDate = adToBs(adDate);
      const backToAd = bsToAd(bsDate);

      expect(backToAd.year).toBe(2024);
      expect(backToAd.month).toBe(6); // June
      expect(backToAd.day).toBe(15);
    });
  });

  describe('bsToJsDate', () => {
    it('should convert to JavaScript Date', () => {
      const jsDate = bsToJsDate({ year: 2080, month: 9, day: 16 });
      expect(jsDate.getFullYear()).toBe(2024);
      expect(jsDate.getMonth()).toBe(0); // January (0-indexed)
      expect(jsDate.getDate()).toBe(1);
    });
  });

  describe('jsDateToBs', () => {
    it('should convert JavaScript Date to BS', () => {
      const bsDate = jsDateToBs(new Date(2024, 0, 1));
      expect(bsDate.year).toBe(2080);
      expect(bsDate.month).toBe(9);
      expect(bsDate.day).toBe(16);
    });
  });

  describe('isValidBsDate', () => {
    it('should return true for valid dates', () => {
      expect(isValidBsDate(2080, 1, 1)).toBe(true);
      expect(isValidBsDate(2080, 12, 30)).toBe(true);
    });

    it('should return false for invalid month', () => {
      expect(isValidBsDate(2080, 0, 1)).toBe(false);
      expect(isValidBsDate(2080, 13, 1)).toBe(false);
    });

    it('should return false for invalid day', () => {
      expect(isValidBsDate(2080, 1, 0)).toBe(false);
      expect(isValidBsDate(2080, 1, 35)).toBe(false);
    });

    it('should return false for unsupported years', () => {
      expect(isValidBsDate(1900, 1, 1)).toBe(false);
      expect(isValidBsDate(2200, 1, 1)).toBe(false);
    });

    it('should validate against actual days in month', () => {
      const daysInBaisakh2080 = getDaysInBsMonth(2080, 1);
      expect(isValidBsDate(2080, 1, daysInBaisakh2080)).toBe(true);
      expect(isValidBsDate(2080, 1, daysInBaisakh2080 + 1)).toBe(false);
    });
  });

  describe('isValidAdDate', () => {
    it('should return true for valid dates', () => {
      expect(isValidAdDate(2024, 1, 1)).toBe(true);
      expect(isValidAdDate(2024, 2, 29)).toBe(true); // 2024 is leap year
      expect(isValidAdDate(2024, 12, 31)).toBe(true);
    });

    it('should return false for invalid dates', () => {
      expect(isValidAdDate(2024, 0, 1)).toBe(false);
      expect(isValidAdDate(2024, 13, 1)).toBe(false);
      expect(isValidAdDate(2024, 2, 30)).toBe(false); // No Feb 30
      expect(isValidAdDate(2023, 2, 29)).toBe(false); // 2023 not leap year
    });
  });

  describe('isLeapYear', () => {
    it('should identify leap years correctly', () => {
      expect(isLeapYear(2024)).toBe(true);
      expect(isLeapYear(2000)).toBe(true);
      expect(isLeapYear(2023)).toBe(false);
      expect(isLeapYear(1900)).toBe(false); // Divisible by 100 but not 400
    });
  });

  describe('compareDates', () => {
    it('should return -1 when first date is earlier', () => {
      const a = { year: 2080, month: 1, day: 1 };
      const b = { year: 2080, month: 1, day: 2 };
      expect(compareDates(a, b)).toBe(-1);
    });

    it('should return 1 when first date is later', () => {
      const a = { year: 2080, month: 2, day: 1 };
      const b = { year: 2080, month: 1, day: 15 };
      expect(compareDates(a, b)).toBe(1);
    });

    it('should return 0 when dates are equal', () => {
      const a = { year: 2080, month: 6, day: 15 };
      const b = { year: 2080, month: 6, day: 15 };
      expect(compareDates(a, b)).toBe(0);
    });
  });

  describe('isSameDate', () => {
    it('should return true for same dates', () => {
      const a = { year: 2080, month: 6, day: 15 };
      const b = { year: 2080, month: 6, day: 15 };
      expect(isSameDate(a, b)).toBe(true);
    });

    it('should return false for different dates', () => {
      const a = { year: 2080, month: 6, day: 15 };
      const b = { year: 2080, month: 6, day: 16 };
      expect(isSameDate(a, b)).toBe(false);
    });
  });

  describe('isSameMonth', () => {
    it('should return true for same month', () => {
      const a = { year: 2080, month: 6, day: 1 };
      const b = { year: 2080, month: 6, day: 30 };
      expect(isSameMonth(a, b)).toBe(true);
    });

    it('should return false for different months', () => {
      const a = { year: 2080, month: 6, day: 15 };
      const b = { year: 2080, month: 7, day: 15 };
      expect(isSameMonth(a, b)).toBe(false);
    });
  });

  describe('addDaysBs', () => {
    it('should add days within same month', () => {
      const date = { year: 2080, month: 1, day: 15 };
      const result = addDaysBs(date, 5);
      expect(result.year).toBe(2080);
      expect(result.month).toBe(1);
      expect(result.day).toBe(20);
    });

    it('should handle month overflow', () => {
      const daysInBaisakh = getDaysInBsMonth(2080, 1);
      const date = { year: 2080, month: 1, day: daysInBaisakh };
      const result = addDaysBs(date, 1);
      expect(result.year).toBe(2080);
      expect(result.month).toBe(2); // Jestha
      expect(result.day).toBe(1);
    });

    it('should handle negative days', () => {
      const date = { year: 2080, month: 2, day: 1 };
      const result = addDaysBs(date, -1);
      const daysInBaisakh = getDaysInBsMonth(2080, 1);
      expect(result.year).toBe(2080);
      expect(result.month).toBe(1);
      expect(result.day).toBe(daysInBaisakh);
    });
  });

  describe('addMonthsBs', () => {
    it('should add months within same year', () => {
      const date = { year: 2080, month: 1, day: 15, calendarType: 'BS' as const };
      const result = addMonthsBs(date, 3);
      expect(result.year).toBe(2080);
      expect(result.month).toBe(4);
      expect(result.day).toBe(15);
    });

    it('should handle year overflow', () => {
      const date = { year: 2080, month: 10, day: 15, calendarType: 'BS' as const };
      const result = addMonthsBs(date, 5);
      expect(result.year).toBe(2081);
      expect(result.month).toBe(3);
    });

    it('should clamp day to max days in target month', () => {
      // If source month has 32 days but target has 29
      const date = { year: 2080, month: 3, day: 32, calendarType: 'BS' as const }; // Ashadh has 31 days in 2080
      const result = addMonthsBs(date, 5); // Go to Kartik
      const daysInKartik = getDaysInBsMonth(2080, 8);
      expect(result.day).toBeLessThanOrEqual(daysInKartik);
    });
  });

  describe('addYearsBs', () => {
    it('should add years', () => {
      const date = { year: 2080, month: 6, day: 15, calendarType: 'BS' as const };
      const result = addYearsBs(date, 2);
      expect(result.year).toBe(2082);
      expect(result.month).toBe(6);
      expect(result.day).toBe(15);
    });

    it('should subtract years with negative value', () => {
      const date = { year: 2080, month: 6, day: 15, calendarType: 'BS' as const };
      const result = addYearsBs(date, -5);
      expect(result.year).toBe(2075);
    });
  });

  describe('getTodayBs and getTodayAd', () => {
    it('should return today in respective calendar types', () => {
      const todayBs = getTodayBs();
      const todayAd = getTodayAd();

      expect(todayBs.calendarType).toBe('BS');
      expect(todayAd.calendarType).toBe('AD');

      // Today's AD date should match JavaScript Date
      const jsToday = new Date();
      expect(todayAd.year).toBe(jsToday.getFullYear());
      expect(todayAd.month).toBe(jsToday.getMonth() + 1);
      expect(todayAd.day).toBe(jsToday.getDate());
    });
  });

  describe('Round-trip conversion accuracy', () => {
    it('should maintain accuracy for dates in supported range', () => {
      // Test multiple dates across the year
      const testDates = [
        new Date(2020, 0, 1),
        new Date(2021, 5, 15),
        new Date(2022, 11, 31),
        new Date(2023, 3, 14), // Around BS new year
        new Date(2024, 6, 20),
      ];

      for (const date of testDates) {
        const bs = adToBs(date);
        const ad = bsToAd(bs);
        const backToJs = new Date(ad.year, ad.month - 1, ad.day);

        expect(backToJs.getFullYear()).toBe(date.getFullYear());
        expect(backToJs.getMonth()).toBe(date.getMonth());
        expect(backToJs.getDate()).toBe(date.getDate());
      }
    });
  });
});
