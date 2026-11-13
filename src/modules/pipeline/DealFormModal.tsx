import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { addDeal } from '@/modules/pipeline/dealsSlice';
import { closeModal, addToast } from '@/store/uiSlice';
import { Modal } from '@/components/Modal';
import { Input, Select } from '@/components/Input';
import { Button } from '@/components/Button';
import { DealStage, PriorityLevel } from '@/types/crm';
import { mockTeamMembers } from '@/data/mockData';

export const DealFormModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.ui.modals.dealFormOpen);

  const [formData, setFormData] = useState({
    title: '',
    company: '',
    amount: 100000,
    stage: 'Discovery' as DealStage,
    probability: 30,
    expectedCloseDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    assignedTo: mockTeamMembers[0].name,
    priority: 'Medium' as PriorityLevel,
    tags: 'SaaS, Expansion',
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.title.trim()) errs.title = 'Deal title is required';
    if (!formData.company.trim()) errs.company = 'Company name is required';
    if (formData.amount <= 0) errs.amount = 'Amount must be greater than 0';
    if (!formData.expectedCloseDate) errs.expectedCloseDate = 'Close date is required';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const assignedMember = mockTeamMembers.find((m) => m.name === formData.assignedTo);

    dispatch(
      addDeal({
        title: formData.title,
        company: formData.company,
        amount: Number(formData.amount),
        stage: formData.stage,
        probability: Number(formData.probability),
        expectedCloseDate: formData.expectedCloseDate,
        assignedTo: formData.assignedTo,
        assignedAvatar: assignedMember?.avatar,
        priority: formData.priority,
        tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
        notes: formData.notes,
      })
    );

    dispatch(
      addToast({
        type: 'success',
        title: 'Deal Created',
        message: `${formData.title} added to ${formData.stage} stage.`,
      })
    );

    handleClose();
  };

  const handleClose = () => {
    dispatch(closeModal('dealFormOpen'));
    setFormData({
      title: '',
      company: '',
      amount: 100000,
      stage: 'Discovery',
      probability: 30,
      expectedCloseDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      assignedTo: mockTeamMembers[0].name,
      priority: 'Medium',
      tags: 'SaaS, Expansion',
      notes: '',
    });
    setErrors({});
  };

  const stageOptions = [
    { value: 'Discovery', label: 'Discovery' },
    { value: 'Qualification', label: 'Qualification' },
    { value: 'Proposal', label: 'Proposal' },
    { value: 'Negotiation', label: 'Negotiation' },
    { value: 'Contract Sent', label: 'Contract Sent' },
    { value: 'Closed Won', label: 'Closed Won' },
    { value: 'Closed Lost', label: 'Closed Lost' },
  ];

  const priorityOptions = [
    { value: 'Low', label: 'Low' },
    { value: 'Medium', label: 'Medium' },
    { value: 'High', label: 'High' },
    { value: 'Urgent', label: 'Urgent' },
  ];

  const memberOptions = mockTeamMembers.map((m) => ({
    value: m.name,
    label: `${m.name} (${m.role})`,
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create Deal Opportunity"
      description="Add a new sales contract opportunity to track in the pipeline"
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Deal Title"
            placeholder="e.g. Enterprise Cloud Migration"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            error={errors.title}
            required
          />
          <Input
            label="Target Account / Company"
            placeholder="e.g. Acme Corporation"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            error={errors.company}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Contract Amount (₹ - INR)"
            type="number"
            placeholder="e.g. 2500000"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
            error={errors.amount}
            required
          />
          <Input
            label="Expected Close Date"
            type="date"
            value={formData.expectedCloseDate}
            onChange={(e) => setFormData({ ...formData, expectedCloseDate: e.target.value })}
            error={errors.expectedCloseDate}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Select
            label="Pipeline Stage"
            options={stageOptions}
            value={formData.stage}
            onChange={(e) => setFormData({ ...formData, stage: e.target.value as DealStage })}
          />
          <Select
            label="Priority Level"
            options={priorityOptions}
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value as PriorityLevel })}
          />
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Win Probability ({formData.probability}%)
            </label>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={formData.probability}
              onChange={(e) => setFormData({ ...formData, probability: Number(e.target.value) })}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#ca5e3a] mt-2"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Assigned Account AE"
            options={memberOptions}
            value={formData.assignedTo}
            onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
          />
          <Input
            label="Tags (comma separated)"
            placeholder="e.g. High Value, Multi-Year"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Deal Notes & Scope
          </label>
          <textarea
            rows={3}
            placeholder="Key commercial terms, executive sponsor, competitors..."
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full rounded-lg border border-slate-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#ca5e3a]/20 focus:border-[#ca5e3a]"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button variant="outline" type="button" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit">Create Deal</Button>
        </div>
      </form>
    </Modal>
  );
};

