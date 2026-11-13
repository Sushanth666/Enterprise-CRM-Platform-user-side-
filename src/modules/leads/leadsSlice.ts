import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Lead, LeadStatus, LeadSource } from '@/types/crm';
import { mockLeads } from '@/data/mockData';

interface LeadsState {
  items: Lead[];
  selectedLeadId: string | null;
  searchQuery: string;
  statusFilter: LeadStatus | 'All';
  sourceFilter: LeadSource | 'All';
  assignedFilter: string;
  sortBy: 'score' | 'estimatedValue' | 'createdAt' | 'name';
  sortOrder: 'asc' | 'desc';
  viewMode?: 'grid' | 'table';
  isLoading: boolean;
  error: string | null;
}

const initialState: LeadsState = {
  items: mockLeads,
  selectedLeadId: null,
  searchQuery: '',
  statusFilter: 'All',
  sourceFilter: 'All',
  assignedFilter: 'All',
  sortBy: 'createdAt',
  sortOrder: 'desc',
  viewMode: 'grid',
  isLoading: false,
  error: null,
};

export const leadsSlice = createSlice({
  name: 'leads',
  initialState,
  reducers: {
    addLead: (state, action: PayloadAction<Omit<Lead, 'id' | 'createdAt'>>) => {
      const newLead: Lead = {
        ...action.payload,
        id: `lead-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      state.items.unshift(newLead);
    },
    updateLead: (state, action: PayloadAction<Lead>) => {
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    updateLeadStatus: (state, action: PayloadAction<{ id: string; status: LeadStatus }>) => {
      const lead = state.items.find(item => item.id === action.payload.id);
      if (lead) {
        lead.status = action.payload.status;
      }
    },
    scheduleLeadFollowUp: (
      state,
      action: PayloadAction<{
        id: string;
        date: string;
        type: 'Call' | 'Meeting' | 'Email' | 'Demo';
        notes?: string;
      }>
    ) => {
      const lead = state.items.find((item) => item.id === action.payload.id);
      if (lead) {
        lead.nextFollowUpDate = action.payload.date;
        lead.nextFollowUpType = action.payload.type;
        lead.nextFollowUpNotes = action.payload.notes;
        lead.lastContactedAt = new Date().toISOString();
      }
    },
    setAssignedFilter: (state, action: PayloadAction<string>) => {
      state.assignedFilter = action.payload;
    },
    deleteLead: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      if (state.selectedLeadId === action.payload) {
        state.selectedLeadId = null;
      }
    },
    setSelectedLeadId: (state, action: PayloadAction<string | null>) => {
      state.selectedLeadId = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setStatusFilter: (state, action: PayloadAction<LeadStatus | 'All'>) => {
      state.statusFilter = action.payload;
    },
    setSourceFilter: (state, action: PayloadAction<LeadSource | 'All'>) => {
      state.sourceFilter = action.payload;
    },
    setSortBy: (state, action: PayloadAction<'score' | 'estimatedValue' | 'createdAt' | 'name'>) => {
      state.sortBy = action.payload;
    },
    toggleSortOrder: (state) => {
      state.sortOrder = state.sortOrder === 'asc' ? 'desc' : 'asc';
    },
    setViewMode: (state, action: PayloadAction<'grid' | 'table'>) => {
      state.viewMode = action.payload;
    },
    seedUserLeads: (state, action: PayloadAction<{ userName: string; leads: Lead[] }>) => {
      const otherLeads = state.items.filter(
        (l) => l.assignedTo.toLowerCase() !== action.payload.userName.toLowerCase()
      );
      state.items = [...action.payload.leads, ...otherLeads];
    },
  },
});

export const {
  addLead,
  updateLead,
  updateLeadStatus,
  scheduleLeadFollowUp,
  deleteLead,
  setSelectedLeadId,
  setSearchQuery,
  setStatusFilter,
  setSourceFilter,
  setAssignedFilter,
  setSortBy,
  toggleSortOrder,
  setViewMode,
  seedUserLeads,
} = leadsSlice.actions;

export default leadsSlice.reducer;
