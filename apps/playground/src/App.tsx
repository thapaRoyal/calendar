import { useState, useEffect } from 'react';
import { Calendar, DatePicker } from '@thaparoyal/calendar-react';
import { adToBs, toNepaliNumeral } from '@thaparoyal/calendar-core';
import type { CalendarDate, Locale } from '@thaparoyal/calendar-core';

const THEMES = [
  { id: 'default', name: 'Default', label: 'Light' },
  { id: 'dark', name: 'Dark', label: 'Dark' },
  { id: 'nepal', name: 'Nepal', label: 'Nepal' },
  { id: 'nepal-dark', name: 'Nepal Dark', label: 'Nepal Dark' },
  { id: 'ocean', name: 'Ocean', label: 'Ocean' },
  { id: 'ocean-dark', name: 'Ocean Dark', label: 'Ocean Dark' },
  { id: 'forest', name: 'Forest', label: 'Forest' },
  { id: 'forest-dark', name: 'Forest Dark', label: 'Forest Dark' },
  { id: 'sunset', name: 'Sunset', label: 'Sunset' },
  { id: 'sunset-dark', name: 'Sunset Dark', label: 'Sunset Dark' },
  { id: 'royal', name: 'Royal', label: 'Royal' },
  { id: 'royal-dark', name: 'Royal Dark', label: 'Royal Dark' },
] as const;

