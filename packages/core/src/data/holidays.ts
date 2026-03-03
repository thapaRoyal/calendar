/**
 * Nepali Public Holidays Data
 *
 * Contains major Nepal government public holidays in BS (Bikram Sambat) calendar.
 * Holidays are organised into two groups:
 *   - FIXED_HOLIDAYS: same BS date every year (e.g. New Year = Baisakh 1)
 *   - VARIABLE_HOLIDAYS: date changes each year (festivals like Dashain, Tihar)
 *
 * Variable holiday dates are provided for 2079–2086 BS (2022–2029 AD).
 * Sources: Nepal Government Gazette / Office of the Prime Minister.
 */

export interface NepaliHoliday {
  /** Month (1–12) in BS */
  month: number;
  /** Day (1–32) in BS */
  day: number;
  /** Holiday name in English */
  nameEn: string;
  /** Holiday name in Nepali */
  nameNp: string;
  /** Type of holiday */
  type: 'public' | 'festival' | 'national';
}

// ---------------------------------------------------------------------------
// Fixed holidays — same BS date every year
// ---------------------------------------------------------------------------

export const FIXED_HOLIDAYS: NepaliHoliday[] = [
  // ── Baisakh (1) ──────────────────────────────────────────────────────────
  { month: 1, day: 1, nameEn: 'Nepal New Year (Nava Varsha)', nameNp: 'नेपाल नयाँ वर्ष (नव वर्ष)', type: 'national' },

  // ── Falgun (11) ──────────────────────────────────────────────────────────
  { month: 11, day: 7, nameEn: 'Democracy Day (Prajatantra Diwas)', nameNp: 'प्रजातन्त्र दिवस', type: 'national' },

  // ── Magh (10) ────────────────────────────────────────────────────────────
  { month: 10, day: 1, nameEn: 'Maghe Sankranti', nameNp: 'माघे सङ्क्रान्ति', type: 'festival' },

  // ── Poush (9) ────────────────────────────────────────────────────────────
  { month: 9, day: 11, nameEn: 'Udhauli / Winter Solstice', nameNp: 'उधौली', type: 'festival' },

  // ── Chaitra (12) ─────────────────────────────────────────────────────────
  { month: 12, day: 15, nameEn: 'Ghode Jatra', nameNp: 'घोडे जात्रा', type: 'festival' },
  { month: 12, day: 21, nameEn: 'Shree Ram Navami', nameNp: 'श्री राम नवमी', type: 'festival' },

  // ── Bhadra (5) ───────────────────────────────────────────────────────────
  { month: 5, day: 29, nameEn: 'Constitution Day', nameNp: 'संविधान दिवस', type: 'national' },

  // ── Mangsir (8) ──────────────────────────────────────────────────────────
  { month: 8, day: 6, nameEn: 'Udhauli Parwa', nameNp: 'उधौली पर्व', type: 'festival' },
];

// ---------------------------------------------------------------------------
// Variable holidays — date differs each BS year
// Format: [bsYear]: NepaliHoliday[]
// ---------------------------------------------------------------------------

