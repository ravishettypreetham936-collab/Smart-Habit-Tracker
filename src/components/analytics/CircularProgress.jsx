import React from 'react';

export default function CircularProgress({
  percentage = 0,
  size = 130,
  strokeWidth = 10,
  title = '',
  subtitle = '',
  accentColor = '#10B981', // emerald-500
  trackColor = '#E6F4EA'   // soft sheets light green
}) {
  const cleanPercentage = Math.min(100, Math.max(0, Math.round(percentage)));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (cleanPercentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="w-full h-full -rotate-90 transform" viewBox={`0 0 ${size} ${size}`}>
          {/* Background Track Circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={trackColor}
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Animated Green Progress Stroke */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={accentColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-700 ease-out"
          />
        </svg>

        {/* Center Percentage & Info */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-bold font-mono text-gray-900 dark:text-white tracking-tight">
            {cleanPercentage}%
          </span>
          {subtitle && (
            <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium tracking-wide uppercase mt-0.5">
              {subtitle}
            </span>
          )}
        </div>
      </div>

      {title && (
        <span className="mt-2.5 text-xs font-semibold text-gray-800 dark:text-gray-200 tracking-wide text-center">
          {title}
        </span>
      )}
    </div>
  );
}
