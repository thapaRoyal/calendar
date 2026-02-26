import * as React from 'react';
import { useCalendar, type UseCalendarOptions } from '../hooks/use-calendar';
import { CalendarProvider } from '../context/calendar-context';
import { cn } from '../utils/cn';

/**
 * Calendar root component props
 */
export interface CalendarRootProps extends UseCalendarOptions {
  /** Additional class name */
  className?: string;
  /** Children */
  children?: React.ReactNode;
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
  ({ className, children, config, defaultValue, value, onValueChange, disabledDates }, ref) => {
    const {
      state,
      actions,
      weeks,
      title,
      weekdayNames,
      isPrevMonthDisabled,
      isNextMonthDisabled,
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

    const internalValue = React.useMemo(
      () => ({
        weeks,
        title,
        weekdayNames,
        isPrevMonthDisabled,
        isNextMonthDisabled,
      }),
      [weeks, title, weekdayNames, isPrevMonthDisabled, isNextMonthDisabled]
    );

    return (
      <CalendarProvider state={state} dispatch={dispatch}>
        <CalendarInternalContext.Provider value={internalValue}>
          <div
            ref={ref}
            className={cn('trc-calendar', className)}
            role="application"
            aria-label="Calendar"
          >
            {children}
          </div>
        </CalendarInternalContext.Provider>
      </CalendarProvider>
    );
  }
);

CalendarRoot.displayName = 'Calendar.Root';
