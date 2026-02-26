import * as React from 'react';
import type {
  CalendarClassNames,
  CalendarComponents,
  CalendarCustomizationContextValue,
} from '../types';
import { defaultClassNames, defaultComponents } from '../types';

/**
 * Customization context for class names and custom components
 */
export const CalendarCustomizationContext =
  React.createContext<CalendarCustomizationContextValue>({
    classNames: defaultClassNames,
    components: defaultComponents,
  });

/**
 * Hook to access customization context
 */
export function useCalendarCustomization(): CalendarCustomizationContextValue {
  return React.useContext(CalendarCustomizationContext);
}

/**
 * Props for customization provider
 */
export interface CalendarCustomizationProviderProps {
  children: React.ReactNode;
  classNames?: CalendarClassNames;
  components?: CalendarComponents;
}

/**
 * Provider for calendar customization
 */
export function CalendarCustomizationProvider({
  children,
  classNames = defaultClassNames,
  components = defaultComponents,
}: CalendarCustomizationProviderProps) {
  const value = React.useMemo<CalendarCustomizationContextValue>(
    () => ({
      classNames,
      components,
    }),
    [classNames, components]
  );

  return (
    <CalendarCustomizationContext.Provider value={value}>
      {children}
    </CalendarCustomizationContext.Provider>
  );
}
