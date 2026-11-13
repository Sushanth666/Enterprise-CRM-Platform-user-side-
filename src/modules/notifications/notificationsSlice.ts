import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CrmNotification, NotificationType } from '@/types/crm';

export interface NotificationsState {
  items: CrmNotification[];
  filter: NotificationType | 'all' | 'unread';
  searchQuery: string;
}

const initialNotifications: CrmNotification[] = [
  {
    id: 'notif-1',
    type: 'lead_assignment',
    title: 'New High-Value Lead Assigned',
    message: 'Rajesh Kulkarni from Tata Consultancy Services (₹1.25 Cr) has been assigned to your sales queue.',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 mins ago
    read: false,
    priority: 'high',
    linkTab: 'leads',
    entityId: 'lead-1',
  },
  {
    id: 'notif-2',
    type: 'meeting',
    title: 'Upcoming Client Demo in 45 Mins',
    message: 'Architecture demo scheduled with HDFC Securities Ltd at 3:00 PM IST via Google Meet.',
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    read: false,
    priority: 'high',
    linkTab: 'activities',
    entityId: 'lead-3',
  },
  {
    id: 'notif-3',
    type: 'task_reminder',
    title: 'Task Due Today',
    message: 'Prepare enterprise commercial SLA and pricing matrix for Reliance Retail Digital.',
    timestamp: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    read: false,
    priority: 'medium',
    linkTab: 'tasks',
    entityId: 'task-1',
  },
  {
    id: 'notif-4',
    type: 'deal_update',
    title: 'Deal Advanced to Negotiation',
    message: 'Infosys Cloud Solutions (₹3.10 Cr) has moved to the Negotiation stage.',
    timestamp: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    read: true,
    priority: 'normal',
    linkTab: 'pipeline',
    entityId: 'deal-2',
  },
  {
    id: 'notif-5',
    type: 'lead_assignment',
    title: 'Inbound Lead Assigned: Swiggy',
    message: 'Vikram Joshi (Director of Merchant Partnerships, Swiggy Enterprise) has requested a platform review.',
    timestamp: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
    read: true,
    priority: 'normal',
    linkTab: 'leads',
    entityId: 'lead-7',
  },
  {
    id: 'notif-6',
    type: 'task_reminder',
    title: 'Follow-up Overdue Warning',
    message: 'SEBI portfolio compliance follow-up with Amit Sengupta (HDFC Securities) was due yesterday.',
    timestamp: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    read: true,
    priority: 'high',
    linkTab: 'tasks',
    entityId: 'task-3',
  },
];

const loadPersistedNotifications = (): CrmNotification[] => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = window.localStorage.getItem('vedaflow_notifications');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    }
  } catch {}
  return initialNotifications;
};

const persistNotifications = (items: CrmNotification[]) => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem('vedaflow_notifications', JSON.stringify(items));
    }
  } catch {}
};

const initialState: NotificationsState = {
  items: loadPersistedNotifications(),
  filter: 'all',
  searchQuery: '',
};

export const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    markAsRead: (state, action: PayloadAction<string>) => {
      const notif = state.items.find((item) => item.id === action.payload);
      if (notif) {
        notif.read = true;
        persistNotifications(state.items);
      }
    },
    markAllAsRead: (state) => {
      state.items.forEach((item) => {
        item.read = true;
      });
      persistNotifications(state.items);
    },
    addNotification: (
      state,
      action: PayloadAction<Omit<CrmNotification, 'id' | 'timestamp' | 'read'>>
    ) => {
      const newNotif: CrmNotification = {
        ...action.payload,
        id: `notif-${Date.now()}`,
        timestamp: new Date().toISOString(),
        read: false,
      };
      state.items.unshift(newNotif);
      persistNotifications(state.items);
    },
    deleteNotification: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      persistNotifications(state.items);
    },
    clearAllNotifications: (state) => {
      state.items = [];
      persistNotifications(state.items);
    },
    setNotificationFilter: (
      state,
      action: PayloadAction<NotificationType | 'all' | 'unread'>
    ) => {
      state.filter = action.payload;
    },
    setNotificationSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    seedUserNotifications: (state, action: PayloadAction<CrmNotification[]>) => {
      state.items = [...action.payload, ...state.items];
      persistNotifications(state.items);
    },
  },
});

export const {
  markAsRead,
  markAllAsRead,
  addNotification,
  deleteNotification,
  clearAllNotifications,
  setNotificationFilter,
  setNotificationSearchQuery,
  seedUserNotifications,
} = notificationsSlice.actions;

export default notificationsSlice.reducer;