export const VARIABLE_HOLIDAYS: Record<number, NepaliHoliday[]> = {
  2079: [
    // Dashain (Bijaya Dashami)
    { month: 6, day: 25, nameEn: 'Ghatasthapana (Dashain begins)', nameNp: 'घटस्थापना', type: 'festival' },
    { month: 7, day: 5,  nameEn: 'Bijaya Dashami (Dashain)', nameNp: 'विजया दशमी (दशैं)', type: 'festival' },
    // Tihar
    { month: 7, day: 18, nameEn: 'Tihar / Deepawali (Laxmi Puja)', nameNp: 'तिहार / दीपावली', type: 'festival' },
    { month: 7, day: 19, nameEn: 'Govardhan Puja', nameNp: 'गोवर्धन पूजा', type: 'festival' },
    { month: 7, day: 20, nameEn: 'Bhai Tika', nameNp: 'भाइ टीका', type: 'festival' },
    // Chhath
    { month: 7, day: 29, nameEn: 'Chhath Parwa', nameNp: 'छठ पर्व', type: 'festival' },
    // Holi
    { month: 11, day: 24, nameEn: 'Holi (Fagu Purnima)', nameNp: 'होली (फागु पूर्णिमा)', type: 'festival' },
    // Shivaratri
    { month: 11, day: 2,  nameEn: 'Maha Shivaratri', nameNp: 'महा शिवरात्री', type: 'festival' },
    // Indra Jatra
    { month: 5, day: 27,  nameEn: 'Indra Jatra', nameNp: 'इन्द्र जात्रा', type: 'festival' },
    // Teej
    { month: 5, day: 17,  nameEn: 'Haritalika Teej', nameNp: 'हरितालिका तीज', type: 'festival' },
    // Janai Purnima / Raksha Bandhan
    { month: 4, day: 31,  nameEn: 'Janai Purnima / Raksha Bandhan', nameNp: 'जनाई पूर्णिमा / राक्षाबन्धन', type: 'festival' },
    // Krishna Janmashtami
    { month: 5, day: 1,   nameEn: 'Krishna Janmashtami', nameNp: 'कृष्ण जन्माष्टमी', type: 'festival' },
    // Buddha Jayanti
    { month: 1, day: 28,  nameEn: 'Buddha Jayanti', nameNp: 'बुद्ध जयन्ती', type: 'festival' },
    // Labour Day
    { month: 1, day: 18,  nameEn: 'Labour Day', nameNp: 'मजदुर दिवस', type: 'national' },
  ],
  2080: [
    { month: 6, day: 14, nameEn: 'Ghatasthapana (Dashain begins)', nameNp: 'घटस्थापना', type: 'festival' },
    { month: 6, day: 23, nameEn: 'Phulpati', nameNp: 'फूलपाती', type: 'festival' },
    { month: 6, day: 24, nameEn: 'Maha Ashtami', nameNp: 'महा अष्टमी', type: 'festival' },
    { month: 6, day: 25, nameEn: 'Bijaya Dashami (Dashain)', nameNp: 'विजया दशमी (दशैं)', type: 'festival' },
    { month: 7, day: 7,  nameEn: 'Tihar / Deepawali (Laxmi Puja)', nameNp: 'तिहार / दीपावली', type: 'festival' },
    { month: 7, day: 8,  nameEn: 'Govardhan Puja', nameNp: 'गोवर्धन पूजा', type: 'festival' },
    { month: 7, day: 9,  nameEn: 'Bhai Tika', nameNp: 'भाइ टीका', type: 'festival' },
    { month: 7, day: 18, nameEn: 'Chhath Parwa', nameNp: 'छठ पर्व', type: 'festival' },
    { month: 11, day: 14, nameEn: 'Maha Shivaratri', nameNp: 'महा शिवरात्री', type: 'festival' },
    { month: 11, day: 29, nameEn: 'Holi (Fagu Purnima)', nameNp: 'होली (फागु पूर्णिमा)', type: 'festival' },
    { month: 5, day: 6,  nameEn: 'Haritalika Teej', nameNp: 'हरितालिका तीज', type: 'festival' },
    { month: 4, day: 20, nameEn: 'Janai Purnima / Raksha Bandhan', nameNp: 'जनाई पूर्णिमा / राक्षाबन्धन', type: 'festival' },
    { month: 4, day: 21, nameEn: 'Krishna Janmashtami', nameNp: 'कृष्ण जन्माष्टमी', type: 'festival' },
    { month: 2, day: 12, nameEn: 'Buddha Jayanti', nameNp: 'बुद्ध जयन्ती', type: 'festival' },
    { month: 1, day: 18, nameEn: 'Labour Day', nameNp: 'मजदुर दिवस', type: 'national' },
    { month: 5, day: 16, nameEn: 'Indra Jatra', nameNp: 'इन्द्र जात्रा', type: 'festival' },
  ],
  2081: [
    { month: 6, day: 3,  nameEn: 'Ghatasthapana (Dashain begins)', nameNp: 'घटस्थापना', type: 'festival' },
    { month: 6, day: 12, nameEn: 'Phulpati', nameNp: 'फूलपाती', type: 'festival' },
    { month: 6, day: 13, nameEn: 'Maha Ashtami', nameNp: 'महा अष्टमी', type: 'festival' },
    { month: 6, day: 14, nameEn: 'Bijaya Dashami (Dashain)', nameNp: 'विजया दशमी (दशैं)', type: 'festival' },
    { month: 6, day: 27, nameEn: 'Tihar / Deepawali (Laxmi Puja)', nameNp: 'तिहार / दीपावली', type: 'festival' },
    { month: 6, day: 28, nameEn: 'Govardhan Puja', nameNp: 'गोवर्धन पूजा', type: 'festival' },
    { month: 6, day: 29, nameEn: 'Bhai Tika', nameNp: 'भाइ टीका', type: 'festival' },
    { month: 7, day: 8,  nameEn: 'Chhath Parwa', nameNp: 'छठ पर्व', type: 'festival' },
    { month: 11, day: 3,  nameEn: 'Maha Shivaratri', nameNp: 'महा शिवरात्री', type: 'festival' },
    { month: 11, day: 18, nameEn: 'Holi (Fagu Purnima)', nameNp: 'होली (फागु पूर्णिमा)', type: 'festival' },
    { month: 4, day: 25, nameEn: 'Haritalika Teej', nameNp: 'हरितालिका तीज', type: 'festival' },
    { month: 4, day: 9,  nameEn: 'Janai Purnima / Raksha Bandhan', nameNp: 'जनाई पूर्णिमा / राक्षाबन्धन', type: 'festival' },
    { month: 4, day: 10, nameEn: 'Krishna Janmashtami', nameNp: 'कृष्ण जन्माष्टमी', type: 'festival' },
    { month: 1, day: 30, nameEn: 'Buddha Jayanti', nameNp: 'बुद्ध जयन्ती', type: 'festival' },
    { month: 1, day: 18, nameEn: 'Labour Day', nameNp: 'मजदुर दिवस', type: 'national' },
    { month: 5, day: 5,  nameEn: 'Indra Jatra', nameNp: 'इन्द्र जात्रा', type: 'festival' },
  ],
  2082: [
    { month: 5, day: 21, nameEn: 'Ghatasthapana (Dashain begins)', nameNp: 'घटस्थापना', type: 'festival' },
    { month: 5, day: 30, nameEn: 'Phulpati', nameNp: 'फूलपाती', type: 'festival' },
    { month: 5, day: 31, nameEn: 'Maha Ashtami', nameNp: 'महा अष्टमी', type: 'festival' },
    { month: 6, day: 1,  nameEn: 'Bijaya Dashami (Dashain)', nameNp: 'विजया दशमी (दशैं)', type: 'festival' },
    { month: 6, day: 14, nameEn: 'Tihar / Deepawali (Laxmi Puja)', nameNp: 'तिहार / दीपावली', type: 'festival' },
    { month: 6, day: 15, nameEn: 'Govardhan Puja', nameNp: 'गोवर्धन पूजा', type: 'festival' },
    { month: 6, day: 16, nameEn: 'Bhai Tika', nameNp: 'भाइ टीका', type: 'festival' },
    { month: 6, day: 26, nameEn: 'Chhath Parwa', nameNp: 'छठ पर्व', type: 'festival' },
    { month: 10, day: 21, nameEn: 'Maha Shivaratri', nameNp: 'महा शिवरात्री', type: 'festival' },
    { month: 11, day: 7,  nameEn: 'Holi (Fagu Purnima)', nameNp: 'होली (फागु पूर्णिमा)', type: 'festival' },
    { month: 4, day: 14, nameEn: 'Haritalika Teej', nameNp: 'हरितालिका तीज', type: 'festival' },
    { month: 3, day: 29, nameEn: 'Janai Purnima / Raksha Bandhan', nameNp: 'जनाई पूर्णिमा / राक्षाबन्धन', type: 'festival' },
    { month: 3, day: 30, nameEn: 'Krishna Janmashtami', nameNp: 'कृष्ण जन्माष्टमी', type: 'festival' },
    { month: 2, day: 8,  nameEn: 'Buddha Jayanti', nameNp: 'बुद्ध जयन्ती', type: 'festival' },
    { month: 1, day: 18, nameEn: 'Labour Day', nameNp: 'मजदुर दिवस', type: 'national' },
    { month: 5, day: 24, nameEn: 'Indra Jatra', nameNp: 'इन्द्र जात्रा', type: 'festival' },
  ],
  2083: [
    { month: 5, day: 10, nameEn: 'Ghatasthapana (Dashain begins)', nameNp: 'घटस्थापना', type: 'festival' },
    { month: 5, day: 19, nameEn: 'Phulpati', nameNp: 'फूलपाती', type: 'festival' },
    { month: 5, day: 20, nameEn: 'Maha Ashtami', nameNp: 'महा अष्टमी', type: 'festival' },
    { month: 5, day: 21, nameEn: 'Bijaya Dashami (Dashain)', nameNp: 'विजया दशमी (दशैं)', type: 'festival' },
    { month: 6, day: 3,  nameEn: 'Tihar / Deepawali (Laxmi Puja)', nameNp: 'तिहार / दीपावली', type: 'festival' },
    { month: 6, day: 4,  nameEn: 'Govardhan Puja', nameNp: 'गोवर्धन पूजा', type: 'festival' },
    { month: 6, day: 5,  nameEn: 'Bhai Tika', nameNp: 'भाइ टीका', type: 'festival' },
    { month: 6, day: 15, nameEn: 'Chhath Parwa', nameNp: 'छठ पर्व', type: 'festival' },
    { month: 11, day: 9,  nameEn: 'Maha Shivaratri', nameNp: 'महा शिवरात्री', type: 'festival' },
    { month: 11, day: 26, nameEn: 'Holi (Fagu Purnima)', nameNp: 'होली (फागु पूर्णिमा)', type: 'festival' },
    { month: 4, day: 3,  nameEn: 'Haritalika Teej', nameNp: 'हरितालिका तीज', type: 'festival' },
    { month: 4, day: 18, nameEn: 'Janai Purnima / Raksha Bandhan', nameNp: 'जनाई पूर्णिमा / राक्षाबन्धन', type: 'festival' },
    { month: 4, day: 19, nameEn: 'Krishna Janmashtami', nameNp: 'कृष्ण जन्माष्टमी', type: 'festival' },
    { month: 1, day: 27, nameEn: 'Buddha Jayanti', nameNp: 'बुद्ध जयन्ती', type: 'festival' },
    { month: 1, day: 18, nameEn: 'Labour Day', nameNp: 'मजदुर दिवस', type: 'national' },
    { month: 5, day: 12, nameEn: 'Indra Jatra', nameNp: 'इन्द्र जात्रा', type: 'festival' },
  ],
};

