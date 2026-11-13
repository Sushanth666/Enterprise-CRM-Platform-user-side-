import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Deal, DealStage, PriorityLevel } from '@/types/crm';
import { mockDeals } from '@/data/mockData';

interface DealsState {
  items: Deal[];
  selectedDealId: string | null;
  searchQuery: string;
  stageFilter: DealStage | 'All';
  assignedFilter: string | 'All';
  isLoading: boolean;
  error: string | null;
}

const initialState: DealsState = {
  items: mockDeals,
  selectedDealId: null,
  searchQuery: '',
  stageFilter: 'All',
  assignedFilter: 'All',
  isLoading: false,
  error: null,
};

export const dealsSlice = createSlice({
  name: 'deals',
  initialState,
  reducers: {
    addDeal: (state, action: PayloadAction<Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>>) => {
      const now = new Date().toISOString();
      const newDeal: Deal = {
        ...action.payload,
        id: `deal-${Date.now()}`,
        createdAt: now,
        updatedAt: now,
      };
      state.items.unshift(newDeal);
    },
    updateDeal: (state, action: PayloadAction<Deal>) => {
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = {
          ...action.payload,
          updatedAt: new Date().toISOString(),
        };
      }
    },
    updateDealStage: (state, action: PayloadAction<{ id: string; stage: DealStage }>) => {
      const deal = state.items.find(item => item.id === action.payload.id);
      if (deal) {
        deal.stage = action.payload.stage;
        deal.updatedAt = new Date().toISOString();
        if (action.payload.stage === 'Closed Won') {
          deal.probability = 100;
        } else if (action.payload.stage === 'Closed Lost') {
          deal.probability = 0;
        }
      }
    },
    deleteDeal: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      if (state.selectedDealId === action.payload) {
        state.selectedDealId = null;
      }
    },
    setSelectedDealId: (state, action: PayloadAction<string | null>) => {
      state.selectedDealId = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setStageFilter: (state, action: PayloadAction<DealStage | 'All'>) => {
      state.stageFilter = action.payload;
    },
    setAssignedFilter: (state, action: PayloadAction<string | 'All'>) => {
      state.assignedFilter = action.payload;
    },
    seedUserDeals: (state, action: PayloadAction<{ userName: string; deals: Deal[] }>) => {
      const otherDeals = state.items.filter(
        (d) => d.assignedTo.toLowerCase() !== action.payload.userName.toLowerCase()
      );
      state.items = [...action.payload.deals, ...otherDeals];
    },
  },
});

export const {
  addDeal,
  updateDeal,
  updateDealStage,
  deleteDeal,
  setSelectedDealId,
  setSearchQuery,
  setStageFilter,
  setAssignedFilter,
  seedUserDeals,
} = dealsSlice.actions;

export default dealsSlice.reducer;
