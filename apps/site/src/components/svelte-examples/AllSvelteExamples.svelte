<script>
  import { onMount, onDestroy } from 'svelte';
  import { derived } from 'svelte/store';
  import {
    createCalendar,
    createSelection,
    createDatePicker,
    createMultiCalendar,
  } from '@thaparoyal/calendar-svelte';
  import '@thaparoyal/calendar-core/themes/themes.css';

  // ---------------------------------------------------------------------------
  // Shared
  // ---------------------------------------------------------------------------

  const THEMES = [
    'default', 'ocean', 'forest', 'sunset', 'lavender', 'midnight',
    'rose', 'mint', 'amber', 'slate', 'coral', 'indigo',
  ];

  function fmtDate(d) {
    if (!d) return 'None';
    return `${d.year}-${String(d.month).padStart(2, '0')}-${String(d.day).padStart(2, '0')} (${d.calendarType})`;
  }

  // ---------------------------------------------------------------------------
  // 1. Single Select BS
  // ---------------------------------------------------------------------------
  const bsCal = createCalendar({
    config: { calendarType: 'BS', locale: 'en' },
  });
  const bsWeeks = bsCal.weeks;
  const bsTitle = bsCal.title;
  const bsWeekdayNames = bsCal.weekdayNames;
  const bsPrevDisabled = bsCal.isPrevMonthDisabled;
  const bsNextDisabled = bsCal.isNextMonthDisabled;
  const bsSelected = bsCal.selectedDate;

  // ---------------------------------------------------------------------------
  // 2. Single Select AD
  // ---------------------------------------------------------------------------
  const adCal = createCalendar({
    config: { calendarType: 'AD', locale: 'en' },
  });
  const adWeeks = adCal.weeks;
  const adTitle = adCal.title;
  const adWeekdayNames = adCal.weekdayNames;
  const adPrevDisabled = adCal.isPrevMonthDisabled;
  const adNextDisabled = adCal.isNextMonthDisabled;
  const adSelected = adCal.selectedDate;

  // ---------------------------------------------------------------------------
  // 3. Nepali Numerals
  // ---------------------------------------------------------------------------
  const nepaliCal = createCalendar({
    config: { calendarType: 'BS', locale: 'ne' },
  });
  const neWeeks = nepaliCal.weeks;
  const neTitle = nepaliCal.title;
  const neWeekdayNames = nepaliCal.weekdayNames;
  const nePrevDisabled = nepaliCal.isPrevMonthDisabled;
  const neNextDisabled = nepaliCal.isNextMonthDisabled;
  const neSelected = nepaliCal.selectedDate;

  // ---------------------------------------------------------------------------
  // 4. Month Picker
  // ---------------------------------------------------------------------------
  const mpCal = createCalendar({
    config: { calendarType: 'BS', locale: 'en' },
  });
  const mpWeeks = mpCal.weeks;
  const mpTitle = mpCal.title;
  const mpWeekdayNames = mpCal.weekdayNames;
  const mpPrevDisabled = mpCal.isPrevMonthDisabled;
  const mpNextDisabled = mpCal.isNextMonthDisabled;
  const mpViewMode = mpCal.viewMode;
  const mpMonthItems = mpCal.monthPickerItems;
  const mpState = mpCal.state;

  // ---------------------------------------------------------------------------
  // 5. Year Picker
  // ---------------------------------------------------------------------------
  const ypCal = createCalendar({
    config: { calendarType: 'BS', locale: 'en' },
  });
  const ypWeeks = ypCal.weeks;
  const ypTitle = ypCal.title;
  const ypWeekdayNames = ypCal.weekdayNames;
  const ypPrevDisabled = ypCal.isPrevMonthDisabled;
  const ypNextDisabled = ypCal.isNextMonthDisabled;
  const ypViewMode = ypCal.viewMode;
  const ypMonthItems = ypCal.monthPickerItems;
  const ypYearItems = ypCal.yearPickerItems;
  const ypDecadeRange = ypCal.decadeRange;
  const ypState = ypCal.state;

  // ---------------------------------------------------------------------------
  // 6. Range Selection
  // ---------------------------------------------------------------------------
  const rangeSel = createSelection({
    mode: 'range',
    config: { calendarType: 'BS', locale: 'en' },
  });
  const rngWeeks = rangeSel.weeks;
  const rngTitle = rangeSel.title;
  const rngWeekdayNames = rangeSel.weekdayNames;
  const rngPrevDisabled = rangeSel.isPrevMonthDisabled;
  const rngNextDisabled = rangeSel.isNextMonthDisabled;
  const rngValue = rangeSel.value;

  $: rangeVal = ($rngValue && typeof $rngValue === 'object' && 'start' in $rngValue)
    ? $rngValue
    : null;

  // ---------------------------------------------------------------------------
  // 7. Multi-Date Selection
  // ---------------------------------------------------------------------------
  const multiSel = createSelection({
    mode: 'multiple',
    config: { calendarType: 'BS', locale: 'en' },
  });
  const mdWeeks = multiSel.weeks;
  const mdTitle = multiSel.title;
  const mdWeekdayNames = multiSel.weekdayNames;
  const mdPrevDisabled = multiSel.isPrevMonthDisabled;
  const mdNextDisabled = multiSel.isNextMonthDisabled;
  const mdValue = multiSel.value;

  $: multiDateVal = Array.isArray($mdValue) ? $mdValue : [];

  // ---------------------------------------------------------------------------
  // 8. Multi-Calendar 2 months
  // ---------------------------------------------------------------------------
  const mc2 = createMultiCalendar({
    numberOfMonths: 2,
    mode: 'single',
    config: { calendarType: 'BS', locale: 'en' },
  });
  const mc2Months = mc2.months;
  const mc2WeekdayNames = mc2.weekdayNames;
  const mc2PrevDisabled = mc2.isPrevDisabled;
  const mc2NextDisabled = mc2.isNextDisabled;
  const mc2Value = mc2.value;

  $: mc2Val = ($mc2Value && !Array.isArray($mc2Value) && !($mc2Value && typeof $mc2Value === 'object' && 'start' in $mc2Value))
    ? $mc2Value
    : null;

  // ---------------------------------------------------------------------------
  // 9. Multi-Calendar 3 months
  // ---------------------------------------------------------------------------
  const mc3 = createMultiCalendar({
    numberOfMonths: 3,
    mode: 'single',
    config: { calendarType: 'BS', locale: 'en' },
  });
  const mc3Months = mc3.months;
  const mc3WeekdayNames = mc3.weekdayNames;
  const mc3PrevDisabled = mc3.isPrevDisabled;
  const mc3NextDisabled = mc3.isNextDisabled;
  const mc3Value = mc3.value;

  $: mc3Val = ($mc3Value && !Array.isArray($mc3Value) && !($mc3Value && typeof $mc3Value === 'object' && 'start' in $mc3Value))
    ? $mc3Value
    : null;

  // ---------------------------------------------------------------------------
  // 10. Date Picker
  // ---------------------------------------------------------------------------
  const dp = createDatePicker({
    config: { calendarType: 'BS', locale: 'en' },
  });
  const dpIsOpen = dp.isOpen;
  const dpInputValue = dp.inputValue;
  const dpSelectedDate = dp.selectedDate;
  const dpWeeks = dp.weeks;
  const dpTitle = dp.title;
  const dpWeekdayNames = dp.weekdayNames;
  const dpPrevDisabled = dp.isPrevMonthDisabled;
  const dpNextDisabled = dp.isNextMonthDisabled;

  let dpEl;

  function handleClickOutside(e) {
    if (dpEl && !dpEl.contains(e.target) && $dpIsOpen) {
      dp.close();
    }
  }

  onMount(() => document.addEventListener('click', handleClickOutside));
  onDestroy(() => document.removeEventListener('click', handleClickOutside));

  // ---------------------------------------------------------------------------
  // 11. Disabled Dates
  // ---------------------------------------------------------------------------
  const disabledDates = [
    { year: 2082, month: 10, day: 5, calendarType: 'BS' },
    { year: 2082, month: 10, day: 10, calendarType: 'BS' },
    { year: 2082, month: 10, day: 15, calendarType: 'BS' },
    { year: 2082, month: 10, day: 20, calendarType: 'BS' },
    { year: 2082, month: 10, day: 25, calendarType: 'BS' },
  ];
  const disCal = createCalendar({
    config: { calendarType: 'BS', locale: 'en' },
    defaultValue: { year: 2082, month: 10, day: 1, calendarType: 'BS' },
    disabledDates,
  });
  const disWeeks = disCal.weeks;
  const disTitle = disCal.title;
  const disWeekdayNames = disCal.weekdayNames;
  const disPrevDisabled = disCal.isPrevMonthDisabled;
  const disNextDisabled = disCal.isNextMonthDisabled;
  const disSelected = disCal.selectedDate;

  // ---------------------------------------------------------------------------
  // 12. Min/Max Date Constraints
  // ---------------------------------------------------------------------------
  const mmCal = createCalendar({
    config: {
      calendarType: 'BS',
      locale: 'en',
      minDate: { year: 2082, month: 10, day: 1, calendarType: 'BS' },
      maxDate: { year: 2082, month: 10, day: 28, calendarType: 'BS' },
    },
    defaultValue: { year: 2082, month: 10, day: 1, calendarType: 'BS' },
  });
  const mmWeeks = mmCal.weeks;
  const mmTitle = mmCal.title;
  const mmWeekdayNames = mmCal.weekdayNames;
  const mmPrevDisabled = mmCal.isPrevMonthDisabled;
  const mmNextDisabled = mmCal.isNextMonthDisabled;
  const mmSelected = mmCal.selectedDate;

  // ---------------------------------------------------------------------------
  // 13. Week Starts Monday
  // ---------------------------------------------------------------------------
  const monCal = createCalendar({
    config: { calendarType: 'BS', locale: 'en', weekStartsOn: 1 },
  });
  const monWeeks = monCal.weeks;
  const monTitle = monCal.title;
  const monWeekdayNames = monCal.weekdayNames;
  const monPrevDisabled = monCal.isPrevMonthDisabled;
  const monNextDisabled = monCal.isNextMonthDisabled;

  // ---------------------------------------------------------------------------
  // 14. Themes Showcase
  // ---------------------------------------------------------------------------
  const themeStores = THEMES.map((theme) => {
    const cal = createCalendar({ config: { calendarType: 'BS', locale: 'en' } });
    return { theme, cal };
  });

  // Build a derived store that combines all theme calendar data into a single
  // reactive array. This avoids the issue of using $store syntax inside {#each}
  // on non-top-level store references.
  const themeCalendarsData = derived(
    themeStores.map(tc => tc.cal.weeks),
    (allWeeks) => allWeeks.map((weeks, i) => ({
      theme: themeStores[i].theme,
      weeks,
      cal: themeStores[i].cal,
    }))
  );

  // Also derive the shared data per theme calendar
  const themeCalTitles = derived(
    themeStores.map(tc => tc.cal.title),
    (titles) => titles
  );
  const themeCalWeekdayNames = derived(
    themeStores.map(tc => tc.cal.weekdayNames),
    (names) => names
  );
  const themeCalPrevDisabled = derived(
    themeStores.map(tc => tc.cal.isPrevMonthDisabled),
    (vals) => vals
  );
  const themeCalNextDisabled = derived(
    themeStores.map(tc => tc.cal.isNextMonthDisabled),
    (vals) => vals
  );

  // ---------------------------------------------------------------------------
  // 15. Controlled Component
  // ---------------------------------------------------------------------------
  const ctrlCal = createCalendar({
    config: { calendarType: 'BS', locale: 'en' },
  });
  const ctrlWeeks = ctrlCal.weeks;
  const ctrlTitle = ctrlCal.title;
  const ctrlWeekdayNames = ctrlCal.weekdayNames;
  const ctrlPrevDisabled = ctrlCal.isPrevMonthDisabled;
  const ctrlNextDisabled = ctrlCal.isNextMonthDisabled;
  const ctrlSelected = ctrlCal.selectedDate;

  function setControlled(year, month, day) {
    ctrlCal.selectedDate.set({ year, month, day, calendarType: 'BS' });
    ctrlCal.focusDate({ year, month, day, calendarType: 'BS' });
  }

  function clearControlled() {
    ctrlCal.selectedDate.set(null);
  }
