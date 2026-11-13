import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/Button';
import { Input, Select } from '@/components/Input';
import { addActivity } from '@/modules/activities/activitiesSlice';
import { addTask } from '@/modules/tasks/tasksSlice';
import { addToast } from '@/store/uiSlice';
import { Calendar, Clock, Video, CheckCircle2, Copy, Sparkles } from 'lucide-react';

interface MeetingSchedulerModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultContactName?: string;
  defaultCompany?: string;
}

export const MeetingSchedulerModal: React.FC<MeetingSchedulerModalProps> = ({
  isOpen,
  onClose,
  defaultContactName = '',
  defaultCompany = '',
}) => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.auth.user);

  const [contactName, setContactName] = useState(defaultContactName || 'Priya Nair');
  const [company, setCompany] = useState(defaultCompany || 'Reliance Retail Digital');
  const [meetingDate, setMeetingDate] = useState('2026-11-06');
  const [meetingTime, setMeetingTime] = useState('03:30 PM');
  const [meetingDuration, setMeetingDuration] = useState('45');
  const [meetingType, setMeetingType] = useState('Product Architecture Demo');
  const [copiedLink, setCopiedLink] = useState(false);

  const bookingLink = `https://vedaflow.in/book/${currentUser.name.toLowerCase().replace(/\s+/g, '-')}`;

  const availableSlots = [
    '10:30 AM IST',
    '12:00 PM IST',
    '02:30 PM IST',
    '03:30 PM IST',
    '05:00 PM IST',
  ];

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(bookingLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
    dispatch(
      addToast({
        type: 'info',
        title: 'Booking Link Copied',
        message: 'Personalized IST calendar scheduling link copied to clipboard.',
      })
    );
  };

  const handleSchedule = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Log Meeting Activity in Redux
    dispatch(
      addActivity({
        type: 'Meeting',
        title: `${meetingType}: ${company}`,
        description: `Scheduled ${meetingDuration}m ${meetingType} session with ${contactName} (${company}) via Google Meet. Time: ${meetingDate} at ${meetingTime}.`,
        performedBy: currentUser?.name || 'Sales Rep',
        performedAvatar: currentUser?.avatar,
        entityType: 'Deal',
        entityId: 'deal-sch',
        entityName: company,
        durationMinutes: Number(meetingDuration),
        outcome: `Upcoming meeting confirmed for ${meetingDate} ${meetingTime}.`,
      })
    );

    // 2. Add preparation task in tasksSlice
    dispatch(
      addTask({
        title: `Prepare custom demo deck & scope for ${company}`,
        description: `Deliver ${meetingType} to ${contactName} on ${meetingDate} at ${meetingTime}.`,
        dueDate: meetingDate,
        priority: 'High',
        assignedTo: currentUser?.name || 'Sales Rep',
        assignedAvatar: currentUser?.avatar,
        status: 'Todo',
        relatedTo: {
          type: 'Deal',
          id: 'deal-sch',
          name: company,
        },
      })
    );

    dispatch(
      addToast({
        type: 'success',
        title: 'Meeting Booked & Task Created',
        message: `Meeting scheduled for ${contactName} on ${meetingDate} at ${meetingTime}.`,
      })
    );

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Interactive Meeting Scheduler"
      description="Book executive demos and client reviews with automated IST timezone coordination."
      maxWidth="xl"
    >
      <form onSubmit={handleSchedule} className="space-y-4 pt-1">
        {/* Booking Link Quick Bar */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#1a120e] border border-slate-200 dark:border-[#38261f] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Video className="w-4 h-4 text-[#ca5e3a]" />
            <span className="text-xs font-mono text-slate-700 dark:text-slate-300 truncate max-w-xs">
              {bookingLink}
            </span>
          </div>
          <button
            type="button"
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg bg-white dark:bg-[#251713] border border-slate-200 dark:border-[#ca5e3a]/40 text-[#ca5e3a] font-semibold hover:bg-slate-100 dark:hover:bg-[#321e18] transition-colors"
          >
            {copiedLink ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'Copied' : 'Copy Link'}</span>
          </button>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Client Contact Name"
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            required
          />
          <Input
            label="Organization / Account"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Meeting Date"
            type="date"
            value={meetingDate}
            onChange={(e) => setMeetingDate(e.target.value)}
            required
          />
          <Select
            label="Duration"
            value={meetingDuration}
            onChange={(e) => setMeetingDuration(e.target.value)}
            options={[
              { value: '30', label: '30 Minutes (Discovery)' },
              { value: '45', label: '45 Minutes (Full Demo)' },
              { value: '60', label: '60 Minutes (Deep-Dive & Architecture)' },
            ]}
          />
        </div>

        {/* Slot selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Select IST Time Slot
          </label>
          <div className="flex flex-wrap gap-2">
            {availableSlots.map((slot) => (
              <button
                key={slot}
                type="button"
                onClick={() => setMeetingTime(slot)}
                className={`px-3 py-1.5 text-xs rounded-lg font-medium border transition-all ${
                  meetingTime === slot
                    ? 'border-[#ca5e3a] bg-[#2a1711] text-white font-bold shadow-xs'
                    : 'border-slate-200 dark:border-[#38261f] bg-white dark:bg-[#18110e] text-slate-700 dark:text-slate-300'
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-[#2e1f18]">
          <Button variant="outline" size="sm" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button
            size="sm"
            type="submit"
            leftIcon={<Calendar className="w-4 h-4" />}
          >
            Confirm & Sync to CRM
          </Button>
        </div>
      </form>
    </Modal>
  );
};
