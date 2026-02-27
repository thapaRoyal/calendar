<script setup lang="ts">
import { computed, ref } from 'vue';
import { useCalendar } from '@thaparoyal/calendar-vue';
import { adToBs } from '@thaparoyal/calendar-core';
import type { CalendarDate, MonthPickerItem, YearPickerItem } from '@thaparoyal/calendar-core';

const THEMES = [
  'default', 'dark', 'ocean', 'ocean-dark', 'forest', 'forest-dark',
  'sunset', 'sunset-dark', 'royal', 'royal-dark', 'nepal', 'nepal-dark',
  'lavender', 'midnight', 'rose', 'mint', 'amber', 'slate', 'coral', 'indigo',
];

const calendarType = ref<'BS' | 'AD'>('BS');
const locale = ref<'en' | 'ne'>('en');
const theme = ref('dark');

const configObj = computed(() => ({
  calendarType: calendarType.value,
  locale: locale.value,
}));

// Single selection calendar
const single = useCalendar({ config: { calendarType: 'BS', locale: 'en' } });
const selectedSingle = ref<CalendarDate | null>(null);

// Dropdown calendar
const dropdown = useCalendar({ config: { calendarType: 'BS', locale: 'en' } });

// Range selection calendar (using two calendars for start/end)
const range = useCalendar({ config: { calendarType: 'BS', locale: 'en' } });
const rangeStart = ref<CalendarDate | null>(null);
const rangeEnd = ref<CalendarDate | null>(null);
const rangePicking = ref<'start' | 'end'>('start');

// Update configs when settings change
function updateConfigs() {
  const cfg = configObj.value;
  // Reinitialize calendars - we use actions to update state
  // Since useCalendar doesn't have updateConfig, we'll use fresh instances
}

function format(date: CalendarDate | null | undefined): string {
  if (!date) return '—';
  return `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')} (${date.calendarType})`;
}

function selectSingleDate(date: CalendarDate) {
  selectedSingle.value = date;
  single.actions.selectDate(date);
}

function selectRangeDate(date: CalendarDate) {
  if (rangePicking.value === 'start') {
    rangeStart.value = date;
    rangeEnd.value = null;
    rangePicking.value = 'end';
  } else {
    rangeEnd.value = date;
    rangePicking.value = 'start';
  }
  range.actions.selectDate(date);
}

function selectMonth(cal: typeof single, item: MonthPickerItem) {
  if (item.disabled) return;
  cal.actions.focusDate({
    year: cal.state.value.focusedDate.year,
    month: item.month,
    day: 1,
    calendarType: cal.state.value.config.calendarType,
  });
  cal.actions.setViewMode('day');
}

function selectYear(cal: typeof single, item: YearPickerItem) {
  if (item.disabled) return;
  cal.actions.focusDate({
    year: item.year,
    month: cal.state.value.focusedDate.month,
    day: 1,
    calendarType: cal.state.value.config.calendarType,
  });
  cal.actions.setViewMode('month');
}

function handlePrev(cal: typeof single) {
  if (cal.viewMode.value === 'day') cal.actions.prevMonth();
  else if (cal.viewMode.value === 'month') cal.actions.prevYear();
  else cal.actions.prevYear();
}

function handleNext(cal: typeof single) {
  if (cal.viewMode.value === 'day') cal.actions.nextMonth();
  else if (cal.viewMode.value === 'month') cal.actions.nextYear();
  else cal.actions.nextYear();
}

// AD to BS converter
const adInput = ref('2024-01-15');
const convertedBs = computed(() => {
  const [year, month, day] = adInput.value.split('-').map(Number);
  if (!year || !month || !day) return null;
  try {
    return adToBs(new Date(year, month - 1, day));
  } catch {
    return null;
  }
});
</script>

