import * as React from 'react';
import { useRangeCalendarContext } from './range-calendar-context';
import { cn } from '../utils/cn';

/**
 * Range calendar header props
 */
export interface RangeCalendarHeaderProps {
  className?: string;
  children?: React.ReactNode;
}

/**
 * Range calendar header container
 */
export const RangeCalendarHeader = React.forwardRef<HTMLDivElement, RangeCalendarHeaderProps>(
  ({ className, children }, ref) => {
    return (
      <div ref={ref} className={cn('trc-calendar-header', className)}>
        {children}
      </div>
    );
  }
);

RangeCalendarHeader.displayName = 'RangeCalendar.Header';

/**
 * Range calendar title props
 */
export interface RangeCalendarTitleProps {
  className?: string;
  children?: (title: string) => React.ReactNode;
}

/**
 * Range calendar title
 */
export const RangeCalendarTitle = React.forwardRef<HTMLSpanElement, RangeCalendarTitleProps>(
  ({ className, children }, ref) => {
    const { title } = useRangeCalendarContext();

    if (children) {
      return <>{children(title)}</>;
    }

    return (
      <span ref={ref} className={cn('trc-calendar-title', className)} aria-live="polite">
        {title}
      </span>
    );
  }
);

RangeCalendarTitle.displayName = 'RangeCalendar.Title';

/**
 * Range calendar prev button props
 */
export interface RangeCalendarPrevButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

/**
 * Button to navigate to previous month
 */
export const RangeCalendarPrevButton = React.forwardRef<
  HTMLButtonElement,
  RangeCalendarPrevButtonProps
>(({ className, children, disabled, ...props }, ref) => {
  const { prevMonth, isPrevDisabled } = useRangeCalendarContext();

  return (
    <button
      ref={ref}
      type="button"
      className={cn('trc-calendar-nav-button', 'trc-calendar-prev', className)}
      onClick={prevMonth}
      disabled={disabled ?? isPrevDisabled}
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
});

RangeCalendarPrevButton.displayName = 'RangeCalendar.PrevButton';

/**
 * Range calendar next button props
 */
export interface RangeCalendarNextButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

/**
 * Button to navigate to next month
 */
export const RangeCalendarNextButton = React.forwardRef<
  HTMLButtonElement,
  RangeCalendarNextButtonProps
>(({ className, children, disabled, ...props }, ref) => {
  const { nextMonth, isNextDisabled } = useRangeCalendarContext();

  return (
    <button
      ref={ref}
      type="button"
      className={cn('trc-calendar-nav-button', 'trc-calendar-next', className)}
      onClick={nextMonth}
      disabled={disabled ?? isNextDisabled}
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
});

RangeCalendarNextButton.displayName = 'RangeCalendar.NextButton';