</script>

<div class="ase-page">
  <div class="ase-container">
    <h1 class="ase-heading">All Svelte Examples</h1>
    <p class="ase-subheading">
      Comprehensive showcase of every feature in
      <code class="ase-code-inline">@thaparoyal/calendar-svelte</code>.
      Each card demonstrates a distinct capability using headless stores.
    </p>

    <div class="ase-grid">

      <!-- 1. Single Select BS -->
      <div class="ase-card" data-theme="default">
        <h3 class="ase-card-title">1. Single Select (BS Calendar)</h3>
        <p class="ase-card-desc">Basic Bikram Sambat calendar with single date selection.</p>
        <div class="trc-calendar">
          <div class="trc-calendar-header">
            <button class="trc-calendar-nav-button" on:click={bsCal.prevMonth} disabled={$bsPrevDisabled}>&#8249;</button>
            <span class="trc-calendar-title">{$bsTitle}</span>
            <button class="trc-calendar-nav-button" on:click={bsCal.nextMonth} disabled={$bsNextDisabled}>&#8250;</button>
          </div>
          <table class="trc-calendar-grid">
            <thead class="trc-calendar-grid-head"><tr>
              {#each $bsWeekdayNames as d}
                <th class="trc-calendar-weekday">{d}</th>
              {/each}
            </tr></thead>
            <tbody>
              {#each $bsWeeks as week}
                <tr class="trc-calendar-week">
                  {#each week as day}
                    <td class="trc-calendar-cell"
                      class:trc-calendar-cell-today={day.isToday}
                      class:trc-calendar-cell-selected={day.isSelected}
                      class:trc-calendar-cell-outside={day.isOutsideMonth}
                      class:trc-calendar-cell-disabled={day.isDisabled}>
                      <button class="trc-calendar-day" disabled={day.isDisabled || day.isOutsideMonth} on:click={() => bsCal.selectDate(day.date)}>{bsCal.formatDayNumber(day.date.day)}</button>
                    </td>
                  {/each}
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
        <div class="ase-value-box">Selected: {fmtDate($bsSelected)}</div>
      </div>

      <!-- 2. Single Select AD -->
      <div class="ase-card" data-theme="ocean">
        <h3 class="ase-card-title">2. Single Select (AD Calendar)</h3>
        <p class="ase-card-desc">Standard Gregorian (AD) calendar with single date selection.</p>
        <div class="trc-calendar">
          <div class="trc-calendar-header">
            <button class="trc-calendar-nav-button" on:click={adCal.prevMonth} disabled={$adPrevDisabled}>&#8249;</button>
            <span class="trc-calendar-title">{$adTitle}</span>
            <button class="trc-calendar-nav-button" on:click={adCal.nextMonth} disabled={$adNextDisabled}>&#8250;</button>
          </div>
          <table class="trc-calendar-grid">
            <thead class="trc-calendar-grid-head"><tr>
              {#each $adWeekdayNames as d}
                <th class="trc-calendar-weekday">{d}</th>
              {/each}
            </tr></thead>
            <tbody>
              {#each $adWeeks as week}
                <tr class="trc-calendar-week">
                  {#each week as day}
                    <td class="trc-calendar-cell"
                      class:trc-calendar-cell-today={day.isToday}
                      class:trc-calendar-cell-selected={day.isSelected}
                      class:trc-calendar-cell-outside={day.isOutsideMonth}
                      class:trc-calendar-cell-disabled={day.isDisabled}>
                      <button class="trc-calendar-day" disabled={day.isDisabled || day.isOutsideMonth} on:click={() => adCal.selectDate(day.date)}>{adCal.formatDayNumber(day.date.day)}</button>
                    </td>
                  {/each}
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
        <div class="ase-value-box">Selected: {fmtDate($adSelected)}</div>
      </div>

      <!-- 3. Nepali Numerals -->
      <div class="ase-card" data-theme="sunset">
        <h3 class="ase-card-title">3. Nepali Numerals</h3>
        <p class="ase-card-desc">BS calendar rendered with Nepali (Devanagari) numerals via <code>locale: 'ne'</code>.</p>
        <div class="trc-calendar" data-locale="ne">
          <div class="trc-calendar-header">
            <button class="trc-calendar-nav-button" on:click={nepaliCal.prevMonth} disabled={$nePrevDisabled}>&#8249;</button>
            <span class="trc-calendar-title">{$neTitle}</span>
            <button class="trc-calendar-nav-button" on:click={nepaliCal.nextMonth} disabled={$neNextDisabled}>&#8250;</button>
          </div>
          <table class="trc-calendar-grid">
            <thead class="trc-calendar-grid-head"><tr>
              {#each $neWeekdayNames as d}
                <th class="trc-calendar-weekday">{d}</th>
              {/each}
            </tr></thead>
            <tbody>
              {#each $neWeeks as week}
                <tr class="trc-calendar-week">
                  {#each week as day}
                    <td class="trc-calendar-cell"
                      class:trc-calendar-cell-today={day.isToday}
                      class:trc-calendar-cell-selected={day.isSelected}
                      class:trc-calendar-cell-outside={day.isOutsideMonth}
                      class:trc-calendar-cell-disabled={day.isDisabled}>
                      <button class="trc-calendar-day" disabled={day.isDisabled || day.isOutsideMonth} on:click={() => nepaliCal.selectDate(day.date)}>{nepaliCal.formatDayNumber(day.date.day)}</button>
                    </td>
                  {/each}
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
        <div class="ase-value-box">Selected: {fmtDate($neSelected)}</div>
      </div>

      <!-- 4. Month Picker -->
      <div class="ase-card" data-theme="forest">
        <h3 class="ase-card-title">4. Month Picker</h3>
        <p class="ase-card-desc">Click the title text to toggle month picker view.</p>
        <div class="trc-calendar">
          <div class="trc-calendar-header">
            <button class="trc-calendar-nav-button"
              on:click={() => $mpViewMode === 'day' ? mpCal.prevMonth() : mpCal.prevYear()}
              disabled={$mpPrevDisabled}>&#8249;</button>
            <button class="trc-calendar-title trc-calendar-title-clickable"
              on:click={() => mpCal.setViewMode($mpViewMode === 'day' ? 'month' : 'day')}>
              {$mpTitle}
            </button>
            <button class="trc-calendar-nav-button"
              on:click={() => $mpViewMode === 'day' ? mpCal.nextMonth() : mpCal.nextYear()}
              disabled={$mpNextDisabled}>&#8250;</button>
          </div>
          <!-- Day view -->
          {#if $mpViewMode === 'day'}
            <table class="trc-calendar-grid">
              <thead class="trc-calendar-grid-head"><tr>
                {#each $mpWeekdayNames as d}
                  <th class="trc-calendar-weekday">{d}</th>
                {/each}
              </tr></thead>
              <tbody>
                {#each $mpWeeks as week}
                  <tr class="trc-calendar-week">
                    {#each week as day}
                      <td class="trc-calendar-cell"
                        class:trc-calendar-cell-today={day.isToday}
                        class:trc-calendar-cell-selected={day.isSelected}
                        class:trc-calendar-cell-outside={day.isOutsideMonth}>
                        <button class="trc-calendar-day" disabled={day.isDisabled || day.isOutsideMonth} on:click={() => mpCal.selectDate(day.date)}>{mpCal.formatDayNumber(day.date.day)}</button>
                      </td>
                    {/each}
                  </tr>
                {/each}
              </tbody>
            </table>
          {/if}
          <!-- Month picker -->
          {#if $mpViewMode === 'month'}
            <div class="trc-calendar-month-picker trc-calendar-view-transition">
              {#each $mpMonthItems as m}
                <button
                  class="trc-calendar-month-cell"
                  class:trc-calendar-month-cell-current={m.isCurrentMonth}
                  disabled={m.disabled}
                  on:click={() => { mpCal.focusDate({ year: $mpState.focusedDate.year, month: m.month, day: 1, calendarType: 'BS' }); mpCal.setViewMode('day'); }}
                >{m.shortName}</button>
              {/each}
            </div>
          {/if}
        </div>
      </div>

      <!-- 5. Year Picker -->
      <div class="ase-card" data-theme="lavender">
        <h3 class="ase-card-title">5. Year Picker</h3>
        <p class="ase-card-desc">Click the title to cycle: day -> month -> year views.</p>
        <div class="trc-calendar">
          <div class="trc-calendar-header">
            <button class="trc-calendar-nav-button"
              on:click={() => $ypViewMode === 'day' ? ypCal.prevMonth() : ypCal.prevYear()}
              disabled={$ypPrevDisabled}>&#8249;</button>
            <button class="trc-calendar-title trc-calendar-title-clickable"
              on:click={() => ypCal.setViewMode($ypViewMode === 'day' ? 'month' : $ypViewMode === 'month' ? 'year' : 'day')}>
              {$ypViewMode === 'year' ? `${$ypDecadeRange.start} - ${$ypDecadeRange.end}` : $ypTitle}
            </button>
            <button class="trc-calendar-nav-button"
              on:click={() => $ypViewMode === 'day' ? ypCal.nextMonth() : ypCal.nextYear()}
              disabled={$ypNextDisabled}>&#8250;</button>
          </div>
          <!-- Day view -->
          {#if $ypViewMode === 'day'}
            <table class="trc-calendar-grid">
              <thead class="trc-calendar-grid-head"><tr>
                {#each $ypWeekdayNames as d}
                  <th class="trc-calendar-weekday">{d}</th>
                {/each}
              </tr></thead>
              <tbody>
                {#each $ypWeeks as week}
                  <tr class="trc-calendar-week">
                    {#each week as day}
                      <td class="trc-calendar-cell"
                        class:trc-calendar-cell-today={day.isToday}
                        class:trc-calendar-cell-selected={day.isSelected}
                        class:trc-calendar-cell-outside={day.isOutsideMonth}>
                        <button class="trc-calendar-day" disabled={day.isDisabled || day.isOutsideMonth} on:click={() => ypCal.selectDate(day.date)}>{ypCal.formatDayNumber(day.date.day)}</button>
                      </td>
                    {/each}
                  </tr>
                {/each}
              </tbody>
            </table>
          {/if}
          <!-- Month picker -->
          {#if $ypViewMode === 'month'}
            <div class="trc-calendar-month-picker trc-calendar-view-transition">
              {#each $ypMonthItems as m}
                <button
                  class="trc-calendar-month-cell"
                  class:trc-calendar-month-cell-current={m.isCurrentMonth}
                  disabled={m.disabled}
                  on:click={() => { ypCal.focusDate({ year: $ypState.focusedDate.year, month: m.month, day: 1, calendarType: 'BS' }); ypCal.setViewMode('day'); }}
                >{m.shortName}</button>
              {/each}
            </div>
          {/if}
          <!-- Year picker -->
          {#if $ypViewMode === 'year'}
            <div class="trc-calendar-year-picker trc-calendar-view-transition">
              {#each $ypYearItems as y}
                <button
                  class="trc-calendar-year-cell"
                  class:trc-calendar-year-cell-current={y.isCurrentYear}
                  disabled={y.disabled}
                  on:click={() => { ypCal.focusDate({ year: y.year, month: $ypState.focusedDate.month, day: 1, calendarType: 'BS' }); ypCal.setViewMode('month'); }}
                >{y.year}</button>
              {/each}
            </div>
          {/if}
        </div>
      </div>

      <!-- 6. Range Selection -->
      <div class="ase-card" data-theme="rose">
        <h3 class="ase-card-title">6. Range Selection</h3>
        <p class="ase-card-desc">Select a start and end date. Click once for start, hover to preview, click again for end.</p>
        <div class="trc-calendar">
          <div class="trc-calendar-header">
            <button class="trc-calendar-nav-button" on:click={rangeSel.prevMonth} disabled={$rngPrevDisabled}>&#8249;</button>
            <span class="trc-calendar-title">{$rngTitle}</span>
            <button class="trc-calendar-nav-button" on:click={rangeSel.nextMonth} disabled={$rngNextDisabled}>&#8250;</button>
          </div>
          <table class="trc-calendar-grid">
            <thead class="trc-calendar-grid-head"><tr>
              {#each $rngWeekdayNames as d}
                <th class="trc-calendar-weekday">{d}</th>
              {/each}
            </tr></thead>
            <tbody>
              {#each $rngWeeks as week}
                <tr class="trc-calendar-week">
                  {#each week as day}
                    <td class="trc-calendar-cell"
                      class:trc-calendar-cell-today={day.isToday}
                      class:trc-calendar-cell-outside={day.isOutsideMonth}
                      class:trc-calendar-cell-disabled={day.isDisabled}
                      class:trc-calendar-cell-range-start={day.isRangeStart}
                      class:trc-calendar-cell-range-end={day.isRangeEnd}
                      class:trc-calendar-cell-range-middle={day.isInRange}
                      class:trc-calendar-cell-range-hover={day.isRangeHover}>
                      <button class="trc-calendar-day" disabled={day.isDisabled || day.isOutsideMonth}
                        on:click={() => rangeSel.select(day.date)}
                        on:mouseenter={() => rangeSel.hover(day.date)}>
                        {rangeSel.formatDayNumber(day.date.day)}
                      </button>
                    </td>
                  {/each}
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
        <div class="ase-value-box">
          Start: {fmtDate(rangeVal?.start)} | End: {fmtDate(rangeVal?.end)}
        </div>
      </div>

      <!-- 7. Multi-Date Selection -->
      <div class="ase-card" data-theme="mint">
        <h3 class="ase-card-title">7. Multi-Date Selection</h3>
        <p class="ase-card-desc">Select multiple individual dates using <code>createSelection</code> with <code>mode: 'multiple'</code>.</p>
        <div class="trc-calendar">
          <div class="trc-calendar-header">
            <button class="trc-calendar-nav-button" on:click={multiSel.prevMonth} disabled={$mdPrevDisabled}>&#8249;</button>
            <span class="trc-calendar-title">{$mdTitle}</span>
            <button class="trc-calendar-nav-button" on:click={multiSel.nextMonth} disabled={$mdNextDisabled}>&#8250;</button>
          </div>
          <table class="trc-calendar-grid">
            <thead class="trc-calendar-grid-head"><tr>
              {#each $mdWeekdayNames as d}
                <th class="trc-calendar-weekday">{d}</th>
              {/each}
            </tr></thead>
            <tbody>
              {#each $mdWeeks as week}
                <tr class="trc-calendar-week">
                  {#each week as day}
                    <td class="trc-calendar-cell"
                      class:trc-calendar-cell-today={day.isToday}
                      class:trc-calendar-cell-outside={day.isOutsideMonth}
                      class:trc-calendar-cell-disabled={day.isDisabled}
                      class:trc-calendar-cell-multi-selected={day.isMultiSelected}>
                      <button class="trc-calendar-day" disabled={day.isDisabled || day.isOutsideMonth}
                        on:click={() => multiSel.toggle(day.date)}>
                        {multiSel.formatDayNumber(day.date.day)}
                      </button>
                    </td>
                  {/each}
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
        <div class="ase-value-box">
          Selected ({multiDateVal.length}):
          {multiDateVal.length > 0 ? multiDateVal.map(d => fmtDate(d)).join(', ') : 'None'}
        </div>
      </div>

      <!-- 8. Multi-Calendar 2 Months -->
      <div class="ase-card ase-card-wide" data-theme="amber">
        <h3 class="ase-card-title">8. Multi-Calendar (2 Months)</h3>
        <p class="ase-card-desc">Display two consecutive months side by side with <code>numberOfMonths: 2</code>.</p>
        <div class="trc-calendar">
          <div class="trc-calendar-header">
            <button class="trc-calendar-nav-button" on:click={mc2.prevMonth} disabled={$mc2PrevDisabled}>&#8249;</button>
            <span class="trc-calendar-title">
              {$mc2Months[0]?.title} &mdash; {$mc2Months[$mc2Months.length - 1]?.title}
            </span>
            <button class="trc-calendar-nav-button" on:click={mc2.nextMonth} disabled={$mc2NextDisabled}>&#8250;</button>
          </div>
          <div class="trc-multi-calendar">
            {#each $mc2Months as m}
              <div class="trc-multi-calendar-month">
                <div class="ase-month-title">{m.title}</div>
                <table class="trc-calendar-grid">
                  <thead class="trc-calendar-grid-head"><tr>
                    {#each $mc2WeekdayNames as d}
                      <th class="trc-calendar-weekday">{d}</th>
                    {/each}
                  </tr></thead>
                  <tbody>
                    {#each m.weeks as week}
                      <tr class="trc-calendar-week">
                        {#each week as day}
                          <td class="trc-calendar-cell"
                            class:trc-calendar-cell-today={day.isToday}
                            class:trc-calendar-cell-selected={day.isSelected}
                            class:trc-calendar-cell-outside={day.isOutsideMonth}
                            class:trc-calendar-cell-disabled={day.isDisabled}>
                            <button class="trc-calendar-day" disabled={day.isDisabled || day.isOutsideMonth} on:click={() => mc2.select(day.date)}>{mc2.formatDayNumber(day.date.day)}</button>
                          </td>
                        {/each}
                      </tr>
                    {/each}
                  </tbody>
                </table>
              </div>
            {/each}
          </div>
        </div>
        <div class="ase-value-box">Selected: {fmtDate(mc2Val)}</div>
      </div>

      <!-- 9. Multi-Calendar 3 Months -->
      <div class="ase-card ase-card-wide" data-theme="slate">
        <h3 class="ase-card-title">9. Multi-Calendar (3 Months)</h3>
        <p class="ase-card-desc">Three consecutive months with <code>numberOfMonths: 3</code>.</p>
        <div class="trc-calendar">
          <div class="trc-calendar-header">
            <button class="trc-calendar-nav-button" on:click={mc3.prevMonth} disabled={$mc3PrevDisabled}>&#8249;</button>
            <span class="trc-calendar-title">
              {$mc3Months[0]?.title} &mdash; {$mc3Months[$mc3Months.length - 1]?.title}
            </span>
            <button class="trc-calendar-nav-button" on:click={mc3.nextMonth} disabled={$mc3NextDisabled}>&#8250;</button>
          </div>
          <div class="trc-multi-calendar">
            {#each $mc3Months as m}
              <div class="trc-multi-calendar-month">
                <div class="ase-month-title">{m.title}</div>
                <table class="trc-calendar-grid">
                  <thead class="trc-calendar-grid-head"><tr>
                    {#each $mc3WeekdayNames as d}
                      <th class="trc-calendar-weekday">{d}</th>
                    {/each}
                  </tr></thead>
                  <tbody>
                    {#each m.weeks as week}
                      <tr class="trc-calendar-week">
                        {#each week as day}
                          <td class="trc-calendar-cell"
                            class:trc-calendar-cell-today={day.isToday}
                            class:trc-calendar-cell-selected={day.isSelected}
                            class:trc-calendar-cell-outside={day.isOutsideMonth}
                            class:trc-calendar-cell-disabled={day.isDisabled}>
                            <button class="trc-calendar-day" disabled={day.isDisabled || day.isOutsideMonth} on:click={() => mc3.select(day.date)}>{mc3.formatDayNumber(day.date.day)}</button>
                          </td>
                        {/each}
                      </tr>
                    {/each}
                  </tbody>
                </table>
              </div>
            {/each}
          </div>
        </div>
        <div class="ase-value-box">Selected: {fmtDate(mc3Val)}</div>
      </div>

      <!-- 10. Date Picker -->
      <div class="ase-card" data-theme="indigo">
        <h3 class="ase-card-title">10. Date Picker</h3>
        <p class="ase-card-desc">Full date picker with input field, trigger button, calendar dropdown, and clear button.</p>
        <div bind:this={dpEl} class="trc-date-picker" style="display: block;">
          <div class="trc-date-picker-input-wrapper">
            <input
              class="trc-date-picker-input"
              type="text"
              placeholder="Select date..."
              value={$dpInputValue}
              readonly
              on:click={dp.toggle}
            />
            {#if $dpSelectedDate}
              <button class="trc-date-picker-clear" on:click={dp.clear} title="Clear">&times;</button>
            {/if}
            <button class="trc-date-picker-trigger" on:click={dp.toggle} title="Toggle calendar">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M5 1v2M11 1v2M1 6h14M3 3h10a2 2 0 012 2v8a2 2 0 01-2 2H3a2 2 0 01-2-2V5a2 2 0 012-2z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
          </div>
          {#if $dpIsOpen}
            <div class="trc-date-picker-content">
              <div class="trc-date-picker-calendar">
                <div class="trc-calendar-header">
                  <button class="trc-calendar-nav-button" on:click={dp.prevMonth} disabled={$dpPrevDisabled}>&#8249;</button>
                  <span class="trc-calendar-title">{$dpTitle}</span>
                  <button class="trc-calendar-nav-button" on:click={dp.nextMonth} disabled={$dpNextDisabled}>&#8250;</button>
                </div>
                <table class="trc-calendar-grid">
                  <thead class="trc-calendar-grid-head"><tr>
                    {#each $dpWeekdayNames as d}
                      <th class="trc-calendar-weekday">{d}</th>
                    {/each}
                  </tr></thead>
                  <tbody>
                    {#each $dpWeeks as week}
                      <tr class="trc-calendar-week">
                        {#each week as day}
                          <td class="trc-calendar-cell"
                            class:trc-calendar-cell-today={day.isToday}
                            class:trc-calendar-cell-selected={day.isSelected}
                            class:trc-calendar-cell-outside={day.isOutsideMonth}
                            class:trc-calendar-cell-disabled={day.isDisabled}>
                            <button class="trc-calendar-day" disabled={day.isDisabled || day.isOutsideMonth} on:click={() => dp.selectDate(day.date)}>{dp.formatDayNumber(day.date.day)}</button>
                          </td>
                        {/each}
                      </tr>
                    {/each}
                  </tbody>
                </table>
              </div>
              <div class="trc-date-picker-footer">
                <button class="trc-date-picker-today-button" on:click={dp.goToToday}>Today</button>
                <button class="trc-date-picker-clear-button" on:click={dp.clear}>Clear</button>
              </div>
            </div>
          {/if}
        </div>
        <div class="ase-value-box">Selected: {fmtDate($dpSelectedDate)}</div>
      </div>

      <!-- 11. Disabled Dates -->
      <div class="ase-card" data-theme="rose">
        <h3 class="ase-card-title">11. Disabled Dates</h3>
        <p class="ase-card-desc">Specific dates are disabled and cannot be selected. Days 5, 10, 15, 20, and 25 of Magh 2082 are disabled.</p>
        <div class="trc-calendar">
          <div class="trc-calendar-header">
            <button class="trc-calendar-nav-button" on:click={disCal.prevMonth} disabled={$disPrevDisabled}>&#8249;</button>
            <span class="trc-calendar-title">{$disTitle}</span>
            <button class="trc-calendar-nav-button" on:click={disCal.nextMonth} disabled={$disNextDisabled}>&#8250;</button>
          </div>
          <table class="trc-calendar-grid">
            <thead class="trc-calendar-grid-head"><tr>
              {#each $disWeekdayNames as d}
                <th class="trc-calendar-weekday">{d}</th>
              {/each}
            </tr></thead>
            <tbody>
              {#each $disWeeks as week}
                <tr class="trc-calendar-week">
                  {#each week as day}
                    <td class="trc-calendar-cell"
                      class:trc-calendar-cell-today={day.isToday}
                      class:trc-calendar-cell-selected={day.isSelected}
                      class:trc-calendar-cell-outside={day.isOutsideMonth}
                      class:trc-calendar-cell-disabled={day.isDisabled}>
                      <button class="trc-calendar-day" disabled={day.isDisabled || day.isOutsideMonth} on:click={() => disCal.selectDate(day.date)}>{disCal.formatDayNumber(day.date.day)}</button>
                    </td>
                  {/each}
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
        <div class="ase-value-box">Selected: {fmtDate($disSelected)}</div>
      </div>

      <!-- 12. Min/Max Date Constraints -->
      <div class="ase-card" data-theme="forest">
        <h3 class="ase-card-title">12. Min/Max Date Constraints</h3>
        <p class="ase-card-desc">Navigation and selection restricted to Magh 2082 (day 1 to 28) using <code>minDate</code> and <code>maxDate</code>.</p>
        <div class="trc-calendar">
          <div class="trc-calendar-header">
            <button class="trc-calendar-nav-button" on:click={mmCal.prevMonth} disabled={$mmPrevDisabled}>&#8249;</button>
            <span class="trc-calendar-title">{$mmTitle}</span>
            <button class="trc-calendar-nav-button" on:click={mmCal.nextMonth} disabled={$mmNextDisabled}>&#8250;</button>
          </div>
          <table class="trc-calendar-grid">
            <thead class="trc-calendar-grid-head"><tr>
              {#each $mmWeekdayNames as d}
                <th class="trc-calendar-weekday">{d}</th>
              {/each}
            </tr></thead>
            <tbody>
              {#each $mmWeeks as week}
                <tr class="trc-calendar-week">
                  {#each week as day}
                    <td class="trc-calendar-cell"
                      class:trc-calendar-cell-today={day.isToday}
                      class:trc-calendar-cell-selected={day.isSelected}
                      class:trc-calendar-cell-outside={day.isOutsideMonth}
                      class:trc-calendar-cell-disabled={day.isDisabled}>
                      <button class="trc-calendar-day" disabled={day.isDisabled || day.isOutsideMonth} on:click={() => mmCal.selectDate(day.date)}>{mmCal.formatDayNumber(day.date.day)}</button>
                    </td>
                  {/each}
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
        <div class="ase-value-box">Selected: {fmtDate($mmSelected)}</div>
      </div>

      <!-- 13. Week Starts Monday -->
      <div class="ase-card" data-theme="ocean">
        <h3 class="ase-card-title">13. Week Starts on Monday</h3>
        <p class="ase-card-desc">Calendar with <code>weekStartsOn: 1</code> so the week begins on Monday instead of Sunday.</p>
        <div class="trc-calendar">
          <div class="trc-calendar-header">
            <button class="trc-calendar-nav-button" on:click={monCal.prevMonth} disabled={$monPrevDisabled}>&#8249;</button>
            <span class="trc-calendar-title">{$monTitle}</span>
            <button class="trc-calendar-nav-button" on:click={monCal.nextMonth} disabled={$monNextDisabled}>&#8250;</button>
          </div>
          <table class="trc-calendar-grid">
            <thead class="trc-calendar-grid-head"><tr>
              {#each $monWeekdayNames as d}
                <th class="trc-calendar-weekday">{d}</th>
              {/each}
            </tr></thead>
            <tbody>
              {#each $monWeeks as week}
                <tr class="trc-calendar-week">
                  {#each week as day}
                    <td class="trc-calendar-cell"
                      class:trc-calendar-cell-today={day.isToday}
                      class:trc-calendar-cell-selected={day.isSelected}
                      class:trc-calendar-cell-outside={day.isOutsideMonth}>
                      <button class="trc-calendar-day" disabled={day.isDisabled || day.isOutsideMonth} on:click={() => monCal.selectDate(day.date)}>{monCal.formatDayNumber(day.date.day)}</button>
                    </td>
                  {/each}
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>

      <!-- 14. All 12 Themes Showcase -->
      <div class="ase-card ase-card-wide">
        <h3 class="ase-card-title">14. All 12 Themes Showcase</h3>
        <p class="ase-card-desc">Every built-in theme rendered simultaneously. The theme is applied via the <code>data-theme</code> attribute on a wrapper element.</p>
        <div class="ase-themes-grid">
          {#each $themeCalendarsData as tc, idx}
            <div data-theme={tc.theme} class="ase-theme-card">
              <div class="ase-theme-label">{tc.theme}</div>
              <div class="trc-calendar">
                <div class="trc-calendar-header">
                  <button class="trc-calendar-nav-button" on:click={tc.cal.prevMonth} disabled={$themeCalPrevDisabled[idx]}>&#8249;</button>
                  <span class="trc-calendar-title">{$themeCalTitles[idx]}</span>
                  <button class="trc-calendar-nav-button" on:click={tc.cal.nextMonth} disabled={$themeCalNextDisabled[idx]}>&#8250;</button>
                </div>
                <table class="trc-calendar-grid">
                  <thead class="trc-calendar-grid-head"><tr>
                    {#each $themeCalWeekdayNames[idx] as d}
                      <th class="trc-calendar-weekday">{d}</th>
                    {/each}
                  </tr></thead>
                  <tbody>
                    {#each tc.weeks as week}
                      <tr class="trc-calendar-week">
                        {#each week as day}
                          <td class="trc-calendar-cell"
                            class:trc-calendar-cell-today={day.isToday}
                            class:trc-calendar-cell-selected={day.isSelected}
                            class:trc-calendar-cell-outside={day.isOutsideMonth}>
                            <button class="trc-calendar-day" disabled={day.isDisabled || day.isOutsideMonth} on:click={() => tc.cal.selectDate(day.date)}>{tc.cal.formatDayNumber(day.date.day)}</button>
                          </td>
                        {/each}
                      </tr>
                    {/each}
                  </tbody>
                </table>
              </div>
            </div>
          {/each}
        </div>
      </div>

      <!-- 15. Controlled Component -->
      <div class="ase-card" data-theme="amber">
        <h3 class="ase-card-title">15. Controlled Component</h3>
        <p class="ase-card-desc">Calendar controlled by external state. Use the buttons below to set the date programmatically.</p>
        <div class="ase-btn-row">
          <button class="ase-btn" on:click={() => setControlled(2082, 1, 1)}>Baisakh 1, 2082</button>
          <button class="ase-btn" on:click={() => setControlled(2082, 5, 15)}>Bhadra 15, 2082</button>
          <button class="ase-btn" on:click={() => setControlled(2082, 10, 1)}>Magh 1, 2082</button>
          <button class="ase-btn ase-btn-danger" on:click={clearControlled}>Clear</button>
        </div>
        <div class="trc-calendar">
          <div class="trc-calendar-header">
            <button class="trc-calendar-nav-button" on:click={ctrlCal.prevMonth} disabled={$ctrlPrevDisabled}>&#8249;</button>
            <span class="trc-calendar-title">{$ctrlTitle}</span>
            <button class="trc-calendar-nav-button" on:click={ctrlCal.nextMonth} disabled={$ctrlNextDisabled}>&#8250;</button>
          </div>
          <table class="trc-calendar-grid">
            <thead class="trc-calendar-grid-head"><tr>
              {#each $ctrlWeekdayNames as d}
                <th class="trc-calendar-weekday">{d}</th>
              {/each}
            </tr></thead>
            <tbody>
              {#each $ctrlWeeks as week}
                <tr class="trc-calendar-week">
                  {#each week as day}
                    <td class="trc-calendar-cell"
                      class:trc-calendar-cell-today={day.isToday}
                      class:trc-calendar-cell-selected={day.isSelected}
                      class:trc-calendar-cell-outside={day.isOutsideMonth}
                      class:trc-calendar-cell-disabled={day.isDisabled}>
                      <button class="trc-calendar-day" disabled={day.isDisabled || day.isOutsideMonth} on:click={() => ctrlCal.selectDate(day.date)}>{ctrlCal.formatDayNumber(day.date.day)}</button>
                    </td>
                  {/each}
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
        <div class="ase-value-box">Selected: {fmtDate($ctrlSelected)}</div>
      </div>

    </div>
  </div>
</div>

<style>
/* ===========================================================================
   Page Layout
   =========================================================================== */

.ase-page {
  background: #0a0a0f;
  color: #e4e4e7;
  min-height: 100vh;
  padding: 2rem 1rem;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.ase-container {
  max-width: 1400px;
  margin: 0 auto;
}

.ase-heading {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #fff;
}

.ase-subheading {
  font-size: 1rem;
  color: #71717a;
  margin-bottom: 2.5rem;
}

.ase-code-inline {
  color: #818cf8;
}

/* ===========================================================================
   Grid
   =========================================================================== */

.ase-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 1.5rem;
}

/* ===========================================================================
   Cards
   =========================================================================== */

.ase-card {
  background: #111118;
  border: 1px solid #1e1e2e;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.ase-card-wide {
  grid-column: 1 / -1;
}

.ase-card-title {
  font-size: 1rem;
  font-weight: 600;
  color: #fff;
  margin: 0;
}

.ase-card-desc {
  font-size: 0.8125rem;
  color: #71717a;
  margin: 0;
  line-height: 1.5;
}

.ase-card-desc :global(code) {
  color: #a1a1aa;
  background: #18181b;
  padding: 0.1em 0.35em;
  border-radius: 4px;
  font-size: 0.8em;
}

/* ===========================================================================
   Value Display
   =========================================================================== */

.ase-value-box {
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

.ase-month-title {
  text-align: center;
  font-weight: 600;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
  color: #e4e4e7;
}

/* ===========================================================================
   Buttons
   =========================================================================== */

.ase-btn-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.ase-btn {
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

.ase-btn:hover {
  border-color: #3f3f46;
  color: #e4e4e7;
}

.ase-btn-danger {
  border-color: #ef4444;
  color: #ef4444;
}

.ase-btn-danger:hover {
  background: rgba(239, 68, 68, 0.1);
}

/* ===========================================================================
   Themes Showcase Grid
   =========================================================================== */

.ase-themes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

.ase-theme-card {
  background: #0d0d14;
  border: 1px solid #1e1e2e;
  border-radius: 8px;
  padding: 0.75rem;
}

.ase-theme-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #a1a1aa;
  margin-bottom: 0.5rem;
  text-transform: capitalize;
}

/* ===========================================================================
   Date Picker Overrides
   =========================================================================== */

:global(.trc-date-picker) {
  position: relative;
}

:global(.trc-date-picker-content) {
  z-index: 50;
}

/* ===========================================================================
   Responsive
   =========================================================================== */

@media (max-width: 480px) {
  .ase-grid {
    grid-template-columns: 1fr;
  }

  .ase-themes-grid {
    grid-template-columns: 1fr;
  }
}
</style>
