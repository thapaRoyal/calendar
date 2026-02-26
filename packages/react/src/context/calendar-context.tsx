import * as React from 'react';
import type {
  CalendarState,
  CalendarDate,
  CalendarType,
  Locale,
} from '@thaparoyal/calendar-core';
import { createCalendarActions, CalendarActions } from '@thaparoyal/calendar-core';

/**
 * Calendar context value
 */
export interface CalendarContextValue {
  state: CalendarState;
  actions: CalendarActions;
  // Computed values
  calendarType: CalendarType;
  locale: Locale;
  focusedDate: CalendarDate;
  selectedDate: CalendarDate | null;
  viewMode: 'day' | 'month' | 'year';
}

/**
 * Calendar context
 */
export const CalendarContext = React.createContext<CalendarContextValue | null>(null);

/**
 * Hook to use calendar context
 */
export function useCalendarContext(): CalendarContextValue {
  const context = React.useContext(CalendarContext);
  if (!context) {
    throw new Error('useCalendarContext must be used within a CalendarProvider');
  }
  return context;
}

/**
 * Calendar provider props
 */
export interface CalendarProviderProps {
  children: React.ReactNode;
  state: CalendarState;
  dispatch: (event: any) => void;
}

/**
 * Calendar provider component
 */
export function CalendarProvider({ children, state, dispatch }: CalendarProviderProps) {
  const actions = React.useMemo(() => createCalendarActions(dispatch), [dispatch]);

  const value = React.useMemo<CalendarContextValue>(
    () => ({
      state,
      actions,
      calendarType: state.config.calendarType,
      locale: state.config.locale,
      focusedDate: state.focusedDate,
      selectedDate: state.selectedDate,
      viewMode: state.viewMode,
    }),
    [state, actions]
  );

  return <CalendarContext.Provider value={value}>{children}</CalendarContext.Provider>;
}
