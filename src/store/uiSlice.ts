import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type ActiveNavTab = 
  | 'dashboard' 
  | 'leads' 
  | 'pipeline' 
  | 'customers' 
  | 'tasks' 
  | 'activities' 
  | 'analytics'
  | 'notifications';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  title: string;
  role: string;
  department: string;
  avatar: string;
  phone: string;
  status: 'online' | 'busy' | 'away' | 'offline';
  timezone: string;
  currency: string;
  quota: number;
  closedWonAmount: number;
  activeDealsCount: number;
}

export type ColorTheme = 
  | 'sunset-copper'
  | 'sapphire' 
  | 'emerald' 
  | 'violet' 
  | 'rose' 
  | 'amber' 
  | 'cyan' 
  | 'indigo';

interface UIState {
  colorTheme: ColorTheme;
  activeTab: ActiveNavTab;
  workspaceScope: 'personal' | 'team';
  sidebarCollapsed: boolean;
  mobileMenuOpen: boolean;
  toasts: ToastMessage[];
  currentUser: UserProfile;
  modals: {
    leadFormOpen: boolean;
    leadDetailOpen: boolean;
    leadFollowUpOpen: boolean;
    dealFormOpen: boolean;
    dealDetailOpen: boolean;
    customerFormOpen: boolean;
    customerDetailOpen: boolean;
    taskFormOpen: boolean;
    activityFormOpen: boolean;
    userProfileModalOpen: boolean;
  };
}

const initialUser: UserProfile = {
  name: 'Aarav Sharma',
  email: 'aarav.s@apexcrm.in',
  title: 'Head of Enterprise Sales & Operations (India)',
  role: 'Enterprise Regional Director',
  department: 'India Enterprise Growth',
  avatar: '',
  phone: '+91 98201 44521',
  status: 'online',
  timezone: 'Asia/Kolkata (IST)',
  currency: 'INR (₹)',
  quota: 85000000,
  closedWonAmount: 72000000,
  activeDealsCount: 22,
};

const loadPersistedTab = (): ActiveNavTab => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = window.localStorage.getItem('vedaflow_active_tab') as ActiveNavTab;
      const validTabs: ActiveNavTab[] = [
        'dashboard',
        'leads',
        'pipeline',
        'customers',
        'tasks',
        'activities',
        'analytics',
        'notifications',
      ];
      if (validTabs.includes(stored)) {
        return stored;
      }
    }
  } catch {}
  return 'dashboard';
};

const loadPersistedScope = (): 'personal' | 'team' => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = window.localStorage.getItem('vedaflow_scope');
      if (stored === 'personal' || stored === 'team') return stored;
    }
  } catch {}
  return 'personal';
};

const loadPersistedTheme = (): ColorTheme => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = window.localStorage.getItem('vedaflow_theme') as ColorTheme;
      if (stored) return stored;
    }
  } catch {}
  return 'sunset-copper';
};

const initialState: UIState = {
  colorTheme: loadPersistedTheme(),
  activeTab: loadPersistedTab(),
  workspaceScope: loadPersistedScope(),
  sidebarCollapsed: false,
  mobileMenuOpen: false,
  toasts: [],
  currentUser: initialUser,
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

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setColorTheme: (state, action: PayloadAction<ColorTheme>) => {
      state.colorTheme = action.payload;
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.setItem('vedaflow_theme', action.payload);
        }
      } catch {}
    },
    setActiveTab: (state, action: PayloadAction<ActiveNavTab>) => {
      state.activeTab = action.payload;
      state.mobileMenuOpen = false;
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.setItem('vedaflow_active_tab', action.payload);
        }
      } catch {}
    },
    setWorkspaceScope: (state, action: PayloadAction<'personal' | 'team'>) => {
      state.workspaceScope = action.payload;
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.setItem('vedaflow_scope', action.payload);
        }
      } catch {}
    },
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload;
    },
    toggleMobileMenu: (state) => {
      state.mobileMenuOpen = !state.mobileMenuOpen;
    },
    setMobileMenuOpen: (state, action: PayloadAction<boolean>) => {
      state.mobileMenuOpen = action.payload;
    },
    openModal: (state, action: PayloadAction<keyof UIState['modals']>) => {
      state.modals[action.payload] = true;
    },
    closeModal: (state, action: PayloadAction<keyof UIState['modals']>) => {
      state.modals[action.payload] = false;
    },
    updateCurrentUser: (state, action: PayloadAction<Partial<UserProfile>>) => {
      state.currentUser = { ...state.currentUser, ...action.payload };
    },
    setCurrentUserStatus: (state, action: PayloadAction<UserProfile['status']>) => {
      state.currentUser.status = action.payload;
    },
    addToast: (state, action: PayloadAction<Omit<ToastMessage, 'id'>>) => {
      const toast: ToastMessage = {
        ...action.payload,
        id: `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      };
      state.toasts.push(toast);
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter(t => t.id !== action.payload);
    },
  },
});

export const {
  setColorTheme,
  setActiveTab,
  setWorkspaceScope,
  toggleSidebar,
  setSidebarCollapsed,
  toggleMobileMenu,
  setMobileMenuOpen,
  openModal,
  closeModal,
  updateCurrentUser,
  setCurrentUserStatus,
  addToast,
  removeToast,
} = uiSlice.actions;

export default uiSlice.reducer;
