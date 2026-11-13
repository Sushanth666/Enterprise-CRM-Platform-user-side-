import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  setSearchQuery,
  setAssignedFilter,
  setSelectedDealId,
} from '@/modules/pipeline/dealsSlice';
import { openModal } from '@/store/uiSlice';
import { DealStage } from '@/types/crm';
import { PipelineColumn } from './PipelineColumn';
import { Button } from '@/components/Button';
import { formatCurrency } from '@/utils/formatters';
import { mockTeamMembers } from '@/data/mockData';
import {
  Plus,
  Search,
  Filter,
  DollarSign,
  TrendingUp,
  Award,
  Layers,
  User,
  Users,
} from 'lucide-react';

export const PipelineBoard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, searchQuery, assignedFilter } = useAppSelector((state) => state.deals);
  const currentUser = useAppSelector((state) => state.auth.user);
  const workspaceScope = useAppSelector((state) => state.ui.workspaceScope);
  const [activeMobileStage, setActiveMobileStage] = React.useState<DealStage>('Discovery');

  const stages: DealStage[] = [
    'Discovery',
    'Qualification',
    'Proposal',
    'Negotiation',
    'Contract Sent',
    'Closed Won',
    'Closed Lost',
  ];

  const myDealsCount = items.filter(
    (d) => d.assignedTo.toLowerCase() === currentUser.name.toLowerCase()
  ).length;

  useEffect(() => {
    dispatch(setAssignedFilter(workspaceScope === 'personal' ? 'My Deals' : 'All'));
  }, [workspaceScope, dispatch]);

  // Filtering
  const filteredDeals = items.filter((deal) => {
    const matchesSearch =
      deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deal.company.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesAssigned =
      assignedFilter === 'My Deals'
        ? deal.assignedTo.toLowerCase() === currentUser.name.toLowerCase()
        : assignedFilter === 'All' || deal.assignedTo === assignedFilter;

    return matchesSearch && matchesAssigned;
  });

  // Calculate Pipeline KPIs
  const activeDeals = filteredDeals.filter(
    (d) => d.stage !== 'Closed Won' && d.stage !== 'Closed Lost'
  );
  const totalPipelineValue = activeDeals.reduce((sum, d) => sum + d.amount, 0);
  const wonDealsValue = filteredDeals
    .filter((d) => d.stage === 'Closed Won')
    .reduce((sum, d) => sum + d.amount, 0);
  const avgProbability =
    activeDeals.length > 0
      ? Math.round(
          activeDeals.reduce((sum, d) => sum + d.probability, 0) / activeDeals.length
        )
      : 0;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Top Pipeline KPI Bar - Symmetrical stack on mobile, 3-col on tablet/desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 sm:p-4 shadow-2xs card-hover-lift flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <p className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider truncate">
              Active Pipeline Value
            </p>
            <p className="text-xl sm:text-lg md:text-xl lg:text-2xl font-bold text-slate-900 mt-0.5 sm:mt-1 truncate">
              {formatCurrency(totalPipelineValue)}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5 truncate">{activeDeals.length} deals in flight</p>
          </div>
          <div className="p-2 sm:p-3 rounded-xl bg-[#2a1711] text-[#ca5e3a] border border-[#ca5e3a]/30 shrink-0 ml-2">
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 sm:p-4 shadow-2xs card-hover-lift flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <p className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider truncate">
              Closed Won Revenue
            </p>
            <p className="text-xl sm:text-lg md:text-xl lg:text-2xl font-bold text-[#ca5e3a] mt-0.5 sm:mt-1 truncate">
              {formatCurrency(wonDealsValue)}
            </p>
            <p className="text-[11px] text-[#e08a68] font-medium mt-0.5 truncate">Quarterly quota pace: 93%</p>
          </div>
          <div className="p-2 sm:p-3 rounded-xl bg-[#2a1711] text-[#ca5e3a] border border-[#ca5e3a]/30 shrink-0 ml-2">
            <Award className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 sm:p-4 shadow-2xs card-hover-lift flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <p className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider truncate">
              Avg. Win Confidence
            </p>
            <p className="text-xl sm:text-lg md:text-xl lg:text-2xl font-bold text-slate-900 mt-0.5 sm:mt-1 truncate">{avgProbability}%</p>
            <p className="text-[11px] text-slate-400 mt-0.5 truncate">Weighted stage probability</p>
          </div>
          <div className="p-2 sm:p-3 rounded-xl bg-[#271a13] text-amber-500 border border-amber-500/20 shrink-0 ml-2">
            <Layers className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        </div>
      </div>

      {/* Scope Pill Tabs: My Deals vs All Deals */}
      <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 w-full sm:w-auto">
        <button
          type="button"
          onClick={() => dispatch(setAssignedFilter('My Deals'))}
          className={`justify-center sm:justify-start px-2.5 sm:px-3 py-2 sm:py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
            assignedFilter === 'My Deals'
              ? 'bg-indigo-600 [data-theme="sunset-copper"]_&:bg-[#ca5e3a] text-white shadow-2xs font-bold'
              : 'border border-slate-200 dark:border-[#38261f] bg-white dark:bg-[#1f1512] text-slate-700 dark:text-slate-300 hover:text-[#ca5e3a]'
          }`}
        >
          <User className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate sm:hidden">My Deals</span>
          <span className="hidden sm:inline truncate">My Ongoing Deals</span>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] shrink-0 ${
              assignedFilter === 'My Deals' ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-[#2e1d17] text-slate-700 dark:text-slate-300'
            }`}
          >
            {myDealsCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => dispatch(setAssignedFilter('All'))}
          className={`justify-center sm:justify-start px-2.5 sm:px-3 py-2 sm:py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
            assignedFilter === 'All'
              ? 'bg-indigo-600 [data-theme="sunset-copper"]_&:bg-[#ca5e3a] text-white shadow-2xs font-bold'
              : 'border border-slate-200 dark:border-[#38261f] bg-white dark:bg-[#1f1512] text-slate-700 dark:text-slate-300 hover:text-[#ca5e3a]'
          }`}
        >
          <Users className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate sm:hidden">All Deals</span>
          <span className="hidden sm:inline truncate">All Pipeline Deals</span>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] shrink-0 ${
              assignedFilter === 'All' ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-[#2e1d17] text-slate-700 dark:text-slate-300'
            }`}
          >
            {items.length}
          </span>
        </button>
      </div>

      {/* Filter and Action Header - Perfectly aligned full-width controls */}
      <div className="bg-white dark:bg-[#1f1512] p-3.5 sm:p-4 rounded-xl border border-slate-200/80 dark:border-[#38261f] shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex flex-col sm:flex-row flex-1 items-stretch sm:items-center gap-2.5 sm:gap-3 max-w-xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search deals by title or account name..."
              value={searchQuery}
              onChange={(e) => dispatch(setSearchQuery(e.target.value))}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-[#38261f] bg-white dark:bg-[#18100d] text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#ca5e3a]/20 focus:border-[#ca5e3a]"
            />
          </div>

          <select
            value={assignedFilter}
            onChange={(e) => dispatch(setAssignedFilter(e.target.value))}
            className="w-full sm:w-auto rounded-lg border border-slate-300 dark:border-[#38261f] bg-white dark:bg-[#18100d] px-3 py-2 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#ca5e3a]/20 cursor-pointer"
          >
            <option value="All">All Account Reps</option>
            {mockTeamMembers.map((m) => (
              <option key={m.id} value={m.name}>
                {m.name}
              </option>
            ))}
          </select>
        </div>

        <Button
          onClick={() => dispatch(openModal('dealFormOpen'))}
          leftIcon={<Plus className="w-4 h-4" />}
          size="sm"
          className="w-full sm:w-auto shrink-0"
        >
          Add Opportunity
        </Button>
      </div>

      {/* Mobile & Tablet Quick Stage Selector Tabs (< 1024px) */}
      <div className="lg:hidden flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar scroll-smooth">
        {stages.map((stage) => {
          const stageCount = filteredDeals.filter((d) => d.stage === stage).length;
          const isActive = activeMobileStage === stage;
          return (
            <button
              key={stage}
              type="button"
              onClick={() => {
                setActiveMobileStage(stage);
                const el = document.getElementById(`pipeline-col-${stage}`);
                el?.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg shrink-0 border transition-all ${
                isActive
                  ? 'bg-indigo-600 [data-theme="sunset-copper"]_&:bg-[#ca5e3a] text-white border-transparent shadow-xs font-bold'
                  : 'border-slate-200 dark:border-[#38261f] bg-white dark:bg-[#1f1512] text-slate-700 dark:text-slate-300 hover:text-[#ca5e3a]'
              }`}
            >
              {stage} <span className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-[#271a14] text-slate-600 dark:text-slate-400'}`}>{stageCount}</span>
            </button>
          );
        })}
      </div>

      {/* Horizontal Pipeline Columns - Exactly matching content width */}
      <div className="overflow-x-auto pb-4 snap-x snap-mandatory lg:snap-none scrollbar-thin">
        <div className="flex items-start gap-3 sm:gap-4 w-max">
          {stages.map((stage) => {
            const stageDeals = filteredDeals.filter((d) => d.stage === stage);
            return <PipelineColumn key={stage} stage={stage} deals={stageDeals} />;
          })}
        </div>
      </div>
    </div>
  );
};

