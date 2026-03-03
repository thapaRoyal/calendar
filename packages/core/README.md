# @thaparoyal/calendar-core

Core date conversion and utility functions for AD (Gregorian) and BS (Bikram Sambat/Nepali) calendars. Framework-agnostic — works with React, Vue, Svelte, Vanilla JS, or any other environment.

## Installation

```bash
npm install @thaparoyal/calendar-core
```

## Features

- **Date Conversion** — Accurate AD to BS and BS to AD conversion using a complete lookup table (1970–2100 BS)
- **Date Formatting** — Token-based formatting with English and Nepali locale support
- **Date Validation** — Validate dates in both calendar systems
- **Date Manipulation** — Add/subtract days, months, and years
- **Calendar Utilities** — Generate calendar grids and week arrays
- **Locale Data** — Month and weekday names in both English and Nepali (Devanagari)
- **Nepali Numerals** — Convert between Arabic (1, 2) and Devanagari (१, २) numerals
- **State Machines** — Framework-agnostic reducers for calendars, date pickers, and range pickers
- **Theme System** — 6 built-in CSS themes

---

## Date Conversion

```typescript
import { adToBs, bsToAd, bsToJsDate, jsDateToBs } from '@thaparoyal/calendar-core';

// AD to BS
const bsDate = adToBs(new Date(2024, 3, 14));
// { year: 2081, month: 1, day: 1, calendarType: 'BS' }

// BS to AD
const adDate = bsToAd({ year: 2081, month: 1, day: 1 });
// { year: 2024, month: 4, day: 14, calendarType: 'AD' }

// BS to JavaScript Date
const jsDate = bsToJsDate({ year: 2081, month: 1, day: 1 });

// JavaScript Date to BS
const bs = jsDateToBs(new Date());
```

---

## Date Formatting

```typescript
import { formatDate, formatMonthYear } from '@thaparoyal/calendar-core';

const date = { year: 2081, month: 1, day: 1, calendarType: 'BS' as const };

formatDate(date, 'YYYY-MM-DD');           // "2081-01-01"
formatDate(date, 'YYYY MMMM DD', 'en');   // "2081 Baisakh 01"
formatDate(date, 'YYYY MMMM DD', 'ne');   // "२०८१ बैशाख ०१"
formatDate(date, 'D MMMM, YYYY', 'en');   // "1 Baisakh, 2081"
formatDate(date, 'DD/MM/YYYY');           // "01/01/2081"

formatMonthYear(2081, 1, 'BS', 'en');     // "Baisakh 2081"
formatMonthYear(2081, 1, 'BS', 'ne');     // "बैशाख २०८१"
```

**Format tokens:**

| Token | Output (en) | Output (ne) |
|-------|-------------|-------------|
| `YYYY` | `2081` | `२०८१` |
| `YY` | `81` | `८१` |
| `MMMM` | `Baisakh` | `बैशाख` |
| `MMM` | `Bai` | `बै` |
| `MM` | `01` | `०१` |
| `M` | `1` | `१` |
| `DD` | `01` | `०१` |
| `D` | `1` | `१` |
| `dddd` | `Sunday` | `आइतबार` |
| `ddd` | `Sun` | `आइत` |

---

## Month & Weekday Names

### Constants

```typescript
import {
  // BS month names
  BS_MONTHS_EN,        // ['Baisakh', 'Jestha', 'Ashadh', 'Shrawan', 'Bhadra', 'Ashwin', 'Kartik', 'Mangsir', 'Poush', 'Magh', 'Falgun', 'Chaitra']
  BS_MONTHS_NP,        // ['बैशाख', 'जेठ', 'असार', 'श्रावण', 'भाद्र', 'आश्विन', 'कार्तिक', 'मंसिर', 'पौष', 'माघ', 'फाल्गुन', 'चैत्र']
  BS_MONTHS_SHORT_EN,  // ['Bai', 'Jes', 'Ash', 'Shr', 'Bhd', 'Asw', 'Kar', 'Man', 'Pou', 'Mag', 'Fal', 'Cha']
  BS_MONTHS_SHORT_NP,  // ['बै', 'जे', 'अ', 'श्रा', 'भा', 'आ', 'का', 'मं', 'पौ', 'मा', 'फा', 'चै']

  // Weekday names
  WEEKDAYS_EN,         // ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  WEEKDAYS_NP,         // ['आइतबार', 'सोमबार', 'मंगलबार', 'बुधबार', 'बिहीबार', 'शुक्रबार', 'शनिबार']
  WEEKDAYS_SHORT_EN,   // ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  WEEKDAYS_SHORT_NP,   // ['आइत', 'सोम', 'मंगल', 'बुध', 'बिही', 'शुक्र', 'शनि']
  WEEKDAYS_MIN_EN,     // ['S', 'M', 'T', 'W', 'T', 'F', 'S']
  WEEKDAYS_MIN_NP,     // ['आ', 'सो', 'मं', 'बु', 'बि', 'शु', 'श']

  NEPALI_DIGITS,       // ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९']
} from '@thaparoyal/calendar-core';
```

