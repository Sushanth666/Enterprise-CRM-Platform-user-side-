import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number; // e.g., +14.2 or -3.1
  changePeriod?: string;
  icon: React.ReactNode;
  iconBg?: string;
  iconColor?: string;
  description?: string;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  changePeriod = 'vs last month',
  icon,
  iconBg = 'bg-indigo-50',
  iconColor = 'text-indigo-600',
  description,
  onClick,
}) => {
  const isPositive = change !== undefined && change > 0;
  const isNegative = change !== undefined && change < 0;
  const isNeutral = change !== undefined && change === 0;

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border border-slate-200/80 p-3.5 sm:p-5 shadow-xs card-hover-lift group ${
        onClick ? 'cursor-pointer hover:border-indigo-300' : ''
      }`}
    >
      <div className="flex items-center justify-between gap-1">
        <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-slate-500 truncate">
          {title}
        </span>
        <div className={`p-1.5 sm:p-2.5 rounded-xl ${iconBg} ${iconColor} shrink-0 group-hover:scale-110 transition-transform duration-200`}>
          {icon}
        </div>
      </div>

      <div className="mt-2 sm:mt-3 flex items-baseline gap-2">
        <span className="text-lg sm:text-2xl font-bold tracking-tight text-slate-900 truncate">{value}</span>
      </div>

      {(change !== undefined || description) && (
        <div className="mt-2 sm:mt-3 flex items-center gap-1.5 text-[11px] sm:text-xs text-slate-500 flex-wrap">
          {change !== undefined && (
            <span
              className={`inline-flex items-center font-semibold rounded-md px-1.5 py-0.5 ${
                isPositive
                  ? 'bg-emerald-50 text-emerald-700'
                  : isNegative
                  ? 'bg-rose-50 text-rose-700'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {isPositive && <ArrowUpRight className="w-3.5 h-3.5 mr-0.5 inline" />}
              {isNegative && <ArrowDownRight className="w-3.5 h-3.5 mr-0.5 inline" />}
              {isNeutral && <Minus className="w-3 h-3 mr-0.5 inline" />}
              {Math.abs(change)}%
            </span>
          )}
          <span>{changePeriod || description}</span>
        </div>
      )}
    </div>
  );
};
