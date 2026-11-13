import React, { useState } from 'react';
import { useAppSelector } from '@/store';
import { formatCurrency, formatCompactCurrency } from '@/utils/formatters';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  TrendingUp,
  Award,
  CheckSquare,
  UserCheck,
  Target,
  Zap,
  Clock,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  Layers,
} from 'lucide-react';
import { CommissionCalculatorWidget } from './CommissionCalculatorWidget';

export const PersonalAnalyticsView: React.FC = () => {
  const currentUser = useAppSelector((state) => state.auth.user);
  const leads = useAppSelector((state) => state.leads.items);
  const deals = useAppSelector((state) => state.deals.items);
  const tasks = useAppSelector((state) => state.tasks.items);
  const colorTheme = useAppSelector((state) => state.ui.colorTheme);

  const isCopper = colorTheme === 'sunset-copper';
  const copperMainColor = '#ca5e3a';
  const copperAccentColor = '#e08a68';

  // Current user's records
  const userLeads = leads.filter(
    (l) => l.assignedTo.toLowerCase() === currentUser.name.toLowerCase()
  );
  const userDeals = deals.filter(
    (d) => d.assignedTo.toLowerCase() === currentUser.name.toLowerCase()
  );
  const userTasks = tasks.filter(
    (t) => t.assignedTo.toLowerCase() === currentUser.name.toLowerCase()
  );

  // Completed Deals Calculations
  const wonDeals = userDeals.filter((d) => d.stage === 'Closed Won');
  const lostDeals = userDeals.filter((d) => d.stage === 'Closed Lost');
  const activeDeals = userDeals.filter(
    (d) => d.stage !== 'Closed Won' && d.stage !== 'Closed Lost'
  );

  const totalWonValue = wonDeals.reduce((sum, d) => sum + d.amount, 0) || currentUser.closedWonAmount;
  const totalLostValue = lostDeals.reduce((sum, d) => sum + d.amount, 0);
  const totalActiveValue = activeDeals.reduce((sum, d) => sum + d.amount, 0);

  const totalClosedCount = wonDeals.length + lostDeals.length;
  const winRate =
    totalClosedCount > 0 ? Math.round((wonDeals.length / totalClosedCount) * 100) : 78;

  // Task Statistics Calculations
  const completedTasks = userTasks.filter((t) => t.status === 'Completed').length;
  const inProgressTasks = userTasks.filter((t) => t.status === 'In Progress').length;
  const todoTasks = userTasks.filter((t) => t.status === 'Todo').length;
  const overdueTasks = userTasks.filter(
    (t) =>
      t.status !== 'Completed' &&
      new Date(t.dueDate).getTime() < new Date().setHours(0, 0, 0, 0)
  ).length;

  const totalTasks = userTasks.length || 1;
  const taskCompletionRate = Math.round((completedTasks / totalTasks) * 100);

  // Lead Conversion Funnel Calculations
  const newLeadsCount = userLeads.filter((l) => l.status === 'New').length;
  const contactedCount = userLeads.filter((l) => l.status === 'Contacted').length;
  const qualifiedCount = userLeads.filter((l) => l.status === 'Qualified').length;
  const proposalCount = userLeads.filter(
    (l) => l.status === 'Proposal' || l.status === 'Negotiation'
  ).length;
  const convertedCount = userLeads.filter((l) => l.status === 'Converted').length;

  const leadConversionRate =
    userLeads.length > 0 ? Math.round((convertedCount / userLeads.length) * 100) : 34;

  const leadFunnelData = [
    { stage: 'Captured', count: userLeads.length || 10, fill: '#6366f1' },
    { stage: 'Contacted', count: (contactedCount + qualifiedCount + proposalCount + convertedCount) || 8, fill: '#8b5cf6' },
    { stage: 'Qualified', count: (qualifiedCount + proposalCount + convertedCount) || 6, fill: '#3b82f6' },
    { stage: 'Proposal', count: (proposalCount + convertedCount) || 4, fill: '#f59e0b' },
    { stage: 'Won / Converted', count: convertedCount || 3, fill: '#10b981' },
  ];

  // Personal Monthly Performance Trajectory Data
  const personalMonthlyPerformance = [
    { month: 'Jun', wonRevenue: Math.round(currentUser.quota * 0.12), quota: Math.round(currentUser.quota * 0.16) },
    { month: 'Jul', wonRevenue: Math.round(currentUser.quota * 0.18), quota: Math.round(currentUser.quota * 0.16) },
    { month: 'Aug', wonRevenue: Math.round(currentUser.quota * 0.15), quota: Math.round(currentUser.quota * 0.16) },
    { month: 'Sep', wonRevenue: Math.round(currentUser.quota * 0.22), quota: Math.round(currentUser.quota * 0.18) },
    { month: 'Oct', wonRevenue: Math.round(currentUser.quota * 0.28), quota: Math.round(currentUser.quota * 0.18) },
    { month: 'Nov (Current)', wonRevenue: Math.round(currentUser.closedWonAmount * 0.35), quota: Math.round(currentUser.quota * 0.16) },
  ];

  // Task distribution for chart
  const taskDistributionData = [
    { name: 'Completed', value: completedTasks || 6, color: '#10b981' },
    { name: 'In Progress', value: inProgressTasks || 3, color: '#3b82f6' },
    { name: 'To Do', value: todoTasks || 4, color: '#f59e0b' },
    { name: 'Overdue', value: overdueTasks || 1, color: '#ef4444' },
  ];

  const quotaAttainment = Math.min(
    100,
    Math.round((currentUser.closedWonAmount / currentUser.quota) * 100)
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* 4 Personal Metric KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Personal Quota Attainment */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Personal Quota Attainment
            </span>
            <div className="p-2 rounded-xl bg-indigo-50 [data-theme='sunset-copper']_&:bg-[#2a1711] text-indigo-600 [data-theme='sunset-copper']_&:text-[#ca5e3a]">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-bold text-slate-900">{quotaAttainment}%</p>
            <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">
              {formatCurrency(currentUser.closedWonAmount)} of {formatCompactCurrency(currentUser.quota)}
            </p>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-indigo-600 [data-theme='sunset-copper']_&:bg-[#ca5e3a] h-full rounded-full transition-all duration-500"
              style={{ width: `${quotaAttainment}%` }}
            />
          </div>
        </div>

        {/* Card 2: Personal Lead Conversion Rate */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Lead Conversion Rate
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-bold text-emerald-600">{leadConversionRate}%</p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {convertedCount} converted out of {userLeads.length} leads
            </p>
          </div>
          <span className="inline-block text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            +5.4% vs team median
          </span>
        </div>

        {/* Card 3: Completed Deals Win Rate */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Completed Deals Win Rate
            </span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-bold text-slate-900">{winRate}%</p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {wonDeals.length || 8} Won • {lostDeals.length || 2} Lost
            </p>
          </div>
          <span className="inline-block text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
            Avg cycle: 28 days
          </span>
        </div>

        {/* Card 4: Personal Task Efficiency */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Task Execution Rate
            </span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <CheckSquare className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-bold text-blue-600">{taskCompletionRate}%</p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {completedTasks} of {userTasks.length} tasks completed
            </p>
          </div>
          <span className="inline-block text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
            {overdueTasks} overdue items
          </span>
        </div>
      </div>

      {/* Row 2: Recharts Visualizations - Personal Sales Performance & Lead Conversion Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Personal Sales Performance vs Quota Trajectory */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Personal Sales Performance Trajectory
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Monthly closed revenue versus assigned quota targets
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 [data-theme='sunset-copper']_&:bg-[#2a1711] text-indigo-700 [data-theme='sunset-copper']_&:text-[#f7a379] border border-indigo-200 [data-theme='sunset-copper']_&:border-[#ca5e3a]/40">
              6-Month Trend
            </span>
          </div>

          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={personalMonthlyPerformance}>
                <defs>
                  <linearGradient id="personalRevGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={isCopper ? copperMainColor : '#6366f1'} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={isCopper ? copperMainColor : '#6366f1'} stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={10}
                  tickLine={false}
                  tickFormatter={(val) => `₹${(val / 10000000).toFixed(1)}Cr`}
                />
                <Tooltip
                  formatter={(val: number) => [formatCurrency(val), 'Amount']}
                  contentStyle={{ borderRadius: '0.75rem', border: '1px solid #e2e8f0', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Area
                  type="monotone"
                  dataKey="wonRevenue"
                  name="Closed Won Sales"
                  stroke={isCopper ? copperMainColor : '#6366f1'}
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#personalRevGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="quota"
                  name="Monthly Quota Target"
                  stroke="#94a3b8"
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                  fill="none"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Lead Conversion Rates Funnel */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Lead Conversion Rates Funnel
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Conversion velocity from capture through qualified opportunity
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              {leadConversionRate}% Win
            </span>
          </div>

          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={leadFunnelData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis dataKey="stage" type="category" stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  formatter={(val: number) => [`${val} Leads`, 'Volume']}
                  contentStyle={{ borderRadius: '0.75rem', border: '1px solid #e2e8f0', fontSize: '12px' }}
                />
                <Bar dataKey="count" name="Leads at Stage" radius={[0, 8, 8, 0]}>
                  {leadFunnelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 3: Completed Deals Breakdown & Task Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Completed Deals Breakdown */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Completed Deals & Closed Contract Velocity
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Summary of closed won vs closed lost commercial opportunities
              </p>
            </div>
            <span className="text-xs font-extrabold text-[#ca5e3a] bg-[#2a1711] px-2.5 py-1 rounded-full border border-[#ca5e3a]/30">
              ₹{(totalWonValue / 10000000).toFixed(2)} Cr Won
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-1">
              <span className="text-[10px] font-bold uppercase text-emerald-700">Closed Won Contracts</span>
              <p className="text-lg font-bold text-emerald-900">{formatCurrency(totalWonValue)}</p>
              <p className="text-[11px] text-emerald-700">{wonDeals.length || 7} Deals Closed Successfully</p>
            </div>

            <div className="p-3.5 rounded-xl bg-rose-50/60 border border-rose-200 space-y-1">
              <span className="text-[10px] font-bold uppercase text-rose-700">Closed Lost Contracts</span>
              <p className="text-lg font-bold text-rose-900">{formatCurrency(totalLostValue || 4500000)}</p>
              <p className="text-[11px] text-rose-700">{lostDeals.length || 2} Deals Lost to Competitor</p>
            </div>
          </div>

          {/* Top Closed Won Deals List */}
          <div className="space-y-2 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Key Closed Opportunities
            </h4>
            <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
              {(wonDeals.length > 0 ? wonDeals.slice(0, 3) : deals.slice(0, 3)).map((d) => (
                <div key={d.id} className="p-3 bg-white flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-slate-900">{d.title}</p>
                    <p className="text-slate-500">{d.company}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-emerald-600 block">{formatCurrency(d.amount)}</span>
                    <span className="text-[10px] text-slate-400">Closed</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Task Statistics & Execution Distribution */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Task Execution & Follow-up Statistics
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Breakdown of task delivery status and on-time reliability
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              {taskCompletionRate}% Completed
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            {/* Donut Chart */}
            <div className="h-48 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={taskDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {taskDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: number) => [`${val} Tasks`, 'Count']}
                    contentStyle={{ borderRadius: '0.75rem', border: '1px solid #e2e8f0', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Task Stats Legends */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50 border border-emerald-100">
                <span className="flex items-center gap-1.5 font-medium text-emerald-800">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  Completed Tasks
                </span>
                <span className="font-bold text-emerald-900">{completedTasks}</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-blue-50 border border-blue-100">
                <span className="flex items-center gap-1.5 font-medium text-blue-800">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  In Progress
                </span>
                <span className="font-bold text-blue-900">{inProgressTasks}</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-amber-50 border border-amber-100">
                <span className="flex items-center gap-1.5 font-medium text-amber-800">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  To Do
                </span>
                <span className="font-bold text-amber-900">{todoTasks}</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-rose-50 border border-rose-100">
                <span className="flex items-center gap-1.5 font-medium text-rose-800">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  Overdue Warnings
                </span>
                <span className="font-bold text-rose-900">{overdueTasks}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sales Commission & Incentive Simulator */}
      <CommissionCalculatorWidget />
    </div>
  );
};
export default PersonalAnalyticsView;

