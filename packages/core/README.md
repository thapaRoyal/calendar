# @thaparoyal/calendar-core

Core date conversion and utility functions for AD (Gregorian) and BS (Bikram Sambat/Nepali) calendars.

## Installation

```bash
npm install @thaparoyal/calendar-core
```

## Features

- **Date Conversion**: Accurate AD ↔ BS conversion using lookup tables
- **Date Formatting**: Flexible formatting with locale support
- **Date Validation**: Validate dates in both calendar systems
- **Date Manipulation**: Add/subtract days, months, years
- **Calendar Utilities**: Generate calendar grids, week arrays
- **State Machines**: Framework-agnostic state management for calendars

## Usage

### Date Conversion

```typescript
import { adToBs, bsToAd, bsToJsDate, jsDateToBs } from '@thaparoyal/calendar-core';

// AD to BS
const bsDate = adToBs(new Date(2024, 0, 1));
// { year: 2080, month: 9, day: 16, calendarType: 'BS' }

// BS to AD
const adDate = bsToAd({ year: 2080, month: 9, day: 16 });
// { year: 2024, month: 1, day: 1, calendarType: 'AD' }

// BS to JavaScript Date
const jsDate = bsToJsDate({ year: 2080, month: 9, day: 16 });

// JavaScript Date to BS
const bs = jsDateToBs(new Date());
```

### Date Formatting

```typescript
import { formatDate, formatMonthYear } from '@thaparoyal/calendar-core';

const date = { year: 2080, month: 9, day: 16, calendarType: 'BS' };

formatDate(date, 'YYYY-MM-DD');           // "2080-09-16"
formatDate(date, 'YYYY MMMM DD', 'en');   // "2080 Poush 16"
formatDate(date, 'YYYY MMMM DD', 'ne');   // "२०८० पौष १६"
formatDate(date, 'D MMMM, YYYY', 'en');   // "16 Poush, 2080"

formatMonthYear(2080, 9, 'BS', 'en');     // "Poush 2080"
formatMonthYear(2080, 9, 'BS', 'ne');     // "पौष २०८०"
```

### Date Validation

```typescript
import { isValidBsDate, isValidAdDate } from '@thaparoyal/calendar-core';

isValidBsDate(2080, 1, 31);  // true
isValidBsDate(2080, 1, 35);  // false (invalid day)
isValidBsDate(2200, 1, 1);   // false (year out of range)

isValidAdDate(2024, 2, 29);  // true (leap year)
isValidAdDate(2023, 2, 29);  // false (not a leap year)
```

### Date Manipulation

```typescript
import { addDaysBs, addMonthsBs, addYearsBs } from '@thaparoyal/calendar-core';

const date = { year: 2080, month: 6, day: 15 };

addDaysBs(date, 10);    // { year: 2080, month: 6, day: 25 }
addMonthsBs(date, 3);   // { year: 2080, month: 9, day: 15 }
addYearsBs(date, 1);    // { year: 2081, month: 6, day: 15 }
```

### Calendar Grid Generation

```typescript
import { getWeeksInMonth } from '@thaparoyal/calendar-core';

const config = {
  calendarType: 'BS',
  locale: 'en',
  weekStartsOn: 0, // Sunday
};

const weeks = getWeeksInMonth(2080, 9, 'BS', config);
// Returns array of weeks, each containing 7 day objects
```

### State Machine (for framework integration)

```typescript
import {
  calendarReducer,
  createInitialState,
  createCalendarActions,
} from '@thaparoyal/calendar-core';

// Create initial state
const state = createInitialState({ calendarType: 'BS' });

// Create actions
const dispatch = (event) => {/* your dispatch logic */};
const actions = createCalendarActions(dispatch);

// Use actions
actions.nextMonth();
actions.selectDate({ year: 2080, month: 9, day: 16, calendarType: 'BS' });
```

## Supported Date Range

- **BS Calendar**: 1970-2100 BS (1913-2043 AD)
- **AD Calendar**: Full Gregorian calendar support

## API Reference

### Converters

- `adToBs(date)` - Convert AD to BS
- `bsToAd(date)` - Convert BS to AD
- `bsToJsDate(date)` - Convert BS to JavaScript Date
- `jsDateToBs(date)` - Convert JavaScript Date to BS

### Formatters

- `formatDate(date, format, locale)` - Format a date
- `formatMonthYear(year, month, calendarType, locale)` - Format month and year
- `getMonthName(month, calendarType, locale)` - Get month name
- `getWeekdayName(dayOfWeek, locale)` - Get weekday name

### Validators

- `isValidBsDate(year, month, day)` - Validate BS date
- `isValidAdDate(year, month, day)` - Validate AD date

### Utilities

- `getTodayBs()` - Get today's date in BS
- `getTodayAd()` - Get today's date in AD
- `compareDates(a, b)` - Compare two dates
- `isSameDate(a, b)` - Check if dates are equal
- `addDaysBs(date, days)` - Add days to BS date
- `getWeeksInMonth(...)` - Generate calendar grid

## License

MIT
