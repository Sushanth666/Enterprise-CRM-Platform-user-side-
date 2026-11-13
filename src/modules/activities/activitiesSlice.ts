import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Activity, ActivityType } from '@/types/crm';
import { mockActivities } from '@/data/mockData';

interface ActivitiesState {
  items: Activity[];
  typeFilter: ActivityType | 'All';
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
}

const initialState: ActivitiesState = {
  items: mockActivities,
  typeFilter: 'All',
  searchQuery: '',
  isLoading: false,
  error: null,
};

export const activitiesSlice = createSlice({
  name: 'activities',
  initialState,
  reducers: {
    addActivity: (state, action: PayloadAction<Omit<Activity, 'id' | 'timestamp'>>) => {
      const newActivity: Activity = {
        ...action.payload,
        id: `act-${Date.now()}`,
        timestamp: new Date().toISOString(),
      };
      state.items.unshift(newActivity);
    },
    deleteActivity: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    setActivityTypeFilter: (state, action: PayloadAction<ActivityType | 'All'>) => {
      state.typeFilter = action.payload;
    },
    setActivitySearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    seedUserActivities: (state, action: PayloadAction<{ userName: string; activities: Activity[] }>) => {
      const otherActivities = state.items.filter(
        (a) => a.performedBy.toLowerCase() !== action.payload.userName.toLowerCase()
      );
      state.items = [...action.payload.activities, ...otherActivities];
    },
  },
});

export const {
  addActivity,
  deleteActivity,
  setActivityTypeFilter,
  setActivitySearchQuery,
  seedUserActivities,
} = activitiesSlice.actions;

export default activitiesSlice.reducer;
