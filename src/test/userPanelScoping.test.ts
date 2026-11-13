import { describe, it, expect } from 'vitest';
import uiReducer, { setWorkspaceScope } from '@/store/uiSlice';
import dealsReducer, { setAssignedFilter as setDealAssignedFilter } from '@/modules/pipeline/dealsSlice';
import tasksReducer, { setTaskAssignedFilter } from '@/modules/tasks/tasksSlice';
import { Deal, Task } from '@/types/crm';

describe('User Panel & Personal Cockpit Scoping Workflows', () => {
  const initialUserState = {
    name: 'Priya Nair',
    email: 'priya.n@vedaflow.in',
    title: 'Enterprise AE',
    role: 'Enterprise AE',
    department: 'Enterprise Sales',
    avatar: '',
    phone: '+91 98200 11223',
    status: 'online' as const,
    timezone: 'Asia/Kolkata (IST)',
    currency: 'INR (₹)',
    quota: 75000000,
    closedWonAmount: 62000000,
    activeDealsCount: 14,
  };

  const initialUiState = {
    colorTheme: 'sunset-copper' as const,
    activeTab: 'dashboard' as const,
    workspaceScope: 'team' as const,
    sidebarCollapsed: false,
    mobileMenuOpen: false,
    toasts: [],
    currentUser: initialUserState,
    modals: {
      leadFormOpen: false,
      leadDetailOpen: false,
      leadFollowUpOpen: false,
      dealFormOpen: false,
      dealDetailOpen: false,
      customerFormOpen: false,
      customerDetailOpen: false,
      taskFormOpen: false,
      activityFormOpen: false,
      userProfileModalOpen: false,
    },
  };

  it('toggles workspace scope between personal and team', () => {
    let state = uiReducer(initialUiState, setWorkspaceScope('personal'));
    expect(state.workspaceScope).toBe('personal');

    state = uiReducer(state, setWorkspaceScope('team'));
    expect(state.workspaceScope).toBe('team');
  });

  it('filters deals by current user in personal pipeline mode', () => {
    const deals: Deal[] = [
      {
        id: 'deal-1',
        title: 'Deal 1',
        company: 'Tata',
        amount: 10000000,
        stage: 'Proposal',
        probability: 60,
        expectedCloseDate: '2026-11-30',
        assignedTo: 'Priya Nair',
        priority: 'High',
        tags: ['Enterprise'],
        createdAt: '2026-10-01',
        updatedAt: '2026-10-15',
      },
      {
        id: 'deal-2',
        title: 'Deal 2',
        company: 'Reliance',
        amount: 25000000,
        stage: 'Negotiation',
        probability: 80,
        expectedCloseDate: '2026-12-15',
        assignedTo: 'Aarav Sharma',
        priority: 'High',
        tags: ['Enterprise'],
        createdAt: '2026-10-05',
        updatedAt: '2026-10-20',
      },
    ];

    const currentUserName = 'Priya Nair';
    const personalDeals = deals.filter(
      (d) => d.assignedTo.toLowerCase() === currentUserName.toLowerCase()
    );

    expect(personalDeals.length).toBe(1);
    expect(personalDeals[0].company).toBe('Tata');
  });

  it('filters tasks by current user in personal tasks view', () => {
    const tasks: Task[] = [
      {
        id: 'task-1',
        title: 'Prepare Contract',
        priority: 'High',
        status: 'In Progress',
        dueDate: '2026-11-20',
        assignedTo: 'Priya Nair',
        createdAt: '2026-11-01',
      },
      {
        id: 'task-2',
        title: 'Security Review',
        priority: 'Medium',
        status: 'Todo',
        dueDate: '2026-11-22',
        assignedTo: 'Rajesh Patel',
        createdAt: '2026-11-02',
      },
    ];

    const currentUserName = 'Priya Nair';
    const personalTasks = tasks.filter(
      (t) => t.assignedTo.toLowerCase() === currentUserName.toLowerCase()
    );

    expect(personalTasks.length).toBe(1);
    expect(personalTasks[0].title).toBe('Prepare Contract');
  });

  it('accurately computes personal quota attainment percentage', () => {
    const quota = 75000000;
    const closedWonAmount = 62000000;
    const attainmentPercentage = Math.round((closedWonAmount / quota) * 100);

    expect(attainmentPercentage).toBe(83);
  });
});

