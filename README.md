# @thaparoyal/calendar

A comprehensive, multi-calendar UI library supporting AD (Gregorian) and BS (Bikram Sambat/Nepali) calendars. Built with a shadcn/ui-style approach for maximum customisation.

## Features

- **Multi-Calendar Support** — AD (Gregorian) and BS (Bikram Sambat) calendars with accurate conversion
- **Framework Support** — React, Vue 3, Svelte 4/5, Angular 14+, and Vanilla JS
- **shadcn/ui Style** — Copy-paste components via CLI; you own the code
- **TypeScript First** — Complete type safety across all packages
- **Locale Support** — English and Nepali (Devanagari script with Nepali numerals)
- **Theme System** — 6 built-in colour themes with CSS custom properties
- **Date Ranges** — Single, range, and multiple date selection
- **Multi-Calendar View** — Display multiple months simultaneously
- **Accessible** — ARIA-compliant components

## Packages

| Package | Description |
|---------|-------------|
| [`@thaparoyal/calendar-core`](./packages/core) | Core date conversion, utilities, and state machines |
| [`@thaparoyal/calendar-react`](./packages/react) | React components and hooks |
| [`@thaparoyal/calendar-vue`](./packages/vue) | Vue 3 composables |
| [`@thaparoyal/calendar-svelte`](./packages/svelte) | Svelte stores |
| [`@thaparoyal/calendar-angular`](./packages/angular) | Angular injectable services (RxJS) |
| [`@thaparoyal/calendar-vanilla`](./packages/vanilla) | Vanilla JS calendar class |
| [`@thaparoyal/calendar-cli`](./packages/cli) | CLI for component installation |

---

## Quick Start

### Using the CLI (Recommended)

```bash
# Step 1 — Initialise in your project
npx @thaparoyal/calendar-cli init

# Step 2 — Add components
npx @thaparoyal/calendar-cli add calendar
npx @thaparoyal/calendar-cli add date-picker

# List all available components
npx @thaparoyal/calendar-cli list
```

### Manual Installation

```bash
# Core package (always required)
npm install @thaparoyal/calendar-core

# Pick your framework
npm install @thaparoyal/calendar-react    # React
npm install @thaparoyal/calendar-vue      # Vue 3
npm install @thaparoyal/calendar-svelte   # Svelte 4/5
npm install @thaparoyal/calendar-angular  # Angular 14+ (+ rxjs peer dep)
npm install @thaparoyal/calendar-vanilla  # Vanilla JS
```

---

## Usage

### React

```tsx
import { useState } from 'react';
import { Calendar, DatePicker, type CalendarDate } from '@thaparoyal/calendar-react';
import '@thaparoyal/calendar-react/styles.css';
import '@thaparoyal/calendar-core/themes/themes.css';

function App() {
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

### Vue 3

```vue
<script setup lang="ts">
import { useCalendar } from '@thaparoyal/calendar-vue';
import '@thaparoyal/calendar-core/themes/themes.css';

const { state, actions, weeks, title, weekdayNames } = useCalendar({
  config: { calendarType: 'BS', locale: 'en' },
  onValueChange: (date) => console.log('Selected:', date),
});
</script>

<template>
  <div data-theme="default">
    <div>
      <button @click="actions.prevMonth">&#8249;</button>
      <span>{{ title }}</span>
      <button @click="actions.nextMonth">&#8250;</button>
    </div>
    <div v-for="(week, wi) in weeks" :key="wi">
      <button
        v-for="(day, di) in week"
        :key="di"
        @click="actions.selectDate(day.date)"
      >{{ day.date.day }}</button>
    </div>
  </div>
</template>
```

### Svelte

```svelte
<script lang="ts">
  import { createCalendar } from '@thaparoyal/calendar-svelte';
  import '@thaparoyal/calendar-core/themes/themes.css';

  const { actions, weeks, title } = createCalendar({
    config: { calendarType: 'BS', locale: 'en' },
    onValueChange: (date) => console.log('Selected:', date),
  });
</script>

