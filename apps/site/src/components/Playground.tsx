import { useEffect, useState } from 'react';
import {
  Calendar,
  DatePicker,
  RangeCalendar,
  MultiCalendar,
  type CalendarDate,
  type DateRangeValue,
} from '@thaparoyal/calendar-react';
import '@thaparoyal/calendar-core/themes/themes.css';

const THEMES = [
  'default', 'dark', 'ocean', 'ocean-dark', 'forest', 'forest-dark',
  'sunset', 'sunset-dark', 'royal', 'royal-dark', 'nepal', 'nepal-dark',
  'lavender', 'midnight', 'rose', 'mint', 'amber', 'slate', 'coral', 'indigo',
] as const;

type Theme = (typeof THEMES)[number];
type Framework = 'react' | 'vue' | 'svelte' | 'angular' | 'vanilla';

function fmtDate(d: CalendarDate | null | undefined): string {
  if (!d) return '—';
  return `${d.year}-${String(d.month).padStart(2, '0')}-${String(d.day).padStart(2, '0')} (${d.calendarType})`;
}

/* ─── Code Snippets ─── */

const CODE_SINGLE: Record<Framework, string> = {
  react: `import { Calendar, type CalendarDate } from '@thaparoyal/calendar-react';
import '@thaparoyal/calendar-core/themes/themes.css';

function MyCalendar() {
  const [date, setDate] = useState<CalendarDate | null>(null);

  return (
    <div data-theme="dark">
      <Calendar.Root
        config={{ calendarType: 'BS', locale: 'en' }}
        value={date}
        onValueChange={setDate}
      >
        <Calendar.Header>
          <Calendar.PrevButton />
          <Calendar.Title />  {/* Click to cycle: day → month → year */}
          <Calendar.NextButton />
        </Calendar.Header>
        <Calendar.Grid>
          <Calendar.GridHead />
          <Calendar.GridBody />
        </Calendar.Grid>
        <Calendar.MonthPicker />
        <Calendar.YearPicker />
      </Calendar.Root>
    </div>
  );
}`,
  vue: `<script setup>
import { ref } from 'vue';
import { useCalendar } from '@thaparoyal/calendar-vue';
import '@thaparoyal/calendar-core/themes/themes.css';

const { state, actions, weeks, title, weekdayNames,
  monthPickerItems, yearPickerItems, decadeRange, viewMode,
  isPrevMonthDisabled, isNextMonthDisabled, formatDayNumber,
} = useCalendar({ config: { calendarType: 'BS', locale: 'en' } });

function onTitleClick() {
  if (viewMode.value === 'day') actions.setViewMode('month');
  else if (viewMode.value === 'month') actions.setViewMode('year');
  else actions.setViewMode('day');
}
</script>

<template>
  <div data-theme="dark">
    <div class="trc-calendar">
      <div class="trc-calendar-header">
        <button class="trc-calendar-nav-button trc-calendar-prev"
          @click="viewMode === 'day' ? actions.prevMonth() : actions.prevYear()"
          :disabled="isPrevMonthDisabled">‹</button>
        <button class="trc-calendar-title" @click="onTitleClick">{{ title }}</button>
        <button class="trc-calendar-nav-button trc-calendar-next"
          @click="viewMode === 'day' ? actions.nextMonth() : actions.nextYear()"
          :disabled="isNextMonthDisabled">›</button>
      </div>

      <!-- Day grid -->
      <table v-if="viewMode === 'day'" class="trc-calendar-grid">
        <thead><tr>
          <th v-for="d in weekdayNames" class="trc-calendar-weekday">{{ d }}</th>
        </tr></thead>
        <tbody>
          <tr v-for="week in weeks" class="trc-calendar-week">
            <td v-for="day in week" :class="[
              'trc-calendar-cell',
              day.isToday && 'trc-calendar-cell-today',
              day.isSelected && 'trc-calendar-cell-selected',
              day.isDisabled && 'trc-calendar-cell-disabled',
              day.isOutsideMonth && 'trc-calendar-cell-outside',
            ]">
              <button class="trc-calendar-day"
                @click="!day.isDisabled && actions.selectDate(day.date)"
                :disabled="day.isDisabled">{{ formatDayNumber(day.date.day) }}</button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Month picker -->
      <div v-if="viewMode === 'month'" class="trc-calendar-month-picker">
        <button v-for="m in monthPickerItems" :class="[
          'trc-calendar-month-cell',
          m.isCurrentMonth && 'trc-calendar-month-current',
        ]" @click="actions.focusDate({ ...state.focusedDate, month: m.month }); actions.setViewMode('day')">
          {{ m.shortName }}
        </button>
      </div>

      <!-- Year picker -->
      <div v-if="viewMode === 'year'" class="trc-calendar-year-picker">
        <button v-for="y in yearPickerItems" :class="[
          'trc-calendar-year-cell',
          y.isCurrentYear && 'trc-calendar-year-current',
        ]" @click="actions.focusDate({ ...state.focusedDate, year: y.year }); actions.setViewMode('month')">
          {{ y.year }}
        </button>
      </div>
    </div>
  </div>
</template>`,
  svelte: `<script>
  import { createCalendar } from '@thaparoyal/calendar-svelte';
  import '@thaparoyal/calendar-core/themes/themes.css';

  const cal = createCalendar({ config: { calendarType: 'BS', locale: 'en' } });
  const { state, weeks, title, weekdayNames,
    monthPickerItems, yearPickerItems, decadeRange, viewMode,
    isPrevMonthDisabled, isNextMonthDisabled, formatDayNumber,
    selectDate, focusDate, prevMonth, nextMonth, prevYear, nextYear, setViewMode,
  } = cal;

  function onTitleClick() {
    if ($viewMode === 'day') setViewMode('month');
    else if ($viewMode === 'month') setViewMode('year');
    else setViewMode('day');
  }
</script>

<div data-theme="dark">
  <div class="trc-calendar">
    <div class="trc-calendar-header">
      <button class="trc-calendar-nav-button trc-calendar-prev"
        on:click={() => $viewMode === 'day' ? prevMonth() : prevYear()}
        disabled={$isPrevMonthDisabled}>‹</button>
      <button class="trc-calendar-title" on:click={onTitleClick}>{$title}</button>
      <button class="trc-calendar-nav-button trc-calendar-next"
        on:click={() => $viewMode === 'day' ? nextMonth() : nextYear()}
        disabled={$isNextMonthDisabled}>›</button>
    </div>

    {#if $viewMode === 'day'}
      <table class="trc-calendar-grid">
        <thead><tr>
          {#each $weekdayNames as d}<th class="trc-calendar-weekday">{d}</th>{/each}
        </tr></thead>
        <tbody>
          {#each $weeks as week}
            <tr class="trc-calendar-week">
              {#each week as day}
                <td class="trc-calendar-cell"
                  class:trc-calendar-cell-today={day.isToday}
                  class:trc-calendar-cell-selected={day.isSelected}
                  class:trc-calendar-cell-disabled={day.isDisabled}
                  class:trc-calendar-cell-outside={day.isOutsideMonth}>
                  <button class="trc-calendar-day"
                    on:click={() => !day.isDisabled && selectDate(day.date)}
                    disabled={day.isDisabled}>{formatDayNumber(day.date.day)}</button>
                </td>
              {/each}
            </tr>
          {/each}
        </tbody>
      </table>
    {:else if $viewMode === 'month'}
      <div class="trc-calendar-month-picker">
        {#each $monthPickerItems as m}
          <button class="trc-calendar-month-cell"
            class:trc-calendar-month-current={m.isCurrentMonth}
            on:click={() => { focusDate({ ...$state.focusedDate, month: m.month }); setViewMode('day'); }}>
            {m.shortName}
          </button>
        {/each}
      </div>
    {:else}
      <div class="trc-calendar-year-picker">
        {#each $yearPickerItems as y}
          <button class="trc-calendar-year-cell"
            class:trc-calendar-year-current={y.isCurrentYear}
            on:click={() => { focusDate({ ...$state.focusedDate, year: y.year }); setViewMode('month'); }}>
            {y.year}
          </button>
        {/each}
      </div>
    {/if}
  </div>
</div>`,
  angular: `import { Component, OnInit } from '@angular/core';
import { CalendarService } from '@thaparoyal/calendar-angular';

@Component({
  selector: 'app-calendar',
  providers: [CalendarService],
  template: \`
    <div class="trc-calendar" data-theme="dark">
      <div class="trc-calendar-header">
        <button class="trc-calendar-nav-button" (click)="cal.prevMonth()">&#8249;</button>
        <button class="trc-calendar-title">{{ cal.title$ | async }}</button>
        <button class="trc-calendar-nav-button" (click)="cal.nextMonth()">&#8250;</button>
      </div>
      <table class="trc-calendar-grid">
        <tbody>
          <tr *ngFor="let week of cal.weeks$ | async" class="trc-calendar-week">
            <td *ngFor="let day of week" class="trc-calendar-cell">
              <button class="trc-calendar-day" (click)="cal.selectDate(day.date)">
                {{ cal.formatDayNumber(day.date.day) }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  \`,
})
export class CalendarComponent implements OnInit {
  constructor(public cal: CalendarService) {}

  ngOnInit() {
    this.cal.initialize({ config: { calendarType: 'BS', locale: 'en' } });
  }
}`,
  vanilla: `import { render } from '@thaparoyal/calendar-vanilla';
import '@thaparoyal/calendar-core/themes/themes.css';

// Or via CDN:
// <script src="https://cdn.jsdelivr.net/npm/@thaparoyal/calendar-vanilla/dist/cdn/index.global.js">

render('#my-calendar', {
  config: { calendarType: 'BS', locale: 'en' },
  selectionMode: 'single',
  theme: 'dark',
  onValueChange: (date) => console.log('Selected:', date),
});`,
};

