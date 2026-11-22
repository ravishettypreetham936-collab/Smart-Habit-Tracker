import React from 'react';
import { Check, Flame, Trophy, Target, Edit2, Trash2 } from 'lucide-react';
import { useHabits } from '../../context/HabitContext';
import { CATEGORIES } from '../../constants/categories';
import { HabitIcon } from '../../utils/iconMap';
import { getHabitWeeklyCompletion } from '../../utils/dateUtils';

export default function MobileHabitCards() {
  const {
    filteredHabits,
    weekDays,
    toggleHabitDay,
    updateHabitGoal,
    setEditingHabit,
    setIsModalOpen,
    promptDeleteHabit
  } = useHabits();

  if (filteredHabits.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl p-8 text-center border border-gray-200 dark:border-slate-700 text-gray-400">
        No habits found.
      </div>
    );
  }

  return (
    <div className="space-y-3 md:hidden">
      {filteredHabits.map((habit) => {
        const categoryDef = CATEGORIES[habit.category] || CATEGORIES.productivity;
        const { completedCount, percentage } = getHabitWeeklyCompletion(habit.weeklyLogs);
        const targetDays = habit.targetDays || 7;
        const goalAchievementRate = Math.round((completedCount / targetDays) * 100);
        const isGoalMet = completedCount >= targetDays;
        const bestStreak = habit.bestStreak || habit.streak || 0;

        return (
          <div
            key={habit.id}
            className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-4 shadow-xs transition-colors"
          >
            {/* Top Row: Habit Name, Icon & Actions */}
            <div className="flex items-start justify-between gap-2 pb-3 border-b border-gray-100 dark:border-slate-700">
              <div className="flex items-center gap-2.5">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${categoryDef.iconBg} ${categoryDef.badge}`}>
                  <HabitIcon name={habit.icon} className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm leading-tight flex items-center gap-1.5">
                    <span>{habit.name}</span>
                    {isGoalMet && <span>🌟</span>}
                  </h4>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded border ${categoryDef.badge}`}>
                      {categoryDef.name.split(' ')[0]}
                    </span>
                    <span className="text-[11px] font-mono text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-0.5">
                      <Flame className="w-3 h-3 fill-amber-500 text-amber-500" />
                      {habit.streak || 0}d
                    </span>
                    <span className="text-[10px] font-mono text-gray-400 dark:text-gray-500 flex items-center gap-0.5">
                      <Trophy className="w-2.5 h-2.5 text-amber-500" />
                      Best: {bestStreak}d
                    </span>
                  </div>
                </div>
              </div>

              {/* Edit / Delete Buttons */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    setEditingHabit(habit);
                    setIsModalOpen(true);
                  }}
                  title="Edit Habit"
                  className="p-1.5 text-gray-400 hover:text-emerald-700 dark:hover:text-emerald-400 rounded-md"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => promptDeleteHabit(habit.id, habit.name)}
                  title="Delete Habit"
                  className="p-1.5 text-gray-400 hover:text-rose-700 dark:hover:text-rose-400 rounded-md"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Weekly Days Checkboxes Row */}
            <div className="pt-3">
              <div className="grid grid-cols-7 gap-1.5">
                {weekDays.map((day) => {
                  const isChecked = Boolean(habit.weeklyLogs && habit.weeklyLogs[day.key]);

                  return (
                    <button
                      key={day.key}
                      onClick={() => toggleHabitDay(habit.id, day.key)}
                      className={`flex flex-col items-center py-1.5 rounded-lg border transition-all ${
                        isChecked
                          ? 'bg-emerald-600 border-emerald-600 text-white shadow-2xs'
                          : day.isToday
                          ? 'bg-emerald-50/70 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300 font-semibold'
                          : 'bg-gray-50 dark:bg-slate-700 border-gray-200 dark:border-slate-600 text-gray-600 dark:text-gray-300'
                      }`}
                    >
                      <span className="text-[9px] font-bold uppercase tracking-wider">
                        {day.short[0]}
                      </span>
                      <span className="text-[10px] font-mono">
                        {day.dateNum}
                      </span>
                      <div className="mt-1">
                        {isChecked ? (
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        ) : (
                          <div className="w-3.5 h-3.5 rounded-full border border-gray-300 dark:border-slate-500" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Progress Bar Footer with Goal Achievement */}
              <div className="mt-3 flex items-center justify-between text-xs font-mono text-gray-500 dark:text-gray-400">
                <span>Week: {percentage}%</span>
                <span className={isGoalMet ? 'text-emerald-600 dark:text-emerald-400 font-bold' : ''}>
                  Goal: {goalAchievementRate}% ({completedCount}/{targetDays}d)
                </span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-slate-700 rounded-full h-1.5 mt-1 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${isGoalMet ? 'bg-emerald-500' : 'bg-emerald-600'}`}
                  style={{ width: `${Math.min(100, goalAchievementRate)}%` }}
                />
              </div>
            </div>

          </div>
        );
      })}
    </div>
  );
}
