import { DEFAULT_HABITS, DAYS_OF_WEEK } from '../constants/defaultHabits.js';

const STORAGE_KEY = 'SMART_HABIT_TRACKER_DATA_V1';

/**
 * Loads habits from LocalStorage, falling back to default habits
 */
export function loadHabitsFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveHabitsToStorage(DEFAULT_HABITS);
      return { habits: DEFAULT_HABITS, lastSaved: new Date().toISOString() };
    }
    const parsed = JSON.parse(raw);
    
    // Support both wrapper object format { habits, lastSaved, version } and direct array
    if (parsed && Array.isArray(parsed.habits) && parsed.habits.length > 0) {
      return {
        habits: parsed.habits,
        lastSaved: parsed.lastSaved || new Date().toISOString()
      };
    } else if (Array.isArray(parsed) && parsed.length > 0) {
      return {
        habits: parsed,
        lastSaved: new Date().toISOString()
      };
    }
    return { habits: DEFAULT_HABITS, lastSaved: new Date().toISOString() };
  } catch (error) {
    console.error('Error loading habits from localStorage:', error);
    return { habits: DEFAULT_HABITS, lastSaved: new Date().toISOString() };
  }
}

/**
 * Saves habits and metadata to LocalStorage
 */
export function saveHabitsToStorage(habits) {
  try {
    const now = new Date();
    const payload = {
      version: 1,
      lastSaved: now.toISOString(),
      lastSavedFormatted: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      habits
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    return payload;
  } catch (error) {
    console.error('Error saving habits to localStorage:', error);
    return null;
  }
}

/**
 * Clears current week's tracking logs for all habits
 */
export function clearWeeklyLogs(habits) {
  return habits.map(h => ({
    ...h,
    weeklyLogs: {
      mon: false,
      tue: false,
      wed: false,
      thu: false,
      fri: false,
      sat: false,
      sun: false
    }
  }));
}

/**
 * Exports data as a CSV string compatible with Google Sheets & Microsoft Excel
 */
export function exportToCSV(habits, weekLabel = 'Current Week') {
  const headers = [
    'Habit Name',
    'Category',
    'Weekly Goal (Days)',
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat',
    'Sun',
    'Days Completed',
    'Weekly Adherence %',
    'Goal Achievement %',
    'Current Streak (Days)',
    'Longest Streak (Days)',
    'Goal Status'
  ];
  
  const rows = habits.map(h => {
    const logs = h.weeklyLogs || {};
    const mon = logs.mon ? '1' : '0';
    const tue = logs.tue ? '1' : '0';
    const wed = logs.wed ? '1' : '0';
    const thu = logs.thu ? '1' : '0';
    const fri = logs.fri ? '1' : '0';
    const sat = logs.sat ? '1' : '0';
    const sun = logs.sun ? '1' : '0';

    const completed = DAYS_OF_WEEK.filter(d => logs[d.key]).length;
    const weeklyRate = Math.round((completed / 7) * 100);
    const target = h.targetDays || 7;
    const goalAchievementRate = Math.round((completed / target) * 100);
    const isGoalMet = completed >= target ? 'GOAL MET' : 'IN PROGRESS';

    return [
      `"${h.name}"`,
      `"${h.category}"`,
      target,
      mon,
      tue,
      wed,
      thu,
      fri,
      sat,
      sun,
      `${completed}/7`,
      `${weeklyRate}%`,
      `${goalAchievementRate}%`,
      h.streak || 0,
      h.bestStreak || h.streak || 0,
      `"${isGoalMet}"`
    ].join(',');
  });

  const csvContent = [
    `# Smart Habit Tracker - ${weekLabel}`,
    `# Generated: ${new Date().toLocaleString()}`,
    headers.join(','),
    ...rows
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Habit_Tracker_Records_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Exports data as a JSON file backup
 */
export function exportToJSON(habits) {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(habits, null, 2));
  const link = document.createElement('a');
  link.setAttribute('href', dataStr);
  link.setAttribute('download', `habit_tracker_backup_${new Date().toISOString().split('T')[0]}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
