import React from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
  setNotificationFilter,
  setNotificationSearchQuery,
} from './notificationsSlice';
import { setActiveTab, addToast } from '@/store/uiSlice';
import { setSelectedLeadId } from '@/modules/leads/leadsSlice';
import { setSelectedDealId } from '@/modules/pipeline/dealsSlice';
import { setSelectedCustomerId } from '@/modules/customers/customersSlice';
import { formatRelativeTime } from '@/utils/formatters';
import { NotificationType, CrmNotification } from '@/types/crm';
import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import {
  Bell,
  CheckCircle2,
  Trash2,
  Search,
  UserPlus,
  Calendar,
  CheckSquare,
  TrendingUp,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  CheckCheck,
  Filter,
} from 'lucide-react';

export const NotificationCenter: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, filter, searchQuery } = useAppSelector((state) => state.notifications);

  const unreadCount = items.filter((n) => !n.read).length;

  const filteredNotifications = items.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.message.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filter === 'all') return true;
    if (filter === 'unread') return !n.read;
    return n.type === filter;
  });

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'lead_assignment':
        return <UserPlus className="w-4 h-4 text-purple-600" />;
      case 'meeting':
        return <Calendar className="w-4 h-4 text-blue-600" />;
      case 'task_reminder':
        return <CheckSquare className="w-4 h-4 text-amber-600" />;
      case 'deal_update':
        return <TrendingUp className="w-4 h-4 text-emerald-600" />;
      default:
        return <Bell className="w-4 h-4 text-slate-600" />;
    }
  };

  const getNotificationBadgeClass = (type: NotificationType) => {
    switch (type) {
      case 'lead_assignment':
        return 'bg-purple-50 border-purple-200 text-purple-700';
      case 'meeting':
        return 'bg-blue-50 border-blue-200 text-blue-700';
      case 'task_reminder':
        return 'bg-amber-50 border-amber-200 text-amber-700';
      case 'deal_update':
        return 'bg-emerald-50 border-emerald-200 text-emerald-700';
      default:
        return 'bg-slate-50 border-slate-200 text-slate-700';
    }
  };

  const handleActionClick = (notif: CrmNotification) => {
    dispatch(markAsRead(notif.id));
    if (notif.linkTab) {
      if (notif.linkTab === 'leads' && notif.entityId) {
        dispatch(setSelectedLeadId(notif.entityId));
      } else if (notif.linkTab === 'pipeline' && notif.entityId) {
        dispatch(setSelectedDealId(notif.entityId));
      } else if (notif.linkTab === 'customers' && notif.entityId) {
        dispatch(setSelectedCustomerId(notif.entityId));
      }
      dispatch(setActiveTab(notif.linkTab as any));
    }
  };

  const filterTabs: { id: NotificationType | 'all' | 'unread'; label: string; count?: number }[] = [
    { id: 'all', label: 'All Alerts', count: items.length },
    { id: 'unread', label: 'Unread', count: unreadCount },
    { id: 'lead_assignment', label: 'Lead Assignments' },
    { id: 'task_reminder', label: 'Task Reminders' },
    { id: 'meeting', label: 'Meetings & Demos' },
    { id: 'deal_update', label: 'Deal Stages' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 [data-theme='sunset-copper']_&:from-[#2a1711] [data-theme='sunset-copper']_&:via-[#1e120e] [data-theme='sunset-copper']_&:to-[#140e0c] border border-slate-800 [data-theme='sunset-copper']_&:border-[#3d271e] text-white shadow-md">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold tracking-wider text-[#e08a68]">
              Alerts & Notifications Hub
            </span>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#ca5e3a] text-white animate-pulse">
                {unreadCount} unread
              </span>
            )}
          </div>
          <h2 className="text-xl font-bold tracking-tight mt-0.5 text-white">
            Real-Time Notifications & Critical Action Reminders
          </h2>
          <p className="text-xs text-slate-300 [data-theme='sunset-copper']_&:text-[#edd5cb] mt-1">
            Stay on top of inbound lead routing, meeting invites, deliverable deadlines, and pipeline movements.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {unreadCount > 0 && (
            <Button
              onClick={() => {
                dispatch(markAllAsRead());
                dispatch(
                  addToast({
                    type: 'success',
                    title: 'All Marked as Read',
                    message: 'All unread notifications have been marked as read.',
                  })
                );
              }}
              variant="outline"
              size="sm"
              leftIcon={<CheckCheck className="w-4 h-4" />}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs flex-1 sm:flex-initial"
            >
              Mark All as Read
            </Button>
          )}

          {items.length > 0 && (
            <Button
              onClick={() => {
                if (confirm('Are you sure you want to clear all notifications?')) {
                  dispatch(clearAllNotifications());
                  dispatch(
                    addToast({
                      type: 'info',
                      title: 'Notifications Cleared',
                      message: 'Your notification center has been emptied.',
                    })
                  );
                }
              }}
              variant="outline"
              size="sm"
              leftIcon={<Trash2 className="w-4 h-4" />}
              className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border-rose-500/30 text-xs flex-1 sm:flex-initial"
            >
              Clear All
            </Button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search notifications by title or keyword..."
              value={searchQuery}
              onChange={(e) => dispatch(setNotificationSearchQuery(e.target.value))}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 border-t border-slate-100 pt-3 scrollbar-none">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => dispatch(setNotificationFilter(tab.id))}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shrink-0 ${
                filter === tab.id
                  ? 'bg-indigo-600 [data-theme="sunset-copper"]_&:bg-[#ca5e3a] text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    filter === tab.id ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Notification Items List */}
      {filteredNotifications.length === 0 ? (
        <EmptyState
          icon={<Bell className="w-8 h-8 text-slate-400" />}
          title="No Notifications Found"
          description="You're all caught up! When you receive new lead assignments, task deadlines, or meeting invites, they'll appear here."
        />
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 rounded-xl border transition-all ${
                notif.read
                  ? 'bg-white border-slate-200/80 hover:border-slate-300'
                  : 'bg-indigo-50/40 [data-theme="sunset-copper"]_&:bg-[#2a1711]/20 border-indigo-200 [data-theme="sunset-copper"]_&:border-[#ca5e3a]/40 shadow-xs'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className={`p-2 rounded-xl border shrink-0 ${getNotificationBadgeClass(notif.type)}`}>
                    {getNotificationIcon(notif.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className={`text-sm tracking-tight ${notif.read ? 'font-medium text-slate-900' : 'font-bold text-slate-900'}`}>
                        {notif.title}
                      </h4>
                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-[#ca5e3a] shrink-0" />
                      )}
                      {notif.priority === 'high' && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                          High Priority
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {notif.message}
                    </p>

                    <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400">
                      <span>{formatRelativeTime(notif.timestamp)}</span>
                      <span>•</span>
                      <span className="capitalize">{notif.type.replace('_', ' ')}</span>
                    </div>
                  </div>
                </div>

                {/* Right side actions */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {notif.linkTab && (
                    <Button
                      onClick={() => handleActionClick(notif)}
                      size="sm"
                      variant="outline"
                      className="text-xs px-2.5 py-1.5"
                      rightIcon={<ExternalLink className="w-3.5 h-3.5" />}
                    >
                      Open Record
                    </Button>
                  )}

                  {!notif.read && (
                    <button
                      onClick={() => dispatch(markAsRead(notif.id))}
                      className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                      title="Mark as read"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    </button>
                  )}

                  <button
                    onClick={() => dispatch(deleteNotification(notif.id))}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Remove notification"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default NotificationCenter;

