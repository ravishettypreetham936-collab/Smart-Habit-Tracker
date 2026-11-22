import { DAYS_OF_WEEK } from '../constants/defaultHabits.js';

/**
 * Returns formatted today's date: e.g. "Sunday, November 22, 2026"
 */
export function formatTodayDate(date = new Date()) {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
}

/**
 * Returns an array of day objects for the current selected week offset.
 * offset = 0 means current week.
 * Monday is day 0 of the week array, Sunday is day 6.
 */
export function getWeekDays(weekOffset = 0) {
  const now = new Date();
  
  // Find Monday of the current week (JavaScript getDay: 0 is Sun, 1 is Mon... 6 is Sat)
  const currentDay = now.getDay();
  // distance to Monday: if Sunday (0), Monday was 6 days ago; if Monday (1), 0 days ago; etc.
  const distanceToMonday = currentDay === 0 ? -6 : 1 - currentDay;
  
  const monday = new Date(now);
  monday.setDate(now.getDate() + distanceToMonday + (weekOffset * 7));
  monday.setHours(0, 0, 0, 0);

  const todayStr = new Date().toDateString();

  return DAYS_OF_WEEK.map((dayDef, index) => {
    const dayDate = new Date(monday);
    dayDate.setDate(monday.getDate() + index);

    const isToday = dayDate.toDateString() === todayStr;

    return {
      key: dayDef.key,
      name: dayDef.label,
      short: dayDef.short,
      dateNum: dayDate.getDate(),
      monthShort: dayDate.toLocaleString('en-US', { month: 'short' }),
      fullDateString: dayDate.toISOString().split('T')[0],
      isToday,
      isWeekend: index === 5 || index === 6
    };
  });
}

/**
 * Returns the human-readable week range string, e.g. "Nov 17 - Nov 23, 2026"
 */
export function getWeekRangeLabel(weekOffset = 0) {
  const days = getWeekDays(weekOffset);
  const first = days[0];
  const last = days[6];

  if (first.monthShort === last.monthShort) {
    return `${first.monthShort} ${first.dateNum} – ${last.dateNum}, 2026`;
  }
  return `${first.monthShort} ${first.dateNum} – ${last.monthShort} ${last.dateNum}, 2026`;
}

/**
 * Computes weekly completion % for a single habit
 */
export function getHabitWeeklyCompletion(weeklyLogs = {}) {
  const completedCount = DAYS_OF_WEEK.filter(day => Boolean(weeklyLogs[day.key])).length;
  const percentage = Math.round((completedCount / 7) * 100);
  return {
    completedCount,
    totalDays: 7,
    percentage
  };
}

/**
 * Computes daily completion rate across all habits for a specific day key
 */
export function getDayCompletionRate(habits = [], dayKey) {
  if (!habits.length) return { completed: 0, total: 0, percentage: 0 };
  const completed = habits.filter(h => h.weeklyLogs && h.weeklyLogs[dayKey]).length;
  const percentage = Math.round((completed / habits.length) * 100);
  return { completed, total: habits.length, percentage };
}

/**
 * Computes overall dashboard summary metrics
 */
export function calculateDashboardMetrics(habits = [], weekDays = []) {
  if (!habits.length) {
    return {
      overallPercentage: 0,
      todayCompleted: 0,
      todayPending: 0,
      todayTotal: 0,
      todayRate: 0,
      totalCompletedChecks: 0,
      totalPendingChecks: 0,
      totalPossibleChecks: 0,
      perfectDaysCount: 0,
      bestStreak: 0
    };
  }

  // Today key
  const todayDay = weekDays.find(d => d.isToday) || weekDays[0];
  const todayKey = todayDay.key;

  let totalCompletedChecks = 0;
  const totalPossibleChecks = habits.length * 7;

  habits.forEach(h => {
    DAYS_OF_WEEK.forEach(d => {
      if (h.weeklyLogs && h.weeklyLogs[d.key]) {
        totalCompletedChecks += 1;
      }
    });
  });

  const totalPendingChecks = Math.max(0, totalPossibleChecks - totalCompletedChecks);
  const overallPercentage = totalPossibleChecks > 0
    ? Math.round((totalCompletedChecks / totalPossibleChecks) * 100)
    : 0;

  // Today metrics
  const todayCompleted = habits.filter(h => h.weeklyLogs && h.weeklyLogs[todayKey]).length;
  const todayPending = Math.max(0, habits.length - todayCompleted);
  const todayRate = habits.length > 0
    ? Math.round((todayCompleted / habits.length) * 100)
    : 0;

  // Perfect days in the week (where all habits were completed)
  let perfectDaysCount = 0;
  DAYS_OF_WEEK.forEach(d => {
    const dayDone = habits.filter(h => h.weeklyLogs && h.weeklyLogs[d.key]).length;
    if (dayDone === habits.length && habits.length > 0) {
      perfectDaysCount += 1;
    }
  });

  // Best streak across all habits
  const bestStreak = habits.reduce((max, h) => Math.max(max, h.streak || 0, h.bestStreak || 0), 0);

  // Lists of today's completed vs remaining habits
  const todayCompletedHabits = habits.filter(h => Boolean(h.weeklyLogs && h.weeklyLogs[todayKey]));
  const todayRemainingHabits = habits.filter(h => !Boolean(h.weeklyLogs && h.weeklyLogs[todayKey]));

  // Monthly progress calculation (blends current weekly adherence with monthly streak consistency)
  const averageStreak = habits.length > 0
    ? habits.reduce((acc, h) => acc + (h.streak || 0), 0) / habits.length
    : 0;
  const streakMonthlyScore = Math.min(100, Math.round((averageStreak / 28) * 100));
  const monthlyPercentage = habits.length > 0
    ? Math.round((overallPercentage * 0.65) + (streakMonthlyScore * 0.35))
    : 0;

  return {
    overallPercentage,
    todayCompleted,
    todayPending,
    todayTotal: habits.length,
    todayRate,
    totalCompletedChecks,
    totalPendingChecks,
    totalPossibleChecks,
    perfectDaysCount,
    bestStreak,
    todayCompletedHabits,
    todayRemainingHabits,
    monthlyPercentage
  };
}
