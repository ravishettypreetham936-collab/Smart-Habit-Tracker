import React, { useState, useEffect } from 'react';
import { X, Sparkles, Target, Tag } from 'lucide-react';
import { useHabits } from '../../context/HabitContext';
import { CATEGORIES } from '../../constants/categories';
import { AVAILABLE_ICONS, HabitIcon } from '../../utils/iconMap';

export default function HabitModal() {
  const { isModalOpen, setIsModalOpen, editingHabit, addHabit, updateHabit } = useHabits();

  const [name, setName] = useState('');
  const [category, setCategory] = useState('productivity');
  const [icon, setIcon] = useState('Sparkles');
  const [targetDays, setTargetDays] = useState(7);

  useEffect(() => {
    if (editingHabit) {
      setName(editingHabit.name || '');
      setCategory(editingHabit.category || 'productivity');
      setIcon(editingHabit.icon || 'Sparkles');
      setTargetDays(editingHabit.targetDays || 7);
    } else {
      setName('');
      setCategory('productivity');
      setIcon('Sparkles');
      setTargetDays(7);
    }
  }, [editingHabit, isModalOpen]);

  if (!isModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingHabit) {
      updateHabit(editingHabit.id, {
        name: name.trim(),
        category,
        icon,
        targetDays: Number(targetDays)
      });
    } else {
      addHabit({
        name: name.trim(),
        category,
        icon,
        targetDays: Number(targetDays)
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full border border-gray-200 dark:border-slate-700 shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-150 transition-colors">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white font-sans">
              {editingHabit ? 'Edit Habit' : 'Create New Habit'}
            </h3>
          </div>
          <button
            onClick={() => setIsModalOpen(false)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          
          {/* Habit Name */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
              Habit Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 10,000 Steps, Journaling, Duolingo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-slate-700 transition-all text-gray-900 dark:text-white"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
              Category
            </label>
            <div className="grid grid-cols-2 gap-2">
              {Object.values(CATEGORIES).map((cat) => (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg border text-left transition-all ${
                    category === cat.id
                      ? `${cat.badge} ring-2 ring-emerald-500/40 font-semibold`
                      : 'border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-700/60 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
                  }`}
                >
                  <Tag className="w-3.5 h-3.5 opacity-70" />
                  <span className="truncate">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Weekly Goal Frequency */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span>Weekly Goal Target:</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-mono font-bold">
                {targetDays} days / week
              </span>
            </label>
            <input
              type="range"
              min="1"
              max="7"
              value={targetDays}
              onChange={(e) => setTargetDays(Number(e.target.value))}
              className="w-full accent-emerald-600"
            />
            <div className="flex justify-between text-[11px] text-gray-400 dark:text-gray-500 font-mono">
              <span>1 day/wk</span>
              <span>Daily (7 days)</span>
            </div>
          </div>

          {/* Icon Selector */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
              Choose Icon
            </label>
            <div className="grid grid-cols-5 gap-2 max-h-32 overflow-y-auto p-1 border border-gray-100 dark:border-slate-700 rounded-lg bg-gray-50/50 dark:bg-slate-700/40">
              {AVAILABLE_ICONS.map((iconName) => (
                <button
                  type="button"
                  key={iconName}
                  onClick={() => setIcon(iconName)}
                  className={`p-2 rounded-lg flex items-center justify-center transition-all ${
                    icon === iconName
                      ? 'bg-emerald-600 text-white shadow-xs scale-105'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-slate-600 hover:text-emerald-700 dark:hover:text-emerald-400'
                  }`}
                >
                  <HabitIcon name={iconName} className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-gray-100 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs sm:text-sm font-semibold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow-sm focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1"
            >
              {editingHabit ? 'Save Changes' : 'Create Habit'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
