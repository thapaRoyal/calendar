import * as React from 'react';
import { useCalendarContext } from '../context/calendar-context';
import { useCalendarInternal } from './calendar-root';
import { cn } from '../utils/cn';

/**
 * Calendar header component props
 */
export interface CalendarHeaderProps {
  /** Additional class name */
  className?: string;
  /** Children */
  children?: React.ReactNode;
}

/**
 * Calendar header container
 */
export const CalendarHeader = React.forwardRef<HTMLDivElement, CalendarHeaderProps>(
  ({ className, children }, ref) => {
    return (
      <div ref={ref} className={cn('trc-calendar-header', className)}>
        {children}
      </div>
    );
  }
);

CalendarHeader.displayName = 'Calendar.Header';

/**
 * Calendar title component props
 */
export interface CalendarTitleProps {
  /** Additional class name */
  className?: string;
  /** Custom render function */
  children?: (title: string) => React.ReactNode;
}

/**
 * Calendar title displaying current month and year
 */
export const CalendarTitle = React.forwardRef<HTMLHeadingElement, CalendarTitleProps>(
  ({ className, children }, ref) => {
    const { title } = useCalendarInternal();
    const { actions, viewMode } = useCalendarContext();

    const handleClick = () => {
      if (viewMode === 'day') {
        actions.setViewMode('month');
      } else if (viewMode === 'month') {
        actions.setViewMode('year');
      } else {
        actions.setViewMode('day');
      }
    };

    if (children) {
      return <>{children(title)}</>;
    }

    return (
      <button
        ref={ref as any}
        type="button"
        className={cn('trc-calendar-title', className)}
        onClick={handleClick}
        aria-live="polite"
      >
        {title}
      </button>
    );
  }
);

CalendarTitle.displayName = 'Calendar.Title';

/**
 * Calendar previous button props
 */
export interface CalendarPrevButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Additional class name */
  className?: string;
}

/**
 * Button to navigate to previous month
 */
export const CalendarPrevButton = React.forwardRef<HTMLButtonElement, CalendarPrevButtonProps>(
  ({ className, children, disabled, ...props }, ref) => {
    const { actions, viewMode } = useCalendarContext();
    const { isPrevMonthDisabled } = useCalendarInternal();

    const handleClick = () => {
      if (viewMode === 'day') {
        actions.prevMonth();
      } else if (viewMode === 'month' || viewMode === 'year') {
        actions.prevYear();
      }
    };

    return (
      <button
        ref={ref}
        type="button"
        className={cn('trc-calendar-nav-button', 'trc-calendar-prev', className)}
        onClick={handleClick}
        disabled={disabled ?? isPrevMonthDisabled}
        aria-label="Previous month"
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
            <path d="m15 18-6-6 6-6" />
          </svg>
        )}
      </button>
    );
  }
);

CalendarPrevButton.displayName = 'Calendar.PrevButton';

/**
 * Calendar next button props
 */
export interface CalendarNextButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Additional class name */
  className?: string;
}

/**
 * Button to navigate to next month
 */
export const CalendarNextButton = React.forwardRef<HTMLButtonElement, CalendarNextButtonProps>(
  ({ className, children, disabled, ...props }, ref) => {
    const { actions, viewMode } = useCalendarContext();
    const { isNextMonthDisabled } = useCalendarInternal();

    const handleClick = () => {
      if (viewMode === 'day') {
        actions.nextMonth();
      } else if (viewMode === 'month' || viewMode === 'year') {
        actions.nextYear();
      }
    };

    return (
      <button
        ref={ref}
        type="button"
        className={cn('trc-calendar-nav-button', 'trc-calendar-next', className)}
        onClick={handleClick}
        disabled={disabled ?? isNextMonthDisabled}
        aria-label="Next month"
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
            <path d="m9 18 6-6-6-6" />
          </svg>
        )}
      </button>
    );
  }
);

CalendarNextButton.displayName = 'Calendar.NextButton';
