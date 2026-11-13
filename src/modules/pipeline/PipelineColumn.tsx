import React from 'react';
import { useAppDispatch } from '@/store';
import { openModal } from '@/store/uiSlice';
import { Deal, DealStage } from '@/types/crm';
import { DealCard } from './DealCard';
import { formatCurrency, getStageColor } from '@/utils/formatters';
import { Plus } from 'lucide-react';

interface PipelineColumnProps {
  stage: DealStage;
  deals: Deal[];
}

export const PipelineColumn: React.FC<PipelineColumnProps> = ({ stage, deals }) => {
  const dispatch = useAppDispatch();
  const totalAmount = deals.reduce((sum, d) => sum + d.amount, 0);

  const getStageHeaderAccent = (stg: DealStage) => {
    switch (stg) {
      case 'Discovery':
        return 'border-t-sky-500';
      case 'Qualification':
        return 'border-t-[#ca5e3a]';
      case 'Proposal':
        return 'border-t-[#e08a68]';
      case 'Negotiation':
        return 'border-t-amber-500';
      case 'Contract Sent':
        return 'border-t-purple-500';
      case 'Closed Won':
        return 'border-t-emerald-500';
      case 'Closed Lost':
        return 'border-t-rose-500';
      default:
        return 'border-t-[#ca5e3a]';
    }
  };

  return (
    <div
      id={`pipeline-col-${stage}`}
      className={`w-[calc(100vw-1.5rem)] sm:w-[320px] md:w-[340px] lg:w-80 shrink-0 snap-start sm:snap-start lg:snap-align-none flex flex-col bg-slate-100/70 dark:bg-[#18110e] [data-theme='sunset-copper']_&:bg-[#18110e] rounded-2xl border border-slate-200/90 dark:border-[#2e1f18] [data-theme='sunset-copper']_&:border-[#2e1f18] border-t-4 ${getStageHeaderAccent(
        stage
      )} max-h-[calc(100vh-16rem)] sm:max-h-[calc(100vh-13rem)] shadow-2xs`}
    >
      {/* Column Header */}
      <div className="p-3.5 sm:p-4 border-b border-slate-200/80 dark:border-[#2e1f18] [data-theme='sunset-copper']_&:border-[#2e1f18] bg-white/70 dark:bg-[#201511] [data-theme='sunset-copper']_&:bg-[#201511] backdrop-blur-xs rounded-t-xl">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-bold text-sm text-slate-800 dark:text-[#fbf5f2] [data-theme='sunset-copper']_&:text-[#fbf5f2] flex items-center gap-1.5 sm:gap-2">
            <span>{stage}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200/80 dark:bg-[#2d1c16] [data-theme='sunset-copper']_&:bg-[#2d1c16] text-slate-700 dark:text-[#e08a68] [data-theme='sunset-copper']_&:text-[#e08a68] border border-transparent dark:border-[#ca5e3a]/30 [data-theme='sunset-copper']_&:border-[#ca5e3a]/30 font-semibold">
              {deals.length}
            </span>
          </h3>
          <button
            onClick={() => dispatch(openModal('dealFormOpen'))}
            className="p-1 rounded-md text-slate-400 hover:text-[#ca5e3a] hover:bg-slate-200/60 dark:hover:bg-[#2d1c16] [data-theme='sunset-copper']_&:hover:bg-[#2d1c16] transition-colors"
            title={`Add deal to ${stage}`}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <div className="text-xs font-semibold text-slate-500 dark:text-[#9f8c83] [data-theme='sunset-copper']_&:text-[#9f8c83]">
          Total: <span className="text-slate-800 dark:text-[#fbf5f2] [data-theme='sunset-copper']_&:text-[#fbf5f2] font-bold">{formatCurrency(totalAmount)}</span>
        </div>
      </div>

      {/* Cards Scroll Container */}
      <div className="flex-1 p-2.5 sm:p-3 overflow-y-auto space-y-2.5 sm:space-y-3 min-h-[14rem]">
        {deals.map((deal) => (
          <DealCard key={deal.id} deal={deal} />
        ))}

        {deals.length === 0 && (
          <div className="h-32 border-2 border-dashed border-slate-200 dark:border-[#38241c] [data-theme='sunset-copper']_&:border-[#38241c] bg-white/30 dark:bg-[#140e0c] [data-theme='sunset-copper']_&:bg-[#140e0c] rounded-xl flex items-center justify-center text-xs font-medium text-slate-400 dark:text-[#8d7970] [data-theme='sunset-copper']_&:text-[#8d7970]">
            No deals in {stage}
          </div>
        )}
      </div>
    </div>
  );
};

