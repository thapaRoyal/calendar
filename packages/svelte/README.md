# @thaparoyal/calendar-svelte

Svelte 4/5 stores for AD (Gregorian) and BS (Bikram Sambat/Nepali) calendars.

## Installation

```bash
npm install @thaparoyal/calendar-svelte @thaparoyal/calendar-core
```

## Features

- **Svelte Stores** - Writable/derived stores for reactive calendar state
- **AD & BS Calendars** - Full support for both Gregorian and Bikram Sambat calendars
- **Locale Support** - English and Nepali (Devanagari) with Nepali numerals
- **Date Range Selection** - Built-in range picker support
- **Multi-Calendar** - Display multiple months simultaneously
- **TypeScript** - Complete type definitions included

## Stores

| Store Factory | Description |
|---------------|-------------|
| `createCalendar()` | Calendar navigation and selection state |
| `createSelection()` | Single, range, and multi-date selection |
| `createDatePicker()` | Date picker with open/close state |
| `createMultiCalendar()` | Multiple month calendar state |

## Usage

### Basic Calendar

```svelte
<script lang="ts">
  import { createCalendar, type CalendarDate } from '@thaparoyal/calendar-svelte';

  const calendar = createCalendar({
    config: { calendarType: 'BS', locale: 'en' },
    onValueChange: (date: CalendarDate) => console.log('Selected:', date),
  });

  const { state, actions, weeks, title, weekdayNames } = calendar;
</script>

<div class="calendar">
  <div class="header">
    <button on:click={actions.prevMonth}>‹</button>
    <span>{$title}</span>
    <button on:click={actions.nextMonth}>›</button>
  </div>

  <div class="weekdays">
    {#each $weekdayNames as day}
      <span>{day}</span>
    {/each}
  </div>

  {#each $weeks as week}
    <div class="week">
      {#each week as day}
        <button
          class:is-today={day.isToday}
          class:is-selected={day.isSelected}
          class:is-outside={day.isOutsideMonth}
          disabled={day.isDisabled}
          on:click={() => actions.selectDate(day.date)}
        >
          {day.date.day}
        </button>
      {/each}
    </div>
  {/each}
</div>
```

### Nepali Locale

```svelte
<script lang="ts">
  import { createCalendar } from '@thaparoyal/calendar-svelte';

  const { weeks, title } = createCalendar({
    config: {
      calendarType: 'BS',
      locale: 'ne', // Nepali — Devanagari numerals and month names
    },
  });
</script>
```

### Date Range Selection

```svelte
<script lang="ts">
  import { createSelection, type DateRangeValue } from '@thaparoyal/calendar-svelte';

  const { state, actions, weeks } = createSelection({
    config: { calendarType: 'BS', locale: 'en' },
    selectionMode: 'range',
    onValueChange: (value: DateRangeValue) => {
      console.log('From:', value.start, 'To:', value.end);
    },
  });
</script>
```

### Date Picker

```svelte
<script lang="ts">
  import { createDatePicker } from '@thaparoyal/calendar-svelte';

  const { state, actions, weeks, title, isOpen } = createDatePicker({
    config: { calendarType: 'BS', locale: 'en' },
    onValueChange: (date) => console.log('Picked:', date),
  });
</script>

<div>
  <button on:click={actions.toggle}>
    {$state.value
      ? `${$state.value.year}-${$state.value.month}-${$state.value.day}`
      : 'Pick a date'}
  </button>

  {#if $isOpen}
    <div class="dropdown">
      <!-- render calendar weeks here -->
    </div>
  {/if}
</div>
```

### Multi-Calendar

```svelte
<script lang="ts">
  import { createMultiCalendar } from '@thaparoyal/calendar-svelte';

  const { months, actions } = createMultiCalendar({
    config: { calendarType: 'BS', locale: 'en' },
    numberOfMonths: 2,
  });
</script>

<div class="multi-calendar">
  {#each $months as month}
    <div class="month">
      <h3>{month.title}</h3>
      <!-- render weeks -->
    </div>
  {/each}
</div>
```

