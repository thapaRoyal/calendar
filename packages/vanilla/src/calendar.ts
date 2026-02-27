/**
 * Vanilla JS Calendar Component
 *
 * Renders an interactive calendar using the core package's state machines
 * and utility functions. Uses the same CSS class names as the React package
 * so that themes.css from core works identically.
 */

import {
  selectionReducer,
  createInitialSelectionState,
  getSelectionValue,
  getWeeksInMonth,
  formatMonthYear,
  getWeekdayMinNames,
  formatDay,
  formatYear,
  getMonthGrid,
  getYearGrid,
  getDecadeRange,
  getNextDecade,
  getPrevDecade,
  enhanceWeekDayWithSelection,
  type SelectionState,
  type SelectionEvent,
  type SelectionConfig,
  type SelectionMode,
  type CalendarDate,
  type DateRangeValue,
  type CalendarConfig,
  type WeekDay,
} from '@thaparoyal/calendar-core';

import { createElement } from './renderer';

// ---------------------------------------------------------------------------
// Public Types
// ---------------------------------------------------------------------------

export interface CalendarOptions {
  /** Target element or CSS selector where the calendar will be rendered. */
  element: HTMLElement | string;
  /** Core calendar configuration (calendarType, locale, weekStartsOn, etc.). */
  config?: Partial<CalendarConfig>;
  /** Theme name – sets `data-theme` attribute on the root element. */
  theme?: string;
  /** Selection mode: 'single' (default), 'range', or 'multiple'. */
  selectionMode?: SelectionMode;
  /** Initial selected value. Shape depends on selectionMode. */
  value?: CalendarDate | CalendarDate[] | DateRangeValue | null;
  /** Callback fired whenever the selection value changes. */
  onValueChange?: (value: CalendarDate | CalendarDate[] | DateRangeValue | null) => void;
  /** Array of dates that should be rendered as disabled / non-selectable. */
  disabledDates?: CalendarDate[];
}

// ---------------------------------------------------------------------------
// Calendar Class
// ---------------------------------------------------------------------------

export class Calendar {
  private el: HTMLElement;
  private state: SelectionState;
  private options: CalendarOptions;

  constructor(options: CalendarOptions) {
    const target =
      typeof options.element === 'string'
        ? document.querySelector<HTMLElement>(options.element)
        : options.element;

    if (!target) {
      throw new Error(
        `[Calendar] Could not find element: ${
          typeof options.element === 'string' ? options.element : 'provided element'
        }`
      );
    }

    this.el = target;
    this.options = options;

    const mode = options.selectionMode || 'single';
    const config: Partial<SelectionConfig> = {
      selectionMode: mode,
      ...(options.config || {}),
    };
    this.state = createInitialSelectionState(config, options.value ?? undefined);

    if (options.theme) {
      this.el.setAttribute('data-theme', options.theme);
    }

    this.render();
  }

  // -----------------------------------------------------------------------
  // Internal helpers
  // -----------------------------------------------------------------------

  private dispatch(event: SelectionEvent): void {
    this.state = selectionReducer(this.state, event);
    this.render();
    if (this.options.onValueChange) {
      this.options.onValueChange(getSelectionValue(this.state));
    }
  }

  /**
   * Cycle the viewMode when the user clicks the title button.
   *   day -> month -> year -> day
   */
  private cycleViewMode(): void {
    const next =
      this.state.viewMode === 'day'
        ? 'month'
        : this.state.viewMode === 'month'
          ? 'year'
          : 'day';
    this.dispatch({ type: 'SET_VIEW_MODE', mode: next });
  }

  // -----------------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------------

  private render(): void {
    this.el.innerHTML = '';

    const root = createElement('div', 'trc-calendar');

    // -- Header -----------------------------------------------------------
    const header = createElement('div', 'trc-calendar-header');

    const prevBtn = createElement('button', 'trc-calendar-nav-button');
    prevBtn.type = 'button';
    prevBtn.innerHTML = '&#8249;'; // ‹
    prevBtn.setAttribute('aria-label', 'Previous');
    prevBtn.onclick = () => this.handlePrev();

    const titleBtn = createElement('button', 'trc-calendar-title');
    titleBtn.type = 'button';
    titleBtn.textContent = this.getTitleText();
    titleBtn.onclick = () => this.cycleViewMode();

    const nextBtn = createElement('button', 'trc-calendar-nav-button');
    nextBtn.type = 'button';
    nextBtn.innerHTML = '&#8250;'; // ›
    nextBtn.setAttribute('aria-label', 'Next');
    nextBtn.onclick = () => this.handleNext();

    header.append(prevBtn, titleBtn, nextBtn);
    root.appendChild(header);

    // -- Body -------------------------------------------------------------
    switch (this.state.viewMode) {
      case 'day':
        root.appendChild(this.renderDayGrid());
        break;
      case 'month':
        root.appendChild(this.renderMonthPicker());
        break;
      case 'year':
        root.appendChild(this.renderYearPicker());
        break;
    }

    this.el.appendChild(root);
  }

