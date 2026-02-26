import { useState } from 'react';
import { Calendar, DatePicker } from '@thaparoyal/calendar-react';
import { adToBs, bsToAd } from '@thaparoyal/calendar-core';
import type { CalendarDate } from '@thaparoyal/calendar-core';

function App() {
  const [adDate, setAdDate] = useState<CalendarDate | null>(null);
  const [bsDate, setBsDate] = useState<CalendarDate | null>(null);
  const [pickerDate, setPickerDate] = useState<CalendarDate | null>(null);
  const [bsPickerDate, setBsPickerDate] = useState<CalendarDate | null>(null);

  // Converter state
  const [adInput, setAdInput] = useState('2024-01-15');
  const [convertedBs, setConvertedBs] = useState<CalendarDate | null>(null);

  const handleConvert = () => {
    try {
      const [year, month, day] = adInput.split('-').map(Number);
      const result = adToBs(new Date(year, month - 1, day));
      setConvertedBs(result);
    } catch {
      setConvertedBs(null);
    }
  };

  const formatDate = (date: CalendarDate | null): string => {
    if (!date) return 'No date selected';
    return `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')} (${date.calendarType})`;
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <a href="/" className="logo">
            <div className="logo-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
                <line x1="16" x2="16" y1="2" y2="6"/>
                <line x1="8" x2="8" y1="2" y2="6"/>
                <line x1="3" x2="21" y1="10" y2="10"/>
              </svg>
            </div>
            <span className="logo-text">@thaparoyal/calendar</span>
            <span className="logo-badge">React</span>
          </a>
          <div className="header-links">
            <a href="http://localhost:4321" className="header-link">Documentation</a>
            <a href="https://github.com/thaparoyal/calendar" className="header-link github-link" target="_blank" rel="noopener noreferrer">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main">
        {/* Hero */}
        <section className="hero">
          <h1 className="hero-title">Calendar Components</h1>
          <p className="hero-description">
            Beautiful, accessible calendar components for React.
            Supporting both AD (Gregorian) and BS (Bikram Sambat) calendars.
          </p>
          <div className="hero-badges">
            <span className="badge">
              <span className="badge-dot ad"></span>
              AD Calendar
            </span>
            <span className="badge">
              <span className="badge-dot bs"></span>
              BS Calendar
            </span>
            <span className="badge">
              <span className="badge-dot react"></span>
              React 18+
            </span>
          </div>
        </section>

        {/* Calendar Demos */}
        <section className="demos">
          {/* AD Calendar */}
          <div className="demo-card">
            <div className="demo-header">
              <div>
                <h3 className="demo-title">AD Calendar</h3>
                <p className="demo-subtitle">Gregorian calendar system</p>
              </div>
              <span className="demo-tag">AD</span>
            </div>
            <div className="demo-content">
              <Calendar.Root
                calendarType="AD"
                value={adDate}
                onValueChange={setAdDate}
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
            <div className="demo-footer">
              <span className="demo-value">
                <strong>Selected:</strong> {formatDate(adDate)}
              </span>
            </div>
          </div>

          {/* BS Calendar */}
          <div className="demo-card">
            <div className="demo-header">
              <div>
                <h3 className="demo-title">BS Calendar</h3>
                <p className="demo-subtitle">Bikram Sambat (Nepali) calendar</p>
              </div>
              <span className="demo-tag">BS</span>
            </div>
            <div className="demo-content">
              <Calendar.Root
                calendarType="BS"
                value={bsDate}
                onValueChange={setBsDate}
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
            <div className="demo-footer">
              <span className="demo-value">
                <strong>Selected:</strong> {formatDate(bsDate)}
              </span>
            </div>
          </div>

          {/* AD Date Picker */}
          <div className="demo-card">
            <div className="demo-header">
              <div>
                <h3 className="demo-title">Date Picker (AD)</h3>
                <p className="demo-subtitle">With dropdown calendar</p>
              </div>
              <span className="demo-tag">Picker</span>
            </div>
            <div className="demo-content">
              <DatePicker.Root
                calendarType="AD"
                value={pickerDate}
                onValueChange={setPickerDate}
              >
                <div className="trc-date-picker-input-wrapper">
                  <DatePicker.Input placeholder="Select a date..." />
                  <DatePicker.Trigger />
                </div>
                <DatePicker.Content>
                  <DatePicker.Calendar />
                </DatePicker.Content>
              </DatePicker.Root>
            </div>
            <div className="demo-footer">
              <span className="demo-value">
                <strong>Selected:</strong> {formatDate(pickerDate)}
              </span>
            </div>
          </div>

          {/* BS Date Picker */}
          <div className="demo-card">
            <div className="demo-header">
              <div>
                <h3 className="demo-title">Date Picker (BS)</h3>
                <p className="demo-subtitle">Nepali date selection</p>
              </div>
              <span className="demo-tag">Picker</span>
            </div>
            <div className="demo-content">
              <DatePicker.Root
                calendarType="BS"
                value={bsPickerDate}
                onValueChange={setBsPickerDate}
              >
                <div className="trc-date-picker-input-wrapper">
                  <DatePicker.Input placeholder="Select a date..." />
                  <DatePicker.Trigger />
                </div>
                <DatePicker.Content>
                  <DatePicker.Calendar />
                </DatePicker.Content>
              </DatePicker.Root>
            </div>
            <div className="demo-footer">
              <span className="demo-value">
                <strong>Selected:</strong> {formatDate(bsPickerDate)}
              </span>
            </div>
          </div>
        </section>

        {/* Converter Section */}
        <section className="converter-section">
          <h2 className="section-title">Date Converter</h2>
          <div className="converter-card">
            <div className="converter-grid">
              <div className="converter-input-group">
                <label className="converter-label">
                  AD Date
                  <span className="converter-label-badge">Gregorian</span>
                </label>
                <input
                  type="date"
                  className="converter-input"
                  value={adInput}
                  onChange={(e) => setAdInput(e.target.value)}
                  onBlur={handleConvert}
                />
              </div>

              <div className="converter-arrow">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </div>

              <div className="converter-input-group">
                <label className="converter-label">
                  BS Date
                  <span className="converter-label-badge">Bikram Sambat</span>
                </label>
                <div className="converter-result">
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

      {/* Footer */}
      <footer className="footer">
        <p>
          Built with <a href="https://github.com/thaparoyal/calendar">@thaparoyal/calendar</a>
          {' '}&bull;{' '}
          <a href="http://localhost:4321">Documentation</a>
          {' '}&bull;{' '}
          MIT License
        </p>
      </footer>
    </div>
  );
}

export default App;
