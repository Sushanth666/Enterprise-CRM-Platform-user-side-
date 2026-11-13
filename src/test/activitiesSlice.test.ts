import { describe, it, expect } from 'vitest';
import activitiesReducer, {
  addActivity,
  deleteActivity,
  setActivityTypeFilter,
  setActivitySearchQuery,
} from '@/modules/activities/activitiesSlice';
import { Activity } from '@/types/crm';

describe('Activities Slice', () => {
  const dummyActivity: Activity = {
    id: 'act-1',
    type: 'Call',
    title: 'Discovery call with VP Sales',
    description: 'Discussed Q4 expansion requirements',
    entityType: 'Lead',
    entityId: 'lead-1',
    entityName: 'Reliance Retail',
    performedBy: 'Aarav Sharma',
    timestamp: '2026-11-01T10:00:00Z',
  };

  const initialState = {
    items: [dummyActivity],
    typeFilter: 'All' as const,
    searchQuery: '',
    isLoading: false,
    error: null,
  };

  it('adds an activity', () => {
    const newAct = {
      type: 'Meeting' as const,
      title: 'Quarterly review presentation',
      description: 'Presented ROI dashboard',
      entityType: 'Customer' as const,
      entityId: 'cust-1',
      entityName: 'Flipkart',
      performedBy: 'Priya Nair',
    };

    const state = activitiesReducer(initialState, addActivity(newAct));
    expect(state.items.length).toBe(2);
    expect(state.items[0].title).toBe('Quarterly review presentation');
    expect(state.items[0].id).toBeDefined();
    expect(state.items[0].timestamp).toBeDefined();
  });

  it('deletes an activity', () => {
    const state = activitiesReducer(initialState, deleteActivity('act-1'));
    expect(state.items.length).toBe(0);
  });

  it('sets activity filter and search query', () => {
    let state = activitiesReducer(initialState, setActivityTypeFilter('Meeting'));
    expect(state.typeFilter).toBe('Meeting');

    state = activitiesReducer(state, setActivitySearchQuery('Discovery'));
    expect(state.searchQuery).toBe('Discovery');
  });
});