  // -----------------------------------------------------------------------
  // Title text
  // -----------------------------------------------------------------------

  private getTitleText(): string {
    const { focusedDate, config, viewMode } = this.state;

    if (viewMode === 'day') {
      return formatMonthYear(
        focusedDate.year,
        focusedDate.month,
        config.calendarType,
        config.locale
      );
    }

    if (viewMode === 'month') {
      return formatYear(focusedDate.year, config.locale);
    }

    // year view – show decade range
    const decade = getDecadeRange(focusedDate.year);
    const startStr = formatYear(decade.start, config.locale);
    const endStr = formatYear(decade.end, config.locale);
    return `${startStr} - ${endStr}`;
  }

  // -----------------------------------------------------------------------
  // Navigation handlers (prev / next depend on viewMode)
  // -----------------------------------------------------------------------

  private handlePrev(): void {
    switch (this.state.viewMode) {
      case 'day':
        this.dispatch({ type: 'PREV_MONTH' });
        break;
      case 'month':
        this.dispatch({ type: 'PREV_YEAR' });
        break;
      case 'year': {
        const prevDecadeYear = getPrevDecade(this.state.focusedDate.year);
        this.dispatch({
          type: 'FOCUS_DATE',
          date: { ...this.state.focusedDate, year: prevDecadeYear },
        });
        break;
      }
    }
  }

  private handleNext(): void {
    switch (this.state.viewMode) {
      case 'day':
        this.dispatch({ type: 'NEXT_MONTH' });
        break;
      case 'month':
        this.dispatch({ type: 'NEXT_YEAR' });
        break;
      case 'year': {
        const nextDecadeYear = getNextDecade(this.state.focusedDate.year);
        this.dispatch({
          type: 'FOCUS_DATE',
          date: { ...this.state.focusedDate, year: nextDecadeYear },
        });
        break;
      }
    }
  }

  // -----------------------------------------------------------------------
  // Day grid
  // -----------------------------------------------------------------------

  private renderDayGrid(): HTMLTableElement {
    const { focusedDate, config } = this.state;

    // Build weeks enhanced with selection information
    const weeks = getWeeksInMonth(
      focusedDate.year,
      focusedDate.month,
      config.calendarType,
      config,
      this.state.selectedDate,
      this.options.disabledDates
    ).map((week) => week.map((day) => enhanceWeekDayWithSelection(day, this.state)));

    const weekdayNames = getWeekdayMinNames(config.locale);

    const table = createElement('table', 'trc-calendar-grid');
    table.setAttribute('role', 'grid');

    // -- Thead (weekday names) --
    const thead = createElement('thead');
    const headRow = createElement('tr');
    const startIdx = config.weekStartsOn;
    for (let i = 0; i < 7; i++) {
      const idx = (startIdx + i) % 7;
      const th = createElement('th', 'trc-calendar-weekday', weekdayNames[idx]);
      th.setAttribute('scope', 'col');
      headRow.appendChild(th);
    }
    thead.appendChild(headRow);
    table.appendChild(thead);

    // -- Tbody (day cells) --
    const tbody = createElement('tbody');
    for (const week of weeks) {
      const tr = createElement('tr');
      for (const day of week) {
        const td = this.renderDayCell(day);
        tr.appendChild(td);
      }
      tbody.appendChild(tr);
    }
    table.appendChild(tbody);

    return table;
  }

