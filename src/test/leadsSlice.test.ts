import { describe, it, expect } from 'vitest';
import leadsReducer, {
  addLead,
  updateLeadStatus,
  deleteLead,
  setSearchQuery,
  setStatusFilter,
} from '@/modules/leads/leadsSlice';

describe('Leads Slice', () => {
  const initialState = {
    items: [
      {
        id: 'lead-1',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890',
        company: 'Example Corp',
        title: 'VP Sales',
        status: 'New' as const,
        source: 'Website' as const,
        score: 80,
        estimatedValue: 50000,
        assignedTo: 'Alex Rivera',
        tags: ['Tech'],
        createdAt: '2026-10-01T00:00:00Z',
      },
    ],
    selectedLeadId: null,
    searchQuery: '',
    statusFilter: 'All' as const,
    sourceFilter: 'All' as const,
    assignedFilter: 'All',
    sortBy: 'createdAt' as const,
    sortOrder: 'desc' as const,
    isLoading: false,
    error: null,
  };

  it('handles addLead action', () => {
    const newLead = {
      name: 'Jane Smith',
      email: 'jane@enterprise.com',
      phone: '9876543210',
      company: 'Enterprise Inc',
      title: 'CTO',
      status: 'Qualified' as const,
      source: 'LinkedIn' as const,
      score: 95,
      estimatedValue: 120000,
      assignedTo: 'Sarah Connor',
      tags: ['Enterprise'],
    };

    const state = leadsReducer(initialState, addLead(newLead));
    expect(state.items.length).toBe(2);
    expect(state.items[0].name).toBe('Jane Smith');
    expect(state.items[0].id).toContain('lead-');
  });

  it('handles updateLeadStatus action', () => {
    const state = leadsReducer(
      initialState,
      updateLeadStatus({ id: 'lead-1', status: 'Converted' })
    );
    expect(state.items[0].status).toBe('Converted');
  });

  it('handles deleteLead action', () => {
    const state = leadsReducer(initialState, deleteLead('lead-1'));
    expect(state.items.length).toBe(0);
  });

  it('handles setSearchQuery and setStatusFilter', () => {
    let state = leadsReducer(initialState, setSearchQuery('Acme'));
    expect(state.searchQuery).toBe('Acme');

    state = leadsReducer(state, setStatusFilter('Qualified'));
    expect(state.statusFilter).toBe('Qualified');
  });
});

