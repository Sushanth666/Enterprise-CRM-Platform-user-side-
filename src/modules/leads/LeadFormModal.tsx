import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { addLead } from '@/modules/leads/leadsSlice';
import { closeModal, addToast } from '@/store/uiSlice';
import { Modal } from '@/components/Modal';
import { Input, Select } from '@/components/Input';
import { Button } from '@/components/Button';
import { LeadStatus, LeadSource } from '@/types/crm';
import { mockTeamMembers } from '@/data/mockData';

export const LeadFormModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.ui.modals.leadFormOpen);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    title: '',
    status: 'New' as LeadStatus,
    source: 'Website' as LeadSource,
    score: 75,
    estimatedValue: 50000,
    assignedTo: mockTeamMembers[0].name,
    notes: '',
    tags: 'Enterprise, SaaS',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Full name is required';
    if (!formData.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = 'Invalid email address';
    }
    if (!formData.company.trim()) errs.company = 'Company name is required';
    if (!formData.title.trim()) errs.title = 'Job title is required';
    if (formData.estimatedValue <= 0) errs.estimatedValue = 'Value must be greater than 0';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const assignedMember = mockTeamMembers.find((m) => m.name === formData.assignedTo);

    dispatch(
      addLead({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || '+1 (555) 000-0000',
        company: formData.company,
        title: formData.title,
        status: formData.status,
        source: formData.source,
        score: Number(formData.score),
        estimatedValue: Number(formData.estimatedValue),
        assignedTo: formData.assignedTo,
        assignedAvatar: assignedMember?.avatar,
        notes: formData.notes,
        tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
        country: 'United States',
      })
    );

    dispatch(
      addToast({
        type: 'success',
        title: 'Lead Created',
        message: `${formData.name} at ${formData.company} added to CRM.`,
      })
    );

    handleClose();
  };

  const handleClose = () => {
    dispatch(closeModal('leadFormOpen'));
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      title: '',
      status: 'New',
      source: 'Website',
      score: 75,
      estimatedValue: 50000,
      assignedTo: mockTeamMembers[0].name,
      notes: '',
      tags: 'Enterprise, SaaS',
    });
    setErrors({});
  };

  const statusOptions = [
    { value: 'New', label: 'New' },
    { value: 'Contacted', label: 'Contacted' },
    { value: 'Qualified', label: 'Qualified' },
    { value: 'Proposal', label: 'Proposal' },
    { value: 'Negotiation', label: 'Negotiation' },
  ];

  const sourceOptions = [
    { value: 'Website', label: 'Website' },
    { value: 'LinkedIn', label: 'LinkedIn' },
    { value: 'Referral', label: 'Referral' },
    { value: 'Cold Call', label: 'Cold Call' },
    { value: 'Inbound Email', label: 'Inbound Email' },
    { value: 'Conference', label: 'Conference' },
    { value: 'Partner', label: 'Partner' },
  ];

  const memberOptions = mockTeamMembers.map((m) => ({
    value: m.name,
    label: `${m.name} (${m.role})`,
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create New Lead"
      description="Add a new potential customer opportunity to the pipeline"
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            placeholder="e.g. Rachel Adams"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={errors.name}
            required
          />
          <Input
            label="Email Address"
            type="email"
            placeholder="e.g. rachel@apextech.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            error={errors.email}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Company"
            placeholder="e.g. Apex Tech Solutions"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            error={errors.company}
            required
          />
          <Input
            label="Job Title"
            placeholder="e.g. VP of Information Technology"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            error={errors.title}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Phone Number"
            placeholder="e.g. +91 98201 44210"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
          <Input
            label="Estimated Deal Value (₹ - INR)"
            type="number"
            placeholder="e.g. 1500000"
            value={formData.estimatedValue}
            onChange={(e) => setFormData({ ...formData, estimatedValue: Number(e.target.value) })}
            error={errors.estimatedValue}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Select
            label="Lead Status"
            options={statusOptions}
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as LeadStatus })}
          />
          <Select
            label="Lead Source"
            options={sourceOptions}
            value={formData.source}
            onChange={(e) => setFormData({ ...formData, source: e.target.value as LeadSource })}
          />
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Lead Score ({formData.score})
            </label>
            <input
              type="range"
              min="10"
              max="100"
              value={formData.score}
              onChange={(e) => setFormData({ ...formData, score: Number(e.target.value) })}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 mt-2"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Assigned Account Rep"
            options={memberOptions}
            value={formData.assignedTo}
            onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
          />
          <Input
            label="Tags (comma separated)"
            placeholder="e.g. Enterprise, Tech, High-Priority"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Initial Discovery Notes
          </label>
          <textarea
            rows={3}
            placeholder="Key discussion points, customer pain points, timeline..."
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full rounded-lg border border-slate-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button variant="outline" type="button" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit">
            Create Lead
          </Button>
        </div>
      </form>
    </Modal>
  );
};

