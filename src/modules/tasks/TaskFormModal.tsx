import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { addTask } from '@/modules/tasks/tasksSlice';
import { closeModal, addToast } from '@/store/uiSlice';
import { Modal } from '@/components/Modal';
import { Input, Select } from '@/components/Input';
import { Button } from '@/components/Button';
import { PriorityLevel, TaskStatus } from '@/types/crm';
import { mockTeamMembers } from '@/data/mockData';
import { formatCurrency } from '@/utils/formatters';

export const TaskFormModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.ui.modals.taskFormOpen);
  const leads = useAppSelector((state) => state.leads.items);
  const deals = useAppSelector((state) => state.deals.items);
  const customers = useAppSelector((state) => state.customers.items);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedTo: mockTeamMembers[0].name,
    priority: 'High' as PriorityLevel,
    status: 'Todo' as TaskStatus,
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    relatedType: 'Deal' as 'Lead' | 'Deal' | 'Customer',
    relatedId: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.title.trim()) errs.title = 'Task title is required';
    if (!formData.dueDate) errs.dueDate = 'Due date is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const assignedMember = mockTeamMembers.find((m) => m.name === formData.assignedTo);

    let relatedToObj = undefined;
    if (formData.relatedId) {
      let name = '';
      if (formData.relatedType === 'Lead') {
        const lead = leads.find((l) => l.id === formData.relatedId);
        name = lead?.company || lead?.name || '';
      } else if (formData.relatedType === 'Deal') {
        const deal = deals.find((d) => d.id === formData.relatedId);
        name = deal?.title || '';
      } else {
        const cust = customers.find((c) => c.id === formData.relatedId);
        name = cust?.company || '';
      }

      if (name) {
        relatedToObj = {
          type: formData.relatedType,
          id: formData.relatedId,
          name,
        };
      }
    }

    dispatch(
      addTask({
        title: formData.title,
        description: formData.description,
        assignedTo: formData.assignedTo,
        assignedAvatar: assignedMember?.avatar,
        priority: formData.priority,
        status: formData.status,
        dueDate: formData.dueDate,
        relatedTo: relatedToObj,
      })
    );

    dispatch(
      addToast({
        type: 'success',
        title: 'Task Created',
        message: formData.title,
      })
    );

    handleClose();
  };

  const handleClose = () => {
    dispatch(closeModal('taskFormOpen'));
    setFormData({
      title: '',
      description: '',
      assignedTo: mockTeamMembers[0].name,
      priority: 'High',
      status: 'Todo',
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      relatedType: 'Deal',
      relatedId: '',
    });
    setErrors({});
  };

  const priorityOptions = [
    { value: 'Low', label: 'Low' },
    { value: 'Medium', label: 'Medium' },
    { value: 'High', label: 'High' },
    { value: 'Urgent', label: 'Urgent' },
  ];

  const statusOptions = [
    { value: 'Todo', label: 'To Do' },
    { value: 'In Progress', label: 'In Progress' },
    { value: 'Completed', label: 'Completed' },
  ];

  const memberOptions = mockTeamMembers.map((m) => ({
    value: m.name,
    label: `${m.name} (${m.role})`,
  }));

  const relatedEntities =
    formData.relatedType === 'Lead'
      ? leads.map((l) => ({ value: l.id, label: `${l.name} (${l.company})` }))
      : formData.relatedType === 'Deal'
      ? deals.map((d) => ({ value: d.id, label: `${d.title} - ${formatCurrency(d.amount)}` }))
      : customers.map((c) => ({ value: c.id, label: `${c.company} (${c.name})` }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create New Action Task"
      description="Assign critical follow-ups, contract reviews, and action items"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Task Title"
          placeholder="e.g. Schedule commercial contract sync with CFO"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          error={errors.title}
          required
        />

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Task Description & Deliverables
          </label>
          <textarea
            rows={3}
            placeholder="Detailed instructions or context for the assignee..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full rounded-lg border border-slate-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Select
            label="Priority Level"
            options={priorityOptions}
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value as PriorityLevel })}
          />
          <Select
            label="Initial Status"
            options={statusOptions}
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as TaskStatus })}
          />
          <Input
            label="Due Date"
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            error={errors.dueDate}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Assigned Rep"
            options={memberOptions}
            value={formData.assignedTo}
            onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
          />

          <Select
            label="Associate With"
            options={[
              { value: 'Deal', label: 'Opportunity / Deal' },
              { value: 'Lead', label: 'Lead' },
              { value: 'Customer', label: 'Customer Account' },
            ]}
            value={formData.relatedType}
            onChange={(e) =>
              setFormData({
                ...formData,
                relatedType: e.target.value as any,
                relatedId: '',
              })
            }
          />
        </div>

        <Select
          label={`Select ${formData.relatedType} (Optional)`}
          options={[{ value: '', label: '-- None / Standalone Task --' }, ...relatedEntities]}
          value={formData.relatedId}
          onChange={(e) => setFormData({ ...formData, relatedId: e.target.value })}
        />

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button variant="outline" type="button" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit">Create Task</Button>
        </div>
      </form>
    </Modal>
  );
};

