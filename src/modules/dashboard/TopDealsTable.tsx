import React from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { setSelectedDealId } from '@/modules/pipeline/dealsSlice';
import { openModal, setActiveTab } from '@/store/uiSlice';
import { formatCurrency, formatDate, getPriorityBadge } from '@/utils/formatters';
import { Avatar } from '@/components/Avatar';
import { ArrowRight, Sparkles } from 'lucide-react';

export const TopDealsTable: React.FC = () => {
  const dispatch = useAppDispatch();
  const deals = useAppSelector((state) => state.deals.items);
  const workspaceScope = useAppSelector((state) => state.ui.workspaceScope);
  const currentUser = useAppSelector((state) => state.auth.user);

  const scopedDeals = deals.filter((d) => {
    if (workspaceScope === 'personal' && currentUser) {
      return d.assignedTo.toLowerCase() === currentUser.name.toLowerCase();
    }
    return true;
  });

  // Top 5 deals sorted by amount
  const topDeals = [...scopedDeals]
    .filter((d) => d.stage !== 'Closed Lost')
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  const handleOpenDeal = (dealId: string) => {
    dispatch(setSelectedDealId(dealId));
    dispatch(openModal('dealDetailOpen'));
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            {workspaceScope === 'personal' ? 'My Strategic Deals' : 'High-Impact Strategic Deals'}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {workspaceScope === 'personal'
              ? 'Your top high-value deal opportunities'
              : 'Key opportunities with highest contract valuation'}
          </p>
        </div>
        <button
          onClick={() => dispatch(setActiveTab('pipeline'))}
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
        >
          <span>View Pipeline</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Mobile Card List (< 640px) */}
      <div className="sm:hidden divide-y divide-slate-100">
        {topDeals.map((deal) => (
          <div
            key={deal.id}
            onClick={() => handleOpenDeal(deal.id)}
            className="py-3 px-1 space-y-2 hover:bg-slate-50/80 transition-colors cursor-pointer"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="font-bold text-xs text-slate-900 truncate">{deal.title}</p>
                <p className="text-[11px] text-slate-500 truncate">{deal.company}</p>
              </div>
              <span className="font-extrabold text-xs text-slate-900 shrink-0">
                {formatCurrency(deal.amount)}
              </span>
            </div>

            <div className="flex items-center justify-between text-[11px] pt-1">
              <span className="px-2 py-0.5 rounded-full font-medium bg-slate-100 text-slate-700 text-[10px]">
                {deal.stage}
              </span>
              <div className="flex items-center gap-2">
                <span className="font-medium text-emerald-600 flex items-center gap-0.5">
                  <Sparkles className="w-3 h-3 text-amber-500 inline" />
                  {deal.probability}%
                </span>
                <span className="text-slate-400">•</span>
                <div className="flex items-center gap-1">
                  <Avatar name={deal.assignedTo} src={deal.assignedAvatar} size="xs" />
                  <span className="text-slate-600 font-medium">
                    {deal.assignedTo.split(' ')[0]}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop & Tablet Table (>= 640px) */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
            <tr>
              <th className="py-2.5 px-3">Opportunity</th>
              <th className="py-2.5 px-3">Stage</th>
              <th className="py-2.5 px-3">Value</th>
              <th className="py-2.5 px-3">Win %</th>
              <th className="py-2.5 px-3">Owner</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {topDeals.map((deal) => (
              <tr
                key={deal.id}
                onClick={() => handleOpenDeal(deal.id)}
                className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
              >
                <td className="py-3 px-3">
                  <p className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {deal.title}
                  </p>
                  <p className="text-[11px] text-slate-500">{deal.company}</p>
                </td>
                <td className="py-3 px-3">
                  <span className="px-2 py-0.5 rounded-full font-medium bg-slate-100 text-slate-700">
                    {deal.stage}
                  </span>
                </td>
                <td className="py-3 px-3 font-bold text-slate-900">
                  {formatCurrency(deal.amount)}
                </td>
                <td className="py-3 px-3">
                  <span className="font-medium text-emerald-600 flex items-center gap-0.5">
                    <Sparkles className="w-3 h-3 text-amber-500 inline" />
                    {deal.probability}%
                  </span>
                </td>
                <td className="py-3 px-3">
                  <div className="flex items-center gap-1.5">
                    <Avatar name={deal.assignedTo} src={deal.assignedAvatar} size="xs" />
                    <span className="text-slate-700 font-medium truncate max-w-[100px]">
                      {deal.assignedTo.split(' ')[0]}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