const CODE_DROPDOWN: Record<Framework, string> = {
  react: `<Calendar.Root config={{ calendarType: 'BS', locale: 'en' }}>
  <Calendar.Header>
    <Calendar.PrevButton />
    <Calendar.MonthDropdown />
    <Calendar.YearDropdown />
    <Calendar.NextButton />
  </Calendar.Header>
  <Calendar.Grid>
    <Calendar.GridHead />
    <Calendar.GridBody />
  </Calendar.Grid>
</Calendar.Root>`,
  vue: `<!-- Use monthPickerItems from useCalendar for dropdown options -->
<select class="trc-calendar-dropdown trc-calendar-dropdown-month"
  :value="state.focusedDate.month"
  @change="actions.focusDate({ ...state.focusedDate, month: +$event.target.value })">
  <option v-for="m in monthPickerItems" :value="m.month" :disabled="m.disabled">
    {{ m.name }}
  </option>
</select>

<select class="trc-calendar-dropdown trc-calendar-dropdown-year"
  :value="state.focusedDate.year"
  @change="actions.focusDate({ ...state.focusedDate, year: +$event.target.value })">
  <option v-for="y in yearRange" :value="y">{{ y }}</option>
</select>`,
  svelte: `<!-- Use monthPickerItems from createCalendar for dropdown options -->
<select class="trc-calendar-dropdown trc-calendar-dropdown-month"
  value={$state.focusedDate.month}
  on:change={(e) => focusDate({ ...$state.focusedDate, month: +e.target.value })}>
  {#each $monthPickerItems as m}
    <option value={m.month} disabled={m.disabled}>{m.name}</option>
  {/each}
</select>

<select class="trc-calendar-dropdown trc-calendar-dropdown-year"
  value={$state.focusedDate.year}
  on:change={(e) => focusDate({ ...$state.focusedDate, year: +e.target.value })}>
  {#each yearRange as y}
    <option value={y}>{y}</option>
  {/each}
</select>`,
  angular: `// Use monthPickerItems$ and yearPickerItems$ from CalendarService
<select
  class="trc-calendar-dropdown trc-calendar-dropdown-month"
  [value]="(cal.focusedDate$ | async)?.month"
  (change)="cal.focusDate({ ...(cal.focusedDate$ | async)!, month: +$any($event.target).value })"
>
  <option *ngFor="let m of cal.monthPickerItems$ | async" [value]="m.month" [disabled]="m.disabled">
    {{ m.name }}
  </option>
</select>

<select
  class="trc-calendar-dropdown trc-calendar-dropdown-year"
  [value]="(cal.focusedDate$ | async)?.year"
  (change)="cal.focusDate({ ...(cal.focusedDate$ | async)!, year: +$any($event.target).value })"
>
  <option *ngFor="let y of cal.yearPickerItems$ | async" [value]="y.year" [disabled]="y.disabled">
    {{ y.year }}
  </option>
</select>`,
  vanilla: `// Vanilla JS uses built-in dropdowns in the rendered calendar
// You can access the calendar instance for programmatic control:
const cal = new Calendar('#el', {
  config: { calendarType: 'BS' },
  selectionMode: 'single',
});
// Programmatic navigation:
cal.prevMonth();
cal.nextMonth();`,
};

