import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Calendar as CalendarIcon,
  Sparkles,
  Flame,
  Award
} from 'lucide-react';
import { useHabits } from '../../context/HabitContext';
import { CATEGORIES } from '../../constants/categories';
import { HabitIcon } from '../../utils/iconMap';
import { DAYS_OF_WEEK } from '../../constants/defaultHabits.js';

export default function MonthlyCalendarView() {
  const { habits } = useHabits();

  // Current active date context for calendar navigation
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedDayNum, setSelectedDayNum] = useState(() => new Date().getDate());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 10 for November

  const monthName = currentDate.toLocaleString('en-US', { month: 'long' });
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday

  // Month navigation
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDayNum(1);
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDayNum(1);
  };

  const todayDateObj = new Date();
  const isCurrentMonth = todayDateObj.getFullYear() === year && todayDateObj.getMonth() === month;
  const todayDateNum = isCurrentMonth ? todayDateObj.getDate() : -1;

  // Day of week abbreviations
  const weekDayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Map each day number to its day of week key ('mon', 'tue', etc.)
  const getDayKey = (dayNum) => {
    const d = new Date(year, month, dayNum);
    const dayIdx = d.getDay(); // 0 Sun, 1 Mon, ... 6 Sat
    const map = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    return map[dayIdx];
  };

  // Calculate day stats (simulated/tracked from weekly logs for matching day of week)
  const getDayStats = (dayNum) => {
    const isPast = dayNum < todayDateNum || (!isCurrentMonth && currentDate < todayDateObj);
    const isToday = isCurrentMonth && dayNum === todayDateNum;
    const isFuture = dayNum > todayDateNum && isCurrentMonth;

    const dayKey = getDayKey(dayNum);

    // Number of habits completed for this day
    const completedHabits = habits.filter(h => Boolean(h.weeklyLogs && h.weeklyLogs[dayKey]));
    const missedHabits = habits.filter(h => !Boolean(h.weeklyLogs && h.weeklyLogs[dayKey]));

    const count = completedHabits.length;
    const total = habits.length;
    const percentage = total > 0 ? Math.round((count / total) * 100) : 0;

    let status = 'future';
    if (isToday) {
      status = 'today';
    } else if (isPast) {
      if (percentage >= 80) {
        status = 'completed';
      } else if (percentage >= 40) {
        status = 'partial';
      } else {
        status = 'missed';
      }
    }

    return {
      dayNum,
      isToday,
      isPast,
      isFuture,
      count,
      total,
      percentage,
      status,
      completedHabits,
      missedHabits
    };
  };

  // Overall Month Statistics
  let totalMonthCompleted = 0;
  let perfectDays = 0;
  let missedDays = 0;

  for (let i = 1; i <= daysInMonth; i++) {
    const st = getDayStats(i);
    totalMonthCompleted += st.count;
    if (st.percentage === 100) perfectDays += 1;
    if (st.status === 'missed') missedDays += 1;
  }

  const safeDayNum = Math.min(daysInMonth, Math.max(1, selectedDayNum));
  const selectedStats = getDayStats(safeDayNum);

  return (
    <div className="space-y-6">
      
      {/* Month Navigation & Summary Bar */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-5 shadow-xs transition-colors">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-gray-100 dark:border-slate-700 gap-4">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white font-sans">
                  {monthName} {year}
                </h2>
                <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  Monthly Calendar View
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Visual heatmap of completed vs missed days across the entire month
              </p>
            </div>
          </div>

          {/* Month Switcher Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevMonth}
              className="p-2 rounded-lg border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors shadow-2xs"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setCurrentDate(new Date());
                setSelectedDayNum(new Date().getDate());
              }}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
            >
              Current Month
            </button>
            <button
              onClick={handleNextMonth}
              className="p-2 rounded-lg border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors shadow-2xs"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Legend Indicators */}
        <div className="flex flex-wrap items-center gap-4 pt-3 text-xs text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-emerald-600 inline-block shadow-2xs" />
            <span>Completed (80-100%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-emerald-100 dark:bg-emerald-950 border border-emerald-400 inline-block" />
            <span>Partial (40-79%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-rose-100 dark:bg-rose-950/60 border border-rose-400 inline-block" />
            <span>Missed Days (&lt;40%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded ring-2 ring-emerald-500 bg-white dark:bg-slate-800 inline-block" />
            <span>Today's Date</span>
          </div>
        </div>
      </div>

      {/* Main Grid & Selected Day Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Calendar Grid (2 Cols) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-5 shadow-xs transition-colors">
          
          {/* Day of Week Headers */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {weekDayLabels.map((lbl, idx) => (
              <div
                key={lbl}
                className={`text-center py-1.5 text-xs font-bold uppercase tracking-wider ${
                  idx === 0 || idx === 6
                    ? 'text-emerald-700 dark:text-emerald-400'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                {lbl}
              </div>
            ))}
          </div>

          {/* Month Day Cells */}
          <div className="grid grid-cols-7 gap-2">
            {/* Empty padding cells for start of month */}
            {Array.from({ length: firstDayIndex }).map((_, i) => (
              <div key={`empty-${i}`} className="h-16 sm:h-20 rounded-xl bg-gray-50/50 dark:bg-slate-800/40" />
            ))}

            {/* Days in Month */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const stats = getDayStats(dayNum);
              const isSelected = selectedDayNum === dayNum;

              // Cell styles depending on completion status
              let bgStyle = 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-800 dark:text-gray-200';
              let badgeStyle = '';

              if (stats.status === 'completed') {
                bgStyle = 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200';
                badgeStyle = 'bg-emerald-600 text-white';
              } else if (stats.status === 'partial') {
                bgStyle = 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300';
                badgeStyle = 'bg-emerald-200 dark:bg-emerald-800 text-emerald-800 dark:text-emerald-200';
              } else if (stats.status === 'missed') {
                bgStyle = 'bg-rose-50/80 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900 text-rose-900 dark:text-rose-200';
                badgeStyle = 'bg-rose-200 dark:bg-rose-900/60 text-rose-800 dark:text-rose-300';
              } else if (stats.isFuture) {
                bgStyle = 'bg-gray-50/40 dark:bg-slate-800/40 border-gray-100 dark:border-slate-800 text-gray-400';
              }

              if (stats.isToday) {
                bgStyle += ' ring-2 ring-emerald-500 font-bold';
              }

              if (isSelected) {
                bgStyle += ' shadow-md scale-[1.02] ring-2 ring-emerald-600 dark:ring-emerald-400 z-10';
              }

              return (
                <button
                  type="button"
                  key={dayNum}
                  onClick={() => setSelectedDayNum(dayNum)}
                  className={`h-16 sm:h-20 p-2 rounded-xl border flex flex-col justify-between transition-all duration-150 text-left hover:scale-[1.01] ${bgStyle}`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs sm:text-sm font-mono font-semibold">
                      {dayNum}
                    </span>
                    {stats.isToday && (
                      <span className="text-[9px] px-1 py-0.2 rounded font-bold bg-emerald-600 text-white font-mono">
                        TODAY
                      </span>
                    )}
                  </div>

                  {/* Bottom Day Stat Indicator */}
                  {!stats.isFuture && (
                    <div className="w-full flex items-center justify-between text-[10px] font-mono mt-1">
                      <span className={`px-1.5 py-0.2 rounded font-semibold ${badgeStyle}`}>
                        {stats.percentage}%
                      </span>
                      <span className="hidden sm:inline text-gray-500">
                        {stats.count}/{stats.total}
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

        </div>

        {/* Selected Day Breakdown Card (1 Col) */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-5 shadow-xs flex flex-col justify-between transition-colors">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-700">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  Day Inspector
                </span>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-0.5">
                  {monthName} {safeDayNum}, {year}
                </h3>
              </div>
              <div className="text-right">
                <span className="text-xl font-bold font-mono text-emerald-700 dark:text-emerald-400">
                  {selectedStats.percentage}%
                </span>
                <p className="text-[11px] text-gray-500 font-mono">
                  {selectedStats.count}/{selectedStats.total} done
                </p>
              </div>
            </div>

            {/* Completed Habits List */}
            <div className="mt-4">
              <h4 className="text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Completed Habits ({selectedStats.completedHabits.length})</span>
              </h4>
              <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                {selectedStats.completedHabits.length === 0 ? (
                  <p className="text-xs text-gray-400 italic">No habits completed on this date.</p>
                ) : (
                  selectedStats.completedHabits.map(h => (
                    <div
                      key={h.id}
                      className="px-2.5 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between text-xs font-medium text-gray-800 dark:text-gray-200"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <HabitIcon name={h.icon} className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="truncate">{h.name}</span>
                      </div>
                      <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-mono">
                        🔥 {h.streak}d
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Missed Habits List */}
            <div className="mt-4">
              <h4 className="text-xs font-bold text-rose-800 dark:text-rose-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                <XCircle className="w-3.5 h-3.5 text-rose-600" />
                <span>Missed Habits ({selectedStats.missedHabits.length})</span>
              </h4>
              <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                {selectedStats.missedHabits.length === 0 ? (
                  <p className="text-xs text-emerald-600 font-medium">All habits were completed! 🌟</p>
                ) : (
                  selectedStats.missedHabits.map(h => (
                    <div
                      key={h.id}
                      className="px-2.5 py-1.5 rounded-lg bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 flex items-center justify-between text-xs font-medium text-gray-800 dark:text-gray-300"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <HabitIcon name={h.icon} className="w-3.5 h-3.5 text-rose-500" />
                        <span className="truncate">{h.name}</span>
                      </div>
                      <span className="text-[10px] text-rose-600 dark:text-rose-400 font-mono">
                        Goal: {h.targetDays || 7}d
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

          <div className="mt-4 pt-3 border-t border-gray-100 dark:border-slate-700 text-xs text-gray-500 font-mono flex items-center justify-between">
            <span>Perfect Days: {perfectDays}</span>
            <span>Missed Days: {missedDays}</span>
          </div>
        </div>

      </div>

    </div>
  );
}
