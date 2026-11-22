import React from 'react';
import {
  TrendingUp,
  CheckCircle2,
  Clock,
  Flame,
  Award
} from 'lucide-react';
import { useHabits } from '../../context/HabitContext';

export default function StatsRibbon() {
  const { metrics, habits } = useHabits();

  const cards = [
    {
      id: 'overall-completion',
      title: 'Weekly Completion',
      value: `${metrics.overallPercentage}%`,
      subtitle: `${metrics.totalCompletedChecks} of ${metrics.totalPossibleChecks} tasks completed`,
      icon: TrendingUp,
      color: 'emerald',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-700',
      borderColor: 'border-emerald-200',
      progress: metrics.overallPercentage,
      progressColor: 'bg-emerald-500'
    },
    {
      id: 'total-completed',
      title: 'Total Completed Habits',
      value: `${metrics.todayCompleted} Today`,
      subtitle: `${metrics.totalCompletedChecks} total completed this week`,
      icon: CheckCircle2,
      color: 'teal',
      bgColor: 'bg-teal-50',
      textColor: 'text-teal-700',
      borderColor: 'border-teal-200',
      progress: metrics.todayRate,
      progressColor: 'bg-teal-500'
    },
    {
      id: 'total-pending',
      title: 'Total Pending Habits',
      value: `${metrics.todayPending} Remaining`,
      subtitle: `${metrics.totalPendingChecks} total pending this week`,
      icon: Clock,
      color: 'amber',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-700',
      borderColor: 'border-amber-200',
      progress: habits.length > 0 ? Math.round((metrics.todayPending / habits.length) * 100) : 0,
      progressColor: 'bg-amber-500'
    },
    {
      id: 'top-streak',
      title: 'Best Active Streak',
      value: `${metrics.bestStreak} Days`,
      subtitle: `${metrics.perfectDaysCount} perfect days with 100% adherence`,
      icon: Flame,
      color: 'blue',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      borderColor: 'border-blue-200',
      progress: Math.min(100, Math.round((metrics.bestStreak / 30) * 100)),
      progressColor: 'bg-blue-500'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              className={`bg-white dark:bg-slate-800 rounded-xl p-4 border ${card.borderColor} dark:border-slate-700 shadow-2xs hover:shadow-xs transition-all relative overflow-hidden`}
            >
              {/* Subtle accent bar on top */}
              <div
                className={`absolute top-0 left-0 right-0 h-1 ${card.bgColor.replace('50', '500')}`}
              />

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {card.title}
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mt-0.5 font-mono">
                    {card.value}
                  </p>
                </div>
                <div className={`w-10 h-10 rounded-xl ${card.bgColor} dark:bg-slate-700/80 ${card.textColor} dark:text-emerald-400 flex items-center justify-center shrink-0 shadow-inner`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              {/* Dynamic Progress Bar */}
              <div className="mt-3">
                <div className="w-full bg-gray-100 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${card.progressColor}`}
                    style={{ width: `${card.progress}%` }}
                  />
                </div>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1.5 font-medium truncate">
                  {card.subtitle}
                </p>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}
