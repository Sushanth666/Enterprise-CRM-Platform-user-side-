import React from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { setActiveTab } from '@/store/uiSlice';
import { StatCard } from '@/components/StatCard';
import { formatCurrency, formatCompactCurrency } from '@/utils/formatters';
import {
  DollarSign,
  TrendingUp,
  UserPlus,
  Users,
  Target,
  Award,
  CheckSquare,
} from 'lucide-react';

export const MetricsSummary: React.FC = () => {
  const dispatch = useAppDispatch();
  const leads = useAppSelector((state) => state.leads.items);
  const deals = useAppSelector((state) => state.deals.items);
  const customers = useAppSelector((state) => state.customers.items);
  const tasks = useAppSelector((state) => state.tasks.items);
  const currentUser = useAppSelector((state) => state.auth.user);
  const workspaceScope = useAppSelector((state) => state.ui.workspaceScope);

  // User-specific records
  const userLeads = leads.filter(
    (l) => l.assignedTo.toLowerCase() === currentUser.name.toLowerCase()
  );
  const userDeals = deals.filter(
    (d) => d.assignedTo.toLowerCase() === currentUser.name.toLowerCase()
  );
  const userCustomers = customers.filter(
    (c) => c.accountManager.toLowerCase() === currentUser.name.toLowerCase()
  );
  const userTasks = tasks.filter(
    (t) => t.assignedTo.toLowerCase() === currentUser.name.toLowerCase()
  );

  const userActiveDeals = userDeals.filter(
    (d) => d.stage !== 'Closed Won' && d.stage !== 'Closed Lost'
  );
  const userPipelineValue = userActiveDeals.reduce((sum, d) => sum + d.amount, 0);
  const userCustomersRevenue = userCustomers.reduce((sum, c) => sum + c.totalRevenue, 0);

  const userPendingTasks = userTasks.filter((t) => t.status !== 'Completed');
  const userOverdueTasks = userPendingTasks.filter(
    (t) => new Date(t.dueDate).getTime() < new Date().setHours(0, 0, 0, 0)
  ).length;

  const userQualifiedLeads = userLeads.filter(
    (l) => l.status === 'Qualified' || l.status === 'Proposal' || l.status === 'Negotiation'
  ).length;

  // Organization-wide calculations
  const activeDeals = deals.filter(
    (d) => d.stage !== 'Closed Won' && d.stage !== 'Closed Lost'
  );
  const pipelineValue = activeDeals.reduce((sum, d) => sum + d.amount, 0);
  const wonDeals = deals.filter((d) => d.stage === 'Closed Won');
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalRevenue, 0);

  const winRate =
    deals.length > 0
      ? Math.round(
          (wonDeals.length /
            (wonDeals.length + deals.filter((d) => d.stage === 'Closed Lost').length || 1)) *
            100
        )
      : 0;

  const qualifiedLeads = leads.filter(
    (l) => l.status === 'Qualified' || l.status === 'Proposal' || l.status === 'Negotiation'
  ).length;

  if (workspaceScope === 'personal') {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <StatCard
          title="My Assigned Leads"
          value={userLeads.length}
          change={14.2}
          changePeriod={`${userQualifiedLeads} qualified`}
          icon={<UserPlus className="w-5 h-5" />}
          iconBg="bg-purple-50"
          iconColor="text-purple-600"
          onClick={() => dispatch(setActiveTab('leads'))}
        />

        <StatCard
          title="My Active Customers"
          value={userCustomers.length}
          change={8.5}
          changePeriod={formatCompactCurrency(userCustomersRevenue) + ' managed ARR'}
          icon={<Users className="w-5 h-5" />}
          iconBg="bg-indigo-50"
          iconColor="text-indigo-600"
          onClick={() => dispatch(setActiveTab('customers'))}
        />

        <StatCard
          title="My Ongoing Deals"
          value={userActiveDeals.length}
          change={12.0}
          changePeriod={formatCompactCurrency(userPipelineValue) + ' pipeline'}
          icon={<TrendingUp className="w-5 h-5" />}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
          onClick={() => dispatch(setActiveTab('pipeline'))}
        />

        <StatCard
          title="My Pending Tasks"
          value={userPendingTasks.length}
          change={userOverdueTasks > 0 ? -userOverdueTasks : 0}
          changePeriod={`${userOverdueTasks} overdue`}
          icon={<CheckSquare className="w-5 h-5" />}
          iconBg={userOverdueTasks > 0 ? 'bg-rose-50' : 'bg-emerald-50'}
          iconColor={userOverdueTasks > 0 ? 'text-rose-600' : 'text-emerald-600'}
          onClick={() => dispatch(setActiveTab('tasks'))}
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
      <StatCard
        title="Total ARR Revenue"
        value={formatCurrency(totalRevenue)}
        change={18.4}
        changePeriod="vs previous quarter"
        icon={<DollarSign className="w-5 h-5" />}
        iconBg="bg-indigo-50"
        iconColor="text-indigo-600"
        onClick={() => dispatch(setActiveTab('customers'))}
      />

      <StatCard
        title="Active Pipeline Value"
        value={formatCurrency(pipelineValue)}
        change={12.6}
        changePeriod="vs last month"
        icon={<TrendingUp className="w-5 h-5" />}
        iconBg="bg-blue-50"
        iconColor="text-blue-600"
        onClick={() => dispatch(setActiveTab('pipeline'))}
      />

      <StatCard
        title="Deal Win Rate"
        value={`${winRate}%`}
        change={4.2}
        changePeriod="vs benchmark"
        icon={<Award className="w-5 h-5" />}
        iconBg="bg-emerald-50"
        iconColor="text-emerald-600"
        onClick={() => dispatch(setActiveTab('pipeline'))}
      />

      <StatCard
        title="Qualified Inbound Leads"
        value={qualifiedLeads}
        change={25.0}
        changePeriod="conversion velocity"
        icon={<UserPlus className="w-5 h-5" />}
        iconBg="bg-purple-50"
        iconColor="text-purple-600"
        onClick={() => dispatch(setActiveTab('leads'))}
      />
    </div>
  );
};
export default MetricsSummary;
