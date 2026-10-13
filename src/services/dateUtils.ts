/**
 * Date and Time utilities for Odoo Dev Journey.
 * Enforces Africa/Cairo timezone awareness and Arabic formatting.
 */

export const DEFAULT_TIMEZONE = 'Africa/Cairo';

/**
 * Format a Date object or ISO string to YYYY-MM-DD
 */
export function toISODateString(d: Date | string | number): string {
  const date = typeof d === 'string' || typeof d === 'number' ? new Date(d) : d;
  if (isNaN(date.getTime())) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Get current date string (YYYY-MM-DD) in Africa/Cairo timezone
 */
export function getCairoTodayString(): string {
  try {
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: DEFAULT_TIMEZONE,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    return formatter.format(new Date());
  } catch {
    return toISODateString(new Date());
  }
}

/**
 * Format date to Arabic readable format: e.g. "الثلاثاء، 13 أكتوبر 2026"
 */
export function formatArabicDate(dateStr: string | Date, options?: { withWeekday?: boolean; short?: boolean }): string {
  if (!dateStr) return '';
  const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
  if (isNaN(date.getTime())) return String(dateStr);

  const weekdayOption = options?.withWeekday ? 'long' : undefined;
  const monthOption = options?.short ? 'numeric' : 'long';

  try {
    return new Intl.DateTimeFormat('ar-EG', {
      timeZone: DEFAULT_TIMEZONE,
      weekday: weekdayOption,
      year: 'numeric',
      month: monthOption,
      day: 'numeric'
    }).format(date);
  } catch {
    return toISODateString(date);
  }
}

/**
 * Format date with time in Cairo timezone
 */
export function formatArabicDateTime(dateStr: string | Date): string {
  if (!dateStr) return '';
  const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
  if (isNaN(date.getTime())) return String(dateStr);

  try {
    return new Intl.DateTimeFormat('ar-EG', {
      timeZone: DEFAULT_TIMEZONE,
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  } catch {
    return toISODateString(date);
  }
}

/**
 * Calculate the planned date for a task based on roadmap start date.
 * Week 1 to 12. Day 1 to 6. Day 7 is rest day.
 * weekIndex = week - 1
 * dayOffset = (week - 1) * 7 + (day - 1)
 */
export function calculateTaskPlannedDate(startDateStr: string, week: number, day: number): string {
  if (!startDateStr) return '';
  const start = new Date(startDateStr);
  if (isNaN(start.getTime())) return '';

  const dayOffset = (week - 1) * 7 + (day - 1);
  const planned = new Date(start);
  planned.setDate(planned.getDate() + dayOffset);
  return toISODateString(planned);
}

/**
 * Given a date, determine which roadmap week (1-12) and day (1-7) it falls into, relative to start date.
 */
export function getRoadmapPositionForDate(startDateStr: string, targetDateStr: string): { week: number; day: number; isRestDay: boolean; isBeforeStart: boolean; isAfterEnd: boolean } {
  const start = new Date(startDateStr);
  const target = new Date(targetDateStr);

  // Normalize time to midnight
  start.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);

  const diffTime = target.getTime() - start.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { week: 1, day: 1, isRestDay: false, isBeforeStart: true, isAfterEnd: false };
  }

  const week = Math.floor(diffDays / 7) + 1;
  const dayInWeek = (diffDays % 7) + 1; // 1 to 7

  if (week > 12) {
    return { week: 12, day: 7, isRestDay: true, isBeforeStart: false, isAfterEnd: true };
  }

  return {
    week,
    day: dayInWeek,
    isRestDay: dayInWeek === 7,
    isBeforeStart: false,
    isAfterEnd: false
  };
}

/**
 * Calculate the learning streak from a list of activity dates.
 * A streak is consecutive calendar days with at least 1 activity.
 * It counts backward from today (or yesterday if no activity logged yet today).
 */
export function calculateLearningStreak(activityDates: string[], todayStr: string = getCairoTodayString()): { currentStreak: number; longestStreak: number } {
  if (!activityDates || activityDates.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  // Deduplicate and sort dates ascending
  const uniqueDates = Array.from(new Set(activityDates.map(d => d.slice(0, 10))))
    .filter(d => Boolean(d))
    .sort();

  if (uniqueDates.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  const dateSet = new Set(uniqueDates);

  // Helper to add/sub days
  const addDays = (dStr: string, n: number): string => {
    const d = new Date(dStr);
    d.setDate(d.getDate() + n);
    return toISODateString(d);
  };

  // Current streak
  let currentStreak = 0;
  let checkDate = todayStr;

  // If no activity today, check if streak is alive from yesterday
  if (!dateSet.has(checkDate)) {
    const yesterday = addDays(checkDate, -1);
    if (dateSet.has(yesterday)) {
      checkDate = yesterday;
    } else {
      currentStreak = 0;
    }
  }

  // Count backwards consecutive days
  if (dateSet.has(checkDate)) {
    while (dateSet.has(checkDate)) {
      currentStreak++;
      checkDate = addDays(checkDate, -1);
    }
  }

  // Calculate longest streak across history
  let longestStreak = 0;
  let running = 0;
  let prevDateStr: string | null = null;

  for (const d of uniqueDates) {
    if (!prevDateStr) {
      running = 1;
    } else {
      const expectedNext = addDays(prevDateStr, 1);
      if (d === expectedNext) {
        running++;
      } else {
        running = 1;
      }
    }
    if (running > longestStreak) {
      longestStreak = running;
    }
    prevDateStr = d;
  }

  return {
    currentStreak,
    longestStreak: Math.max(longestStreak, currentStreak)
  };
}

/**
 * Get date range for a specific roadmap week
 */
export function getWeekDateRange(startDateStr: string, week: number): { start: string; end: string } {
  const weekStart = calculateTaskPlannedDate(startDateStr, week, 1);
  const weekEnd = calculateTaskPlannedDate(startDateStr, week, 7);
  return { start: weekStart, end: weekEnd };
}
