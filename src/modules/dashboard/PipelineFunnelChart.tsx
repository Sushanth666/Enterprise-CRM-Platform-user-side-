import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { useAppSelector } from '@/store';
import { DealStage } from '@/types/crm';
import { formatCurrency, formatCompactCurrency } from '@/utils/formatters';

const STAGE_COLORS: Record<string, string> = {
  Discovery: '#0ea5e9',
  Qualification: '#3b82f6',
  Proposal: '#6366f1',
  Negotiation: '#f59e0b',
  'Contract Sent': '#a855f7',
  'Closed Won': '#10b981',
  'Closed Lost': '#f43f5e',
};

const COPPER_STAGE_COLORS: Record<string, string> = {
  Discovery: '#733723',
  Qualification: '#9e4325',
  Proposal: '#ba6142',
  Negotiation: '#ca5e3a',
  'Contract Sent': '#e08a68',
  'Closed Won': '#f4b69d',
  'Closed Lost': '#52291c',
};

export const PipelineFunnelChart: React.FC = () => {
  const deals = useAppSelector((state) => state.deals.items);
  const colorTheme = useAppSelector((state) => state.ui.colorTheme);
  const isCopper = colorTheme === 'sunset-copper';
  const currentStageColors = isCopper ? COPPER_STAGE_COLORS : STAGE_COLORS;

  const stages: DealStage[] = [
    'Discovery',
    'Qualification',
    'Proposal',
    'Negotiation',
    'Contract Sent',
    'Closed Won',
  ];

  const data = stages.map((stg) => {
    const stageDeals = deals.filter((d) => d.stage === stg);
    const totalAmount = stageDeals.reduce((sum, d) => sum + d.amount, 0);
    return {
      stage: stg,
      amount: totalAmount,
      count: stageDeals.length,
    };
  });

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xl text-xs space-y-1">
          <p className="font-bold text-slate-800">{item.stage}</p>
          <p className="text-indigo-600 font-semibold">
            Stage Value: {formatCurrency(item.amount)}
          </p>
          <p className="text-slate-500">Deals in Stage: {item.count}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            Pipeline Stage Distribution
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Total active opportunity volume across deal progression stages
          </p>
        </div>
      </div>

      <div className="h-60 sm:h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isCopper ? '#2a1c16' : '#f1f5f9'} />
            <XAxis
              dataKey="stage"
              tickLine={false}
              axisLine={{ stroke: isCopper ? '#3b2921' : '#e2e8f0' }}
              tick={{ fill: isCopper ? '#97837a' : '#64748b', fontSize: 10 }}
              interval={0}
              tickFormatter={(stg: string) => {
                if (typeof window !== 'undefined' && window.innerWidth < 640) {
                  const map: Record<string, string> = {
                    Discovery: 'Disc',
                    Qualification: 'Qual',
                    Proposal: 'Prop',
                    Negotiation: 'Nego',
                    'Contract Sent': 'Contr',
                    'Closed Won': 'Won',
                  };
                  return map[stg] || stg.slice(0, 4);
                }
                return stg;
              }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: isCopper ? '#97837a' : '#64748b', fontSize: 12 }}
              tickFormatter={(v) => formatCompactCurrency(v)}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={currentStageColors[entry.stage] || '#ca5e3a'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

