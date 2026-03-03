# @thaparoyal/calendar-vue

Vue 3 composables for AD (Gregorian) and BS (Bikram Sambat/Nepali) calendars.

## Installation

```bash
npm install @thaparoyal/calendar-vue @thaparoyal/calendar-core
```

## Features

- **Vue 3 Composables** - Reactive composables powered by Vue's Composition API
- **AD & BS Calendars** - Full support for both Gregorian and Bikram Sambat calendars
- **Locale Support** - English and Nepali (Devanagari) with Nepali numerals
- **Date Range Selection** - Built-in range picker support
- **Multi-Calendar** - Display multiple months simultaneously
- **TypeScript** - Complete type definitions included

## Composables

| Composable | Description |
|------------|-------------|
| `useCalendar` | Calendar state and navigation |
| `useSelection` | Single, range, and multi-date selection |
| `useDatePicker` | Date picker with open/close state |
| `useMultiCalendar` | Multiple month calendar state |

## Usage

### Basic Calendar

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { useCalendar, type CalendarDate } from '@thaparoyal/calendar-vue';

const selectedDate = ref<CalendarDate | null>(null);

const { state, actions, weeks, title, weekdayNames } = useCalendar({
  config: { calendarType: 'BS', locale: 'en' },
  onValueChange: (date) => {
    selectedDate.value = date;
  },
});
</script>

<template>
  <div class="calendar">
    <div class="header">
      <button @click="actions.prevMonth">‹</button>
      <span>{{ title }}</span>
      <button @click="actions.nextMonth">›</button>
    </div>

    <div class="weekdays">
      <span v-for="day in weekdayNames" :key="day">{{ day }}</span>
    </div>

    <div v-for="(week, wi) in weeks" :key="wi" class="week">
      <button
        v-for="(day, di) in week"
        :key="di"
        :class="{
          'is-today': day.isToday,
          'is-selected': day.isSelected,
          'is-outside': day.isOutsideMonth,
          'is-disabled': day.isDisabled,
        }"
        :disabled="day.isDisabled"
        @click="actions.selectDate(day.date)"
      >
        {{ day.date.day }}
      </button>
    </div>
  </div>
</template>
```

### Nepali Locale

```vue
<script setup lang="ts">
import { useCalendar } from '@thaparoyal/calendar-vue';

const { state, actions, weeks, title } = useCalendar({
  config: {
    calendarType: 'BS',
    locale: 'ne', // Nepali locale — Devanagari numerals and month names
  },
});
</script>
```

### Date Range Selection

```vue
<script setup lang="ts">
import { useSelection, type DateRangeValue } from '@thaparoyal/calendar-vue';

const { state, actions, weeks } = useSelection({
  config: { calendarType: 'BS', locale: 'en' },
  selectionMode: 'range',
  onValueChange: (value: DateRangeValue) => {
    console.log('Range:', value.start, value.end);
  },
});
</script>
```

### Date Picker

```vue
<script setup lang="ts">
import { useDatePicker, type CalendarDate } from '@thaparoyal/calendar-vue';

const { state, actions, weeks, title, isOpen } = useDatePicker({
  config: { calendarType: 'BS', locale: 'en' },
  onValueChange: (date: CalendarDate | null) => {
    console.log('Selected:', date);
  },
});
</script>

<template>
  <div>
    <button @click="actions.toggle">
      {{ state.value ? state.value.year + '-' + state.value.month + '-' + state.value.day : 'Pick a date' }}
    </button>

    <div v-if="isOpen" class="dropdown">
      <!-- render calendar weeks here -->
    </div>
  </div>
</template>
```

### Multi-Calendar

```vue
<script setup lang="ts">
import { useMultiCalendar } from '@thaparoyal/calendar-vue';

const { months, actions } = useMultiCalendar({
  config: { calendarType: 'BS', locale: 'en' },
  numberOfMonths: 2,
});
</script>

<template>
  <div class="multi-calendar">
    <div v-for="month in months" :key="month.key" class="month">
      <h3>{{ month.title }}</h3>
      <!-- render weeks -->
    </div>
  </div>
</template>
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
} from '@thaparoyal/calendar-vue';

// Get month name dynamically
import { getMonthName, getWeekdayName } from '@thaparoyal/calendar-vue';

getMonthName(1, 'BS', 'en');  // "Baisakh"
getMonthName(1, 'BS', 'ne');  // "बैशाख"

getWeekdayName(0, 'en'); // "Sunday"
getWeekdayName(0, 'ne'); // "आइतबार"

// Numeral conversion
toNepaliNumeral(2081);   // "२०८१"
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
} from '@thaparoyal/calendar-vue';

// Conversion
const bsDate = adToBs(new Date(2024, 3, 14));
// { year: 2081, month: 1, day: 1, calendarType: 'BS' }

const adDate = bsToAd({ year: 2081, month: 1, day: 1 });
// { year: 2024, month: 4, day: 14, calendarType: 'AD' }

// Formatting
formatDate(bsDate, 'YYYY MMMM DD', 'en'); // "2081 Baisakh 01"
formatDate(bsDate, 'YYYY MMMM DD', 'ne'); // "२०८१ बैशाख ०१"

// Validation
isValidBsDate(2081, 1, 32); // false
isValidBsDate(2081, 1, 31); // true
```

## Themes

Import built-in themes from the core package:

```js
// In your main entry file
import '@thaparoyal/calendar-core/themes/themes.css';
```

Apply a theme by setting `data-theme` on any ancestor element:

```html
<div data-theme="dark">...</div>
<div data-theme="forest">...</div>
<div data-theme="ocean">...</div>
<div data-theme="sunset">...</div>
<div data-theme="royal">...</div>
```

Or switch themes at runtime:

```js
document.documentElement.setAttribute('data-theme', 'dark');
```

## API Reference

### `useCalendar(options)`

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `config` | `Partial<CalendarConfig>` | `{ calendarType: 'BS', locale: 'en' }` | Calendar configuration |
| `defaultValue` | `CalendarDate` | — | Initial selected date |
| `value` | `CalendarDate \| null` | — | Controlled selected date |
| `onValueChange` | `(date: CalendarDate) => void` | — | Callback on date selection |
| `disabledDates` | `CalendarDate[]` | — | Dates to disable |

**Returns:** `{ state, actions, weeks, title, weekdayNames }`

### `useSelection(options)`

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `config` | `Partial<CalendarConfig>` | — | Calendar configuration |
| `selectionMode` | `'single' \| 'range' \| 'multiple'` | `'single'` | Selection mode |
| `onValueChange` | `(value) => void` | — | Selection change callback |

### `useDatePicker(options)`

Same options as `useCalendar`, plus:

| Option | Type | Description |
|--------|------|-------------|
| `defaultOpen` | `boolean` | Initial open state |

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
