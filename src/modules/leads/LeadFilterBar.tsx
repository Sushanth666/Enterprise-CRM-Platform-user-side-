import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  setSearchQuery,
  setStatusFilter,
  setSourceFilter,
  setAssignedFilter,
  setSortBy,
  toggleSortOrder,
  setViewMode,
} from '@/modules/leads/leadsSlice';
import { openModal } from '@/store/uiSlice';
import { Search, Plus, Filter, ArrowUpDown, User, Users, LayoutGrid, List } from 'lucide-react';
import { Button } from '@/components/Button';
import { LeadStatus, LeadSource } from '@/types/crm';

export const LeadFilterBar: React.FC = () => {
  const dispatch = useAppDispatch();
  const { searchQuery, statusFilter, sourceFilter, assignedFilter, sortBy, sortOrder, items, viewMode } = useAppSelector(
    (state) => state.leads
  );
  const currentUser = useAppSelector((state) => state.auth.user);
  const workspaceScope = useAppSelector((state) => state.ui.workspaceScope);

  const myLeadsCount = items.filter(
    (l) => l.assignedTo.toLowerCase() === currentUser.name.toLowerCase()
  ).length;

  useEffect(() => {
    dispatch(setAssignedFilter(workspaceScope === 'personal' ? 'My Leads' : 'All'));
  }, [workspaceScope, dispatch]);

  const statuses: (LeadStatus | 'All')[] = [
    'All',
    'New',
    'Contacted',
    'Qualified',
    'Proposal',
    'Negotiation',
    'Converted',
    'Unqualified',
  ];

  const sources: (LeadSource | 'All')[] = [
    'All',
    'Website',
    'LinkedIn',
    'Referral',
    'Cold Call',
    'Inbound Email',
    'Conference',
    'Partner',
  ];

  return (
    <div className="space-y-4 mb-6">
      {/* Scope Pill Tabs: My Assigned Leads vs All Leads (Aligned like Customer Profiles) */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => dispatch(setAssignedFilter('My Leads'))}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
            assignedFilter === 'My Leads'
              ? 'bg-indigo-600 [data-theme="sunset-copper"]_&:bg-[#ca5e3a] text-white shadow-2xs font-bold'
              : 'border border-slate-200 dark:border-[#38261f] bg-white dark:bg-[#1f1512] text-slate-700 dark:text-slate-300 hover:text-[#ca5e3a]'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>My Assigned Leads</span>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] ${
              assignedFilter === 'My Leads' ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-[#2e1d17] text-slate-700 dark:text-slate-300'
            }`}
          >
            {myLeadsCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => dispatch(setAssignedFilter('All'))}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
            assignedFilter === 'All'
              ? 'bg-indigo-600 [data-theme="sunset-copper"]_&:bg-[#ca5e3a] text-white shadow-2xs font-bold'
              : 'border border-slate-200 dark:border-[#38261f] bg-white dark:bg-[#1f1512] text-slate-700 dark:text-slate-300 hover:text-[#ca5e3a]'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>All Organization Leads</span>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] ${
              assignedFilter === 'All' ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-[#2e1d17] text-slate-700 dark:text-slate-300'
            }`}
          >
            {items.length}
          </span>
        </button>
      </div>

      {/* Search and Filters Bar (Clean single container matching Customer Profiles) */}
      <div className="bg-white dark:bg-[#1f1512] p-3.5 sm:p-4 rounded-xl border border-slate-200/80 dark:border-[#38261f] shadow-xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        <div className="flex flex-col sm:flex-row flex-1 items-stretch sm:items-center gap-2 sm:gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search leads by name, email, company..."
              value={searchQuery}
              onChange={(e) => dispatch(setSearchQuery(e.target.value))}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-[#38261f] bg-white dark:bg-[#18100d] text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#ca5e3a]/20 focus:border-[#ca5e3a]"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center sm:gap-3">
            <select
              value={statusFilter}
              onChange={(e) => dispatch(setStatusFilter(e.target.value as LeadStatus | 'All'))}
              className="w-full sm:w-auto rounded-lg border border-slate-300 dark:border-[#38261f] bg-white dark:bg-[#18100d] px-3 py-2 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#ca5e3a]/20 cursor-pointer"
            >
              {statuses.map((s) => (
                <option key={s} value={s}>
                  Status: {s}
                </option>
              ))}
            </select>

            <select
              value={sourceFilter}
              onChange={(e) => dispatch(setSourceFilter(e.target.value as LeadSource | 'All'))}
              className="w-full sm:w-auto rounded-lg border border-slate-300 dark:border-[#38261f] bg-white dark:bg-[#18100d] px-3 py-2 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#ca5e3a]/20 cursor-pointer"
            >
              {sources.map((s) => (
                <option key={s} value={s}>
                  Source: {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-2.5">
          {/* View Mode Toggle: Card Grid vs Table */}
          <div className="flex items-center rounded-lg border border-slate-200 dark:border-[#38261f] p-0.5 bg-slate-50 dark:bg-[#18100d]">
            <button
              type="button"
              onClick={() => dispatch(setViewMode('grid'))}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-[#281b16] text-[#ca5e3a] shadow-xs'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
              title="Card Grid View (Symmetrical Tablet Layout)"
              aria-label="Card Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => dispatch(setViewMode('table'))}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-[#281b16] text-[#ca5e3a] shadow-xs'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
              title="Table View"
              aria-label="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <Button
            onClick={() => dispatch(openModal('leadFormOpen'))}
            leftIcon={<Plus className="w-4 h-4" />}
            size="sm"
            className="w-full sm:w-auto shrink-0"
          >
            Add New Lead
          </Button>
        </div>
      </div>
    </div>
  );
};

