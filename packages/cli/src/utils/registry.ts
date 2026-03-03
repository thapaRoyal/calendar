import { z } from 'zod';

/**
 * Registry item schema
 */
export const registryItemSchema = z.object({
  name: z.string(),
  type: z.enum(['registry:ui', 'registry:hook', 'registry:lib', 'registry:style']),
  title: z.string(),
  description: z.string(),
  dependencies: z.array(z.string()).default([]),
  devDependencies: z.array(z.string()).default([]),
  registryDependencies: z.array(z.string()).default([]),
  files: z.array(
    z.object({
      path: z.string(),
      content: z.string(),
      type: z.enum(['registry:ui', 'registry:hook', 'registry:lib', 'registry:style']),
    })
  ),
});

export type RegistryItem = z.infer<typeof registryItemSchema>;

/**
 * Available components in the registry
 */
export const REGISTRY: Record<string, RegistryItem> = {
  calendar: {
    name: 'calendar',
    type: 'registry:ui',
    title: 'Calendar',
    description: 'A calendar component supporting AD and BS (Bikram Sambat) date formats.',
    dependencies: ['@thaparoyal/calendar-core'],
    devDependencies: [],
    registryDependencies: ['utils'],
    files: [
      {
        path: 'ui/calendar.tsx',
        type: 'registry:ui',
        content: `"use client";

import * as React from "react";
import {
  type CalendarDate,
  type CalendarConfig,
  type MonthPickerItem,
  type YearPickerItem,
  getWeeksInMonth,
  formatMonthYear,
  formatYear,
  getWeekdayShortNames,
  getMonthGrid,
  getYearGrid,
  getDecadeRange,
  getNextDecade,
  getPrevDecade,
  adToBs,
} from "@thaparoyal/calendar-core";
import { cn } from "@/lib/utils";

type ViewMode = "day" | "month" | "year";

export interface CalendarProps {
  config?: Partial<CalendarConfig>;
  value?: CalendarDate | null;
  defaultValue?: CalendarDate;
  onValueChange?: (date: CalendarDate) => void;
  disabledDates?: CalendarDate[];
  className?: string;
}

export function Calendar({
  config = { calendarType: "BS", locale: "en" },
  value,
  defaultValue,
  onValueChange,
  disabledDates,
  className,
}: CalendarProps) {
  const mergedConfig = {
    calendarType: "BS" as const,
    locale: "en" as const,
    weekStartsOn: 0 as const,
    ...config,
  };

  const [internalValue, setInternalValue] = React.useState<CalendarDate | null>(
    defaultValue ?? null
  );
  const [viewMode, setViewMode] = React.useState<ViewMode>("day");
  const [focusedDate, setFocusedDate] = React.useState<CalendarDate>(() => {
    const initial = value ?? defaultValue;
    if (initial) return initial;
    const today = new Date();
    if (mergedConfig.calendarType === "BS") {
      return adToBs(today);
    }
    return {
      year: today.getFullYear(),
      month: today.getMonth() + 1,
      day: today.getDate(),
      calendarType: "AD" as const,
    };
  });

  const selectedDate = value ?? internalValue;

  const handleSelect = (date: CalendarDate) => {
    if (!value) setInternalValue(date);
    onValueChange?.(date);
  };

  // ── Title text depends on view mode ──────────────────────────────────────
  const titleText = React.useMemo(() => {
    if (viewMode === "day") {
      return formatMonthYear(focusedDate.year, focusedDate.month, mergedConfig.calendarType, mergedConfig.locale);
    }
    if (viewMode === "month") {
      return formatYear(focusedDate.year, mergedConfig.locale);
    }
    const decade = getDecadeRange(focusedDate.year);
    return \`\${formatYear(decade.start, mergedConfig.locale)} – \${formatYear(decade.end, mergedConfig.locale)}\`;
  }, [viewMode, focusedDate, mergedConfig]);

  const cycleView = () => {
    setViewMode((v) => (v === "day" ? "month" : v === "month" ? "year" : "day"));
  };

  // ── Navigation (arrows) ──────────────────────────────────────────────────
  const handlePrev = () => {
    if (viewMode === "day") {
      let month = focusedDate.month - 1;
      let year = focusedDate.year;
      if (month < 1) { month = 12; year--; }
      setFocusedDate({ ...focusedDate, year, month, day: 1 });
    } else if (viewMode === "month") {
      setFocusedDate({ ...focusedDate, year: focusedDate.year - 1, day: 1 });
    } else {
      const prevYear = getPrevDecade(focusedDate.year);
      setFocusedDate({ ...focusedDate, year: prevYear, day: 1 });
    }
  };

  const handleNext = () => {
    if (viewMode === "day") {
      let month = focusedDate.month + 1;
      let year = focusedDate.year;
      if (month > 12) { month = 1; year++; }
      setFocusedDate({ ...focusedDate, year, month, day: 1 });
    } else if (viewMode === "month") {
      setFocusedDate({ ...focusedDate, year: focusedDate.year + 1, day: 1 });
    } else {
      const nextYear = getNextDecade(focusedDate.year);
      setFocusedDate({ ...focusedDate, year: nextYear, day: 1 });
    }
  };

  // ── Day grid ─────────────────────────────────────────────────────────────
  const weeks = React.useMemo(
    () => getWeeksInMonth(focusedDate.year, focusedDate.month, mergedConfig.calendarType, mergedConfig, selectedDate, disabledDates),
    [focusedDate, mergedConfig, selectedDate, disabledDates]
  );
  const weekdayNames = getWeekdayShortNames(mergedConfig.locale);

  // ── Month picker ─────────────────────────────────────────────────────────
  const months: MonthPickerItem[] = React.useMemo(
    () => getMonthGrid(focusedDate.year, mergedConfig.calendarType, mergedConfig.locale, focusedDate.month),
    [focusedDate.year, focusedDate.month, mergedConfig]
  );

  const handleMonthSelect = (m: MonthPickerItem) => {
    if (m.disabled) return;
    setFocusedDate({ ...focusedDate, month: m.month, day: 1 });
    setViewMode("day");
  };

  // ── Year picker ──────────────────────────────────────────────────────────
  const years: YearPickerItem[] = React.useMemo(
    () => getYearGrid(focusedDate.year, mergedConfig.calendarType, 12),
    [focusedDate.year, mergedConfig.calendarType]
  );

  const handleYearSelect = (y: YearPickerItem) => {
    if (y.disabled) return;
    setFocusedDate({ ...focusedDate, year: y.year, day: 1 });
    setViewMode("month");
  };

  return (
    <div className={cn("trc-calendar p-3 select-none inline-block", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={handlePrev}
          className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-input bg-background text-base hover:bg-accent hover:text-accent-foreground"
          aria-label="Previous"
        >
          ‹
        </button>

        <button
          type="button"
          onClick={cycleView}
          className="flex-1 mx-2 text-sm font-medium text-center hover:bg-accent hover:text-accent-foreground rounded-md px-2 py-1 transition-colors"
          aria-live="polite"
        >
          {titleText}
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-input bg-background text-base hover:bg-accent hover:text-accent-foreground"
          aria-label="Next"
        >
          ›
        </button>
      </div>

      {/* Day grid */}
      {viewMode === "day" && (
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {weekdayNames.map((day, i) => (
                <th key={i} className="text-muted-foreground font-medium text-xs pb-2 w-9 text-center">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {weeks.map((week, wi) => (
              <tr key={wi}>
                {week.map((day, di) => (
                  <td key={di} className="p-0 text-center">
                    <button
                      type="button"
                      className={cn(
                        "h-9 w-9 p-0 font-normal text-sm rounded-md inline-flex items-center justify-center",
                        "hover:bg-accent hover:text-accent-foreground",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        day.isToday && "border border-primary font-semibold",
                        day.isSelected && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                        day.isOutsideMonth && "text-muted-foreground opacity-50",
                        day.isDisabled && "opacity-30 pointer-events-none cursor-not-allowed"
                      )}
                      disabled={day.isDisabled}
                      onClick={() => handleSelect(day.date)}
                      aria-selected={day.isSelected}
                      aria-disabled={day.isDisabled}
                    >
                      {day.date.day}
                    </button>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Month picker */}
      {viewMode === "month" && (
        <div className="grid grid-cols-3 gap-2 mt-1">
          {months.map((m) => (
            <button
              key={m.month}
              type="button"
              onClick={() => handleMonthSelect(m)}
              disabled={m.disabled}
              className={cn(
                "rounded-md py-2 text-sm font-normal",
                "hover:bg-accent hover:text-accent-foreground",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                m.isCurrentMonth && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                m.disabled && "opacity-30 pointer-events-none cursor-not-allowed"
              )}
              aria-selected={m.isCurrentMonth}
            >
              {m.shortName}
            </button>
          ))}
        </div>
      )}

      {/* Year picker */}
      {viewMode === "year" && (
        <div className="grid grid-cols-3 gap-2 mt-1">
          {years.map((y) => (
            <button
              key={y.year}
              type="button"
              onClick={() => handleYearSelect(y)}
              disabled={y.disabled}
              className={cn(
                "rounded-md py-2 text-sm font-normal",
                "hover:bg-accent hover:text-accent-foreground",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                y.isCurrentYear && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                y.disabled && "opacity-30 pointer-events-none cursor-not-allowed"
              )}
              aria-selected={y.isCurrentYear}
            >
              {y.year}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
`,
      },
    ],
  },
  'date-picker': {
    name: 'date-picker',
    type: 'registry:ui',
    title: 'Date Picker',
    description: 'A date picker with input field and calendar dropdown.',
    dependencies: ['@thaparoyal/calendar-core', 'lucide-react'],
    devDependencies: [],
    registryDependencies: ['calendar', 'utils'],
    files: [
      {
        path: 'ui/date-picker.tsx',
        type: 'registry:ui',
        content: `"use client";

import * as React from "react";
import { CalendarIcon, X } from "lucide-react";
import type { CalendarDate, CalendarConfig } from "@thaparoyal/calendar-core";
import { formatDate } from "@thaparoyal/calendar-core";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";

export interface DatePickerProps {
  config?: Partial<CalendarConfig>;
  value?: CalendarDate | null;
  onValueChange?: (date: CalendarDate | null) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function DatePicker({
  config = { calendarType: "BS", locale: "en" },
  value,
  onValueChange,
  placeholder = "Pick a date",
  disabled = false,
  className,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  const handleSelect = (date: CalendarDate) => {
    onValueChange?.(date);
    setOpen(false);
  };

  const displayValue = value
    ? formatDate(value, "YYYY-MM-DD", config.locale ?? "en")
    : null;

  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className={cn("relative inline-block", className)}>
      <button
        type="button"
        onClick={() => !disabled && setOpen((o) => !o)}
        disabled={disabled}
        className={cn(
          "flex h-10 w-[280px] items-center justify-start gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm",
          "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          !value && "text-muted-foreground"
        )}
        aria-haspopup="true"
        aria-expanded={open}
      >
        <CalendarIcon className="h-4 w-4 shrink-0" />
        <span className="flex-1 text-left truncate">
          {displayValue ?? placeholder}
        </span>
        {value && (
          <X
            className="h-4 w-4 shrink-0 opacity-50 hover:opacity-100 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              onValueChange?.(null);
            }}
            aria-label="Clear date"
          />
        )}
      </button>

      {open && (
        <div className="absolute z-50 mt-1 rounded-md border bg-background shadow-lg">
          <Calendar
            config={config}
            value={value}
            onValueChange={handleSelect}
          />
        </div>
      )}
    </div>
  );
}
`,
      },
    ],
  },
  utils: {
    name: 'utils',
    type: 'registry:lib',
    title: 'Utils',
    description: 'Utility functions for class name merging.',
    dependencies: ['clsx', 'tailwind-merge'],
    devDependencies: [],
    registryDependencies: [],
    files: [
      {
        path: 'lib/utils.ts',
        type: 'registry:lib',
        content: `import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
`,
      },
    ],
  },
};

/**
 * Get a component from the registry
 */
export function getRegistryItem(name: string): RegistryItem | undefined {
  return REGISTRY[name];
}

/**
 * Get all component names
 */
export function getRegistryNames(): string[] {
  return Object.keys(REGISTRY);
}

/**
 * Resolve all dependencies for a component
 */
export function resolveDependencies(name: string, resolved: Set<string> = new Set()): string[] {
  if (resolved.has(name)) {
    return [];
  }

  const item = getRegistryItem(name);
  if (!item) {
    return [];
  }

  resolved.add(name);
  const deps: string[] = [name];

  for (const dep of item.registryDependencies) {
    deps.push(...resolveDependencies(dep, resolved));
  }

  return deps;
}
