# @thaparoyal/calendar-angular

Angular services for AD (Gregorian) and BS (Bikram Sambat/Nepali) calendars. Uses Angular's dependency injection with RxJS `BehaviorSubject` for reactive state, wrapping the framework-agnostic `@thaparoyal/calendar-core` state machines.

## Installation

```bash
npm install @thaparoyal/calendar-angular @thaparoyal/calendar-core
```

**Peer dependencies:** `@angular/core >= 14`, `rxjs >= 7`

## Features

- **4 Injectable Services** — `CalendarService`, `SelectionService`, `DatePickerService`, `MultiCalendarService`
- **Reactive Observables** — Every piece of state exposed as an `Observable` for use with `async` pipe
- **Angular DI** — Provide at component level for isolated state or module level for shared state
- **AD & BS Calendars** — Gregorian and Bikram Sambat support
- **Locale Support** — English and Nepali (Devanagari numerals and month names)
- **Date Range** — Single, range, and multiple selection via `SelectionService`
- **Multi-Calendar** — Side-by-side months via `MultiCalendarService`
- **Date Input Masking** — Live `YYYY-MM-DD` auto-formatting in `DatePickerService`
- **TypeScript** — Complete type definitions

---

## Services

| Service | Purpose |
|---------|---------|
| `CalendarService` | Single-date calendar + month/year/decade navigation |
| `SelectionService` | Unified single / range / multiple date selection |
| `DatePickerService` | Calendar + typed text input + popup toggle |
| `MultiCalendarService` | Side-by-side months with selection |

All services follow the same lifecycle pattern:

```ts
@Component({ providers: [ServiceName] })
class MyComponent implements OnInit {
  constructor(public svc: ServiceName) {}

  ngOnInit() {
    this.svc.initialize({ /* options */ });
  }
}
```

---

## CalendarService

```ts
import { CalendarService } from '@thaparoyal/calendar-angular';

@Component({
  selector: 'app-calendar',
  providers: [CalendarService],
  template: `
    <div data-theme="default">
      <div class="header">
        <button (click)="cal.prevMonth()" [disabled]="cal.isPrevMonthDisabled$ | async">‹</button>
        <span>{{ cal.title$ | async }}</span>
        <button (click)="cal.nextMonth()" [disabled]="cal.isNextMonthDisabled$ | async">›</button>
      </div>

      <div class="weekdays">
        <span *ngFor="let name of cal.weekdayNames$ | async">{{ name }}</span>
      </div>

      <div *ngFor="let week of cal.weeks$ | async" class="week">
        <button
          *ngFor="let day of week"
          (click)="cal.selectDate(day.date)"
          [class.today]="day.isToday"
          [class.selected]="day.isSelected"
          [class.outside]="day.isOutsideMonth"
          [disabled]="day.isDisabled"
        >
          {{ day.date.day }}
        </button>
      </div>
    </div>
  `,
})
export class CalendarComponent implements OnInit {
  constructor(public cal: CalendarService) {}

  ngOnInit() {
    this.cal.initialize({
      config: { calendarType: 'BS', locale: 'en' },
    });
  }
}
```

### `CalendarService` API

**`initialize(options)`** — Call in `ngOnInit`.

```ts
interface CalendarServiceOptions {
  config?: Partial<CalendarConfig>;   // Calendar type, locale, min/max date, etc.
  defaultValue?: CalendarDate;        // Pre-selected date
  disabledDates?: CalendarDate[];     // Dates to disable
}
```

**Action methods:**

```ts
cal.selectDate(date)
cal.focusDate(date)
cal.nextMonth()
cal.prevMonth()
cal.nextYear()
cal.prevYear()
cal.setViewMode('day' | 'month' | 'year')
cal.goToToday()
cal.setDisabledDates(dates)
cal.formatDayNumber(day)   // → string (respects locale, Nepali numerals in 'ne' mode)
```

**Observable getters:**

```ts
cal.state$                 // Observable<CalendarState>
cal.selectedDate$          // Observable<CalendarDate | null>
cal.focusedDate$           // Observable<CalendarDate>
cal.viewMode$              // Observable<'day' | 'month' | 'year'>
cal.title$                 // Observable<string>  e.g. "Baisakh 2082"
cal.weekdayNames$          // Observable<string[]>
cal.weeks$                 // Observable<Week[]>
cal.monthPickerItems$      // Observable<MonthPickerItem[]>
cal.yearPickerItems$       // Observable<YearPickerItem[]>
cal.decadeRange$           // Observable<DecadeRange>
cal.isPrevMonthDisabled$   // Observable<boolean>
cal.isNextMonthDisabled$   // Observable<boolean>
cal.locale$                // Observable<'en' | 'ne'>
```

---

## SelectionService

Unified single / range / multiple selection with full calendar navigation.