const CODE_RANGE: Record<Framework, string> = {
  react: `import { RangeCalendar, type DateRangeValue } from '@thaparoyal/calendar-react';

const [range, setRange] = useState<DateRangeValue | null>(null);

<RangeCalendar.Root config={config} value={range} onValueChange={setRange}>
  <RangeCalendar.Header>
    <RangeCalendar.PrevButton />
    <RangeCalendar.Title />
    <RangeCalendar.NextButton />
  </RangeCalendar.Header>
  <RangeCalendar.Grid>
    <RangeCalendar.GridHead />
    <RangeCalendar.GridBody />
  </RangeCalendar.Grid>
</RangeCalendar.Root>`,
  vue: `import { useSelection } from '@thaparoyal/calendar-vue';

const { weeks, title, weekdayNames, value, select, hover,
  isPrevMonthDisabled, isNextMonthDisabled, nextMonth, prevMonth,
} = useSelection({ mode: 'range', config: { calendarType: 'BS' } });

// In template: add @mouseenter="hover(day.date)" @mouseleave="hover(null)"
// on each day cell, and use range CSS classes:
// day.isRangeStart  → trc-calendar-cell-range-start
// day.isRangeEnd    → trc-calendar-cell-range-end
// day.isInRange     → trc-calendar-cell-range-middle
// day.isRangeHover  → trc-calendar-cell-range-hover`,
  svelte: `import { createSelection } from '@thaparoyal/calendar-svelte';

const { weeks, title, weekdayNames, value, select, hover,
  isPrevMonthDisabled, isNextMonthDisabled, nextMonth, prevMonth,
} = createSelection({ mode: 'range', config: { calendarType: 'BS' } });

<!-- Add on:mouseenter={() => hover(day.date)} on:mouseleave={() => hover(null)} -->
<!-- Use range CSS classes on day cells -->`,
  angular: `import { SelectionService } from '@thaparoyal/calendar-angular';

@Component({
  providers: [SelectionService],
  template: \`
    <table class="trc-calendar-grid">
      <tbody>
        <tr *ngFor="let week of sel.weeks$ | async">
          <td
            *ngFor="let day of week"
            class="trc-calendar-cell"
            [class.trc-calendar-cell-range-start]="day.isRangeStart"
            [class.trc-calendar-cell-range-end]="day.isRangeEnd"
            [class.trc-calendar-cell-range-middle]="day.isInRange"
          >
            <button
              class="trc-calendar-day"
              (click)="sel.select(day.date)"
              (mouseenter)="sel.hover(day.date)"
            >
              {{ sel.formatDayNumber(day.date.day) }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  \`,
})
export class RangeComponent implements OnInit {
  constructor(public sel: SelectionService) {}

  ngOnInit() {
    this.sel.initialize({ mode: 'range', config: { calendarType: 'BS', locale: 'en' } });
  }
}`,
  vanilla: `render('#range-cal', {
  config: { calendarType: 'BS' },
  selectionMode: 'range',
  theme: 'dark',
  onValueChange: (val) => {
    console.log('Range:', val?.start, '→', val?.end);
  },
});`,
};

