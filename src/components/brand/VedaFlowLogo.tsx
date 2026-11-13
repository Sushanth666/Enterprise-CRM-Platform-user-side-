import React, { useId } from 'react';

interface VedaFlowLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  showSubtitle?: boolean;
  subtitle?: string;
  className?: string;
  textClassName?: string;
}

export const VedaFlowLogo: React.FC<VedaFlowLogoProps> = ({
  size = 'md',
  showText = true,
  showSubtitle = true,
  subtitle = 'SALES INTELLIGENCE PLATFORM',
  className = '',
  textClassName = '',
}) => {
  const rawId = useId();
  const uniqueId = rawId.replace(/[^a-zA-Z0-9_-]/g, '_');
  const gradientId = `vedaInfinityCopper_${uniqueId}`;

  const iconBoxSizes = {
    sm: 'w-8 h-8 rounded-lg p-1.5',
    md: 'w-10 h-10 rounded-xl p-2',
    lg: 'w-12 h-12 rounded-xl p-2',
    xl: 'w-16 h-16 rounded-2xl p-2.5',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-xl',
    xl: 'text-2xl',
  };

  const subtitleSizes = {
    sm: 'text-[8.5px]',
    md: 'text-[9.5px]',
    lg: 'text-[11px]',
    xl: 'text-xs',
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Bold Glowing Copper Infinity Icon */}
      <div className="relative shrink-0 group">
        {/* Ambient Top-Left Copper Corner & Glow */}
        <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-br from-[#e08a68]/60 via-[#ca5e3a]/30 to-transparent opacity-70 blur-[1px] group-hover:opacity-100 transition-opacity" />

        <div
          className={`${iconBoxSizes[size]} relative bg-[#18110e] border border-[#ca5e3a]/60 border-t-[#e08a68]/80 border-l-[#e08a68]/80 flex items-center justify-center shadow-lg shadow-black/80 group-hover:scale-105 group-hover:border-[#e08a68] transition-all overflow-hidden`}
        >
          {/* Subtle top-left warm sheen */}
          <div className="absolute top-0 left-0 w-4 h-4 bg-gradient-to-br from-[#ca5e3a]/25 to-transparent pointer-events-none" />

          <svg
            viewBox="0 0 40 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full block"
            style={{
              filter: 'drop-shadow(0 0 3px rgba(234, 88, 12, 0.75))',
            }}
          >
            <defs>
              {/* Unique Per-Instance Vibrant Copper Gradient to prevent SVG ID collisions */}
              <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f07e53" />
                <stop offset="35%" stopColor="#ea580c" />
                <stop offset="50%" stopColor="#fbbf24" />
                <stop offset="65%" stopColor="#ea580c" />
                <stop offset="100%" stopColor="#f07e53" />
              </linearGradient>
            </defs>

            {/* Mathematically Symmetrical Smooth Infinity Symbol (∞) */}
            <path
              d="M 20,12 C 16,7 12,4.5 9,4.5 C 5.5,4.5 3,7.5 3,12 C 3,16.5 5.5,19.5 9,19.5 C 12,19.5 16,17 20,12 C 24,7 28,4.5 31,4.5 C 34.5,4.5 37,7.5 37,12 C 37,16.5 34.5,19.5 31,19.5 C 28,19.5 24,17 20,12 Z"
              stroke={`url(#${gradientId})`}
              strokeWidth="3.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Typography: VedaFlow + Subtitle */}
      {showText && (
        <div className={`flex flex-col leading-tight ${textClassName}`}>
          <span className={`font-black tracking-tight flex items-center gap-0.5 ${textSizes[size]}`}>
            <span className="text-slate-900 dark:text-white font-black">Veda</span>
            <span className="bg-gradient-to-r from-[#f07e53] to-[#e25d32] bg-clip-text text-transparent">
              Flow
            </span>
          </span>
          {showSubtitle && (
            <span
              className={`font-semibold tracking-wider uppercase text-slate-400 mt-0.5 ${subtitleSizes[size]}`}
            >
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
