/**
 * DatePickerService
 *
 * Angular injectable service for date picker state (calendar + text input + popup).
 * Wraps the core date picker state machine with RxJS observables.
 *
 * Usage:
 * ```ts
 * @Component({ providers: [DatePickerService] })
 * class MyDatePickerComponent implements OnInit {
 *   constructor(public picker: DatePickerService) {}
 *
 *   ngOnInit() {
 *     this.picker.initialize({ config: { calendarType: 'BS', locale: 'ne' } });
 *   }
 * }
 * ```
 *
 * Template example:
 * ```html
 * <input
 *   [value]="picker.inputValue$ | async"
 *   (input)="picker.onInputChange($event.target.value)"
 *   (blur)="picker.onInputBlur()"
 * />
 * <div *ngIf="picker.isOpen$ | async">
 *   <!-- calendar UI here -->
 * </div>
 * ```
 */

import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, map, distinctUntilChanged } from 'rxjs';
import {
  datePickerReducer,
  createInitialDatePickerState,
  getWeeksInMonth,
  formatMonthYear,
  getWeekdayMinNames,
  formatDay,
  formatDate,
  getMonthGrid,
  getYearGrid,
  getDecadeRange,
  type DatePickerState,
  type DatePickerEvent,
  type CalendarConfig,
  type CalendarDate,
  type Week,
  type Locale,
  type MonthPickerItem,
  type YearPickerItem,
  type DecadeRange,
} from '@thaparoyal/calendar-core';

export interface DatePickerServiceOptions {
  config?: Partial<CalendarConfig>;
  defaultValue?: CalendarDate;
  format?: string;
  disabled?: boolean;
  disabledDates?: CalendarDate[];
}

@Injectable()
export class DatePickerService implements OnDestroy {
  private _state$: BehaviorSubject<DatePickerState>;
  private _disabledDates: CalendarDate[] = [];
  private _disabled = false;
  private _format = 'YYYY-MM-DD';

  constructor() {
    this._state$ = new BehaviorSubject<DatePickerState>(createInitialDatePickerState());
  }

  /**
   * Initialize the service with options.
   * Call this in ngOnInit.
   */
  initialize(options: DatePickerServiceOptions = {}): void {
    const {
      config,
      defaultValue,
      format = 'YYYY-MM-DD',
      disabled = false,
      disabledDates = [],
    } = options;
    this._format = format;
    this._disabled = disabled;
    this._disabledDates = disabledDates;
    this._state$.next(createInitialDatePickerState(config, defaultValue));
  }

  /** Dispatch a date picker event to the state machine */
  dispatch(event: DatePickerEvent): void {
    if (this._disabled) return;
    this._state$.next(datePickerReducer(this._state$.value, event));
  }

  // ─── Actions ────────────────────────────────────────────────────────────────

  /** Open the calendar popup */
  open(): void {
    this.dispatch({ type: 'OPEN' });
  }

  /** Close the calendar popup */
  close(): void {
    this.dispatch({ type: 'CLOSE' });
  }

  /** Toggle the calendar popup */
  toggle(): void {
    this.dispatch({ type: 'TOGGLE' });
  }

  /** Handle text input change — applies live date masking */
  onInputChange(value: string): void {
    this.dispatch({ type: 'INPUT_CHANGE', value });
  }

  /** Handle input blur — validates and reformats the input */
  onInputBlur(): void {
    this.dispatch({ type: 'INPUT_BLUR' });
  }

  /** Clear the selected date and input */
  clear(): void {
    this.dispatch({ type: 'CLEAR' });
  }

  /** Select a date from the calendar (also closes the popup) */
  selectDate(date: CalendarDate): void {
    this.dispatch({ type: 'SELECT_DATE', date });
  }

  /** Focus a date in the calendar (for keyboard nav) */
  focusDate(date: CalendarDate): void {
    this.dispatch({ type: 'FOCUS_DATE', date });
  }

  /** Navigate to next month */
  nextMonth(): void {
    this.dispatch({ type: 'NEXT_MONTH' });
  }

  /** Navigate to previous month */
  prevMonth(): void {
    this.dispatch({ type: 'PREV_MONTH' });
  }

  /** Navigate to next year */
  nextYear(): void {
    this.dispatch({ type: 'NEXT_YEAR' });
  }

  /** Navigate to previous year */
  prevYear(): void {
    this.dispatch({ type: 'PREV_YEAR' });
  }

  /** Set the calendar view mode */
  setViewMode(mode: 'day' | 'month' | 'year'): void {
    this.dispatch({ type: 'SET_VIEW_MODE', mode });
  }

  /** Go to today */
  goToToday(): void {
    this.dispatch({ type: 'TODAY' });
  }

