/**
 * Supported calendar types
 */
export type CalendarType = 'AD' | 'BS';

/**
 * Represents a date in any calendar system
 */
export interface CalendarDate {
  year: number;
  month: number; // 1-12
  day: number; // 1-32 (BS can have up to 32 days)
  calendarType: CalendarType;
}

/**
 * Represents a date without calendar type (for internal use)
 */
export interface DateComponents {
  year: number;
  month: number;
  day: number;
}

/**
 * Date range for calendar views
 */
export interface DateRange {
  start: CalendarDate;
  end: CalendarDate;
}

/**
 * Week day representation
 */
export interface WeekDay {
  date: CalendarDate;
  isToday: boolean;
  isSelected: boolean;
  isDisabled: boolean;
  isOutsideMonth: boolean;
  dayOfWeek: number; // 0 = Sunday, 6 = Saturday
}

/**
 * Week representation for calendar grid
 */
export type Week = WeekDay[];

/**
 * Locale options for formatting
 */
export type Locale = 'en' | 'ne';

/**
 * Month information
 */
export interface MonthInfo {
  index: number; // 0-11
  number: number; // 1-12
  name: string;
  shortName: string;
  daysInMonth: number;
}

/**
 * Format options for date strings
 */
export interface FormatOptions {
  locale?: Locale;
  format?: string;
}

/**
 * Calendar configuration options
 */
export interface CalendarConfig {
  calendarType: CalendarType;
  locale: Locale;
  weekStartsOn: 0 | 1; // 0 = Sunday, 1 = Monday
  minDate?: CalendarDate;
  maxDate?: CalendarDate;
}

/**
 * State for calendar machine
 */
export interface CalendarState {
  focusedDate: CalendarDate;
  selectedDate: CalendarDate | null;
  viewMode: 'day' | 'month' | 'year';
  config: CalendarConfig;
}

/**
 * Events for calendar machine
 */
export type CalendarEvent =
  | { type: 'SELECT_DATE'; date: CalendarDate }
  | { type: 'FOCUS_DATE'; date: CalendarDate }
  | { type: 'NEXT_MONTH' }
  | { type: 'PREV_MONTH' }
  | { type: 'NEXT_YEAR' }
  | { type: 'PREV_YEAR' }
  | { type: 'SET_VIEW_MODE'; mode: 'day' | 'month' | 'year' }
  | { type: 'SET_CALENDAR_TYPE'; calendarType: CalendarType }
  | { type: 'TODAY' };

/**
 * Date picker state
 */
export interface DatePickerState extends CalendarState {
  isOpen: boolean;
  inputValue: string;
}

/**
 * Date picker events
 */
export type DatePickerEvent =
  | CalendarEvent
  | { type: 'OPEN' }
  | { type: 'CLOSE' }
  | { type: 'TOGGLE' }
  | { type: 'INPUT_CHANGE'; value: string }
  | { type: 'INPUT_BLUR' }
  | { type: 'CLEAR' };

/**
 * Date range picker state
 */
export interface DateRangeState extends CalendarState {
  startDate: CalendarDate | null;
  endDate: CalendarDate | null;
  selectingEnd: boolean;
}

/**
 * Date range events
 */
export type DateRangeEvent =
  | Exclude<CalendarEvent, { type: 'SELECT_DATE' }>
  | { type: 'SELECT_START'; date: CalendarDate }
  | { type: 'SELECT_END'; date: CalendarDate }
  | { type: 'HOVER_DATE'; date: CalendarDate }
  | { type: 'CLEAR' };