const CODE_PICKER: Record<Framework, string> = {
  react: `import { DatePicker, type CalendarDate } from '@thaparoyal/calendar-react';

const [date, setDate] = useState<CalendarDate | null>(null);

<DatePicker.Root config={config} value={date} onValueChange={setDate}>
  <DatePicker.Input placeholder="Select a date..." />
  <DatePicker.ClearButton />
  <DatePicker.Trigger />
  <DatePicker.Content>
    <DatePicker.Calendar />
  </DatePicker.Content>
</DatePicker.Root>`,
  vue: `import { useDatePicker } from '@thaparoyal/calendar-vue';
import { ref, onMounted, onUnmounted } from 'vue';

const picker = useDatePicker({
  config: { calendarType: 'BS' },
  format: 'YYYY-MM-DD',
});

// Use picker.isOpen, picker.inputValue, picker.weeks, etc.
// Handle outside click:
function onClickOutside(e) {
  if (!el.value?.contains(e.target)) picker.actions.close();
}
onMounted(() => document.addEventListener('mousedown', onClickOutside));
onUnmounted(() => document.removeEventListener('mousedown', onClickOutside));`,
  svelte: `import { createDatePicker } from '@thaparoyal/calendar-svelte';
import { onMount } from 'svelte';

const dp = createDatePicker({
  config: { calendarType: 'BS' },
  format: 'YYYY-MM-DD',
});

// Use $dp.isOpen, $dp.inputValue, $dp.weeks, etc.
// dp.open(), dp.close(), dp.selectDate(date), dp.toggle()`,
  angular: `import { DatePickerService } from '@thaparoyal/calendar-angular';

@Component({
  providers: [DatePickerService],
  template: \`
    <div class="trc-date-picker">
      <input
        class="trc-date-picker-input"
        [value]="picker.inputValue$ | async"
        (input)="picker.onInputChange($any($event.target).value)"
        (blur)="picker.onInputBlur()"
      />
      <button class="trc-date-picker-trigger" (click)="picker.toggle()">Toggle</button>

      <div *ngIf="picker.isOpen$ | async" class="trc-date-picker-content">
        <table class="trc-calendar-grid">
          <tbody>
            <tr *ngFor="let week of picker.weeks$ | async">
              <td *ngFor="let day of week">
                <button class="trc-calendar-day" (click)="picker.selectDate(day.date)">
                  {{ picker.formatDayNumber(day.date.day) }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  \`,
})
export class PickerComponent implements OnInit {
  constructor(public picker: DatePickerService) {}

  ngOnInit() {
    this.picker.initialize({ config: { calendarType: 'BS', locale: 'en' } });
  }
}`,
  vanilla: `// Vanilla JS does not have a built-in DatePicker popup.
// Use the Calendar class for the calendar portion:
import { Calendar } from '@thaparoyal/calendar-vanilla';

const cal = new Calendar('#cal-container', {
  config: { calendarType: 'BS' },
  selectionMode: 'single',
  onValueChange: (date) => {
    document.querySelector('#input').value =
      date ? \`\${date.year}-\${date.month}-\${date.day}\` : '';
  },
});`,
};

