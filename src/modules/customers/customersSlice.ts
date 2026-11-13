import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Customer } from '@/types/crm';
import { mockCustomers } from '@/data/mockData';

interface CustomersState {
  items: Customer[];
  selectedCustomerId: string | null;
  searchQuery: string;
  tierFilter: string | 'All';
  statusFilter: string | 'All';
  isLoading: boolean;
  error: string | null;
}

const initialState: CustomersState = {
  items: mockCustomers,
  selectedCustomerId: null,
  searchQuery: '',
  tierFilter: 'All',
  statusFilter: 'All',
  isLoading: false,
  error: null,
};

export const customersSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    addCustomer: (state, action: PayloadAction<Omit<Customer, 'id' | 'joinedDate' | 'lastActive'>>) => {
      const now = new Date().toISOString();
      const newCustomer: Customer = {
        ...action.payload,
        id: `cust-${Date.now()}`,
        joinedDate: now,
        lastActive: now,
      };
      state.items.unshift(newCustomer);
    },
    updateCustomer: (state, action: PayloadAction<Customer>) => {
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteCustomer: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      if (state.selectedCustomerId === action.payload) {
        state.selectedCustomerId = null;
      }
    },
    setSelectedCustomerId: (state, action: PayloadAction<string | null>) => {
      state.selectedCustomerId = action.payload;
    },
    setCustomerSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setCustomerTierFilter: (state, action: PayloadAction<string | 'All'>) => {
      state.tierFilter = action.payload;
    },
    setCustomerStatusFilter: (state, action: PayloadAction<string | 'All'>) => {
      state.statusFilter = action.payload;
    },
    seedUserCustomers: (state, action: PayloadAction<{ userName: string; customers: Customer[] }>) => {
      const otherCustomers = state.items.filter(
        (c) => c.accountManager.toLowerCase() !== action.payload.userName.toLowerCase()
      );
      state.items = [...action.payload.customers, ...otherCustomers];
    },
  },
});

export const {
  addCustomer,
  updateCustomer,
  deleteCustomer,
  setSelectedCustomerId,
  setCustomerSearchQuery,
  setCustomerTierFilter,
  setCustomerStatusFilter,
  seedUserCustomers,
} = customersSlice.actions;

export default customersSlice.reducer;
