import { describe, it, expect } from 'vitest';
import leadsReducer, {
  scheduleLeadFollowUp,
  setAssignedFilter,
} from '@/modules/leads/leadsSlice';
import { Lead } from '@/types/crm';

describe('Lead Follow-Up Scheduling & Assignment Filter', () => {
  const sampleLead: Lead = {
    id: 'lead-test-1',
    name: 'Rohit Verma',
    email: 'rohit@techcorp.in',
    phone: '+91 98123 45678',
    company: 'TechCorp India',
    title: 'VP Engineering',
    status: 'Contacted',
    source: 'LinkedIn',
    score: 88,
    estimatedValue: 4500000,
    assignedTo: 'Priya Nair',
    tags: ['Enterprise'],
    createdAt: '2026-11-01T10:00:00Z',
    country: 'India',
  };

  const initialState = {
    items: [sampleLead],
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

  it('correctly updates a lead with follow-up date, type, and notes', () => {
    const followUpDate = '2026-11-15T14:30:00Z';
    const state = leadsReducer(
      initialState,
      scheduleLeadFollowUp({
        id: 'lead-test-1',
        date: followUpDate,
        type: 'Demo',
        notes: 'Walkthrough of live API integrations and SOC2 compliance',
      })
    );

    const updatedLead = state.items.find((l) => l.id === 'lead-test-1');
    expect(updatedLead).toBeDefined();
    expect(updatedLead?.nextFollowUpDate).toBe(followUpDate);
    expect(updatedLead?.nextFollowUpType).toBe('Demo');
    expect(updatedLead?.nextFollowUpNotes).toBe(
      'Walkthrough of live API integrations and SOC2 compliance'
    );
    expect(updatedLead?.lastContactedAt).toBeDefined();
  });

  it('updates assignedFilter correctly for personal workspace scoping', () => {
    const state = leadsReducer(initialState, setAssignedFilter('My Leads'));
    expect(state.assignedFilter).toBe('My Leads');

    const stateAll = leadsReducer(state, setAssignedFilter('All'));
    expect(stateAll.assignedFilter).toBe('All');
  });
});