### UI Text Constants

```typescript
import {
  TODAY_TEXT,         // { en: 'Today', ne: 'आज' }
  CLEAR_TEXT,         // { en: 'Clear', ne: 'मेटाउनुहोस्' }
  SELECT_DATE_TEXT,   // { en: 'Select date', ne: 'मिति छान्नुहोस्' }
  PREV_MONTH_TEXT,    // { en: 'Previous month', ne: 'अघिल्लो महिना' }
  NEXT_MONTH_TEXT,    // { en: 'Next month', ne: 'अर्को महिना' }
} from '@thaparoyal/calendar-core';
```

### Lookup Functions

```typescript
import {
  getMonthName, getMonthShortName, getMonthNames,
  getWeekdayName, getWeekdayShortName, getWeekdayMinName,
  getWeekdayNames, getWeekdayShortNames, getWeekdayMinNames,
} from '@thaparoyal/calendar-core';

getMonthName(1, 'BS', 'en');         // "Baisakh"
getMonthName(1, 'BS', 'ne');         // "बैशाख"
getMonthShortName(1, 'BS', 'ne');    // "बै"
getMonthNames('BS', 'ne');           // ['बैशाख', 'जेठ', ...]

getWeekdayName(0, 'en');             // "Sunday"
getWeekdayName(0, 'ne');             // "आइतबार"
getWeekdayShortName(0, 'ne');        // "आइत"
getWeekdayMinName(0, 'ne');          // "आ"
getWeekdayShortNames('ne');          // ['आइत', 'सोम', ...]
```

---

## Nepali Numerals

```typescript
import { toNepaliNumeral, fromNepaliNumeral } from '@thaparoyal/calendar-core';

toNepaliNumeral(2081);          // "२०८१"
toNepaliNumeral(15);            // "१५"
fromNepaliNumeral('२०८१');      // 2081
fromNepaliNumeral('१५');        // 15
```

---

## Date Validation

```typescript
import { isValidBsDate, isValidAdDate, isLeapYear } from '@thaparoyal/calendar-core';

isValidBsDate(2081, 1, 31);  // true
isValidBsDate(2081, 1, 35);  // false
isValidBsDate(2200, 1, 1);   // false (out of range)

isValidAdDate(2024, 2, 29);  // true (leap year)
isValidAdDate(2023, 2, 29);  // false

isLeapYear(2024);            // true
```

---

## Date Manipulation

```typescript
import { addDaysBs, addMonthsBs, addYearsBs, startOfMonthBs, endOfMonthBs } from '@thaparoyal/calendar-core';

const date = { year: 2081, month: 6, day: 15, calendarType: 'BS' as const };

addDaysBs(date, 10);     // { year: 2081, month: 6, day: 25, ... }
addMonthsBs(date, 3);    // { year: 2081, month: 9, day: 15, ... }
addYearsBs(date, 1);     // { year: 2082, month: 6, day: 15, ... }
startOfMonthBs(date);    // { year: 2081, month: 6, day: 1, ... }
endOfMonthBs(date);      // last day of month 6 in 2081
```

---

## Calendar Grid

