import React from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { openModal } from '@/store/uiSlice';
import { Customer } from '@/types/crm';
import { formatCurrency, formatDate, formatRelativeTime } from '@/utils/formatters';
import { Avatar } from '@/components/Avatar';
import { Button } from '@/components/Button';
import {
  ArrowLeft,
  Building,
  Mail,
  Phone,
  Globe,
  MapPin,
  Calendar,
  Shield,
  Activity,
  Plus,
  DollarSign,
  CheckSquare,
  Sparkles,
  TrendingUp,
} from 'lucide-react';

interface CustomerProfileViewProps {
  customer: Customer;
  onBack: () => void;
}

export const CustomerProfileView: React.FC<CustomerProfileViewProps> = ({
  customer,
  onBack,
}) => {
  const dispatch = useAppDispatch();
  const deals = useAppSelector((state) =>
    state.deals.items.filter((d) => d.company === customer.company)
  );
  const tasks = useAppSelector((state) =>
    state.tasks.items.filter((t) => t.relatedTo?.name === customer.company)
  );
  const activities = useAppSelector((state) =>
    state.activities.items.filter(
      (a) => a.entityName === customer.company || a.entityId === customer.id
    )
  );

  return (
    <div className="space-y-6">
      {/* Back Button & Action Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Customer Directory</span>
        </button>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => dispatch(openModal('activityFormOpen'))}
            leftIcon={<Activity className="w-3.5 h-3.5" />}
          >
            Log Activity
          </Button>
          <Button
            size="sm"
            onClick={() => dispatch(openModal('dealFormOpen'))}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            Create Opportunity
          </Button>
        </div>
      </div>

      {/* Main Profile Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <Avatar name={customer.company} src={customer.avatar} size="xl" />
            <div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  {customer.company}
                </h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200">
                  {customer.tier} Tier
                </span>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${
                    customer.status === 'Active'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}
                >
                  {customer.status}
                </span>
              </div>

              <p className="text-sm font-medium text-slate-600 mt-1">
                {customer.industry} • Joined {formatDate(customer.joinedDate)}
              </p>

              {/* Contact Pills */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 mt-3">
                <span className="flex items-center gap-1.5 font-medium">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <a href={`mailto:${customer.email}`} className="text-indigo-600 hover:underline">
                    {customer.email}
                  </a>
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <Phone className="w-4 h-4 text-slate-400" />
                  {customer.phone}
                </span>
                {customer.address && (
                  <span className="flex items-center gap-1.5 font-medium">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    {customer.address.city}, {customer.address.country}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-6 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100">
            <div className="text-left lg:text-right">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Lifetime Revenue
              </span>
              <p className="text-2xl font-black text-slate-900 mt-0.5">
                {formatCurrency(customer.totalRevenue)}
              </p>
              <p className="text-xs text-emerald-600 font-semibold mt-0.5 flex items-center gap-1 lg:justify-end">
                <TrendingUp className="w-3.5 h-3.5" /> High ARPU Account
              </p>
            </div>

            <div className="w-px h-12 bg-slate-200 hidden sm:block" />

            <div className="text-left lg:text-right">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Health Score
              </span>
              <p className="text-2xl font-black text-emerald-600 mt-0.5">
                {customer.healthScore}/100
              </p>
              <p className="text-xs text-slate-500 mt-0.5">Optimal satisfaction</p>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Left Column Details & Right Column Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Account Details & Deals */}
        <div className="lg:col-span-1 space-y-6">
          {/* Executive Stakeholder */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Primary Executive Contact
            </h3>
            <div className="flex items-center gap-3">
              <Avatar name={customer.name} size="md" />
              <div>
                <p className="font-bold text-sm text-slate-900">{customer.name}</p>
                <p className="text-xs text-slate-500">{customer.title}</p>
                <p className="text-xs text-indigo-600 font-medium mt-0.5">{customer.email}</p>
              </div>
            </div>
          </div>

          {/* Account Manager & Governance */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Dedicated Account AE
            </h3>
            <div className="flex items-center gap-3">
              <Avatar name={customer.accountManager} size="md" />
              <div>
                <p className="font-bold text-sm text-slate-900">{customer.accountManager}</p>
                <p className="text-xs text-slate-500">Enterprise Strategic Lead</p>
              </div>
            </div>
          </div>

          {/* Associated Deals */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Pipeline Deals ({deals.length})
              </h3>
              <button
                onClick={() => dispatch(openModal('dealFormOpen'))}
                className="text-xs text-indigo-600 font-medium hover:underline"
              >
                + New Deal
              </button>
            </div>

            <div className="space-y-2">
              {deals.map((d) => (
                <div
                  key={d.id}
                  className="p-3 rounded-lg border border-slate-100 bg-slate-50/70 text-xs"
                >
                  <div className="flex items-center justify-between font-semibold text-slate-900">
                    <span className="truncate">{d.title}</span>
                    <span className="shrink-0">{formatCurrency(d.amount)}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-500 mt-1">
                    <span>Stage: {d.stage}</span>
                    <span>{d.probability}% prob</span>
                  </div>
                </div>
              ))}
              {deals.length === 0 && (
                <p className="text-xs text-slate-400">No active deals registered.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Customer Interaction Timeline */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Activity className="w-4 h-4 text-indigo-600" />
                <span>Customer Interaction History & Touchpoints</span>
              </h3>
              <span className="text-xs text-slate-500">{activities.length} logged interactions</span>
            </div>

            <div className="space-y-4">
              {activities.map((act) => (
                <div
                  key={act.id}
                  className="flex items-start gap-3.5 p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                >
                  <Avatar name={act.performedBy} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-slate-900">{act.title}</p>
                      <span className="text-[11px] text-slate-400">
                        {formatRelativeTime(act.timestamp)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">{act.description}</p>
                    {act.outcome && (
                      <div className="mt-2 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md inline-block">
                        Outcome: {act.outcome}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {activities.length === 0 && (
                <div className="text-center py-8 text-xs text-slate-400">
                  No interactions logged for this customer yet. Click "Log Activity" above to record one.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