// ---------------------------------------------------------------------------
// Helper utilities
// ---------------------------------------------------------------------------

/**
 * Get all holidays for a given BS year (fixed + variable).
 */
export function getHolidaysForYear(bsYear: number): NepaliHoliday[] {
  const variable = VARIABLE_HOLIDAYS[bsYear] ?? [];
  return [...FIXED_HOLIDAYS, ...variable];
}

/**
 * Check if a given BS date is a public holiday.
 * Returns false if the year has no holiday data.
 */
export function isHoliday(bsYear: number, bsMonth: number, bsDay: number): boolean {
  const holidays = getHolidaysForYear(bsYear);
  return holidays.some((h) => h.month === bsMonth && h.day === bsDay);
}

/**
 * Get holiday info for a given BS date, or undefined if it is not a holiday.
 */
export function getHolidayInfo(
  bsYear: number,
  bsMonth: number,
  bsDay: number
): NepaliHoliday | undefined {
  const holidays = getHolidaysForYear(bsYear);
  return holidays.find((h) => h.month === bsMonth && h.day === bsDay);
}

/**
 * Get the holiday name for a given BS date, or undefined if not a holiday.
 */
export function getHolidayName(
  bsYear: number,
  bsMonth: number,
  bsDay: number,
  locale: 'en' | 'ne' = 'en'
): string | undefined {
  const holiday = getHolidayInfo(bsYear, bsMonth, bsDay);
  if (!holiday) return undefined;
  return locale === 'ne' ? holiday.nameNp : holiday.nameEn;
}

