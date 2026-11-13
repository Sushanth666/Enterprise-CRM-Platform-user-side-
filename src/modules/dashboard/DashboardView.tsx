import React from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { setWorkspaceScope, openModal, setActiveTab, addToast } from '@/store/uiSlice';
import { populateUserRandomData } from '@/utils/randomDataGenerator';
import { MetricsSummary } from './MetricsSummary';
import { RevenueChart } from './RevenueChart';
import { PipelineFunnelChart } from './PipelineFunnelChart';
import { LeadSourceChart } from './LeadSourceChart';
import { TopDealsTable } from './TopDealsTable';
import { RecentActivitiesList } from './RecentActivitiesList';
import { UpcomingTasksWidget } from './UpcomingTasksWidget';
import { Button } from '@/components/Button';
import { formatCurrency } from '@/utils/formatters';
import {
  User,
  Users,
  Plus,
  Calendar,
  CheckSquare,
  Activity,
  Target,
  Sparkles,
  TrendingUp,
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.auth.user);
  const workspaceScope = useAppSelector((state) => state.ui.workspaceScope);

  const quotaPercent = Math.min(
    100,
    Math.round((currentUser.closedWonAmount / currentUser.quota) * 100)
  );

  return (
    <div className="space-y-6">
      {/* User Cockpit Welcome Header */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 [data-theme='sunset-copper']_&:from-[#2a1711] [data-theme='sunset-copper']_&:via-[#1e120e] [data-theme='sunset-copper']_&:to-[#140e0c] border border-slate-800 [data-theme='sunset-copper']_&:border-[#3d271e] text-white shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold tracking-wider text-[#e08a68]">
                {workspaceScope === 'personal' ? 'User Panel Cockpit' : 'Enterprise Command Center'}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#341d15] text-[#f7a379] border border-[#ca5e3a]/40">
                {currentUser.role}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight mt-1 text-white">
              Welcome back, {currentUser.name}!
            </h2>
            <p className="text-xs text-slate-300 [data-theme='sunset-copper']_&:text-[#edd5cb] mt-1 max-w-2xl leading-relaxed">
              {workspaceScope === 'personal'
                ? 'Your personal CRM workspace is ready. Review your assigned leads, ongoing deals in flight, pending action items, and sales quota pace.'
                : 'Enterprise organization-wide view: track team sales pipeline distribution, rep quota attainment, and customer lifetime value.'}
            </p>
          </div>

          {/* Personal Quota Attainment Quick Gauge */}
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 dark:border-[#3d271e] [data-theme='sunset-copper']_&:border-[#3d271e] min-w-[220px]">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-300 [data-theme='sunset-copper']_&:text-[#edd5cb] font-medium">Personal Quota Pace:</span>
              <span className="font-extrabold text-[#f7a379]">{quotaPercent}%</span>
            </div>
            <div className="w-full bg-black/40 rounded-full h-2 overflow-hidden border border-white/10">
              <div
                className="bg-gradient-to-r from-[#ca5e3a] to-[#f59e0b] h-full rounded-full transition-all duration-500"
                style={{ width: `${quotaPercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
              <span>{formatCurrency(currentUser.closedWonAmount)}</span>
              <span>Target: {formatCurrency(currentUser.quota)}</span>
            </div>
          </div>
        </div>

        {/* Action Shortcuts & Workspace Mode Switcher */}
        <div className="mt-4 pt-4 border-t border-white/10 [data-theme='sunset-copper']_&:border-[#3d271e] flex flex-wrap items-center justify-between gap-3">
          {/* Workspace Mode Switcher */}
          <div className="flex items-center p-1 rounded-xl bg-black/30 border border-white/10 text-xs font-semibold">
            <button
              type="button"
              onClick={() => dispatch(setWorkspaceScope('personal'))}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                workspaceScope === 'personal'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5 text-indigo-600 [data-theme='sunset-copper']_&:text-[#ca5e3a]" />
              <span>My Personal Cockpit</span>
            </button>

            <button
              type="button"
              onClick={() => dispatch(setWorkspaceScope('team'))}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                workspaceScope === 'team'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-slate-600" />
              <span>Team Overview</span>
            </button>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => dispatch(openModal('leadFormOpen'))}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs font-medium"
            >
              Add Lead
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => dispatch(openModal('dealFormOpen'))}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs font-medium"
            >
              New Deal
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => dispatch(openModal('leadFollowUpOpen'))}
              leftIcon={<Calendar className="w-3.5 h-3.5" />}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs font-medium"
            >
              Schedule Follow-up
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => dispatch(openModal('taskFormOpen'))}
              leftIcon={<CheckSquare className="w-3.5 h-3.5" />}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs font-medium"
            >
              New Task
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => dispatch(openModal('activityFormOpen'))}
              leftIcon={<Activity className="w-3.5 h-3.5" />}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs font-medium"
            >
              Log Activity
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                populateUserRandomData(dispatch, currentUser);
                dispatch(
                  addToast({
                    type: 'success',
                    title: 'Workspace Data Re-Rolled!',
                    message: `Randomized dataset freshly generated across Leads, Pipeline, Customers, and Tasks for ${currentUser.name}.`,
                  })
                );
              }}
              leftIcon={<Sparkles className="w-3.5 h-3.5 text-amber-300" />}
              className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border-amber-500/40 text-xs font-semibold"
              title="Generate new random data for this login"
            >
              Re-Roll Random Data
            </Button>
          </div>
        </div>
      </div>

      {/* 4 Metric Stat Cards (Personal vs Team) */}
      <MetricsSummary />

      {/* Main Charts: Revenue Trend & Lead Sources */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <div className="lg:col-span-1">
          <LeadSourceChart />
        </div>
      </div>

      {/* Pipeline Funnel & Top Deals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PipelineFunnelChart />
        <TopDealsTable />
      </div>

      {/* Recent Activities & Upcoming Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UpcomingTasksWidget />
        <RecentActivitiesList />
      </div>
    </div>
  );
};
export default DashboardView;