<template>
  <div class="vp-root">
    <div class="vp-header">
      <div>
        <h2 class="vp-title">Vue Playground</h2>
        <p class="vp-desc">Interactive demo of <code class="vp-code">@thaparoyal/calendar-vue</code> composables</p>
      </div>
      <span class="vp-badge">Vue 3</span>
    </div>

    <!-- Settings Bar -->
    <div class="vp-settings">
      <div class="vp-setting">
        <label class="vp-setting-label">Calendar Type</label>
        <div class="vp-btn-group">
          <button
            v-for="t in (['BS', 'AD'] as const)"
            :key="t"
            :class="['vp-btn', calendarType === t && 'vp-btn-active']"
            @click="calendarType = t"
          >{{ t }}</button>
        </div>
      </div>
      <div class="vp-setting">
        <label class="vp-setting-label">Locale</label>
        <div class="vp-btn-group">
          <button :class="['vp-btn', locale === 'en' && 'vp-btn-active']" @click="locale = 'en'">English</button>
          <button :class="['vp-btn', locale === 'ne' && 'vp-btn-active']" @click="locale = 'ne'">नेपाली</button>
        </div>
      </div>
      <div class="vp-setting vp-setting-wide">
        <label class="vp-setting-label">Theme</label>
        <div class="vp-btn-group vp-btn-group-wrap">
          <button
            v-for="t in THEMES"
            :key="t"
            :class="['vp-btn vp-btn-sm', theme === t && 'vp-btn-active']"
            @click="theme = t"
          >{{ t }}</button>
        </div>
      </div>
    </div>

    <!-- Calendar Grid -->
    <div class="vp-grid">
      <!-- 1. Single Selection with Month/Year Picker -->
      <div class="vp-card">
        <h3 class="vp-card-title">Single Selection</h3>
        <p class="vp-card-desc">Click title to switch: day → month → year</p>
        <div :data-theme="theme" class="vp-cal-wrap">
          <!-- Day View -->
          <template v-if="single.viewMode.value === 'day'">
            <div class="vp-cal-header">
              <button class="vp-nav-btn" @click="handlePrev(single)">‹</button>
              <button class="vp-title-btn" @click="single.actions.setViewMode('month')">{{ single.title.value }}</button>
              <button class="vp-nav-btn" @click="handleNext(single)">›</button>
            </div>
            <table class="vp-cal-grid">
              <thead>
                <tr>
                  <th v-for="d in single.weekdayNames.value" :key="d">{{ d }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(week, wi) in single.weeks.value" :key="wi">
                  <td
                    v-for="(day, di) in week"
                    :key="`${wi}-${di}`"
                    :class="{
                      'vp-cell-outside': day.isOutsideMonth,
                      'vp-cell-selected': day.isSelected,
                      'vp-cell-today': day.isToday,
                    }"
                  >
                    <button
                      class="vp-day-btn"
                      :disabled="day.isDisabled"
                      @click="() => !day.isDisabled && selectSingleDate(day.date)"
                    >{{ single.formatDayNumber(day.date.day) }}</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </template>

          <!-- Month Picker -->
          <template v-if="single.viewMode.value === 'month'">
            <div class="vp-cal-header">
              <button class="vp-nav-btn" @click="single.actions.prevYear()">‹</button>
              <button class="vp-title-btn" @click="single.actions.setViewMode('year')">
                {{ single.state.value.focusedDate.year }}
              </button>
              <button class="vp-nav-btn" @click="single.actions.nextYear()">›</button>
            </div>
            <div class="vp-picker-grid">
              <button
                v-for="item in single.monthPickerItems.value"
                :key="item.month"
                :class="['vp-picker-cell', item.isCurrentMonth && 'vp-picker-active', item.disabled && 'vp-picker-disabled']"
                :disabled="item.disabled"
                @click="selectMonth(single, item)"
              >{{ item.shortName }}</button>
            </div>
          </template>

          <!-- Year Picker -->
          <template v-if="single.viewMode.value === 'year'">
            <div class="vp-cal-header">
              <button class="vp-nav-btn" @click="single.actions.prevYear()">‹</button>
              <button class="vp-title-btn" @click="single.actions.setViewMode('day')">
                {{ single.decadeRange.value.start }} - {{ single.decadeRange.value.end }}
              </button>
              <button class="vp-nav-btn" @click="single.actions.nextYear()">›</button>
            </div>
            <div class="vp-picker-grid">
              <button
                v-for="item in single.yearPickerItems.value"
                :key="item.year"
                :class="['vp-picker-cell', item.isCurrentYear && 'vp-picker-active', item.disabled && 'vp-picker-disabled']"
                :disabled="item.disabled"
                @click="selectYear(single, item)"
              >{{ item.year }}</button>
            </div>
          </template>
        </div>
        <div class="vp-value">Selected: {{ format(selectedSingle) }}</div>
      </div>

      <!-- 2. Dropdown Navigation -->
      <div class="vp-card">
        <h3 class="vp-card-title">Month &amp; Year Dropdowns</h3>
        <p class="vp-card-desc">Quick navigation via dropdown selects</p>
        <div :data-theme="theme" class="vp-cal-wrap">
          <div class="vp-cal-header">
            <button class="vp-nav-btn" @click="dropdown.actions.prevMonth()">‹</button>
            <select
              class="vp-select"
              :value="dropdown.state.value.focusedDate.month"
              @change="(e: Event) => {
                const m = Number((e.target as HTMLSelectElement).value);
                dropdown.actions.focusDate({
                  ...dropdown.state.value.focusedDate,
                  month: m,
                  day: 1,
                });
              }"
            >
              <option v-for="item in dropdown.monthPickerItems.value" :key="item.month" :value="item.month">
                {{ item.shortName }}
              </option>
            </select>
            <select
              class="vp-select"
              :value="dropdown.state.value.focusedDate.year"
              @change="(e: Event) => {
                const y = Number((e.target as HTMLSelectElement).value);
                dropdown.actions.focusDate({
                  ...dropdown.state.value.focusedDate,
                  year: y,
                  day: 1,
                });
              }"
            >
              <option v-for="item in dropdown.yearPickerItems.value" :key="item.year" :value="item.year">
                {{ item.year }}
              </option>
            </select>
            <button class="vp-nav-btn" @click="dropdown.actions.nextMonth()">›</button>
          </div>
          <table class="vp-cal-grid">
            <thead>
              <tr>
                <th v-for="d in dropdown.weekdayNames.value" :key="d">{{ d }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(week, wi) in dropdown.weeks.value" :key="wi">
                <td
                  v-for="(day, di) in week"
                  :key="`${wi}-${di}`"
                  :class="{
                    'vp-cell-outside': day.isOutsideMonth,
                    'vp-cell-selected': day.isSelected,
                    'vp-cell-today': day.isToday,
                  }"
                >
                  <button
                    class="vp-day-btn"
                    :disabled="day.isDisabled"
                    @click="() => !day.isDisabled && dropdown.actions.selectDate(day.date)"
                  >{{ dropdown.formatDayNumber(day.date.day) }}</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 3. Range Selection -->
      <div class="vp-card">
        <h3 class="vp-card-title">Range Selection</h3>
        <p class="vp-card-desc">Click start date, then click end date</p>
        <div :data-theme="theme" class="vp-cal-wrap">
          <div class="vp-cal-header">
            <button class="vp-nav-btn" @click="range.actions.prevMonth()">‹</button>
            <button class="vp-title-btn" @click="range.actions.setViewMode(range.viewMode.value === 'day' ? 'month' : 'day')">
              {{ range.title.value }}
            </button>
            <button class="vp-nav-btn" @click="range.actions.nextMonth()">›</button>
          </div>

          <template v-if="range.viewMode.value === 'day'">
            <table class="vp-cal-grid">
              <thead>
                <tr>
                  <th v-for="d in range.weekdayNames.value" :key="d">{{ d }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(week, wi) in range.weeks.value" :key="wi">
                  <td
                    v-for="(day, di) in week"
                    :key="`${wi}-${di}`"
                    :class="{
                      'vp-cell-outside': day.isOutsideMonth,
                      'vp-cell-today': day.isToday,
                      'vp-cell-selected': (rangeStart && day.date.year === rangeStart.year && day.date.month === rangeStart.month && day.date.day === rangeStart.day) || (rangeEnd && day.date.year === rangeEnd.year && day.date.month === rangeEnd.month && day.date.day === rangeEnd.day),
                    }"
                  >
                    <button
                      class="vp-day-btn"
                      :disabled="day.isDisabled"
                      @click="() => !day.isDisabled && selectRangeDate(day.date)"
                    >{{ range.formatDayNumber(day.date.day) }}</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </template>

          <template v-if="range.viewMode.value === 'month'">
            <div class="vp-picker-grid">
              <button
                v-for="item in range.monthPickerItems.value"
                :key="item.month"
                :class="['vp-picker-cell', item.isCurrentMonth && 'vp-picker-active']"
                :disabled="item.disabled"
                @click="selectMonth(range, item)"
              >{{ item.shortName }}</button>
            </div>
          </template>
        </div>
        <div class="vp-value">Range: {{ format(rangeStart) }} → {{ format(rangeEnd) }}</div>
      </div>

      <!-- 4. DatePicker Input -->
      <div class="vp-card">
        <h3 class="vp-card-title">Date Picker (Input)</h3>
        <p class="vp-card-desc">Uses @thaparoyal/calendar-core for AD↔BS</p>
        <div :data-theme="theme" class="vp-cal-wrap">
          <div class="vp-converter-row">
            <input v-model="adInput" type="date" class="vp-input" />
            <span class="vp-arrow">→</span>
            <output class="vp-output">{{ convertedBs ? format(convertedBs) : 'Invalid date' }}</output>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.vp-root {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.vp-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.vp-title {
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0;
  color: #fff;
}

.vp-desc {
  color: #888;
  margin: 0.25rem 0 0;
  font-size: 0.95rem;
}

.vp-code {
  background: #1a1a2e;
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
  color: #42b883;
  font-size: 0.85rem;
}

.vp-badge {
  border: 1px solid #42b883;
  color: #42b883;
  border-radius: 999px;
  padding: 0.25rem 0.75rem;
  font-size: 0.85rem;
  white-space: nowrap;
}

/* Settings Bar */
.vp-settings {
  background: #111118;
  border: 1px solid #1e1e2e;
  border-radius: 12px;
  padding: 1.25rem 1.5rem;
  margin-bottom: 2rem;
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  align-items: flex-start;
}

.vp-setting-label {
  display: block;
  font-size: 0.75rem;
  font-weight: 600;
  color: #888;
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.vp-setting-wide {
  flex: 1;
  min-width: 200px;
}

.vp-btn-group {
  display: flex;
  gap: 4px;
}

.vp-btn-group-wrap {
  flex-wrap: wrap;
}

.vp-btn {
  padding: 0.4rem 1rem;
  border-radius: 6px;
  border: 1px solid #2a2a3a;
  background: #16161e;
  color: #888;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 500;
}

.vp-btn-sm {
  padding: 0.3rem 0.65rem;
  font-size: 0.7rem;
}

.vp-btn-active {
  border-color: #42b883;
  background: #42b883;
  color: #fff;
}

/* Grid */
.vp-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 1.25rem;
}

/* Cards */
.vp-card {
  background: #111118;
  border: 1px solid #1e1e2e;
  border-radius: 12px;
  padding: 1.5rem;
}

.vp-card-title {
  font-size: 1rem;
  font-weight: 600;
  color: #fff;
  margin: 0;
}

.vp-card-desc {
  font-size: 0.8rem;
  color: #666;
  margin: 0.25rem 0 0.75rem;
}

/* Calendar */
.vp-cal-wrap {
  border: 1px solid #2a2a3a;
  border-radius: 10px;
  padding: 1rem;
  background: #0d0d14;
}

.vp-cal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  gap: 0.5rem;
}

