import React from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { setActiveTab, openModal } from '@/store/uiSlice';
import { formatRelativeTime } from '@/utils/formatters';
import { Avatar } from '@/components/Avatar';
import {
  Phone,
  Video,
  Mail,
  FileText,
  RefreshCw,
  CheckCircle2,
  ArrowRight,
  Plus,
} from 'lucide-react';
import { ActivityType } from '@/types/crm';

export const RecentActivitiesList: React.FC = () => {
  const dispatch = useAppDispatch();
  const activities = useAppSelector((state) => state.activities.items);
  const workspaceScope = useAppSelector((state) => state.ui.workspaceScope);
  const currentUser = useAppSelector((state) => state.auth.user);

  const scopedActivities = activities.filter((act) => {
    if (workspaceScope === 'personal' && currentUser) {
      return act.performedBy.toLowerCase() === currentUser.name.toLowerCase();
    }
    return true;
  });

  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case 'Call':
        return <Phone className="w-3.5 h-3.5 text-emerald-600" />;
      case 'Meeting':
        return <Video className="w-3.5 h-3.5 text-purple-600" />;
      case 'Email':
        return <Mail className="w-3.5 h-3.5 text-sky-600" />;
      case 'Note':
        return <FileText className="w-3.5 h-3.5 text-amber-600" />;
      case 'Status Change':
        return <RefreshCw className="w-3.5 h-3.5 text-indigo-600" />;
      default:
        return <CheckCircle2 className="w-3.5 h-3.5 text-slate-600" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              {workspaceScope === 'personal' ? 'My Recent Activity' : 'Live Customer Activity'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {workspaceScope === 'personal' ? 'Interactions logged by you' : 'Real-time interactions log'}
            </p>
          </div>
          <button
            onClick={() => dispatch(openModal('activityFormOpen'))}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Log</span>
          </button>
        </div>

        <div className="space-y-3">
          {scopedActivities.slice(0, 4).map((act) => (
            <div
              key={act.id}
              onClick={() => dispatch(setActiveTab('activities'))}
              className="p-3 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/70 transition-all cursor-pointer text-xs"
            >
              <div className="flex items-start gap-2.5">
                <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-200/80 shrink-0 mt-0.5">
                  {getActivityIcon(act.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-slate-900 truncate">{act.title}</p>
                    <span className="text-[10px] text-slate-400 shrink-0">
                      {formatRelativeTime(act.timestamp)}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                    {act.description}
                  </p>
                  <p className="text-[10px] text-indigo-600 font-medium mt-1">
                    {act.entityType}: {act.entityName}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 mt-4 text-center">
        <button
          onClick={() => dispatch(setActiveTab('activities'))}
          className="text-xs font-semibold text-slate-600 hover:text-indigo-600 flex items-center justify-center gap-1 w-full"
        >
          <span>View All Interactions</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

