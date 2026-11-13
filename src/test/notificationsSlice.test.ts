import { describe, it, expect } from 'vitest';
import notificationsReducer, {
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
  setNotificationFilter,
  setNotificationSearchQuery,
  addNotification,
} from '@/modules/notifications/notificationsSlice';
import { CrmNotification } from '@/types/crm';

describe('Notifications Slice', () => {
  const dummyNotification: CrmNotification = {
    id: 'test-notif-1',
    type: 'lead_assignment',
    title: 'Test Assignment',
    message: 'A new lead has been assigned',
    timestamp: '2026-11-10T10:00:00Z',
    read: false,
    priority: 'high',
    linkTab: 'leads',
    entityId: 'lead-1',
  };

  const initialState = {
    items: [
      dummyNotification,
      {
        id: 'test-notif-2',
        type: 'meeting' as const,
        title: 'Strategy Meeting',
        message: 'Upcoming sync with Infosys',
        timestamp: '2026-11-10T11:00:00Z',
        read: false,
        priority: 'medium' as const,
        linkTab: 'activities' as const,
        entityId: 'lead-2',
      },
    ],
    filter: 'all' as const,
    searchQuery: '',
  };

  it('marks a single notification as read', () => {
    const state = notificationsReducer(initialState, markAsRead('test-notif-1'));
    expect(state.items[0].read).toBe(true);
    expect(state.items[1].read).toBe(false);
  });

  it('marks all notifications as read', () => {
    const state = notificationsReducer(initialState, markAllAsRead());
    expect(state.items.every((n) => n.read)).toBe(true);
  });

  it('deletes a notification by id', () => {
    const state = notificationsReducer(initialState, deleteNotification('test-notif-1'));
    expect(state.items.length).toBe(1);
    expect(state.items[0].id).toBe('test-notif-2');
  });

  it('clears all notifications', () => {
    const state = notificationsReducer(initialState, clearAllNotifications());
    expect(state.items.length).toBe(0);
  });

  it('sets filter and search query', () => {
    let state = notificationsReducer(initialState, setNotificationFilter('meeting'));
    expect(state.filter).toBe('meeting');

    state = notificationsReducer(state, setNotificationSearchQuery('Infosys'));
    expect(state.searchQuery).toBe('Infosys');
  });

  it('adds a new notification to the top of list', () => {
    const state = notificationsReducer(
      initialState,
      addNotification({
        type: 'task_reminder',
        title: 'Urgent Task Reminder',
        message: 'Deliver contract draft before 5 PM',
        priority: 'high',
        linkTab: 'tasks',
      })
    );

    expect(state.items.length).toBe(3);
    expect(state.items[0].title).toBe('Urgent Task Reminder');
    expect(state.items[0].read).toBe(false);
    expect(state.items[0].id).toContain('notif-');
  });
});

