import React, { useState } from 'react';
import {
  Check,
  Flame,
  Edit2,
  Trash2,
  Info,
  CheckCircle,
  X,
  Pencil,
  Trophy,
  Target,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { useHabits } from '../../context/HabitContext';
import { CATEGORIES } from '../../constants/categories';
import { HabitIcon } from '../../utils/iconMap';
import { getHabitWeeklyCompletion, getDayCompletionRate } from '../../utils/dateUtils';

export default function HabitTable() {
  const {
    filteredHabits,
    habits,
    weekDays,
    activeHabitId,
    setActiveHabitId,
    toggleHabitDay,
    renameHabit,
    updateHabitGoal,
    setEditingHabit,
    setIsModalOpen,
    promptDeleteHabit,
    metrics
  } = useHabits();

  // State for inline name editing
  const [editingNameId, setEditingNameId] = useState(null);
  const [inlineNameVal, setInlineNameVal] = useState('');

  const startInlineEdit = (habit, e) => {
    e.stopPropagation();
    setEditingNameId(habit.id);
    setInlineNameVal(habit.name);
  };

  const saveInlineEdit = (habitId, e) => {
    if (e) e.stopPropagation();
    if (inlineNameVal.trim()) {
      renameHabit(habitId, inlineNameVal.trim());
    }
    setEditingNameId(null);
  };

  const cancelInlineEdit = (e) => {
    if (e) e.stopPropagation();
    setEditingNameId(null);
  };

  const handleKeyDownInline = (e, habitId) => {
    if (e.key === 'Enter') {
      saveInlineEdit(habitId);
    } else if (e.key === 'Escape') {
      cancelInlineEdit();
    }
  };

  const handleOpenEditModal = (habit, e) => {
    e.stopPropagation();
    setEditingHabit(habit);
    setIsModalOpen(true);
  };

  const handleDeleteHabit = (habit, e) => {
    e.stopPropagation();
    promptDeleteHabit(habit.id, habit.name);
  };

  const handleCycleGoal = (habit, e) => {
    e.stopPropagation();
    const current = habit.targetDays || 7;
    const next = current >= 7 ? 1 : current + 1;
    updateHabitGoal(habit.id, next);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-xs overflow-hidden transition-colors">
      
      {/* Table Top Controls & Info Bar */}
      <div className="px-5 py-3.5 bg-gray-50/80 dark:bg-slate-800/80 border-b border-gray-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
          <span>Interactive Weekly Habit Grid</span>
          <span className="text-gray-400 dark:text-gray-600">|</span>
          <span className="text-gray-500 dark:text-gray-400 font-mono">
            {filteredHabits.length} of {habits.length} habits
          </span>
        </div>
        <div className="text-gray-500 dark:text-gray-400 text-xs flex items-center gap-1.5 hidden sm:flex">
          <Info className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Click checkboxes to toggle • Click goal pill to adjust target • Click name to edit</span>
        </div>
      </div>

      {/* Spreadsheet Table Container */}
      <div className="overflow-x-auto relative">
        <table className="w-full text-left border-collapse min-w-[980px]">
          
          {/* Header Row */}
          <thead>
            <tr className="bg-gray-100/80 dark:bg-slate-700/60 border-b border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 text-xs font-semibold select-none">
              
              {/* Row Number Column */}
              <th className="w-10 py-3 px-2 text-center text-gray-400 dark:text-gray-500 font-mono text-[11px] border-r border-gray-200 dark:border-slate-700">
                #
              </th>

              {/* Habit Name Column (Sticky left) */}
              <th className="py-3 px-4 min-w-[250px] max-w-[300px] sticky left-0 z-20 bg-gray-100/95 dark:bg-slate-800/95 backdrop-blur-xs border-r border-gray-200 dark:border-slate-700 shadow-[2px_0_5px_rgba(0,0,0,0.03)]">
                <div className="flex items-center justify-between">
                  <span>HABIT NAME</span>
                  <span className="text-[10px] text-gray-400 dark:text-gray-500 font-normal">Goal & Category</span>
                </div>
              </th>

              {/* Streaks Column (Current & Longest) */}
              <th className="py-3 px-3 w-32 text-center border-r border-gray-200 dark:border-slate-700">
                STREAK / BEST
              </th>

              {/* Day Columns (Monday to Sunday) */}
              {weekDays.map((day) => (
                <th
                  key={day.key}
                  className={`py-3 px-2 text-center border-r border-gray-200 dark:border-slate-700 min-w-[76px] transition-colors ${
                    day.isToday
                      ? 'bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 border-b-2 border-b-emerald-600'
                      : day.isWeekend
                      ? 'bg-gray-50/60 dark:bg-slate-800/40'
                      : ''
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <span className="text-[11px] uppercase tracking-wider font-bold">
                      {day.short}
                    </span>
                    <span className="text-[11px] font-mono text-gray-500 dark:text-gray-400 font-normal mt-0.5">
                      {day.dateNum} {day.monthShort}
                    </span>
                    {day.isToday && (
                      <span className="mt-1 px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-emerald-600 text-white tracking-widest shadow-2xs">
                        TODAY
                      </span>
                    )}
                  </div>
                </th>
              ))}

              {/* Goal Achievement & Weekly Progress Column */}
              <th className="py-3 px-4 w-48 text-center border-r border-gray-200 dark:border-slate-700">
                GOAL & PROGRESS
              </th>

              {/* Row Actions */}
              <th className="py-3 px-2 w-16 text-center text-gray-400 dark:text-gray-500 text-[11px]">
                ACTIONS
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-gray-200 dark:divide-slate-700 text-sm">
            {filteredHabits.length === 0 ? (
              <tr>
                <td colSpan={11} className="py-12 text-center text-gray-400 dark:text-gray-500">
                  <p className="text-base font-medium text-gray-600 dark:text-gray-300">No habits match your filter.</p>
                  <p className="text-xs text-gray-400 mt-1">Try clearing your search or add a new habit above.</p>
                </td>
              </tr>
            ) : (
              filteredHabits.map((habit, rowIndex) => {
                const isSelected = habit.id === activeHabitId;
                const isEditingThisName = editingNameId === habit.id;
                const categoryDef = CATEGORIES[habit.category] || CATEGORIES.productivity;
                
                // Weekly Completion & Goal Achievement Calculations
                const { completedCount, percentage } = getHabitWeeklyCompletion(habit.weeklyLogs);
                const targetDays = habit.targetDays || 7;
                const goalAchievementRate = Math.round((completedCount / targetDays) * 100);
                const isGoalMet = completedCount >= targetDays;
                const bestStreak = habit.bestStreak || habit.streak || 0;

                return (
                  <tr
                    key={habit.id}
                    onClick={() => setActiveHabitId(habit.id)}
                    className={`transition-colors cursor-pointer group ${
                      isSelected
                        ? 'bg-emerald-50/40 dark:bg-emerald-950/30 hover:bg-emerald-50/60 dark:hover:bg-emerald-950/40'
                        : rowIndex % 2 === 0
                        ? 'bg-white dark:bg-slate-800 hover:bg-gray-50/80 dark:hover:bg-slate-700/50'
                        : 'bg-[#FCFDFD] dark:bg-slate-800/80 hover:bg-gray-50/80 dark:hover:bg-slate-700/50'
                    }`}
                  >
                    {/* Row Index Number */}
                    <td className="py-3 px-2 text-center text-gray-400 dark:text-gray-500 font-mono text-xs border-r border-gray-200 dark:border-slate-700 select-none">
                      {rowIndex + 1}
                    </td>

                    {/* Habit Name & Category (Sticky Column with Inline Edit) */}
                    <td className={`py-3 px-4 sticky left-0 z-10 border-r border-gray-200 dark:border-slate-700 shadow-[2px_0_5px_rgba(0,0,0,0.03)] transition-colors ${
                      isSelected
                        ? 'bg-emerald-50/90 dark:bg-slate-800/95 backdrop-blur-xs'
                        : rowIndex % 2 === 0
                        ? 'bg-white dark:bg-slate-800'
                        : 'bg-[#FCFDFD] dark:bg-slate-800'
                    }`}>
                      <div className="flex items-center gap-3">
                        {/* Category Icon */}
                        <div
                          className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border shadow-2xs ${categoryDef.iconBg} ${categoryDef.badge}`}
                        >
                          <HabitIcon name={habit.icon} className="w-4 h-4" />
                        </div>

                        {/* Name Section with Inline Edit Capability */}
                        <div className="min-w-0 flex-1">
                          {isEditingThisName ? (
                            <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                              <input
                                type="text"
                                autoFocus
                                value={inlineNameVal}
                                onChange={(e) => setInlineNameVal(e.target.value)}
                                onKeyDown={(e) => handleKeyDownInline(e, habit.id)}
                                className="w-full px-2 py-1 text-xs font-semibold text-gray-900 bg-white border-2 border-emerald-500 rounded-md shadow-xs focus:outline-none"
                              />
                              <button
                                onClick={(e) => saveInlineEdit(habit.id, e)}
                                title="Save"
                                className="p-1 rounded bg-emerald-600 text-white hover:bg-emerald-700"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={cancelInlineEdit}
                                title="Cancel"
                                className="p-1 rounded bg-gray-200 text-gray-600 hover:bg-gray-300"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 group/edit">
                              <span className="font-semibold text-gray-900 dark:text-white truncate text-sm">
                                {habit.name}
                              </span>
                              <button
                                onClick={(e) => startInlineEdit(habit, e)}
                                title="Click to rename habit"
                                className="opacity-0 group-hover/edit:opacity-100 p-0.5 text-gray-400 hover:text-emerald-700 transition-opacity"
                              >
                                <Pencil className="w-3 h-3" />
                              </button>
                              {isGoalMet && (
                                <span title="Weekly Goal Met! 🎉" className="text-xs">
                                  🌟
                                </span>
                              )}
                            </div>
                          )}

                          {/* Category Tag & Clickable Goal Setter */}
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span
                              className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold border ${categoryDef.badge}`}
                            >
                              {categoryDef.name.split(' ')[0]}
                            </span>
                            
                            {/* Clickable Goal Adjuster Pill */}
                            <button
                              type="button"
                              onClick={(e) => handleCycleGoal(habit, e)}
                              title="Click to cycle goal target (1 to 7 days)"
                              className="inline-flex items-center gap-1 text-[11px] font-mono font-medium text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 px-1.5 py-0.2 rounded border border-emerald-200 dark:border-emerald-800 transition-colors"
                            >
                              <Target className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                              <span>Goal: {targetDays}d</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Streak & Longest Streak Counters */}
                    <td className="py-3 px-3 text-center border-r border-gray-200 dark:border-slate-700">
                      <div className="flex flex-col items-center gap-1">
                        <div
                          title={`Current Streak: ${habit.streak || 0} consecutive days`}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold font-mono bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 shadow-2xs"
                        >
                          <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                          <span>{habit.streak || 0}d</span>
                        </div>
                        <div
                          title={`Longest Streak: ${bestStreak} days record`}
                          className="inline-flex items-center gap-1 text-[10px] font-mono text-gray-500 dark:text-gray-400"
                        >
                          <Trophy className="w-3 h-3 text-amber-500" />
                          <span>Best: {bestStreak}d</span>
                        </div>
                      </div>
                    </td>

                    {/* Monday to Sunday Interactive Checkbox Cells */}
                    {weekDays.map((day) => {
                      const isChecked = Boolean(habit.weeklyLogs && habit.weeklyLogs[day.key]);

                      return (
                        <td
                          key={day.key}
                          className={`py-2 px-2 text-center border-r border-gray-200 dark:border-slate-700 transition-colors ${
                            day.isToday
                              ? 'bg-emerald-50/30 dark:bg-emerald-950/20'
                              : day.isWeekend
                              ? 'bg-gray-50/40 dark:bg-slate-800/40'
                              : ''
                          }`}
                        >
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleHabitDay(habit.id, day.key);
                            }}
                            title={`${habit.name} - ${day.name}: ${isChecked ? 'Completed' : 'Click to complete'}`}
                            className={`w-9 h-9 mx-auto rounded-lg flex items-center justify-center transition-all duration-150 transform hover:scale-105 active:scale-95 ${
                              isChecked
                                ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-500/20 dark:ring-emerald-400/30 hover:bg-emerald-700'
                                : 'bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 text-transparent hover:border-emerald-400 hover:bg-emerald-50/40 dark:hover:bg-slate-600 hover:text-emerald-300'
                            }`}
                          >
                            <Check className={`w-5 h-5 stroke-[2.5] transition-transform ${isChecked ? 'scale-100' : 'scale-75'}`} />
                          </button>
                        </td>
                      );
                    })}

                    {/* Goal Achievement & Weekly Completion % */}
                    <td className="py-3 px-4 border-r border-gray-200 dark:border-slate-700">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center justify-between text-xs font-medium">
                          <span className="font-mono text-gray-800 dark:text-gray-200 font-bold">
                            {percentage}% week
                          </span>
                          <span className={`text-[11px] font-mono font-semibold ${isGoalMet ? 'text-emerald-700 dark:text-emerald-400 font-bold' : 'text-gray-500 dark:text-gray-400'}`}>
                            {goalAchievementRate}% goal ({completedCount}/{targetDays}d)
                          </span>
                        </div>
                        <div className="w-full bg-gray-100 dark:bg-slate-700 rounded-full h-2 overflow-hidden border border-gray-200/60 dark:border-slate-600">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              isGoalMet
                                ? 'bg-emerald-500'
                                : goalAchievementRate >= 50
                                ? 'bg-emerald-400'
                                : goalAchievementRate > 0
                                ? 'bg-amber-400'
                                : 'bg-transparent'
                            }`}
                            style={{ width: `${Math.min(100, goalAchievementRate)}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Actions Column (Edit modal & Delete button) */}
                    <td className="py-3 px-2 text-center">
                      <div className="inline-flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => handleOpenEditModal(habit, e)}
                          title="Edit Habit (Name, Category, Goal)"
                          className="p-1 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-slate-700 rounded text-gray-500 dark:text-gray-400 transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => handleDeleteHabit(habit, e)}
                          title="Delete Habit"
                          className="p-1 hover:text-red-700 dark:hover:text-rose-400 hover:bg-red-50 dark:hover:bg-slate-700 rounded text-gray-500 dark:text-gray-400 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                  </tr>
                );
              })
            )}
          </tbody>

          {/* Table Footer: Daily Completion Totals */}
          <tfoot>
            <tr className="bg-emerald-50/60 dark:bg-slate-700/80 border-t-2 border-emerald-600 text-xs font-semibold text-gray-800 dark:text-gray-200">
              
              {/* Corner Cell */}
              <td className="py-3 px-2 text-center text-emerald-800 dark:text-emerald-400 font-mono text-[11px] border-r border-gray-200 dark:border-slate-700">
                ∑
              </td>

              {/* Total Row Label */}
              <td className="py-3 px-4 sticky left-0 z-20 bg-emerald-50/95 dark:bg-slate-800/95 backdrop-blur-xs border-r border-gray-200 dark:border-slate-700 shadow-[2px_0_5px_rgba(0,0,0,0.03)]">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-950 dark:text-emerald-300 uppercase tracking-wider text-[11px]">
                    DAILY COMPLETION
                  </span>
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-mono">
                    =SUM(Checked)
                  </span>
                </div>
              </td>

              {/* Empty streak footer cell */}
              <td className="py-3 px-3 text-center border-r border-gray-200 dark:border-slate-700 text-gray-400">
                —
              </td>

              {/* Daily totals dynamically calculated for Mon - Sun */}
              {weekDays.map((day) => {
                const dayStats = getDayCompletionRate(filteredHabits, day.key);
                return (
                  <td
                    key={day.key}
                    className={`py-2.5 px-2 text-center border-r border-gray-200 dark:border-slate-700 ${
                      day.isToday ? 'bg-emerald-100/60 dark:bg-emerald-950/50 font-bold' : ''
                    }`}
                  >
                    <div className="flex flex-col items-center">
                      <span className="font-mono text-xs font-bold text-gray-900 dark:text-white">
                        {dayStats.percentage}%
                      </span>
                      <span className="text-[10px] text-gray-500 dark:text-gray-400 font-mono">
                        {dayStats.completed}/{dayStats.total}
                      </span>
                      {/* Mini progress bar */}
                      <div className="w-10 bg-gray-200 dark:bg-slate-600 rounded-full h-1 mt-1 overflow-hidden">
                        <div
                          className="bg-emerald-600 dark:bg-emerald-400 h-full rounded-full transition-all duration-300"
                          style={{ width: `${dayStats.percentage}%` }}
                        />
                      </div>
                    </div>
                  </td>
                );
              })}

              {/* Overall Weekly Completion Percentage */}
              <td className="py-3 px-4 border-r border-gray-200 dark:border-slate-700 bg-emerald-100/40 dark:bg-emerald-950/30">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-emerald-800 dark:text-emerald-400 font-medium">Weekly Total:</span>
                  <span className="font-mono text-sm font-bold text-emerald-900 dark:text-emerald-300">
                    {metrics.overallPercentage}%
                  </span>
                </div>
              </td>

              {/* Empty action cell */}
              <td className="py-3 px-2 text-center text-gray-400">
                —
              </td>

            </tr>
          </tfoot>

        </table>
      </div>

    </div>
  );
}
