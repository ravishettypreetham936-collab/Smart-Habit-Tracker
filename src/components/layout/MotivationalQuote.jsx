import React, { useState } from 'react';
import { Quote, RefreshCw, Sparkles } from 'lucide-react';
import { getDailyQuote, getRandomQuote } from '../../constants/quotes.js';

export default function MotivationalQuote() {
  const [currentQuote, setCurrentQuote] = useState(getDailyQuote());
  const [isRotating, setIsRotating] = useState(false);

  const handleNextQuote = () => {
    setIsRotating(true);
    setTimeout(() => {
      setCurrentQuote(getRandomQuote(currentQuote.index));
      setIsRotating(false);
    }, 250);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-1">
      <div className="bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-teal-500/10 dark:from-emerald-950/40 dark:via-emerald-900/20 dark:to-teal-950/30 border border-emerald-200/80 dark:border-emerald-800/60 rounded-xl p-3 sm:px-4 sm:py-3 shadow-2xs flex items-center justify-between gap-3 transition-colors">
        
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
            <Quote className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-700 dark:text-emerald-400 font-mono">
                Daily Motivation
              </span>
              <span className="text-gray-300 dark:text-gray-600">•</span>
              <span className="text-[11px] font-semibold text-gray-700 dark:text-gray-300 truncate">
                {currentQuote.author} <span className="text-gray-400 font-normal">({currentQuote.source})</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-800 dark:text-gray-200 italic font-sans leading-snug truncate sm:whitespace-normal">
              "{currentQuote.quote}"
            </p>
          </div>
        </div>

        <button
          onClick={handleNextQuote}
          title="Inspire me with another quote"
          className="shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-emerald-800 dark:text-emerald-300 bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-700 border border-emerald-200 dark:border-emerald-700 transition-all shadow-2xs active:scale-95"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 transition-transform ${isRotating ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">New Quote</span>
        </button>

      </div>
    </div>
  );
}
