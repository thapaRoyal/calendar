/**
 * @thaparoyal/calendar-angular
 *
 * Angular services for AD and BS (Bikram Sambat) calendars.
 * Uses the core package for all date logic and state management.
 *
 * Each service uses Angular's DI and RxJS BehaviorSubject for reactive state.
 * Provide services at the component level for isolated instances, or at
 * module/root level for shared state.
 *
 * @example
 * ```ts
 * // Single-date calendar
 * import { CalendarService } from '@thaparoyal/calendar-angular';
 *
 * @Component({
 *   providers: [CalendarService],
 *   template: `
 *     <h3>{{ cal.title$ | async }}</h3>
 *     <button (click)="cal.prevMonth()">‹</button>
 *     <button (click)="cal.nextMonth()">›</button>
 *   `,
 * })
 * class CalendarComponent implements OnInit {
 *   constructor(public cal: CalendarService) {}
 *   ngOnInit() {
 *     this.cal.initialize({ config: { calendarType: 'BS', locale: 'ne' } });
 *   }
 * }
 *
 * // Date picker with typed input
 * import { DatePickerService } from '@thaparoyal/calendar-angular';
 *
 * @Component({
 *   providers: [DatePickerService],
 *   template: `
 *     <input
 *       [value]="picker.inputValue$ | async"
 *       (input)="picker.onInputChange($any($event.target).value)"
 *       (blur)="picker.onInputBlur()"
 *     />
 *     <div *ngIf="picker.isOpen$ | async"><!-- calendar --></div>
 *   `,
 * })
 * class DatePickerComponent implements OnInit {
 *   constructor(public picker: DatePickerService) {}
 *   ngOnInit() {
 *     this.picker.initialize({ config: { calendarType: 'BS' } });
 *   }
 * }
 *
 * // Range selection with two months
 * import { MultiCalendarService } from '@thaparoyal/calendar-angular';
 *
 * @Component({
 *   providers: [MultiCalendarService],
 *   template: `
 *     <div *ngFor="let month of calendar.months$ | async">
 *       <h3>{{ month.title }}</h3>
 *     </div>
 *   `,
 * })
 * class RangePickerComponent implements OnInit {
 *   constructor(public calendar: MultiCalendarService) {}
 *   ngOnInit() {
 *     this.calendar.initialize({ numberOfMonths: 2, mode: 'range' });
 *   }
 * }
 * ```
 */

// Services
export { CalendarService } from './services/calendar.service';
export type { CalendarServiceOptions } from './services/calendar.service';

export { SelectionService } from './services/selection.service';
export type {
  SelectionServiceOptions,
  SelectionValue,
} from './services/selection.service';

export { DatePickerService } from './services/date-picker.service';
export type { DatePickerServiceOptions } from './services/date-picker.service';

export { MultiCalendarService } from './services/multi-calendar.service';
export type {
  MultiCalendarServiceOptions,
  MultiCalendarMonth,
  MultiSelectionValue,
} from './services/multi-calendar.service';

// Re-export core types used in service APIs
export type {
  CalendarType,
  CalendarDate,
  CalendarConfig,
  CalendarState,
  DatePickerState,
  SelectionMode,
  DateRangeValue,
  WeekDay,
  Week,
  Locale,
  MonthPickerItem,
  YearPickerItem,
  DecadeRange,
  NepaliHoliday,
  FormatRelativeOptions,
} from '@thaparoyal/calendar-core';

// Re-export commonly used core utilities
export {
  adToBs,
  bsToAd,
  formatDate,
  parseDate,
  formatDateInput,
  formatRelative,
  getTodayBs,
  getTodayAd,
  isValidBsDate,
  isValidAdDate,
  compareDates,
  isSameDate,
  isSameMonth,
} from '@thaparoyal/calendar-core';

// Re-export calendar data constants
export {
  BS_MONTHS_EN,
  BS_MONTHS_NP,
  BS_MONTHS_SHORT_EN,
  BS_MONTHS_SHORT_NP,
  WEEKDAYS_EN,
  WEEKDAYS_NP,
  WEEKDAYS_SHORT_EN,
  WEEKDAYS_SHORT_NP,
  WEEKDAYS_MIN_EN,
  WEEKDAYS_MIN_NP,
  NEPALI_DIGITS,
  toNepaliNumeral,
  fromNepaliNumeral,
  getMonthName,
  getMonthShortName,
  getMonthNames,
  getWeekdayName,
  getWeekdayShortName,
  getWeekdayNames,
  getWeekdayShortNames,
  getWeekdayMinName,
  getWeekdayMinNames,
} from '@thaparoyal/calendar-core';

// Re-export holiday utilities
export {
  FIXED_HOLIDAYS,
  VARIABLE_HOLIDAYS,
  getHolidaysForYear,
  isHoliday,
  getHolidayInfo,
  getHolidayName,
  getHolidaysInMonth,
  fetchHolidays,
  setHolidayCache,
  clearHolidayCache,
} from '@thaparoyal/calendar-core';
