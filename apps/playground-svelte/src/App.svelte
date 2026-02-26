<script lang="ts">
  import { createCalendar } from '@thaparoyal/calendar-svelte';
  import { adToBs } from '@thaparoyal/calendar-core';
  import type { CalendarDate } from '@thaparoyal/calendar-core';

  // AD Calendar
  const adCalendar = createCalendar({ calendarType: 'AD' });
  let adDate: CalendarDate | null = null;

  // BS Calendar
  const bsCalendar = createCalendar({ calendarType: 'BS' });
  let bsDate: CalendarDate | null = null;

  // Converter
  let adInput = '2024-01-15';
  let convertedBs: CalendarDate | null = null;

  function handleConvert() {
    try {
      const [year, month, day] = adInput.split('-').map(Number);
      convertedBs = adToBs(new Date(year, month - 1, day));
    } catch {
      convertedBs = null;
    }
  }

  function formatDate(date: CalendarDate | null): string {
    if (!date) return 'No date selected';
    return `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')} (${date.calendarType})`;
  }

  function selectAdDate(date: CalendarDate) {
    adDate = date;
    adCalendar.actions.selectDate(date);
  }

  function selectBsDate(date: CalendarDate) {
    bsDate = date;
    bsCalendar.actions.selectDate(date);
  }
</script>

