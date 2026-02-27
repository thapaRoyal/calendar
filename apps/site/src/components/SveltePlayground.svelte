<script lang="ts">
  import { createCalendar } from '@thaparoyal/calendar-svelte';
  import { adToBs } from '@thaparoyal/calendar-core';
  import type { CalendarDate, MonthPickerItem, YearPickerItem } from '@thaparoyal/calendar-core';

  const THEMES = [
    'default', 'dark', 'ocean', 'ocean-dark', 'forest', 'forest-dark',
    'sunset', 'sunset-dark', 'royal', 'royal-dark', 'nepal', 'nepal-dark',
    'lavender', 'midnight', 'rose', 'mint', 'amber', 'slate', 'coral', 'indigo',
  ];

  let theme = 'dark';

  // Single selection calendar
  const single = createCalendar({ config: { calendarType: 'BS', locale: 'en' } });
  const singleWeeks = single.weeks;
  const singleWdNames = single.weekdayNames;
  const singleTitle = single.title;
  const singleViewMode = single.viewMode;
  const singleMonths = single.monthPickerItems;
  const singleYears = single.yearPickerItems;
  const singleDecade = single.decadeRange;
  const singleState = single.state;

  let selectedSingle: CalendarDate | null = null;

  // Dropdown calendar
  const dropdown = createCalendar({ config: { calendarType: 'BS', locale: 'en' } });
  const ddWeeks = dropdown.weeks;
  const ddWdNames = dropdown.weekdayNames;
  const ddState = dropdown.state;
  const ddMonths = dropdown.monthPickerItems;
  const ddYears = dropdown.yearPickerItems;

  // Range calendar
  const range = createCalendar({ config: { calendarType: 'BS', locale: 'en' } });
  const rangeWeeks = range.weeks;
  const rangeWdNames = range.weekdayNames;
  const rangeTitle = range.title;
  const rangeViewMode = range.viewMode;
  const rangeMonths = range.monthPickerItems;

  let rangeStart: CalendarDate | null = null;
  let rangeEnd: CalendarDate | null = null;
  let rangePicking: 'start' | 'end' = 'start';

  function format(date: CalendarDate | null | undefined): string {
    if (!date) return '—';
    return `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')} (${date.calendarType})`;
  }

  function selectSingleDate(date: CalendarDate) {
    selectedSingle = date;
    single.selectDate(date);
  }

  function selectRangeDate(date: CalendarDate) {
    if (rangePicking === 'start') {
      rangeStart = date;
      rangeEnd = null;
      rangePicking = 'end';
    } else {
      rangeEnd = date;
      rangePicking = 'start';
    }
    range.selectDate(date);
  }

  function selectMonth(cal: typeof single, item: MonthPickerItem) {
    if (item.disabled) return;
    let st: any;
    cal.state.subscribe(s => st = s)();
    cal.focusDate({
      year: st.focusedDate.year,
      month: item.month,
      day: 1,
      calendarType: st.config.calendarType,
    });
    cal.setViewMode('day');
  }

  function selectYear(cal: typeof single, item: YearPickerItem) {
    if (item.disabled) return;
    let st: any;
    cal.state.subscribe(s => st = s)();
    cal.focusDate({
      year: item.year,
      month: st.focusedDate.month,
      day: 1,
      calendarType: st.config.calendarType,
    });
    cal.setViewMode('month');
  }

  function handlePrev(cal: typeof single) {
    let vm: string;
    cal.viewMode.subscribe(v => vm = v)();
    if (vm! === 'day') cal.prevMonth();
    else cal.prevYear();
  }

  function handleNext(cal: typeof single) {
    let vm: string;
    cal.viewMode.subscribe(v => vm = v)();
    if (vm! === 'day') cal.nextMonth();
    else cal.nextYear();
  }

  // Converter
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

  function isDateEqual(a: CalendarDate | null, b: CalendarDate): boolean {
    if (!a) return false;
    return a.year === b.year && a.month === b.month && a.day === b.day;
  }
</script>

