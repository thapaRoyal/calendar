<script setup lang="ts">
import { computed, ref } from 'vue';
import { useCalendar } from '@thaparoyal/calendar-vue';
import { adToBs } from '@thaparoyal/calendar-core';
import type { CalendarDate } from '@thaparoyal/calendar-core';

const adCalendar = useCalendar({ config: { calendarType: 'AD', locale: 'en' } });
const bsCalendar = useCalendar({ config: { calendarType: 'BS', locale: 'en' } });

const selectedAd = ref<CalendarDate | null>(null);
const selectedBs = ref<CalendarDate | null>(null);
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

function format(date: CalendarDate | null) {
  if (!date) return 'No date selected';
  return `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')} (${date.calendarType})`;
}

function selectFrom(calendar: typeof adCalendar | typeof bsCalendar, target: typeof selectedAd | typeof selectedBs, date: CalendarDate) {
  target.value = date;
  calendar.actions.selectDate(date);
}
</script>

<template>
  <section class="vf-wrap">
    <div class="vf-header">
      <div>
        <h2>Vue Playground</h2>
        <p>Demonstrates `@thaparoyal/calendar-vue` composables with a custom calendar UI.</p>
      </div>
      <span class="vf-badge">Vue 3</span>
    </div>

    <div class="vf-grid">
      <article class="vf-card">
        <div class="vf-card-head">
          <h3>AD Calendar</h3>
          <small>Gregorian</small>
        </div>
        <div class="vf-calendar">
          <div class="vf-cal-head">
            <button @click="adCalendar.actions.prevMonth" :disabled="adCalendar.isPrevMonthDisabled.value">&lt;</button>
            <strong>{{ adCalendar.title.value }}</strong>
            <button @click="adCalendar.actions.nextMonth" :disabled="adCalendar.isNextMonthDisabled.value">&gt;</button>
          </div>
          <table>
            <thead>
              <tr>
                <th v-for="d in adCalendar.weekdayNames.value" :key="d">{{ d }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(week, wIndex) in adCalendar.weeks.value" :key="wIndex">
                <td
                  v-for="(day, dIndex) in week"
                  :key="`${wIndex}-${dIndex}`"
                  :class="{ outside: day.isOutsideMonth, selected: day.isSelected, today: day.isToday }"
                >
                  <button :disabled="day.isDisabled" @click="() => !day.isDisabled && selectFrom(adCalendar, selectedAd, day.date)">
                    {{ adCalendar.formatDayNumber(day.date.day) }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="vf-selected">{{ format(selectedAd) }}</p>
      </article>

      <article class="vf-card">
        <div class="vf-card-head">
          <h3>BS Calendar</h3>
          <small>Bikram Sambat</small>
        </div>
        <div class="vf-calendar">
          <div class="vf-cal-head">
            <button @click="bsCalendar.actions.prevMonth" :disabled="bsCalendar.isPrevMonthDisabled.value">&lt;</button>
            <strong>{{ bsCalendar.title.value }}</strong>
            <button @click="bsCalendar.actions.nextMonth" :disabled="bsCalendar.isNextMonthDisabled.value">&gt;</button>
          </div>
          <table>
            <thead>
              <tr>
                <th v-for="d in bsCalendar.weekdayNames.value" :key="d">{{ d }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(week, wIndex) in bsCalendar.weeks.value" :key="wIndex">
                <td
                  v-for="(day, dIndex) in week"
                  :key="`${wIndex}-${dIndex}`"
                  :class="{ outside: day.isOutsideMonth, selected: day.isSelected, today: day.isToday }"
                >
                  <button :disabled="day.isDisabled" @click="() => !day.isDisabled && selectFrom(bsCalendar, selectedBs, day.date)">
                    {{ bsCalendar.formatDayNumber(day.date.day) }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="vf-selected">{{ format(selectedBs) }}</p>
      </article>
    </div>

    <article class="vf-card vf-converter">
      <div class="vf-card-head">
        <h3>AD to BS Converter</h3>
        <small>Uses `@thaparoyal/calendar-core`</small>
      </div>
      <div class="vf-converter-row">
        <input v-model="adInput" type="date" />
        <span>→</span>
        <output>{{ convertedBs ? format(convertedBs) : 'Invalid date' }}</output>
      </div>
    </article>
  </section>
</template>

<style scoped>
.vf-wrap {
  display: grid;
  gap: 1rem;
}

.vf-header {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: center;
}

.vf-header h2 {
  margin: 0;
}

.vf-header p {
  margin: 0.25rem 0 0;
  color: #9ca3af;
}

.vf-badge {
  border: 1px solid #42b883;
  color: #42b883;
  border-radius: 999px;
  padding: 0.25rem 0.75rem;
  font-size: 0.85rem;
}

.vf-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1rem;
}

.vf-card {
  background: #111;
  border: 1px solid #222;
  border-radius: 0.75rem;
  padding: 1rem;
}

.vf-card-head h3 {
  margin: 0;
}

.vf-card-head small {
  color: #9ca3af;
}

.vf-calendar {
  margin-top: 0.75rem;
  border: 1px solid #2a2a2a;
  border-radius: 0.75rem;
  padding: 0.75rem;
}

.vf-cal-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  gap: 0.5rem;
}

.vf-cal-head button {
  width: 2rem;
  height: 2rem;
  border-radius: 0.4rem;
  border: 1px solid #333;
  background: #171717;
  color: #fff;
}

.vf-calendar table {
  width: 100%;
  border-collapse: collapse;
}

.vf-calendar th {
  color: #9ca3af;
  font-size: 0.75rem;
  font-weight: 600;
  padding-bottom: 0.35rem;
}

.vf-calendar td {
  text-align: center;
  padding: 2px;
}

.vf-calendar td button {
  width: 2rem;
  height: 2rem;
  border: none;
  border-radius: 0.45rem;
  background: transparent;
  color: #fff;
}

.vf-calendar td.today button {
  background: rgba(66, 184, 131, 0.18);
}

.vf-calendar td.selected button {
  background: #42b883;
  color: #08110d;
  font-weight: 700;
}

.vf-calendar td.outside button {
  opacity: 0.35;
}

.vf-selected {
  margin: 0.75rem 0 0;
  color: #d1d5db;
  font-size: 0.9rem;
}

.vf-converter-row {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.75rem;
}

.vf-converter-row input,
.vf-converter-row output {
  width: 100%;
  border: 1px solid #333;
  border-radius: 0.5rem;
  padding: 0.65rem 0.75rem;
  background: #171717;
  color: #fff;
}

.vf-converter-row output {
  display: block;
}
</style>
