/**
 * CalendarService
 *
 * Angular injectable service wrapping the core calendar state machine.
 * Provides reactive observables for calendar state and navigation actions.
 *
 * Usage:
 * ```ts
 * // Provide at component level for isolated state:
 * @Component({ providers: [CalendarService] })
 *
 * // Or provide at module/root level for shared state:
 * @NgModule({ providers: [CalendarService] })
 * ```
 */

import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, map, distinctUntilChanged } from 'rxjs';
import {
  calendarReducer,
  createInitialState,
  getWeeksInMonth,
  formatMonthYear,
  getWeekdayMinNames,
  formatDay,
  getMonthGrid,
  getYearGrid,
  getDecadeRange,
  type CalendarState,
  type CalendarEvent,
  type CalendarConfig,
  type CalendarDate,
  type Week,
  type Locale,
  type MonthPickerItem,
  type YearPickerItem,
  type DecadeRange,
} from '@thaparoyal/calendar-core';

export interface CalendarServiceOptions {
  config?: Partial<CalendarConfig>;
  defaultValue?: CalendarDate;
  disabledDates?: CalendarDate[];
}

@Injectable()
export class CalendarService implements OnDestroy {
  private _state$: BehaviorSubject<CalendarState>;
  private _disabledDates: CalendarDate[] = [];

  constructor() {
    this._state$ = new BehaviorSubject<CalendarState>(createInitialState());
  }

  /**
   * Initialize the service with options.
   * Call this in ngOnInit after injecting with optional configuration.
   */
  initialize(options: CalendarServiceOptions = {}): void {
    const { config, defaultValue, disabledDates = [] } = options;
    this._disabledDates = disabledDates;
    this._state$.next(createInitialState(config, defaultValue));
  }

  /** Dispatch a calendar event to the state machine */
  dispatch(event: CalendarEvent): void {
    this._state$.next(calendarReducer(this._state$.value, event));
  }

  // ─── Actions ────────────────────────────────────────────────────────────────

  selectDate(date: CalendarDate): void {
    this.dispatch({ type: 'SELECT_DATE', date });
  }

  focusDate(date: CalendarDate): void {
    this.dispatch({ type: 'FOCUS_DATE', date });
  }

  nextMonth(): void {
    this.dispatch({ type: 'NEXT_MONTH' });
  }

  prevMonth(): void {
    this.dispatch({ type: 'PREV_MONTH' });
  }

  nextYear(): void {
    this.dispatch({ type: 'NEXT_YEAR' });
  }

  prevYear(): void {
    this.dispatch({ type: 'PREV_YEAR' });
  }

  setViewMode(mode: 'day' | 'month' | 'year'): void {
    this.dispatch({ type: 'SET_VIEW_MODE', mode });
  }

  goToToday(): void {
    this.dispatch({ type: 'TODAY' });
  }

  // ─── Observables ────────────────────────────────────────────────────────────

  /** Raw state observable */
  get state$(): Observable<CalendarState> {
    return this._state$.asObservable();
  }

  /** Currently selected date */
  get selectedDate$(): Observable<CalendarDate | null> {
    return this._state$.pipe(
      map(s => s.selectedDate),
      distinctUntilChanged()
    );
  }

  /** Currently focused date (drives navigation) */
  get focusedDate$(): Observable<CalendarDate> {
    return this._state$.pipe(
      map(s => s.focusedDate),
      distinctUntilChanged()
    );
  }

  /** Current view mode: day | month | year */
  get viewMode$(): Observable<'day' | 'month' | 'year'> {
    return this._state$.pipe(
      map(s => s.viewMode),
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

  /** Month/year title string, e.g. "Baisakh 2082" or "April 2025" */
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

  /** Weekday header names (min, e.g. "Su", "Mo" or "आइ", "सोम") */
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

  /** Month picker items for the month picker view */
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

  /** Year picker items for the year picker view */
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

  /** Decade range for year picker navigation (e.g. { start: 2080, end: 2091 }) */
  get decadeRange$(): Observable<DecadeRange> {
    return this._state$.pipe(
      map(s => getDecadeRange(s.focusedDate.year)),
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

  /** Set disabled dates (triggers weeks$ re-emission on next state change) */
  setDisabledDates(dates: CalendarDate[]): void {
    this._disabledDates = dates;
    // Re-emit current state to propagate new disabled dates to weeks$
    this._state$.next({ ...this._state$.value });
  }

  ngOnDestroy(): void {
    this._state$.complete();
  }
}
