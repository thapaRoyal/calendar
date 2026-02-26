# @thaparoyal/calendar

A comprehensive, multi-calendar UI library supporting AD (Gregorian) and BS (Bikram Sambat/Nepali) calendars. Built with a shadcn/ui-style approach for maximum customization.

## Features

- **Multi-Calendar Support**: AD (Gregorian) and BS (Bikram Sambat) calendars
- **Framework Support**: React, Vue, and Svelte components
- **shadcn/ui Style**: Copy-paste components with full ownership
- **TypeScript First**: Complete type safety
- **Tailwind CSS**: Customizable styling with CSS variables
- **Accessible**: ARIA-compliant components
- **Locale Support**: English and Nepali (Devanagari)
- **Date Conversion**: Accurate AD ↔ BS conversion

## Packages

| Package | Description |
|---------|-------------|
| `@thaparoyal/calendar-core` | Core date conversion and utilities |
| `@thaparoyal/calendar-react` | React components and hooks |
| `@thaparoyal/calendar-vue` | Vue components and composables |
| `@thaparoyal/calendar-svelte` | Svelte components and stores |
| `@thaparoyal/calendar-cli` | CLI for component installation |

## Quick Start

### Using the CLI (Recommended)

```bash
# Initialize in your project
npx @thaparoyal/calendar-cli init

# Add components
npx @thaparoyal/calendar-cli add calendar
npx @thaparoyal/calendar-cli add date-picker
```

### Manual Installation

```bash
# Install the core package
npm install @thaparoyal/calendar-core

# Install framework-specific package
npm install @thaparoyal/calendar-react  # for React
npm install @thaparoyal/calendar-vue    # for Vue
npm install @thaparoyal/calendar-svelte # for Svelte
```

## Usage

### React

```tsx
import { Calendar, DatePicker } from '@thaparoyal/calendar-react';
import '@thaparoyal/calendar-react/styles.css';

function App() {
  const [date, setDate] = useState(null);

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

### Date Conversion

```typescript
import { adToBs, bsToAd, formatDate } from '@thaparoyal/calendar-core';

// Convert AD to BS
const bsDate = adToBs(new Date(2024, 0, 1));
// { year: 2080, month: 9, day: 16, calendarType: 'BS' }

// Convert BS to AD
const adDate = bsToAd({ year: 2080, month: 9, day: 16 });
// { year: 2024, month: 1, day: 1, calendarType: 'AD' }

// Format dates
formatDate(bsDate, 'YYYY MMMM DD', 'en'); // "2080 Poush 16"
formatDate(bsDate, 'YYYY MMMM DD', 'ne'); // "२०८० पौष १६"
```

## Configuration

Create a `calendar.config.json` in your project root:

```json
{
  "$schema": "https://thaparoyal-calendar.dev/schema.json",
  "framework": "react",
  "typescript": true,
  "tailwind": true,
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  },
  "defaultCalendar": "BS",
  "locale": "en"
}
```

## Docker

```bash
# Development
docker-compose -f docker/docker-compose.yml up dev

# Run tests
docker-compose -f docker/docker-compose.yml up test

# Build
docker-compose -f docker/docker-compose.yml up build
```

## Development

```bash
# Install dependencies
pnpm install

# Start development
pnpm dev

# Build all packages
pnpm build

# Run tests
pnpm test

# Type check
pnpm typecheck
```

## Contributing

Contributions are welcome! Please read our [contributing guide](CONTRIBUTING.md) for details.

## License

MIT License - see [LICENSE](LICENSE) for details.
