import { useState, useCallback } from 'react';
import {
  Calendar,
  RangeCalendar,
  MultiCalendar,
  DatePicker,
  useSelection,
  useDateConverter,
  type CalendarDate,
  type DateRangeValue,
} from '@thaparoyal/calendar-react';
import '@thaparoyal/calendar-core/themes/themes.css';

// ---------------------------------------------------------------------------
// Shared styles
// ---------------------------------------------------------------------------

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

const pageStyle: React.CSSProperties = {
  background: '#0a0a0f',
  color: '#e4e4e7',
  minHeight: '100vh',
  padding: '2rem 1rem',
  fontFamily:
    "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
};

const headingStyle: React.CSSProperties = {
  fontSize: '2rem',
  fontWeight: 700,
  marginBottom: '0.5rem',
  color: '#fff',
};

const subheadingStyle: React.CSSProperties = {
  fontSize: '1rem',
  color: '#71717a',
  marginBottom: '2.5rem',
};

const gridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
  gap: '1.5rem',
  maxWidth: '1400px',
  margin: '0 auto',
};

const cardStyle: React.CSSProperties = {
  background: '#111118',
  border: '1px solid #1e1e2e',
  borderRadius: '12px',
  padding: '1.5rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
};

const wideCardStyle: React.CSSProperties = {
  ...cardStyle,
  gridColumn: '1 / -1',
};

const cardTitleStyle: React.CSSProperties = {
  fontSize: '1rem',
  fontWeight: 600,
  color: '#fff',
  margin: 0,
};

const cardDescStyle: React.CSSProperties = {
  fontSize: '0.8125rem',
  color: '#71717a',
  margin: 0,
  lineHeight: 1.5,
};

const valueBoxStyle: React.CSSProperties = {
  fontSize: '0.8125rem',
  color: '#a1a1aa',
  background: '#18181b',
  border: '1px solid #27272a',
  borderRadius: '6px',
  padding: '0.5rem 0.75rem',
  fontFamily: 'monospace',
};

const btnStyle: React.CSSProperties = {
  padding: '0.4rem 0.85rem',
  borderRadius: '6px',
  border: '1px solid #27272a',
  background: '#18181b',
  color: '#a1a1aa',
  cursor: 'pointer',
  fontSize: '0.8125rem',
  fontWeight: 500,
  transition: 'all 0.15s',
};

const activeBtnStyle: React.CSSProperties = {
  ...btnStyle,
  background: '#667eea',
  borderColor: '#667eea',
  color: '#fff',
};

const inputStyle: React.CSSProperties = {
  padding: '0.5rem 0.75rem',
  borderRadius: '6px',
  border: '1px solid #27272a',
  background: '#18181b',
  color: '#e4e4e7',
  fontSize: '0.875rem',
  width: '100%',
  boxSizing: 'border-box',
};

// ---------------------------------------------------------------------------
// Helper to format a CalendarDate for display
// ---------------------------------------------------------------------------
function fmtDate(d: CalendarDate | null | undefined): string {
  if (!d) return 'None';
  return `${d.year}-${String(d.month).padStart(2, '0')}-${String(d.day).padStart(2, '0')} (${d.calendarType})`;
}

