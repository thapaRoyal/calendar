<script lang="ts">
  import { createCalendar } from '@thaparoyal/calendar-svelte';
  import { adToBs } from '@thaparoyal/calendar-core';
  import type { CalendarDate } from '@thaparoyal/calendar-core';

  const ad = createCalendar({ config: { calendarType: 'AD', locale: 'en' } });
  const bs = createCalendar({ config: { calendarType: 'BS', locale: 'en' } });

  const adWeeks = ad.weeks;
  const adWeekdayNames = ad.weekdayNames;
  const adTitle = ad.title;
  const adPrevDisabled = ad.isPrevMonthDisabled;
  const adNextDisabled = ad.isNextMonthDisabled;

  const bsWeeks = bs.weeks;
  const bsWeekdayNames = bs.weekdayNames;
  const bsTitle = bs.title;
  const bsPrevDisabled = bs.isPrevMonthDisabled;
  const bsNextDisabled = bs.isNextMonthDisabled;

  let selectedAd: CalendarDate | null = null;
  let selectedBs: CalendarDate | null = null;
  let adInput = '2024-01-15';
  let convertedBs: CalendarDate | null = null;

  $: {
    const [year, month, day] = adInput.split('-').map(Number);
    if (!year || !month || !day) {
      convertedBs = null;
    } else {
      try {
        convertedBs = adToBs(new Date(year, month - 1, day));
      } catch {
        convertedBs = null;
      }
    }
  }

  function format(date: CalendarDate | null) {
    if (!date) return 'No date selected';
    return `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')} (${date.calendarType})`;
  }

  function selectAd(date: CalendarDate) {
    selectedAd = date;
    ad.selectDate(date);
  }

  function selectBs(date: CalendarDate) {
    selectedBs = date;
    bs.selectDate(date);
  }
</script>

<section class="sf-wrap">
  <div class="sf-header">
    <div>
      <h2>Svelte Playground</h2>
      <p>Demonstrates `@thaparoyal/calendar-svelte` stores with a custom calendar UI.</p>
    </div>
    <span class="sf-badge">Svelte</span>
  </div>

  <div class="sf-grid">
    <article class="sf-card">
      <div class="sf-card-head">
        <h3>AD Calendar</h3>
        <small>Gregorian</small>
      </div>
      <div class="sf-calendar">
        <div class="sf-cal-head">
          <button on:click={ad.prevMonth} disabled={$adPrevDisabled}>&lt;</button>
          <strong>{$adTitle}</strong>
          <button on:click={ad.nextMonth} disabled={$adNextDisabled}>&gt;</button>
        </div>
        <table>
          <thead>
            <tr>
              {#each $adWeekdayNames as name}
                <th>{name}</th>
              {/each}
            </tr>
          </thead>
          <tbody>
            {#each $adWeeks as week, wi}
              <tr>
                {#each week as day, di}
                  <td class:outside={day.isOutsideMonth} class:selected={day.isSelected} class:today={day.isToday}>
                    <button
                      disabled={day.isDisabled}
                      on:click={() => !day.isDisabled && selectAd(day.date)}
                      aria-label={`AD day ${wi}-${di}`}
                    >
                      {ad.formatDayNumber(day.date.day)}
                    </button>
                  </td>
                {/each}
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
      <p class="sf-selected">{format(selectedAd)}</p>
    </article>

    <article class="sf-card">
      <div class="sf-card-head">
        <h3>BS Calendar</h3>
        <small>Bikram Sambat</small>
      </div>
      <div class="sf-calendar">
        <div class="sf-cal-head">
          <button on:click={bs.prevMonth} disabled={$bsPrevDisabled}>&lt;</button>
          <strong>{$bsTitle}</strong>
          <button on:click={bs.nextMonth} disabled={$bsNextDisabled}>&gt;</button>
        </div>
        <table>
          <thead>
            <tr>
              {#each $bsWeekdayNames as name}
                <th>{name}</th>
              {/each}
            </tr>
          </thead>
          <tbody>
            {#each $bsWeeks as week, wi}
              <tr>
                {#each week as day, di}
                  <td class:outside={day.isOutsideMonth} class:selected={day.isSelected} class:today={day.isToday}>
                    <button
                      disabled={day.isDisabled}
                      on:click={() => !day.isDisabled && selectBs(day.date)}
                      aria-label={`BS day ${wi}-${di}`}
                    >
                      {bs.formatDayNumber(day.date.day)}
                    </button>
                  </td>
                {/each}
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
      <p class="sf-selected">{format(selectedBs)}</p>
    </article>
  </div>

  <article class="sf-card sf-converter">
    <div class="sf-card-head">
      <h3>AD to BS Converter</h3>
      <small>Uses `@thaparoyal/calendar-core`</small>
    </div>
    <div class="sf-converter-row">
      <input bind:value={adInput} type="date" />
      <span>→</span>
      <output>{convertedBs ? format(convertedBs) : 'Invalid date'}</output>
    </div>
  </article>
</section>

<style>
  .sf-wrap {
    display: grid;
    gap: 1rem;
  }

  .sf-header {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    align-items: center;
  }

  .sf-header h2 {
    margin: 0;
  }

  .sf-header p {
    margin: 0.25rem 0 0;
    color: #9ca3af;
  }

  .sf-badge {
    border: 1px solid #ff3e00;
    color: #ff3e00;
    border-radius: 999px;
    padding: 0.25rem 0.75rem;
    font-size: 0.85rem;
  }

  .sf-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 1rem;
  }

  .sf-card {
    background: #111;
    border: 1px solid #222;
    border-radius: 0.75rem;
    padding: 1rem;
  }

  .sf-card-head h3 {
    margin: 0;
  }

  .sf-card-head small {
    color: #9ca3af;
  }

  .sf-calendar {
    margin-top: 0.75rem;
    border: 1px solid #2a2a2a;
    border-radius: 0.75rem;
    padding: 0.75rem;
  }

  .sf-cal-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.5rem;
    gap: 0.5rem;
  }

  .sf-cal-head button {
    width: 2rem;
    height: 2rem;
    border-radius: 0.4rem;
    border: 1px solid #333;
    background: #171717;
    color: #fff;
  }

  .sf-calendar table {
    width: 100%;
    border-collapse: collapse;
  }

  .sf-calendar th {
    color: #9ca3af;
    font-size: 0.75rem;
    font-weight: 600;
    padding-bottom: 0.35rem;
    text-align: center;
  }

  .sf-calendar td {
    text-align: center;
    padding: 2px;
  }

  .sf-calendar td button {
    width: 2rem;
    height: 2rem;
    border: none;
    border-radius: 0.45rem;
    background: transparent;
    color: #fff;
  }

  .sf-calendar td.today button {
    background: rgba(255, 62, 0, 0.15);
  }

  .sf-calendar td.selected button {
    background: #ff3e00;
    color: #1a0802;
    font-weight: 700;
  }

  .sf-calendar td.outside button {
    opacity: 0.35;
  }

  .sf-selected {
    margin: 0.75rem 0 0;
    color: #d1d5db;
    font-size: 0.9rem;
  }

  .sf-converter-row {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    gap: 0.75rem;
    margin-top: 0.75rem;
  }

  .sf-converter-row input,
  .sf-converter-row output {
    width: 100%;
    border: 1px solid #333;
    border-radius: 0.5rem;
    padding: 0.65rem 0.75rem;
    background: #171717;
    color: #fff;
  }

  .sf-converter-row output {
    display: block;
  }
</style>
