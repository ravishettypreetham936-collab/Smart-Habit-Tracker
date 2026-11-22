export { CATEGORIES } from './categories.js';

export const DAYS_OF_WEEK = [
  { id: 'mon', key: 'mon', label: 'Monday', short: 'Mon' },
  { id: 'tue', key: 'tue', label: 'Tuesday', short: 'Tue' },
  { id: 'wed', key: 'wed', label: 'Wednesday', short: 'Wed' },
  { id: 'thu', key: 'thu', label: 'Thursday', short: 'Thu' },
  { id: 'fri', key: 'fri', label: 'Friday', short: 'Fri' },
  { id: 'sat', key: 'sat', label: 'Saturday', short: 'Sat' },
  { id: 'sun', key: 'sun', label: 'Sunday', short: 'Sun' }
];

// 8 Default Habits as requested by the user
export const DEFAULT_HABITS = [
  {
    id: 'habit-1',
    name: 'Wake up early',
    category: 'productivity',
    icon: 'Sun',
    targetDays: 7,
    streak: 12,
    bestStreak: 21,
    weeklyLogs: {
      mon: true,
      tue: true,
      wed: true,
      thu: true,
      fri: true,
      sat: false,
      sun: false
    }
  },
  {
    id: 'habit-2',
    name: 'Exercise',
    category: 'fitness',
    icon: 'Dumbbell',
    targetDays: 5,
    streak: 5,
    bestStreak: 14,
    weeklyLogs: {
      mon: true,
      tue: true,
      wed: false,
      thu: true,
      fri: true,
      sat: true,
      sun: false
    }
  },
  {
    id: 'habit-3',
    name: 'Reading',
    category: 'learning',
    icon: 'BookOpen',
    targetDays: 7,
    streak: 8,
    bestStreak: 18,
    weeklyLogs: {
      mon: true,
      tue: true,
      wed: true,
      thu: true,
      fri: false,
      sat: true,
      sun: true
    }
  },
  {
    id: 'habit-4',
    name: 'Study',
    category: 'learning',
    icon: 'GraduationCap',
    targetDays: 6,
    streak: 4,
    bestStreak: 10,
    weeklyLogs: {
      mon: true,
      tue: true,
      wed: true,
      thu: false,
      fri: true,
      sat: false,
      sun: false
    }
  },
  {
    id: 'habit-5',
    name: 'Drink 3L water',
    category: 'health',
    icon: 'Droplets',
    targetDays: 7,
    streak: 19,
    bestStreak: 30,
    weeklyLogs: {
      mon: true,
      tue: true,
      wed: true,
      thu: true,
      fri: true,
      sat: true,
      sun: true
    }
  },
  {
    id: 'habit-6',
    name: 'Meditation',
    category: 'mindfulness',
    icon: 'Brain',
    targetDays: 7,
    streak: 6,
    bestStreak: 15,
    weeklyLogs: {
      mon: false,
      tue: true,
      wed: true,
      thu: true,
      fri: true,
      sat: true,
      sun: false
    }
  },
  {
    id: 'habit-7',
    name: 'No social media',
    category: 'productivity',
    icon: 'PhoneOff',
    targetDays: 5,
    streak: 3,
    bestStreak: 9,
    weeklyLogs: {
      mon: true,
      tue: false,
      wed: true,
      thu: true,
      fri: false,
      sat: false,
      sun: true
    }
  },
  {
    id: 'habit-8',
    name: 'Sleep on time',
    category: 'health',
    icon: 'Moon',
    targetDays: 7,
    streak: 7,
    bestStreak: 14,
    weeklyLogs: {
      mon: true,
      tue: true,
      wed: true,
      thu: false,
      fri: true,
      sat: true,
      sun: false
    }
  }
];
