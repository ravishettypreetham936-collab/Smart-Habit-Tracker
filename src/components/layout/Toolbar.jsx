import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Table,
  Calendar,
  BarChart2,
  Filter
} from 'lucide-react';
import { useHabits } from '../../context/HabitContext';
import { CATEGORIES } from '../../constants/categories';
import { getHabitWeeklyCompletion } from '../../utils/dateUtils';

export default function Toolbar() {
  const {
    weekOffset,
    setWeekOffset,
    weekRangeLabel,
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    activeHabit,
    viewMode,
    setViewMode,
    filteredHabits,
    habits
  } = useHabits();

  // Active habit formula summary
  const habitCompletion = activeHabit ? getHabitWeeklyCompletion(activeHabit.weeklyLogs) : null;
  const target = activeHabit?.targetDays || 7;
  const goalAchievement = habitCompletion ? Math.round((habitCompletion.completedCount / target) * 100) : 0;

  return (
    <div className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        
        {/* Row 1: Week Navigation & 3 View Tabs */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pb-2.5 border-b border-gray-100 dark:border-slate-800">
          
          {/* Week Selector */}
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-0.5 shadow-xs">
              <button
                onClick={() => setWeekOffset(prev => prev - 1)}
                className="p-1.5 hover:bg-white dark:hover:bg-slate-700 hover:text-emerald-700 dark:hover:text-emerald-400 text-gray-600 dark:text-gray-300 rounded-md transition-all shadow-xs"
                title="Previous Week"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => setWeekOffset(0)}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                  weekOffset === 0
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-slate-700 hover:text-emerald-700'
                }`}
              >
                This Week
              </button>

              <button
                onClick={() => setWeekOffset(prev => prev + 1)}
                className="p-1.5 hover:bg-white dark:hover:bg-slate-700 hover:text-emerald-700 dark:hover:text-emerald-400 text-gray-600 dark:text-gray-300 rounded-md transition-all shadow-xs"
                title="Next Week"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <span className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-slate-800 px-2.5 py-1 rounded-md border border-gray-200 dark:border-slate-700 font-mono">
              📅 {weekRangeLabel}
            </span>
          </div>

          {/* View Mode Tabs (Weekly Sheet, Monthly Calendar, Analytics) */}
          <div className="flex items-center gap-2 self-start md:self-auto overflow-x-auto">
            <div className="inline-flex rounded-lg bg-gray-100 dark:bg-slate-800 p-0.5 border border-gray-200 dark:border-slate-700">
              {/* Tab 1: Weekly Sheet */}
              <button
                onClick={() => setViewMode('sheet')}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
                  viewMode === 'sheet'
                    ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-400 shadow-sm font-semibold'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Table className="w-3.5 h-3.5" />
                <span>Weekly Sheet</span>
              </button>

              {/* Tab 2: Monthly Calendar */}
              <button
                onClick={() => setViewMode('month')}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
                  viewMode === 'month'
                    ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-400 shadow-sm font-semibold'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Monthly View</span>
              </button>

              {/* Tab 3: Analytics & Charts */}
              <button
                onClick={() => setViewMode('analytics')}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
                  viewMode === 'analytics'
                    ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-400 shadow-sm font-semibold'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <BarChart2 className="w-3.5 h-3.5" />
                <span>Analytics</span>
              </button>
            </div>
          </div>

        </div>

        {/* Row 2: Google Sheets Inspired Formula Bar & Filter Pills */}
        <div className="pt-2.5 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          
          {/* Formula Bar (fx) */}
          <div className="flex-1 flex items-center bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 font-mono text-xs overflow-hidden shadow-2xs">
            <span className="font-bold text-gray-500 dark:text-gray-400 mr-2 text-[11px] select-none bg-gray-200/60 dark:bg-slate-700 px-1.5 py-0.5 rounded">
              fx
            </span>
            <div className="truncate text-gray-700 dark:text-gray-200">
              {activeHabit ? (
                <>
                  <span className="text-emerald-700 dark:text-emerald-400 font-semibold">{activeHabit.name}</span>
                  <span className="text-gray-400 dark:text-gray-600 mx-1.5">|</span>
                  <span className="text-gray-500 dark:text-gray-400">Weekly Goal: {activeHabit.targetDays || 7}d</span>
                  <span className="text-gray-400 dark:text-gray-600 mx-1.5">|</span>
                  <span className="text-gray-500 dark:text-gray-400">Streak: 🔥 {activeHabit.streak || 0}d (Best: 🏆 {activeHabit.bestStreak || activeHabit.streak || 0}d)</span>
                  <span className="text-gray-400 dark:text-gray-600 mx-1.5">|</span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-bold ml-1.5">
                    Goal Achievement: {goalAchievement}% ({habitCompletion?.completedCount || 0}/{activeHabit.targetDays || 7}d)
                  </span>
                </>
              ) : (
                <span className="text-gray-400 italic">Select a habit row to inspect formulas and streaks</span>
              )}
            </div>
          </div>

          {/* Search & Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
            {/* Search Input */}
            <div className="relative min-w-[150px] sm:min-w-[170px]">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search habits..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-md text-xs placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCategoryFilter('all')}
                className={`px-2 py-1 rounded text-[11px] font-medium whitespace-nowrap transition-colors ${
                  categoryFilter === 'all'
                    ? 'bg-emerald-600 text-white font-semibold'
                    : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700'
                }`}
              >
                All ({habits.length})
              </button>
              {Object.values(CATEGORIES).map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setCategoryFilter(cat.id)}
                  className={`px-2 py-1 rounded text-[11px] font-medium whitespace-nowrap transition-colors ${
                    categoryFilter === cat.id
                      ? `${cat.badge} font-bold ring-1 ring-current`
                      : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {cat.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