/**
 * Get all holidays in a given BS month.
 */
export function getHolidaysInMonth(bsYear: number, bsMonth: number): NepaliHoliday[] {
  return getHolidaysForYear(bsYear).filter((h) => h.month === bsMonth);
}

// ---------------------------------------------------------------------------
// API-backed holiday fetching (with in-memory cache + static fallback)
// ---------------------------------------------------------------------------

/**
 * In-memory cache so we only fetch each BS year once per session.
 */
const _cache = new Map<number, NepaliHoliday[]>();

/**
 * Map API response event types to our holiday types.
 */
function mapApiType(apiType: string): NepaliHoliday['type'] {
  const t = apiType?.toLowerCase() ?? '';
  if (t.includes('national') || t.includes('government')) return 'national';
  if (t.includes('festival') || t.includes('cultural') || t.includes('religious')) return 'festival';
  return 'public';
}

/**
 * Fetch holiday data from the Nepali Calendar API for a given BS year.
 *
 * API: https://nepalicalendar.rat32.com/api/v2/calendar/{bsYear}
 *
 * Results are cached in memory for the lifetime of the session.
 * If the API call fails (network error, non-OK response, unexpected shape),
 * the function falls back to the built-in static data.
 *
 * @example
 * ```ts
 * // Fetch live data for the current BS year
 * import { fetchHolidays, getHolidaysForYear } from '@thaparoyal/calendar-core';
 *
 * const holidays = await fetchHolidays(2082);
 * console.log(holidays); // [{ month: 1, day: 1, nameEn: '...', ... }, ...]
 *
 * // After fetching, getHolidaysForYear() will use the cached data
 * const cached = getHolidaysForYear(2082);
 * ```
 */
