import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { addActivity } from '@/modules/activities/activitiesSlice';
import { addToast } from '@/store/uiSlice';
import { MessageSquare, Send, CheckCircle2, Phone, Building } from 'lucide-react';

interface WhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientName: string;
  recipientPhone: string;
  companyName: string;
  contextTitle?: string;
  entityType?: 'lead' | 'deal' | 'customer';
  entityId?: string;
}

export const WhatsAppModal: React.FC<WhatsAppModalProps> = ({
  isOpen,
  onClose,
  recipientName,
  recipientPhone,
  companyName,
  contextTitle = '',
  entityType = 'lead',
  entityId = '',
}) => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.auth.user);

  const [phone, setPhone] = useState(recipientPhone || '+91 98201 44521');
  const [selectedTemplate, setSelectedTemplate] = useState('meeting_followup');

  const templates: Record<string, { label: string; text: string }> = {
    meeting_followup: {
      label: 'Demo Meeting Follow-up',
      text: `Hi ${recipientName}, thank you for taking the time to explore VedaFlow Sales Intelligence today for ${companyName}. I have documented our discussion notes and architecture takeaways. Looking forward to our next milestone. Best regards, ${currentUser.name} (${currentUser.company}).`,
    },
    proposal_shared: {
      label: 'Commercial Proposal Walkthrough',
      text: `Hi ${recipientName}, we have finalized the custom enterprise pricing and deployment scope for ${companyName}${contextTitle ? ` (${contextTitle})` : ''}. Would you be available for a brief 15-minute sync tomorrow to review the terms? Regards, ${currentUser.name}.`,
    },
    contract_review: {
      label: 'Contract & Legal Review Check-in',
      text: `Hi ${recipientName}, checking in regarding the Master Services Agreement shared with the legal team at ${companyName}. Please let us know if there are any clauses or DPDP compliance items we can clarify. Warm regards, ${currentUser.name}.`,
    },
    custom: {
      label: 'Custom Message',
      text: `Hi ${recipientName}, connecting from VedaFlow regarding our enterprise CRM initiative with ${companyName}.`,
    },
  };

  const [message, setMessage] = useState(templates.meeting_followup.text);

  const handleSelectTemplate = (key: string) => {
    setSelectedTemplate(key);
    setMessage(templates[key].text);
  };

  const handleSend = () => {
    // Sanitize phone number (remove spaces, dashes)
    const cleanPhone = phone.replace(/[^\d+]/g, '');
    const encodedMessage = encodeURIComponent(message);
    const waUrl = `https://wa.me/${cleanPhone.replace('+', '')}?text=${encodedMessage}`;

    // Open WhatsApp in new tab
    window.open(waUrl, '_blank', 'noopener,noreferrer');

    // Automatically record activity in CRM
    dispatch(
      addActivity({
        type: 'Note',
        title: `WhatsApp: ${recipientName}`,
        description: message,
        performedBy: currentUser?.name || 'Sales Rep',
        performedAvatar: currentUser?.avatar,
        entityType: 'Deal',
        entityId: entityId || 'entity-wa',
        entityName: companyName,
        outcome: 'WhatsApp template sent directly to prospect mobile number.',
      })
    );

    dispatch(
      addToast({
        type: 'success',
        title: 'WhatsApp Launched & Activity Logged',
        message: `Message dispatched to ${recipientName} and recorded in activity audit trail.`,
      })
    );

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="WhatsApp Enterprise Messenger"
      description={`Direct WhatsApp outreach to ${recipientName} at ${companyName}`}
      maxWidth="xl"
    >
      <div className="space-y-4 pt-1">
        {/* Contact Info Header */}
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-600 text-white">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-[#fbf5f2]">
                {recipientName} — <span className="text-emerald-700 dark:text-emerald-400 font-semibold">{companyName}</span>
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Official business chat with activity history sync
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200">
            WhatsApp Direct
          </span>
        </div>

        {/* Phone Input */}
        <Input
          label="Recipient Mobile Phone (with Country Code)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          leftIcon={<Phone className="w-4 h-4 text-emerald-600" />}
          placeholder="+91 98201 44521"
          required
        />

        {/* Template Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Select Enterprise Template
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {Object.entries(templates).map(([key, t]) => (
              <button
                key={key}
                type="button"
                onClick={() => handleSelectTemplate(key)}
                className={`p-2.5 text-left rounded-lg text-xs font-medium border transition-all ${
                  selectedTemplate === key
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-200 font-bold'
                    : 'border-slate-200 dark:border-[#38261f] bg-white dark:bg-[#1a120e] text-slate-600 dark:text-slate-400 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{t.label}</span>
                  {selectedTemplate === key && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Message Editor */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Message Preview
          </label>
          <textarea
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full rounded-lg border border-slate-300 dark:border-[#38261f] p-3 text-xs bg-white dark:bg-[#18110e] text-slate-900 dark:text-[#fbf5f2] focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            placeholder="Type your WhatsApp message..."
          />
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2">
          <p className="text-[11px] text-slate-400">
            Dispatches to WhatsApp and records interaction to Activity Feed.
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSend}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
              leftIcon={<Send className="w-4 h-4" />}
            >
              Open & Send in WhatsApp
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