.vp-nav-btn {
  width: 2rem;
  height: 2rem;
  border-radius: 6px;
  border: 1px solid #333;
  background: #16161e;
  color: #fff;
  cursor: pointer;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.vp-nav-btn:hover {
  border-color: #42b883;
}

.vp-title-btn {
  flex: 1;
  text-align: center;
  background: transparent;
  border: none;
  color: #fff;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  padding: 0.4rem;
  border-radius: 6px;
}

.vp-title-btn:hover {
  background: #1e1e2e;
}

/* Day grid */
.vp-cal-grid {
  width: 100%;
  border-collapse: collapse;
}

.vp-cal-grid th {
  color: #666;
  font-size: 0.75rem;
  font-weight: 600;
  padding-bottom: 0.5rem;
  text-align: center;
}

.vp-cal-grid td {
  text-align: center;
  padding: 2px;
}

.vp-day-btn {
  width: 2.25rem;
  height: 2.25rem;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: #ddd;
  cursor: pointer;
  font-size: 0.85rem;
}

.vp-day-btn:hover:not(:disabled) {
  background: rgba(66, 184, 131, 0.15);
}

.vp-cell-today .vp-day-btn {
  background: rgba(66, 184, 131, 0.2);
  font-weight: 700;
}

.vp-cell-selected .vp-day-btn {
  background: #42b883;
  color: #08110d;
  font-weight: 700;
}

.vp-cell-outside .vp-day-btn {
  opacity: 0.3;
}

/* Picker grid (month/year) */
.vp-picker-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
}