  private renderDayCell(day: WeekDay): HTMLTableCellElement {
    const { config } = this.state;
    const td = createElement('td');

    const classes = ['trc-calendar-cell'];

    if (day.isToday) classes.push('trc-calendar-cell-today');
    if (day.isSelected) classes.push('trc-calendar-cell-selected');
    if (day.isDisabled) classes.push('trc-calendar-cell-disabled');
    if (day.isOutsideMonth) classes.push('trc-calendar-cell-outside');

    // Range mode classes
    if (day.isRangeStart) classes.push('trc-calendar-cell-range-start');
    if (day.isRangeEnd) classes.push('trc-calendar-cell-range-end');
    if (day.isInRange && !day.isRangeStart && !day.isRangeEnd) {
      classes.push('trc-calendar-cell-range-middle');
    }

    // Multi-select mode class
    if (day.isMultiSelected) classes.push('trc-calendar-cell-multi-selected');

    td.className = classes.join(' ');

    const btn = createElement(
      'button',
      'trc-calendar-day',
      formatDay(day.date.day, config.locale)
    );
    btn.type = 'button';
    btn.disabled = day.isDisabled;

    if (!day.isDisabled) {
      btn.onclick = () => this.dispatch({ type: 'SELECT', date: day.date });

      // Support hover preview for range mode
      if (this.state.selectionMode === 'range') {
        btn.onmouseenter = () => this.dispatch({ type: 'HOVER', date: day.date });
        btn.onmouseleave = () => this.dispatch({ type: 'HOVER', date: null });
      }
    }

    td.appendChild(btn);
    return td;
  }

  // -----------------------------------------------------------------------
  // Month picker (3x4 grid)
  // -----------------------------------------------------------------------

  private renderMonthPicker(): HTMLDivElement {
    const { focusedDate, config } = this.state;

    const items = getMonthGrid(
      focusedDate.year,
      config.calendarType,
      config.locale,
      focusedDate.month,
      config.minDate,
      config.maxDate
    );

    const grid = createElement('div', 'trc-calendar-picker-grid trc-calendar-month-grid');

    for (const item of items) {
      const classes = ['trc-calendar-picker-cell'];
      if (item.isCurrentMonth) classes.push('trc-calendar-picker-cell-active');
      if (item.disabled) classes.push('trc-calendar-picker-cell-disabled');

      const btn = createElement('button', classes.join(' '), item.shortName);
      btn.type = 'button';
      btn.disabled = item.disabled;

      if (!item.disabled) {
        btn.onclick = () => {
          // Focus on the first day of the selected month, then switch to day view
          this.dispatch({
            type: 'FOCUS_DATE',
            date: {
              ...focusedDate,
              month: item.month,
              day: 1,
            },
          });
          this.dispatch({ type: 'SET_VIEW_MODE', mode: 'day' });
        };
      }

      grid.appendChild(btn);
    }

    return grid;
  }

  // -----------------------------------------------------------------------
  // Year picker (3x4 grid)
  // -----------------------------------------------------------------------

  private renderYearPicker(): HTMLDivElement {
    const { focusedDate, config } = this.state;

    const items = getYearGrid(
      focusedDate.year,
      config.calendarType,
      12,
      config.minDate,
      config.maxDate
    );

    const grid = createElement('div', 'trc-calendar-picker-grid trc-calendar-year-grid');

    for (const item of items) {
      const classes = ['trc-calendar-picker-cell'];
      if (item.isCurrentYear) classes.push('trc-calendar-picker-cell-active');
      if (item.disabled) classes.push('trc-calendar-picker-cell-disabled');

      const label = formatYear(item.year, config.locale);
      const btn = createElement('button', classes.join(' '), label);
      btn.type = 'button';
      btn.disabled = item.disabled;

      if (!item.disabled) {
        btn.onclick = () => {
          this.dispatch({
            type: 'FOCUS_DATE',
            date: {
              ...focusedDate,
              year: item.year,
              day: 1,
            },
          });
          this.dispatch({ type: 'SET_VIEW_MODE', mode: 'month' });
        };
      }

      grid.appendChild(btn);
    }

    return grid;
  }

  // -----------------------------------------------------------------------
  // Public API
  // -----------------------------------------------------------------------

  /** Navigate to the next month. */
  nextMonth(): void {
    this.dispatch({ type: 'NEXT_MONTH' });
  }

  /** Navigate to the previous month. */
  prevMonth(): void {
    this.dispatch({ type: 'PREV_MONTH' });
  }

  /** Programmatically select a date. */
  selectDate(date: CalendarDate): void {
    this.dispatch({ type: 'SELECT', date });
  }

  /** Set the calendar theme (sets `data-theme` attribute). */
  setTheme(theme: string): void {
    this.el.setAttribute('data-theme', theme);
  }

  /** Get the current selection value. */
  getValue(): CalendarDate | CalendarDate[] | DateRangeValue | null {
    return getSelectionValue(this.state);
  }

  /** Remove all rendered DOM content. */
  destroy(): void {
    this.el.innerHTML = '';
  }
}
