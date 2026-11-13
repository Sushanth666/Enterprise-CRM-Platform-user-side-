import { describe, it, expect } from 'vitest';
import customersReducer, {
  addCustomer,
  updateCustomer,
  deleteCustomer,
  setSelectedCustomerId,
  setCustomerSearchQuery,
  setCustomerTierFilter,
  setCustomerStatusFilter,
} from '@/modules/customers/customersSlice';
import { Customer } from '@/types/crm';

describe('Customers Slice', () => {
  const dummyCustomer: Customer = {
    id: 'cust-101',
    name: 'Vikram Mehta',
    email: 'vikram@tata.com',
    phone: '+91 98210 11223',
    company: 'Tata Consultancy Services',
    title: 'Chief Technology Officer',
    industry: 'Information Technology',
    status: 'Active',
    totalRevenue: 45000000,
    healthScore: 94,
    accountManager: 'Aarav Sharma',
    tier: 'Enterprise',
    joinedDate: '2025-01-10T00:00:00Z',
    lastActive: '2026-11-01T00:00:00Z',
    tags: ['Strategic', 'Cloud'],
    notes: 'Key strategic account in India',
  };

  const initialState = {
    items: [dummyCustomer],
    selectedCustomerId: null,
    searchQuery: '',
    tierFilter: 'All' as const,
    statusFilter: 'All' as const,
    isLoading: false,
    error: null,
  };

  it('adds a new customer successfully', () => {
    const newCustData = {
      name: 'Rohan Deshmukh',
      email: 'rohan@infosys.com',
      phone: '+91 99887 76655',
      company: 'Infosys Limited',
      title: 'VP Engineering',
      industry: 'Software',
      status: 'Active' as const,
      totalRevenue: 28000000,
      healthScore: 88,
      accountManager: 'Priya Nair',
      tier: 'Enterprise' as const,
      tags: ['SaaS'],
    };

    const state = customersReducer(initialState, addCustomer(newCustData));
    expect(state.items.length).toBe(2);
    expect(state.items[0].company).toBe('Infosys Limited');
    expect(state.items[0].id).toBeDefined();
    expect(state.items[0].joinedDate).toBeDefined();
  });

  it('updates an existing customer', () => {
    const updated = { ...dummyCustomer, healthScore: 99, status: 'Active' as const };
    const state = customersReducer(initialState, updateCustomer(updated));
    expect(state.items[0].healthScore).toBe(99);
  });

  it('deletes a customer and clears selection if selected', () => {
    const selectedState = { ...initialState, selectedCustomerId: 'cust-101' };
    const state = customersReducer(selectedState, deleteCustomer('cust-101'));
    expect(state.items.length).toBe(0);
    expect(state.selectedCustomerId).toBeNull();
  });

  it('sets search query and filters', () => {
    let state = customersReducer(initialState, setCustomerSearchQuery('Tata'));
    expect(state.searchQuery).toBe('Tata');

    state = customersReducer(state, setCustomerTierFilter('Enterprise'));
    expect(state.tierFilter).toBe('Enterprise');

    state = customersReducer(state, setCustomerStatusFilter('Active'));
    expect(state.statusFilter).toBe('Active');

    state = customersReducer(state, setSelectedCustomerId('cust-101'));
    expect(state.selectedCustomerId).toBe('cust-101');
  });
});
