import React from 'react';
import { HabitProvider, useHabits } from './context/HabitContext';
import Header from './components/layout/Header';
import Toolbar from './components/layout/Toolbar';
import StatsRibbon from './components/layout/StatsRibbon';
import MotivationalQuote from './components/layout/MotivationalQuote';
import HabitTable from './components/sheet/HabitTable';
import MobileHabitCards from './components/sheet/MobileHabitCards';
import MonthlyCalendarView from './components/calendar/MonthlyCalendarView';
import OverviewCharts from './components/analytics/OverviewCharts';
import HabitModal from './components/habits/HabitModal';
import ConfirmModal from './components/common/ConfirmModal';
import ToastNotification from './components/common/ToastNotification';
import {
  FileSpreadsheet,
  Table as TableIcon,
  Calendar as CalendarIcon,
  BarChart2,
  HardDrive,
  Sparkles
} from 'lucide-react';

function DashboardContent() {
  const {
    viewMode,
    setViewMode,
    confirmConfig,
    closeConfirmDialog,
    toast,
    closeToast,
    lastSavedTime
  } = useHabits();

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA] dark:bg-slate-900 text-gray-800 dark:text-gray-100 transition-colors antialiased">
      {/* 1. Header (MY HABIT TRACKER, Today's Date, SAVE & CLEAR buttons, Theme Toggle) */}
      <Header />

      {/* 2. Daily Motivational Quote Ribbon */}
      <MotivationalQuote />

      {/* 3. Google Sheets Toolbar (Week Selector, Formula Bar, Filters, 3 View Tabs) */}
      <Toolbar />

      {/* 4. Stats Ribbon (Metrics cards with dynamic streaks & goals) */}
      <StatsRibbon />

      {/* 5. Main Body Content (Weekly Sheet, Monthly Calendar, Analytics) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {viewMode === 'sheet' && (
          <div className="space-y-6">
            {/* Desktop & Tablet Google Sheets Habit Table */}
            <div className="hidden md:block">
              <HabitTable />
            </div>

            {/* Mobile View: Scrollable Table & Touch Cards */}
            <div className="md:hidden space-y-4">
              <div className="bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-lg p-2.5 text-xs text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
                <span>📱 Mobile Optimized View</span>
                <span className="text-[10px] font-mono">Swipe or tap cards</span>
              </div>
              <MobileHabitCards />
              <div className="mt-4 pt-2">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">
                  Full Spreadsheet Grid:
                </p>
                <HabitTable />
              </div>
            </div>
          </div>
        )}

        {viewMode === 'month' && (
          /* Monthly Calendar View (Completed vs Missed Days) */
          <MonthlyCalendarView />
        )}

        {viewMode === 'analytics' && (
          /* Analytics & Charts View (Recharts & Circular Progress Rings) */
          <OverviewCharts />
        )}
      </main>

      {/* 6. Google Sheets Bottom Tab Bar */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 z-20 shadow-xs transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-10 text-xs">
          
          {/* Sheet View Tabs (Spreadsheet style) */}
          <div className="flex items-center space-x-1 h-full pt-1">
            <button
              onClick={() => setViewMode('sheet')}
              className={`flex items-center gap-1.5 px-3 h-full border-t-2 text-xs font-medium transition-all ${
                viewMode === 'sheet'
                  ? 'border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300 font-bold'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Weekly Sheet</span>
            </button>

            <button
              onClick={() => setViewMode('month')}
              className={`flex items-center gap-1.5 px-3 h-full border-t-2 text-xs font-medium transition-all ${
                viewMode === 'month'
                  ? 'border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300 font-bold'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Monthly Calendar</span>
            </button>

            <button
              onClick={() => setViewMode('analytics')}
              className={`flex items-center gap-1.5 px-3 h-full border-t-2 text-xs font-medium transition-all ${
                viewMode === 'analytics'
                  ? 'border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300 font-bold'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Analytics & Charts</span>
            </button>
          </div>

          {/* Status Indicator */}
          <div className="hidden sm:flex items-center gap-2 text-gray-500 dark:text-gray-400 font-mono text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <HardDrive className="w-3.5 h-3.5 text-gray-400" />
            <span>Synced to LocalStorage {lastSavedTime ? `(${lastSavedTime})` : ''}</span>
          </div>

        </div>
      </footer>

      {/* 7. Habit Creation / Edit Modal */}
      <HabitModal />

      {/* 8. Confirmation Modal (For Clear & Delete) */}
      <ConfirmModal
        isOpen={confirmConfig.isOpen}
        title={confirmConfig.title}
        message={confirmConfig.message}
        confirmText={confirmConfig.confirmText}
        cancelText={confirmConfig.cancelText}
        confirmVariant={confirmConfig.confirmVariant}
        onConfirm={confirmConfig.onConfirm}
        onCancel={closeConfirmDialog}
      />

      {/* 9. Toast Notification for Save & Actions */}
      <ToastNotification toast={toast} onClose={closeToast} />
    </div>
  );
}

export default function App() {
  return (
    <HabitProvider>
      <DashboardContent />
    </HabitProvider>
  );
}
