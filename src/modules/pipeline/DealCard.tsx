import React, { useState } from 'react';
import { useAppDispatch } from '@/store';
import { setSelectedDealId, updateDealStage } from '@/modules/pipeline/dealsSlice';
import { openModal } from '@/store/uiSlice';
import { Deal, DealStage } from '@/types/crm';
import {
  formatCurrency,
  formatDate,
  getPriorityBadge,
} from '@/utils/formatters';
import { calculateDealHealth } from '@/utils/dealHealth';
import { GstQuotationModal } from './GstQuotationModal';
import { WhatsAppModal } from '@/modules/activities/WhatsAppModal';
import { Avatar } from '@/components/Avatar';
import {
  Calendar,
  DollarSign,
  ArrowRight,
  Sparkles,
  MessageSquare,
  Receipt,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';

interface DealCardProps {
  deal: Deal;
}

export const DealCard: React.FC<DealCardProps> = ({ deal }) => {
  const dispatch = useAppDispatch();
  const [gstModalOpen, setGstModalOpen] = useState(false);
  const [waModalOpen, setWaModalOpen] = useState(false);

  const health = calculateDealHealth(deal);

  const handleCardClick = () => {
    dispatch(setSelectedDealId(deal.id));
    dispatch(openModal('dealDetailOpen'));
  };

  const handleStageSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.stopPropagation();
    dispatch(updateDealStage({ id: deal.id, stage: e.target.value as DealStage }));
  };

  const stages: DealStage[] = [
    'Discovery',
    'Qualification',
    'Proposal',
    'Negotiation',
    'Contract Sent',
    'Closed Won',
    'Closed Lost',
  ];

  return (
    <div
      onClick={handleCardClick}
      className="bg-white dark:bg-[#1f1512] [data-theme='sunset-copper']_&:bg-[#1f1512] rounded-xl border border-slate-200/90 dark:border-[#38261f] [data-theme='sunset-copper']_&:border-[#38261f] p-4 shadow-2xs card-hover-lift hover:border-[#ca5e3a] cursor-pointer group space-y-3 transition-colors"
    >
      {/* Top Header: Priority & Quick Stage Change */}
      <div className="flex items-center justify-between gap-1.5">
        <div className="flex items-center gap-1.5 flex-wrap min-w-0 flex-1">
          <span
            className={`text-[10px] font-bold uppercase tracking-wider px-1.5 sm:px-2 py-0.5 rounded-md border shrink-0 ${getPriorityBadge(
              deal.priority
            )}`}
          >
            {deal.priority}
          </span>
          <span
            title={health.riskReason || health.recommendation}
            className={`text-[10px] font-medium px-1.5 py-0.5 rounded flex items-center gap-1 border shrink-0 ${
              health.status === 'healthy'
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                : health.status === 'attention'
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                health.status === 'healthy'
                  ? 'bg-emerald-400'
                  : health.status === 'attention'
                  ? 'bg-amber-400'
                  : 'bg-rose-400 animate-pulse'
              }`}
            />
            {health.healthScore}% {health.status === 'risk' ? 'Risk' : 'Vel'}
          </span>
        </div>

        <select
          value={deal.stage}
          onClick={(e) => e.stopPropagation()}
          onChange={handleStageSelect}
          className="text-[10px] sm:text-[11px] font-medium text-slate-500 dark:text-slate-300 [data-theme='sunset-copper']_&:text-slate-300 bg-slate-50 dark:bg-[#170f0c] [data-theme='sunset-copper']_&:bg-[#170f0c] border border-slate-200 dark:border-[#3b271f] [data-theme='sunset-copper']_&:border-[#3b271f] rounded px-1.5 py-0.5 hover:text-slate-800 dark:hover:text-white [data-theme='sunset-copper']_&:hover:text-white focus:outline-none focus:ring-1 focus:ring-[#ca5e3a] cursor-pointer shrink-0 max-w-[105px] truncate"
          title="Move Deal Stage"
        >
          {stages.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* Title & Company */}
      <div>
        <h4 className="text-sm font-semibold text-slate-900 dark:text-[#fbf5f2] [data-theme='sunset-copper']_&:text-[#fbf5f2] group-hover:text-[#ca5e3a] transition-colors line-clamp-1">
          {deal.title}
        </h4>
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 [data-theme='sunset-copper']_&:text-slate-400 mt-0.5">{deal.company}</p>
      </div>

      {/* Amount & Win Probability */}
      <div className="flex items-baseline justify-between pt-1">
        <div className="text-base font-bold text-slate-900 dark:text-[#fbf5f2] [data-theme='sunset-copper']_&:text-[#fbf5f2] flex items-center">
          {formatCurrency(deal.amount)}
        </div>
        <div className="text-xs font-medium text-slate-500 dark:text-[#e08a68] [data-theme='sunset-copper']_&:text-[#e08a68] flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-500" />
          <span>{deal.probability}% win</span>
        </div>
      </div>

      {/* Probability bar */}
      <div className="w-full bg-slate-100 dark:bg-[#271a14] [data-theme='sunset-copper']_&:bg-[#271a14] rounded-full h-1.5 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            deal.probability >= 70
              ? 'bg-emerald-500'
              : deal.probability >= 40
              ? 'bg-[#ca5e3a]'
              : 'bg-amber-500'
          }`}
          style={{ width: `${deal.probability}%` }}
        />
      </div>

      {/* Footer: Date & Assignee & Quick Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-[#38261f] [data-theme='sunset-copper']_&:border-[#38261f] text-xs text-slate-400">
        <div className="flex items-center gap-1.5 text-[11px]">
          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>{formatDate(deal.expectedCloseDate)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Avatar name={deal.assignedTo} src={deal.assignedAvatar} size="xs" />
          <span className="text-[11px] font-medium text-slate-400 dark:text-slate-300">
            {deal.assignedTo.split(' ')[0]}
          </span>
        </div>
      </div>

      {/* Quick Action Buttons - Perfect 50/50 alignment */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setWaModalOpen(true);
          }}
          className="w-full flex items-center justify-center gap-1.5 px-2 py-1.5 text-[11px] font-medium text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-md transition-colors"
          title="Send WhatsApp update to client"
        >
          <MessageSquare className="w-3 h-3 text-emerald-400 shrink-0" />
          <span>WhatsApp</span>
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setGstModalOpen(true);
          }}
          className="w-full flex items-center justify-center gap-1.5 px-2 py-1.5 text-[11px] font-medium text-[#e08a68] hover:text-[#ca5e3a] bg-[#ca5e3a]/10 hover:bg-[#ca5e3a]/20 border border-[#ca5e3a]/30 rounded-md transition-colors"
          title="Generate GST-compliant commercial quotation"
        >
          <Receipt className="w-3 h-3 text-[#ca5e3a] shrink-0" />
          <span>GST Quote</span>
        </button>
      </div>

      {/* Modals */}
      <GstQuotationModal
        deal={deal}
        isOpen={gstModalOpen}
        onClose={() => setGstModalOpen(false)}
      />

      <WhatsAppModal
        isOpen={waModalOpen}
        onClose={() => setWaModalOpen(false)}
        recipientName={deal.company}
        companyName={deal.company}
        recipientPhone="+91 98765 43210"
        contextTitle={deal.title}
        entityType="deal"
        entityId={deal.id}
      />
    </div>
  );
};