const CODE_MULTI: Record<Framework, string> = {
  react: `import { MultiCalendar, type DateRangeValue } from '@thaparoyal/calendar-react';

const [range, setRange] = useState<DateRangeValue | null>(null);

<MultiCalendar.Root numberOfMonths={2} mode="range" config={config}
  value={range} onValueChange={(v) => setRange(v as DateRangeValue | null)}>
  <MultiCalendar.Header>
    <MultiCalendar.PrevButton />
    <MultiCalendar.Title />
    <MultiCalendar.NextButton />
  </MultiCalendar.Header>
  <MultiCalendar.Calendars showMonthTitles />
</MultiCalendar.Root>`,
  vue: `import { useMultiCalendar } from '@thaparoyal/calendar-vue';

const { months, weekdayNames, value, actions, isPrevDisabled, isNextDisabled,
  formatDayNumber,
} = useMultiCalendar({
  numberOfMonths: 2,
  mode: 'range',
  config: { calendarType: 'BS' },
});

// months.value is an array of { year, month, title, weeks }
// Render each month's grid side-by-side in a flex container`,
  svelte: `import { createMultiCalendar } from '@thaparoyal/calendar-svelte';

const mc = createMultiCalendar({
  numberOfMonths: 2,
  mode: 'range',
  config: { calendarType: 'BS' },
});

// $mc.months is an array of { year, month, title, weeks }
// Render each month's grid side-by-side`,
  angular: `import { MultiCalendarService } from '@thaparoyal/calendar-angular';

@Component({
  providers: [MultiCalendarService],
  template: \`
    <div style="display:flex;gap:1rem;flex-wrap:wrap;">
      <div *ngFor="let month of calendar.months$ | async" class="trc-calendar">
        <h3>{{ month.title }}</h3>
        <table class="trc-calendar-grid">
          <tbody>
            <tr *ngFor="let week of month.weeks">
              <td *ngFor="let day of week">
                <button
                  class="trc-calendar-day"
                  (click)="calendar.select(day.date)"
                  (mouseenter)="calendar.hover(day.date)"
                >
                  {{ calendar.formatDayNumber(day.date.day) }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  \`,
})
export class MultiComponent implements OnInit {
  constructor(public calendar: MultiCalendarService) {}

  ngOnInit() {
    this.calendar.initialize({
      numberOfMonths: 2,
      mode: 'range',
      config: { calendarType: 'BS', locale: 'en' },
    });
  }
}`,
  vanilla: `render('#multi-cal', {
  config: { calendarType: 'BS' },
  selectionMode: 'range',
  theme: 'dark',
  // Vanilla JS renders a single calendar.
  // For multi-month, render multiple calendars and sync navigation.
  onValueChange: (val) => console.log(val),
});`,
};