## Month & Weekday Names

Access Nepali and English calendar labels directly:

```typescript
import {
  BS_MONTHS_EN,    // ['Baisakh', 'Jestha', ...]
  BS_MONTHS_NP,    // ['बैशाख', 'जेठ', ...]
  BS_MONTHS_SHORT_EN,
  BS_MONTHS_SHORT_NP,
  WEEKDAYS_EN,     // ['Sunday', 'Monday', ...]
  WEEKDAYS_NP,     // ['आइतबार', 'सोमबार', ...]
  WEEKDAYS_SHORT_EN,
  WEEKDAYS_SHORT_NP,
  NEPALI_DIGITS,
  toNepaliNumeral,
  fromNepaliNumeral,
} from '@thaparoyal/calendar-svelte';

// Dynamic lookup
import { getMonthName, getWeekdayName } from '@thaparoyal/calendar-svelte';

getMonthName(1, 'BS', 'en');  // "Baisakh"
getMonthName(1, 'BS', 'ne');  // "बैशाख"

getWeekdayName(0, 'en'); // "Sunday"
getWeekdayName(0, 'ne'); // "आइतबार"

toNepaliNumeral(2081);     // "२०८१"
fromNepaliNumeral('२०८१'); // 2081
```

## Date Utilities

```typescript
import {
  adToBs,
  bsToAd,
  formatDate,
  getTodayBs,
  isValidBsDate,
} from '@thaparoyal/calendar-svelte';

const bsDate = adToBs(new Date(2024, 3, 14));
// { year: 2081, month: 1, day: 1, calendarType: 'BS' }

formatDate(bsDate, 'YYYY MMMM DD', 'ne'); // "२०८१ बैशाख ०१"
```

## Themes

Import built-in themes from the core package:

```js
// In your main entry file (e.g., +layout.svelte or app.html)
import '@thaparoyal/calendar-core/themes/themes.css';
```

Apply a theme with the `data-theme` attribute:

```html
<div data-theme="dark">...</div>
```

Available themes: `default`, `dark`, `forest`, `ocean`, `sunset`, `royal`.

```js
// Switch theme at runtime
document.documentElement.setAttribute('data-theme', 'forest');
```

## API Reference

### `createCalendar(options)`

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `config` | `Partial<CalendarConfig>` | `{ calendarType: 'BS', locale: 'en' }` | Calendar configuration |
| `defaultValue` | `CalendarDate` | — | Initial selected date |
| `onValueChange` | `(date: CalendarDate) => void` | — | Date selection callback |
| `disabledDates` | `CalendarDate[]` | — | Dates to disable |

**Returns stores:** `state`, `actions`, `weeks`, `title`, `weekdayNames`

### `createSelection(options)`

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `config` | `Partial<CalendarConfig>` | — | Calendar configuration |
| `selectionMode` | `'single' \| 'range' \| 'multiple'` | `'single'` | Selection behaviour |
| `onValueChange` | `(value) => void` | — | Selection change callback |

### `createDatePicker(options)`

Same as `createCalendar`, plus:

| Option | Type | Description |
|--------|------|-------------|
| `defaultOpen` | `boolean` | Initial open state |

**Returns additionally:** `isOpen` store, `actions.open()`, `actions.close()`, `actions.toggle()`

### `createMultiCalendar(options)`

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `config` | `Partial<CalendarConfig>` | — | Calendar configuration |
| `numberOfMonths` | `number` | `2` | Number of months to display |

### `CalendarConfig`

```typescript
interface CalendarConfig {
  calendarType: 'AD' | 'BS';
  locale: 'en' | 'ne';
  weekStartsOn: 0 | 1;      // 0 = Sunday, 1 = Monday
  minDate?: CalendarDate;
  maxDate?: CalendarDate;
}
```

## License

MIT
