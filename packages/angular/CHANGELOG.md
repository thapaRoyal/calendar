# @thaparoyal/calendar-angular

## 1.0.0

### Major Changes

- Initial release of Angular services for AD and BS (Bikram Sambat) calendars.

  Includes 4 injectable services built on RxJS `BehaviorSubject`:

  - `CalendarService` — single-date calendar with month/year/decade navigation
  - `SelectionService` — unified single / range / multiple date selection
  - `DatePickerService` — calendar + typed text input with live masking + popup toggle
  - `MultiCalendarService` — side-by-side multi-month display with selection

  All services expose reactive `Observable` getters for use with the `async` pipe and provide
  synchronous action methods. Peer dependencies: `@angular/core >= 14`, `rxjs >= 7`.
