// Categories with Google Sheets color palettes and badges
export const CATEGORIES = {
  health: {
    id: 'health',
    name: 'Health & Wellness',
    color: 'emerald',
    badge: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    iconBg: 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300',
    accent: '#10B981'
  },
  fitness: {
    id: 'fitness',
    name: 'Fitness & Sport',
    color: 'teal',
    badge: 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800',
    iconBg: 'bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300',
    accent: '#14B8A6'
  },
  learning: {
    id: 'learning',
    name: 'Learning & Growth',
    color: 'amber',
    badge: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    iconBg: 'bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300',
    accent: '#F59E0B'
  },
  productivity: {
    id: 'productivity',
    name: 'Productivity & Work',
    color: 'blue',
    badge: 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    iconBg: 'bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300',
    accent: '#3B82F6'
  },
  mindfulness: {
    id: 'mindfulness',
    name: 'Mindfulness & Mind',
    color: 'purple',
    badge: 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
    iconBg: 'bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300',
    accent: '#8B5CF6'
  }
};

export const CATEGORIES_LIST = Object.values(CATEGORIES);

export function getCategoryDef(categoryId) {
  return CATEGORIES[categoryId] || CATEGORIES.productivity;
}
