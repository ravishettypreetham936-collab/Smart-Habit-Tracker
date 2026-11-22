import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Calendar,
  Plus,
  CheckCheck,
  RotateCcw,
  Save,
  Download,
  Sparkles,
  ChevronDown,
  Sun,
  Moon
} from 'lucide-react';
import { useHabits } from '../../context/HabitContext';
import { formatTodayDate } from '../../utils/dateUtils';

export default function Header() {
  const {
    setIsModalOpen,
    setEditingHabit,
    markAllToday,
    manualSave,
    promptClearWeek,
    promptRestoreDefaults,
    handleExportCSV,
    handleExportJSON,
    lastSavedTime,
    theme,
    toggleTheme
  } = useHabits();

  const [showMenu, setShowMenu] = useState(false);
  const todayFormatted = formatTodayDate(new Date());

  const handleOpenAddModal = () => {
    setEditingHabit(null);
    setIsModalOpen(true);
  };

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 sticky top-0 z-30 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-3 gap-3">
          
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm ring-2 ring-emerald-500/20">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-white font-sans">
                  MY HABIT TRACKER
                </h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  Sheets Edition
                </span>
              </div>
              
              {/* Today's Date & Auto-Save Indicator */}
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium mt-0.5 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Today: <strong className="text-gray-800 dark:text-gray-200">{todayFormatted}</strong></span>
                </div>
                <span className="hidden sm:inline text-gray-300 dark:text-gray-700">•</span>
                <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Auto-saved {lastSavedTime ? `at ${lastSavedTime}` : 'just now'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center flex-wrap gap-2 w-full sm:w-auto justify-end">
            
            {/* Theme Toggle (Dark / Light Mode) */}
            <button
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className="p-1.5 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors shadow-2xs"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </button>

            {/* SAVE Button */}
            <button
              onClick={manualSave}
              title="Save all habits, completed days, and progress to browser LocalStorage"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold bg-emerald-700 text-white hover:bg-emerald-800 transition-colors shadow-2xs focus:ring-2 focus:ring-emerald-600 focus:ring-offset-1"
            >
              <Save className="w-4 h-4" />
              <span>Save</span>
            </button>

            {/* CLEAR Button */}
            <button
              onClick={promptClearWeek}
              title="Clear all completed checkboxes for the current week"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-950/80 border border-amber-200 dark:border-amber-800 transition-colors shadow-2xs"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Clear</span>
            </button>

            {/* Export CSV Button */}
            <button
              onClick={handleExportCSV}
              title="Export full habit records to CSV"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700 transition-colors shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="hidden md:inline">Export CSV</span>
              <span className="md:hidden">CSV</span>
            </button>

            {/* Mark Done Today */}
            <button
              onClick={markAllToday}
              title="Mark all habits completed for today"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 transition-colors shadow-2xs"
            >
              <CheckCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="hidden md:inline">Done Today</span>
            </button>

            {/* Add Habit Primary Button */}
            <button
              onClick={handleOpenAddModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-sm focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1"
            >
              <Plus className="w-4 h-4" />
              <span>Add Habit</span>
            </button>

            {/* More Options Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700 transition-colors"
                aria-label="Options"
              >
                <span>More</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
              </button>

              {showMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowMenu(false)}
                  />
                  <div className="absolute right-0 mt-1.5 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-100 dark:border-slate-700 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <button
                      onClick={() => {
                        handleExportCSV();
                        setShowMenu(false);
                      }}
                      className="w-full text-left px-3.5 py-2 text-xs sm:text-sm text-gray-700 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-slate-700 flex items-center gap-2"
                    >
                      <Download className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span>Export to CSV (Google Sheets)</span>
                    </button>
                    <button
                      onClick={() => {
                        handleExportJSON();
                        setShowMenu(false);
                      }}
                      className="w-full text-left px-3.5 py-2 text-xs sm:text-sm text-gray-700 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-slate-700 flex items-center gap-2"
                    >
                      <Download className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span>Backup to JSON</span>
                    </button>
                    <div className="border-t border-gray-100 dark:border-slate-700 my-1" />
                    <button
                      onClick={() => {
                        promptRestoreDefaults();
                        setShowMenu(false);
                      }}
                      className="w-full text-left px-3.5 py-2 text-xs sm:text-sm text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-slate-700 flex items-center gap-2"
                    >
                      <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      <span>Restore Default 8 Habits</span>
                    </button>
                  </div>
                </>
              )}
            </div>

          </div>

        </div>
      </div>
    </header>
  );
}
