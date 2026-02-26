import { useState, useEffect } from 'react';
import { Calendar, DatePicker } from '@thaparoyal/calendar-react';
import { adToBs, bsToAd, toNepaliNumeral } from '@thaparoyal/calendar-core';
import type { CalendarDate, Locale } from '@thaparoyal/calendar-core';

const THEMES = [
  { id: 'default', name: 'Light', color: '#ffffff' },
  { id: 'dark', name: 'Dark', color: '#1a1a2e' },
  { id: 'nepal', name: 'Nepal', color: '#DC2626' },
  { id: 'nepal-dark', name: 'Nepal Dark', color: '#7F1D1D' },
  { id: 'ocean', name: 'Ocean', color: '#0EA5E9' },
  { id: 'ocean-dark', name: 'Ocean Dark', color: '#0C4A6E' },
  { id: 'forest', name: 'Forest', color: '#22C55E' },
  { id: 'forest-dark', name: 'Forest Dark', color: '#166534' },
  { id: 'sunset', name: 'Sunset', color: '#F97316' },
  { id: 'sunset-dark', name: 'Sunset Dark', color: '#9A3412' },
  { id: 'royal', name: 'Royal', color: '#8B5CF6' },
  { id: 'royal-dark', name: 'Royal Dark', color: '#5B21B6' },
] as const;

const FRAMEWORKS = [
  { id: 'react', name: 'React', icon: '⚛️', color: '#61DAFB' },
  { id: 'vue', name: 'Vue', icon: '💚', color: '#42B883' },
  { id: 'svelte', name: 'Svelte', icon: '🧡', color: '#FF3E00' },
];

