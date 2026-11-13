import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { closeModal, openModal, addToast, setActiveTab } from '@/store/uiSlice';
import { updateLeadStatus, deleteLead } from '@/modules/leads/leadsSlice';
import { addDeal } from '@/modules/pipeline/dealsSlice';
import { addCustomer } from '@/modules/customers/customersSlice';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/Button';
import { Avatar } from '@/components/Avatar';
import { formatCurrency, formatDate, getLeadStatusColor } from '@/utils/formatters';
import { WhatsAppModal } from '@/modules/activities/WhatsAppModal';
import {
  Mail,
  Phone,
  Building2,
  Calendar,
  Sparkles,
  ArrowRight,
  UserCheck,
  Trash2,
  CheckCircle2,
  Tag,
  Shield,
  Briefcase,
  MessageSquare,
} from 'lucide-react';

export const LeadDetailModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.ui.modals.leadDetailOpen);
  const selectedLeadId = useAppSelector((state) => state.leads.selectedLeadId);
  const leads = useAppSelector((state) => state.leads.items);
  const [waModalOpen, setWaModalOpen] = useState(false);

  const lead = leads.find((l) => l.id === selectedLeadId);

  if (!isOpen || !lead) return null;

  const handleClose = () => {
    dispatch(closeModal('leadDetailOpen'));
  };

  const handleConvertToCustomerAndDeal = () => {
    // 1. Mark lead as converted
    dispatch(updateLeadStatus({ id: lead.id, status: 'Converted' }));

    // 2. Add as deal in pipeline
    dispatch(
      addDeal({
        title: `${lead.company} - Platform License`,
        company: lead.company,
        amount: lead.estimatedValue,
        stage: 'Proposal',
        probability: 60,
        expectedCloseDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        assignedTo: lead.assignedTo,
        assignedAvatar: lead.assignedAvatar,
        priority: 'High',
        tags: lead.tags,
        notes: lead.notes,
      })
    );

    // 3. Add as customer
    dispatch(
      addCustomer({
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        company: lead.company,
        title: lead.title,
        industry: 'Technology',
        status: 'Active',
        totalRevenue: lead.estimatedValue,
        healthScore: 90,
        accountManager: lead.assignedTo,
        tier: 'Enterprise',
        address: {
          city: 'Mumbai',
          state: 'Maharashtra',
          country: lead.country || 'India',
        },
        tags: lead.tags,
        notes: lead.notes || 'Converted from inbound qualified lead.',
      })
    );

    dispatch(
      addToast({
        type: 'success',
        title: 'Lead Converted Successfully',
        message: `${lead.name} has been converted into an active Customer and Sales Deal.`,
      })
    );

    handleClose();
    dispatch(setActiveTab('pipeline'));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Lead Profile & Dossier"
      description={`ID: ${lead.id}`}
      maxWidth="2xl"
    >
      <div className="space-y-6">
        {/* Top Header Card */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
          <div className="flex items-center gap-3.5">
            <Avatar name={lead.name} size="lg" />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900">{lead.name}</h3>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${getLeadStatusColor(
                    lead.status
                  )}`}
                >
                  {lead.status}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                {lead.title} at <span className="font-semibold text-slate-900">{lead.company}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[11px] text-slate-400 uppercase font-semibold block">
                Lead Score
              </span>
              <span className="text-xl font-extrabold text-indigo-600 flex items-center gap-1 justify-end">
                <Sparkles className="w-4 h-4 text-amber-500 inline" />
                {lead.score}/100
              </span>
            </div>
          </div>
        </div>

        {/* Conversion Action Banner */}
        {lead.status !== 'Converted' && (
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-indigo-500/10 border border-indigo-200/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-indigo-600" /> Ready to Advance Lead?
              </p>
              <p className="text-[11px] text-indigo-700 mt-0.5">
                Convert this lead directly into a Sales Pipeline Deal and Customer Account.
              </p>
            </div>
            <Button
              size="sm"
              onClick={handleConvertToCustomerAndDeal}
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Convert to Deal
            </Button>
          </div>
        )}

        {/* Contact & Business Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-3 p-4 rounded-xl border border-slate-200 bg-white shadow-2xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Contact Details
            </h4>
            <div className="space-y-2 text-xs text-slate-700">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-400" />
                <a href={`mailto:${lead.email}`} className="text-indigo-600 hover:underline">
                  {lead.email}
                </a>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span>{lead.phone}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setWaModalOpen(true)}
                  className="flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded transition-colors"
                  title="Direct WhatsApp outreach"
                >
                  <MessageSquare className="w-3 h-3 text-emerald-500" />
                  WhatsApp
                </button>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-slate-400" />
                <span>{lead.company}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>Created on {formatDate(lead.createdAt)}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3 p-4 rounded-xl border border-slate-200 bg-white shadow-2xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Sales Intelligence
            </h4>
            <div className="space-y-2 text-xs text-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-500">Estimated Deal Value:</span>
                <span className="font-bold text-slate-900">{formatCurrency(lead.estimatedValue)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Acquisition Source:</span>
                <span className="font-semibold text-slate-800">{lead.source}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Assigned Account AE:</span>
                <span className="font-semibold text-indigo-600">{lead.assignedTo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Target Region:</span>
                <span className="font-medium text-slate-700">{lead.country || 'Global'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tags */}
        {lead.tags && lead.tags.length > 0 && (
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5" /> Segmentation Tags
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {lead.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 text-xs rounded-md bg-slate-100 text-slate-700 font-medium border border-slate-200"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Follow-up Status Banner */}
        {lead.nextFollowUpDate && (
          <div className="p-3.5 rounded-xl bg-indigo-50 [data-theme='sunset-copper']_&:bg-[#2a1711] border border-indigo-200 [data-theme='sunset-copper']_&:border-[#ca5e3a]/40 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-indigo-600 [data-theme='sunset-copper']_&:bg-[#ca5e3a] text-white">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 [data-theme='sunset-copper']_&:text-white">
                  Next Follow-up Scheduled: {formatDate(lead.nextFollowUpDate)}
                </p>
                <p className="text-[11px] text-slate-500 [data-theme='sunset-copper']_&:text-slate-300">
                  Channel: {lead.nextFollowUpType || 'Call'} {lead.nextFollowUpNotes ? `• ${lead.nextFollowUpNotes}` : ''}
                </p>
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                handleClose();
                dispatch(openModal('leadFollowUpOpen'));
              }}
            >
              Reschedule
            </Button>
          </div>
        )}

        {/* Notes */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Discovery & Interaction Notes
          </h4>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
            {lead.notes || 'No discovery notes recorded yet.'}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              if (confirm('Delete this lead?')) {
                dispatch(deleteLead(lead.id));
                handleClose();
              }
            }}
            leftIcon={<Trash2 className="w-3.5 h-3.5" />}
          >
            Delete Lead
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                handleClose();
                dispatch(openModal('leadFollowUpOpen'));
              }}
              leftIcon={<Calendar className="w-3.5 h-3.5" />}
            >
              Schedule Follow-up
            </Button>
            <Button variant="outline" size="sm" onClick={handleClose}>
              Close
            </Button>
          </div>
        </div>
      </div>

      <WhatsAppModal
        isOpen={waModalOpen}
        onClose={() => setWaModalOpen(false)}
        recipientName={lead.name}
        companyName={lead.company}
        recipientPhone={lead.phone}
        contextTitle={`${lead.company} - Expansion Proposal`}
        entityType="lead"
        entityId={lead.id}
      />
    </Modal>
  );
};

