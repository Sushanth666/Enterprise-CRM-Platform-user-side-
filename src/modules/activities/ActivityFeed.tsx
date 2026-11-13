import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  setActivityTypeFilter,
  setActivitySearchQuery,
  deleteActivity,
} from '@/modules/activities/activitiesSlice';
import { openModal } from '@/store/uiSlice';
import { ActivityType } from '@/types/crm';
import { formatDateTime, formatRelativeTime } from '@/utils/formatters';
import { Avatar } from '@/components/Avatar';
import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { AiTranscriptSummarizerModal } from './AiTranscriptSummarizerModal';
import { MeetingSchedulerModal } from './MeetingSchedulerModal';
import {
  Phone,
  Video,
  Mail,
  FileText,
  RefreshCw,
  CheckCircle2,
  Plus,
  Search,
  Filter,
  Clock,
  Trash2,
  Sparkles,
  Calendar,
  Activity as ActivityIcon,
} from 'lucide-react';

export const ActivityFeed: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, typeFilter, searchQuery } = useAppSelector((state) => state.activities);
  const currentUser = useAppSelector((state) => state.auth.user);
  const workspaceScope = useAppSelector((state) => state.ui.workspaceScope);
  const [activityScope, setActivityScope] = useState<'all' | 'my'>(
    workspaceScope === 'personal' ? 'my' : 'all'
  );

  useEffect(() => {
    setActivityScope(workspaceScope === 'personal' ? 'my' : 'all');
  }, [workspaceScope]);
  const [summarizerOpen, setSummarizerOpen] = useState(false);
  const [schedulerOpen, setSchedulerOpen] = useState(false);

  const myActivitiesCount = items.filter(
    (act) => act.performedBy.toLowerCase() === currentUser.name.toLowerCase()
  ).length;

  // Filter
  const filteredActivities = items.filter((act) => {
    const matchesSearch =
      act.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.entityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.performedBy.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = typeFilter === 'All' || act.type === typeFilter;
    const matchesScope =
      activityScope === 'my'
        ? act.performedBy.toLowerCase() === currentUser.name.toLowerCase()
        : true;

    return matchesSearch && matchesType && matchesScope;
  });

  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case 'Call':
        return <Phone className="w-4 h-4 text-emerald-600" />;
      case 'Meeting':
        return <Video className="w-4 h-4 text-purple-600" />;
      case 'Email':
        return <Mail className="w-4 h-4 text-sky-600" />;
      case 'Note':
        return <FileText className="w-4 h-4 text-amber-600" />;
      case 'Status Change':
        return <RefreshCw className="w-4 h-4 text-indigo-600" />;
      case 'Task Completed':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      default:
        return <ActivityIcon className="w-4 h-4 text-slate-600" />;
    }
  };

  const getActivityBadgeBg = (type: ActivityType) => {
    switch (type) {
      case 'Call':
        return 'bg-emerald-50 border-emerald-200';
      case 'Meeting':
        return 'bg-purple-50 border-purple-200';
      case 'Email':
        return 'bg-sky-50 border-sky-200';
      case 'Note':
        return 'bg-amber-50 border-amber-200';
      case 'Status Change':
        return 'bg-indigo-50 border-indigo-200';
      case 'Task Completed':
        return 'bg-emerald-50 border-emerald-200';
      default:
        return 'bg-slate-50 border-slate-200';
    }
  };

  const types: (ActivityType | 'All')[] = [
    'All',
    'Call',
    'Meeting',
    'Email',
    'Note',
    'Status Change',
    'Task Completed',
  ];

  return (
    <div className="space-y-6">
      {/* Scope Pill Tabs: My Activities vs All Activities */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setActivityScope('my')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
            activityScope === 'my'
              ? 'bg-indigo-600 [data-theme="sunset-copper"]_&:bg-[#ca5e3a] text-white shadow-2xs font-bold'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <span>👤 My Logged Activities</span>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] ${
              activityScope === 'my' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
            }`}
          >
            {myActivitiesCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActivityScope('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
            activityScope === 'all'
              ? 'bg-indigo-600 [data-theme="sunset-copper"]_&:bg-[#ca5e3a] text-white shadow-2xs font-bold'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <span>👥 All Team Activities</span>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] ${
              activityScope === 'all' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
            }`}
          >
            {items.length}
          </span>
        </button>
      </div>

      {/* Search and Filters Header */}
      <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex flex-col sm:flex-row flex-1 items-stretch sm:items-center gap-2 sm:gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search activity records by keyword, rep, entity..."
              value={searchQuery}
              onChange={(e) => dispatch(setActivitySearchQuery(e.target.value))}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <select
            value={typeFilter}
            onChange={(e) => dispatch(setActivityTypeFilter(e.target.value as any))}
            className="w-full sm:w-auto rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            {types.map((t) => (
              <option key={t} value={t}>
                {t === 'All' ? 'All Activity Types' : t}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setSummarizerOpen(true)}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#ca5e3a] bg-[#ca5e3a]/10 hover:bg-[#ca5e3a]/20 border border-[#ca5e3a]/30 rounded-lg transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            AI Call Summarizer
          </button>

          <button
            type="button"
            onClick={() => setSchedulerOpen(true)}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-purple-600 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg transition-colors"
          >
            <Calendar className="w-3.5 h-3.5 text-purple-600" />
            Schedule Demo Slot
          </button>

          <div className="w-full sm:w-auto">
            <Button
              onClick={() => dispatch(openModal('activityFormOpen'))}
              leftIcon={<Plus className="w-4 h-4" />}
              size="sm"
              className="w-full sm:w-auto"
            >
              Log Activity
            </Button>
          </div>
        </div>
      </div>

      {/* Timeline Feed */}
      {filteredActivities.length === 0 ? (
        <EmptyState
          icon={<ActivityIcon className="w-8 h-8" />}
          title="No Activities Logged"
          description="Log customer interactions such as phone calls, zoom meetings, or emails."
          actionText="Log First Activity"
          onAction={() => dispatch(openModal('activityFormOpen'))}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="relative pl-6 space-y-6 before:absolute before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
            {filteredActivities.map((act, index) => (
              <div key={act.id} className="relative group animate-slideUp" style={{ animationDelay: `${Math.min(index * 60, 400)}ms` }}>
                {/* Timeline node icon */}
                <div
                  className={`absolute -left-6 top-0 w-6 h-6 rounded-full border flex items-center justify-center bg-white shadow-2xs group-hover:scale-110 transition-transform ${getActivityBadgeBg(
                    act.type
                  )}`}
                >
                  {getActivityIcon(act.type)}
                </div>

                {/* Content Box */}
                <div className="bg-slate-50/70 hover:bg-slate-50 border border-slate-200/80 rounded-xl p-4 transition-all card-hover-lift">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">{act.title}</span>
                      <span className="text-[11px] px-2 py-0.5 rounded-full font-medium bg-white border border-slate-200 text-slate-600">
                        {act.type}
                      </span>
                      {act.durationMinutes && (
                        <span className="text-[11px] text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {act.durationMinutes} min
                        </span>
                      )}
                    </div>

                    <span className="text-xs text-slate-400">
                      {formatRelativeTime(act.timestamp)} ({formatDateTime(act.timestamp)})
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed mb-2">
                    {act.description}
                  </p>

                  {/* Outcome Tag if any */}
                  {act.outcome && (
                    <div className="text-xs bg-emerald-50/80 border border-emerald-200/60 rounded-md p-2 text-emerald-800 font-medium mb-3">
                      <span className="font-semibold">Outcome:</span> {act.outcome}
                    </div>
                  )}

                  {/* Entity and Performer Info */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-400">Associated with:</span>
                      <span className="font-semibold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200">
                        {act.entityType}: {act.entityName}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5">
                        <Avatar name={act.performedBy} src={act.performedAvatar} size="xs" />
                        <span className="text-slate-700 font-medium">{act.performedBy}</span>
                      </div>

                      <button
                        onClick={() => dispatch(deleteActivity(act.id))}
                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-600 transition-opacity"
                        title="Delete entry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Transcript Summarizer Modal */}
      <AiTranscriptSummarizerModal
        isOpen={summarizerOpen}
        onClose={() => setSummarizerOpen(false)}
      />

      {/* Meeting & Demo Slot Scheduler Modal */}
      <MeetingSchedulerModal
        isOpen={schedulerOpen}
        onClose={() => setSchedulerOpen(false)}
      />
    </div>
  );
};

