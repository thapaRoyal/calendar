# @thaparoyal/calendar-react

React components and hooks for AD (Gregorian) and BS (Bikram Sambat/Nepali) calendars.

## Installation

```bash
npm install @thaparoyal/calendar-react @thaparoyal/calendar-core
```

## Features

- **Compound Components** — shadcn/ui-style composable API for full layout control
- **React Hooks** — `useCalendar`, `useDatePicker`, `useSelection`, `useDateConverter`
- **AD & BS Calendars** — Gregorian and Bikram Sambat support
- **Locale Support** — English and Nepali (Devanagari numerals and month names)
- **Date Range** — Single, range, and multiple selection
- **Multi-Calendar** — Display multiple months simultaneously
- **Customisable** — CSS variables, class overrides, and custom components
- **TypeScript** — Complete type definitions

## Components

| Component | Description |
|-----------|-------------|
| `Calendar` | Full calendar with compound sub-components |
| `DatePicker` | Date picker with input and dropdown |
| `RangeCalendar` | Calendar with range selection |
| `MultiCalendar` | Multiple month calendar |

## Usage

### Basic Calendar

```tsx
import { useState } from 'react';
import { Calendar, type CalendarDate } from '@thaparoyal/calendar-react';
import '@thaparoyal/calendar-react/styles.css';
import '@thaparoyal/calendar-core/themes/themes.css';

function MyCalendar() {
  const [date, setDate] = useState<CalendarDate | null>(null);

  return (
    <div data-theme="default">
      <Calendar.Root
        config={{ calendarType: 'BS', locale: 'en' }}
        value={date}
        onValueChange={setDate}
      >
        <Calendar.Header>
          <Calendar.PrevButton />
          <Calendar.Title />
          <Calendar.NextButton />
        </Calendar.Header>
        <Calendar.Grid>
          <Calendar.GridHead />
          <Calendar.GridBody />
        </Calendar.Grid>
      </Calendar.Root>
    </div>
  );
}
```

### Nepali Locale

```tsx
<Calendar.Root
  config={{ calendarType: 'BS', locale: 'ne' }}
  value={date}
  onValueChange={setDate}
>
  {/* Same sub-components — outputs Devanagari numerals and month names */}
</Calendar.Root>
```

### DatePicker

```tsx
import { DatePicker, type CalendarDate } from '@thaparoyal/calendar-react';
import '@thaparoyal/calendar-react/styles.css';

function MyDatePicker() {
  const [date, setDate] = useState<CalendarDate | null>(null);

  return (
    <DatePicker.Root
      config={{ calendarType: 'BS', locale: 'en' }}
      value={date}
      onValueChange={setDate}
    >
      <DatePicker.Input />
      <DatePicker.Trigger />
      <DatePicker.ClearButton />
      <DatePicker.Content>
        <DatePicker.Calendar />
      </DatePicker.Content>
    </DatePicker.Root>
  );
}
```

### Range Calendar

```tsx
import { RangeCalendar, type DateRangeValue } from '@thaparoyal/calendar-react';

function MyRangePicker() {
  const [range, setRange] = useState<DateRangeValue | null>(null);

  return (
    <RangeCalendar.Root
      config={{ calendarType: 'BS', locale: 'en' }}
      value={range}
      onValueChange={setRange}
    >
      <RangeCalendar.Header>
        <RangeCalendar.PrevButton />
        <RangeCalendar.Title />
        <RangeCalendar.NextButton />
      </RangeCalendar.Header>
      <RangeCalendar.Grid>
        <RangeCalendar.GridHead />
        <RangeCalendar.GridBody />
      </RangeCalendar.Grid>
    </RangeCalendar.Root>
  );
}
```

### Multi-Calendar

```tsx
import { MultiCalendar } from '@thaparoyal/calendar-react';

function MyMultiCalendar() {
  return (
    <MultiCalendar.Root
      config={{ calendarType: 'BS', locale: 'en' }}
      numberOfMonths={2}
    >
      <MultiCalendar.Header>
        <MultiCalendar.PrevButton />
        <MultiCalendar.Title />
        <MultiCalendar.NextButton />
      </MultiCalendar.Header>
      <MultiCalendar.Calendars />
    </MultiCalendar.Root>
  );
}
```

---

## Hooks

### `useCalendar`

```tsx
import { useCalendar } from '@thaparoyal/calendar-react';

function MyCustomCalendar() {
  const { state, actions, weeks, title, weekdayNames } = useCalendar({
    config: { calendarType: 'BS', locale: 'en' },
    onValueChange: (date) => console.log('Selected:', date),
  });

  return (
    <div>
      <div>
        <button onClick={actions.prevMonth}>‹</button>
        <span>{title}</span>
        <button onClick={actions.nextMonth}>›</button>
      </div>
      {weeks.map((week, wi) => (
        <div key={wi}>
          {week.map((day, di) => (
            <button
              key={di}
              onClick={() => actions.selectDate(day.date)}
              disabled={day.isDisabled}
              style={{ fontWeight: day.isToday ? 'bold' : 'normal' }}
            >
              {day.date.day}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}
```

### `useDateConverter`

```tsx
import { useDateConverter } from '@thaparoyal/calendar-react';

function DateConverterExample() {
  const { adToBs, bsToAd, format } = useDateConverter();

  const bs = adToBs(new Date());
  const formatted = format(bs, 'YYYY MMMM DD', 'ne');

  return <p>आज: {formatted}</p>;
}
```

