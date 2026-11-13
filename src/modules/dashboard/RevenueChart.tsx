import React, { useState } from 'react';
import { useAppSelector } from '@/store';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { formatCurrency, formatCompactCurrency } from '@/utils/formatters';

const monthlyData = [
  { month: 'Jun', revenue: 42000000, target: 40000000, dealsClosed: 6 },
  { month: 'Jul', revenue: 51000000, target: 45000000, dealsClosed: 8 },
  { month: 'Aug', revenue: 49000000, target: 50000000, dealsClosed: 7 },
  { month: 'Sep', revenue: 68000000, target: 55000000, dealsClosed: 11 },
  { month: 'Oct', revenue: 84000000, target: 65000000, dealsClosed: 14 },
  { month: 'Nov (Proj)', revenue: 95000000, target: 70000000, dealsClosed: 16 },
];

export const RevenueChart: React.FC = () => {
  const [metric, setMetric] = useState<'revenue' | 'target'>('revenue');
  const colorTheme = useAppSelector((state) => state.ui.colorTheme);
  const isCopper = colorTheme === 'sunset-copper';
  const copperMainColor = '#ca5e3a';
  const copperAccentColor = '#e08a68';

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xl text-xs space-y-1">
          <p className="font-bold text-slate-800">{label}</p>
          <p className="text-indigo-600 font-semibold">
            Actual Revenue: {formatCurrency(payload[0].value)}
          </p>
          {payload[1] && (
            <p className="text-slate-400 font-medium">
              Sales Quota Target: {formatCurrency(payload[1].value)}
            </p>
          )}
          <p className="text-slate-500 pt-1 border-t border-slate-100">
            Deals Closed: {payload[0].payload.dealsClosed}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            Revenue Performance & Quota Attainment
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Quarterly trajectory against executive sales targets
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1.5 text-slate-600">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 inline-block" />
            <span>Closed Revenue</span>
          </span>
          <span className="flex items-center gap-1.5 text-slate-400 ml-2">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300 inline-block" />
            <span>Target Quota</span>
          </span>
        </div>
      </div>

      <div className="h-60 sm:h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={isCopper ? copperAccentColor : '#4f46e5'} stopOpacity={0.4} />
                <stop offset="95%" stopColor={isCopper ? copperMainColor : '#4f46e5'} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={isCopper ? '#5c4135' : '#cbd5e1'} stopOpacity={0.25} />
                <stop offset="95%" stopColor={isCopper ? '#5c4135' : '#cbd5e1'} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isCopper ? '#2a1c16' : '#f1f5f9'} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={{ stroke: isCopper ? '#3b2921' : '#e2e8f0' }}
              tick={{ fill: isCopper ? '#97837a' : '#64748b', fontSize: 12 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: isCopper ? '#97837a' : '#64748b', fontSize: 12 }}
              tickFormatter={(v) => formatCompactCurrency(v)}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke={isCopper ? copperAccentColor : '#4f46e5'}
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorRevenue)"
            />
            <Area
              type="monotone"
              dataKey="target"
              stroke={isCopper ? '#87695d' : '#94a3b8'}
              strokeWidth={2}
              strokeDasharray="4 4"
              fillOpacity={1}
              fill="url(#colorTarget)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

