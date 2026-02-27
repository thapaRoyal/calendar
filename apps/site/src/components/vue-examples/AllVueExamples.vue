<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import {
  useCalendar,
  useSelection,
  useDatePicker,
  useMultiCalendar,
  type CalendarDate,
  type DateRangeValue,
} from '@thaparoyal/calendar-vue';
import '@thaparoyal/calendar-core/themes/themes.css';

// ---------------------------------------------------------------------------
// Shared
// ---------------------------------------------------------------------------

const THEMES = [
  'default', 'ocean', 'forest', 'sunset', 'lavender', 'midnight',
  'rose', 'mint', 'amber', 'slate', 'coral', 'indigo',
] as const;

function fmtDate(d: CalendarDate | null | undefined): string {
  if (!d) return 'None';
  return `${d.year}-${String(d.month).padStart(2, '0')}-${String(d.day).padStart(2, '0')} (${d.calendarType})`;
}

// ---------------------------------------------------------------------------
// 1. Single Select BS
// ---------------------------------------------------------------------------
const bsSelected = ref<CalendarDate | null>(null);
const bsCal = useCalendar({
  config: { calendarType: 'BS', locale: 'en' },
  modelValue: bsSelected,
});

// ---------------------------------------------------------------------------
// 2. Single Select AD
// ---------------------------------------------------------------------------
const adSelected = ref<CalendarDate | null>(null);
const adCal = useCalendar({
  config: { calendarType: 'AD', locale: 'en' },
  modelValue: adSelected,
});

// ---------------------------------------------------------------------------
// 3. Nepali Numerals
// ---------------------------------------------------------------------------
const nepaliSelected = ref<CalendarDate | null>(null);
const nepaliCal = useCalendar({
  config: { calendarType: 'BS', locale: 'ne' },
  modelValue: nepaliSelected,
});

// ---------------------------------------------------------------------------
// 4. Month Picker
// ---------------------------------------------------------------------------
const monthPickerCal = useCalendar({
  config: { calendarType: 'BS', locale: 'en' },
});

// ---------------------------------------------------------------------------
// 5. Year Picker
// ---------------------------------------------------------------------------
const yearPickerCal = useCalendar({
  config: { calendarType: 'BS', locale: 'en' },
});

// ---------------------------------------------------------------------------
// 6. Range Selection
// ---------------------------------------------------------------------------
const rangeSelection = useSelection({
  mode: 'range',
  config: { calendarType: 'BS', locale: 'en' },
});

const rangeValue = computed(() => {
  const v = rangeSelection.value.value;
  if (v && typeof v === 'object' && 'start' in v) return v as DateRangeValue;
  return null;
});

// ---------------------------------------------------------------------------
// 7. Multi-Date Selection
// ---------------------------------------------------------------------------
const multiDateSelection = useSelection({
  mode: 'multiple',
  config: { calendarType: 'BS', locale: 'en' },
});

const multiDateValue = computed(() => {
  const v = multiDateSelection.value.value;
  if (Array.isArray(v)) return v as CalendarDate[];
  return [];
});

// ---------------------------------------------------------------------------
// 8. Multi-Calendar 2 months
// ---------------------------------------------------------------------------
const mc2 = useMultiCalendar({
  numberOfMonths: 2,
  mode: 'single',
  config: { calendarType: 'BS', locale: 'en' },
});

const mc2Value = computed(() => {
  const v = mc2.value.value;
  if (v && !Array.isArray(v) && !('start' in v)) return v as CalendarDate;
  return null;
});

// ---------------------------------------------------------------------------
// 9. Multi-Calendar 3 months
// ---------------------------------------------------------------------------
const mc3 = useMultiCalendar({
  numberOfMonths: 3,
  mode: 'single',
  config: { calendarType: 'BS', locale: 'en' },
});

const mc3Value = computed(() => {
  const v = mc3.value.value;
  if (v && !Array.isArray(v) && !('start' in v)) return v as CalendarDate;
  return null;
});

// ---------------------------------------------------------------------------
// 10. Date Picker
// ---------------------------------------------------------------------------
const dpSelected = ref<CalendarDate | null>(null);
const dp = useDatePicker({
  config: { calendarType: 'BS', locale: 'en' },
  modelValue: dpSelected,
});

const dpRef = ref<HTMLElement | null>(null);
function handleClickOutside(e: MouseEvent) {
  if (dpRef.value && !dpRef.value.contains(e.target as Node) && dp.isOpen.value) {
    dp.actions.close();
  }
}
onMounted(() => document.addEventListener('click', handleClickOutside));
onUnmounted(() => document.removeEventListener('click', handleClickOutside));

// ---------------------------------------------------------------------------
// 11. Disabled Dates
// ---------------------------------------------------------------------------
const disabledSelected = ref<CalendarDate | null>(null);
const disabledDates: CalendarDate[] = [
  { year: 2082, month: 10, day: 5, calendarType: 'BS' },
  { year: 2082, month: 10, day: 10, calendarType: 'BS' },
  { year: 2082, month: 10, day: 15, calendarType: 'BS' },
  { year: 2082, month: 10, day: 20, calendarType: 'BS' },
  { year: 2082, month: 10, day: 25, calendarType: 'BS' },
];
const disabledCal = useCalendar({
  config: { calendarType: 'BS', locale: 'en' },
  defaultValue: { year: 2082, month: 10, day: 1, calendarType: 'BS' },
  modelValue: disabledSelected,
  disabledDates,
});

