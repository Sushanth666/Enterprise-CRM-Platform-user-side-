import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import leadsReducer from '@/modules/leads/leadsSlice';
import dealsReducer from '@/modules/pipeline/dealsSlice';
import customersReducer from '@/modules/customers/customersSlice';
import tasksReducer from '@/modules/tasks/tasksSlice';
import activitiesReducer from '@/modules/activities/activitiesSlice';
import notificationsReducer from '@/modules/notifications/notificationsSlice';
import uiReducer from './uiSlice';
import authReducer from '@/modules/auth/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    leads: leadsReducer,
    deals: dealsReducer,
    customers: customersReducer,
    tasks: tasksReducer,
    activities: activitiesReducer,
    notifications: notificationsReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
