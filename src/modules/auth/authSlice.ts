import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { mockTeamMembers } from '@/data/mockData';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  company?: string;
  role: string;
  title: string;
  department?: string;
  avatar?: string;
  phone?: string;
  status: 'online' | 'busy' | 'away' | 'offline';
  timezone?: string;
  currency?: string;
  quota: number;
  closedWonAmount: number;
  activeDealsCount: number;
}

interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser;
  isLoading: boolean;
  error: string | null;
}

const defaultUser: AuthUser = {
  id: 'usr-1',
  name: 'Aarav Sharma',
  email: 'aarav.s@vedaflow.in',
  company: 'VedaFlow Technologies India Pvt. Ltd.',
  role: 'Enterprise Regional Director',
  title: 'Head of Enterprise Sales & Operations (India)',
  department: 'India Enterprise Growth',
  avatar: '', // Empty by default so it renders First Letter ('A')!
  phone: '+91 98201 44521',
  status: 'online',
  timezone: 'Asia/Kolkata (IST)',
  currency: 'INR (₹)',
  quota: 85000000,
  closedWonAmount: 72000000,
  activeDealsCount: 22,
};

const loadPersistedAuth = (): { isAuthenticated: boolean; user: AuthUser } => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = window.localStorage.getItem('vedaflow_auth');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed.isAuthenticated === 'boolean' && parsed.user) {
          return {
            isAuthenticated: parsed.isAuthenticated,
            user: { ...defaultUser, ...parsed.user },
          };
        }
      }
    }
  } catch {
    // Ignore storage parse error
  }
  return {
    isAuthenticated: false,
    user: defaultUser,
  };
};

export const persistAuth = (isAuthenticated: boolean, user: AuthUser) => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      if (isAuthenticated) {
        window.localStorage.setItem('vedaflow_auth', JSON.stringify({ isAuthenticated, user }));
      } else {
        window.localStorage.removeItem('vedaflow_auth');
      }
    }
  } catch {
    // Ignore storage write error
  }
};

export interface RegisteredUser {
  name: string;
  email: string;
  phone: string;
  company: string;
  role: string;
  password?: string;
}

export const loadRegisteredUsers = (): RegisteredUser[] => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = window.localStorage.getItem('vedaflow_registered_users');
      if (stored) {
        return JSON.parse(stored) as RegisteredUser[];
      }
    }
  } catch {
    // Ignore storage parse error
  }
  return [];
};

export const saveRegisteredUser = (user: RegisteredUser) => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const users = loadRegisteredUsers();
      const existingIdx = users.findIndex(
        (u) =>
          (u.email && user.email && u.email.toLowerCase() === user.email.toLowerCase()) ||
          (u.phone && user.phone && u.phone.replace(/\D/g, '') === user.phone.replace(/\D/g, ''))
      );
      if (existingIdx >= 0) {
        users[existingIdx] = user;
      } else {
        users.push(user);
      }
      window.localStorage.setItem('vedaflow_registered_users', JSON.stringify(users));
    }
  } catch {
    // Ignore storage write error
  }
};

const persistedAuth = loadPersistedAuth();

