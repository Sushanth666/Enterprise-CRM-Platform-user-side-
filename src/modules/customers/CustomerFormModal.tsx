import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { addCustomer } from '@/modules/customers/customersSlice';
import { closeModal, addToast } from '@/store/uiSlice';
import { Modal } from '@/components/Modal';
import { Input, Select } from '@/components/Input';
import { Button } from '@/components/Button';
import { mockTeamMembers } from '@/data/mockData';

export const CustomerFormModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.ui.modals.customerFormOpen);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    title: '',
    industry: 'Software & Technology',
    status: 'Active' as const,
    totalRevenue: 150000,
    healthScore: 92,
    accountManager: mockTeamMembers[0].name,
    tier: 'Enterprise' as const,
    city: 'New York',
    country: 'United States',
    tags: 'Tier-1, Strategic',
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Contact name is required';
    if (!formData.company.trim()) errs.company = 'Company name is required';
    if (!formData.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = 'Invalid email address';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    dispatch(
      addCustomer({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || '+1 (555) 010-9988',
        company: formData.company,
        title: formData.title,
        industry: formData.industry,
        status: formData.status,
        totalRevenue: Number(formData.totalRevenue),
        healthScore: Number(formData.healthScore),
        accountManager: formData.accountManager,
        tier: formData.tier,
        address: {
          city: formData.city,
          country: formData.country,
        },
        tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
        notes: formData.notes,
      })
    );

    dispatch(
      addToast({
        type: 'success',
        title: 'Customer Profile Created',
        message: `${formData.company} added to customer directory.`,
      })
    );

    handleClose();
  };

  const handleClose = () => {
    dispatch(closeModal('customerFormOpen'));
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      title: '',
      industry: 'Software & Technology',
      status: 'Active',
      totalRevenue: 150000,
      healthScore: 92,
      accountManager: mockTeamMembers[0].name,
      tier: 'Enterprise',
      city: 'New York',
      country: 'United States',
      tags: 'Tier-1, Strategic',
      notes: '',
    });
    setErrors({});
  };

  const tierOptions = [
    { value: 'Enterprise', label: 'Enterprise' },
    { value: 'Mid-Market', label: 'Mid-Market' },
    { value: 'Growth', label: 'Growth' },
    { value: 'Startup', label: 'Startup' },
  ];

  const statusOptions = [
    { value: 'Active', label: 'Active' },
    { value: 'Onboarding', label: 'Onboarding' },
    { value: 'Churned', label: 'Churned' },
  ];

  const memberOptions = mockTeamMembers.map((m) => ({
    value: m.name,
    label: `${m.name} (${m.role})`,
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create Customer Profile"
      description="Add an enterprise account to customer relationship management"
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Company / Organization Name"
            placeholder="e.g. Acme Industries Ltd."
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            error={errors.company}
            required
          />
          <Input
            label="Industry"
            placeholder="e.g. Financial Services"
            value={formData.industry}
            onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Primary Contact Name"
            placeholder="e.g. Jonathan Vance"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={errors.name}
            required
          />
          <Input
            label="Job Title"
            placeholder="e.g. VP Operations"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Contact Email"
            type="email"
            placeholder="e.g. j.vance@acme.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            error={errors.email}
            required
          />
          <Input
            label="Contact Phone"
            placeholder="e.g. +1 (555) 012-3456"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Select
            label="Account Tier"
            options={tierOptions}
            value={formData.tier}
            onChange={(e) => setFormData({ ...formData, tier: e.target.value as any })}
          />
          <Select
            label="Account Status"
            options={statusOptions}
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
          />
          <Select
            label="Account Manager"
            options={memberOptions}
            value={formData.accountManager}
            onChange={(e) => setFormData({ ...formData, accountManager: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Annual Contract Value / Revenue ($)"
            type="number"
            value={formData.totalRevenue}
            onChange={(e) => setFormData({ ...formData, totalRevenue: Number(e.target.value) })}
          />
          <Input
            label="City, Country"
            placeholder="e.g. London, United Kingdom"
            value={`${formData.city}, ${formData.country}`}
            onChange={(e) => {
              const parts = e.target.value.split(',');
              setFormData({
                ...formData,
                city: parts[0]?.trim() || '',
                country: parts[1]?.trim() || 'United States',
              });
            }}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Account Notes & Strategic Objectives
          </label>
          <textarea
            rows={3}
            placeholder="Key account details, expansion opportunities..."
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full rounded-lg border border-slate-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button variant="outline" type="button" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit">Create Customer</Button>
        </div>
      </form>
    </Modal>
  );
};