```typescript
import { getWeeksInMonth } from '@thaparoyal/calendar-core';

const config = { calendarType: 'BS' as const, locale: 'en' as const, weekStartsOn: 0 as const };
const weeks = getWeeksInMonth(2081, 1, 'BS', config);
// Array of weeks, each with 7 day objects:
// { date: CalendarDate, isToday, isSelected, isOutsideMonth, isDisabled }
```

---

## Themes

```js
import '@thaparoyal/calendar-core/themes/themes.css';
```

Apply via `data-theme` attribute:

```html
<div data-theme="dark">...</div>
```

| Theme | Value |
|-------|-------|
| Default (light/indigo) | `default` or omit attribute |
| Dark | `dark` |
| Forest (green) | `forest` |
| Ocean (blue) | `ocean` |
| Sunset (warm/orange) | `sunset` |
| Royal (purple) | `royal` |

Switch at runtime:

```js
document.documentElement.setAttribute('data-theme', 'ocean');
```

Custom theme via CSS custom properties:

```css
:root {
  --trc-primary: #2563eb;
  --trc-primary-hover: #1d4ed8;
  --trc-primary-foreground: #ffffff;
  --trc-background: #ffffff;
  --trc-background-secondary: #f8fafc;
  --trc-foreground: #0f172a;
  --trc-foreground-secondary: #475569;
  --trc-foreground-muted: #94a3b8;
  --trc-border: #e2e8f0;
  --trc-ring: rgba(37, 99, 235, 0.4);
  --trc-radius-sm: 4px;
  --trc-radius: 6px;
  --trc-radius-lg: 10px;
}
```

---

## State Machine (framework integration)

```typescript
import {
  calendarReducer,
  createInitialState,
  createCalendarActions,
} from '@thaparoyal/calendar-core';

const state = createInitialState({ calendarType: 'BS' });
const dispatch = (event) => { /* your state update */ };
const actions = createCalendarActions(dispatch);

actions.nextMonth();
actions.selectDate({ year: 2081, month: 1, day: 1, calendarType: 'BS' });
```

---

## Supported Date Range

- **BS Calendar**: 1970–2100 BS (1913–2043 AD)
- **AD Calendar**: Full Gregorian calendar support

---

## API Reference

### Converters

| Function | Description |
|----------|-------------|
| `adToBs(date)` | JavaScript Date to BS CalendarDate |
| `bsToAd(date)` | BS CalendarDate to AD CalendarDate |
| `bsToJsDate(date)` | BS CalendarDate to JavaScript Date |
| `jsDateToBs(date)` | JavaScript Date to BS CalendarDate |
| `getTodayBs()` | Today in BS |
| `getTodayAd()` | Today in AD |
| `isValidBsDate(y, m, d)` | Validate BS date |
| `isValidAdDate(y, m, d)` | Validate AD date |
| `isLeapYear(year)` | Check AD leap year |
| `compareDates(a, b)` | Compare two dates (-1, 0, 1) |
| `isSameDate(a, b)` | Check date equality |
| `isSameMonth(a, b)` | Check same month |

### Formatters

| Function | Description |
|----------|-------------|
| `formatDate(date, format, locale?)` | Token-based date formatting |
| `formatMonthYear(y, m, type, locale)` | Format month and year label |
| `parseDate(str, format, type, locale?)` | Parse a formatted date string |
| `getMonthName(month, type, locale)` | Full month name |
| `getMonthShortName(month, type, locale)` | Short month name |
| `getMonthNames(type, locale)` | All 12 month names |
| `getWeekdayName(day, locale)` | Full weekday name |
| `getWeekdayShortName(day, locale)` | Short weekday name |
| `getWeekdayMinName(day, locale)` | Minimal weekday name |
| `getWeekdayNames(locale)` | All 7 weekday names |
| `getWeekdayShortNames(locale)` | All 7 short weekday names |
| `getWeekdayMinNames(locale)` | All 7 minimal weekday names |

### Manipulation

| Function | Description |
|----------|-------------|
| `addDaysBs(date, n)` | Add days to BS date |
| `addMonthsBs(date, n)` | Add months to BS date |
| `addYearsBs(date, n)` | Add years to BS date |
| `startOfMonthBs(date)` | First day of BS month |
| `endOfMonthBs(date)` | Last day of BS month |

## License

MIT