<div class="app">
  <!-- Header -->
  <header class="header">
    <div class="header-content">
      <a href="/" class="logo">
        <div class="logo-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
            <line x1="16" x2="16" y1="2" y2="6"/>
            <line x1="8" x2="8" y1="2" y2="6"/>
            <line x1="3" x2="21" y1="10" y2="10"/>
          </svg>
        </div>
        <span class="logo-text">@thaparoyal/calendar</span>
        <span class="logo-badge svelte">Svelte</span>
      </a>
      <div class="header-links">
        <a href="http://localhost:4321" class="header-link">Documentation</a>
        <a href="https://github.com/thaparoyal/calendar" class="header-link github-link" target="_blank" rel="noopener noreferrer">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          GitHub
        </a>
      </div>
    </div>
  </header>

  <!-- Main Content -->
  <main class="main">
    <!-- Hero -->
    <section class="hero">
      <h1 class="hero-title">Svelte Calendar Components</h1>
      <p class="hero-description">
        Beautiful, accessible calendar components for Svelte 4.
        Supporting both AD (Gregorian) and BS (Bikram Sambat) calendars.
      </p>
      <div class="hero-badges">
        <span class="badge">
          <span class="badge-dot ad"></span>
          AD Calendar
        </span>
        <span class="badge">
          <span class="badge-dot bs"></span>
          BS Calendar
        </span>
        <span class="badge">
          <span class="badge-dot svelte"></span>
          Svelte 4
        </span>
      </div>
    </section>

    <!-- Calendar Demos -->
    <section class="demos">
      <!-- AD Calendar -->
      <div class="demo-card">
        <div class="demo-header">
          <div>
            <h3 class="demo-title">AD Calendar</h3>
            <p class="demo-subtitle">Gregorian calendar system</p>
          </div>
          <span class="demo-tag">AD</span>
        </div>
        <div class="demo-content">
          <div class="calendar">
            <div class="calendar-header">
              <button
                class="calendar-nav-button"
                on:click={adCalendar.actions.prevMonth}
                disabled={$adCalendar.isPrevMonthDisabled}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="m15 18-6-6 6-6"/>
                </svg>
              </button>
              <span class="calendar-title">{$adCalendar.title}</span>
              <button
                class="calendar-nav-button"
                on:click={adCalendar.actions.nextMonth}
                disabled={$adCalendar.isNextMonthDisabled}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="m9 18 6-6-6-6"/>
                </svg>
              </button>
            </div>
            <table class="calendar-grid">
              <thead>
                <tr>
                  {#each $adCalendar.weekdayNames as day}
                    <th class="calendar-weekday">{day}</th>
                  {/each}
                </tr>
              </thead>
              <tbody>
                {#each $adCalendar.weeks as week}
                  <tr>
                    {#each week as day}
                      <td
                        class="calendar-cell"
                        class:today={day.isToday}
                        class:selected={day.isSelected}
                        class:outside={day.isOutsideMonth}
                        class:disabled={day.isDisabled}
                      >
                        <button
                          class="calendar-day"
                          on:click={() => !day.isDisabled && selectAdDate(day.date)}
                          disabled={day.isDisabled}
                        >
                          {day.date.day}
                        </button>
                      </td>
                    {/each}
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        </div>
        <div class="demo-footer">
          <span class="demo-value">
            <strong>Selected:</strong> {formatDate(adDate)}
          </span>
        </div>
      </div>

      <!-- BS Calendar -->
      <div class="demo-card">
        <div class="demo-header">
          <div>
            <h3 class="demo-title">BS Calendar</h3>
            <p class="demo-subtitle">Bikram Sambat (Nepali) calendar</p>
          </div>
          <span class="demo-tag">BS</span>
        </div>
        <div class="demo-content">
          <div class="calendar">
            <div class="calendar-header">
              <button
                class="calendar-nav-button"
                on:click={bsCalendar.actions.prevMonth}
                disabled={$bsCalendar.isPrevMonthDisabled}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="m15 18-6-6 6-6"/>
                </svg>
              </button>
              <span class="calendar-title">{$bsCalendar.title}</span>
              <button
                class="calendar-nav-button"
                on:click={bsCalendar.actions.nextMonth}
                disabled={$bsCalendar.isNextMonthDisabled}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="m9 18 6-6-6-6"/>
                </svg>
              </button>
            </div>
            <table class="calendar-grid">
              <thead>
                <tr>
                  {#each $bsCalendar.weekdayNames as day}
                    <th class="calendar-weekday">{day}</th>
                  {/each}
                </tr>
              </thead>
              <tbody>
                {#each $bsCalendar.weeks as week}
                  <tr>
                    {#each week as day}
                      <td
                        class="calendar-cell"
                        class:today={day.isToday}
                        class:selected={day.isSelected}
                        class:outside={day.isOutsideMonth}
                        class:disabled={day.isDisabled}
                      >
                        <button
                          class="calendar-day"
                          on:click={() => !day.isDisabled && selectBsDate(day.date)}
                          disabled={day.isDisabled}
                        >
                          {day.date.day}
                        </button>
                      </td>
                    {/each}
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        </div>
        <div class="demo-footer">
          <span class="demo-value">
            <strong>Selected:</strong> {formatDate(bsDate)}
          </span>
        </div>
      </div>
    </section>

    <!-- Converter Section -->
    <section class="converter-section">
      <h2 class="section-title">Date Converter</h2>
      <div class="converter-card">
        <div class="converter-grid">
          <div class="converter-input-group">
            <label class="converter-label">
              AD Date
              <span class="converter-label-badge">Gregorian</span>
            </label>
            <input
              type="date"
              class="converter-input"
              bind:value={adInput}
              on:blur={handleConvert}
            />
          </div>

          <div class="converter-arrow">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </div>

          <div class="converter-input-group">
            <label class="converter-label">
              BS Date
              <span class="converter-label-badge">Bikram Sambat</span>
            </label>
            <div class="converter-result">
              {convertedBs
                ? `${convertedBs.year}-${String(convertedBs.month).padStart(2, '0')}-${String(convertedBs.day).padStart(2, '0')}`
                : 'Enter AD date to convert'
              }
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>

  <!-- Footer -->
  <footer class="footer">
    <p>
      Built with <a href="https://github.com/thaparoyal/calendar">@thaparoyal/calendar</a>
      &bull;
      <a href="http://localhost:4321">Documentation</a>
      &bull;
      MIT License
    </p>
  </footer>
</div>

<style>
  /* Svelte-specific badge color */
  :global(.logo-badge.svelte) {
    background: rgba(255, 62, 0, 0.1);
    color: #ff3e00;
  }

  :global(.badge-dot.svelte) {
    background: #ff3e00;
  }

  /* Calendar component styles */
  .calendar {
    background: var(--bg-elevated);
    border: 1px solid var(--border-color);
    border-radius: var(--radius);
    padding: 1rem;
    width: 320px;
  }

  .calendar-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem 0 1rem;
  }

  .calendar-title {
    font-weight: 600;
    font-size: 1rem;
  }

  .calendar-nav-button {
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-sm);
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: var(--text-secondary);
    transition: all 0.2s;
  }

  .calendar-nav-button:hover:not(:disabled) {
    background: var(--bg-elevated);
    border-color: var(--border-hover);
    color: var(--text-primary);
  }

  .calendar-nav-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .calendar-grid {
    width: 100%;
    border-collapse: collapse;
  }

  .calendar-weekday {
    padding: 0.5rem;
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--text-muted);
    text-align: center;
  }

  .calendar-cell {
    padding: 0.125rem;
  }

  .calendar-day {
    width: 36px;
    height: 36px;
    border: none;
    background: transparent;
    border-radius: var(--radius-sm);
    cursor: pointer;
    font-size: 0.875rem;
    color: var(--text-primary);
    transition: all 0.2s;
  }

  .calendar-day:hover:not(:disabled) {
    background: var(--bg-tertiary);
  }

  .calendar-cell.today .calendar-day {
    background: var(--accent-muted);
    color: var(--accent);
    font-weight: 600;
  }

  .calendar-cell.selected .calendar-day {
    background: var(--accent);
    color: white;
    font-weight: 600;
  }

  .calendar-cell.outside .calendar-day {
    color: var(--text-muted);
  }

  .calendar-cell.disabled .calendar-day {
    color: var(--text-muted);
    cursor: not-allowed;
    opacity: 0.5;
  }
</style>