<div data-theme="default">
  <div>
    <button on:click={actions.prevMonth}>&#8249;</button>
    <span>{$title}</span>
    <button on:click={actions.nextMonth}>&#8250;</button>
  </div>
  {#each $weeks as week}
    <div>
      {#each week as day}
        <button on:click={() => actions.selectDate(day.date)}>{day.date.day}</button>
      {/each}
    </div>
  {/each}
</div>
```

### Angular

```ts
import { Component, OnInit } from '@angular/core';
import { CalendarService } from '@thaparoyal/calendar-angular';
// In angular.json styles: node_modules/@thaparoyal/calendar-core/themes/themes.css

@Component({
  selector: 'app-calendar',
  providers: [CalendarService],
  template: `
    <div data-theme="default">
      <div>
        <button (click)="cal.prevMonth()">‹</button>
        <span>{{ cal.title$ | async }}</span>
        <button (click)="cal.nextMonth()">›</button>
      </div>
      <div *ngFor="let week of cal.weeks$ | async">
        <button
          *ngFor="let day of week"
          (click)="cal.selectDate(day.date)"
          [class.selected]="day.isSelected"
          [class.today]="day.isToday"
          [disabled]="day.isDisabled"
        >{{ day.date.day }}</button>
      </div>
    </div>
  `,
})
export class CalendarComponent implements OnInit {
  constructor(public cal: CalendarService) {}

  ngOnInit() {
    this.cal.initialize({ config: { calendarType: 'BS', locale: 'en' } });
  }
}
```

### Vanilla JS

```js
import { render } from '@thaparoyal/calendar-vanilla';
import '@thaparoyal/calendar-core/themes/themes.css';

const cal = render('#my-calendar', {
  config: { calendarType: 'BS', locale: 'ne' },
  selectionMode: 'single',
  onValueChange: (date) => console.log('Selected:', date),
});
```

---

## Date Conversion

```typescript
import { adToBs, bsToAd, formatDate, getTodayBs } from '@thaparoyal/calendar-core';

// AD to BS
const bsDate = adToBs(new Date(2024, 3, 14));
// { year: 2081, month: 1, day: 1, calendarType: 'BS' }

// BS to AD
const adDate = bsToAd({ year: 2081, month: 1, day: 1 });
// { year: 2024, month: 4, day: 14, calendarType: 'AD' }

// Format with English locale
formatDate(bsDate, 'YYYY MMMM DD', 'en'); // "2081 Baisakh 01"

// Format with Nepali locale (Devanagari numerals + month names)
formatDate(bsDate, 'YYYY MMMM DD', 'ne'); // "२०८१ बैशाख ०१"

// Today in BS
const today = getTodayBs();
```

---

## Month & Weekday Names (Nepali & English)

All packages export month and weekday name constants in both languages:

```typescript
import {
  BS_MONTHS_EN,        // ['Baisakh', 'Jestha', 'Ashadh', ...]
  BS_MONTHS_NP,        // ['बैशाख', 'जेठ', 'असार', ...]
  BS_MONTHS_SHORT_EN,  // ['Bai', 'Jes', 'Ash', ...]
  BS_MONTHS_SHORT_NP,  // ['बै', 'जे', 'अ', ...]
  WEEKDAYS_EN,         // ['Sunday', 'Monday', ...]
  WEEKDAYS_NP,         // ['आइतबार', 'सोमबार', ...]
  WEEKDAYS_SHORT_EN,   // ['Sun', 'Mon', ...]
  WEEKDAYS_SHORT_NP,   // ['आइत', 'सोम', ...]
  WEEKDAYS_MIN_EN,     // ['S', 'M', 'T', ...]
  WEEKDAYS_MIN_NP,     // ['आ', 'सो', 'मं', ...]
  NEPALI_DIGITS,       // ['०', '१', '२', ...]
  toNepaliNumeral,
  fromNepaliNumeral,
} from '@thaparoyal/calendar-core';
// Also available from @thaparoyal/calendar-react, -vue, -svelte, -angular, -vanilla

toNepaliNumeral(2081);        // "२०८१"
fromNepaliNumeral('२०८१');    // 2081
```

---

## Themes

Import the theme stylesheet and apply via `data-theme`:

```js
import '@thaparoyal/calendar-core/themes/themes.css';
```

```html
<div data-theme="dark">...</div>
```

| Theme | `data-theme` value |
|-------|-------------------|
| Default (indigo/light) | `default` or omit |
| Dark | `dark` |
| Forest (green) | `forest` |
| Ocean (blue) | `ocean` |
| Sunset (orange/red) | `sunset` |
| Royal (purple) | `royal` |

Switch theme at runtime:

```js
document.documentElement.setAttribute('data-theme', 'dark');
```

Custom theme via CSS variables:

```css
:root {
  --trc-primary: #2563eb;
  --trc-primary-foreground: #ffffff;
  --trc-background: #ffffff;
  --trc-foreground: #1f2937;
  --trc-border: #e5e7eb;
  --trc-radius: 0.375rem;
}
```

---

## Configuration (`calendar.config.json`)

```json
{
  "$schema": "https://thaparoyal-calendar.dev/schema.json",
  "framework": "react",
  "typescript": true,
  "tailwind": true,
  "defaultCalendar": "BS",
  "locale": "en",
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
```

| Field | Options | Default | Description |
|-------|---------|---------|-------------|
| `framework` | `react`, `vue`, `svelte`, `angular`, `vanilla` | `react` | Target framework |
| `typescript` | `true`, `false` | `true` | TypeScript support |
| `tailwind` | `true`, `false` | `true` | Tailwind CSS |
| `defaultCalendar` | `BS`, `AD` | `BS` | Default calendar system |
| `locale` | `en`, `ne` | `en` | Default locale |
| `aliases.components` | any path | `@/components` | Components directory alias |
| `aliases.utils` | any path | `@/lib/utils` | Utils file alias |

---

## Supported Date Range

- **BS Calendar**: 1970–2100 BS (1913–2043 AD)
- **AD Calendar**: Full Gregorian calendar support

---

## Development

```bash
# Install dependencies
pnpm install

# Start all workspace dev tasks
pnpm dev

# Start the docs/playground site only
pnpm --filter site dev

# Build all packages
pnpm build

# Run tests
pnpm test

# Type check
pnpm typecheck
```

### App Routes (dev server)

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/docs/*` | Documentation (Starlight) |
| `/playground/react/` | React component demos |
| `/playground/vue/` | Vue composable demos |
| `/playground/svelte/` | Svelte store demos |

### Docker

```bash
# Development (site on http://localhost:3000)
docker-compose -f docker/docker-compose.yml up dev

# Run tests
docker-compose -f docker/docker-compose.yml up test

# Build
docker-compose -f docker/docker-compose.yml up build

# Production preview (http://localhost:4321)
docker-compose -f docker/docker-compose.yml up docs
```

---

## Contributing

Contributions are welcome! Please read our [contributing guide](CONTRIBUTING.md) for details.

## License

MIT License — see [LICENSE](LICENSE) for details.