<div class="sp-root">
  <div class="sp-header">
    <div>
      <h2 class="sp-title">Svelte Playground</h2>
      <p class="sp-desc">Interactive demo of <code class="sp-code">@thaparoyal/calendar-svelte</code> stores</p>
    </div>
    <span class="sp-badge">Svelte</span>
  </div>

  <!-- Settings Bar -->
  <div class="sp-settings">
    <div class="sp-setting sp-setting-wide">
      <label class="sp-setting-label">Theme</label>
      <div class="sp-btn-group sp-btn-group-wrap">
        {#each THEMES as t}
          <button
            class="sp-btn sp-btn-sm"
            class:sp-btn-active={theme === t}
            on:click={() => theme = t}
          >{t}</button>
        {/each}
      </div>
    </div>
  </div>

  <!-- Calendar Grid -->
  <div class="sp-grid">
    <!-- 1. Single Selection with Month/Year Picker -->
    <div class="sp-card">
      <h3 class="sp-card-title">Single Selection</h3>
      <p class="sp-card-desc">Click title to switch: day → month → year</p>
      <div data-theme={theme} class="sp-cal-wrap">
        {#if $singleViewMode === 'day'}
          <div class="sp-cal-header">
            <button class="sp-nav-btn" on:click={() => handlePrev(single)}>‹</button>
            <button class="sp-title-btn" on:click={() => single.setViewMode('month')}>{$singleTitle}</button>
            <button class="sp-nav-btn" on:click={() => handleNext(single)}>›</button>
          </div>
          <table class="sp-cal-grid">
            <thead>
              <tr>
                {#each $singleWdNames as d}
                  <th>{d}</th>
                {/each}
              </tr>
            </thead>
            <tbody>
              {#each $singleWeeks as week, wi}
                <tr>
                  {#each week as day, di}
                    <td
                      class:sp-cell-outside={day.isOutsideMonth}
                      class:sp-cell-selected={day.isSelected}
                      class:sp-cell-today={day.isToday}
                    >
                      <button
                        class="sp-day-btn"
                        disabled={day.isDisabled}
                        on:click={() => !day.isDisabled && selectSingleDate(day.date)}
                      >{single.formatDayNumber(day.date.day)}</button>
                    </td>
                  {/each}
                </tr>
              {/each}
            </tbody>
          </table>
        {:else if $singleViewMode === 'month'}
          <div class="sp-cal-header">
            <button class="sp-nav-btn" on:click={() => single.prevYear()}>‹</button>
            <button class="sp-title-btn" on:click={() => single.setViewMode('year')}>
              {$singleState.focusedDate.year}
            </button>
            <button class="sp-nav-btn" on:click={() => single.nextYear()}>›</button>
          </div>
          <div class="sp-picker-grid">
            {#each $singleMonths as item}
              <button
                class="sp-picker-cell"
                class:sp-picker-active={item.isCurrentMonth}
                class:sp-picker-disabled={item.disabled}
                disabled={item.disabled}
                on:click={() => selectMonth(single, item)}
              >{item.shortName}</button>
            {/each}
          </div>
        {:else}
          <div class="sp-cal-header">
            <button class="sp-nav-btn" on:click={() => single.prevYear()}>‹</button>
            <button class="sp-title-btn" on:click={() => single.setViewMode('day')}>
              {$singleDecade.start} - {$singleDecade.end}
            </button>
            <button class="sp-nav-btn" on:click={() => single.nextYear()}>›</button>
          </div>
          <div class="sp-picker-grid">
            {#each $singleYears as item}
              <button
                class="sp-picker-cell"
                class:sp-picker-active={item.isCurrentYear}
                class:sp-picker-disabled={item.disabled}
                disabled={item.disabled}
                on:click={() => selectYear(single, item)}
              >{item.year}</button>
            {/each}
          </div>
        {/if}
      </div>
      <div class="sp-value">Selected: {format(selectedSingle)}</div>
    </div>

    <!-- 2. Dropdown Navigation -->
    <div class="sp-card">
      <h3 class="sp-card-title">Month &amp; Year Dropdowns</h3>
      <p class="sp-card-desc">Quick navigation via dropdown selects</p>
      <div data-theme={theme} class="sp-cal-wrap">
        <div class="sp-cal-header">
          <button class="sp-nav-btn" on:click={() => dropdown.prevMonth()}>‹</button>
          <select
            class="sp-select"
            value={$ddState.focusedDate.month}
            on:change={(e) => {
              const m = Number(e.currentTarget.value);
              dropdown.focusDate({
                ...$ddState.focusedDate,
                month: m,
                day: 1,
              });
            }}
          >
            {#each $ddMonths as item}
              <option value={item.month}>{item.shortName}</option>
            {/each}
          </select>
          <select
            class="sp-select"
            value={$ddState.focusedDate.year}
            on:change={(e) => {
              const y = Number(e.currentTarget.value);
              dropdown.focusDate({
                ...$ddState.focusedDate,
                year: y,
                day: 1,
              });
            }}
          >
            {#each $ddYears as item}
              <option value={item.year}>{item.year}</option>
            {/each}
          </select>
          <button class="sp-nav-btn" on:click={() => dropdown.nextMonth()}>›</button>
        </div>
        <table class="sp-cal-grid">
          <thead>
            <tr>
              {#each $ddWdNames as d}
                <th>{d}</th>
              {/each}
            </tr>
          </thead>
          <tbody>
            {#each $ddWeeks as week, wi}
              <tr>
                {#each week as day, di}
                  <td
                    class:sp-cell-outside={day.isOutsideMonth}
                    class:sp-cell-selected={day.isSelected}
                    class:sp-cell-today={day.isToday}
                  >
                    <button
                      class="sp-day-btn"
                      disabled={day.isDisabled}
                      on:click={() => !day.isDisabled && dropdown.selectDate(day.date)}
                    >{dropdown.formatDayNumber(day.date.day)}</button>
                  </td>
                {/each}
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>

    <!-- 3. Range Selection -->
    <div class="sp-card">
      <h3 class="sp-card-title">Range Selection</h3>
      <p class="sp-card-desc">Click start date, then click end date</p>
      <div data-theme={theme} class="sp-cal-wrap">
        <div class="sp-cal-header">
          <button class="sp-nav-btn" on:click={() => range.prevMonth()}>‹</button>
          <button class="sp-title-btn" on:click={() => range.setViewMode($rangeViewMode === 'day' ? 'month' : 'day')}>
            {$rangeTitle}
          </button>
          <button class="sp-nav-btn" on:click={() => range.nextMonth()}>›</button>
        </div>

        {#if $rangeViewMode === 'day'}
          <table class="sp-cal-grid">
            <thead>
              <tr>
                {#each $rangeWdNames as d}
                  <th>{d}</th>
                {/each}
              </tr>
            </thead>
            <tbody>
              {#each $rangeWeeks as week, wi}
                <tr>
                  {#each week as day, di}
                    <td
                      class:sp-cell-outside={day.isOutsideMonth}
                      class:sp-cell-today={day.isToday}
                      class:sp-cell-selected={isDateEqual(rangeStart, day.date) || isDateEqual(rangeEnd, day.date)}
                    >
                      <button
                        class="sp-day-btn"
                        disabled={day.isDisabled}
                        on:click={() => !day.isDisabled && selectRangeDate(day.date)}
                      >{range.formatDayNumber(day.date.day)}</button>
                    </td>
                  {/each}
                </tr>
              {/each}
            </tbody>
          </table>
        {:else}
          <div class="sp-picker-grid">
            {#each $rangeMonths as item}
              <button
                class="sp-picker-cell"
                class:sp-picker-active={item.isCurrentMonth}
                disabled={item.disabled}
                on:click={() => selectMonth(range, item)}
              >{item.shortName}</button>
            {/each}
          </div>
        {/if}
      </div>
      <div class="sp-value">Range: {format(rangeStart)} → {format(rangeEnd)}</div>
    </div>

    <!-- 4. AD to BS Converter -->
    <div class="sp-card">
      <h3 class="sp-card-title">AD ↔ BS Converter</h3>
      <p class="sp-card-desc">Uses @thaparoyal/calendar-core</p>
      <div data-theme={theme} class="sp-cal-wrap">
        <div class="sp-converter-row">
          <input bind:value={adInput} type="date" class="sp-input" />
          <span class="sp-arrow">→</span>
          <output class="sp-output">{convertedBs ? format(convertedBs) : 'Invalid date'}</output>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .sp-root {
    padding: 2rem;
    max-width: 1400px;
    margin: 0 auto;
  }

  .sp-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }

  .sp-title {
    font-size: 1.75rem;
    font-weight: 700;
    margin: 0;
    color: #fff;
  }

  .sp-desc {
    color: #888;
    margin: 0.25rem 0 0;
    font-size: 0.95rem;
  }

  .sp-code {
    background: #1a1a2e;
    padding: 0.15rem 0.4rem;
    border-radius: 4px;
    color: #ff3e00;
    font-size: 0.85rem;
  }

  .sp-badge {
    border: 1px solid #ff3e00;
    color: #ff3e00;
    border-radius: 999px;
    padding: 0.25rem 0.75rem;
    font-size: 0.85rem;
    white-space: nowrap;
  }

  /* Settings */
  .sp-settings {
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

  .sp-setting-label {
    display: block;
    font-size: 0.75rem;
    font-weight: 600;
    color: #888;
    margin-bottom: 6px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .sp-setting-wide {
    flex: 1;
    min-width: 200px;
  }

  .sp-btn-group {
    display: flex;
    gap: 4px;
  }

  .sp-btn-group-wrap {
    flex-wrap: wrap;
  }

  .sp-btn {
    padding: 0.4rem 1rem;
    border-radius: 6px;
    border: 1px solid #2a2a3a;
    background: #16161e;
    color: #888;
    cursor: pointer;
    font-size: 0.8rem;
    font-weight: 500;
  }

  .sp-btn-sm {
    padding: 0.3rem 0.65rem;
    font-size: 0.7rem;
  }

  .sp-btn-active {
    border-color: #ff3e00;
    background: #ff3e00;
    color: #fff;
  }

  /* Grid */
  .sp-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
    gap: 1.25rem;
  }

  /* Cards */
  .sp-card {
    background: #111118;
    border: 1px solid #1e1e2e;
    border-radius: 12px;
    padding: 1.5rem;
  }

  .sp-card-title {
    font-size: 1rem;
    font-weight: 600;
    color: #fff;
    margin: 0;
  }

  .sp-card-desc {
    font-size: 0.8rem;
    color: #666;
    margin: 0.25rem 0 0.75rem;
  }

  /* Calendar */
  .sp-cal-wrap {
    border: 1px solid #2a2a3a;
    border-radius: 10px;
    padding: 1rem;
    background: #0d0d14;
  }

  .sp-cal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.75rem;
    gap: 0.5rem;
  }

  .sp-nav-btn {
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

  .sp-nav-btn:hover {
    border-color: #ff3e00;
  }

  .sp-title-btn {
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

  .sp-title-btn:hover {
    background: #1e1e2e;
  }

  /* Day grid */
  .sp-cal-grid {
    width: 100%;
    border-collapse: collapse;
  }

  .sp-cal-grid th {
    color: #666;
    font-size: 0.75rem;
    font-weight: 600;
    padding-bottom: 0.5rem;
    text-align: center;
  }

  .sp-cal-grid td {
    text-align: center;
    padding: 2px;
  }

  .sp-day-btn {
    width: 2.25rem;
    height: 2.25rem;
    border: none;
    border-radius: 8px;
    background: transparent;
    color: #ddd;
    cursor: pointer;
    font-size: 0.85rem;
  }

  .sp-day-btn:hover:not(:disabled) {
    background: rgba(255, 62, 0, 0.15);
  }

  .sp-cell-today .sp-day-btn {
    background: rgba(255, 62, 0, 0.2);
    font-weight: 700;
  }

  .sp-cell-selected .sp-day-btn {
    background: #ff3e00;
    color: #1a0802;
    font-weight: 700;
  }

  .sp-cell-outside .sp-day-btn {
    opacity: 0.3;
  }

  /* Picker grid */
  .sp-picker-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 6px;
  }

  .sp-picker-cell {
    padding: 0.6rem 0.5rem;
    border-radius: 8px;
    border: 1px solid #2a2a3a;
    background: #16161e;
    color: #ccc;
    cursor: pointer;
    font-size: 0.85rem;
    text-align: center;
  }

  .sp-picker-cell:hover:not(:disabled) {
    border-color: #ff3e00;
    background: rgba(255, 62, 0, 0.1);
  }

  .sp-picker-active {
    background: #ff3e00 !important;
    color: #1a0802 !important;
    border-color: #ff3e00 !important;
    font-weight: 600;
  }

  .sp-picker-disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  /* Selects */
  .sp-select {
    flex: 1;
    padding: 0.4rem 0.5rem;
    border-radius: 6px;
    border: 1px solid #333;
    background: #16161e;
    color: #fff;
    font-size: 0.85rem;
    cursor: pointer;
  }

  /* Value */
  .sp-value {
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
  .sp-converter-row {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    gap: 0.75rem;
  }

  .sp-input,
  .sp-output {
    width: 100%;
    border: 1px solid #333;
    border-radius: 8px;
    padding: 0.65rem 0.75rem;
    background: #16161e;
    color: #fff;
    font-size: 0.85rem;
  }

  .sp-output {
    display: block;
  }

  .sp-arrow {
    color: #ff3e00;
    font-size: 1.2rem;
  }
</style>
