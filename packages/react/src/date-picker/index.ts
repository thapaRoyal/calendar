import {
  DatePickerRoot,
  DatePickerInput,
  DatePickerTrigger,
  DatePickerContent,
  DatePickerCalendar,
  DatePickerClearButton,
  type DatePickerRootProps,
  type DatePickerInputProps,
  type DatePickerTriggerProps,
  type DatePickerContentProps,
  type DatePickerCalendarProps,
  type DatePickerClearButtonProps,
} from './date-picker';

/**
 * DatePicker compound component
 *
 * A flexible date picker with support for both AD and BS calendars.
 *
 * @example
 * ```tsx
 * import { DatePicker } from '@thaparoyal/calendar-react';
 *
 * function MyDatePicker() {
 *   const [date, setDate] = useState<CalendarDate | null>(null);
 *
 *   return (
 *     <DatePicker.Root
 *       config={{ calendarType: 'BS', locale: 'en' }}
 *       value={date}
 *       onValueChange={setDate}
 *     >
 *       <DatePicker.Input />
 *       <DatePicker.Trigger />
 *       <DatePicker.ClearButton />
 *       <DatePicker.Content>
 *         <DatePicker.Calendar />
 *       </DatePicker.Content>
 *     </DatePicker.Root>
 *   );
 * }
 * ```
 */
export const DatePicker = {
  Root: DatePickerRoot,
  Input: DatePickerInput,
  Trigger: DatePickerTrigger,
  Content: DatePickerContent,
  Calendar: DatePickerCalendar,
  ClearButton: DatePickerClearButton,
};

// Export types
export type {
  DatePickerRootProps,
  DatePickerInputProps,
  DatePickerTriggerProps,
  DatePickerContentProps,
  DatePickerCalendarProps,
  DatePickerClearButtonProps,
};

// Export individual components for tree-shaking
export {
  DatePickerRoot,
  DatePickerInput,
  DatePickerTrigger,
  DatePickerContent,
  DatePickerCalendar,
  DatePickerClearButton,
};
