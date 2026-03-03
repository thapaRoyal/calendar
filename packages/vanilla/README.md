# @thaparoyal/calendar-vanilla

Vanilla JavaScript calendar for AD (Gregorian) and BS (Bikram Sambat/Nepali) calendars. Zero framework dependencies — works in any web project.

## Installation

```bash
npm install @thaparoyal/calendar-vanilla @thaparoyal/calendar-core
```

### CDN (no build step)

```html
<!-- Core (required) -->
<script src="https://cdn.jsdelivr.net/npm/@thaparoyal/calendar-core/dist/cdn/index.global.js"></script>
<!-- Vanilla package -->
<script src="https://cdn.jsdelivr.net/npm/@thaparoyal/calendar-vanilla/dist/cdn/index.global.js"></script>
<!-- Styles -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@thaparoyal/calendar-core/themes/themes.css" />
```

## Features

- **Zero Dependencies** - Pure JavaScript, no framework required
- **AD & BS Calendars** - Full Gregorian and Bikram Sambat support
- **Locale Support** - English and Nepali (Devanagari)
- **Date Range Selection** - Single, range, and multiple date selection
- **CDN Ready** - Works via `<script>` tags without a build step
- **TypeScript** - Full type definitions included

## Quick Start

```js
import { render } from '@thaparoyal/calendar-vanilla';
import '@thaparoyal/calendar-core/themes/themes.css';

// Render into an element — simplest usage
const cal = render('#my-calendar', {
  config: { calendarType: 'BS', locale: 'en' },
  selectionMode: 'single',
  onValueChange: (value) => {
    console.log('Selected:', value);
  },
});

// Destroy when done
cal.destroy();
```

## Class API

```js
import { Calendar } from '@thaparoyal/calendar-vanilla';

const cal = new Calendar({
  element: document.getElementById('my-calendar'),
  config: {
    calendarType: 'BS',
    locale: 'ne',          // Nepali — Devanagari numerals and month names
    weekStartsOn: 0,       // 0 = Sunday, 1 = Monday
  },
  selectionMode: 'single', // 'single' | 'range' | 'multiple'
  onValueChange: (value) => {
    console.log('Value changed:', value);
  },
});
```

### Calendar Options

```typescript
interface CalendarOptions {
  element: HTMLElement | string;      // Target element or CSS selector
  config?: Partial<CalendarConfig>;   // Calendar configuration
  value?: CalendarDate | null;        // Controlled value
  defaultValue?: CalendarDate;        // Uncontrolled initial value
  selectionMode?: SelectionMode;      // 'single' | 'range' | 'multiple'
  disabledDates?: CalendarDate[];     // Dates to disable
  onValueChange?: (value: CalendarDate | DateRangeValue | CalendarDate[]) => void;
  className?: string;                 // Additional CSS class
}
```

### CalendarConfig

```typescript
interface CalendarConfig {
  calendarType: 'AD' | 'BS';   // Calendar system
  locale: 'en' | 'ne';         // 'en' = English, 'ne' = Nepali (Devanagari)
  weekStartsOn: 0 | 1;         // 0 = Sunday, 1 = Monday
  minDate?: CalendarDate;       // Minimum selectable date
  maxDate?: CalendarDate;       // Maximum selectable date
}
```

### Instance Methods

```js
// Get current selected value
const value = cal.getValue();

// Programmatically set a date
cal.setValue({ year: 2081, month: 1, day: 1, calendarType: 'BS' });

// Navigate to a specific month
cal.navigateTo(2081, 4);

// Update options after creation
cal.update({ config: { locale: 'ne' } });

// Clean up (removes DOM and event listeners)
cal.destroy();
```

## Date Ranges

```js
const cal = new Calendar({
  element: '#range-picker',
  config: { calendarType: 'BS', locale: 'en' },
  selectionMode: 'range',
  onValueChange: (value) => {
    // value: { start: CalendarDate, end: CalendarDate | null }
    console.log('From:', value.start, 'To:', value.end);
  },
});
```