// ---------------------------------------------------------------------------
// 12. Min/Max Date Constraints
// ---------------------------------------------------------------------------
const minMaxSelected = ref<CalendarDate | null>(null);
const minMaxCal = useCalendar({
  config: {
    calendarType: 'BS',
    locale: 'en',
    minDate: { year: 2082, month: 10, day: 1, calendarType: 'BS' },
    maxDate: { year: 2082, month: 10, day: 28, calendarType: 'BS' },
  },
  defaultValue: { year: 2082, month: 10, day: 1, calendarType: 'BS' },
  modelValue: minMaxSelected,
});

// ---------------------------------------------------------------------------
// 13. Week Starts Monday
// ---------------------------------------------------------------------------
const mondayCal = useCalendar({
  config: { calendarType: 'BS', locale: 'en', weekStartsOn: 1 },
});

// ---------------------------------------------------------------------------
// 14. Themes Showcase
// ---------------------------------------------------------------------------
const themeCalendars = THEMES.map((theme) => ({
  theme,
  cal: useCalendar({ config: { calendarType: 'BS', locale: 'en' } }),
}));

// ---------------------------------------------------------------------------
// 15. Controlled Component
// ---------------------------------------------------------------------------
const controlledValue = ref<CalendarDate | null>(null);
const controlledCal = useCalendar({
  config: { calendarType: 'BS', locale: 'en' },
  modelValue: controlledValue,
});

function setControlled(year: number, month: number, day: number) {
  controlledValue.value = { year, month, day, calendarType: 'BS' };
  controlledCal.actions.focusDate({ year, month, day, calendarType: 'BS' });
}
</script>

