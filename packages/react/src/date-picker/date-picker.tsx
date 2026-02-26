import * as React from 'react';
import { useDatePicker, type UseDatePickerOptions } from '../hooks/use-date-picker';
import { Calendar } from '../calendar';
import { cn } from '../utils/cn';
import type { CalendarDate } from '@thaparoyal/calendar-core';

/**
 * Date picker context
 */
interface DatePickerContextValue {
  state: ReturnType<typeof useDatePicker>['state'];
  actions: ReturnType<typeof useDatePicker>['actions'];
  weeks: ReturnType<typeof useDatePicker>['weeks'];
  title: string;
  weekdayNames: readonly string[];
  inputProps: ReturnType<typeof useDatePicker>['inputProps'];
  triggerProps: ReturnType<typeof useDatePicker>['triggerProps'];
  formattedValue: string;
  isPrevMonthDisabled: boolean;
  isNextMonthDisabled: boolean;
}

const DatePickerContext = React.createContext<DatePickerContextValue | null>(null);

function useDatePickerContext() {
  const context = React.useContext(DatePickerContext);
  if (!context) {
    throw new Error('DatePicker components must be used within DatePicker.Root');
  }
  return context;
}

/**
 * Date picker root props
 */
export interface DatePickerRootProps extends UseDatePickerOptions {
  /** Additional class name */
  className?: string;
  /** Children */
  children?: React.ReactNode;
}

/**
 * Date picker root component
 */
export const DatePickerRoot = React.forwardRef<HTMLDivElement, DatePickerRootProps>(
  ({ className, children, ...options }, ref) => {
    const picker = useDatePicker(options);

    const contextValue = React.useMemo(
      () => ({
        state: picker.state,
        actions: picker.actions,
        weeks: picker.weeks,
        title: picker.title,
        weekdayNames: picker.weekdayNames,
        inputProps: picker.inputProps,
        triggerProps: picker.triggerProps,
        formattedValue: picker.formattedValue,
        isPrevMonthDisabled: picker.isPrevMonthDisabled,
        isNextMonthDisabled: picker.isNextMonthDisabled,
      }),
      [picker]
    );

    // Close on outside click
    const containerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(event.target as Node) &&
          picker.state.isOpen
        ) {
          picker.actions.close();
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [picker.state.isOpen, picker.actions]);

    // Close on escape
    React.useEffect(() => {
      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === 'Escape' && picker.state.isOpen) {
          picker.actions.close();
        }
      };

      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }, [picker.state.isOpen, picker.actions]);

    return (
      <DatePickerContext.Provider value={contextValue}>
        <div
          ref={(node) => {
            containerRef.current = node;
            if (typeof ref === 'function') {
              ref(node);
            } else if (ref) {
              ref.current = node;
            }
          }}
          className={cn('trc-date-picker', className)}
        >
          {children}
        </div>
      </DatePickerContext.Provider>
    );
  }
);

DatePickerRoot.displayName = 'DatePicker.Root';

/**
 * Date picker input props
 */
export interface DatePickerInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  /** Additional class name */
  className?: string;
}

/**
 * Date picker input component
 */
export const DatePickerInput = React.forwardRef<HTMLInputElement, DatePickerInputProps>(
  ({ className, placeholder = 'YYYY-MM-DD', ...props }, ref) => {
    const { inputProps } = useDatePickerContext();

    return (
      <input
        ref={ref}
        type="text"
        className={cn('trc-date-picker-input', className)}
        placeholder={placeholder}
        {...inputProps}
        {...props}
      />
    );
  }
);

DatePickerInput.displayName = 'DatePicker.Input';

/**
 * Date picker trigger props
 */
export interface DatePickerTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Additional class name */
  className?: string;
}

/**
 * Date picker trigger button
 */
export const DatePickerTrigger = React.forwardRef<HTMLButtonElement, DatePickerTriggerProps>(
  ({ className, children, ...props }, ref) => {
    const { triggerProps } = useDatePickerContext();

    return (
      <button
        ref={ref}
        type="button"
        className={cn('trc-date-picker-trigger', className)}
        {...triggerProps}
        {...props}
      >
        {children ?? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
            <line x1="16" x2="16" y1="2" y2="6" />
            <line x1="8" x2="8" y1="2" y2="6" />
            <line x1="3" x2="21" y1="10" y2="10" />
          </svg>
        )}
      </button>
    );
  }
);