### `useSelection`

```tsx
import { useSelection } from '@thaparoyal/calendar-react';

function MultiSelectCalendar() {
  const { state, actions, weeks } = useSelection({
    config: { calendarType: 'BS', locale: 'en' },
    selectionMode: 'range',
    onValueChange: (value) => console.log('Range:', value),
  });

  return (/* render weeks */);
}
```

---

## Month & Weekday Name Exports

```typescript
import {
  BS_MONTHS_EN,        // ['Baisakh', 'Jestha', ...]
  BS_MONTHS_NP,        // ['बैशाख', 'जेठ', ...]
  BS_MONTHS_SHORT_EN,
  BS_MONTHS_SHORT_NP,
  WEEKDAYS_EN,         // ['Sunday', 'Monday', ...]
  WEEKDAYS_NP,         // ['आइतबार', 'सोमबार', ...]
  WEEKDAYS_SHORT_EN,
  WEEKDAYS_SHORT_NP,
  WEEKDAYS_MIN_EN,
  WEEKDAYS_MIN_NP,
  NEPALI_DIGITS,
  toNepaliNumeral,
  fromNepaliNumeral,
  getMonthName,
  getWeekdayName,
} from '@thaparoyal/calendar-react';

getMonthName(1, 'BS', 'ne');  // "बैशाख"
getWeekdayName(0, 'ne');      // "आइतबार"
toNepaliNumeral(2081);        // "२०८१"
```

---

## Calendar Sub-Components

### `Calendar.*`

| Sub-component | Description |
|---------------|-------------|
| `Calendar.Root` | Context root — provides state to all children |
| `Calendar.Header` | Wrapper for navigation controls |
| `Calendar.Title` | Displays current month and year |
| `Calendar.PrevButton` | Navigate to previous month |
| `Calendar.NextButton` | Navigate to next month |
| `Calendar.Grid` | Table container for the calendar |
| `Calendar.GridHead` | Weekday header row |
| `Calendar.GridBody` | Calendar days grid |
| `Calendar.Row` | Custom row slot |
| `Calendar.DayCell` | Custom day cell slot |
| `Calendar.MonthPicker` | Month selection picker |
| `Calendar.YearPicker` | Year selection picker |
| `Calendar.MonthDropdown` | Month dropdown selector |
| `Calendar.YearDropdown` | Year dropdown selector |

### `DatePicker.*`

| Sub-component | Description |
|---------------|-------------|
| `DatePicker.Root` | Context root with picker state |
| `DatePicker.Input` | Text input for date entry |
| `DatePicker.Trigger` | Button to open the calendar |
| `DatePicker.Content` | Dropdown container |
| `DatePicker.Calendar` | Embedded calendar |
| `DatePicker.ClearButton` | Clear the selected date |

---

## Props

### `Calendar.Root` Props

```typescript
interface CalendarRootProps {
  config?: Partial<CalendarConfig>;
  value?: CalendarDate | null;
  defaultValue?: CalendarDate;
  onValueChange?: (date: CalendarDate) => void;
  disabledDates?: CalendarDate[];
  className?: string;
}
```

### `CalendarConfig`

```typescript
interface CalendarConfig {
  calendarType: 'AD' | 'BS';
  locale: 'en' | 'ne';
  weekStartsOn: 0 | 1;       // 0 = Sunday, 1 = Monday
  minDate?: CalendarDate;
  maxDate?: CalendarDate;
}
```

### `CalendarDate`

```typescript
interface CalendarDate {
  year: number;
  month: number;   // 1-12
  day: number;     // 1-32 (BS months can be up to 32 days)
  calendarType: 'AD' | 'BS';
}
```

---

## Styling

### Default Styles

```tsx
import '@thaparoyal/calendar-react/styles.css';
```

### Themes

```tsx
import '@thaparoyal/calendar-core/themes/themes.css';
```

Then set `data-theme` on a parent element:

```tsx
<div data-theme="dark">
  <Calendar.Root ...>...</Calendar.Root>
</div>
```

Available themes: `default`, `dark`, `forest`, `ocean`, `sunset`, `royal`.

### CSS Variables

Customise the look by overriding CSS variables:

```css
:root {
  --trc-primary: #2563eb;
  --trc-primary-foreground: #ffffff;
  --trc-background: #ffffff;
  --trc-foreground: #1f2937;
  --trc-muted: #f3f4f6;
  --trc-muted-foreground: #6b7280;
  --trc-border: #e5e7eb;
  --trc-ring: #3b82f6;
  --trc-radius: 0.375rem;
}
```

### Class Overrides

Pass `classNames` to override individual component classes:

```tsx
<Calendar.Root
  classNames={{
    root: 'my-calendar',
    header: 'my-header',
    title: 'my-title font-bold text-lg',
    dayCell: (day) => day.isSelected ? 'bg-blue-500 text-white' : '',
  }}
>
  ...
</Calendar.Root>
```

---

## Date Utilities

```typescript
import {
  adToBs, bsToAd, formatDate, parseDate,
  getTodayBs, getTodayAd, isValidBsDate, isValidAdDate,
} from '@thaparoyal/calendar-react';

// All core utilities are re-exported for convenience
const today = getTodayBs();
const formatted = formatDate(today, 'YYYY MMMM DD', 'ne');
```

---

## Supported Date Range

- **BS Calendar**: 1970–2100 BS (1913–2043 AD)
- **AD Calendar**: Full Gregorian calendar support

## License

MIT
