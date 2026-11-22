import React from 'react';
import {
  Sun,
  Dumbbell,
  BookOpen,
  GraduationCap,
  Droplets,
  Brain,
  PhoneOff,
  BellOff,
  Moon,
  Sparkles,
  Heart,
  Smile,
  Clock,
  Coffee,
  Target,
  Flame,
  CheckCircle2,
  Award
} from 'lucide-react';

const ICON_COMPONENTS = {
  Sun,
  Dumbbell,
  BookOpen,
  GraduationCap,
  Droplets,
  Brain,
  PhoneOff,
  BellOff,
  Moon,
  Sparkles,
  Heart,
  Smile,
  Clock,
  Coffee,
  Target,
  Flame,
  CheckCircle2,
  Award
};

export function HabitIcon({ name, className = "w-5 h-5" }) {
  const IconComponent = ICON_COMPONENTS[name] || Sparkles;
  return <IconComponent className={className} />;
}

export const AVAILABLE_ICONS = [
  'Sun',
  'Dumbbell',
  'BookOpen',
  'GraduationCap',
  'Droplets',
  'Brain',
  'PhoneOff',
  'BellOff',
  'Moon',
  'Sparkles',
  'Heart',
  'Smile',
  'Clock',
  'Coffee',
  'Target',
  'Flame'
];

