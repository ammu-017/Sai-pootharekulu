import React from 'react';

// Elegant traditional Indian lotus emblem
export const LotusMotif = ({ className = 'w-9 h-9 text-gold-500' }) => (
  <svg
    viewBox="0 0 100 80"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M50 5 C55 30 70 50 50 75 C30 50 45 30 50 5 Z" opacity="0.95" />
    <path d="M48 20 C35 35 25 55 45 75 C30 65 30 40 48 20 Z" opacity="0.8" />
    <path d="M52 20 C65 35 75 55 55 75 C70 65 70 40 52 20 Z" opacity="0.8" />
    <path d="M42 35 C20 45 10 65 38 76 C15 70 15 50 42 35 Z" opacity="0.65" />
    <path d="M58 35 C80 45 90 65 62 76 C85 70 85 50 58 35 Z" opacity="0.65" />
    <circle cx="50" cy="74" r="3" fill="#fcf6ba" />
    <path
      d="M30 77 Q50 73 70 77"
      stroke="#fcf6ba"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
    />
  </svg>
);

// Traditional ornamental section divider with center motif (28px - 36px heading)
export const SectionDivider = ({ title, subtitle, light = false }) => (
  <div className="flex flex-col items-center justify-center my-10 text-center px-4">
    <div className="flex items-center justify-center gap-4 w-full max-w-xl mb-3">
      <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-gold-500/70 to-gold-400" />
      <LotusMotif className="w-8 h-8 text-gold-400 animate-pulse-slow" />
      <div className="h-[2px] flex-1 bg-gradient-to-l from-transparent via-gold-500/70 to-gold-400" />
    </div>
    {subtitle && (
      <span className="font-traditional text-gold-300 font-semibold italic text-base sm:text-lg tracking-widest uppercase mb-1.5">
        {subtitle}
      </span>
    )}
    {title && (
      <h2
        className={`font-cinzel text-2xl sm:text-3xl lg:text-4xl font-black tracking-wide leading-tight ${
          light ? 'text-[#041f14]' : 'text-ivory'
        }`}
      >
        {title}
      </h2>
    )}
    <div className="flex items-center gap-2 mt-3">
      <span className="w-2.5 h-2.5 rotate-45 bg-gold-400 inline-block" />
      <span className="w-16 h-[2px] bg-gold-500 inline-block" />
      <span className="w-2.5 h-2.5 rotate-45 bg-gold-400 inline-block" />
    </div>
  </div>
);

// Traditional corner gold flourish
export const GoldCorner = ({ position = 'top-left' }) => {
  const getStyles = () => {
    switch (position) {
      case 'top-left':
        return 'top-2.5 left-2.5';
      case 'top-right':
        return 'top-2.5 right-2.5 rotate-90';
      case 'bottom-left':
        return 'bottom-2.5 left-2.5 -rotate-90';
      case 'bottom-right':
        return 'bottom-2.5 right-2.5 rotate-180';
      default:
        return 'top-2.5 left-2.5';
    }
  };

  return (
    <svg
      className={`absolute w-7 h-7 text-gold-400 pointer-events-none opacity-80 ${getStyles()}`}
      viewBox="0 0 40 40"
      fill="none"
      stroke="currentColor"
    >
      <path d="M2 38 V10 C2 5.5 5.5 2 10 2 H38" strokeWidth="2.5" />
      <circle cx="10" cy="10" r="3.5" fill="currentColor" />
      <path d="M6 34 V12 C6 8.7 8.7 6 12 6 H34" strokeWidth="1.5" strokeDasharray="2 2" />
    </svg>
  );
};
