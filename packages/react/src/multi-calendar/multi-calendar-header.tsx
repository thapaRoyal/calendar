import * as React from 'react';
import { useMultiCalendarContext } from './multi-calendar-context';
import { cn } from '../utils/cn';

/**
 * Multi-calendar header props
 */
export interface MultiCalendarHeaderProps {
  className?: string;
  children?: React.ReactNode;
}

/**
 * Multi-calendar header container
 */
export const MultiCalendarHeader = React.forwardRef<HTMLDivElement, MultiCalendarHeaderProps>(
  ({ className, children }, ref) => {
    return (
      <div ref={ref} className={cn('trc-calendar-header', 'trc-multi-calendar-header', className)}>
        {children}
      </div>
    );
  }
);

MultiCalendarHeader.displayName = 'MultiCalendar.Header';

/**
 * Multi-calendar title props
 */
export interface MultiCalendarTitleProps {
  className?: string;
  /** Separator between month titles */
  separator?: React.ReactNode;
  children?: (titles: string[]) => React.ReactNode;
}

/**
 * Multi-calendar title showing all month titles
 */
export const MultiCalendarTitle = React.forwardRef<HTMLDivElement, MultiCalendarTitleProps>(
  ({ className, separator = ' — ', children }, ref) => {
    const { months } = useMultiCalendarContext();
    const titles = months.map((m) => m.title);

    if (children) {
      return <>{children(titles)}</>;
    }

    return (
      <div ref={ref} className={cn('trc-calendar-title', 'trc-multi-calendar-title', className)} aria-live="polite">
        {titles.map((title, index) => (
          <React.Fragment key={index}>
            {index > 0 && <span className="trc-multi-calendar-title-separator">{separator}</span>}
            <span className="trc-multi-calendar-title-month">{title}</span>
          </React.Fragment>
        ))}
      </div>
    );
  }
);

MultiCalendarTitle.displayName = 'MultiCalendar.Title';

/**
 * Multi-calendar prev button props
 */
export interface MultiCalendarPrevButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

/**
 * Button to navigate to previous month(s)
 */
export const MultiCalendarPrevButton = React.forwardRef<
  HTMLButtonElement,
  MultiCalendarPrevButtonProps
>(({ className, children, disabled, ...props }, ref) => {
  const { prevMonth, isPrevDisabled } = useMultiCalendarContext();

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

MultiCalendarPrevButton.displayName = 'MultiCalendar.PrevButton';

/**
 * Multi-calendar next button props
 */
export interface MultiCalendarNextButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

/**
 * Button to navigate to next month(s)
 */
export const MultiCalendarNextButton = React.forwardRef<
  HTMLButtonElement,
  MultiCalendarNextButtonProps
>(({ className, children, disabled, ...props }, ref) => {
  const { nextMonth, isNextDisabled } = useMultiCalendarContext();

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

MultiCalendarNextButton.displayName = 'MultiCalendar.NextButton';
