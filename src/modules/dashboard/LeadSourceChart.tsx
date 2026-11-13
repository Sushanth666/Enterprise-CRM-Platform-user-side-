import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { useAppSelector } from '@/store';

const COLORS = ['#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4'];
const COPPER_COLORS = ['#ca5e3a', '#e89578', '#f4b69d', '#ba6142', '#dc7755', '#733723', '#e8a87c'];

export const LeadSourceChart: React.FC = () => {
  const leads = useAppSelector((state) => state.leads.items);
  const colorTheme = useAppSelector((state) => state.ui.colorTheme);
  const activeColors = colorTheme === 'sunset-copper' ? COPPER_COLORS : COLORS;

  // Group by source
  const sourceCounts: Record<string, number> = {};
  leads.forEach((l) => {
    sourceCounts[l.source] = (sourceCounts[l.source] || 0) + 1;
  });

  const data = Object.entries(sourceCounts).map(([name, value]) => ({
    name,
    value,
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0];
      const percent = Math.round((item.value / leads.length) * 100);
      return (
        <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-xl text-xs space-y-0.5">
          <p className="font-bold text-slate-800">{item.name}</p>
          <p className="text-indigo-600 font-semibold">
            {item.value} Leads ({percent}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
      <div>
        <h3 className="text-base font-bold text-slate-900 tracking-tight">
          Lead Attribution Channels
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Breakdown of lead origin across marketing & sales channels
        </p>
      </div>

      <div className="h-56 sm:h-64 w-full my-auto">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip content={<CustomTooltip />} />
            <Pie
              data={data}
              innerRadius={55}
              outerRadius={85}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={activeColors[index % activeColors.length]} />
              ))}
            </Pie>
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              iconSize={8}
              formatter={(value) => <span className="text-xs text-slate-600">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

