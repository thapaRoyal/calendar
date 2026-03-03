/**
 * SelectionService
 *
 * Angular injectable service for unified date selection (single, range, multiple).
 * Wraps the core selection state machine with RxJS observables.
 *
 * Usage:
 * ```ts
 * @Component({ providers: [SelectionService] })
 * class MyComponent implements OnInit {
 *   constructor(public selection: SelectionService) {}
 *
 *   ngOnInit() {
 *     this.selection.initialize({ mode: 'range' });
 *   }
 * }
 * ```
 */

import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, map, distinctUntilChanged } from 'rxjs';
import {
  selectionReducer,
  createInitialSelectionState,
  getSelectionValue,
  getWeeksInMonth,
  formatMonthYear,
  getWeekdayMinNames,
  formatDay,
  getMonthGrid,
  getYearGrid,
  getDecadeRange,
  enhanceWeekDayWithSelection,
  isDateMultiSelected,
  isDateInSelectionRange,
  isSelectionRangeStart,
  isSelectionRangeEnd,
  isSelectionRangeMiddle,
  type SelectionState,
  type SelectionEvent,
  type SelectionConfig,
  type CalendarDate,
  type DateRangeValue,
  type SelectionMode,
  type Week,
  type Locale,
  type MonthPickerItem,
  type YearPickerItem,
  type DecadeRange,
} from '@thaparoyal/calendar-core';

export interface SelectionServiceOptions {
  mode?: SelectionMode;
  config?: Partial<SelectionConfig>;
  defaultValue?: CalendarDate | CalendarDate[] | DateRangeValue | null;
  disabledDates?: CalendarDate[];
}

export type SelectionValue = CalendarDate | CalendarDate[] | DateRangeValue | null;

@Injectable()
export class SelectionService implements OnDestroy {
  private _state$: BehaviorSubject<SelectionState>;
  private _disabledDates: CalendarDate[] = [];

  constructor() {
    this._state$ = new BehaviorSubject<SelectionState>(
      createInitialSelectionState({ selectionMode: 'single' })
    );
  }

  /**
   * Initialize the service with options.
   * Call this in ngOnInit.
   */
  initialize(options: SelectionServiceOptions = {}): void {
    const { mode = 'single', config, defaultValue, disabledDates = [] } = options;
    this._disabledDates = disabledDates;
    this._state$.next(
      createInitialSelectionState({ ...config, selectionMode: mode }, defaultValue ?? undefined)
    );
  }

  /** Dispatch a selection event to the state machine */
  dispatch(event: SelectionEvent): void {
    this._state$.next(selectionReducer(this._state$.value, event));
  }

  // ─── Actions ────────────────────────────────────────────────────────────────

  /** Select (or toggle for multi-mode) a date */
  select(date: CalendarDate): void {
    this.dispatch({ type: 'SELECT', date });
  }

  /** Toggle a date (for multiple selection mode) */
  toggle(date: CalendarDate): void {
    this.dispatch({ type: 'TOGGLE', date });
  }

  /** Update hover date for range preview */
  hover(date: CalendarDate): void {
    this.dispatch({ type: 'HOVER', date });
  }

  /** Clear all selections */
  clear(): void {
    this.dispatch({ type: 'CLEAR' });
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

  // ─── Observables ────────────────────────────────────────────────────────────

  /** Raw state observable */
  get state$(): Observable<SelectionState> {
    return this._state$.asObservable();
  }

  /** Current selection value */
  get value$(): Observable<SelectionValue> {
    return this._state$.pipe(
      map(s => getSelectionValue(s)),
      distinctUntilChanged()
    );
  }

  /** Current selection mode */
  get selectionMode$(): Observable<SelectionMode> {
    return this._state$.pipe(
      map(s => s.selectionMode),
      distinctUntilChanged()
    );
  }

  /** Whether selection is complete */
  get isComplete$(): Observable<boolean> {
    return this._state$.pipe(
      map(s => {
        switch (s.selectionMode) {
          case 'single': return s.selectedDate !== null;
          case 'range': return s.startDate !== null && s.endDate !== null;
          case 'multiple': return s.selectedDates.length > 0;
          default: return false;
        }
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

  /** Calendar weeks enhanced with selection state (range highlights, multi-select flags) */
  get weeks$(): Observable<Week[]> {
    return this._state$.pipe(
      map(s => {
        const baseWeeks = getWeeksInMonth(
          s.focusedDate.year,
          s.focusedDate.month,
          s.config.calendarType,
          s.config,
          s.selectedDate,
          this._disabledDates
        );
        return baseWeeks.map(week =>
          week.map(day => enhanceWeekDayWithSelection(day, s))
        );
      })
    );
  }

  /** Current locale */
  get locale$(): Observable<Locale> {
    return this._state$.pipe(
      map(s => s.config.locale),
      distinctUntilChanged()
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

  /** Check if a date is selected in multiple mode */
  isMultiSelected(date: CalendarDate): boolean {
    const s = this._state$.value;
    return isDateMultiSelected(date, s.selectedDates);
  }

  /** Check if a date is within the current selection range */
  isInRange(date: CalendarDate): boolean {
    const s = this._state$.value;
    return isDateInSelectionRange(date, s.startDate, s.endDate, s.hoveredDate, s.selectingEnd);
  }

  /** Check if a date is the range start */
  isRangeStart(date: CalendarDate): boolean {
    const s = this._state$.value;
    return isSelectionRangeStart(date, s.startDate, s.endDate, s.hoveredDate, s.selectingEnd);
  }

  /** Check if a date is the range end */
  isRangeEnd(date: CalendarDate): boolean {
    const s = this._state$.value;
    return isSelectionRangeEnd(date, s.startDate, s.endDate, s.hoveredDate, s.selectingEnd);
  }

  /** Check if a date is in the middle of the range */
  isRangeMiddle(date: CalendarDate): boolean {
    const s = this._state$.value;
    return isSelectionRangeMiddle(date, s.startDate, s.endDate, s.hoveredDate, s.selectingEnd);
  }

  /** Set disabled dates */
  setDisabledDates(dates: CalendarDate[]): void {
    this._disabledDates = dates;
    this._state$.next({ ...this._state$.value });
  }

  ngOnDestroy(): void {
    this._state$.complete();
  }
}