const initialState: AuthState = {
  isAuthenticated: persistedAuth.isAuthenticated,
  user: persistedAuth.user,
  isLoading: false,
  error: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{
        email?: string;
        phone?: string;
        name?: string;
        role?: string;
        company?: string;
        title?: string;
        department?: string;
        quota?: number;
        closedWonAmount?: number;
        activeDealsCount?: number;
        avatar?: string;
      }>
    ) => {
      const email = action.payload.email;
      const phone = action.payload.phone;

      // 1. Check registered users in localStorage first
      const registeredUsers = loadRegisteredUsers();
      const matchedRegistered = registeredUsers.find((u) => {
        if (email && u.email && u.email.toLowerCase() === email.toLowerCase()) return true;
        if (phone && u.phone) {
          const cleanInputPhone = phone.replace(/\D/g, '');
          const cleanUserPhone = u.phone.replace(/\D/g, '');
          return cleanUserPhone.endsWith(cleanInputPhone) || cleanInputPhone.endsWith(cleanUserPhone);
        }
        return false;
      });

      // 2. Fall back to mock team members
      const matchedMember = matchedRegistered
        ? null
        : mockTeamMembers.find((m) => {
            if (email && m.email.toLowerCase() === email.toLowerCase()) return true;
            if (phone && m.phone) {
              const cleanInputPhone = phone.replace(/\D/g, '');
              const cleanMemberPhone = m.phone.replace(/\D/g, '');
              return cleanMemberPhone.endsWith(cleanInputPhone) || cleanInputPhone.endsWith(cleanMemberPhone);
            }
            return false;
          });

      const effectiveEmail =
        email ||
        (matchedRegistered
          ? matchedRegistered.email
          : matchedMember
          ? matchedMember.email
          : `${phone ? phone.replace(/\D/g, '').slice(-10) : 'user'}@vedaflow.in`);

      const effectivePhone =
        phone ||
        (matchedRegistered?.phone
          ? matchedRegistered.phone
          : matchedMember?.phone
          ? matchedMember.phone
          : state.user.phone);

      const name =
        action.payload.name ||
        (matchedRegistered
          ? matchedRegistered.name
          : matchedMember
          ? matchedMember.name
          : effectiveEmail.split('@')[0].replace('.', ' ').replace(/\b\w/g, (c) => c.toUpperCase()));

      const role =
        action.payload.role ||
        (matchedRegistered
          ? matchedRegistered.role
          : matchedMember
          ? matchedMember.role
          : 'Enterprise AE');

      const company =
        action.payload.company ||
        (matchedRegistered
          ? matchedRegistered.company
          : 'VedaFlow Technologies India');

      state.isAuthenticated = true;
      state.user = {
        ...state.user,
        name,
        email: effectiveEmail,
        phone: effectivePhone,
        company,
        role: role,
        title: action.payload.title || (matchedMember ? `${matchedMember.role} Specialist` : `${role} Specialist`),
        department: action.payload.department || 'Enterprise Commercial Sales',
        avatar: action.payload.avatar !== undefined ? action.payload.avatar : (matchedMember ? matchedMember.avatar : ''),
        status: 'online',
        quota: action.payload.quota ?? (matchedMember ? matchedMember.quota : 75000000),
        closedWonAmount: action.payload.closedWonAmount ?? (matchedMember ? matchedMember.closedWonAmount : 50000000),
        activeDealsCount: action.payload.activeDealsCount ?? (matchedMember ? matchedMember.activeDealsCount : 12),
      };
      state.error = null;
      persistAuth(true, state.user);
    },
    signup: (
      state,
      action: PayloadAction<{
        name: string;
        email: string;
        company: string;
        role?: string;
        phone?: string;
        password?: string;
      }>
    ) => {
      state.isAuthenticated = true;
      const role = action.payload.role || 'Enterprise Account Executive';
      const userPhone = action.payload.phone || '';

      if (userPhone || action.payload.email) {
        saveRegisteredUser({
          name: action.payload.name,
          email: action.payload.email,
          phone: userPhone,
          company: action.payload.company,
          role: role,
          password: action.payload.password,
        });
      }

      state.user = {
        id: `usr-${Date.now()}`,
        name: action.payload.name,
        email: action.payload.email,
        company: action.payload.company,
        role: role,
        title: role.includes('Admin') ? 'Enterprise Administrator' : `${role} Lead`,
        department: 'Enterprise Sales',
        avatar: '', // Uses first letter
        phone: userPhone,
        status: 'online',
        quota: 10000000,
        closedWonAmount: 0,
        activeDealsCount: 0,
      };
      state.error = null;
      persistAuth(true, state.user);
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.error = null;
      persistAuth(false, defaultUser);
    },
    updateAuthUser: (state, action: PayloadAction<Partial<AuthUser>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        persistAuth(state.isAuthenticated, state.user);
      }
    },
    setAuthUserStatus: (state, action: PayloadAction<AuthUser['status']>) => {
      if (state.user) {
        state.user.status = action.payload;
        persistAuth(state.isAuthenticated, state.user);
      }
    },
  },
});

export const {
  login,
  signup,
  logout,
  updateAuthUser,
  setAuthUserStatus,
} = authSlice.actions;

export default authSlice.reducer;
