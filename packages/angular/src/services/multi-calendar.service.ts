/**
 * MultiCalendarService
 *
 * Angular injectable service for side-by-side multi-month calendars with unified selection.
 * Combines the selection state machine with multi-month navigation utilities.
 *
 * Usage:
 * ```ts
 * @Component({ providers: [MultiCalendarService] })
 * class DateRangePickerComponent implements OnInit {
 *   constructor(public calendar: MultiCalendarService) {}
 *
 *   ngOnInit() {
 *     this.calendar.initialize({
 *       numberOfMonths: 2,
 *       mode: 'range',
 *       config: { calendarType: 'BS', locale: 'ne' },
 *     });
 *   }
 * }
 * ```
 *
 * Template:
 * ```html
 * <div *ngFor="let month of calendar.months$ | async">
 *   <h3>{{ month.title }}</h3>
 *   <!-- render month.weeks -->
 * </div>
 * ```
 */

import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, map, distinctUntilChanged } from 'rxjs';
import {
  selectionReducer,
  createInitialSelectionState,
  getSelectionValue,
  getMultiMonthWeeks,
  getMultiMonthTitles,
  canNavigatePrev,
  canNavigateNext,
  navigateMultiCalendar,
  getWeekdayMinNames,
  formatDay,
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
  type MultiCalendarConfig,
  type Week,
  type Locale,
} from '@thaparoyal/calendar-core';

export interface MultiCalendarServiceOptions {
  numberOfMonths?: number;
  mode?: SelectionMode;
  config?: Partial<SelectionConfig>;
  pagedNavigation?: boolean;
  defaultValue?: CalendarDate | CalendarDate[] | DateRangeValue | null;
  disabledDates?: CalendarDate[];
}

/** Represents a single month's data in the multi-calendar display */
export interface MultiCalendarMonth {
  year: number;
  month: number;
  title: string;
  weeks: Week[];
}

export type MultiSelectionValue = CalendarDate | CalendarDate[] | DateRangeValue | null;

@Injectable()
export class MultiCalendarService implements OnDestroy {
  private _state$: BehaviorSubject<SelectionState>;
  private _disabledDates: CalendarDate[] = [];
  private _numberOfMonths = 2;
  private _pagedNavigation = false;

  constructor() {
    this._state$ = new BehaviorSubject<SelectionState>(
      createInitialSelectionState({ selectionMode: 'single' })
    );
  }

  /**
   * Initialize the service with options.
   * Call this in ngOnInit.
   */
  initialize(options: MultiCalendarServiceOptions = {}): void {
    const {
      numberOfMonths = 2,
      mode = 'single',
      config,
      pagedNavigation = false,
      defaultValue,
      disabledDates = [],
    } = options;
    this._numberOfMonths = numberOfMonths;
    this._pagedNavigation = pagedNavigation;
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

  /** Select (or toggle) a date */
  select(date: CalendarDate): void {
    this.dispatch({ type: 'SELECT', date });
  }

  /** Toggle a date (multiple selection mode) */
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

  /**
   * Navigate to next month(s).
   * With pagedNavigation: advances by numberOfMonths.
   * Without: advances by 1.
   */
  nextMonth(): void {
    const newFocused = navigateMultiCalendar(
      this._state$.value.focusedDate,
      'next',
      this._numberOfMonths,
      this._pagedNavigation
    );
    this._state$.next({ ...this._state$.value, focusedDate: newFocused });
  }

  /**
   * Navigate to previous month(s).
   * With pagedNavigation: goes back by numberOfMonths.
   * Without: goes back by 1.
   */
  prevMonth(): void {
    const newFocused = navigateMultiCalendar(
      this._state$.value.focusedDate,
      'prev',
      this._numberOfMonths,
      this._pagedNavigation
    );
    this._state$.next({ ...this._state$.value, focusedDate: newFocused });
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
  get value$(): Observable<MultiSelectionValue> {
    return this._state$.pipe(
      map(s => getSelectionValue(s)),
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

  /**
   * Array of month data objects — one per visible month.
   * Each contains: year, month, title, weeks (enhanced with selection state).
   */
  get months$(): Observable<MultiCalendarMonth[]> {
    return this._state$.pipe(
      map(s => {
        const multiWeeks = getMultiMonthWeeks(
          s.focusedDate,
          this._numberOfMonths,
          s.config,
          s,
          this._disabledDates
        );

        const titles = getMultiMonthTitles(
          s.focusedDate,
          this._numberOfMonths,
          s.config.calendarType,
          s.config.locale
        );

        return titles.map((titleInfo, index) => ({
          year: titleInfo.year,
          month: titleInfo.month,
          title: titleInfo.title,
          weeks: multiWeeks[index] ?? [],
        }));
      })
    );
  }

  /** Weekday header names (same for all months) */
  get weekdayNames$(): Observable<string[]> {
    return this._state$.pipe(
      map(s => [...getWeekdayMinNames(s.config.locale)]),
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
  get isPrevDisabled$(): Observable<boolean> {
    return this._state$.pipe(
      map(s => {
        const multiConfig: MultiCalendarConfig = {
          ...s.config,
          numberOfMonths: this._numberOfMonths,
          pagedNavigation: this._pagedNavigation,
        };
        return !canNavigatePrev(s.focusedDate, multiConfig);
      }),
      distinctUntilChanged()
    );
  }

  /** Whether navigating to next month is disabled */
  get isNextDisabled$(): Observable<boolean> {
    return this._state$.pipe(
      map(s => {
        const multiConfig: MultiCalendarConfig = {
          ...s.config,
          numberOfMonths: this._numberOfMonths,
          pagedNavigation: this._pagedNavigation,
        };
        return !canNavigateNext(s.focusedDate, this._numberOfMonths, multiConfig);
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