function App() {
  const [adDate, setAdDate] = useState<CalendarDate | null>(null);
  const [bsDate, setBsDate] = useState<CalendarDate | null>(null);
  const [bsNepaliDate, setBsNepaliDate] = useState<CalendarDate | null>(null);
  const [pickerDate, setPickerDate] = useState<CalendarDate | null>(null);
  const [bsPickerDate, setBsPickerDate] = useState<CalendarDate | null>(null);

  // Theme and locale state
  const [theme, setTheme] = useState<string>('dark');
  const [locale, setLocale] = useState<Locale>('en');

  // Converter state
  const [adInput, setAdInput] = useState('2024-01-15');
  const [convertedBs, setConvertedBs] = useState<CalendarDate | null>(null);

  // Apply theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const handleConvert = () => {
    try {
      const [year, month, day] = adInput.split('-').map(Number);
      const result = adToBs(new Date(year, month - 1, day));
      setConvertedBs(result);
    } catch {
      setConvertedBs(null);
    }
  };

  useEffect(() => {
    handleConvert();
  }, [adInput]);

  const formatDateDisplay = (date: CalendarDate | null, displayLocale: Locale = 'en'): string => {
    if (!date) return locale === 'ne' ? 'मिति छानिएको छैन' : 'No date selected';

    if (displayLocale === 'ne') {
      const nepYear = toNepaliNumeral(date.year);
      const nepMonth = toNepaliNumeral(date.month);
      const nepDay = toNepaliNumeral(date.day);
      return `${nepYear}-${nepMonth.padStart(2, '०')}-${nepDay.padStart(2, '०')} (${date.calendarType})`;
    }

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

          <div className="header-controls">
            {/* Theme Selector */}
            <div className="control-group">
              <label className="control-label">Theme</label>
              <select
                className="control-select"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
              >
                {THEMES.map((t) => (
                  <option key={t.id} value={t.id}>{t.label}</option>
                ))}
              </select>
            </div>

            {/* Locale Selector */}
            <div className="control-group">
              <label className="control-label">Locale</label>
              <select
                className="control-select"
                value={locale}
                onChange={(e) => setLocale(e.target.value as Locale)}
              >
                <option value="en">English</option>
                <option value="ne">नेपाली (Nepali)</option>
              </select>
            </div>
          </div>

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
          <h1 className="hero-title">
            {locale === 'ne' ? 'पात्रो कम्पोनेन्टहरू' : 'Calendar Components'}
          </h1>
          <p className="hero-description">
            {locale === 'ne'
              ? 'React को लागि सुन्दर, पहुँचयोग्य पात्रो कम्पोनेन्टहरू। AD (ग्रेगोरियन) र BS (विक्रम संवत) दुवै पात्रो समर्थन गर्दछ।'
              : 'Beautiful, accessible calendar components for React. Supporting both AD (Gregorian) and BS (Bikram Sambat) calendars.'
            }
          </p>
          <div className="hero-badges">
            <span className="badge">
              <span className="badge-dot ad"></span>
              {locale === 'ne' ? 'AD पात्रो' : 'AD Calendar'}
            </span>
            <span className="badge">
              <span className="badge-dot bs"></span>
              {locale === 'ne' ? 'BS पात्रो' : 'BS Calendar'}
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
                <h3 className="demo-title">{locale === 'ne' ? 'AD पात्रो' : 'AD Calendar'}</h3>
                <p className="demo-subtitle">{locale === 'ne' ? 'ग्रेगोरियन पात्रो प्रणाली' : 'Gregorian calendar system'}</p>
              </div>
              <span className="demo-tag">AD</span>
            </div>
            <div className="demo-content">
              <Calendar.Root
                config={{ calendarType: 'AD', locale }}
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
                <strong>{locale === 'ne' ? 'छानिएको:' : 'Selected:'}</strong> {formatDateDisplay(adDate, locale)}
              </span>
            </div>
          </div>

          {/* BS Calendar (English) */}
          <div className="demo-card">
            <div className="demo-header">
              <div>
                <h3 className="demo-title">{locale === 'ne' ? 'BS पात्रो' : 'BS Calendar'}</h3>
                <p className="demo-subtitle">{locale === 'ne' ? 'विक्रम संवत (नेपाली) पात्रो' : 'Bikram Sambat (Nepali) calendar'}</p>
              </div>
              <span className="demo-tag">BS</span>
            </div>
            <div className="demo-content">
              <Calendar.Root
                config={{ calendarType: 'BS', locale }}
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
                <strong>{locale === 'ne' ? 'छानिएको:' : 'Selected:'}</strong> {formatDateDisplay(bsDate, locale)}
              </span>
            </div>
          </div>

          {/* BS Calendar with Nepali Numerals */}
          <div className="demo-card">
            <div className="demo-header">
              <div>
                <h3 className="demo-title">नेपाली अंकहरू</h3>
                <p className="demo-subtitle">{locale === 'ne' ? 'देवनागरी अंकहरूमा' : 'With Devanagari numerals'}</p>
              </div>
              <span className="demo-tag">नेपाली</span>
            </div>
            <div className="demo-content">
              <Calendar.Root
                config={{ calendarType: 'BS', locale: 'ne' }}
                value={bsNepaliDate}
                onValueChange={setBsNepaliDate}
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
                <strong>छानिएको:</strong> {formatDateDisplay(bsNepaliDate, 'ne')}
              </span>
            </div>
          </div>

          {/* AD Date Picker */}
          <div className="demo-card">
            <div className="demo-header">
              <div>
                <h3 className="demo-title">{locale === 'ne' ? 'मिति पिकर (AD)' : 'Date Picker (AD)'}</h3>
                <p className="demo-subtitle">{locale === 'ne' ? 'ड्रपडाउन पात्रोको साथ' : 'With dropdown calendar'}</p>
              </div>
              <span className="demo-tag">Picker</span>
            </div>
            <div className="demo-content">
              <DatePicker.Root
                config={{ calendarType: 'AD', locale }}
                value={pickerDate}
                onValueChange={setPickerDate}
              >
                <div className="trc-date-picker-input-wrapper">
                  <DatePicker.Input placeholder={locale === 'ne' ? 'मिति छान्नुहोस्...' : 'Select a date...'} />
                  <DatePicker.Trigger />
                </div>
                <DatePicker.Content>
                  <DatePicker.Calendar />
                </DatePicker.Content>
              </DatePicker.Root>
            </div>
            <div className="demo-footer">
              <span className="demo-value">
                <strong>{locale === 'ne' ? 'छानिएको:' : 'Selected:'}</strong> {formatDateDisplay(pickerDate, locale)}
              </span>
            </div>
          </div>

          {/* BS Date Picker */}
          <div className="demo-card">
            <div className="demo-header">
              <div>
                <h3 className="demo-title">{locale === 'ne' ? 'मिति पिकर (BS)' : 'Date Picker (BS)'}</h3>
                <p className="demo-subtitle">{locale === 'ne' ? 'नेपाली मिति छनौट' : 'Nepali date selection'}</p>
              </div>
              <span className="demo-tag">Picker</span>
            </div>
            <div className="demo-content">
              <DatePicker.Root
                config={{ calendarType: 'BS', locale }}
                value={bsPickerDate}
                onValueChange={setBsPickerDate}
              >
                <div className="trc-date-picker-input-wrapper">
                  <DatePicker.Input placeholder={locale === 'ne' ? 'मिति छान्नुहोस्...' : 'Select a date...'} />
                  <DatePicker.Trigger />
                </div>
                <DatePicker.Content>
                  <DatePicker.Calendar />
                </DatePicker.Content>
              </DatePicker.Root>
            </div>
            <div className="demo-footer">
              <span className="demo-value">
                <strong>{locale === 'ne' ? 'छानिएको:' : 'Selected:'}</strong> {formatDateDisplay(bsPickerDate, locale)}
              </span>
            </div>
          </div>
        </section>

        {/* Converter Section */}
        <section className="converter-section">
          <h2 className="section-title">{locale === 'ne' ? 'मिति रूपान्तरण' : 'Date Converter'}</h2>
          <div className="converter-card">
            <div className="converter-grid">
              <div className="converter-input-group">
                <label className="converter-label">
                  {locale === 'ne' ? 'AD मिति' : 'AD Date'}
                  <span className="converter-label-badge">{locale === 'ne' ? 'ग्रेगोरियन' : 'Gregorian'}</span>
                </label>
                <input
                  type="date"
                  className="converter-input"
                  value={adInput}
                  onChange={(e) => setAdInput(e.target.value)}
                />
              </div>

              <div className="converter-arrow">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </div>

              <div className="converter-input-group">
                <label className="converter-label">
                  {locale === 'ne' ? 'BS मिति' : 'BS Date'}
                  <span className="converter-label-badge">{locale === 'ne' ? 'विक्रम संवत' : 'Bikram Sambat'}</span>
                </label>
                <div className="converter-result">
                  {convertedBs
                    ? locale === 'ne'
                      ? `${toNepaliNumeral(convertedBs.year)}-${toNepaliNumeral(convertedBs.month).padStart(2, '०')}-${toNepaliNumeral(convertedBs.day).padStart(2, '०')}`
                      : `${convertedBs.year}-${String(convertedBs.month).padStart(2, '0')}-${String(convertedBs.day).padStart(2, '0')}`
                    : locale === 'ne' ? 'रूपान्तरण गर्न AD मिति प्रविष्ट गर्नुहोस्' : 'Enter AD date to convert'
                  }
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Theme Preview Section */}
        <section className="theme-preview-section">
          <h2 className="section-title">{locale === 'ne' ? 'थिम प्रिभ्यू' : 'Theme Preview'}</h2>
          <div className="theme-grid">
            {THEMES.map((t) => (
              <button
                key={t.id}
                className={`theme-preview-card ${theme === t.id ? 'active' : ''}`}
                onClick={() => setTheme(t.id)}
                data-theme={t.id}
              >
                <div className="theme-preview-mini-calendar">
                  <div className="mini-header">
                    <span className="mini-dot"></span>
                    <span className="mini-title"></span>
                    <span className="mini-dot"></span>
                  </div>
                  <div className="mini-grid">
                    {[...Array(7)].map((_, i) => (
                      <span key={i} className="mini-weekday"></span>
                    ))}
                    {[...Array(35)].map((_, i) => (
                      <span
                        key={i}
                        className={`mini-day ${i === 15 ? 'today' : ''} ${i === 20 ? 'selected' : ''}`}
                      ></span>
                    ))}
                  </div>
                </div>
                <span className="theme-preview-label">{t.label}</span>
              </button>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>
          {locale === 'ne'
            ? <>
                <a href="https://github.com/thaparoyal/calendar">@thaparoyal/calendar</a>
                {' '}द्वारा निर्मित
                {' '}&bull;{' '}
                <a href="http://localhost:4321">कागजात</a>
                {' '}&bull;{' '}
                MIT लाइसेन्स
              </>
            : <>
                Built with <a href="https://github.com/thaparoyal/calendar">@thaparoyal/calendar</a>
                {' '}&bull;{' '}
                <a href="http://localhost:4321">Documentation</a>
                {' '}&bull;{' '}
                MIT License
              </>
          }
        </p>
      </footer>
    </div>
  );
}

export default App;