```ts
import { SelectionService } from '@thaparoyal/calendar-angular';

@Component({
  providers: [SelectionService],
  template: `
    <div *ngFor="let week of sel.weeks$ | async" class="week">
      <button
        *ngFor="let day of week"
        (click)="sel.select(day.date)"
        (mouseenter)="sel.hover(day.date)"
        [class.range-start]="day.isRangeStart"
        [class.range-end]="day.isRangeEnd"
        [class.in-range]="day.isInRange"
      >
        {{ day.date.day }}
      </button>
    </div>
    <p>Selected: {{ sel.value$ | async | json }}</p>
  `,
})
export class RangePickerComponent implements OnInit {
  constructor(public sel: SelectionService) {}

  ngOnInit() {
    this.sel.initialize({ mode: 'range', config: { calendarType: 'BS' } });
  }
}
```

### `SelectionService` API

**`initialize(options)`:**

```ts
interface SelectionServiceOptions {
  mode?: 'single' | 'range' | 'multiple';
  config?: Partial<SelectionConfig>;
  defaultValue?: CalendarDate | CalendarDate[] | DateRangeValue | null;
  disabledDates?: CalendarDate[];
}
```

**Action methods:** `select(date)`, `toggle(date)`, `hover(date)`, `clear()`, `nextMonth()`, `prevMonth()`, `nextYear()`, `prevYear()`, `setViewMode(mode)`, `goToToday()`

**Helper methods (sync, use current state):**

```ts
sel.isMultiSelected(date)  // → boolean
sel.isInRange(date)        // → boolean
sel.isRangeStart(date)     // → boolean
sel.isRangeEnd(date)       // → boolean
sel.isRangeMiddle(date)    // → boolean
```

**Observable getters:** `state$`, `value$`, `isComplete$`, `title$`, `weekdayNames$`, `weeks$`, `locale$`, `monthPickerItems$`, `yearPickerItems$`, `decadeRange$`, `isPrevMonthDisabled$`, `isNextMonthDisabled$`, `selectionMode$`

---

## DatePickerService

Calendar + typed text input + popup — all in one service.

```ts
import { DatePickerService } from '@thaparoyal/calendar-angular';

@Component({
  providers: [DatePickerService],
  template: `
    <div class="date-picker" (document:mousedown)="onOutsideClick($event)">
      <!-- Input row -->
      <div class="input-row">
        <input
          [value]="picker.inputValue$ | async"
          (input)="picker.onInputChange($any($event.target).value)"
          (blur)="picker.onInputBlur()"
          placeholder="YYYY-MM-DD"
          #inputEl
        />
        <button (click)="picker.toggle()">📅</button>
        <button *ngIf="picker.selectedDate$ | async" (click)="picker.clear()">✕</button>
      </div>

      <!-- Dropdown calendar -->
      <div *ngIf="picker.isOpen$ | async" class="dropdown" #dropdownEl>
        <div class="header">
          <button (click)="picker.prevMonth()">‹</button>
          <span>{{ picker.title$ | async }}</span>
          <button (click)="picker.nextMonth()">›</button>
        </div>
        <div *ngFor="let week of picker.weeks$ | async" class="week">
          <button
            *ngFor="let day of week"
            (click)="picker.selectDate(day.date)"
            [class.selected]="day.isSelected"
            [class.today]="day.isToday"
          >
            {{ day.date.day }}
          </button>
        </div>
      </div>
    </div>
  `,
})
export class DatePickerComponent implements OnInit {
  @ViewChild('inputEl') inputEl!: ElementRef;
  @ViewChild('dropdownEl') dropdownEl!: ElementRef;

  constructor(public picker: DatePickerService) {}

  ngOnInit() {
    this.picker.initialize({
      config: { calendarType: 'BS', locale: 'en' },
    });
  }

  onOutsideClick(event: MouseEvent) {
    const target = event.target as Node;
    const isInside =
      this.inputEl?.nativeElement.contains(target) ||
      this.dropdownEl?.nativeElement?.contains(target);
    if (!isInside) this.picker.close();
  }
}
```

### `DatePickerService` API

**`initialize(options)`:**

```ts
interface DatePickerServiceOptions {
  config?: Partial<CalendarConfig>;
  defaultValue?: CalendarDate;
  format?: string;           // default: 'YYYY-MM-DD'
  disabled?: boolean;
  disabledDates?: CalendarDate[];
}
```

**Key action methods:** `open()`, `close()`, `toggle()`, `onInputChange(value)` _(live masking)_, `onInputBlur()` _(validate)_, `clear()`, `selectDate(date)`, `setValue(date | null)` _(programmatic)_, `setDisabled(bool)`

**Observable getters:** `isOpen$`, `inputValue$`, `selectedDate$`, `formattedValue$`, `title$`, `weekdayNames$`, `weeks$`, `monthPickerItems$`, `yearPickerItems$`, `decadeRange$`, `locale$`, `isPrevMonthDisabled$`, `isNextMonthDisabled$`

---

## MultiCalendarService

Side-by-side months with unified selection (useful for date range pickers with two months displayed).

