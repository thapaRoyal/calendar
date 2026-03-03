# @thaparoyal/calendar-cli

CLI tool for installing `@thaparoyal/calendar` components into your project — inspired by shadcn/ui's copy-paste approach.

## Installation

```bash
# Using npx (recommended — no global install needed)
npx @thaparoyal/calendar-cli init

# Or install globally
npm install -g @thaparoyal/calendar-cli
trc init
```

## Overview

Instead of shipping opaque, hard-to-customise UI components, this CLI copies component source code directly into your project. You own the code and can modify it freely.

**Workflow:**

1. `trc init` — Set up calendar configuration in your project
2. `trc add <component>` — Copy component files into your project
3. Customise as needed — the code is yours

## Commands

### `trc init`

Initialise calendar configuration in your project.

```bash
npx @thaparoyal/calendar-cli init
```

This command:
- Detects your framework (React, Vue, Svelte, or Vanilla JS)
- Detects TypeScript and Tailwind CSS
- Prompts for default calendar type (BS/AD) and locale (en/ne)
- Creates a `calendar.config.json` configuration file
- Optionally installs `@thaparoyal/calendar-core` and framework package

**Options:**

```
-c, --cwd <path>   Working directory (defaults to current directory)
```

**Generated `calendar.config.json`:**

```json
{
  "$schema": "https://thaparoyal-calendar.dev/schema.json",
  "framework": "react",
  "typescript": true,
  "tailwind": true,
  "defaultCalendar": "BS",
  "locale": "en",
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
```

---

### `trc add [components...]`

Add calendar components to your project.

```bash
# Interactive selection (shows a checklist)
npx @thaparoyal/calendar-cli add

# Add specific components
npx @thaparoyal/calendar-cli add calendar
npx @thaparoyal/calendar-cli add date-picker

# Skip confirmation prompts
npx @thaparoyal/calendar-cli add calendar --yes
```

This command:
- Resolves all component dependencies automatically
- Installs npm packages (e.g., `@thaparoyal/calendar-core`, `lucide-react`)
- Copies component files to your configured paths
- Detects your package manager (npm, yarn, pnpm, bun)

**Options:**

```
-c, --cwd <path>   Working directory (defaults to current directory)
-y, --yes          Skip all confirmation prompts
```

---

### `trc list` (alias: `trc ls`)

List all available components in the registry.

```bash
npx @thaparoyal/calendar-cli list
```

**Output:**

```
Available components:

  calendar        (UI)   A calendar component supporting AD and BS date formats.
  date-picker     (UI)   A date picker with input field and calendar dropdown.
  utils           (Lib)  Utility functions for class name merging.
```

---

## Available Components

| Name | Type | Description |
|------|------|-------------|
| `calendar` | UI | Full calendar with navigation and date selection |
| `date-picker` | UI | Date picker with a button trigger and dropdown calendar |
| `utils` | Lib | `cn()` helper for merging Tailwind class names |

### Component Dependencies

- **`calendar`** depends on: `utils`, `@thaparoyal/calendar-core`
- **`date-picker`** depends on: `calendar`, `utils`, `@thaparoyal/calendar-core`, `lucide-react`
- **`utils`** depends on: `clsx`, `tailwind-merge`

---

## Configuration Reference

### `calendar.config.json` Schema

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `framework` | `'react' \| 'vue' \| 'svelte' \| 'vanilla'` | `'react'` | Target framework |
| `typescript` | `boolean` | `true` | Use TypeScript |
| `tailwind` | `boolean` | `true` | Use Tailwind CSS |
| `defaultCalendar` | `'BS' \| 'AD'` | `'BS'` | Default calendar system |
| `locale` | `'en' \| 'ne'` | `'en'` | Default locale |
| `aliases.components` | `string` | `'@/components'` | Components directory alias |
| `aliases.utils` | `string` | `'@/lib/utils'` | Utils file alias |
| `aliases.hooks` | `string` | — | Hooks directory alias (optional) |

### Configuration File Locations

The CLI searches for configuration in (in priority order):

1. `calendar.config.json`
2. `calendar.config.js`
3. `calendar.config.cjs`
4. `.calendarrc`
5. `.calendarrc.json`

---

## Examples

### Next.js + React

```bash
cd my-next-app
npx @thaparoyal/calendar-cli init
# > Framework: React
# > TypeScript: Yes
# > Tailwind: Yes
# > Default calendar: BS
# > Locale: en

npx @thaparoyal/calendar-cli add calendar date-picker
```

Then use in your component:

```tsx
import { Calendar } from '@/components/ui/calendar';
import { DatePicker } from '@/components/ui/date-picker';
import '@thaparoyal/calendar-core/themes/themes.css';

export default function Page() {
  return (
    <div data-theme="default">
      <Calendar config={{ calendarType: 'BS', locale: 'en' }} />
    </div>
  );
}
```

### Vite + Vue

```bash
cd my-vue-app
npx @thaparoyal/calendar-cli init
# > Framework: Vue

npx @thaparoyal/calendar-cli add calendar
```

### SvelteKit

```bash
cd my-svelte-app
npx @thaparoyal/calendar-cli init
# > Framework: Svelte

npx @thaparoyal/calendar-cli add calendar
```

---

## Manual Installation (without CLI)

If you prefer not to use the CLI, install packages directly:

```bash
# Core (always required)
npm install @thaparoyal/calendar-core

# Framework package (pick one)
npm install @thaparoyal/calendar-react   # React
npm install @thaparoyal/calendar-vue     # Vue
npm install @thaparoyal/calendar-svelte  # Svelte
npm install @thaparoyal/calendar-vanilla # Vanilla JS
```

Then import styles and components from the framework package:

```ts
// React
import { Calendar, DatePicker } from '@thaparoyal/calendar-react';
import '@thaparoyal/calendar-react/styles.css';
import '@thaparoyal/calendar-core/themes/themes.css';
```

---

## Package Manager Support

The CLI automatically detects your package manager:

| Lock File | Package Manager |
|-----------|----------------|
| `pnpm-lock.yaml` | pnpm |
| `yarn.lock` | yarn |
| `bun.lockb` | bun |
| *(none)* | npm |

---

## License

MIT