<template>
  <div class="ave-page">
    <div class="ave-container">
      <h1 class="ave-heading">All Vue Examples</h1>
      <p class="ave-subheading">
        Comprehensive showcase of every feature in
        <code class="ave-code-inline">@thaparoyal/calendar-vue</code>.
        Each card demonstrates a distinct capability using headless composables.
      </p>

      <div class="ave-grid">

        <!-- 1. Single Select BS -->
        <div class="ave-card" data-theme="default">
          <h3 class="ave-card-title">1. Single Select (BS Calendar)</h3>
          <p class="ave-card-desc">Basic Bikram Sambat calendar with single date selection.</p>
          <div class="trc-calendar">
            <div class="trc-calendar-header">
              <button class="trc-calendar-nav-button" @click="bsCal.actions.prevMonth()" :disabled="bsCal.isPrevMonthDisabled.value">&#8249;</button>
              <span class="trc-calendar-title">{{ bsCal.title.value }}</span>
              <button class="trc-calendar-nav-button" @click="bsCal.actions.nextMonth()" :disabled="bsCal.isNextMonthDisabled.value">&#8250;</button>
            </div>
            <table class="trc-calendar-grid">
              <thead class="trc-calendar-grid-head"><tr>
                <th v-for="d in bsCal.weekdayNames.value" :key="d" class="trc-calendar-weekday">{{ d }}</th>
              </tr></thead>
              <tbody>
                <tr v-for="(week, wi) in bsCal.weeks.value" :key="wi" class="trc-calendar-week">
                  <td v-for="day in week" :key="`bs-${day.date.year}-${day.date.month}-${day.date.day}`"
                    class="trc-calendar-cell"
                    :class="{ 'trc-calendar-cell-today': day.isToday, 'trc-calendar-cell-selected': day.isSelected, 'trc-calendar-cell-outside': day.isOutsideMonth, 'trc-calendar-cell-disabled': day.isDisabled }">
                    <button class="trc-calendar-day" :disabled="day.isDisabled || day.isOutsideMonth" @click="bsCal.actions.selectDate(day.date)">{{ bsCal.formatDayNumber(day.date.day) }}</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="ave-value-box">Selected: {{ fmtDate(bsSelected) }}</div>
        </div>

        <!-- 2. Single Select AD -->
        <div class="ave-card" data-theme="ocean">
          <h3 class="ave-card-title">2. Single Select (AD Calendar)</h3>
          <p class="ave-card-desc">Standard Gregorian (AD) calendar with single date selection.</p>
          <div class="trc-calendar">
            <div class="trc-calendar-header">
              <button class="trc-calendar-nav-button" @click="adCal.actions.prevMonth()" :disabled="adCal.isPrevMonthDisabled.value">&#8249;</button>
              <span class="trc-calendar-title">{{ adCal.title.value }}</span>
              <button class="trc-calendar-nav-button" @click="adCal.actions.nextMonth()" :disabled="adCal.isNextMonthDisabled.value">&#8250;</button>
            </div>
            <table class="trc-calendar-grid">
              <thead class="trc-calendar-grid-head"><tr>
                <th v-for="d in adCal.weekdayNames.value" :key="d" class="trc-calendar-weekday">{{ d }}</th>
              </tr></thead>
              <tbody>
                <tr v-for="(week, wi) in adCal.weeks.value" :key="wi" class="trc-calendar-week">
                  <td v-for="day in week" :key="`ad-${day.date.year}-${day.date.month}-${day.date.day}`"
                    class="trc-calendar-cell"
                    :class="{ 'trc-calendar-cell-today': day.isToday, 'trc-calendar-cell-selected': day.isSelected, 'trc-calendar-cell-outside': day.isOutsideMonth, 'trc-calendar-cell-disabled': day.isDisabled }">
                    <button class="trc-calendar-day" :disabled="day.isDisabled || day.isOutsideMonth" @click="adCal.actions.selectDate(day.date)">{{ adCal.formatDayNumber(day.date.day) }}</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="ave-value-box">Selected: {{ fmtDate(adSelected) }}</div>
        </div>

        <!-- 3. Nepali Numerals -->
        <div class="ave-card" data-theme="sunset">
          <h3 class="ave-card-title">3. Nepali Numerals</h3>
          <p class="ave-card-desc">BS calendar rendered with Nepali (Devanagari) numerals via <code>locale: 'ne'</code>.</p>
          <div class="trc-calendar" data-locale="ne">
            <div class="trc-calendar-header">
              <button class="trc-calendar-nav-button" @click="nepaliCal.actions.prevMonth()" :disabled="nepaliCal.isPrevMonthDisabled.value">&#8249;</button>
              <span class="trc-calendar-title">{{ nepaliCal.title.value }}</span>
              <button class="trc-calendar-nav-button" @click="nepaliCal.actions.nextMonth()" :disabled="nepaliCal.isNextMonthDisabled.value">&#8250;</button>
            </div>
            <table class="trc-calendar-grid">
              <thead class="trc-calendar-grid-head"><tr>
                <th v-for="d in nepaliCal.weekdayNames.value" :key="d" class="trc-calendar-weekday">{{ d }}</th>
              </tr></thead>
              <tbody>
                <tr v-for="(week, wi) in nepaliCal.weeks.value" :key="wi" class="trc-calendar-week">
                  <td v-for="day in week" :key="`ne-${day.date.year}-${day.date.month}-${day.date.day}`"
                    class="trc-calendar-cell"
                    :class="{ 'trc-calendar-cell-today': day.isToday, 'trc-calendar-cell-selected': day.isSelected, 'trc-calendar-cell-outside': day.isOutsideMonth, 'trc-calendar-cell-disabled': day.isDisabled }">
                    <button class="trc-calendar-day" :disabled="day.isDisabled || day.isOutsideMonth" @click="nepaliCal.actions.selectDate(day.date)">{{ nepaliCal.formatDayNumber(day.date.day) }}</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="ave-value-box">Selected: {{ fmtDate(nepaliSelected) }}</div>
        </div>

        <!-- 4. Month Picker -->
        <div class="ave-card" data-theme="forest">
          <h3 class="ave-card-title">4. Month Picker</h3>
          <p class="ave-card-desc">Click the title text to toggle month picker view.</p>
          <div class="trc-calendar">
            <div class="trc-calendar-header">
              <button class="trc-calendar-nav-button" @click="monthPickerCal.viewMode.value === 'day' ? monthPickerCal.actions.prevMonth() : monthPickerCal.actions.prevYear()" :disabled="monthPickerCal.isPrevMonthDisabled.value">&#8249;</button>
              <button class="trc-calendar-title trc-calendar-title-clickable" @click="monthPickerCal.actions.setViewMode(monthPickerCal.viewMode.value === 'day' ? 'month' : 'day')">
                {{ monthPickerCal.title.value }}
              </button>
              <button class="trc-calendar-nav-button" @click="monthPickerCal.viewMode.value === 'day' ? monthPickerCal.actions.nextMonth() : monthPickerCal.actions.nextYear()" :disabled="monthPickerCal.isNextMonthDisabled.value">&#8250;</button>
            </div>
            <!-- Day view -->
            <table v-if="monthPickerCal.viewMode.value === 'day'" class="trc-calendar-grid">
              <thead class="trc-calendar-grid-head"><tr>
                <th v-for="d in monthPickerCal.weekdayNames.value" :key="d" class="trc-calendar-weekday">{{ d }}</th>
              </tr></thead>
              <tbody>
                <tr v-for="(week, wi) in monthPickerCal.weeks.value" :key="wi" class="trc-calendar-week">
                  <td v-for="day in week" :key="`mp-${day.date.year}-${day.date.month}-${day.date.day}`"
                    class="trc-calendar-cell"
                    :class="{ 'trc-calendar-cell-today': day.isToday, 'trc-calendar-cell-selected': day.isSelected, 'trc-calendar-cell-outside': day.isOutsideMonth }">
                    <button class="trc-calendar-day" :disabled="day.isDisabled || day.isOutsideMonth" @click="monthPickerCal.actions.selectDate(day.date)">{{ monthPickerCal.formatDayNumber(day.date.day) }}</button>
                  </td>
                </tr>
              </tbody>
            </table>
            <!-- Month picker -->
            <div v-if="monthPickerCal.viewMode.value === 'month'" class="trc-calendar-month-picker trc-calendar-view-transition">
              <button
                v-for="m in monthPickerCal.monthPickerItems.value"
                :key="m.month"
                class="trc-calendar-month-cell"
                :class="{ 'trc-calendar-month-cell-current': m.isCurrentMonth }"
                :disabled="m.disabled"
                @click="monthPickerCal.actions.focusDate({ year: monthPickerCal.state.value.focusedDate.year, month: m.month, day: 1, calendarType: 'BS' }); monthPickerCal.actions.setViewMode('day')"
              >{{ m.shortName }}</button>
            </div>
          </div>
        </div>

        <!-- 5. Year Picker -->
        <div class="ave-card" data-theme="lavender">
          <h3 class="ave-card-title">5. Year Picker</h3>
          <p class="ave-card-desc">Click the title to cycle: day -> month -> year views.</p>
          <div class="trc-calendar">
            <div class="trc-calendar-header">
              <button class="trc-calendar-nav-button"
                @click="yearPickerCal.viewMode.value === 'day' ? yearPickerCal.actions.prevMonth() : yearPickerCal.viewMode.value === 'month' ? yearPickerCal.actions.prevYear() : yearPickerCal.actions.prevYear()"
                :disabled="yearPickerCal.isPrevMonthDisabled.value">&#8249;</button>
              <button class="trc-calendar-title trc-calendar-title-clickable"
                @click="yearPickerCal.actions.setViewMode(yearPickerCal.viewMode.value === 'day' ? 'month' : yearPickerCal.viewMode.value === 'month' ? 'year' : 'day')">
                {{ yearPickerCal.viewMode.value === 'year' ? `${yearPickerCal.decadeRange.value.start} - ${yearPickerCal.decadeRange.value.end}` : yearPickerCal.title.value }}
              </button>
              <button class="trc-calendar-nav-button"
                @click="yearPickerCal.viewMode.value === 'day' ? yearPickerCal.actions.nextMonth() : yearPickerCal.viewMode.value === 'month' ? yearPickerCal.actions.nextYear() : yearPickerCal.actions.nextYear()"
                :disabled="yearPickerCal.isNextMonthDisabled.value">&#8250;</button>
            </div>
            <!-- Day view -->
            <table v-if="yearPickerCal.viewMode.value === 'day'" class="trc-calendar-grid">
              <thead class="trc-calendar-grid-head"><tr>
                <th v-for="d in yearPickerCal.weekdayNames.value" :key="d" class="trc-calendar-weekday">{{ d }}</th>
              </tr></thead>
              <tbody>
                <tr v-for="(week, wi) in yearPickerCal.weeks.value" :key="wi" class="trc-calendar-week">
                  <td v-for="day in week" :key="`yp-${day.date.year}-${day.date.month}-${day.date.day}`"
                    class="trc-calendar-cell"
                    :class="{ 'trc-calendar-cell-today': day.isToday, 'trc-calendar-cell-selected': day.isSelected, 'trc-calendar-cell-outside': day.isOutsideMonth }">
                    <button class="trc-calendar-day" :disabled="day.isDisabled || day.isOutsideMonth" @click="yearPickerCal.actions.selectDate(day.date)">{{ yearPickerCal.formatDayNumber(day.date.day) }}</button>
                  </td>
                </tr>
              </tbody>
            </table>
            <!-- Month picker -->
            <div v-if="yearPickerCal.viewMode.value === 'month'" class="trc-calendar-month-picker trc-calendar-view-transition">
              <button
                v-for="m in yearPickerCal.monthPickerItems.value"
                :key="m.month"
                class="trc-calendar-month-cell"
                :class="{ 'trc-calendar-month-cell-current': m.isCurrentMonth }"
                :disabled="m.disabled"
                @click="yearPickerCal.actions.focusDate({ year: yearPickerCal.state.value.focusedDate.year, month: m.month, day: 1, calendarType: 'BS' }); yearPickerCal.actions.setViewMode('day')"
              >{{ m.shortName }}</button>
            </div>
            <!-- Year picker -->
            <div v-if="yearPickerCal.viewMode.value === 'year'" class="trc-calendar-year-picker trc-calendar-view-transition">
              <button
                v-for="y in yearPickerCal.yearPickerItems.value"
                :key="y.year"
                class="trc-calendar-year-cell"
                :class="{ 'trc-calendar-year-cell-current': y.isCurrentYear }"
                :disabled="y.disabled"
                @click="yearPickerCal.actions.focusDate({ year: y.year, month: yearPickerCal.state.value.focusedDate.month, day: 1, calendarType: 'BS' }); yearPickerCal.actions.setViewMode('month')"
              >{{ y.year }}</button>
            </div>
          </div>
        </div>

        <!-- 6. Range Selection -->
        <div class="ave-card" data-theme="rose">
          <h3 class="ave-card-title">6. Range Selection</h3>
          <p class="ave-card-desc">Select a start and end date. Click once for start, hover to preview, click again for end.</p>
          <div class="trc-calendar">
            <div class="trc-calendar-header">
              <button class="trc-calendar-nav-button" @click="rangeSelection.actions.prevMonth()" :disabled="rangeSelection.isPrevMonthDisabled.value">&#8249;</button>
              <span class="trc-calendar-title">{{ rangeSelection.title.value }}</span>
              <button class="trc-calendar-nav-button" @click="rangeSelection.actions.nextMonth()" :disabled="rangeSelection.isNextMonthDisabled.value">&#8250;</button>
            </div>
            <table class="trc-calendar-grid">
              <thead class="trc-calendar-grid-head"><tr>
                <th v-for="d in rangeSelection.weekdayNames.value" :key="d" class="trc-calendar-weekday">{{ d }}</th>
              </tr></thead>
              <tbody>
                <tr v-for="(week, wi) in rangeSelection.weeks.value" :key="wi" class="trc-calendar-week">
                  <td v-for="day in week" :key="`rng-${day.date.year}-${day.date.month}-${day.date.day}`"
                    class="trc-calendar-cell"
                    :class="{
                      'trc-calendar-cell-today': day.isToday,
                      'trc-calendar-cell-outside': day.isOutsideMonth,
                      'trc-calendar-cell-disabled': day.isDisabled,
                      'trc-calendar-cell-range-start': day.isRangeStart,
                      'trc-calendar-cell-range-end': day.isRangeEnd,
                      'trc-calendar-cell-range-middle': day.isInRange,
                      'trc-calendar-cell-range-hover': day.isRangeHover,
                    }">
                    <button class="trc-calendar-day" :disabled="day.isDisabled || day.isOutsideMonth"
                      @click="rangeSelection.actions.select(day.date)"
                      @mouseenter="rangeSelection.actions.hover(day.date)">
                      {{ rangeSelection.formatDayNumber(day.date.day) }}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="ave-value-box">
            Start: {{ fmtDate(rangeValue?.start) }} | End: {{ fmtDate(rangeValue?.end) }}
          </div>
        </div>

        <!-- 7. Multi-Date Selection -->
        <div class="ave-card" data-theme="mint">
          <h3 class="ave-card-title">7. Multi-Date Selection</h3>
          <p class="ave-card-desc">Select multiple individual dates using <code>useSelection</code> with <code>mode: 'multiple'</code>.</p>
          <div class="trc-calendar">
            <div class="trc-calendar-header">
              <button class="trc-calendar-nav-button" @click="multiDateSelection.actions.prevMonth()" :disabled="multiDateSelection.isPrevMonthDisabled.value">&#8249;</button>
              <span class="trc-calendar-title">{{ multiDateSelection.title.value }}</span>
              <button class="trc-calendar-nav-button" @click="multiDateSelection.actions.nextMonth()" :disabled="multiDateSelection.isNextMonthDisabled.value">&#8250;</button>
            </div>
            <table class="trc-calendar-grid">
              <thead class="trc-calendar-grid-head"><tr>
                <th v-for="d in multiDateSelection.weekdayNames.value" :key="d" class="trc-calendar-weekday">{{ d }}</th>
              </tr></thead>
              <tbody>
                <tr v-for="(week, wi) in multiDateSelection.weeks.value" :key="wi" class="trc-calendar-week">
                  <td v-for="day in week" :key="`md-${day.date.year}-${day.date.month}-${day.date.day}`"
                    class="trc-calendar-cell"
                    :class="{
                      'trc-calendar-cell-today': day.isToday,
                      'trc-calendar-cell-outside': day.isOutsideMonth,
                      'trc-calendar-cell-disabled': day.isDisabled,
                      'trc-calendar-cell-multi-selected': day.isMultiSelected,
                    }">
                    <button class="trc-calendar-day" :disabled="day.isDisabled || day.isOutsideMonth"
                      @click="multiDateSelection.actions.toggle(day.date)">
                      {{ multiDateSelection.formatDayNumber(day.date.day) }}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="ave-value-box">
            Selected ({{ multiDateValue.length }}):
            {{ multiDateValue.length > 0 ? multiDateValue.map(d => fmtDate(d)).join(', ') : 'None' }}
          </div>
        </div>

        <!-- 8. Multi-Calendar 2 Months -->
        <div class="ave-card ave-card-wide" data-theme="amber">
          <h3 class="ave-card-title">8. Multi-Calendar (2 Months)</h3>
          <p class="ave-card-desc">Display two consecutive months side by side with <code>numberOfMonths: 2</code>.</p>
          <div class="trc-calendar">
            <div class="trc-calendar-header">
              <button class="trc-calendar-nav-button" @click="mc2.actions.prevMonth()" :disabled="mc2.isPrevDisabled.value">&#8249;</button>
              <span class="trc-calendar-title">
                {{ mc2.months.value[0]?.title }} &mdash; {{ mc2.months.value[mc2.months.value.length - 1]?.title }}
              </span>
              <button class="trc-calendar-nav-button" @click="mc2.actions.nextMonth()" :disabled="mc2.isNextDisabled.value">&#8250;</button>
            </div>
            <div class="trc-multi-calendar">
              <div v-for="m in mc2.months.value" :key="`mc2-${m.year}-${m.month}`" class="trc-multi-calendar-month">
                <div class="ave-month-title">{{ m.title }}</div>
                <table class="trc-calendar-grid">
                  <thead class="trc-calendar-grid-head"><tr>
                    <th v-for="d in mc2.weekdayNames.value" :key="d" class="trc-calendar-weekday">{{ d }}</th>
                  </tr></thead>
                  <tbody>
                    <tr v-for="(week, wi) in m.weeks" :key="wi" class="trc-calendar-week">
                      <td v-for="day in week" :key="`mc2d-${day.date.year}-${day.date.month}-${day.date.day}`"
                        class="trc-calendar-cell"
                        :class="{ 'trc-calendar-cell-today': day.isToday, 'trc-calendar-cell-selected': day.isSelected, 'trc-calendar-cell-outside': day.isOutsideMonth, 'trc-calendar-cell-disabled': day.isDisabled }">
                        <button class="trc-calendar-day" :disabled="day.isDisabled || day.isOutsideMonth" @click="mc2.actions.select(day.date)">{{ mc2.formatDayNumber(day.date.day) }}</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div class="ave-value-box">Selected: {{ fmtDate(mc2Value) }}</div>
        </div>

        <!-- 9. Multi-Calendar 3 Months -->
        <div class="ave-card ave-card-wide" data-theme="slate">
          <h3 class="ave-card-title">9. Multi-Calendar (3 Months)</h3>
          <p class="ave-card-desc">Three consecutive months with <code>numberOfMonths: 3</code>.</p>
          <div class="trc-calendar">
            <div class="trc-calendar-header">
              <button class="trc-calendar-nav-button" @click="mc3.actions.prevMonth()" :disabled="mc3.isPrevDisabled.value">&#8249;</button>
              <span class="trc-calendar-title">
                {{ mc3.months.value[0]?.title }} &mdash; {{ mc3.months.value[mc3.months.value.length - 1]?.title }}
              </span>
              <button class="trc-calendar-nav-button" @click="mc3.actions.nextMonth()" :disabled="mc3.isNextDisabled.value">&#8250;</button>
            </div>
            <div class="trc-multi-calendar">
              <div v-for="m in mc3.months.value" :key="`mc3-${m.year}-${m.month}`" class="trc-multi-calendar-month">
                <div class="ave-month-title">{{ m.title }}</div>
                <table class="trc-calendar-grid">
                  <thead class="trc-calendar-grid-head"><tr>
                    <th v-for="d in mc3.weekdayNames.value" :key="d" class="trc-calendar-weekday">{{ d }}</th>
                  </tr></thead>
                  <tbody>
                    <tr v-for="(week, wi) in m.weeks" :key="wi" class="trc-calendar-week">
                      <td v-for="day in week" :key="`mc3d-${day.date.year}-${day.date.month}-${day.date.day}`"
                        class="trc-calendar-cell"
                        :class="{ 'trc-calendar-cell-today': day.isToday, 'trc-calendar-cell-selected': day.isSelected, 'trc-calendar-cell-outside': day.isOutsideMonth, 'trc-calendar-cell-disabled': day.isDisabled }">
                        <button class="trc-calendar-day" :disabled="day.isDisabled || day.isOutsideMonth" @click="mc3.actions.select(day.date)">{{ mc3.formatDayNumber(day.date.day) }}</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div class="ave-value-box">Selected: {{ fmtDate(mc3Value) }}</div>
        </div>

        <!-- 10. Date Picker -->
        <div class="ave-card" data-theme="indigo">
          <h3 class="ave-card-title">10. Date Picker</h3>
          <p class="ave-card-desc">Full date picker with input field, trigger button, calendar dropdown, and clear button.</p>
          <div ref="dpRef" class="trc-date-picker" style="display: block;">
            <div class="trc-date-picker-input-wrapper">
              <input
                class="trc-date-picker-input"
                type="text"
                placeholder="Select date..."
                :value="dp.inputValue.value"
                readonly
                @click="dp.actions.toggle()"
              />
              <button v-if="dp.selectedDate.value" class="trc-date-picker-clear" @click="dp.actions.clear()" title="Clear">&times;</button>
              <button class="trc-date-picker-trigger" @click="dp.actions.toggle()" title="Toggle calendar">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M5 1v2M11 1v2M1 6h14M3 3h10a2 2 0 012 2v8a2 2 0 01-2 2H3a2 2 0 01-2-2V5a2 2 0 012-2z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </button>
            </div>
            <div v-if="dp.isOpen.value" class="trc-date-picker-content">
              <div class="trc-date-picker-calendar">
                <div class="trc-calendar-header">
                  <button class="trc-calendar-nav-button" @click="dp.actions.prevMonth()" :disabled="dp.isPrevMonthDisabled.value">&#8249;</button>
                  <span class="trc-calendar-title">{{ dp.title.value }}</span>
                  <button class="trc-calendar-nav-button" @click="dp.actions.nextMonth()" :disabled="dp.isNextMonthDisabled.value">&#8250;</button>
                </div>
                <table class="trc-calendar-grid">
                  <thead class="trc-calendar-grid-head"><tr>
                    <th v-for="d in dp.weekdayNames.value" :key="d" class="trc-calendar-weekday">{{ d }}</th>
                  </tr></thead>
                  <tbody>
                    <tr v-for="(week, wi) in dp.weeks.value" :key="wi" class="trc-calendar-week">
                      <td v-for="day in week" :key="`dp-${day.date.year}-${day.date.month}-${day.date.day}`"
                        class="trc-calendar-cell"
                        :class="{ 'trc-calendar-cell-today': day.isToday, 'trc-calendar-cell-selected': day.isSelected, 'trc-calendar-cell-outside': day.isOutsideMonth, 'trc-calendar-cell-disabled': day.isDisabled }">
                        <button class="trc-calendar-day" :disabled="day.isDisabled || day.isOutsideMonth" @click="dp.actions.selectDate(day.date)">{{ dp.formatDayNumber(day.date.day) }}</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="trc-date-picker-footer">
                <button class="trc-date-picker-today-button" @click="dp.actions.goToToday()">Today</button>
                <button class="trc-date-picker-clear-button" @click="dp.actions.clear()">Clear</button>
              </div>
            </div>
          </div>
          <div class="ave-value-box">Selected: {{ fmtDate(dpSelected) }}</div>
        </div>

        <!-- 11. Disabled Dates -->
        <div class="ave-card" data-theme="rose">
          <h3 class="ave-card-title">11. Disabled Dates</h3>
          <p class="ave-card-desc">Specific dates are disabled and cannot be selected. Days 5, 10, 15, 20, and 25 of Magh 2082 are disabled.</p>
          <div class="trc-calendar">
            <div class="trc-calendar-header">
              <button class="trc-calendar-nav-button" @click="disabledCal.actions.prevMonth()" :disabled="disabledCal.isPrevMonthDisabled.value">&#8249;</button>
              <span class="trc-calendar-title">{{ disabledCal.title.value }}</span>
              <button class="trc-calendar-nav-button" @click="disabledCal.actions.nextMonth()" :disabled="disabledCal.isNextMonthDisabled.value">&#8250;</button>
            </div>
            <table class="trc-calendar-grid">
              <thead class="trc-calendar-grid-head"><tr>
                <th v-for="d in disabledCal.weekdayNames.value" :key="d" class="trc-calendar-weekday">{{ d }}</th>
              </tr></thead>
              <tbody>
                <tr v-for="(week, wi) in disabledCal.weeks.value" :key="wi" class="trc-calendar-week">
                  <td v-for="day in week" :key="`dis-${day.date.year}-${day.date.month}-${day.date.day}`"
                    class="trc-calendar-cell"
                    :class="{ 'trc-calendar-cell-today': day.isToday, 'trc-calendar-cell-selected': day.isSelected, 'trc-calendar-cell-outside': day.isOutsideMonth, 'trc-calendar-cell-disabled': day.isDisabled }">
                    <button class="trc-calendar-day" :disabled="day.isDisabled || day.isOutsideMonth" @click="disabledCal.actions.selectDate(day.date)">{{ disabledCal.formatDayNumber(day.date.day) }}</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="ave-value-box">Selected: {{ fmtDate(disabledSelected) }}</div>
        </div>

        <!-- 12. Min/Max Date Constraints -->
        <div class="ave-card" data-theme="forest">
          <h3 class="ave-card-title">12. Min/Max Date Constraints</h3>
          <p class="ave-card-desc">Navigation and selection restricted to Magh 2082 (day 1 to 28) using <code>minDate</code> and <code>maxDate</code>.</p>
          <div class="trc-calendar">
            <div class="trc-calendar-header">
              <button class="trc-calendar-nav-button" @click="minMaxCal.actions.prevMonth()" :disabled="minMaxCal.isPrevMonthDisabled.value">&#8249;</button>
              <span class="trc-calendar-title">{{ minMaxCal.title.value }}</span>
              <button class="trc-calendar-nav-button" @click="minMaxCal.actions.nextMonth()" :disabled="minMaxCal.isNextMonthDisabled.value">&#8250;</button>
            </div>
            <table class="trc-calendar-grid">
              <thead class="trc-calendar-grid-head"><tr>
                <th v-for="d in minMaxCal.weekdayNames.value" :key="d" class="trc-calendar-weekday">{{ d }}</th>
              </tr></thead>
              <tbody>
                <tr v-for="(week, wi) in minMaxCal.weeks.value" :key="wi" class="trc-calendar-week">
                  <td v-for="day in week" :key="`mm-${day.date.year}-${day.date.month}-${day.date.day}`"
                    class="trc-calendar-cell"
                    :class="{ 'trc-calendar-cell-today': day.isToday, 'trc-calendar-cell-selected': day.isSelected, 'trc-calendar-cell-outside': day.isOutsideMonth, 'trc-calendar-cell-disabled': day.isDisabled }">
                    <button class="trc-calendar-day" :disabled="day.isDisabled || day.isOutsideMonth" @click="minMaxCal.actions.selectDate(day.date)">{{ minMaxCal.formatDayNumber(day.date.day) }}</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="ave-value-box">Selected: {{ fmtDate(minMaxSelected) }}</div>
        </div>

        <!-- 13. Week Starts Monday -->
        <div class="ave-card" data-theme="ocean">
          <h3 class="ave-card-title">13. Week Starts on Monday</h3>
          <p class="ave-card-desc">Calendar with <code>weekStartsOn: 1</code> so the week begins on Monday instead of Sunday.</p>
          <div class="trc-calendar">
            <div class="trc-calendar-header">
              <button class="trc-calendar-nav-button" @click="mondayCal.actions.prevMonth()" :disabled="mondayCal.isPrevMonthDisabled.value">&#8249;</button>
              <span class="trc-calendar-title">{{ mondayCal.title.value }}</span>
              <button class="trc-calendar-nav-button" @click="mondayCal.actions.nextMonth()" :disabled="mondayCal.isNextMonthDisabled.value">&#8250;</button>
            </div>
            <table class="trc-calendar-grid">
              <thead class="trc-calendar-grid-head"><tr>
                <th v-for="d in mondayCal.weekdayNames.value" :key="d" class="trc-calendar-weekday">{{ d }}</th>
              </tr></thead>
              <tbody>
                <tr v-for="(week, wi) in mondayCal.weeks.value" :key="wi" class="trc-calendar-week">
                  <td v-for="day in week" :key="`mon-${day.date.year}-${day.date.month}-${day.date.day}`"
                    class="trc-calendar-cell"
                    :class="{ 'trc-calendar-cell-today': day.isToday, 'trc-calendar-cell-selected': day.isSelected, 'trc-calendar-cell-outside': day.isOutsideMonth }">
                    <button class="trc-calendar-day" :disabled="day.isDisabled || day.isOutsideMonth" @click="mondayCal.actions.selectDate(day.date)">{{ mondayCal.formatDayNumber(day.date.day) }}</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 14. All 12 Themes Showcase -->
        <div class="ave-card ave-card-wide">
          <h3 class="ave-card-title">14. All 12 Themes Showcase</h3>
          <p class="ave-card-desc">Every built-in theme rendered simultaneously. The theme is applied via the <code>data-theme</code> attribute on a wrapper element.</p>
          <div class="ave-themes-grid">
            <div v-for="tc in themeCalendars" :key="tc.theme" :data-theme="tc.theme" class="ave-theme-card">
              <div class="ave-theme-label">{{ tc.theme }}</div>
              <div class="trc-calendar">
                <div class="trc-calendar-header">
                  <button class="trc-calendar-nav-button" @click="tc.cal.actions.prevMonth()" :disabled="tc.cal.isPrevMonthDisabled.value">&#8249;</button>
                  <span class="trc-calendar-title">{{ tc.cal.title.value }}</span>
                  <button class="trc-calendar-nav-button" @click="tc.cal.actions.nextMonth()" :disabled="tc.cal.isNextMonthDisabled.value">&#8250;</button>
                </div>
                <table class="trc-calendar-grid">
                  <thead class="trc-calendar-grid-head"><tr>
                    <th v-for="d in tc.cal.weekdayNames.value" :key="d" class="trc-calendar-weekday">{{ d }}</th>
                  </tr></thead>
                  <tbody>
                    <tr v-for="(week, wi) in tc.cal.weeks.value" :key="wi" class="trc-calendar-week">
                      <td v-for="day in week" :key="`th-${tc.theme}-${day.date.year}-${day.date.month}-${day.date.day}`"
                        class="trc-calendar-cell"
                        :class="{ 'trc-calendar-cell-today': day.isToday, 'trc-calendar-cell-selected': day.isSelected, 'trc-calendar-cell-outside': day.isOutsideMonth }">
                        <button class="trc-calendar-day" :disabled="day.isDisabled || day.isOutsideMonth" @click="tc.cal.actions.selectDate(day.date)">{{ tc.cal.formatDayNumber(day.date.day) }}</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <!-- 15. Controlled Component -->
        <div class="ave-card" data-theme="amber">
          <h3 class="ave-card-title">15. Controlled Component</h3>
          <p class="ave-card-desc">Calendar controlled by external state. Use the buttons below to set the date programmatically.</p>
          <div class="ave-btn-row">
            <button class="ave-btn" @click="setControlled(2082, 1, 1)">Baisakh 1, 2082</button>
            <button class="ave-btn" @click="setControlled(2082, 5, 15)">Bhadra 15, 2082</button>
            <button class="ave-btn" @click="setControlled(2082, 10, 1)">Magh 1, 2082</button>
            <button class="ave-btn ave-btn-danger" @click="controlledValue = null">Clear</button>
          </div>
          <div class="trc-calendar">
            <div class="trc-calendar-header">
              <button class="trc-calendar-nav-button" @click="controlledCal.actions.prevMonth()" :disabled="controlledCal.isPrevMonthDisabled.value">&#8249;</button>
              <span class="trc-calendar-title">{{ controlledCal.title.value }}</span>
              <button class="trc-calendar-nav-button" @click="controlledCal.actions.nextMonth()" :disabled="controlledCal.isNextMonthDisabled.value">&#8250;</button>
            </div>
            <table class="trc-calendar-grid">
              <thead class="trc-calendar-grid-head"><tr>
                <th v-for="d in controlledCal.weekdayNames.value" :key="d" class="trc-calendar-weekday">{{ d }}</th>
              </tr></thead>
              <tbody>
                <tr v-for="(week, wi) in controlledCal.weeks.value" :key="wi" class="trc-calendar-week">
                  <td v-for="day in week" :key="`ctrl-${day.date.year}-${day.date.month}-${day.date.day}`"
                    class="trc-calendar-cell"
                    :class="{ 'trc-calendar-cell-today': day.isToday, 'trc-calendar-cell-selected': day.isSelected, 'trc-calendar-cell-outside': day.isOutsideMonth, 'trc-calendar-cell-disabled': day.isDisabled }">
                    <button class="trc-calendar-day" :disabled="day.isDisabled || day.isOutsideMonth" @click="controlledCal.actions.selectDate(day.date)">{{ controlledCal.formatDayNumber(day.date.day) }}</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="ave-value-box">Selected: {{ fmtDate(controlledValue) }}</div>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
