<script lang="ts">
  import { onMount } from 'svelte';
  import { createCalendar } from '@thaparoyal/calendar-svelte';
  import { adToBs, toNepaliNumeral } from '@thaparoyal/calendar-core';
  import type { CalendarDate, Locale } from '@thaparoyal/calendar-core';

  // Themes
  const themes = [
    { id: 'default', label: 'Light' },
    { id: 'dark', label: 'Dark' },
    { id: 'nepal', label: 'Nepal' },
    { id: 'nepal-dark', label: 'Nepal Dark' },
    { id: 'ocean', label: 'Ocean' },
    { id: 'ocean-dark', label: 'Ocean Dark' },
    { id: 'forest', label: 'Forest' },
    { id: 'forest-dark', label: 'Forest Dark' },
    { id: 'sunset', label: 'Sunset' },
    { id: 'sunset-dark', label: 'Sunset Dark' },
    { id: 'royal', label: 'Royal' },
    { id: 'royal-dark', label: 'Royal Dark' },
  ];

  let theme = 'dark';
  let locale: Locale = 'en';

  // Apply theme
  $: if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', theme);
  }

  // AD Calendar
  const adCalendar = createCalendar({ config: { calendarType: 'AD', locale: 'en' } });
  let adDate: CalendarDate | null = null;

  // BS Calendar
  const bsCalendar = createCalendar({ config: { calendarType: 'BS', locale: 'en' } });
  let bsDate: CalendarDate | null = null;

  // BS Calendar with Nepali numerals
  const bsNepaliCalendar = createCalendar({ config: { calendarType: 'BS', locale: 'ne' } });
  let bsNepaliDate: CalendarDate | null = null;

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

  // Auto-convert on mount and input change
  $: if (adInput) handleConvert();

  function formatDate(date: CalendarDate | null, displayLocale: Locale = 'en'): string {
    if (!date) return displayLocale === 'ne' ? 'मिति छानिएको छैन' : 'No date selected';

    if (displayLocale === 'ne') {
      const nepYear = toNepaliNumeral(date.year);
      const nepMonth = toNepaliNumeral(date.month);
      const nepDay = toNepaliNumeral(date.day);
      return `${nepYear}-${nepMonth.padStart(2, '०')}-${nepDay.padStart(2, '०')} (${date.calendarType})`;
    }

    return `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')} (${date.calendarType})`;
  }

  function selectAdDate(date: CalendarDate) {
    adDate = date;
    adCalendar.selectDate(date);
  }

  function selectBsDate(date: CalendarDate) {
    bsDate = date;
    bsCalendar.selectDate(date);
  }

  function selectBsNepaliDate(date: CalendarDate) {
    bsNepaliDate = date;
    bsNepaliCalendar.selectDate(date);
  }

  // Computed text based on locale
  $: text = {
    title: locale === 'ne' ? 'Svelte पात्रो कम्पोनेन्टहरू' : 'Svelte Calendar Components',
    description: locale === 'ne'
      ? 'Svelte 4 को लागि सुन्दर, पहुँचयोग्य पात्रो कम्पोनेन्टहरू। AD (ग्रेगोरियन) र BS (विक्रम संवत) दुवै पात्रो समर्थन गर्दछ।'
      : 'Beautiful, accessible calendar components for Svelte 4. Supporting both AD (Gregorian) and BS (Bikram Sambat) calendars.',
    adCalendar: locale === 'ne' ? 'AD पात्रो' : 'AD Calendar',
    bsCalendar: locale === 'ne' ? 'BS पात्रो' : 'BS Calendar',
    nepaliNumerals: 'नेपाली अंकहरू',
    gregorian: locale === 'ne' ? 'ग्रेगोरियन पात्रो प्रणाली' : 'Gregorian calendar system',
    bikramSambat: locale === 'ne' ? 'विक्रम संवत (नेपाली) पात्रो' : 'Bikram Sambat (Nepali) calendar',
    devanagari: locale === 'ne' ? 'देवनागरी अंकहरूमा' : 'With Devanagari numerals',
    selected: locale === 'ne' ? 'छानिएको:' : 'Selected:',
    dateConverter: locale === 'ne' ? 'मिति रूपान्तरण' : 'Date Converter',
    adDate: locale === 'ne' ? 'AD मिति' : 'AD Date',
    bsDate: locale === 'ne' ? 'BS मिति' : 'BS Date',
    enterAdDate: locale === 'ne' ? 'रूपान्तरण गर्न AD मिति प्रविष्ट गर्नुहोस्' : 'Enter AD date to convert',
  };
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

      <div class="header-controls">
        <!-- Theme Selector -->
        <div class="control-group">
          <label class="control-label" for="theme-select">Theme</label>
          <select id="theme-select" class="control-select" bind:value={theme}>
            {#each themes as t}
              <option value={t.id}>{t.label}</option>
            {/each}
          </select>
        </div>

        <!-- Locale Selector -->
        <div class="control-group">
          <label class="control-label" for="locale-select">Locale</label>
          <select id="locale-select" class="control-select" bind:value={locale}>
            <option value="en">English</option>
            <option value="ne">नेपाली (Nepali)</option>
          </select>
        </div>
      </div>

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
      <h1 class="hero-title">{text.title}</h1>
      <p class="hero-description">{text.description}</p>
      <div class="hero-badges">
        <span class="badge">
          <span class="badge-dot ad"></span>
          {locale === 'ne' ? 'AD पात्रो' : 'AD Calendar'}
        </span>
        <span class="badge">
          <span class="badge-dot bs"></span>
          {locale === 'ne' ? 'BS पात्रो' : 'BS Calendar'}
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
            <h3 class="demo-title">{text.adCalendar}</h3>
            <p class="demo-subtitle">{text.gregorian}</p>
          </div>
          <span class="demo-tag">AD</span>
        </div>
        <div class="demo-content">
          <div class="calendar" data-locale={locale}>
            <div class="calendar-header">
              <button
                class="calendar-nav-button"
                on:click={adCalendar.prevMonth}
                disabled={$adCalendar.isPrevMonthDisabled}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="m15 18-6-6 6-6"/>
                </svg>
              </button>
              <span class="calendar-title">{$adCalendar.title}</span>
              <button
                class="calendar-nav-button"
                on:click={adCalendar.nextMonth}
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
                          {adCalendar.formatDayNumber(day.date.day)}
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
            <strong>{text.selected}</strong> {formatDate(adDate, locale)}
          </span>
        </div>
      </div>

      <!-- BS Calendar -->
      <div class="demo-card">
        <div class="demo-header">
          <div>
            <h3 class="demo-title">{text.bsCalendar}</h3>
            <p class="demo-subtitle">{text.bikramSambat}</p>
          </div>
          <span class="demo-tag">BS</span>
        </div>
        <div class="demo-content">
          <div class="calendar" data-locale={locale}>
            <div class="calendar-header">
              <button
                class="calendar-nav-button"
                on:click={bsCalendar.prevMonth}
                disabled={$bsCalendar.isPrevMonthDisabled}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="m15 18-6-6 6-6"/>
                </svg>
              </button>
              <span class="calendar-title">{$bsCalendar.title}</span>
              <button
                class="calendar-nav-button"
                on:click={bsCalendar.nextMonth}
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
                          {bsCalendar.formatDayNumber(day.date.day)}
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
            <strong>{text.selected}</strong> {formatDate(bsDate, locale)}
          </span>
        </div>
      </div>

      <!-- BS Calendar with Nepali Numerals -->
      <div class="demo-card">
        <div class="demo-header">
          <div>
            <h3 class="demo-title">{text.nepaliNumerals}</h3>
            <p class="demo-subtitle">{text.devanagari}</p>
          </div>
          <span class="demo-tag">नेपाली</span>
        </div>
        <div class="demo-content">
          <div class="calendar" data-locale="ne">
            <div class="calendar-header">
              <button
                class="calendar-nav-button"
                on:click={bsNepaliCalendar.prevMonth}
                disabled={$bsNepaliCalendar.isPrevMonthDisabled}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="m15 18-6-6 6-6"/>
                </svg>
              </button>
              <span class="calendar-title">{$bsNepaliCalendar.title}</span>
              <button
                class="calendar-nav-button"
                on:click={bsNepaliCalendar.nextMonth}
                disabled={$bsNepaliCalendar.isNextMonthDisabled}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="m9 18 6-6-6-6"/>
                </svg>
              </button>
            </div>
            <table class="calendar-grid">
              <thead>
                <tr>
                  {#each $bsNepaliCalendar.weekdayNames as day}
                    <th class="calendar-weekday">{day}</th>
                  {/each}
                </tr>
              </thead>
              <tbody>
                {#each $bsNepaliCalendar.weeks as week}
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
                          on:click={() => !day.isDisabled && selectBsNepaliDate(day.date)}
                          disabled={day.isDisabled}
                        >
                          {bsNepaliCalendar.formatDayNumber(day.date.day)}
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
            <strong>छानिएको:</strong> {formatDate(bsNepaliDate, 'ne')}
          </span>
        </div>
      </div>
    </section>

    <!-- Converter Section -->
    <section class="converter-section">
      <h2 class="section-title">{text.dateConverter}</h2>
      <div class="converter-card">
        <div class="converter-grid">
          <div class="converter-input-group">
            <label class="converter-label" for="ad-date-input">
              {text.adDate}
              <span class="converter-label-badge">{locale === 'ne' ? 'ग्रेगोरियन' : 'Gregorian'}</span>
            </label>
            <input
              id="ad-date-input"
              type="date"
              class="converter-input"
              bind:value={adInput}
            />
          </div>

          <div class="converter-arrow">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </div>

          <div class="converter-input-group">
            <span class="converter-label" aria-label="{text.bsDate}">
              {text.bsDate}
              <span class="converter-label-badge">{locale === 'ne' ? 'विक्रम संवत' : 'Bikram Sambat'}</span>
            </span>
            <div class="converter-result" role="status" aria-live="polite">
              {convertedBs
                ? locale === 'ne'
                  ? `${toNepaliNumeral(convertedBs.year)}-${toNepaliNumeral(convertedBs.month).padStart(2, '०')}-${toNepaliNumeral(convertedBs.day).padStart(2, '०')}`
                  : `${convertedBs.year}-${String(convertedBs.month).padStart(2, '0')}-${String(convertedBs.day).padStart(2, '0')}`
                : text.enterAdDate
              }
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>

  <!-- Footer -->
  <footer class="footer">
    {#if locale === 'ne'}
      <p>
        <a href="https://github.com/thaparoyal/calendar">@thaparoyal/calendar</a>
        द्वारा निर्मित
        &bull;
        <a href="http://localhost:4321">कागजात</a>
        &bull;
        MIT लाइसेन्स
      </p>
    {:else}
      <p>
        Built with <a href="https://github.com/thaparoyal/calendar">@thaparoyal/calendar</a>
        &bull;
        <a href="http://localhost:4321">Documentation</a>
        &bull;
        MIT License
      </p>
    {/if}
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
    background: var(--trc-background-elevated);
    border: 1px solid var(--trc-border);
    border-radius: var(--trc-radius-lg);
    padding: 1rem;
    width: 320px;
    font-family: 'Inter', 'Noto Sans Devanagari', sans-serif;
  }

  .calendar[data-locale="ne"] {
    font-family: 'Noto Sans Devanagari', 'Inter', sans-serif;
  }

  .calendar-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem 0 1rem;
    border-bottom: 1px solid var(--trc-border);
    margin-bottom: 0.5rem;
  }

  .calendar-title {
    font-weight: 600;
    font-size: 1rem;
    color: var(--trc-foreground);
  }

  .calendar-nav-button {
    background: var(--trc-background-secondary);
    border: 1px solid var(--trc-border);
    border-radius: var(--trc-radius);
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: var(--trc-foreground-secondary);
    transition: all 0.2s;
  }

  .calendar-nav-button:hover:not(:disabled) {
    background: var(--trc-primary-muted);
    border-color: var(--trc-primary);
    color: var(--trc-primary);
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
    font-weight: 600;
    color: var(--trc-foreground-muted);
    text-align: center;
    text-transform: uppercase;
    letter-spacing: 0.025em;
  }

  .calendar[data-locale="ne"] .calendar-weekday {
    text-transform: none;
    letter-spacing: 0;
    font-size: 0.8125rem;
  }

  .calendar-cell {
    padding: 0.125rem;
  }

  .calendar-day {
    width: 36px;
    height: 36px;
    border: none;
    background: transparent;
    border-radius: var(--trc-radius);
    cursor: pointer;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--trc-foreground);
    transition: all 0.2s;
  }

  .calendar[data-locale="ne"] .calendar-day {
    font-size: 0.9375rem;
  }

  .calendar-day:hover:not(:disabled) {
    background: var(--trc-background-tertiary);
  }

  .calendar-cell.today .calendar-day {
    background: var(--trc-primary-muted);
    color: var(--trc-primary);
    font-weight: 600;
  }

  .calendar-cell.selected .calendar-day {
    background: var(--trc-primary);
    color: var(--trc-primary-foreground);
    font-weight: 600;
  }

  .calendar-cell.outside .calendar-day {
    color: var(--trc-foreground-muted);
    opacity: 0.5;
  }

  .calendar-cell.disabled .calendar-day {
    color: var(--trc-foreground-muted);
    cursor: not-allowed;
    opacity: 0.35;
  }
</style>