## Multiple Date Selection

```js
const cal = new Calendar({
  element: '#multi-picker',
  config: { calendarType: 'BS', locale: 'en' },
  selectionMode: 'multiple',
  onValueChange: (dates) => {
    // dates: CalendarDate[]
    console.log('Selected dates:', dates);
  },
});
```

## Month & Weekday Names

```js
import {
  BS_MONTHS_EN,       // ['Baisakh', 'Jestha', ...]
  BS_MONTHS_NP,       // ['बैशाख', 'जेठ', ...]
  BS_MONTHS_SHORT_EN,
  BS_MONTHS_SHORT_NP,
  WEEKDAYS_EN,        // ['Sunday', 'Monday', ...]
  WEEKDAYS_NP,        // ['आइतबार', 'सोमबार', ...]
  WEEKDAYS_SHORT_EN,
  WEEKDAYS_SHORT_NP,
  NEPALI_DIGITS,
  toNepaliNumeral,
  fromNepaliNumeral,
  getMonthName,
  getWeekdayName,
} from '@thaparoyal/calendar-vanilla';

getMonthName(1, 'BS', 'en');  // "Baisakh"
getMonthName(1, 'BS', 'ne');  // "बैशाख"
getWeekdayName(0, 'en');      // "Sunday"
getWeekdayName(0, 'ne');      // "आइतबार"

toNepaliNumeral(2081);        // "२०८१"
fromNepaliNumeral('२०८१');    // 2081
```

## Date Utilities

```js
import {
  adToBs,
  bsToAd,
  formatDate,
  getTodayBs,
  getTodayAd,
  isValidBsDate,
  isValidAdDate,
} from '@thaparoyal/calendar-vanilla';

// Today in BS
const today = getTodayBs();
// e.g., { year: 2081, month: 3, day: 15, calendarType: 'BS' }

// AD → BS
const bsDate = adToBs(new Date(2024, 3, 14));
// { year: 2081, month: 1, day: 1, calendarType: 'BS' }

// BS → AD
const adDate = bsToAd({ year: 2081, month: 1, day: 1 });
// { year: 2024, month: 4, day: 14, calendarType: 'AD' }

// Formatting
formatDate(bsDate, 'YYYY-MM-DD');           // "2081-01-01"
formatDate(bsDate, 'YYYY MMMM DD', 'en');   // "2081 Baisakh 01"
formatDate(bsDate, 'YYYY MMMM DD', 'ne');   // "२०८१ बैशाख ०१"
```

## Themes

```js
import '@thaparoyal/calendar-core/themes/themes.css';
```

Apply a theme:

```html
<!-- Wrap your calendar in an element with data-theme -->
<div data-theme="dark">
  <div id="my-calendar"></div>
</div>
```

Available themes: `default`, `dark`, `forest`, `ocean`, `sunset`, `royal`.

Switch at runtime:

```js
document.getElementById('my-calendar').setAttribute('data-theme', 'ocean');
// or on the root
document.documentElement.setAttribute('data-theme', 'dark');
```

## CDN Usage

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@thaparoyal/calendar-core/themes/themes.css" />
</head>
<body>
  <div id="cal" data-theme="default"></div>

  <script src="https://cdn.jsdelivr.net/npm/@thaparoyal/calendar-core/dist/cdn/index.global.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/@thaparoyal/calendar-vanilla/dist/cdn/index.global.js"></script>
  <script>
    const { render } = ThaparoyalCalendarVanilla;

    render('#cal', {
      config: { calendarType: 'BS', locale: 'ne' },
      onValueChange: function(date) {
        console.log('Selected:', date);
      },
    });
  </script>
</body>
</html>
```

## Supported Date Range

- **BS Calendar**: 1970–2100 BS (1913–2043 AD)
- **AD Calendar**: Full Gregorian calendar support

## License

MIT
