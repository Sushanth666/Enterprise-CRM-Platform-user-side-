import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  setCustomerSearchQuery,
  setCustomerTierFilter,
  setCustomerStatusFilter,
  setSelectedCustomerId,
  deleteCustomer,
} from '@/modules/customers/customersSlice';
import { openModal, addToast } from '@/store/uiSlice';
import { Customer } from '@/types/crm';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { Avatar } from '@/components/Avatar';
import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { CustomerProfileView } from './CustomerProfileView';
import {
  Search,
  Plus,
  Building,
  Mail,
  Phone,
  ArrowUpRight,
  ShieldCheck,
  HeartHandshake,
  DollarSign,
  Users,
} from 'lucide-react';

export const CustomerList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, searchQuery, tierFilter, statusFilter, selectedCustomerId } = useAppSelector(
    (state) => state.customers
  );
  const currentUser = useAppSelector((state) => state.auth.user);
  const workspaceScope = useAppSelector((state) => state.ui.workspaceScope);
  const [accountScope, setAccountScope] = useState<'all' | 'my'>(
    workspaceScope === 'personal' ? 'my' : 'all'
  );

  useEffect(() => {
    setAccountScope(workspaceScope === 'personal' ? 'my' : 'all');
  }, [workspaceScope]);

  const myAccountsCount = items.filter(
    (c) => c.accountManager.toLowerCase() === currentUser.name.toLowerCase()
  ).length;

  const selectedCustomer = items.find((c) => c.id === selectedCustomerId);

  // If a customer is selected, show their full dossier view!
  if (selectedCustomer) {
    return (
      <CustomerProfileView
        customer={selectedCustomer}
        onBack={() => dispatch(setSelectedCustomerId(null))}
      />
    );
  }

  // Filter
  const filteredCustomers = items.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.industry.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTier = tierFilter === 'All' || c.tier === tierFilter;
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    const matchesScope =
      accountScope === 'my'
        ? c.accountManager.toLowerCase() === currentUser.name.toLowerCase()
        : true;

    return matchesSearch && matchesTier && matchesStatus && matchesScope;
  });

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'Enterprise':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Mid-Market':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Growth':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Onboarding':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Churned':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Scope Pill Tabs: My Accounts vs All Accounts */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setAccountScope('my')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
            accountScope === 'my'
              ? 'bg-indigo-600 [data-theme="sunset-copper"]_&:bg-[#ca5e3a] text-white shadow-2xs font-bold'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <span>👤 My Managed Accounts</span>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] ${
              accountScope === 'my' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
            }`}
          >
            {myAccountsCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setAccountScope('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
            accountScope === 'all'
              ? 'bg-indigo-600 [data-theme="sunset-copper"]_&:bg-[#ca5e3a] text-white shadow-2xs font-bold'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <span>🏢 All Enterprise Accounts</span>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] ${
              accountScope === 'all' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
            }`}
          >
            {items.length}
          </span>
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex flex-col sm:flex-row flex-1 items-stretch sm:items-center gap-2 sm:gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search accounts by name, company, industry..."
              value={searchQuery}
              onChange={(e) => dispatch(setCustomerSearchQuery(e.target.value))}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center sm:gap-3">
            <select
              value={tierFilter}
              onChange={(e) => dispatch(setCustomerTierFilter(e.target.value))}
              className="w-full sm:w-auto rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="All">All Tiers</option>
              <option value="Enterprise">Enterprise</option>
              <option value="Mid-Market">Mid-Market</option>
              <option value="Growth">Growth</option>
              <option value="Startup">Startup</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => dispatch(setCustomerStatusFilter(e.target.value))}
              className="w-full sm:w-auto rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Onboarding">Onboarding</option>
              <option value="Churned">Churned</option>
            </select>
          </div>
        </div>

        <Button
          onClick={() => dispatch(openModal('customerFormOpen'))}
          leftIcon={<Plus className="w-4 h-4" />}
          size="sm"
          className="w-full sm:w-auto"
        >
          Add Customer
        </Button>
      </div>

      {/* Customer Grid */}
      {filteredCustomers.length === 0 ? (
        <EmptyState
          icon={<Users className="w-8 h-8" />}
          title="No Customer Profiles Found"
          description="Adjust your search criteria or add your first customer account."
          actionText="Add Customer"
          onAction={() => dispatch(openModal('customerFormOpen'))}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCustomers.map((customer) => (
            <div
              key={customer.id}
              onClick={() => dispatch(setSelectedCustomerId(customer.id))}
              className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs card-hover-lift hover:border-indigo-400 cursor-pointer group flex flex-col justify-between"
            >
              <div>
                {/* Header: Company, Tier, Status */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-3">
                    <Avatar name={customer.company} src={customer.avatar} size="md" />
                    <div>
                      <h4 className="font-bold text-base text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {customer.company}
                      </h4>
                      <p className="text-xs text-slate-500">{customer.industry}</p>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getTierBadge(
                      customer.tier
                    )}`}
                  >
                    {customer.tier}
                  </span>
                </div>

                {/* Primary Contact */}
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 my-3 text-xs space-y-1">
                  <p className="font-semibold text-slate-800 flex items-center justify-between">
                    <span>{customer.name}</span>
                    <span
                      className={`text-[10px] px-2 py-0.2 rounded-full font-semibold border ${getStatusBadge(
                        customer.status
                      )}`}
                    >
                      {customer.status}
                    </span>
                  </p>
                  <p className="text-slate-500 text-[11px]">{customer.title}</p>
                  <p className="text-slate-400 text-[11px] truncate">{customer.email}</p>
                </div>
              </div>

              <div>
                {/* Metrics: Revenue & Health Score */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-semibold uppercase text-slate-400 block">
                      Total Revenue
                    </span>
                    <span className="text-sm font-bold text-slate-900">
                      {formatCurrency(customer.totalRevenue)}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-semibold uppercase text-slate-400 block">
                      Health Score
                    </span>
                    <span
                      className={`text-sm font-bold ${
                        customer.healthScore >= 90
                          ? 'text-emerald-600'
                          : customer.healthScore >= 75
                          ? 'text-indigo-600'
                          : 'text-rose-600'
                      }`}
                    >
                      {customer.healthScore}/100
                    </span>
                  </div>
                </div>

                {/* Footer link */}
                <div className="mt-3 pt-2 border-t border-slate-50 flex items-center justify-between text-xs text-indigo-600 font-semibold group-hover:translate-x-0.5 transition-transform">
                  <span>View Full Profile</span>
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

