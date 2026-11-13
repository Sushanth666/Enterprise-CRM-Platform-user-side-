import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { closeModal, addToast } from '@/store/uiSlice';
import { updateDealStage, deleteDeal } from '@/modules/pipeline/dealsSlice';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/Button';
import { Avatar } from '@/components/Avatar';
import { DealStage } from '@/types/crm';
import { calculateDealHealth } from '@/utils/dealHealth';
import { GstQuotationModal } from './GstQuotationModal';
import { WhatsAppModal } from '@/modules/activities/WhatsAppModal';
import {
  formatCurrency,
  formatDate,
  getPriorityBadge,
  getStageColor,
} from '@/utils/formatters';
import {
  DollarSign,
  Calendar,
  Building,
  CheckCircle2,
  XCircle,
  Trash2,
  Sparkles,
  ArrowRight,
  TrendingUp,
  MessageSquare,
  Receipt,
  AlertTriangle,
  Activity,
} from 'lucide-react';

export const DealDetailModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.ui.modals.dealDetailOpen);
  const selectedDealId = useAppSelector((state) => state.deals.selectedDealId);
  const deals = useAppSelector((state) => state.deals.items);
  const [gstModalOpen, setGstModalOpen] = useState(false);
  const [waModalOpen, setWaModalOpen] = useState(false);

  const deal = deals.find((d) => d.id === selectedDealId);

  if (!isOpen || !deal) return null;

  const health = calculateDealHealth(deal);

  const handleClose = () => {
    dispatch(closeModal('dealDetailOpen'));
  };

  const handleStageChange = (newStage: DealStage) => {
    dispatch(updateDealStage({ id: deal.id, stage: newStage }));
    dispatch(
      addToast({
        type: newStage === 'Closed Won' ? 'success' : 'info',
        title: 'Deal Stage Updated',
        message: `${deal.title} moved to ${newStage}`,
      })
    );
  };

  const stages: DealStage[] = [
    'Discovery',
    'Qualification',
    'Proposal',
    'Negotiation',
    'Contract Sent',
    'Closed Won',
  ];

  const currentStageIndex = stages.indexOf(deal.stage as DealStage);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Sales Opportunity Dossier"
      description={`ID: ${deal.id}`}
      maxWidth="2xl"
    >
      <div className="space-y-6">
        {/* Deal Title Card */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${getPriorityBadge(
                  deal.priority
                )}`}
              >
                {deal.priority} Priority
              </span>
              <span className="text-xs px-2 py-0.5 rounded-md bg-[#2a1711] text-[#ca5e3a] font-semibold border border-[#ca5e3a]/30">
                {deal.stage}
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mt-1">{deal.title}</h3>
            <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
              <Building className="w-3.5 h-3.5" />
              <span>{deal.company}</span>
            </p>
          </div>

          <div className="text-right">
            <span className="text-[11px] font-semibold text-slate-400 uppercase">Deal Value</span>
            <span className="text-2xl font-extrabold text-slate-900 block">
              {formatCurrency(deal.amount)}
            </span>
          </div>
        </div>

        {/* Stage Stepper Progress Bar */}
        <div>
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-2">
            <span>Pipeline Progression</span>
            <span>Win Probability: {deal.probability}%</span>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
            {stages.map((stageName, idx) => {
              const isPassed = currentStageIndex >= idx;
              const isCurrent = deal.stage === stageName;

              return (
                <button
                  key={stageName}
                  type="button"
                  onClick={() => handleStageChange(stageName)}
                  className={`py-2 px-1 text-center rounded-lg text-[10px] sm:text-xs font-semibold transition-all ${
                    isCurrent
                      ? 'bg-gradient-to-r from-[#ca5e3a] to-[#dc7755] text-white shadow-xs'
                      : isPassed
                      ? 'bg-[#2f1d17] text-[#f1b8a4] border border-[#5c382a]/50'
                      : 'text-slate-500 hover:bg-slate-200/60'
                  }`}
                >
                  <span className="block truncate">{stageName}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* AI Deal Health & Velocity Insights */}
        <div
          className={`p-4 rounded-xl border ${
            health.status === 'healthy'
              ? 'bg-emerald-500/5 border-emerald-500/20'
              : health.status === 'attention'
              ? 'bg-amber-500/5 border-amber-500/20'
              : 'bg-rose-500/5 border-rose-500/20'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Activity
                className={`w-4 h-4 ${
                  health.status === 'healthy'
                    ? 'text-emerald-500'
                    : health.status === 'attention'
                    ? 'text-amber-500'
                    : 'text-rose-500'
                }`}
              />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                AI Deal Velocity & Slip-Risk Engine
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">
                Stage Stagnancy: <strong className="text-slate-800 dark:text-white">{health.daysInStage} days</strong>
              </span>
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                  health.status === 'healthy'
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : health.status === 'attention'
                    ? 'bg-amber-500/20 text-amber-400'
                    : 'bg-rose-500/20 text-rose-400'
                }`}
              >
                {health.healthScore}% Health ({health.status.toUpperCase()})
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            <strong className="text-slate-900 dark:text-white font-semibold">Recommended Playbook: </strong>
            {health.recommendation}
          </p>

          {health.riskReason && (
            <div className="mt-2 text-xs flex items-center gap-1.5 text-rose-500 font-medium">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Risk Warning: {health.riskReason}</span>
            </div>
          )}
        </div>

        {/* Quick Enterprise Accelerators */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setWaModalOpen(true)}
            className="flex-1 flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-semibold text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-lg transition-colors"
          >
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            WhatsApp Direct Outreach
          </button>
          <button
            type="button"
            onClick={() => setGstModalOpen(true)}
            className="flex-1 flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-semibold text-[#f1b8a4] bg-[#ca5e3a]/15 hover:bg-[#ca5e3a]/25 border border-[#ca5e3a]/40 rounded-lg transition-colors"
          >
            <Receipt className="w-4 h-4 text-[#ca5e3a]" />
            Generate GST Commercial Quotation
          </button>
        </div>

        {/* Commercial & Contract Terms */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Commercial Details
            </h4>
            <div className="space-y-2 text-xs text-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-500">Contract Amount:</span>
                <span className="font-bold text-slate-900">{formatCurrency(deal.amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Expected Close Date:</span>
                <span className="font-semibold text-slate-800">
                  {formatDate(deal.expectedCloseDate)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Lead Probability:</span>
                <span className="font-semibold text-emerald-600">{deal.probability}%</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Account Ownership
            </h4>
            <div className="flex items-center gap-3">
              <Avatar name={deal.assignedTo} src={deal.assignedAvatar} size="md" />
              <div>
                <p className="text-sm font-semibold text-slate-900">{deal.assignedTo}</p>
                <p className="text-xs text-slate-500">Lead Enterprise Account Executive</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tags */}
        {deal.tags && deal.tags.length > 0 && (
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Categorization Tags
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {deal.tags.map((t, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 text-xs rounded-md bg-slate-100 text-slate-700 font-medium"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Opportunity Notes
          </h4>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
            {deal.notes || 'No opportunity notes logged.'}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="success"
              onClick={() => handleStageChange('Closed Won')}
              leftIcon={<CheckCircle2 className="w-4 h-4" />}
            >
              Mark Closed Won
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleStageChange('Closed Lost')}
              leftIcon={<XCircle className="w-4 h-4 text-rose-500" />}
            >
              Mark Closed Lost
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                if (confirm('Delete this deal?')) {
                  dispatch(deleteDeal(deal.id));
                  handleClose();
                }
              }}
              leftIcon={<Trash2 className="w-3.5 h-3.5" />}
            >
              Delete
            </Button>
            <Button variant="outline" size="sm" onClick={handleClose}>
              Close
            </Button>
          </div>
        </div>
      </div>

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
    </Modal>
  );
};

