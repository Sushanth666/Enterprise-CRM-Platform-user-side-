import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { addActivity } from '@/modules/activities/activitiesSlice';
import { closeModal, addToast } from '@/store/uiSlice';
import { Modal } from '@/components/Modal';
import { Input, Select } from '@/components/Input';
import { Button } from '@/components/Button';
import { ActivityType } from '@/types/crm';
import { mockTeamMembers } from '@/data/mockData';

export const LogActivityModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.ui.modals.activityFormOpen);
  const leads = useAppSelector((state) => state.leads.items);
  const deals = useAppSelector((state) => state.deals.items);
  const customers = useAppSelector((state) => state.customers.items);

  const [formData, setFormData] = useState({
    type: 'Call' as ActivityType,
    title: '',
    description: '',
    durationMinutes: 30,
    performedBy: mockTeamMembers[0].name,
    entityType: 'Customer' as 'Lead' | 'Deal' | 'Customer',
    entityId: '',
    outcome: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.title.trim()) errs.title = 'Title is required';
    if (!formData.description.trim()) errs.description = 'Summary is required';
    if (!formData.entityId) errs.entityId = 'Please select associated record';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    let entityName = '';
    if (formData.entityType === 'Lead') {
      const l = leads.find((item) => item.id === formData.entityId);
      entityName = l ? `${l.name} (${l.company})` : 'Lead';
    } else if (formData.entityType === 'Deal') {
      const d = deals.find((item) => item.id === formData.entityId);
      entityName = d ? d.title : 'Deal';
    } else {
      const c = customers.find((item) => item.id === formData.entityId);
      entityName = c ? c.company : 'Customer';
    }

    const assignedMember = mockTeamMembers.find((m) => m.name === formData.performedBy);

    dispatch(
      addActivity({
        type: formData.type,
        title: formData.title,
        description: formData.description,
        performedBy: formData.performedBy,
        performedAvatar: assignedMember?.avatar,
        entityType: formData.entityType,
        entityId: formData.entityId,
        entityName,
        outcome: formData.outcome,
        durationMinutes: Number(formData.durationMinutes) || undefined,
      })
    );

    dispatch(
      addToast({
        type: 'success',
        title: 'Activity Logged',
        message: `${formData.type} recorded for ${entityName}`,
      })
    );

    handleClose();
  };

  const handleClose = () => {
    dispatch(closeModal('activityFormOpen'));
    setFormData({
      type: 'Call',
      title: '',
      description: '',
      durationMinutes: 30,
      performedBy: mockTeamMembers[0].name,
      entityType: 'Customer',
      entityId: '',
      outcome: '',
    });
    setErrors({});
  };

  const typeOptions = [
    { value: 'Call', label: 'Phone Call' },
    { value: 'Meeting', label: 'Meeting / Video Call' },
    { value: 'Email', label: 'Email Interaction' },
    { value: 'Note', label: 'Internal Note' },
  ];

  const memberOptions = mockTeamMembers.map((m) => ({
    value: m.name,
    label: `${m.name} (${m.role})`,
  }));

  const entityOptions =
    formData.entityType === 'Lead'
      ? leads.map((l) => ({ value: l.id, label: `${l.name} - ${l.company}` }))
      : formData.entityType === 'Deal'
      ? deals.map((d) => ({ value: d.id, label: `${d.title} (${d.company})` }))
      : customers.map((c) => ({ value: c.id, label: `${c.company} - ${c.name}` }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Log Customer Activity"
      description="Record customer touchpoints, meeting notes, and sales outreach"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Activity Type"
            options={typeOptions}
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as ActivityType })}
          />
          <Input
            label="Duration (minutes)"
            type="number"
            value={formData.durationMinutes}
            onChange={(e) => setFormData({ ...formData, durationMinutes: Number(e.target.value) })}
          />
        </div>

        <Input
          label="Activity Subject / Title"
          placeholder="e.g. Q4 Contract Negotiation & Pricing Discussion"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          error={errors.title}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Relates to"
            options={[
              { value: 'Customer', label: 'Customer Account' },
              { value: 'Deal', label: 'Sales Opportunity / Deal' },
              { value: 'Lead', label: 'Lead' },
            ]}
            value={formData.entityType}
            onChange={(e) =>
              setFormData({
                ...formData,
                entityType: e.target.value as any,
                entityId: '',
              })
            }
          />
          <Select
            label="Select Record"
            options={[{ value: '', label: '-- Select Record --' }, ...entityOptions]}
            value={formData.entityId}
            onChange={(e) => setFormData({ ...formData, entityId: e.target.value })}
            error={errors.entityId}
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Interaction Summary & Minutes
          </label>
          <textarea
            rows={3}
            placeholder="Key discussion points, customer feedback, next steps..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full rounded-lg border border-slate-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
          {errors.description && (
            <p className="mt-1 text-xs text-rose-600 font-medium">{errors.description}</p>
          )}
        </div>

        <Input
          label="Key Outcome / Agreed Next Action"
          placeholder="e.g. Agreed to revised pricing. Awaiting signed contract by Friday."
          value={formData.outcome}
          onChange={(e) => setFormData({ ...formData, outcome: e.target.value })}
        />

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button variant="outline" type="button" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit">Save Activity</Button>
        </div>
      </form>
    </Modal>
  );
};

