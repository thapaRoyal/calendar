import { useState } from 'react';
import { Calendar } from '@thaparoyal/calendar-react';
import '@thaparoyal/calendar-core/themes/themes.css';

const themes = [
  'default',
  'ocean',
  'sunset',
  'midnight',
  'forest',
  'rose',
  'lavender',
  'slate',
  'amber',
  'emerald',
  'ruby',
  'sapphire',
] as const;

type ThemeName = (typeof themes)[number];

interface CalendarConfig {
  title: string;
  calendarType: 'BS' | 'AD';
  locale: 'en' | 'ne';
  defaultTheme: ThemeName;
}

const calendars: CalendarConfig[] = [
  { title: 'BS Calendar', calendarType: 'BS', locale: 'en', defaultTheme: 'ocean' },
  { title: 'AD Calendar', calendarType: 'AD', locale: 'en', defaultTheme: 'sunset' },
  { title: 'Nepali Numerals', calendarType: 'BS', locale: 'ne', defaultTheme: 'midnight' },
];

export function LandingDemos() {
  const [globalTheme, setGlobalTheme] = useState<ThemeName | null>(null);
  const [calType, setCalType] = useState<'BS' | 'AD' | null>(null);
  const [locale, setLocale] = useState<'en' | 'ne' | null>(null);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Controls bar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '2rem',
          padding: '1rem 1.5rem',
          background: '#111118',
          borderRadius: '0.75rem',
          border: '1px solid #1e1e2e',
        }}
      >
        {/* Theme selector */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', alignItems: 'center' }}>
          <span style={{ color: '#666', fontSize: '0.8rem', fontWeight: 600, marginRight: '0.5rem' }}>
            Theme:
          </span>
          {themes.map((t) => (
            <button
              key={t}
              onClick={() => setGlobalTheme(globalTheme === t ? null : t)}
              style={{
                padding: '0.3rem 0.65rem',
                borderRadius: '0.25rem',
                border: `1px solid ${globalTheme === t ? '#667eea' : '#2a2a3a'}`,
                background: globalTheme === t ? '#667eea' : '#16161e',
                color: globalTheme === t ? '#fff' : '#888',
                cursor: 'pointer',
                fontSize: '0.7rem',
                fontWeight: 500,
                transition: 'all 0.15s',
                textTransform: 'capitalize',
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Calendar type toggle */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.375rem',
            marginLeft: '0.5rem',
          }}
        >
          <span style={{ color: '#666', fontSize: '0.8rem', fontWeight: 600, marginRight: '0.25rem' }}>
            Type:
          </span>
          {(['BS', 'AD'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setCalType(calType === type ? null : type)}
              style={{
                padding: '0.3rem 0.75rem',
                borderRadius: '0.25rem',
                border: `1px solid ${calType === type ? '#a855f7' : '#2a2a3a'}`,
                background: calType === type ? '#a855f7' : '#16161e',
                color: calType === type ? '#fff' : '#888',
                cursor: 'pointer',
                fontSize: '0.75rem',
                fontWeight: 600,
                transition: 'all 0.15s',
              }}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Locale toggle */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.375rem',
            marginLeft: '0.5rem',
          }}
        >
          <span style={{ color: '#666', fontSize: '0.8rem', fontWeight: 600, marginRight: '0.25rem' }}>
            Locale:
          </span>
          {([
            ['en', 'English'],
            ['ne', 'नेपाली'],
          ] as const).map(([value, label]) => (
            <button
              key={value}
              onClick={() => setLocale(locale === value ? null : value)}
              style={{
                padding: '0.3rem 0.75rem',
                borderRadius: '0.25rem',
                border: `1px solid ${locale === value ? '#10b981' : '#2a2a3a'}`,
                background: locale === value ? '#10b981' : '#16161e',
                color: locale === value ? '#fff' : '#888',
                cursor: 'pointer',
                fontSize: '0.75rem',
                fontWeight: 600,
                transition: 'all 0.15s',
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Calendar grid */}
      <div className="demo-grid">
        {calendars.map((cal, i) => {
          const activeTheme = globalTheme ?? cal.defaultTheme;
          const activeCalType = calType ?? cal.calendarType;
          const activeLocale = locale ?? cal.locale;
          const calendarKey = `${activeCalType}-${activeLocale}-${i}`;
          return (
            <div className="demo-card" data-theme={activeTheme} key={i}>
              <h3>
                {cal.title}
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 400,
                    color: '#555',
                    marginLeft: '0.5rem',
                    textTransform: 'capitalize',
                  }}
                >
                  {activeTheme} / {activeCalType} / {activeLocale}
                </span>
              </h3>
              <Calendar.Root key={calendarKey} config={{ calendarType: activeCalType, locale: activeLocale }}>
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
        })}
      </div>
    </div>
  );
}