DatePickerTrigger.displayName = 'DatePicker.Trigger';

/**
 * Date picker content props
 */
export interface DatePickerContentProps {
  /** Additional class name */
  className?: string;
  /** Children */
  children?: React.ReactNode;
  /** Position of the dropdown */
  position?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';
}

/**
 * Date picker dropdown content
 */
export const DatePickerContent = React.forwardRef<HTMLDivElement, DatePickerContentProps>(
  ({ className, children, position = 'bottom-start' }, ref) => {
    const { state } = useDatePickerContext();

    if (!state.isOpen) {
      return null;
    }

    return (
      <div
        ref={ref}
        className={cn('trc-date-picker-content', `trc-date-picker-content-${position}`, className)}
        role="dialog"
        aria-modal="true"
        aria-label="Choose date"
      >
        {children}
      </div>
    );
  }
);

DatePickerContent.displayName = 'DatePicker.Content';

/**
 * Date picker calendar props
 */
export interface DatePickerCalendarProps {
  /** Additional class name */
  className?: string;
}

/**
 * Date picker calendar component (embedded calendar)
 */
export const DatePickerCalendar = React.forwardRef<HTMLDivElement, DatePickerCalendarProps>(
  ({ className }, ref) => {
    const { state, actions, weeks, title, weekdayNames, isPrevMonthDisabled, isNextMonthDisabled } =
      useDatePickerContext();

    return (
      <div ref={ref} className={cn('trc-date-picker-calendar', className)}>
        <div className="trc-calendar-header">
          <button
            type="button"
            className="trc-calendar-nav-button trc-calendar-prev"
            onClick={actions.prevMonth}
            disabled={isPrevMonthDisabled}
            aria-label="Previous month"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <span className="trc-calendar-title">{title}</span>
          <button
            type="button"
            className="trc-calendar-nav-button trc-calendar-next"
            onClick={actions.nextMonth}
            disabled={isNextMonthDisabled}
            aria-label="Next month"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>

        <table className="trc-calendar-grid" role="grid">
          <thead className="trc-calendar-grid-head">
            <tr>
              {weekdayNames.map((day, index) => (
                <th key={index} className="trc-calendar-weekday">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="trc-calendar-grid-body">
            {weeks.map((week, weekIndex) => (
              <tr key={weekIndex} className="trc-calendar-week">
                {week.map((day, dayIndex) => (
                  <td
                    key={dayIndex}
                    className={cn(
                      'trc-calendar-cell',
                      day.isToday && 'trc-calendar-cell-today',
                      day.isSelected && 'trc-calendar-cell-selected',
                      day.isDisabled && 'trc-calendar-cell-disabled',
                      day.isOutsideMonth && 'trc-calendar-cell-outside'
                    )}
                  >
                    <button
                      type="button"
                      className="trc-calendar-day"
                      onClick={() => !day.isDisabled && actions.selectDate(day.date)}
                      disabled={day.isDisabled}
                      tabIndex={day.isDisabled ? -1 : 0}
                    >
                      {day.date.day}
                    </button>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        <div className="trc-date-picker-footer">
          <button
            type="button"
            className="trc-date-picker-today-button"
            onClick={actions.goToToday}
          >
            Today
          </button>
          {state.selectedDate && (
            <button
              type="button"
              className="trc-date-picker-clear-button"
              onClick={actions.clear}
            >
              Clear
            </button>
          )}
        </div>
      </div>
    );
  }
);

DatePickerCalendar.displayName = 'DatePicker.Calendar';

/**
 * Date picker clear button props
 */
export interface DatePickerClearButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Additional class name */
  className?: string;
}

/**
 * Date picker clear button
 */
export const DatePickerClearButton = React.forwardRef<HTMLButtonElement, DatePickerClearButtonProps>(
  ({ className, children, ...props }, ref) => {
    const { state, actions } = useDatePickerContext();

    if (!state.selectedDate) {
      return null;
    }

    return (
      <button
        ref={ref}
        type="button"
        className={cn('trc-date-picker-clear', className)}
        onClick={actions.clear}
        aria-label="Clear date"
        {...props}
      >
        {children ?? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" x2="6" y1="6" y2="18" />
            <line x1="6" x2="18" y1="6" y2="18" />
          </svg>
        )}
      </button>
    );
  }
);

DatePickerClearButton.displayName = 'DatePicker.ClearButton';
