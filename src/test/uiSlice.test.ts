import { describe, it, expect } from 'vitest';
import uiReducer, {
  setColorTheme,
  setActiveTab,
  toggleSidebar,
  openModal,
  closeModal,
  addToast,
  removeToast,
} from '@/store/uiSlice';

describe('UI Slice', () => {
  const initialUserState = {
    name: 'Aarav Sharma',
    email: 'aarav.s@vedaflow.in',
    title: 'Head of Enterprise Sales & Operations (India)',
    role: 'Enterprise Regional Director',
    department: 'India Enterprise Growth',
    avatar: '',
    phone: '+91 98201 44521',
    status: 'online' as const,
    timezone: 'Asia/Kolkata (IST)',
    currency: 'INR (₹)',
    quota: 85000000,
    closedWonAmount: 72000000,
    activeDealsCount: 22,
  };

  const initialState = {
    colorTheme: 'sunset-copper' as const,
    activeTab: 'dashboard' as const,
    workspaceScope: 'personal' as const,
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

  it('sets color theme and active tab', () => {
    let state = uiReducer(initialState, setColorTheme('sapphire'));
    expect(state.colorTheme).toBe('sapphire');

    state = uiReducer(state, setActiveTab('pipeline'));
    expect(state.activeTab).toBe('pipeline');
    expect(state.mobileMenuOpen).toBe(false);
  });

  it('toggles sidebar', () => {
    const state = uiReducer(initialState, toggleSidebar());
    expect(state.sidebarCollapsed).toBe(true);
  });

  it('opens and closes modals', () => {
    let state = uiReducer(initialState, openModal('dealFormOpen'));
    expect(state.modals.dealFormOpen).toBe(true);

    state = uiReducer(state, closeModal('dealFormOpen'));
    expect(state.modals.dealFormOpen).toBe(false);
  });

  it('adds and removes toast messages', () => {
    const state = uiReducer(
      initialState,
      addToast({
        type: 'success',
        title: 'Operation successful',
        message: 'Everything saved properly',
      })
    );
    expect(state.toasts.length).toBe(1);
    expect(state.toasts[0].title).toBe('Operation successful');

    const toastId = state.toasts[0].id;
    const nextState = uiReducer(state, removeToast(toastId));
    expect(nextState.toasts.length).toBe(0);
  });
});