```ts
import { MultiCalendarService } from '@thaparoyal/calendar-angular';

@Component({
  providers: [MultiCalendarService],
  template: `
    <div class="range-picker">
      <div class="nav">
        <button (click)="calendar.prevMonth()" [disabled]="calendar.isPrevDisabled$ | async">‹</button>
        <button (click)="calendar.nextMonth()" [disabled]="calendar.isNextDisabled$ | async">›</button>
      </div>

      <div class="months-row">
        <div *ngFor="let month of calendar.months$ | async" class="month">
          <h3>{{ month.title }}</h3>
          <div *ngFor="let week of month.weeks" class="week">
            <button
              *ngFor="let day of week"
              (click)="calendar.select(day.date)"
              (mouseenter)="calendar.hover(day.date)"
              [class.range-start]="day.isRangeStart"
              [class.range-end]="day.isRangeEnd"
              [class.in-range]="day.isInRange"
              [class.today]="day.isToday"
            >
              {{ day.date.day }}
            </button>
          </div>
        </div>
      </div>

      <p>Selected range: {{ calendar.value$ | async | json }}</p>
    </div>
  `,
})
export class MultiCalendarComponent implements OnInit {
  constructor(public calendar: MultiCalendarService) {}

  ngOnInit() {
    this.calendar.initialize({
      numberOfMonths: 2,
      mode: 'range',
      config: { calendarType: 'BS', locale: 'en' },
    });
  }
}
```

### `MultiCalendarService` API

**`initialize(options)`:**

```ts
interface MultiCalendarServiceOptions {
  numberOfMonths?: number;              // default: 2
  mode?: 'single' | 'range' | 'multiple';
  config?: Partial<SelectionConfig>;
  pagedNavigation?: boolean;            // navigate all months at once
  defaultValue?: CalendarDate | CalendarDate[] | DateRangeValue | null;
  disabledDates?: CalendarDate[];
}
```

**`months$`** emits an array of `MultiCalendarMonth`:

```ts
interface MultiCalendarMonth {
  year: number;
  month: number;
  title: string;    // e.g. "Baisakh 2082"
  weeks: Week[];    // already enhanced with selection state (range flags, hover, etc.)
}
```

**Action methods:** `select(date)`, `toggle(date)`, `hover(date)`, `clear()`, `nextMonth()`, `prevMonth()`, `goToToday()`

**Observable getters:** `state$`, `value$`, `isComplete$`, `months$`, `weekdayNames$`, `locale$`, `isPrevDisabled$`, `isNextDisabled$`

---

## Nepali Locale

Set `locale: 'ne'` in the config to get Devanagari numerals and Nepali month/weekday names:

```ts
this.cal.initialize({
  config: { calendarType: 'BS', locale: 'ne' },
});
```

Month names (`BS_MONTHS_NP`): बैशाख, जेठ, असार, साउन, भदौ, असोज, कार्तिक, मंसिर, पुष, माघ, फागुन, चैत

Weekday names: आइतबार, सोमबार, मंगलबार, बुधबार, बिहिबार, शुक्रबार, शनिबार

---

## Month & Weekday Name Exports

All name constants and conversion utilities are re-exported:

```typescript
import {
  BS_MONTHS_EN, BS_MONTHS_NP,
  BS_MONTHS_SHORT_EN, BS_MONTHS_SHORT_NP,
  WEEKDAYS_EN, WEEKDAYS_NP,
  WEEKDAYS_SHORT_EN, WEEKDAYS_SHORT_NP,
  WEEKDAYS_MIN_EN, WEEKDAYS_MIN_NP,
  NEPALI_DIGITS,
  toNepaliNumeral,      // toNepaliNumeral(2082) → "२०८२"
  fromNepaliNumeral,    // fromNepaliNumeral('२०८२') → 2082
  getMonthName,
  getWeekdayName,
} from '@thaparoyal/calendar-angular';
```

---

## Date Utilities

```typescript
import {
  adToBs, bsToAd, formatDate, parseDate,
  formatDateInput,   // live input masking: "20820" → "2082-0"
  formatRelative,    // "yesterday", "हिजो", "in 3 days"
  getTodayBs, getTodayAd,
  isValidBsDate, isValidAdDate,
  compareDates, isSameDate, isSameMonth,
} from '@thaparoyal/calendar-angular';
```

---

## Holiday Data

```typescript
import {
  getHolidaysForYear,  // static data 2079–2083
  fetchHolidays,       // live API with fallback
  isHoliday,
  getHolidayName,
  getHolidaysInMonth,
} from '@thaparoyal/calendar-angular';

// Async load with cache:
const holidays = await fetchHolidays(2082);
```

---

## Themes

```ts
// In angular.json styles array, or import in styles.css:
// node_modules/@thaparoyal/calendar-core/themes/themes.css
```

```html
<div data-theme="dark">
  <app-calendar></app-calendar>
</div>
```

Available themes: `default`, `dark`, `forest`, `ocean`, `sunset`, `royal`.

---

## Supported Date Range

- **BS Calendar**: 1970–2100 BS (1913–2043 AD)
- **AD Calendar**: Full Gregorian calendar support

## License

MIT
