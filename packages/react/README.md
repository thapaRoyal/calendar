# @thaparoyal/calendar-react

React components for AD (Gregorian) and BS (Bikram Sambat/Nepali) calendars.

## Installation

```bash
npm install @thaparoyal/calendar-react @thaparoyal/calendar-core
```

## Components

- **Calendar** - Full calendar component with compound pattern
- **DatePicker** - Date picker with input and dropdown calendar

## Usage

### Calendar Component

```tsx
import { useState } from 'react';
import { Calendar, type CalendarDate } from '@thaparoyal/calendar-react';
import '@thaparoyal/calendar-react/styles.css';

function MyCalendar() {
  const [date, setDate] = useState<CalendarDate | null>(null);

  return (
    <Calendar.Root
      config={{ calendarType: 'BS', locale: 'en' }}
      value={date}
      onValueChange={setDate}
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
  );
}
```

### DatePicker Component

```tsx
import { useState } from 'react';
import { DatePicker, type CalendarDate } from '@thaparoyal/calendar-react';
import '@thaparoyal/calendar-react/styles.css';

function MyDatePicker() {
  const [date, setDate] = useState<CalendarDate | null>(null);

  return (
    <DatePicker.Root
      config={{ calendarType: 'BS', locale: 'en' }}
      value={date}
      onValueChange={setDate}
    >
      <DatePicker.Input />
      <DatePicker.Trigger />
      <DatePicker.ClearButton />
      <DatePicker.Content>
        <DatePicker.Calendar />
      </DatePicker.Content>
    </DatePicker.Root>
  );
}
```

### Using Hooks

```tsx
import { useCalendar, useDatePicker, useDateConverter } from '@thaparoyal/calendar-react';

// useCalendar hook
function MyCustomCalendar() {
  const { state, actions, weeks, title } = useCalendar({
    config: { calendarType: 'BS' },
    onValueChange: (date) => console.log('Selected:', date),
  });

  return (
    <div>
      <h2>{title}</h2>
      <button onClick={actions.prevMonth}>Previous</button>
      <button onClick={actions.nextMonth}>Next</button>
      {/* Render weeks */}
    </div>
  );
}

// useDateConverter hook
function DateConverterExample() {
  const { adToBs, bsToAd, format } = useDateConverter();

  const bs = adToBs(new Date());
  const formatted = format(bs, 'YYYY MMMM DD');

  return <p>Today in BS: {formatted}</p>;
}
```

## Calendar Components

| Component | Description |
|-----------|-------------|
| `Calendar.Root` | Root component that provides context |
| `Calendar.Header` | Container for navigation controls |
| `Calendar.Title` | Displays current month and year |
| `Calendar.PrevButton` | Navigate to previous month |
| `Calendar.NextButton` | Navigate to next month |
| `Calendar.Grid` | Table container for calendar |
| `Calendar.GridHead` | Weekday header row |
| `Calendar.GridBody` | Calendar days grid |
| `Calendar.Row` | Custom row component |
| `Calendar.DayCell` | Custom day cell component |

## DatePicker Components

| Component | Description |
|-----------|-------------|
| `DatePicker.Root` | Root component with picker state |
| `DatePicker.Input` | Text input for date entry |
| `DatePicker.Trigger` | Button to open calendar |
| `DatePicker.Content` | Dropdown container |
| `DatePicker.Calendar` | Embedded calendar |
| `DatePicker.ClearButton` | Clear selected date |

## Props

### Calendar.Root Props

```typescript
interface CalendarRootProps {
  config?: Partial<CalendarConfig>;
  value?: CalendarDate | null;
  defaultValue?: CalendarDate;
  onValueChange?: (date: CalendarDate) => void;
  disabledDates?: CalendarDate[];
  className?: string;
}
```

### CalendarConfig

```typescript
interface CalendarConfig {
  calendarType: 'AD' | 'BS';
  locale: 'en' | 'ne';
  weekStartsOn: 0 | 1; // 0 = Sunday, 1 = Monday
  minDate?: CalendarDate;
  maxDate?: CalendarDate;
}
```

## Styling

### Default Styles

Import the default styles:

```tsx
import '@thaparoyal/calendar-react/styles.css';
```

### CSS Variables

Customize with CSS variables:

```css
:root {
  --trc-primary: #2563eb;
  --trc-primary-foreground: #ffffff;
  --trc-background: #ffffff;
  --trc-foreground: #1f2937;
  --trc-muted: #f3f4f6;
  --trc-muted-foreground: #6b7280;
  --trc-border: #e5e7eb;
  --trc-ring: #3b82f6;
  --trc-radius: 0.375rem;
}
```

### Tailwind CSS

All components use CSS classes prefixed with `trc-`. You can use these with Tailwind's `@apply` or override with your own classes.

## License

MIT
