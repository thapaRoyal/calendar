import { useState } from 'react';
import {
  Calendar,
  RangeCalendar,
  MultiCalendar,
  type CalendarDate,
  type DateRangeValue,
} from '@thaparoyal/calendar-react';
import '@thaparoyal/calendar-core/themes/themes.css';

const THEMES = [
  'default',
  'ocean',
  'forest',
  'sunset',
  'lavender',
  'midnight',
  'rose',
  'mint',
  'amber',
  'slate',
  'coral',
  'indigo',
] as const;

type Theme = typeof THEMES[number];

export function ReactPlayground() {
  const [theme, setTheme] = useState<Theme>('default');
  const [calendarType, setCalendarType] = useState<'BS' | 'AD'>('BS');
  const [locale, setLocale] = useState<'en' | 'ne'>('en');

  // Single selection
  const [singleDate, setSingleDate] = useState<CalendarDate | null>(null);

  // Range selection
  const [rangeValue, setRangeValue] = useState<DateRangeValue | null>(null);

  // Multi-calendar
  const [multiRangeValue, setMultiRangeValue] = useState<DateRangeValue | null>(null);

  return (
    <div className="playground-container">
      <h1>React Playground</h1>
      <p>Interactive demo of @thaparoyal/calendar-react components</p>

      {/* Controls */}
      <div className="playground-card" style={{ marginBottom: '2rem' }}>
        <h3>Settings</h3>
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
              Calendar Type
            </label>
            <select
              value={calendarType}
              onChange={(e) => setCalendarType(e.target.value as 'BS' | 'AD')}
              style={{ padding: '0.5rem', borderRadius: '0.25rem' }}
            >
              <option value="BS">Bikram Sambat (BS)</option>
              <option value="AD">Gregorian (AD)</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
              Locale
            </label>
            <select
              value={locale}
              onChange={(e) => setLocale(e.target.value as 'en' | 'ne')}
              style={{ padding: '0.5rem', borderRadius: '0.25rem' }}
            >
              <option value="en">English</option>
              <option value="ne">Nepali</option>
            </select>
          </div>
        </div>

        <div style={{ marginTop: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
            Theme
          </label>
          <div className="theme-selector">
            {THEMES.map((t) => (
              <button
                key={t}
                className={theme === t ? 'active' : ''}
                onClick={() => setTheme(t)}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="playground-grid">
        {/* Single Selection Calendar */}
        <div className="playground-card">
          <h3>Single Selection</h3>
          <div className="calendar-demo" data-theme={theme}>
            <Calendar.Root
              config={{ calendarType, locale }}
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
            {singleDate && (
              <p style={{ fontSize: '0.875rem', color: 'var(--sl-color-gray-3)' }}>
                Selected: {singleDate.year}/{singleDate.month}/{singleDate.day}
              </p>
            )}
          </div>
        </div>

        {/* Calendar with Dropdowns */}
        <div className="playground-card">
          <h3>With Dropdowns</h3>
          <div className="calendar-demo" data-theme={theme}>
            <Calendar.Root config={{ calendarType, locale }}>
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
        </div>

        {/* Range Selection Calendar */}
        <div className="playground-card">
          <h3>Range Selection</h3>
          <div className="calendar-demo" data-theme={theme}>
            <RangeCalendar.Root
              config={{ calendarType, locale }}
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
            {rangeValue?.start && (
              <p style={{ fontSize: '0.875rem', color: 'var(--sl-color-gray-3)' }}>
                Range: {rangeValue.start.year}/{rangeValue.start.month}/{rangeValue.start.day}
                {rangeValue.end && ` - ${rangeValue.end.year}/${rangeValue.end.month}/${rangeValue.end.day}`}
              </p>
            )}
          </div>
        </div>

        {/* Multi-Calendar */}
        <div className="playground-card" style={{ gridColumn: 'span 2' }}>
          <h3>Multi-Calendar (2 Months)</h3>
          <div className="calendar-demo" data-theme={theme}>
            <MultiCalendar.Root
              numberOfMonths={2}
              mode="range"
              config={{ calendarType, locale }}
              value={multiRangeValue}
              onValueChange={(val) => setMultiRangeValue(val as DateRangeValue | null)}
            >
              <MultiCalendar.Header>
                <MultiCalendar.PrevButton />
                <MultiCalendar.Title />
                <MultiCalendar.NextButton />
              </MultiCalendar.Header>
              <MultiCalendar.Calendars showMonthTitles />
            </MultiCalendar.Root>
            {multiRangeValue?.start && (
              <p style={{ fontSize: '0.875rem', color: 'var(--sl-color-gray-3)' }}>
                Range: {multiRangeValue.start.year}/{multiRangeValue.start.month}/{multiRangeValue.start.day}
                {multiRangeValue.end && ` - ${multiRangeValue.end.year}/${multiRangeValue.end.month}/${multiRangeValue.end.day}`}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReactPlayground;