/* ===========================================================================
   Page Layout
   =========================================================================== */

.ave-page {
  background: #0a0a0f;
  color: #e4e4e7;
  min-height: 100vh;
  padding: 2rem 1rem;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.ave-container {
  max-width: 1400px;
  margin: 0 auto;
}

.ave-heading {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #fff;
}

.ave-subheading {
  font-size: 1rem;
  color: #71717a;
  margin-bottom: 2.5rem;
}

.ave-code-inline {
  color: #818cf8;
}

/* ===========================================================================
   Grid
   =========================================================================== */

.ave-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 1.5rem;
}

/* ===========================================================================
   Cards
   =========================================================================== */

.ave-card {
  background: #111118;
  border: 1px solid #1e1e2e;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.ave-card-wide {
  grid-column: 1 / -1;
}

.ave-card-title {
  font-size: 1rem;
  font-weight: 600;
  color: #fff;
  margin: 0;
}

.ave-card-desc {
  font-size: 0.8125rem;
  color: #71717a;
  margin: 0;
  line-height: 1.5;
}

.ave-card-desc code {
  color: #a1a1aa;
  background: #18181b;
  padding: 0.1em 0.35em;
  border-radius: 4px;
  font-size: 0.8em;
}

/* ===========================================================================
   Value Display
   =========================================================================== */

