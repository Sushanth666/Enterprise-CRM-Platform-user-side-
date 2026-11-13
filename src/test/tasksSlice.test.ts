import { describe, it, expect } from 'vitest';
import tasksReducer, {
  addTask,
  toggleTaskStatus,
  updateTaskStatus,
  deleteTask,
} from '@/modules/tasks/tasksSlice';

describe('Tasks Slice', () => {
  const initialState = {
    items: [
      {
        id: 'task-1',
        title: 'Review Legal Master Agreement',
        assignedTo: 'Sarah Connor',
        priority: 'Urgent' as const,
        status: 'In Progress' as const,
        dueDate: '2026-11-05',
        createdAt: '2026-10-20T00:00:00Z',
      },
    ],
    searchQuery: '',
    statusFilter: 'All' as const,
    priorityFilter: 'All' as const,
    assignedFilter: 'All',
    isLoading: false,
    error: null,
  };

  it('toggles task status to Completed and sets completedAt', () => {
    const state = tasksReducer(initialState, toggleTaskStatus('task-1'));
    expect(state.items[0].status).toBe('Completed');
    expect(state.items[0].completedAt).toBeDefined();

    // Toggle back
    const reopened = tasksReducer(state, toggleTaskStatus('task-1'));
    expect(reopened.items[0].status).toBe('In Progress');
    expect(reopened.items[0].completedAt).toBeUndefined();
  });

  it('handles addTask action', () => {
    const newTask = {
      title: 'Send follow-up deck',
      assignedTo: 'Alex Rivera',
      priority: 'High' as const,
      status: 'Todo' as const,
      dueDate: '2026-11-10',
    };

    const state = tasksReducer(initialState, addTask(newTask));
    expect(state.items.length).toBe(2);
    expect(state.items[0].title).toBe('Send follow-up deck');
  });

  it('handles deleteTask action', () => {
    const state = tasksReducer(initialState, deleteTask('task-1'));
    expect(state.items.length).toBe(0);
  });
});