// ---------------------------------------------------------------------------
// 1. Single Select BS
// ---------------------------------------------------------------------------
function SingleSelectBS() {
  const [value, setValue] = useState<CalendarDate | null>(null);
  return (
    <div style={cardStyle} data-theme="default">
      <h3 style={cardTitleStyle}>1. Single Select (BS Calendar)</h3>
      <p style={cardDescStyle}>
        Basic Bikram Sambat calendar with single date selection.
      </p>
      <Calendar.Root
        config={{ calendarType: 'BS', locale: 'en' }}
        value={value}
        onValueChange={setValue}
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
      <div style={valueBoxStyle}>Selected: {fmtDate(value)}</div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 2. Single Select AD
// ---------------------------------------------------------------------------
function SingleSelectAD() {
  const [value, setValue] = useState<CalendarDate | null>(null);
  return (
    <div style={cardStyle} data-theme="ocean">
      <h3 style={cardTitleStyle}>2. Single Select (AD Calendar)</h3>
      <p style={cardDescStyle}>
        Standard Gregorian (AD) calendar with single date selection.
      </p>
      <Calendar.Root
        config={{ calendarType: 'AD', locale: 'en' }}
        value={value}
        onValueChange={setValue}
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
      <div style={valueBoxStyle}>Selected: {fmtDate(value)}</div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 3. Nepali Numerals
// ---------------------------------------------------------------------------
function NepaliNumerals() {
  const [value, setValue] = useState<CalendarDate | null>(null);
  return (
    <div style={cardStyle} data-theme="sunset">
      <h3 style={cardTitleStyle}>3. Nepali Numerals</h3>
      <p style={cardDescStyle}>
        BS calendar rendered with Nepali (Devanagari) numerals via{' '}
        <code>locale: 'ne'</code>.
      </p>
      <Calendar.Root
        config={{ calendarType: 'BS', locale: 'ne' }}
        value={value}
        onValueChange={setValue}
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
      <div style={valueBoxStyle}>Selected: {fmtDate(value)}</div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 4. Month Picker
// ---------------------------------------------------------------------------
function MonthPickerExample() {
  return (
    <div style={cardStyle} data-theme="forest">
      <h3 style={cardTitleStyle}>4. Month Picker</h3>
      <p style={cardDescStyle}>
        Click the title text to toggle month picker view. Includes{' '}
        <code>Calendar.MonthPicker</code>.
      </p>
      <Calendar.Root config={{ calendarType: 'BS', locale: 'en' }}>
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
  );
}

// ---------------------------------------------------------------------------
// 5. Year Picker
// ---------------------------------------------------------------------------
function YearPickerExample() {
  return (
    <div style={cardStyle} data-theme="lavender">
      <h3 style={cardTitleStyle}>5. Year Picker</h3>
      <p style={cardDescStyle}>
        Click the title twice to reach the year picker view. Includes{' '}
        <code>Calendar.YearPicker</code>.
      </p>
      <Calendar.Root config={{ calendarType: 'BS', locale: 'en' }}>
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
  );
}

// ---------------------------------------------------------------------------
// 6. Month/Year Dropdowns
// ---------------------------------------------------------------------------
function DropdownExample() {
  return (
    <div style={cardStyle} data-theme="midnight">
      <h3 style={cardTitleStyle}>6. Month/Year Dropdowns</h3>
      <p style={cardDescStyle}>
        Replace the title with <code>MonthDropdown</code> and{' '}
        <code>YearDropdown</code> for quick navigation.
      </p>
      <Calendar.Root config={{ calendarType: 'BS', locale: 'en' }}>
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
  );
}

// ---------------------------------------------------------------------------
// 7. Range Selection
// ---------------------------------------------------------------------------
function RangeSelectionExample() {
  const [range, setRange] = useState<DateRangeValue | null>(null);
  return (
    <div style={cardStyle} data-theme="rose">
      <h3 style={cardTitleStyle}>7. Range Selection</h3>
      <p style={cardDescStyle}>
        Select a start and end date using <code>RangeCalendar</code>.
      </p>
      <RangeCalendar.Root
        config={{ calendarType: 'BS', locale: 'en' }}
        value={range}
        onValueChange={setRange}
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
      <div style={valueBoxStyle}>
        Start: {fmtDate(range?.start)}
        {' | '}
        End: {fmtDate(range?.end)}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 8. Multi-Date Selection (useSelection hook)
// ---------------------------------------------------------------------------
function MultiDateSelection() {
  const { actions, value } = useSelection({
    mode: 'multiple',
    config: { calendarType: 'BS', locale: 'en', weekStartsOn: 0 },
  });

  const selectedDates = Array.isArray(value) ? value : [];

  return (
    <div style={cardStyle} data-theme="mint">
      <h3 style={cardTitleStyle}>8. Multi-Date Selection</h3>
      <p style={cardDescStyle}>
        Select multiple individual dates using the <code>useSelection</code>{' '}
        hook with <code>mode: 'multiple'</code>.
      </p>
      <Calendar.Root
        config={{ calendarType: 'BS', locale: 'en' }}
        onValueChange={(d) => actions.toggle(d)}
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
      </Calendar.Root>
      <div style={valueBoxStyle}>
        Selected ({selectedDates.length}):{' '}
        {selectedDates.length > 0
          ? selectedDates.map((d) => fmtDate(d)).join(', ')
          : 'None'}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 9. Multi-Calendar (2 months)
// ---------------------------------------------------------------------------
function MultiCalendar2Months() {
  const [value, setValue] = useState<CalendarDate | null>(null);
  return (
    <div style={wideCardStyle} data-theme="amber">
      <h3 style={cardTitleStyle}>9. Multi-Calendar (2 Months)</h3>
      <p style={cardDescStyle}>
        Display two consecutive months side by side with{' '}
        <code>numberOfMonths={'{2}'}</code>.
      </p>
      <MultiCalendar.Root
        numberOfMonths={2}
        config={{ calendarType: 'BS', locale: 'en' }}
        value={value}
        onValueChange={(v) => setValue(v as CalendarDate | null)}
        mode="single"
      >
        <MultiCalendar.Header>
          <MultiCalendar.PrevButton />
          <MultiCalendar.Title />
          <MultiCalendar.NextButton />
        </MultiCalendar.Header>
        <MultiCalendar.Calendars />
      </MultiCalendar.Root>
      <div style={valueBoxStyle}>Selected: {fmtDate(value)}</div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 10. Multi-Calendar (3 months)
// ---------------------------------------------------------------------------
function MultiCalendar3Months() {
  const [value, setValue] = useState<CalendarDate | null>(null);
  return (
    <div style={wideCardStyle} data-theme="slate">
      <h3 style={cardTitleStyle}>10. Multi-Calendar (3 Months)</h3>
      <p style={cardDescStyle}>
        Three consecutive months with{' '}
        <code>numberOfMonths={'{3}'}</code>.
      </p>
      <MultiCalendar.Root
        numberOfMonths={3}
        config={{ calendarType: 'BS', locale: 'en' }}
        value={value}
        onValueChange={(v) => setValue(v as CalendarDate | null)}
        mode="single"
      >
        <MultiCalendar.Header>
          <MultiCalendar.PrevButton />
          <MultiCalendar.Title />
          <MultiCalendar.NextButton />
        </MultiCalendar.Header>
        <MultiCalendar.Calendars />
      </MultiCalendar.Root>
      <div style={valueBoxStyle}>Selected: {fmtDate(value)}</div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 11. Multi-Calendar Range
// ---------------------------------------------------------------------------
function MultiCalendarRange() {
  const [range, setRange] = useState<DateRangeValue | null>(null);
  return (
    <div style={wideCardStyle} data-theme="coral">
      <h3 style={cardTitleStyle}>11. Multi-Calendar Range</h3>
      <p style={cardDescStyle}>
        Range selection across multiple months with{' '}
        <code>mode="range"</code>.
      </p>
      <MultiCalendar.Root
        numberOfMonths={2}
        mode="range"
        config={{ calendarType: 'BS', locale: 'en' }}
        value={range}
        onValueChange={(v) => setRange(v as DateRangeValue | null)}
      >
        <MultiCalendar.Header>
          <MultiCalendar.PrevButton />
          <MultiCalendar.Title />
          <MultiCalendar.NextButton />
        </MultiCalendar.Header>
        <MultiCalendar.Calendars />
      </MultiCalendar.Root>
      <div style={valueBoxStyle}>
        Start: {fmtDate(range?.start)}
        {' | '}
        End: {fmtDate(range?.end)}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 12. DatePicker
// ---------------------------------------------------------------------------
function DatePickerExample() {
  const [value, setValue] = useState<CalendarDate | null>(null);
  return (
    <div style={cardStyle} data-theme="indigo">
      <h3 style={cardTitleStyle}>12. DatePicker</h3>
      <p style={cardDescStyle}>
        Full <code>DatePicker</code> with input field, trigger button, calendar
        dropdown, and clear button.
      </p>
      <DatePicker.Root
        config={{ calendarType: 'BS', locale: 'en' }}
        value={value}
        onValueChange={setValue}
      >
        <DatePicker.Input placeholder="Select date..." />
        <DatePicker.ClearButton />
        <DatePicker.Trigger />
        <DatePicker.Content>
          <DatePicker.Calendar />
        </DatePicker.Content>
      </DatePicker.Root>
      <div style={valueBoxStyle}>Selected: {fmtDate(value)}</div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 13. Disabled Dates
// ---------------------------------------------------------------------------
function DisabledDatesExample() {
  const [value, setValue] = useState<CalendarDate | null>(null);
  const disabledDates: CalendarDate[] = [
    { year: 2081, month: 10, day: 5, calendarType: 'BS' },
    { year: 2081, month: 10, day: 10, calendarType: 'BS' },
    { year: 2081, month: 10, day: 15, calendarType: 'BS' },
    { year: 2081, month: 10, day: 20, calendarType: 'BS' },
    { year: 2081, month: 10, day: 25, calendarType: 'BS' },
  ];

  return (
    <div style={cardStyle} data-theme="rose">
      <h3 style={cardTitleStyle}>13. Disabled Dates</h3>
      <p style={cardDescStyle}>
        Specific dates are disabled and cannot be selected. Days 5, 10, 15, 20,
        and 25 of Magh 2081 are disabled.
      </p>
      <Calendar.Root
        config={{ calendarType: 'BS', locale: 'en' }}
        value={value}
        onValueChange={setValue}
        disabledDates={disabledDates}
        defaultValue={{ year: 2081, month: 10, day: 1, calendarType: 'BS' }}
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
      </Calendar.Root>
      <div style={valueBoxStyle}>Selected: {fmtDate(value)}</div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 14. Min/Max Date Constraints
// ---------------------------------------------------------------------------
function MinMaxExample() {
  const [value, setValue] = useState<CalendarDate | null>(null);
  return (
    <div style={cardStyle} data-theme="forest">
      <h3 style={cardTitleStyle}>14. Min/Max Date Constraints</h3>
      <p style={cardDescStyle}>
        Navigation and selection are restricted to Magh 2081 (day 1 to 28) using{' '}
        <code>minDate</code> and <code>maxDate</code> in config.
      </p>
      <Calendar.Root
        config={{
          calendarType: 'BS',
          locale: 'en',
          minDate: { year: 2081, month: 10, day: 1, calendarType: 'BS' },
          maxDate: { year: 2081, month: 10, day: 28, calendarType: 'BS' },
        }}
        value={value}
        onValueChange={setValue}
        defaultValue={{ year: 2081, month: 10, day: 1, calendarType: 'BS' }}
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
      </Calendar.Root>
      <div style={valueBoxStyle}>Selected: {fmtDate(value)}</div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 15. All 12 Themes Showcase
// ---------------------------------------------------------------------------
function ThemesShowcase() {
  return (
    <div style={wideCardStyle}>
      <h3 style={cardTitleStyle}>15. All 12 Themes Showcase</h3>
      <p style={cardDescStyle}>
        Every built-in theme rendered simultaneously. The theme is applied via
        the <code>data-theme</code> attribute on a wrapper element.
      </p>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1rem',
        }}
      >
        {THEMES.map((theme) => (
          <div
            key={theme}
            data-theme={theme}
            style={{
              background: '#0d0d14',
              border: '1px solid #1e1e2e',
              borderRadius: '8px',
              padding: '0.75rem',
            }}
          >
            <div
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color: '#a1a1aa',
                marginBottom: '0.5rem',
                textTransform: 'capitalize',
              }}
            >
              {theme}
            </div>
            <Calendar.Root config={{ calendarType: 'BS', locale: 'en' }}>
              <Calendar.Header>
                <Calendar.PrevButton />
                <Calendar.Title />
                <Calendar.NextButton />
              </Calendar.Header>
              <Calendar.Grid>
                <Calendar.GridHead />
                <Calendar.GridBody />
              </Calendar.Grid>
            </Calendar.Root>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 16. Week Starts on Monday
// ---------------------------------------------------------------------------
function WeekStartsMonday() {
  return (
    <div style={cardStyle} data-theme="ocean">
      <h3 style={cardTitleStyle}>16. Week Starts on Monday</h3>
      <p style={cardDescStyle}>
        Calendar with <code>weekStartsOn: 1</code> so the week begins on
        Monday instead of Sunday.
      </p>
      <Calendar.Root
        config={{ calendarType: 'BS', locale: 'en', weekStartsOn: 1 }}
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
      </Calendar.Root>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 17. AD <-> BS Date Converter
// ---------------------------------------------------------------------------
function DateConverterExample() {
  const { adToBs, bsToAd, format } = useDateConverter();

  // AD inputs
  const [adYear, setAdYear] = useState('2025');
  const [adMonth, setAdMonth] = useState('1');
  const [adDay, setAdDay] = useState('15');
  const [bsResult, setBsResult] = useState<CalendarDate | null>(null);

  // BS inputs
  const [bsYear, setBsYear] = useState('2081');
  const [bsMonth, setBsMonth] = useState('10');
  const [bsDay, setBsDay] = useState('1');
  const [adResult, setAdResult] = useState<CalendarDate | null>(null);

  const handleAdToBs = useCallback(() => {
    try {
      const result = adToBs({
        year: parseInt(adYear, 10),
        month: parseInt(adMonth, 10),
        day: parseInt(adDay, 10),
      });
      setBsResult(result);
    } catch {
      setBsResult(null);
    }
  }, [adYear, adMonth, adDay, adToBs]);

  const handleBsToAd = useCallback(() => {
    try {
      const result = bsToAd({
        year: parseInt(bsYear, 10),
        month: parseInt(bsMonth, 10),
        day: parseInt(bsDay, 10),
        calendarType: 'BS',
      });
      setAdResult(result);
    } catch {
      setAdResult(null);
    }
  }, [bsYear, bsMonth, bsDay, bsToAd]);

  return (
    <div style={wideCardStyle}>
      <h3 style={cardTitleStyle}>17. AD to BS Date Converter</h3>
      <p style={cardDescStyle}>
        Interactive converter using the <code>useDateConverter</code> hook.
        Convert between Gregorian (AD) and Bikram Sambat (BS) dates.
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {/* AD -> BS */}
        <div
          style={{
            background: '#18181b',
            border: '1px solid #27272a',
            borderRadius: '8px',
            padding: '1rem',
          }}
        >
          <h4 style={{ color: '#a78bfa', margin: '0 0 0.75rem', fontSize: '0.9rem' }}>
            AD to BS
          </h4>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <input
              style={inputStyle}
              type="number"
              placeholder="Year"
              value={adYear}
              onChange={(e) => setAdYear(e.target.value)}
            />
            <input
              style={inputStyle}
              type="number"
              placeholder="Month"
              value={adMonth}
              onChange={(e) => setAdMonth(e.target.value)}
            />
            <input
              style={inputStyle}
              type="number"
              placeholder="Day"
              value={adDay}
              onChange={(e) => setAdDay(e.target.value)}
            />
          </div>
          <button style={activeBtnStyle} onClick={handleAdToBs}>
            Convert to BS
          </button>
          {bsResult && (
            <div style={{ ...valueBoxStyle, marginTop: '0.75rem' }}>
              BS: {format(bsResult, 'YYYY-MM-DD')}
            </div>
          )}
        </div>

        {/* BS -> AD */}
        <div
          style={{
            background: '#18181b',
            border: '1px solid #27272a',
            borderRadius: '8px',
            padding: '1rem',
          }}
        >
          <h4 style={{ color: '#34d399', margin: '0 0 0.75rem', fontSize: '0.9rem' }}>
            BS to AD
          </h4>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <input
              style={inputStyle}
              type="number"
              placeholder="Year"
              value={bsYear}
              onChange={(e) => setBsYear(e.target.value)}
            />
            <input
              style={inputStyle}
              type="number"
              placeholder="Month"
              value={bsMonth}
              onChange={(e) => setBsMonth(e.target.value)}
            />
            <input
              style={inputStyle}
              type="number"
              placeholder="Day"
              value={bsDay}
              onChange={(e) => setBsDay(e.target.value)}
            />
          </div>
          <button style={activeBtnStyle} onClick={handleBsToAd}>
            Convert to AD
          </button>
          {adResult && (
            <div style={{ ...valueBoxStyle, marginTop: '0.75rem' }}>
              AD: {format(adResult, 'YYYY-MM-DD')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 18. Controlled Component
// ---------------------------------------------------------------------------
function ControlledExample() {
  const [value, setValue] = useState<CalendarDate | null>(null);

  const setToSpecific = (year: number, month: number, day: number) => {
    setValue({ year, month, day, calendarType: 'BS' });
  };

  return (
    <div style={cardStyle} data-theme="amber">
      <h3 style={cardTitleStyle}>18. Controlled Component</h3>
      <p style={cardDescStyle}>
        Calendar controlled by external state. Use the buttons below to set the
        date programmatically.
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        <button style={btnStyle} onClick={() => setToSpecific(2081, 1, 1)}>
          Baisakh 1, 2081
        </button>
        <button style={btnStyle} onClick={() => setToSpecific(2081, 5, 15)}>
          Bhadra 15, 2081
        </button>
        <button style={btnStyle} onClick={() => setToSpecific(2081, 10, 1)}>
          Magh 1, 2081
        </button>
        <button
          style={{ ...btnStyle, borderColor: '#ef4444', color: '#ef4444' }}
          onClick={() => setValue(null)}
        >
          Clear
        </button>
      </div>
      <Calendar.Root
        config={{ calendarType: 'BS', locale: 'en' }}
        value={value}
        onValueChange={setValue}
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
      <div style={valueBoxStyle}>Selected: {fmtDate(value)}</div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export function AllReactExamples() {
  return (
    <div style={pageStyle}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <h1 style={headingStyle}>All React Examples</h1>
        <p style={subheadingStyle}>
          Comprehensive showcase of every feature in{' '}
          <code style={{ color: '#818cf8' }}>@thaparoyal/calendar-react</code>.
          Each card demonstrates a distinct capability of the library.
        </p>

        <div style={gridStyle}>
          {/* Row 1: Single selects */}
          <SingleSelectBS />
          <SingleSelectAD />

          {/* Row 2: Locale & pickers */}
          <NepaliNumerals />
          <MonthPickerExample />

          {/* Row 3: More pickers */}
          <YearPickerExample />
          <DropdownExample />

          {/* Row 4: Range & multi-date */}
          <RangeSelectionExample />
          <MultiDateSelection />

          {/* Wide: Multi-calendars */}
          <MultiCalendar2Months />
          <MultiCalendar3Months />
          <MultiCalendarRange />

          {/* Row: DatePicker & Disabled */}
          <DatePickerExample />
          <DisabledDatesExample />

          {/* Row: Min/Max & Week starts Monday */}
          <MinMaxExample />
          <WeekStartsMonday />

          {/* Wide: Themes */}
          <ThemesShowcase />

          {/* Wide: Converter */}
          <DateConverterExample />

          {/* Controlled */}
          <ControlledExample />
        </div>
      </div>
    </div>
  );
}

export default AllReactExamples;
