import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { closeModal, addToast } from '@/store/uiSlice';
import { scheduleLeadFollowUp } from './leadsSlice';
import { addTask } from '@/modules/tasks/tasksSlice';
import { addActivity } from '@/modules/activities/activitiesSlice';
import { addNotification } from '@/modules/notifications/notificationsSlice';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/Button';
import { Input, Select } from '@/components/Input';
import {
  Calendar,
  Clock,
  Phone,
  Video,
  Mail,
  Users,
  CheckCircle2,
  Bell,
  Sparkles,
} from 'lucide-react';

export const LeadFollowUpModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.ui.modals.leadFollowUpOpen);
  const selectedLeadId = useAppSelector((state) => state.leads.selectedLeadId);
  const leads = useAppSelector((state) => state.leads.items);
  const currentUser = useAppSelector((state) => state.auth.user);

  const selectedLead = leads.find((l) => l.id === selectedLeadId) || leads[0];

  const tomorrowStr = new Date(Date.now() + 24 * 3600 * 1000).toISOString().split('T')[0];

  const [date, setDate] = useState(tomorrowStr);
  const [time, setTime] = useState('11:30');
  const [type, setType] = useState<'Call' | 'Meeting' | 'Email' | 'Demo'>('Call');
  const [notes, setNotes] = useState('');
  const [createTaskItem, setCreateTaskItem] = useState(true);
  const [logActivityFeed, setLogActivityFeed] = useState(true);

  if (!isOpen || !selectedLead) return null;

  const handleClose = () => {
    dispatch(closeModal('leadFollowUpOpen'));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const followUpDateTime = `${date}T${time}:00Z`;

    // 1. Update Lead with scheduled follow-up
    dispatch(
      scheduleLeadFollowUp({
        id: selectedLead.id,
        date: followUpDateTime,
        type: type,
        notes: notes || `Scheduled ${type} follow-up with ${selectedLead.name}`,
      })
    );

    // 2. Automatically create Task if requested
    if (createTaskItem) {
      dispatch(
        addTask({
          title: `Follow-up ${type}: ${selectedLead.name} (${selectedLead.company})`,
          description: notes || `Conduct ${type.toLowerCase()} touchpoint to advance lead qualification.`,
          assignedTo: selectedLead.assignedTo || currentUser.name,
          priority: selectedLead.score > 80 ? 'Urgent' : 'High',
          status: 'Todo',
          dueDate: date,
          relatedTo: {
            type: 'Lead',
            id: selectedLead.id,
            name: `${selectedLead.name} (${selectedLead.company})`,
          },
        })
      );
    }

    // 3. Log Activity if requested
    if (logActivityFeed) {
      dispatch(
        addActivity({
          type: type === 'Call' ? 'Call' : type === 'Email' ? 'Email' : 'Meeting',
          title: `Follow-up Scheduled: ${type} with ${selectedLead.name}`,
          description: notes || `Scheduled for ${date} at ${time}. Lead estimated value ₹${(selectedLead.estimatedValue / 100000).toFixed(1)} Lakhs.`,
          performedBy: currentUser.name,
          entityType: 'Lead',
          entityId: selectedLead.id,
          entityName: selectedLead.name,
          outcome: 'Follow-up Confirmed',
        })
      );
    }

    // 4. Dispatch Notification
    dispatch(
      addNotification({
        type: 'task_reminder',
        title: `Follow-up Scheduled: ${selectedLead.name}`,
        message: `${type} scheduled for ${date} at ${time} with ${selectedLead.company}.`,
        priority: 'medium',
        linkTab: 'leads',
        entityId: selectedLead.id,
      })
    );

    dispatch(
      addToast({
        type: 'success',
        title: 'Follow-up Scheduled',
        message: `${type} with ${selectedLead.name} scheduled for ${date} at ${time}. Task and reminders synced.`,
      })
    );

    handleClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Schedule Lead Follow-up" maxWidth="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Lead Context Card */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Target Lead</span>
            <h4 className="text-sm font-bold text-slate-900 mt-0.5">{selectedLead.name}</h4>
            <p className="text-xs text-slate-500">{selectedLead.title} • {selectedLead.company}</p>
          </div>
          <div className="text-right">
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#2a1711] text-[#f7a379] border border-[#ca5e3a]/40">
              Score: {selectedLead.score}/100
            </span>
            <p className="text-[11px] text-slate-400 mt-1">Assigned: {selectedLead.assignedTo}</p>
          </div>
        </div>

        {/* Follow-up Type Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Follow-up Channel / Activity
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[
              { id: 'Call', label: 'Phone Call', icon: <Phone className="w-4 h-4 text-emerald-600" /> },
              { id: 'Demo', label: 'Product Demo', icon: <Video className="w-4 h-4 text-purple-600" /> },
              { id: 'Email', label: 'Check-in Email', icon: <Mail className="w-4 h-4 text-sky-600" /> },
              { id: 'Meeting', label: 'In-Person', icon: <Users className="w-4 h-4 text-amber-600" /> },
            ].map((channel) => (
              <button
                key={channel.id}
                type="button"
                onClick={() => setType(channel.id as any)}
                className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                  type === channel.id
                    ? 'border-indigo-600 bg-indigo-50/50 [data-theme="sunset-copper"]_&:border-[#ca5e3a] [data-theme="sunset-copper"]_&:bg-[#2a1711] text-indigo-700 [data-theme="sunset-copper"]_&:text-[#f7a379] font-bold shadow-2xs'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                {channel.icon}
                <span className="text-[11px]">{channel.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Date and Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Follow-up Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            leftIcon={<Calendar className="w-4 h-4" />}
            required
          />

          <Input
            label="Scheduled Time"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            leftIcon={<Clock className="w-4 h-4" />}
            required
          />
        </div>

        {/* Notes / Agenda */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Follow-up Agenda & Discussion Points
          </label>
          <textarea
            placeholder="e.g. Review pricing proposal, address AWS Mumbai data residency questions, and schedule architecture walkthrough with VP of Engineering."
            value={notes}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNotes(e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 transition-all focus:outline-none focus:ring-2 focus:border-indigo-500 focus:ring-indigo-500/20"
          />
        </div>

        {/* Automation Sync Checkboxes */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
          <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={createTaskItem}
              onChange={(e) => setCreateTaskItem(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500"
            />
            <span className="font-medium">Create a prioritized task in Task Management with due date reminder</span>
          </label>

          <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={logActivityFeed}
              onChange={(e) => setLogActivityFeed(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500"
            />
            <span className="font-medium">Log scheduled touchpoint in Customer Activity Feed</span>
          </label>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button variant="outline" type="button" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" leftIcon={<Calendar className="w-4 h-4" />}>
            Confirm Follow-up
          </Button>
        </div>
      </form>
    </Modal>
  );
};
export default LeadFollowUpModal;