  /** Programmatically set the selected date (e.g. from reactive forms) */
  setValue(date: CalendarDate | null): void {
    if (date) {
      this._state$.next({
        ...this._state$.value,
        selectedDate: date,
        focusedDate: date,
        inputValue: formatDate(date, this._format, this._state$.value.config.locale),
      });
    } else {
      this._state$.next({
        ...this._state$.value,
        selectedDate: null,
        inputValue: '',
      });
    }
  }

  // ─── Observables ────────────────────────────────────────────────────────────

  /** Raw state observable */
  get state$(): Observable<DatePickerState> {
    return this._state$.asObservable();
  }

  /** Whether the calendar popup is open */
  get isOpen$(): Observable<boolean> {
    return this._state$.pipe(
      map(s => s.isOpen),
      distinctUntilChanged()
    );
  }

  /** Current text input value */
  get inputValue$(): Observable<string> {
    return this._state$.pipe(
      map(s => s.inputValue),
      distinctUntilChanged()
    );
  }

  /** Currently selected date */
  get selectedDate$(): Observable<CalendarDate | null> {
    return this._state$.pipe(
      map(s => s.selectedDate),
      distinctUntilChanged()
    );
  }

  /** Formatted value using the configured format string */
  get formattedValue$(): Observable<string> {
    return this._state$.pipe(
      map(s => {
        if (!s.selectedDate) return '';
        return formatDate(s.selectedDate, this._format, s.config.locale);
      }),
      distinctUntilChanged()
    );
  }

  /** Month/year title string */
  get title$(): Observable<string> {
    return this._state$.pipe(
      map(s =>
        formatMonthYear(
          s.focusedDate.year,
          s.focusedDate.month,
          s.config.calendarType,
          s.config.locale
        )
      ),
      distinctUntilChanged()
    );
  }

  /** Weekday header names */
  get weekdayNames$(): Observable<string[]> {
    return this._state$.pipe(
      map(s => [...getWeekdayMinNames(s.config.locale)]),
      distinctUntilChanged()
    );
  }

  /** Calendar weeks grid for the currently focused month */
  get weeks$(): Observable<Week[]> {
    return this._state$.pipe(
      map(s =>
        getWeeksInMonth(
          s.focusedDate.year,
          s.focusedDate.month,
          s.config.calendarType,
          s.config,
          s.selectedDate,
          this._disabledDates
        )
      )
    );
  }

  /** Month picker items */
  get monthPickerItems$(): Observable<MonthPickerItem[]> {
    return this._state$.pipe(
      map(s =>
        getMonthGrid(
          s.focusedDate.year,
          s.config.calendarType,
          s.config.locale,
          s.focusedDate.month,
          s.config.minDate,
          s.config.maxDate
        )
      )
    );
  }

  /** Year picker items */
  get yearPickerItems$(): Observable<YearPickerItem[]> {
    return this._state$.pipe(
      map(s =>
        getYearGrid(
          s.focusedDate.year,
          s.config.calendarType,
          12,
          s.config.minDate,
          s.config.maxDate
        )
      )
    );
  }

  /** Decade range for year picker */
  get decadeRange$(): Observable<DecadeRange> {
    return this._state$.pipe(
      map(s => getDecadeRange(s.focusedDate.year)),
      distinctUntilChanged()
    );
  }

  /** Current locale */
  get locale$(): Observable<Locale> {
    return this._state$.pipe(
      map(s => s.config.locale),
      distinctUntilChanged()
    );
  }

  /** Whether navigating to previous month is disabled */
  get isPrevMonthDisabled$(): Observable<boolean> {
    return this._state$.pipe(
      map(s => {
        if (!s.config.minDate) return false;
        const { year, month } = s.focusedDate;
        return (
          year < s.config.minDate.year ||
          (year === s.config.minDate.year && month <= s.config.minDate.month)
        );
      }),
      distinctUntilChanged()
    );
  }

  /** Whether navigating to next month is disabled */
  get isNextMonthDisabled$(): Observable<boolean> {
    return this._state$.pipe(
      map(s => {
        if (!s.config.maxDate) return false;
        const { year, month } = s.focusedDate;
        return (
          year > s.config.maxDate.year ||
          (year === s.config.maxDate.year && month >= s.config.maxDate.month)
        );
      }),
      distinctUntilChanged()
    );
  }

  /** Format a day number with the current locale */
  formatDayNumber(day: number): string {
    return formatDay(day, this._state$.value.config.locale);
  }

  /** Set disabled dates */
  setDisabledDates(dates: CalendarDate[]): void {
    this._disabledDates = dates;
    this._state$.next({ ...this._state$.value });
  }

  /** Enable or disable the picker */
  setDisabled(disabled: boolean): void {
    this._disabled = disabled;
  }

  ngOnDestroy(): void {
    this._state$.complete();
  }
}