.ave-value-box {
  font-size: 0.8125rem;
  color: #a1a1aa;
  background: #18181b;
  border: 1px solid #27272a;
  border-radius: 6px;
  padding: 0.5rem 0.75rem;
  font-family: monospace;
  word-break: break-all;
}

/* ===========================================================================
   Multi-Calendar Month Titles
   =========================================================================== */

.ave-month-title {
  text-align: center;
  font-weight: 600;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
  color: #e4e4e7;
}

/* ===========================================================================
   Buttons
   =========================================================================== */

.ave-btn-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.ave-btn {
  padding: 0.4rem 0.85rem;
  border-radius: 6px;
  border: 1px solid #27272a;
  background: #18181b;
  color: #a1a1aa;
  cursor: pointer;
  font-size: 0.8125rem;
  font-weight: 500;
  transition: all 0.15s;
}

.ave-btn:hover {
  border-color: #3f3f46;
  color: #e4e4e7;
}

.ave-btn-danger {
  border-color: #ef4444;
  color: #ef4444;
}

.ave-btn-danger:hover {
  background: rgba(239, 68, 68, 0.1);
}

/* ===========================================================================
   Themes Showcase Grid
   =========================================================================== */

.ave-themes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

.ave-theme-card {
  background: #0d0d14;
  border: 1px solid #1e1e2e;
  border-radius: 8px;
  padding: 0.75rem;
}

.ave-theme-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #a1a1aa;
  margin-bottom: 0.5rem;
  text-transform: capitalize;
}

/* ===========================================================================
   Date Picker Overrides
   =========================================================================== */

.trc-date-picker {
  position: relative;
}

.trc-date-picker-content {
  z-index: 50;
}

/* ===========================================================================
   Responsive
   =========================================================================== */

@media (max-width: 480px) {
  .ave-grid {
    grid-template-columns: 1fr;
  }

  .ave-themes-grid {
    grid-template-columns: 1fr;
  }
}
</style>