function App() {
  const [theme, setTheme] = useState('dark');
  const [locale, setLocale] = useState<Locale>('en');
  const [activeTab, setActiveTab] = useState<'calendar' | 'picker' | 'converter'>('calendar');

  // Calendar states
  const [adDate, setAdDate] = useState<CalendarDate | null>(null);
  const [bsDate, setBsDate] = useState<CalendarDate | null>(null);
  const [bsNepaliDate, setBsNepaliDate] = useState<CalendarDate | null>(null);
  const [pickerDate, setPickerDate] = useState<CalendarDate | null>(null);

  // Converter state
  const [converterInput, setConverterInput] = useState('2024-01-15');
  const [converterDirection, setConverterDirection] = useState<'ad-to-bs' | 'bs-to-ad'>('ad-to-bs');
  const [converterResult, setConverterResult] = useState<CalendarDate | null>(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    try {
      if (converterDirection === 'ad-to-bs') {
        const [year, month, day] = converterInput.split('-').map(Number);
        if (year && month && day) {
          setConverterResult(adToBs(new Date(year, month - 1, day)));
        }
      } else {
        const [year, month, day] = converterInput.split('-').map(Number);
        if (year && month && day) {
          setConverterResult(bsToAd({ year, month, day, calendarType: 'BS' }));
        }
      }
    } catch {
      setConverterResult(null);
    }
  }, [converterInput, converterDirection]);

  const formatDate = (date: CalendarDate | null, displayLocale: Locale = 'en'): string => {
    if (!date) return displayLocale === 'ne' ? 'मिति छानिएको छैन' : 'No date selected';
    if (displayLocale === 'ne') {
      return `${toNepaliNumeral(date.year)}-${toNepaliNumeral(date.month).padStart(2, '०')}-${toNepaliNumeral(date.day).padStart(2, '०')}`;
    }
    return `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`;
  };

  const text = {
    hero: {
      title: locale === 'ne' ? 'पात्रो' : 'Calendar',
      subtitle: locale === 'ne' ? 'नेपाली र अंग्रेजी पात्रो' : 'Multi-Calendar UI Library',
      description: locale === 'ne'
        ? 'AD र BS पात्रो समर्थनको साथ React, Vue, र Svelte को लागि सुन्दर, अनुकूलन योग्य पात्रो कम्पोनेन्ट।'
        : 'Beautiful, customizable calendar components for React, Vue, and Svelte with AD and BS (Nepali) calendar support.',
    },
    tabs: {
      calendar: locale === 'ne' ? 'पात्रो' : 'Calendar',
      picker: locale === 'ne' ? 'मिति छान्नुहोस्' : 'Date Picker',
      converter: locale === 'ne' ? 'रूपान्तरण' : 'Converter',
    },
    calendars: {
      ad: locale === 'ne' ? 'AD पात्रो' : 'AD Calendar',
      bs: locale === 'ne' ? 'BS पात्रो' : 'BS Calendar',
      bsNepali: locale === 'ne' ? 'नेपाली अंकहरू' : 'Nepali Numerals',
    },
    features: [
      {
        icon: '🌍',
        title: locale === 'ne' ? 'बहु-पात्रो' : 'Multi-Calendar',
        desc: locale === 'ne' ? 'AD र BS दुवै समर्थन' : 'AD and BS support'
      },
      {
        icon: '🎨',
        title: locale === 'ne' ? 'थिमहरू' : 'Themes',
        desc: locale === 'ne' ? '१२ बिल्ट-इन थिमहरू' : '12 built-in themes'
      },
      {
        icon: '🔧',
        title: locale === 'ne' ? 'फ्रेमवर्कहरू' : 'Frameworks',
        desc: locale === 'ne' ? 'React, Vue, Svelte' : 'React, Vue, Svelte'
      },
      {
        icon: '♿',
        title: locale === 'ne' ? 'पहुँचयोग्य' : 'Accessible',
        desc: locale === 'ne' ? 'ARIA समर्थन' : 'Full ARIA support'
      },
    ],
  };

  return (
    <div className="landing">
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
          </a>

          <nav className="header-nav">
            <a href="#features" className="nav-link">Features</a>
            <a href="#demo" className="nav-link">Demo</a>
            <a href="http://localhost:4321" className="nav-link" target="_blank" rel="noopener noreferrer">Docs</a>
          </nav>

          <div className="header-controls">
            <select
              className="control-select"
              value={locale}
              onChange={(e) => setLocale(e.target.value as Locale)}
              aria-label="Language"
            >
              <option value="en">EN</option>
              <option value="ne">NE</option>
            </select>

            <select
              className="control-select"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              aria-label="Theme"
            >
              {THEMES.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>

            <a
              href="https://github.com/thaparoyal/calendar"
              className="github-btn"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-icon">v0.1.0</span>
            <span className="badge-text">{locale === 'ne' ? 'नयाँ रिलिज' : 'Now Available'}</span>
          </div>

          <h1 className="hero-title">
            <span className="title-gradient">{text.hero.title}</span>
            <br />
            <span className="title-secondary">{text.hero.subtitle}</span>
          </h1>

          <p className="hero-description">{text.hero.description}</p>

          <div className="hero-frameworks">
            {FRAMEWORKS.map(fw => (
              <div key={fw.id} className="framework-badge" style={{ '--fw-color': fw.color } as React.CSSProperties}>
                <span className="fw-icon">{fw.icon}</span>
                <span className="fw-name">{fw.name}</span>
              </div>
            ))}
          </div>

          <div className="hero-actions">
            <a href="http://localhost:4321/getting-started/installation" className="btn btn-primary">
              {locale === 'ne' ? 'सुरु गर्नुहोस्' : 'Get Started'}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
            <a href="#demo" className="btn btn-secondary">
              {locale === 'ne' ? 'डेमो हेर्नुहोस्' : 'View Demo'}
            </a>
          </div>

          <div className="hero-install">
            <code className="install-code">
              <span className="code-prompt">$</span> npm install @thaparoyal/calendar-react
            </code>
            <button className="copy-btn" onClick={() => navigator.clipboard.writeText('npm install @thaparoyal/calendar-react')} aria-label="Copy to clipboard">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="features">
        <div className="features-grid">
          {text.features.map((feature, i) => (
            <div key={i} className="feature-card">
              <span className="feature-icon">{feature.icon}</span>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-desc">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="demo-section">
        <div className="demo-header">
          <h2 className="section-title">{locale === 'ne' ? 'लाइभ डेमो' : 'Live Demo'}</h2>
          <p className="section-subtitle">
            {locale === 'ne'
              ? 'विभिन्न थिमहरू र विकल्पहरू प्रयास गर्नुहोस्'
              : 'Try different themes and options'}
          </p>
        </div>

        {/* Tabs */}
        <div className="demo-tabs">
          <button
            className={`tab ${activeTab === 'calendar' ? 'active' : ''}`}
            onClick={() => setActiveTab('calendar')}
          >
            {text.tabs.calendar}
          </button>
          <button
            className={`tab ${activeTab === 'picker' ? 'active' : ''}`}
            onClick={() => setActiveTab('picker')}
          >
            {text.tabs.picker}
          </button>
          <button
            className={`tab ${activeTab === 'converter' ? 'active' : ''}`}
            onClick={() => setActiveTab('converter')}
          >
            {text.tabs.converter}
          </button>
        </div>

        {/* Demo Content */}
        <div className="demo-content">
          {activeTab === 'calendar' && (
            <div className="calendar-demos">
              {/* AD Calendar */}
              <div className="demo-card">
                <div className="card-header">
                  <h3>{text.calendars.ad}</h3>
                  <span className="card-badge ad">AD</span>
                </div>
                <div className="card-body">
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
                <div className="card-footer">
                  <span className="selected-date">{formatDate(adDate, locale)}</span>
                </div>
              </div>

              {/* BS Calendar */}
              <div className="demo-card">
                <div className="card-header">
                  <h3>{text.calendars.bs}</h3>
                  <span className="card-badge bs">BS</span>
                </div>
                <div className="card-body">
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
                <div className="card-footer">
                  <span className="selected-date">{formatDate(bsDate, locale)}</span>
                </div>
              </div>

              {/* BS Calendar with Nepali Numerals */}
              <div className="demo-card nepali">
                <div className="card-header">
                  <h3>{text.calendars.bsNepali}</h3>
                  <span className="card-badge nepali">नेपाली</span>
                </div>
                <div className="card-body">
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
                <div className="card-footer">
                  <span className="selected-date">{formatDate(bsNepaliDate, 'ne')}</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'picker' && (
            <div className="picker-demo">
              <div className="demo-card wide">
                <div className="card-header">
                  <h3>{locale === 'ne' ? 'मिति पिकर' : 'Date Picker'}</h3>
                </div>
                <div className="card-body picker-body">
                  <div className="picker-row">
                    <label className="picker-label">{locale === 'ne' ? 'AD मिति' : 'AD Date'}</label>
                    <DatePicker.Root
                      config={{ calendarType: 'AD', locale }}
                      value={pickerDate}
                      onValueChange={setPickerDate}
                    >
                      <DatePicker.Input placeholder={locale === 'ne' ? 'मिति छान्नुहोस्' : 'Select date'} />
                      <DatePicker.Trigger />
                      <DatePicker.Content>
                        <DatePicker.Calendar />
                      </DatePicker.Content>
                    </DatePicker.Root>
                  </div>
                  <div className="picker-row">
                    <label className="picker-label">{locale === 'ne' ? 'BS मिति' : 'BS Date'}</label>
                    <DatePicker.Root
                      config={{ calendarType: 'BS', locale }}
                    >
                      <DatePicker.Input placeholder={locale === 'ne' ? 'मिति छान्नुहोस्' : 'Select date'} />
                      <DatePicker.Trigger />
                      <DatePicker.Content>
                        <DatePicker.Calendar />
                      </DatePicker.Content>
                    </DatePicker.Root>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'converter' && (
            <div className="converter-demo">
              <div className="demo-card wide">
                <div className="card-header">
                  <h3>{locale === 'ne' ? 'मिति रूपान्तरण' : 'Date Converter'}</h3>
                  <div className="direction-toggle">
                    <button
                      className={`toggle-btn ${converterDirection === 'ad-to-bs' ? 'active' : ''}`}
                      onClick={() => setConverterDirection('ad-to-bs')}
                    >
                      AD → BS
                    </button>
                    <button
                      className={`toggle-btn ${converterDirection === 'bs-to-ad' ? 'active' : ''}`}
                      onClick={() => setConverterDirection('bs-to-ad')}
                    >
                      BS → AD
                    </button>
                  </div>
                </div>
                <div className="card-body converter-body">
                  <div className="converter-input-group">
                    <label className="converter-label">
                      {converterDirection === 'ad-to-bs'
                        ? (locale === 'ne' ? 'AD मिति' : 'AD Date')
                        : (locale === 'ne' ? 'BS मिति' : 'BS Date')
                      }
                    </label>
                    <input
                      type="text"
                      className="converter-input"
                      value={converterInput}
                      onChange={(e) => setConverterInput(e.target.value)}
                      placeholder="YYYY-MM-DD"
                    />
                  </div>
                  <div className="converter-arrow">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </div>
                  <div className="converter-result-group">
                    <label className="converter-label">
                      {converterDirection === 'ad-to-bs'
                        ? (locale === 'ne' ? 'BS मिति' : 'BS Date')
                        : (locale === 'ne' ? 'AD मिति' : 'AD Date')
                      }
                    </label>
                    <div className="converter-result">
                      {converterResult
                        ? formatDate(converterResult, locale)
                        : (locale === 'ne' ? 'रूपान्तरण गर्न मिति प्रविष्ट गर्नुहोस्' : 'Enter a date to convert')
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Theme Showcase */}
      <section className="themes-section">
        <div className="themes-header">
          <h2 className="section-title">{locale === 'ne' ? 'थिमहरू' : 'Themes'}</h2>
          <p className="section-subtitle">
            {locale === 'ne'
              ? '१२ पूर्व-निर्मित थिमहरू मध्ये छान्नुहोस्'
              : 'Choose from 12 pre-built themes'}
          </p>
        </div>
        <div className="themes-grid">
          {THEMES.map(t => (
            <button
              key={t.id}
              className={`theme-card ${theme === t.id ? 'active' : ''}`}
              onClick={() => setTheme(t.id)}
              style={{ '--theme-color': t.color } as React.CSSProperties}
            >
              <div className="theme-preview" />
              <span className="theme-name">{t.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Playground Links */}
      <section className="playgrounds-section">
        <div className="playgrounds-header">
          <h2 className="section-title">{locale === 'ne' ? 'प्लेग्राउन्डहरू' : 'Playgrounds'}</h2>
          <p className="section-subtitle">
            {locale === 'ne'
              ? 'विभिन्न फ्रेमवर्कहरूमा प्रयास गर्नुहोस्'
              : 'Try in different frameworks'}
          </p>
        </div>
        <div className="playgrounds-grid">
          <a href="http://localhost:5173" className="playground-card react" target="_blank" rel="noopener noreferrer">
            <span className="pg-icon">⚛️</span>
            <span className="pg-name">React</span>
            <span className="pg-port">:5173</span>
          </a>
          <a href="http://localhost:5174" className="playground-card vue" target="_blank" rel="noopener noreferrer">
            <span className="pg-icon">💚</span>
            <span className="pg-name">Vue</span>
            <span className="pg-port">:5174</span>
          </a>
          <a href="http://localhost:5175" className="playground-card svelte" target="_blank" rel="noopener noreferrer">
            <span className="pg-icon">🧡</span>
            <span className="pg-name">Svelte</span>
            <span className="pg-port">:5175</span>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="logo">
              <div className="logo-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
                  <line x1="16" x2="16" y1="2" y2="6"/>
                  <line x1="8" x2="8" y1="2" y2="6"/>
                  <line x1="3" x2="21" y1="10" y2="10"/>
                </svg>
              </div>
              <span className="logo-text">@thaparoyal/calendar</span>
            </div>
            <p className="footer-desc">
              {locale === 'ne'
                ? 'AD र BS पात्रो समर्थनको साथ बहु-फ्रेमवर्क पात्रो लाइब्रेरी।'
                : 'Multi-framework calendar library with AD and BS calendar support.'}
            </p>
          </div>
          <div className="footer-links">
            <a href="http://localhost:4321" target="_blank" rel="noopener noreferrer">Documentation</a>
            <a href="https://github.com/thaparoyal/calendar" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href="https://www.npmjs.com/package/@thaparoyal/calendar-react" target="_blank" rel="noopener noreferrer">npm</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>
            {locale === 'ne'
              ? '© २०२४ @thaparoyal/calendar। MIT लाइसेन्स।'
              : '© 2024 @thaparoyal/calendar. MIT License.'}
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
