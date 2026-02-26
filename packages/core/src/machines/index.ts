/**
 * State Machines
 *
 * Framework-agnostic state management for calendar components.
 */

// Calendar machine
export {
  calendarReducer,
  createInitialState,
  createCalendarActions,
  defaultCalendarConfig,
  type CalendarActions,
} from './calendar.machine';

// Date picker machine
export {
  datePickerReducer,
  createInitialDatePickerState,
  createDatePickerActions,
  type DatePickerActions,
} from './date-picker.machine';

// Date range machine
export {
  dateRangeReducer,
  createInitialDateRangeState,
  createDateRangeActions,
  isDateInSelectedRange,
  isRangeStart,
  isRangeEnd,
  type DateRangeActions,
} from './date-range.machine';
