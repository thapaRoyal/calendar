import { useState } from 'react';
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

function fmtDate(d: CalendarDate | null | undefined): string {
  if (!d) return '—';
  return `${d.year}-${String(d.month).padStart(2, '0')}-${String(d.day).padStart(2, '0')} (${d.calendarType})`;
}

export function ReactPlayground() {
  const [theme, setTheme] = useState<Theme>('dark');
  const [calendarType, setCalendarType] = useState<'BS' | 'AD'>('BS');
  const [locale, setLocale] = useState<'en' | 'ne'>('en');
  const [singleDate, setSingleDate] = useState<CalendarDate | null>(null);
  const [rangeValue, setRangeValue] = useState<DateRangeValue | null>(null);
  const [multiRangeValue, setMultiRangeValue] = useState<DateRangeValue | null>(null);
  const [pickerDate, setPickerDate] = useState<CalendarDate | null>(null);

  const config = { calendarType, locale } as const;

  return (
    <div style={{ padding: '2rem', maxWidth: 1400, margin: '0 auto' }}>
      <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.25rem', color: '#fff' }}>
        React Playground
      </h2>
      <p style={{ color: '#888', marginBottom: '2rem', fontSize: '0.95rem' }}>
        Interactive demo of every <code style={{ background: '#1a1a2e', padding: '0.15rem 0.4rem', borderRadius: 4, color: '#818cf8' }}>@thaparoyal/calendar-react</code> component
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
        <Card title="Single Selection" desc="Click title to switch between day → month → year views">
          <div data-theme={theme}>
            <Calendar.Root config={config} value={singleDate} onValueChange={setSingleDate}>
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
        </Card>

        {/* 2. With Dropdowns */}
        <Card title="Month & Year Dropdowns" desc="Quick navigation via dropdown selects">
          <div data-theme={theme}>
            <Calendar.Root config={config}>
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
        </Card>

        {/* 3. Range Selection */}
        <Card title="Range Selection" desc="Click start date, hover to preview, click end date">
          <div data-theme={theme}>
            <RangeCalendar.Root config={config} value={rangeValue} onValueChange={setRangeValue}>
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
        </Card>

        {/* 4. DatePicker */}
        <Card title="Date Picker" desc="Input field with calendar dropdown popup">
          <div data-theme={theme}>
            <DatePicker.Root config={config} value={pickerDate} onValueChange={setPickerDate}>
              <DatePicker.Input placeholder="Select a date..." />
              <DatePicker.ClearButton />
              <DatePicker.Trigger />
              <DatePicker.Content>
                <DatePicker.Calendar />
              </DatePicker.Content>
            </DatePicker.Root>
          </div>
          <ValueDisplay label="Selected" value={fmtDate(pickerDate)} />
        </Card>

        {/* 5. Multi-Calendar Range (booking.com style) — spans full width */}
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
              numberOfMonths={2}
              mode="range"
              config={config}
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
          </div>
          <ValueDisplay label="Range" value={`${fmtDate(multiRangeValue?.start)} → ${fmtDate(multiRangeValue?.end)}`} />
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

export default ReactPlayground;
