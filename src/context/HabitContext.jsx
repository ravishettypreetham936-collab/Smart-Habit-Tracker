import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { DEFAULT_HABITS, DAYS_OF_WEEK } from '../constants/defaultHabits';
import {
  loadHabitsFromStorage,
  saveHabitsToStorage,
  clearWeeklyLogs,
  exportToCSV,
  exportToJSON
} from '../utils/storageUtils';
import { getWeekDays, getWeekRangeLabel, calculateDashboardMetrics } from '../utils/dateUtils';
import { fireCelebrationConfetti } from '../utils/confettiUtils';

const HabitContext = createContext(null);

export function HabitProvider({ children }) {
  // Load initially persisted data from browser LocalStorage
  const initialData = loadHabitsFromStorage();
  const [habits, setHabits] = useState(initialData.habits);
  const [lastSavedTime, setLastSavedTime] = useState(
    new Date(initialData.lastSaved).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  );
  
  // Theme state: 'light' | 'dark'
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('SMART_HABIT_TRACKER_THEME') || 'light';
    } catch {
      return 'light';
    }
  });

  useEffect(() => {
    try {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem('SMART_HABIT_TRACKER_THEME', theme);
    } catch (e) {
      console.error('Error saving theme preference:', e);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const [weekOffset, setWeekOffset] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [activeHabitId, setActiveHabitId] = useState(initialData.habits[0]?.id || null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [viewMode, setViewMode] = useState('sheet'); // 'sheet' | 'month' | 'analytics'

  // Toast notification state
  const [toast, setToast] = useState({ show: false, title: '', message: '' });
  const toastTimeoutRef = useRef(null);

  const showToast = (title, message = '') => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToast({ show: true, title, message });
    toastTimeoutRef.current = setTimeout(() => {
      setToast({ show: false, title: '', message: '' });
    }, 3200);
  };

  const closeToast = () => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToast({ show: false, title: '', message: '' });
  };

  // Custom confirmation modal state
  const [confirmConfig, setConfirmConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    confirmVariant: 'danger',
    onConfirm: null
  });

  const openConfirmDialog = ({ title, message, confirmText, cancelText, confirmVariant, onConfirm }) => {
    setConfirmConfig({
      isOpen: true,
      title: title || 'Are you sure?',
      message: message || '',
      confirmText: confirmText || 'Confirm',
      cancelText: cancelText || 'Cancel',
      confirmVariant: confirmVariant || 'danger',
      onConfirm: () => {
        if (onConfirm) onConfirm();
        setConfirmConfig(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const closeConfirmDialog = () => {
    setConfirmConfig(prev => ({ ...prev, isOpen: false }));
  };

  // ─────────────────────────────────────────────────────────────────
  // AUTO SAVE: Automatically save whenever habits change
  // Ensures data is never lost when refreshing or closing browser
  // ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    const saved = saveHabitsToStorage(habits);
    if (saved) {
      setLastSavedTime(saved.lastSavedFormatted);
    }
  }, [habits]);

  // Derived date & dashboard metrics
  const weekDays = getWeekDays(weekOffset);
  const weekRangeLabel = getWeekRangeLabel(weekOffset);
  const metrics = calculateDashboardMetrics(habits, weekDays);

  // Active habit object for the formula bar
  const activeHabit = habits.find(h => h.id === activeHabitId) || habits[0] || null;

  // ─────────────────────────────────────────────────────────────────
  // 1. MANUAL SAVE BUTTON ACTION:
  // Saves all habits, completed days, weekly progress to LocalStorage
  // and displays a success notification
  // ─────────────────────────────────────────────────────────────────
  const manualSave = () => {
    const saved = saveHabitsToStorage(habits);
    const timeStr = saved ? saved.lastSavedFormatted : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setLastSavedTime(timeStr);

    showToast(
      'Progress Saved to LocalStorage!',
      `All ${habits.length} habits, completed days, and weekly progress are safely stored.`
    );
  };

  // ─────────────────────────────────────────────────────────────────
  // 2. CLEAR BUTTON ACTION:
  // Clears the current week's tracking data with confirmation
  // ─────────────────────────────────────────────────────────────────
  const promptClearWeek = () => {
    openConfirmDialog({
      title: 'Clear Week Tracking Data',
      message: 'Are you sure you want to clear all completed checkboxes for this week? This will uncheck Monday to Sunday for all habits.',
      confirmText: 'Yes, Clear All Days',
      confirmVariant: 'warning',
      onConfirm: () => {
        setHabits(prev => clearWeeklyLogs(prev));
        showToast(
          'Week Data Cleared',
          'All checked days for this week have been reset to unchecked.'
        );
      }
    });
  };

  // ─────────────────────────────────────────────────────────────────
  // 3. TOGGLE HABIT DAY (CHECKBOX CLICK)
  // Auto-saves immediately via useEffect
  // ─────────────────────────────────────────────────────────────────
  const toggleHabitDay = (habitId, dayKey) => {
    setHabits(prevHabits => {
      let isTodayBecoming100 = false;
      const todayDay = weekDays.find(d => d.isToday) || weekDays[0];
      const isTodayKey = dayKey === todayDay.key;

      const updated = prevHabits.map(habit => {
        if (habit.id !== habitId) return habit;

        const currentVal = Boolean(habit.weeklyLogs && habit.weeklyLogs[dayKey]);
        const newVal = !currentVal;

        const newLogs = {
          ...(habit.weeklyLogs || {}),
          [dayKey]: newVal
        };

        // Recalculate streak dynamically
        let newStreak = habit.streak || 0;
        if (newVal) {
          newStreak += 1;
        } else if (newStreak > 0) {
          newStreak -= 1;
        }
        const bestStreak = Math.max(habit.bestStreak || 0, newStreak);

        return {
          ...habit,
          weeklyLogs: newLogs,
          streak: newStreak,
          bestStreak
        };
      });

      // If completing all habits for today, fire celebration confetti
      if (isTodayKey) {
        const allDoneToday = updated.length > 0 && updated.every(h => h.weeklyLogs && h.weeklyLogs[dayKey]);
        if (allDoneToday) {
          isTodayBecoming100 = true;
        }
      }

      if (isTodayBecoming100) {
        fireCelebrationConfetti();
      }

      return updated;
    });
  };

  // Add new habit
  const addHabit = (habitData) => {
    const newHabit = {
      id: `habit-${Date.now()}`,
      name: habitData.name.trim(),
      category: habitData.category || 'productivity',
      icon: habitData.icon || 'Sparkles',
      targetDays: Number(habitData.targetDays) || 7,
      streak: 0,
      bestStreak: 0,
      weeklyLogs: {
        mon: false,
        tue: false,
        wed: false,
        thu: false,
        fri: false,
        sat: false,
        sun: false
      }
    };
    setHabits(prev => [newHabit, ...prev]);
    setActiveHabitId(newHabit.id);
    showToast('New Habit Created', `"${newHabit.name}" has been added and saved.`);
  };

  // Rename habit directly (inline edit)
  const renameHabit = (habitId, newName) => {
    const trimmed = (newName || '').trim();
    if (!trimmed) return;
    setHabits(prev =>
      prev.map(h => (h.id === habitId ? { ...h, name: trimmed } : h))
    );
    showToast('Habit Renamed', `Updated to "${trimmed}".`);
  };

  // Update full habit details
  const updateHabit = (habitId, updatedData) => {
    setHabits(prev =>
      prev.map(h => (h.id === habitId ? { ...h, ...updatedData } : h))
    );
    showToast('Habit Updated', 'Changes have been saved to LocalStorage.');
  };

  // Delete habit with confirmation dialog
  const promptDeleteHabit = (habitId, habitName) => {
    openConfirmDialog({
      title: 'Delete Habit',
      message: `Are you sure you want to permanently delete "${habitName || 'this habit'}"? All progress and streak records for this habit will be removed.`,
      confirmText: 'Yes, Delete Habit',
      confirmVariant: 'danger',
      onConfirm: () => {
        setHabits(prev => prev.filter(h => h.id !== habitId));
        if (activeHabitId === habitId) {
          setActiveHabitId(null);
        }
        showToast('Habit Deleted', `"${habitName || 'Habit'}" was removed.`);
      }
    });
  };

  // Restore default 8 habits with confirmation dialog
  const promptRestoreDefaults = () => {
    openConfirmDialog({
      title: 'Restore Default Habits',
      message: 'This will restore the original 8 default habits (Wake up early, Exercise, Reading, Study, Drink 3L water, Meditation, No social media, Sleep on time). Custom habits will be replaced.',
      confirmText: 'Yes, Restore Defaults',
      confirmVariant: 'warning',
      onConfirm: () => {
        setHabits(DEFAULT_HABITS);
        setActiveHabitId(DEFAULT_HABITS[0]?.id);
        saveHabitsToStorage(DEFAULT_HABITS);
        showToast('Default Habits Restored', 'The 8 default habits have been reset.');
      }
    });
  };

  // Mark all habits as completed for today
  const markAllToday = () => {
    const todayDay = weekDays.find(d => d.isToday) || weekDays[0];
    const dayKey = todayDay.key;

    setHabits(prev =>
      prev.map(habit => ({
        ...habit,
        weeklyLogs: {
          ...(habit.weeklyLogs || {}),
          [dayKey]: true
        },
        streak: (habit.weeklyLogs && habit.weeklyLogs[dayKey]) ? habit.streak : (habit.streak || 0) + 1
      }))
    );
    fireCelebrationConfetti();
    showToast('All Habits Completed Today!', 'Every habit has been checked for today.');
  };

  // Update habit weekly goal
  const updateHabitGoal = (habitId, newTargetDays) => {
    const target = Math.min(7, Math.max(1, Number(newTargetDays) || 7));
    setHabits(prev =>
      prev.map(h => (h.id === habitId ? { ...h, targetDays: target } : h))
    );
    showToast('Weekly Goal Updated', `Target set to ${target} days per week.`);
  };

  // Export handlers
  const handleExportCSV = () => {
    exportToCSV(habits, weekRangeLabel);
    showToast('CSV Exported', 'Habit records downloaded for Google Sheets / Excel.');
  };
  const handleExportJSON = () => {
    exportToJSON(habits);
    showToast('JSON Exported', 'Habit backup file created.');
  };

  // Filtered habits list
  const filteredHabits = habits.filter(habit => {
    const matchesCategory = categoryFilter === 'all' || habit.category === categoryFilter;
    const matchesSearch = habit.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <HabitContext.Provider
      value={{
        habits,
        filteredHabits,
        weekOffset,
        setWeekOffset,
        weekDays,
        weekRangeLabel,
        metrics,
        searchQuery,
        setSearchQuery,
        categoryFilter,
        setCategoryFilter,
        activeHabitId,
        setActiveHabitId,
        activeHabit,
        viewMode,
        setViewMode,
        isModalOpen,
        setIsModalOpen,
        editingHabit,
        setEditingHabit,
        theme,
        toggleTheme,
        confirmConfig,
        closeConfirmDialog,
        toast,
        showToast,
        closeToast,
        lastSavedTime,
        manualSave,
        promptClearWeek,
        toggleHabitDay,
        addHabit,
        renameHabit,
        updateHabit,
        updateHabitGoal,
        promptDeleteHabit,
        promptRestoreDefaults,
        markAllToday,
        handleExportCSV,
        handleExportJSON
      }}
    >
      {children}
    </HabitContext.Provider>
  );
}

export function useHabits() {
  const context = useContext(HabitContext);
  if (!context) {
    throw new Error('useHabits must be used within a HabitProvider');
  }
  return context;
}
