import * as React from 'react';
import { useCalendar, type UseCalendarOptions } from '../hooks/use-calendar';
import { CalendarProvider } from '../context/calendar-context';
import { CalendarCustomizationProvider } from '../context/customization-context';
import { cn } from '../utils/cn';
import type { Locale, NepaliHoliday } from '@thaparoyal/calendar-core';
import type { CalendarClassNames, CalendarComponents } from '../types';
import { CalendarMonthPicker } from './calendar-month-picker';
import { CalendarYearPicker } from './calendar-year-picker';

/**
 * Calendar root component props
 */
export interface CalendarRootProps extends UseCalendarOptions {
  /** Additional class name */
  className?: string;
  /** Children */
  children?: React.ReactNode;
  /**
   * Custom class names for calendar elements (shadcn-style)
   * @example
   * ```tsx
   * <Calendar.Root
   *   classNames={{
   *     root: 'my-calendar',
   *     daySelected: 'bg-blue-500 text-white',
   *     dayToday: 'ring-2 ring-blue-500',
   *   }}
   * />
   * ```
   */
  classNames?: CalendarClassNames;
  /**
   * Custom components for rendering (shadcn-style)
   * @example
   * ```tsx
   * <Calendar.Root
   *   components={{
   *     IconLeft: () => <ChevronLeft />,
   *     IconRight: () => <ChevronRight />,
   *   }}
   * />
   * ```
   */
  components?: CalendarComponents;
  /**
   * Holidays to display as dot markers on the calendar.
   * Accepts a static array or a function that receives the BS year and returns holidays.
   *
   * @example
   * ```tsx
   * // Static list
   * import { getHolidaysForYear } from '@thaparoyal/calendar-core';
   * <Calendar.Root holidays={getHolidaysForYear(2082)} />
   *
   * // Dynamic (per-year)
   * <Calendar.Root holidays={(year) => getHolidaysForYear(year)} />
   * ```
   */
  holidays?: NepaliHoliday[] | ((bsYear: number) => NepaliHoliday[]);
}

/**
 * Internal context for calendar components
 */
interface CalendarInternalContextValue {
  weeks: ReturnType<typeof useCalendar>['weeks'];
  title: string;
  weekdayNames: readonly string[];
  isPrevMonthDisabled: boolean;
  isNextMonthDisabled: boolean;
  locale: Locale;
  formatDayNumber: (day: number) => string;
  holidays: NepaliHoliday[];
}

export const CalendarInternalContext = React.createContext<CalendarInternalContextValue | null>(
  null
);

export function useCalendarInternal() {
  const context = React.useContext(CalendarInternalContext);
  if (!context) {
    throw new Error('Calendar components must be used within Calendar.Root');
  }
  return context;
}

/**
 * Calendar root component
 *
 * Provides calendar context and state management for child components.
 *
 * @example
 * ```tsx
 * <Calendar.Root calendarType="BS" value={date} onValueChange={setDate}>
 *   <Calendar.Header>
 *     <Calendar.PrevButton />
 *     <Calendar.Title />
 *     <Calendar.NextButton />
 *   </Calendar.Header>
 *   <Calendar.Grid>
 *     <Calendar.GridHead />
 *     <Calendar.GridBody />
 *   </Calendar.Grid>
 * </Calendar.Root>
 * ```
 */
export const CalendarRoot = React.forwardRef<HTMLDivElement, CalendarRootProps>(
  ({ className, children, config, defaultValue, value, onValueChange, disabledDates, classNames, components, holidays }, ref) => {
    const {
      state,
      actions,
      weeks,
      title,
      weekdayNames,
      isPrevMonthDisabled,
      isNextMonthDisabled,
      locale,
      formatDayNumber,
    } = useCalendar({
      config,
      defaultValue,
      value,
      onValueChange,
      disabledDates,
    });

    const dispatch = React.useCallback(
      (event: any) => {
        switch (event.type) {
          case 'SELECT_DATE':
            actions.selectDate(event.date);
            break;
          case 'FOCUS_DATE':
            actions.focusDate(event.date);
            break;
          case 'NEXT_MONTH':
            actions.nextMonth();
            break;
          case 'PREV_MONTH':
            actions.prevMonth();
            break;
          case 'NEXT_YEAR':
            actions.nextYear();
            break;
          case 'PREV_YEAR':
            actions.prevYear();
            break;
          case 'SET_VIEW_MODE':
            actions.setViewMode(event.mode);
            break;
          case 'TODAY':
            actions.goToToday();
            break;
        }
      },
      [actions]
    );

    // Resolve holidays for the currently focused year
    const resolvedHolidays = React.useMemo<NepaliHoliday[]>(() => {
      if (!holidays) return [];
      if (typeof holidays === 'function') return holidays(state.focusedDate.year);
      return holidays;
    }, [holidays, state.focusedDate.year]);

    const internalValue = React.useMemo(
      () => ({
        weeks,
        title,
        weekdayNames,
        isPrevMonthDisabled,
        isNextMonthDisabled,
        locale,
        formatDayNumber,
        holidays: resolvedHolidays,
      }),
      [weeks, title, weekdayNames, isPrevMonthDisabled, isNextMonthDisabled, locale, formatDayNumber, resolvedHolidays]
    );

    return (
      <CalendarProvider state={state} dispatch={dispatch}>
        <CalendarCustomizationProvider classNames={classNames} components={components}>
          <CalendarInternalContext.Provider value={internalValue}>
            <div
              ref={ref}
              className={cn('trc-calendar', classNames?.root, className)}
              role="application"
              aria-label="Calendar"
              data-locale={locale}
              data-calendar-type={state.config.calendarType}
            >
              {children}
              {/* Auto-render month and year pickers so clicking the title works without extra setup */}
              <CalendarMonthPicker />
              <CalendarYearPicker />
            </div>
          </CalendarInternalContext.Provider>
        </CalendarCustomizationProvider>
      </CalendarProvider>
    );
  }
);

CalendarRoot.displayName = 'Calendar.Root';
