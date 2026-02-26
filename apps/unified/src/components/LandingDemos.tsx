import { Calendar } from '@thaparoyal/calendar-react';

export function LandingDemos() {
  return (
    <div className="demo-grid">
      <div className="demo-card" data-theme="ocean">
        <h3>BS Calendar (Ocean Theme)</h3>
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
      <div className="demo-card" data-theme="sunset">
        <h3>AD Calendar (Sunset Theme)</h3>
        <Calendar.Root config={{ calendarType: 'AD', locale: 'en' }}>
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
      <div className="demo-card" data-theme="midnight">
        <h3>Nepali Numerals (Midnight Theme)</h3>
        <Calendar.Root config={{ calendarType: 'BS', locale: 'ne' }}>
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
    </div>
  );
}
