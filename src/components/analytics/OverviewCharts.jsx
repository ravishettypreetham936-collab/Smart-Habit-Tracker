import React from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { useHabits } from '../../context/HabitContext';
import { CATEGORIES } from '../../constants/categories';
import { getDayCompletionRate, getHabitWeeklyCompletion } from '../../utils/dateUtils';
import {
  Flame,
  CheckCircle2,
  Clock,
  Sparkles,
  Trophy,
  Target,
  Check,
  Calendar
} from 'lucide-react';
import { HabitIcon } from '../../utils/iconMap';
import CircularProgress from './CircularProgress';

export default function OverviewCharts() {
  const { habits, weekDays, metrics, toggleHabitDay } = useHabits();

  // Find today's day key
  const todayDay = weekDays.find((d) => d.isToday) || weekDays[0];
  const todayKey = todayDay?.key || 'mon';

  // 1. Daily Habit Completion Chart Data (Monday to Sunday)
  const dailyCompletionData = weekDays.map((day) => {
    const stats = getDayCompletionRate(habits, day.key);
    return {
      day: day.name,
      short: day.short,
      completed: stats.completed,
      total: stats.total,
      percentage: stats.percentage,
      isToday: day.isToday
    };
  });

  // 2. Weekly Progress Bar Chart Data (Each Habit's Weekly Completion %)
  const weeklyHabitProgressData = habits.map((habit) => {
    const { completedCount, percentage } = getHabitWeeklyCompletion(habit.weeklyLogs);
    return {
      name: habit.name.length > 13 ? `${habit.name.slice(0, 11)}...` : habit.name,
      fullName: habit.name,
      category: habit.category,
      percentage,
      completedCount,
      targetDays: habit.targetDays || 7,
      streak: habit.streak || 0,
      bestStreak: habit.bestStreak || habit.streak || 0
    };
  });

  // 3. Ranked Habits for Best and Least Performing Habits
  const rankedHabits = [...habits]
    .map((h) => {
      const { percentage, completedCount } = getHabitWeeklyCompletion(h.weeklyLogs);
      return {
        ...h,
        weeklyPercentage: percentage,
        completedDays: completedCount
      };
    })
    .sort((a, b) => {
      if (b.weeklyPercentage !== a.weeklyPercentage) {
        return b.weeklyPercentage - a.weeklyPercentage;
      }
      return (b.streak || 0) - (a.streak || 0);
    });

  const bestHabit = rankedHabits.length > 0 ? rankedHabits[0] : null;
  const leastHabit = rankedHabits.length > 1 ? rankedHabits[rankedHabits.length - 1] : null;

  // 4. Completed and Remaining Habits for Today
  const todayCompletedList = metrics.todayCompletedHabits || [];
  const todayRemainingList = metrics.todayRemainingHabits || [];

  return (
    <div className="space-y-6">
      
      {/* ─────────────────────────────────────────────────────────────
          SECTION 1: SEPARATE CIRCULAR PROGRESS INDICATORS (Daily, Weekly, Monthly)
      ───────────────────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-5 shadow-xs transition-colors">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 mb-4 border-b border-gray-100 dark:border-slate-700 gap-2">
          <div>
            <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              <span>Progress Circles Overview</span>
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Real-time circular progress indicators across daily, weekly, and monthly tracking horizons
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            Live Calculations
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-gray-100 dark:divide-slate-700">
          
          {/* Circle 1: Daily Progress */}
          <div className="flex flex-col items-center text-center pt-2 md:pt-0">
            <CircularProgress
              percentage={metrics.todayRate}
              size={135}
              strokeWidth={11}
              accentColor="#10B981"
              trackColor="#E6F4EA"
              title="Daily Progress"
              subtitle="Today"
            />
            <div className="mt-1 flex items-center gap-2 text-xs font-medium text-gray-600 dark:text-gray-300 font-mono">
              <span className="text-emerald-700 dark:text-emerald-400 font-bold">{metrics.todayCompleted} completed</span>
              <span>•</span>
              <span className="text-amber-600 dark:text-amber-400 font-bold">{metrics.todayPending} pending</span>
            </div>
            <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">
              Target: {metrics.todayTotal} habits for today
            </p>
          </div>

          {/* Circle 2: Overall Weekly Progress */}
          <div className="flex flex-col items-center text-center pt-4 md:pt-0">
            <CircularProgress
              percentage={metrics.overallPercentage}
              size={135}
              strokeWidth={11}
              accentColor="#059669"
              trackColor="#E6F4EA"
              title="Overall Weekly Progress"
              subtitle="This Week"
            />
            <div className="mt-1 flex items-center gap-2 text-xs font-medium text-gray-600 dark:text-gray-300 font-mono">
              <span className="text-emerald-800 dark:text-emerald-400 font-bold">{metrics.totalCompletedChecks} checks done</span>
              <span>•</span>
              <span className="text-gray-500 dark:text-gray-400">{metrics.totalPendingChecks} left</span>
            </div>
            <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">
              Total weekly volume: {metrics.totalPossibleChecks} tasks
            </p>
          </div>

          {/* Circle 3: Monthly Progress */}
          <div className="flex flex-col items-center text-center pt-4 md:pt-0">
            <CircularProgress
              percentage={metrics.monthlyPercentage}
              size={135}
              strokeWidth={11}
              accentColor="#047857"
              trackColor="#E6F4EA"
              title="Monthly Progress"
              subtitle="Projected"
            />
            <div className="mt-1 flex items-center gap-2 text-xs font-medium text-gray-600 dark:text-gray-300 font-mono">
              <span className="text-emerald-900 dark:text-emerald-300 font-bold">Month Momentum</span>
              <span>•</span>
              <span className="text-amber-700 dark:text-amber-400 font-bold">🔥 {metrics.bestStreak}d streak</span>
            </div>
            <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">
              Based on weekly adherence & streak consistency
            </p>
          </div>

        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 2: BEST & LEAST PERFORMING HABITS HIGHLIGHT
      ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Card: Best-Performing Habit */}
        {bestHabit && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-emerald-200 dark:border-emerald-800 p-5 shadow-xs relative overflow-hidden transition-colors">
            <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2 w-24 h-24 bg-emerald-50 dark:bg-emerald-950/40 rounded-full opacity-50 pointer-events-none" />
            
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center shadow-inner">
                  <Trophy className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                    🏆 Best-Performing Habit
                  </span>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white mt-1 flex items-center gap-2">
                    <span>{bestHabit.name}</span>
                    <HabitIcon name={bestHabit.icon} className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  </h3>
                </div>
              </div>

              <div className="text-right">
                <span className="text-2xl font-bold font-mono text-emerald-700 dark:text-emerald-400">
                  {bestHabit.weeklyPercentage}%
                </span>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 font-mono">
                  {bestHabit.completedDays}/7 days
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 dark:border-slate-700 flex items-center justify-between text-xs text-gray-600 dark:text-gray-300">
              <span className="flex items-center gap-1 font-mono text-amber-700 dark:text-amber-400 font-semibold bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800">
                <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                {bestHabit.streak || 0}d Streak (Best: {bestHabit.bestStreak || bestHabit.streak || 0}d)
              </span>
              <span className="text-emerald-700 dark:text-emerald-400 font-medium">
                Highest consistency this week!
              </span>
            </div>
          </div>
        )}

        {/* Card: Least-Performing Habit */}
        {leastHabit ? (
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-amber-200 dark:border-amber-800 p-5 shadow-xs relative overflow-hidden transition-colors">
            <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2 w-24 h-24 bg-amber-50 dark:bg-amber-950/40 rounded-full opacity-50 pointer-events-none" />

            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 flex items-center justify-center shadow-inner">
                  <Target className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800">
                    🎯 Needs Attention (Least Performing)
                  </span>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white mt-1 flex items-center gap-2">
                    <span>{leastHabit.name}</span>
                    <HabitIcon name={leastHabit.icon} className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  </h3>
                </div>
              </div>

              <div className="text-right">
                <span className="text-2xl font-bold font-mono text-amber-700 dark:text-amber-400">
                  {leastHabit.weeklyPercentage}%
                </span>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 font-mono">
                  {leastHabit.completedDays}/7 days
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 dark:border-slate-700 flex items-center justify-between text-xs text-gray-600 dark:text-gray-300">
              <span className="font-mono text-gray-500 dark:text-gray-400">
                Weekly Target: {leastHabit.targetDays || 7} days
              </span>
              <span className="text-amber-700 dark:text-amber-400 font-medium">
                Focus on this habit today!
              </span>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-5 shadow-xs flex items-center justify-center text-xs text-gray-500">
            Add more habits to view performance comparison.
          </div>
        )}

      </div>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 3: RECHARTS GRAPHS
      ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Weekly Progress Bar Chart (Per Habit) */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-5 shadow-xs transition-colors">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white text-sm">
                Weekly Progress by Habit
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Weekly completion percentage for each habit
              </p>
            </div>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              Bar Chart
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={weeklyHabitProgressData}
                margin={{ top: 10, right: 10, left: -20, bottom: 25 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.5} />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: '#64748B' }}
                  angle={-25}
                  textAnchor="end"
                  interval={0}
                  stroke="#94A3B8"
                />
                <YAxis
                  unit="%"
                  domain={[0, 100]}
                  tick={{ fontSize: 11, fill: '#64748B' }}
                  stroke="#94A3B8"
                />
                <Tooltip
                  formatter={(val, name, item) => [
                    `${val}% (${item.payload.completedCount}/7 days completed)`,
                    'Weekly Adherence'
                  ]}
                  labelFormatter={(name, items) => {
                    const item = items && items[0] ? items[0].payload : null;
                    return item ? item.fullName : name;
                  }}
                  contentStyle={{
                    backgroundColor: '#1E293B',
                    color: '#F8FAFC',
                    borderRadius: '8px',
                    border: '1px solid #334155',
                    fontSize: '12px'
                  }}
                />
                <ReferenceLine y={80} stroke="#10B981" strokeDasharray="3 3" strokeOpacity={0.6} />
                <Bar
                  dataKey="percentage"
                  fill="#10B981"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={45}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Daily Habit Completion Chart (Mon - Sun) */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-5 shadow-xs transition-colors">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white text-sm">
                Daily Habit Completion Velocity
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Number and rate of habits completed from Monday to Sunday
              </p>
            </div>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              Daily Trend
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={dailyCompletionData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="emeraldAnalyticsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.5} />
                <XAxis
                  dataKey="short"
                  tick={{ fontSize: 12, fill: '#64748B' }}
                  stroke="#94A3B8"
                />
                <YAxis
                  unit="%"
                  domain={[0, 100]}
                  tick={{ fontSize: 11, fill: '#64748B' }}
                  stroke="#94A3B8"
                />
                <Tooltip
                  formatter={(val, name, item) => [
                    `${val}% (${item.payload.completed} of ${item.payload.total} habits)`,
                    'Daily Completion'
                  ]}
                  contentStyle={{
                    backgroundColor: '#1E293B',
                    color: '#F8FAFC',
                    borderRadius: '8px',
                    border: '1px solid #334155',
                    fontSize: '12px'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="percentage"
                  stroke="#059669"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#emeraldAnalyticsGradient)"
                  dot={{ r: 4, fill: '#059669', strokeWidth: 2, stroke: '#FFFFFF' }}
                  activeDot={{ r: 6, fill: '#10B981' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 4: COMPLETED HABITS & REMAINING HABITS BREAKDOWN
      ───────────────────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-5 shadow-xs transition-colors">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 mb-4 border-b border-gray-100 dark:border-slate-700 gap-2">
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white text-sm flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Today's Habits Breakdown ({todayDay?.name || 'Today'})</span>
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Interactive split showing completed and pending habits for today
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono font-medium">
            <span className="text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
              Completed: {todayCompletedList.length}
            </span>
            <span className="text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800">
              Remaining: {todayRemainingList.length}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          
          {/* Panel 1: Completed Habits */}
          <div className="rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/30 dark:bg-emerald-950/20 p-4">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-emerald-200/60 dark:border-emerald-800">
              <span className="text-xs font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5 uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Completed Habits ({todayCompletedList.length})</span>
              </span>
              <span className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400">
                {Math.round((todayCompletedList.length / (habits.length || 1)) * 100)}% Done
              </span>
            </div>

            {todayCompletedList.length === 0 ? (
              <div className="py-8 text-center text-gray-400 text-xs">
                No habits completed yet today. Tap a habit on the right to complete it!
              </div>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {todayCompletedList.map((habit) => {
                  const categoryDef = CATEGORIES[habit.category] || CATEGORIES.productivity;
                  return (
                    <div
                      key={habit.id}
                      className="bg-white dark:bg-slate-800 rounded-lg p-2.5 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between gap-2 shadow-2xs hover:border-emerald-300 transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 ${categoryDef.iconBg} ${categoryDef.badge}`}>
                          <HabitIcon name={habit.icon} className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">
                            {habit.name}
                          </p>
                          <span className="text-[10px] text-gray-400 dark:text-gray-500 font-mono">
                            Streak: {habit.streak || 0}d 🔥
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => toggleHabitDay(habit.id, todayKey)}
                        title="Click to unmark"
                        className="px-2 py-1 rounded bg-emerald-600 text-white text-[11px] font-medium flex items-center gap-1 hover:bg-emerald-700 transition-colors shadow-2xs"
                      >
                        <Check className="w-3 h-3 stroke-[3]" />
                        <span>Completed</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Panel 2: Remaining Habits */}
          <div className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50/20 dark:bg-amber-950/20 p-4">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-amber-200/60 dark:border-amber-800">
              <span className="text-xs font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5 uppercase tracking-wider">
                <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>Remaining Habits ({todayRemainingList.length})</span>
              </span>
              <span className="text-[11px] font-mono text-amber-700 dark:text-amber-400">
                {todayRemainingList.length} to go
              </span>
            </div>

            {todayRemainingList.length === 0 ? (
              <div className="py-8 text-center text-emerald-700 dark:text-emerald-400 font-semibold text-xs flex flex-col items-center gap-1">
                <Sparkles className="w-6 h-6 text-emerald-600 dark:text-emerald-400 animate-bounce" />
                <span>All habits for today are completed! Great job! 🎉</span>
              </div>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {todayRemainingList.map((habit) => {
                  const categoryDef = CATEGORIES[habit.category] || CATEGORIES.productivity;
                  return (
                    <div
                      key={habit.id}
                      className="bg-white dark:bg-slate-800 rounded-lg p-2.5 border border-gray-200 dark:border-slate-700 flex items-center justify-between gap-2 shadow-2xs hover:border-emerald-300 transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 ${categoryDef.iconBg} ${categoryDef.badge}`}>
                          <HabitIcon name={habit.icon} className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">
                            {habit.name}
                          </p>
                          <span className="text-[10px] text-gray-400 dark:text-gray-500 font-mono">
                            Goal: {habit.targetDays || 7}d/week
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => toggleHabitDay(habit.id, todayKey)}
                        title="Click to complete for today"
                        className="px-2.5 py-1 rounded bg-gray-100 dark:bg-slate-700 hover:bg-emerald-600 hover:text-white text-gray-700 dark:text-gray-200 text-[11px] font-medium transition-colors border border-gray-200 dark:border-slate-600 hover:border-emerald-600 shadow-2xs"
                      >
                        Mark Done
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </div>

    </div>
  );
}
