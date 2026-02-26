import type { WeekDay } from '@thaparoyal/calendar-core';
import type * as React from 'react';

/**
 * Custom class names for calendar components (shadcn-style)
 *
 * Allows overriding the default class names for each calendar element.
 *
 * @example
 * ```tsx
 * <Calendar.Root
 *   classNames={{
 *     root: 'my-calendar',
 *     header: 'flex justify-between items-center',
 *     title: 'text-lg font-semibold',
 *     navButton: 'p-2 hover:bg-gray-100 rounded',
 *     grid: 'w-full border-collapse',
 *     weekday: 'text-gray-500 text-sm',
 *     day: 'p-2 text-center cursor-pointer',
 *     daySelected: 'bg-blue-500 text-white rounded-full',
 *     dayToday: 'ring-2 ring-blue-500',
 *     dayDisabled: 'text-gray-300 cursor-not-allowed',
 *     dayOutside: 'text-gray-400',
 *     dayRangeStart: 'rounded-l-full',
 *     dayRangeEnd: 'rounded-r-full',
 *     dayRangeMiddle: 'bg-blue-100',
 *   }}
 * >
 *   ...
 * </Calendar.Root>
 * ```
 */
export interface CalendarClassNames {
  /** Root container */
  root?: string;
  /** Header container */
  header?: string;
  /** Title element */
  title?: string;
  /** Navigation button container */
  nav?: string;
  /** Navigation button */
  navButton?: string;
  /** Previous button */
  navButtonPrev?: string;
  /** Next button */
  navButtonNext?: string;
  /** Grid (table) */
  grid?: string;
  /** Grid header */
  gridHead?: string;
  /** Weekday cell */
  weekday?: string;
  /** Grid body */
  gridBody?: string;
  /** Week row */
  week?: string;
  /** Day cell container */
  cell?: string;
  /** Day button */
  day?: string;
  /** Selected day */
  daySelected?: string;
  /** Today */
  dayToday?: string;
  /** Outside current month */
  dayOutside?: string;
  /** Disabled day */
  dayDisabled?: string;
  /** Range start */
  dayRangeStart?: string;
  /** Range end */
  dayRangeEnd?: string;
  /** Range middle */
  dayRangeMiddle?: string;
  /** Range hover preview */
  dayRangeHover?: string;
  /** Multi-selected day */
  dayMultiSelected?: string;
  /** Month picker grid */
  monthPicker?: string;
  /** Month cell */
  monthCell?: string;
  /** Selected month */
  monthSelected?: string;
  /** Current month */
  monthCurrent?: string;
  /** Disabled month */
  monthDisabled?: string;
  /** Year picker grid */
  yearPicker?: string;
  /** Year cell */
  yearCell?: string;
  /** Selected year */
  yearSelected?: string;
  /** Current year */
  yearCurrent?: string;
  /** Disabled year */
  yearDisabled?: string;
  /** Dropdown select */
  dropdown?: string;
  /** Multi-calendar container */
  multiCalendar?: string;
  /** Individual month in multi-calendar */
  multiMonth?: string;
  /** Month title in multi-calendar */
  multiMonthTitle?: string;
}

/**
 * Props for custom Day component
 */
export interface DayComponentProps {
  /** Day data */
  day: WeekDay;
  /** Click handler */
  onClick: () => void;
  /** Mouse enter handler (for range hover) */
  onMouseEnter?: () => void;
  /** Mouse leave handler */
  onMouseLeave?: () => void;
  /** Formatted day number */
  formattedDay: string;
  /** Is disabled */
  disabled: boolean;
}

/**
 * Props for custom DayContent component
 */
export interface DayContentProps {
  /** Day data */
  day: WeekDay;
  /** Formatted day number */
  formattedDay: string;
}

/**
 * Props for custom navigation icon components
 */
export interface NavIconProps {
  /** Icon direction */
  direction: 'left' | 'right';
}

/**
 * Custom components for calendar rendering (shadcn-style)
 *
 * Allows complete customization of how calendar elements are rendered.
 *
 * @example
 * ```tsx
 * <Calendar.Root
 *   components={{
 *     IconLeft: () => <ChevronLeftIcon className="h-4 w-4" />,
 *     IconRight: () => <ChevronRightIcon className="h-4 w-4" />,
 *     Day: ({ day, onClick, formattedDay }) => (
 *       <button onClick={onClick} className="custom-day">
 *         {formattedDay}
 *       </button>
 *     ),
 *   }}
 * >
 *   ...
 * </Calendar.Root>
 * ```
 */
export interface CalendarComponents {
  /** Custom left navigation icon */
  IconLeft?: React.ComponentType<NavIconProps>;
  /** Custom right navigation icon */
  IconRight?: React.ComponentType<NavIconProps>;
  /** Custom day component */
  Day?: React.ComponentType<DayComponentProps>;
  /** Custom day content component (inside day button) */
  DayContent?: React.ComponentType<DayContentProps>;
}

/**
 * Context value for class names and custom components
 */
export interface CalendarCustomizationContextValue {
  /** Custom class names */
  classNames: CalendarClassNames;
  /** Custom components */
  components: CalendarComponents;
}

/**
 * Default class names (empty - uses default trc-* classes)
 */
export const defaultClassNames: CalendarClassNames = {};

/**
 * Default components (empty - uses built-in components)
 */
export const defaultComponents: CalendarComponents = {};