/* ─── CodeTabs Component ─── */

function CodeTabs({ snippets }: { snippets: Record<Framework, string> }) {
  const [active, setActive] = useState<Framework>('react');
  const [open, setOpen] = useState(false);

  const tabs: { key: Framework; label: string; color: string }[] = [
    { key: 'react', label: 'React', color: '#667eea' },
    { key: 'vue', label: 'Vue', color: '#42b883' },
    { key: 'svelte', label: 'Svelte', color: '#ff3e00' },
    { key: 'angular', label: 'Angular', color: '#dd0031' },
    { key: 'vanilla', label: 'Vanilla', color: '#f7df1e' },
  ];

  return (
    <div style={{ marginTop: '0.5rem' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          background: 'none', border: 'none', color: '#667eea', cursor: 'pointer',
          fontSize: '0.75rem', fontWeight: 500, padding: 0, display: 'flex',
          alignItems: 'center', gap: 4,
        }}
      >
        <span style={{ transform: open ? 'rotate(90deg)' : 'none', transition: 'transform 0.15s', display: 'inline-block' }}>
          ▶
        </span>
        {open ? 'Hide code' : 'Show code'}
      </button>
      {open && (
        <div style={{ marginTop: '0.5rem', borderRadius: 8, overflow: 'hidden', border: '1px solid #1e1e2e' }}>
          <div style={{ display: 'flex', gap: 0, background: '#0a0a0f', borderBottom: '1px solid #1e1e2e' }}>
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setActive(t.key)}
                style={{
                  padding: '0.4rem 0.9rem', border: 'none', cursor: 'pointer',
                  fontSize: '0.72rem', fontWeight: 600,
                  background: active === t.key ? '#16161e' : 'transparent',
                  color: active === t.key ? t.color : '#555',
                  borderBottom: active === t.key ? `2px solid ${t.color}` : '2px solid transparent',
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
          <pre style={{
            margin: 0, padding: '1rem', background: '#0d0d14', overflow: 'auto',
            fontSize: '0.78rem', lineHeight: 1.55, color: '#ccc', maxHeight: 400,
          }}>
            <code>{snippets[active]}</code>
          </pre>
        </div>
      )}
    </div>
  );
}

/* ─── Main Playground ─── */

const BASE = import.meta.env.BASE_URL || '';

export function Playground() {
  const [theme, setTheme] = useState<Theme>('dark');
  const [calendarType, setCalendarType] = useState<'BS' | 'AD'>('BS');
  const [locale, setLocale] = useState<'en' | 'ne'>('en');
  const [singleDate, setSingleDate] = useState<CalendarDate | null>(null);
  const [rangeValue, setRangeValue] = useState<DateRangeValue | null>(null);
  const [multiRangeValue, setMultiRangeValue] = useState<DateRangeValue | null>(null);
  const [pickerDate, setPickerDate] = useState<CalendarDate | null>(null);

  const config = { calendarType, locale } as const;
  const configKey = `${calendarType}-${locale}`;

  useEffect(() => {
    setSingleDate(null);
    setRangeValue(null);
    setMultiRangeValue(null);
    setPickerDate(null);
  }, [configKey]);

  return (
    <div style={{ padding: '2rem', maxWidth: 1400, margin: '0 auto' }}>
      <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.25rem', color: '#fff' }}>
        Interactive Playground
      </h2>
      <p style={{ color: '#888', marginBottom: '2rem', fontSize: '0.95rem' }}>
        Live demos powered by <code style={{ background: '#1a1a2e', padding: '0.15rem 0.4rem', borderRadius: 4, color: '#818cf8' }}>Patro</code> — toggle code tabs to see React, Vue, Svelte, Angular, and Vanilla JS examples
      </p>

      {/* Settings Bar */}
      <div style={{
        background: '#111118', border: '1px solid #1e1e2e', borderRadius: 12,
        padding: '1.25rem 1.5rem', marginBottom: '2rem',
        display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'flex-start',
      }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#888', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Calendar Type
          </label>
          <div style={{ display: 'flex', gap: 4 }}>
            {(['BS', 'AD'] as const).map((t) => (
              <button key={t} onClick={() => setCalendarType(t)} style={{
                padding: '0.4rem 1rem', borderRadius: 6, border: '1px solid',
                borderColor: calendarType === t ? '#667eea' : '#2a2a3a',
                background: calendarType === t ? '#667eea' : '#16161e',
                color: calendarType === t ? '#fff' : '#888',
                cursor: 'pointer', fontSize: '0.8rem', fontWeight: 500,
              }}>{t}</button>
            ))}
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#888', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Locale
          </label>
          <div style={{ display: 'flex', gap: 4 }}>
            {([['en', 'English'], ['ne', 'नेपाली']] as const).map(([l, label]) => (
              <button key={l} onClick={() => setLocale(l as 'en' | 'ne')} style={{
                padding: '0.4rem 1rem', borderRadius: 6, border: '1px solid',
                borderColor: locale === l ? '#667eea' : '#2a2a3a',
                background: locale === l ? '#667eea' : '#16161e',
                color: locale === l ? '#fff' : '#888',
                cursor: 'pointer', fontSize: '0.8rem', fontWeight: 500,
              }}>{label}</button>
            ))}
          </div>
        </div>

        <div style={{ flex: 1, minWidth: 200 }}>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#888', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Theme
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {THEMES.map((t) => (
              <button key={t} onClick={() => setTheme(t)} style={{
                padding: '0.3rem 0.65rem', borderRadius: 4, border: '1px solid',
                borderColor: theme === t ? '#667eea' : '#2a2a3a',
                background: theme === t ? '#667eea' : '#16161e',
                color: theme === t ? '#fff' : '#666',
                cursor: 'pointer', fontSize: '0.7rem', fontWeight: 500,
              }}>{t}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
        gap: '1.25rem',
      }}>
        {/* 1. Single Selection with Month/Year Pickers */}
        <Card title="Single Selection" desc="Click title to switch between day / month / year views">
          <div data-theme={theme}>
            <Calendar.Root
              key={`single-${configKey}`}
              config={config}
              value={singleDate}
              onValueChange={setSingleDate}
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
              <Calendar.MonthPicker />
              <Calendar.YearPicker />
            </Calendar.Root>
          </div>
          <ValueDisplay label="Selected" value={fmtDate(singleDate)} />
          <CodeTabs snippets={CODE_SINGLE} />
        </Card>

        {/* 2. With Dropdowns */}
        <Card title="Month & Year Dropdowns" desc="Quick navigation via dropdown selects">
          <div data-theme={theme}>
            <Calendar.Root key={`dropdown-${configKey}`} config={config}>
              <Calendar.Header>
                <Calendar.PrevButton />
                <Calendar.MonthDropdown />
                <Calendar.YearDropdown />
                <Calendar.NextButton />
              </Calendar.Header>
              <Calendar.Grid>
                <Calendar.GridHead />
                <Calendar.GridBody />
              </Calendar.Grid>
            </Calendar.Root>
          </div>
          <CodeTabs snippets={CODE_DROPDOWN} />
        </Card>

        {/* 3. Range Selection */}
        <Card title="Range Selection" desc="Click start date, hover to preview, click end date">
          <div data-theme={theme}>
            <RangeCalendar.Root
              key={`range-${configKey}`}
              config={config}
              value={rangeValue}
              onValueChange={setRangeValue}
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
          </div>
          <ValueDisplay label="Range" value={`${fmtDate(rangeValue?.start)} → ${fmtDate(rangeValue?.end)}`} />
          <CodeTabs snippets={CODE_RANGE} />
        </Card>

        {/* 4. DatePicker */}
        <Card title="Date Picker" desc="Input field with calendar dropdown popup">
          <div data-theme={theme}>
            <DatePicker.Root
              key={`picker-${configKey}`}
              config={config}
              value={pickerDate}
              onValueChange={setPickerDate}
            >
              <DatePicker.Input placeholder="Select a date..." />
              <DatePicker.ClearButton />
              <DatePicker.Trigger />
              <DatePicker.Content>
                <DatePicker.Calendar />
              </DatePicker.Content>
            </DatePicker.Root>
          </div>
          <ValueDisplay label="Selected" value={fmtDate(pickerDate)} />
          <CodeTabs snippets={CODE_PICKER} />
        </Card>

        {/* 5. Multi-Calendar Range — full width */}
        <div style={{
          gridColumn: '1 / -1',
          background: '#111118', border: '1px solid #1e1e2e', borderRadius: 12,
          padding: '1.5rem',
        }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#fff', margin: 0 }}>
            Multi-Calendar Range Selection
          </h3>
          <p style={{ fontSize: '0.8rem', color: '#666', margin: '0.25rem 0 1rem' }}>
            Two months side-by-side — select a date range across months (like booking.com)
          </p>
          <div data-theme={theme}>
            <MultiCalendar.Root
              key={`multi-${configKey}`}
              numberOfMonths={2}
              mode="range"
              config={config}
              value={multiRangeValue}
              onValueChange={(val: CalendarDate | CalendarDate[] | DateRangeValue | null) =>
                setMultiRangeValue(val as DateRangeValue | null)
              }
            >
              <MultiCalendar.Header>
                <MultiCalendar.PrevButton />
                <MultiCalendar.Title />
                <MultiCalendar.NextButton />
              </MultiCalendar.Header>
              <MultiCalendar.Calendars showMonthTitles />
            </MultiCalendar.Root>
          </div>
          <ValueDisplay label="Range" value={`${fmtDate(multiRangeValue?.start)} → ${fmtDate(multiRangeValue?.end)}`} />
          <CodeTabs snippets={CODE_MULTI} />
        </div>
      </div>

      {/* Framework links */}
      <div style={{
        marginTop: '2.5rem', padding: '1.5rem', background: '#111118',
        border: '1px solid #1e1e2e', borderRadius: 12,
      }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#fff', margin: '0 0 0.75rem' }}>
          Framework Documentation
        </h3>
        <p style={{ fontSize: '0.85rem', color: '#888', margin: '0 0 1rem' }}>
          Comprehensive guides with full API references and examples for each framework:
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          {[
            { label: 'React', href: `${BASE}/react/quick-start/`, color: '#667eea' },
            { label: 'Vue', href: `${BASE}/vue/guide/`, color: '#42b883' },
            { label: 'Svelte', href: `${BASE}/svelte/guide/`, color: '#ff3e00' },
            { label: 'Angular', href: `${BASE}/angular/quick-start/`, color: '#dd0031' },
            { label: 'Vanilla JS', href: `${BASE}/vanilla/getting-started/`, color: '#f7df1e' },
          ].map((fw) => (
            <a
              key={fw.label}
              href={fw.href}
              style={{
                padding: '0.6rem 1.25rem', borderRadius: 8,
                background: '#16161e', border: `1px solid ${fw.color}40`,
                color: fw.color, textDecoration: 'none', fontWeight: 600,
                fontSize: '0.85rem', transition: 'all 0.15s',
              }}
            >
              {fw.label} Guide →
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

function Card({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: '#111118', border: '1px solid #1e1e2e', borderRadius: 12,
      padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem',
    }}>
      <div>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#fff', margin: 0 }}>{title}</h3>
        <p style={{ fontSize: '0.8rem', color: '#666', margin: '0.25rem 0 0' }}>{desc}</p>
      </div>
      {children}
    </div>
  );
}

function ValueDisplay({ label, value }: { label: string; value: string }) {
  return (
    <div style={{
      fontSize: '0.8rem', color: '#888', background: '#0d0d14',
      border: '1px solid #1a1a2e', borderRadius: 6, padding: '0.5rem 0.75rem',
      fontFamily: 'monospace',
    }}>
      <span style={{ color: '#555' }}>{label}:</span> {value}
    </div>
  );
}

export default Playground;