export async function fetchHolidays(bsYear: number): Promise<NepaliHoliday[]> {
  // Return from cache if already fetched
  if (_cache.has(bsYear)) {
    return _cache.get(bsYear)!;
  }

  try {
    const response = await fetch(
      `https://nepalicalendar.rat32.com/api/v2/calendar/${bsYear}`
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    // The API returns an object keyed by month number (1–12).
    // Each month value is an array of day objects that may have a `holiday` field.
    const holidays: NepaliHoliday[] = [];

    if (data && typeof data === 'object') {
      for (let month = 1; month <= 12; month++) {
        const monthData = data[String(month)] ?? data[month];
        if (!Array.isArray(monthData)) continue;

        for (const entry of monthData) {
          // Each entry: { day, holiday, holiday_np, holiday_type, ... }
          if (!entry.holiday && !entry.holiday_np) continue;

          const nameEn: string = entry.holiday ?? entry.holiday_en ?? '';
          const nameNp: string = entry.holiday_np ?? entry.holiday ?? '';
          if (!nameEn && !nameNp) continue;

          holidays.push({
            month,
            day: Number(entry.day),
            nameEn: nameEn.trim(),
            nameNp: nameNp.trim(),
            type: mapApiType(entry.holiday_type ?? ''),
          });
        }
      }
    }

    // If the API returned data but no holidays were parsed, fall back to static
    if (holidays.length === 0) {
      const fallback = getHolidaysForYear(bsYear);
      _cache.set(bsYear, fallback);
      return fallback;
    }

    _cache.set(bsYear, holidays);
    return holidays;
  } catch {
    // Network error or unexpected response — use static fallback
    const fallback = getHolidaysForYear(bsYear);
    _cache.set(bsYear, fallback);
    return fallback;
  }
}

/**
 * Manually populate the holiday cache for a specific BS year.
 * Useful for server-rendered apps that pre-fetch holiday data.
 */
export function setHolidayCache(bsYear: number, holidays: NepaliHoliday[]): void {
  _cache.set(bsYear, holidays);
}

/**
 * Clear the in-memory holiday cache (e.g. for testing or forced refresh).
 */
export function clearHolidayCache(): void {
  _cache.clear();
}