.vp-picker-cell {
  padding: 0.6rem 0.5rem;
  border-radius: 8px;
  border: 1px solid #2a2a3a;
  background: #16161e;
  color: #ccc;
  cursor: pointer;
  font-size: 0.85rem;
  text-align: center;
}

.vp-picker-cell:hover:not(:disabled) {
  border-color: #42b883;
  background: rgba(66, 184, 131, 0.1);
}

.vp-picker-active {
  background: #42b883 !important;
  color: #08110d !important;
  border-color: #42b883 !important;
  font-weight: 600;
}

.vp-picker-disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

/* Dropdown select */
.vp-select {
  flex: 1;
  padding: 0.4rem 0.5rem;
  border-radius: 6px;
  border: 1px solid #333;
  background: #16161e;
  color: #fff;
  font-size: 0.85rem;
  cursor: pointer;
}

/* Value display */
.vp-value {
  font-size: 0.8rem;
  color: #888;
  background: #0a0a0f;
  border: 1px solid #1a1a2e;
  border-radius: 6px;
  padding: 0.5rem 0.75rem;
  font-family: monospace;
  margin-top: 0.75rem;
}

/* Converter */
.vp-converter-row {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 0.75rem;
}

.vp-input,
.vp-output {
  width: 100%;
  border: 1px solid #333;
  border-radius: 8px;
  padding: 0.65rem 0.75rem;
  background: #16161e;
  color: #fff;
  font-size: 0.85rem;
}

.vp-output {
  display: block;
}

.vp-arrow {
  color: #42b883;
  font-size: 1.2rem;
}
</style>
