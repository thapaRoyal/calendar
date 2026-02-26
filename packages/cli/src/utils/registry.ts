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
  useCalendar,
  type CalendarDate,
  type CalendarConfig,
  getWeeksInMonth,
  formatMonthYear,
  getWeekdayShortNames,
} from "@thaparoyal/calendar-core";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  const mergedConfig = { calendarType: "BS" as const, locale: "en" as const, weekStartsOn: 0 as const, ...config };

  // State management
  const [internalValue, setInternalValue] = React.useState<CalendarDate | null>(defaultValue ?? null);
  const [focusedDate, setFocusedDate] = React.useState<CalendarDate>(() => {
    const initial = value ?? defaultValue;
    if (initial) return initial;
    // Default to today
    const today = new Date();
    if (mergedConfig.calendarType === "BS") {
      const { adToBs } = require("@thaparoyal/calendar-core");
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
    if (!value) {
      setInternalValue(date);
    }
    onValueChange?.(date);
  };

  const weeks = React.useMemo(
    () => getWeeksInMonth(
      focusedDate.year,
      focusedDate.month,
      mergedConfig.calendarType,
      mergedConfig,
      selectedDate,
      disabledDates
    ),
    [focusedDate, mergedConfig, selectedDate, disabledDates]
  );

  const title = formatMonthYear(
    focusedDate.year,
    focusedDate.month,
    mergedConfig.calendarType,
    mergedConfig.locale
  );

  const weekdayNames = getWeekdayShortNames(mergedConfig.locale);

  const prevMonth = () => {
    let month = focusedDate.month - 1;
    let year = focusedDate.year;
    if (month < 1) {
      month = 12;
      year--;
    }
    setFocusedDate({ ...focusedDate, year, month, day: 1 });
  };

  const nextMonth = () => {
    let month = focusedDate.month + 1;
    let year = focusedDate.year;
    if (month > 12) {
      month = 1;
      year++;
    }
    setFocusedDate({ ...focusedDate, year, month, day: 1 });
  };

  return (
    <div className={cn("p-3", className)}>
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7"
          onClick={prevMonth}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="font-medium text-sm">{title}</div>
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7"
          onClick={nextMonth}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr>
            {weekdayNames.map((day, i) => (
              <th
                key={i}
                className="text-muted-foreground font-medium text-xs pb-2 w-9 text-center"
              >
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, weekIndex) => (
            <tr key={weekIndex}>
              {week.map((day, dayIndex) => (
                <td key={dayIndex} className="p-0 text-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "h-9 w-9 p-0 font-normal",
                      day.isToday && "border border-primary",
                      day.isSelected && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                      day.isOutsideMonth && "text-muted-foreground opacity-50",
                      day.isDisabled && "opacity-30 pointer-events-none"
                    )}
                    disabled={day.isDisabled}
                    onClick={() => handleSelect(day.date)}
                  >
                    {day.date.day}
                  </Button>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
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
    dependencies: ['@thaparoyal/calendar-core'],
    devDependencies: [],
    registryDependencies: ['calendar', 'popover', 'button', 'input'],
    files: [
      {
        path: 'ui/date-picker.tsx',
        type: 'registry:ui',
        content: `"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import type { CalendarDate, CalendarConfig } from "@thaparoyal/calendar-core";
import { formatDate, parseDate } from "@thaparoyal/calendar-core";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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

  const handleSelect = (date: CalendarDate) => {
    onValueChange?.(date);
    setOpen(false);
  };

  const displayValue = value
    ? formatDate(value, "YYYY-MM-DD", config.locale ?? "en")
    : null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !value && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {displayValue ?? <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          config={config}
          value={value}
          onValueChange={handleSelect}
        />
      </PopoverContent>
    </Popover>
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
