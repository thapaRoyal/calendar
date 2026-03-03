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
import { formatDate, parseDate } from "@thaparoyal/calendar-core";
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

/** Live date input masking: auto-inserts dashes and normalises Nepali numerals. */
function formatDateInput(raw: string): string {
  const NEPALI = ["०","१","२","३","४","५","६","७","८","९"];
  let ascii = "";
  for (const ch of raw) {
    const ni = NEPALI.indexOf(ch);
    ascii += ni >= 0 ? String(ni) : ch;
  }
  const digits = ascii.replace(/\D/g, "").slice(0, 8);
  let result = "";
  for (let i = 0; i < digits.length; i++) {
    result += digits[i];
    if (i === 3 || i === 5) result += "-";
  }
  return result;
}

export function DatePicker({
  config = { calendarType: "BS", locale: "en" },
  value,
  onValueChange,
  placeholder = "YYYY-MM-DD",
  disabled = false,
  className,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState(
    value ? formatDate(value, "YYYY-MM-DD", config.locale ?? "en") : ""
  );
  const ref = React.useRef<HTMLDivElement>(null);
  const calendarType = config.calendarType ?? "BS";
  const locale = config.locale ?? "en";

  // Sync inputValue when controlled value changes
  React.useEffect(() => {
    setInputValue(value ? formatDate(value, "YYYY-MM-DD", locale) : "");
  }, [value, locale]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(formatDateInput(e.target.value));
  };

  const handleInputBlur = () => {
    const parsed = parseDate(inputValue, calendarType);
    if (parsed) {
      onValueChange?.(parsed);
      setInputValue(formatDate(parsed, "YYYY-MM-DD", locale));
    } else if (value) {
      setInputValue(formatDate(value, "YYYY-MM-DD", locale));
    } else {
      setInputValue("");
    }
  };

  const handleSelect = (date: CalendarDate) => {
    onValueChange?.(date);
    setInputValue(formatDate(date, "YYYY-MM-DD", locale));
    setOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onValueChange?.(null);
    setInputValue("");
  };

  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className={cn("relative inline-block", className)}>
      <div
        className={cn(
          "flex h-10 w-[280px] items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm",
          "ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <button
          type="button"
          tabIndex={-1}
          onClick={() => !disabled && setOpen((o) => !o)}
          className="shrink-0 text-muted-foreground hover:text-foreground"
          aria-label="Open calendar"
        >
          <CalendarIcon className="h-4 w-4" />
        </button>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onFocus={() => !disabled && setOpen(true)}
          placeholder={placeholder}
          disabled={disabled}
          className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
          aria-label="Date input"
          autoComplete="off"
        />
        {(value || inputValue) && (
          <button
            type="button"
            tabIndex={-1}
            onClick={handleClear}
            className="shrink-0 text-muted-foreground opacity-50 hover:opacity-100"
            aria-label="Clear date"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

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
  'range-calendar': {
    name: 'range-calendar',
    type: 'registry:ui',
    title: 'Range Calendar',
    description: 'A calendar component for selecting a date range (start → end).',
    dependencies: ['@thaparoyal/calendar-core'],
    devDependencies: [],
    registryDependencies: ['utils'],
    files: [
      {
        path: 'ui/range-calendar.tsx',
        type: 'registry:ui',
        content: `"use client";

import * as React from "react";
import {
  type CalendarDate,
  type CalendarConfig,
  type DateRangeValue,
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
  compareDates,
  isSameDate,
  adToBs,
} from "@thaparoyal/calendar-core";
import { cn } from "@/lib/utils";

type ViewMode = "day" | "month" | "year";

export interface RangeCalendarProps {
  config?: Partial<CalendarConfig>;
  value?: DateRangeValue | null;
  defaultValue?: DateRangeValue | null;
  onValueChange?: (value: DateRangeValue | null) => void;
  disabledDates?: CalendarDate[];
  className?: string;
}

function isInRange(
  date: CalendarDate,
  start: CalendarDate | null,
  end: CalendarDate | null
): boolean {
  if (!start || !end) return false;
  return compareDates(date, start) > 0 && compareDates(date, end) < 0;
}

export function RangeCalendar({
  config = { calendarType: "BS", locale: "en" },
  value,
  defaultValue,
  onValueChange,
  disabledDates,
  className,
}: RangeCalendarProps) {
  const mergedConfig = {
    calendarType: "BS" as const,
    locale: "en" as const,
    weekStartsOn: 0 as const,
    ...config,
  };

  const [internal, setInternal] = React.useState<DateRangeValue | null>(
    defaultValue ?? null
  );
  const [hoverDate, setHoverDate] = React.useState<CalendarDate | null>(null);
  const [viewMode, setViewMode] = React.useState<ViewMode>("day");
  const [focusedDate, setFocusedDate] = React.useState<CalendarDate>(() => {
    const initial = value?.start ?? defaultValue?.start;
    if (initial) return initial;
    const today = new Date();
    if (mergedConfig.calendarType === "BS") return adToBs(today);
    return { year: today.getFullYear(), month: today.getMonth() + 1, day: today.getDate(), calendarType: "AD" as const };
  });

  const range = value !== undefined ? value : internal;
  const start = range?.start ?? null;
  const end = range?.end ?? null;

  const handleSelect = (date: CalendarDate) => {
    let next: DateRangeValue | null;
    if (!start || (start && end)) {
      // Start fresh
      next = { start: date, end: null };
    } else {
      // We have a start but no end
      if (compareDates(date, start) < 0) {
        // Clicked before start — make it the new start
        next = { start: date, end: null };
      } else if (isSameDate(date, start)) {
        next = null; // deselect
      } else {
        next = { start, end: date };
      }
    }
    if (value === undefined) setInternal(next);
    onValueChange?.(next);
  };

  // ── Title ────────────────────────────────────────────────────────────────
  const titleText = React.useMemo(() => {
    if (viewMode === "day") return formatMonthYear(focusedDate.year, focusedDate.month, mergedConfig.calendarType, mergedConfig.locale);
    if (viewMode === "month") return formatYear(focusedDate.year, mergedConfig.locale);
    const decade = getDecadeRange(focusedDate.year);
    return \`\${formatYear(decade.start, mergedConfig.locale)} – \${formatYear(decade.end, mergedConfig.locale)}\`;
  }, [viewMode, focusedDate, mergedConfig]);

  const cycleView = () => setViewMode((v) => v === "day" ? "month" : v === "month" ? "year" : "day");

  const handlePrev = () => {
    if (viewMode === "day") {
      let month = focusedDate.month - 1, year = focusedDate.year;
      if (month < 1) { month = 12; year--; }
      setFocusedDate({ ...focusedDate, year, month, day: 1 });
    } else if (viewMode === "month") {
      setFocusedDate({ ...focusedDate, year: focusedDate.year - 1, day: 1 });
    } else {
      setFocusedDate({ ...focusedDate, year: getPrevDecade(focusedDate.year), day: 1 });
    }
  };

  const handleNext = () => {
    if (viewMode === "day") {
      let month = focusedDate.month + 1, year = focusedDate.year;
      if (month > 12) { month = 1; year++; }
      setFocusedDate({ ...focusedDate, year, month, day: 1 });
    } else if (viewMode === "month") {
      setFocusedDate({ ...focusedDate, year: focusedDate.year + 1, day: 1 });
    } else {
      setFocusedDate({ ...focusedDate, year: getNextDecade(focusedDate.year), day: 1 });
    }
  };

  const weeks = React.useMemo(
    () => getWeeksInMonth(focusedDate.year, focusedDate.month, mergedConfig.calendarType, mergedConfig, null, disabledDates),
    [focusedDate, mergedConfig, disabledDates]
  );
  const weekdayNames = getWeekdayShortNames(mergedConfig.locale);

  const months: MonthPickerItem[] = React.useMemo(
    () => getMonthGrid(focusedDate.year, mergedConfig.calendarType, mergedConfig.locale, focusedDate.month),
    [focusedDate.year, focusedDate.month, mergedConfig]
  );
  const years: YearPickerItem[] = React.useMemo(
    () => getYearGrid(focusedDate.year, mergedConfig.calendarType, 12),
    [focusedDate.year, mergedConfig.calendarType]
  );

  const previewEnd = end ?? hoverDate;

  return (
    <div
      className={cn("trc-calendar p-3 select-none inline-block", className)}
      onMouseLeave={() => setHoverDate(null)}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <button type="button" onClick={handlePrev}
          className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-input bg-background text-base hover:bg-accent hover:text-accent-foreground"
          aria-label="Previous">‹</button>
        <button type="button" onClick={cycleView}
          className="flex-1 mx-2 text-sm font-medium text-center hover:bg-accent hover:text-accent-foreground rounded-md px-2 py-1 transition-colors"
          aria-live="polite">{titleText}</button>
        <button type="button" onClick={handleNext}
          className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-input bg-background text-base hover:bg-accent hover:text-accent-foreground"
          aria-label="Next">›</button>
      </div>

      {/* Day grid */}
      {viewMode === "day" && (
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {weekdayNames.map((d, i) => (
                <th key={i} className="text-muted-foreground font-medium text-xs pb-2 w-9 text-center">{d}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {weeks.map((week, wi) => (
              <tr key={wi}>
                {week.map((day, di) => {
                  const isStart = start ? isSameDate(day.date, start) : false;
                  const isEnd = end ? isSameDate(day.date, end) : previewEnd ? isSameDate(day.date, previewEnd) : false;
                  const inRange = isInRange(day.date, start, previewEnd);
                  return (
                    <td key={di} className="p-0 text-center">
                      <button
                        type="button"
                        className={cn(
                          "h-9 w-9 p-0 font-normal text-sm rounded-md inline-flex items-center justify-center",
                          "hover:bg-accent hover:text-accent-foreground",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                          day.isToday && !isStart && !isEnd && "border border-primary font-semibold",
                          isStart && "bg-primary text-primary-foreground rounded-r-none",
                          isEnd && "bg-primary text-primary-foreground rounded-l-none",
                          isStart && isEnd && "rounded-md",
                          inRange && "bg-accent text-accent-foreground rounded-none",
                          day.isOutsideMonth && "text-muted-foreground opacity-50",
                          day.isDisabled && "opacity-30 pointer-events-none cursor-not-allowed"
                        )}
                        disabled={day.isDisabled}
                        onClick={() => handleSelect(day.date)}
                        onMouseEnter={() => start && !end && setHoverDate(day.date)}
                        aria-selected={isStart || isEnd}
                        aria-disabled={day.isDisabled}
                      >
                        {day.date.day}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Month picker */}
      {viewMode === "month" && (
        <div className="grid grid-cols-3 gap-2 mt-1">
          {months.map((m) => (
            <button key={m.month} type="button"
              onClick={() => { if (!m.disabled) { setFocusedDate({ ...focusedDate, month: m.month, day: 1 }); setViewMode("day"); } }}
              disabled={m.disabled}
              className={cn("rounded-md py-2 text-sm font-normal hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                m.isCurrentMonth && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                m.disabled && "opacity-30 pointer-events-none cursor-not-allowed")}
            >{m.shortName}</button>
          ))}
        </div>
      )}

      {/* Year picker */}
      {viewMode === "year" && (
        <div className="grid grid-cols-3 gap-2 mt-1">
          {years.map((y) => (
            <button key={y.year} type="button"
              onClick={() => { if (!y.disabled) { setFocusedDate({ ...focusedDate, year: y.year, day: 1 }); setViewMode("month"); } }}
              disabled={y.disabled}
              className={cn("rounded-md py-2 text-sm font-normal hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                y.isCurrentYear && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                y.disabled && "opacity-30 pointer-events-none cursor-not-allowed")}
            >{y.year}</button>
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
  'date-range-picker': {
    name: 'date-range-picker',
    type: 'registry:ui',
    title: 'Date Range Picker',
    description: 'A date range picker with trigger button and calendar dropdown.',
    dependencies: ['@thaparoyal/calendar-core', 'lucide-react'],
    devDependencies: [],
    registryDependencies: ['range-calendar', 'utils'],
    files: [
      {
        path: 'ui/date-range-picker.tsx',
        type: 'registry:ui',
        content: `"use client";

import * as React from "react";
import { CalendarIcon, X } from "lucide-react";
import type { CalendarConfig, DateRangeValue } from "@thaparoyal/calendar-core";
import { formatDate } from "@thaparoyal/calendar-core";
import { cn } from "@/lib/utils";
import { RangeCalendar } from "@/components/ui/range-calendar";

export interface DateRangePickerProps {
  config?: Partial<CalendarConfig>;
  value?: DateRangeValue | null;
  onValueChange?: (value: DateRangeValue | null) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function DateRangePicker({
  config = { calendarType: "BS", locale: "en" },
  value,
  onValueChange,
  placeholder = "Pick a date range",
  disabled = false,
  className,
}: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  const handleSelect = (range: DateRangeValue | null) => {
    onValueChange?.(range);
    // Close when both dates are selected
    if (range?.start && range?.end) setOpen(false);
  };

  const locale = config.locale ?? "en";
  const fmt = (d: typeof value extends null | undefined ? never : NonNullable<typeof value>["start"]) =>
    d ? formatDate(d, "YYYY-MM-DD", locale) : "";

  const displayValue =
    value?.start && value?.end
      ? \`\${fmt(value.start)} → \${fmt(value.end)}\`
      : value?.start
      ? \`\${fmt(value.start)} → ...\`
      : null;

  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
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
          "flex h-10 w-[320px] items-center justify-start gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm",
          "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          !value?.start && "text-muted-foreground"
        )}
        aria-haspopup="true"
        aria-expanded={open}
      >
        <CalendarIcon className="h-4 w-4 shrink-0" />
        <span className="flex-1 text-left truncate">{displayValue ?? placeholder}</span>
        {value?.start && (
          <X
            className="h-4 w-4 shrink-0 opacity-50 hover:opacity-100 cursor-pointer"
            onClick={(e) => { e.stopPropagation(); onValueChange?.(null); }}
            aria-label="Clear range"
          />
        )}
      </button>

      {open && (
        <div className="absolute z-50 mt-1 rounded-md border bg-background shadow-lg">
          <RangeCalendar config={config} value={value} onValueChange={handleSelect} />
        </div>
      )}
    </div>
  );
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
