import { describe, it, expect } from 'vitest';
import dealsReducer, {
  addDeal,
  updateDealStage,
  deleteDeal,
  setStageFilter,
} from '@/modules/pipeline/dealsSlice';

describe('Deals Slice', () => {
  const initialState = {
    items: [
      {
        id: 'deal-1',
        title: 'Cloud Transformation',
        company: 'CloudWorks',
        amount: 150000,
        stage: 'Proposal' as const,
        probability: 60,
        expectedCloseDate: '2026-11-30',
        assignedTo: 'Sarah Connor',
        priority: 'High' as const,
        tags: ['Cloud'],
        createdAt: '2026-10-01T00:00:00Z',
        updatedAt: '2026-10-01T00:00:00Z',
      },
    ],
    selectedDealId: null,
    searchQuery: '',
    stageFilter: 'All' as const,
    assignedFilter: 'All',
    isLoading: false,
    error: null,
  };

  it('updates deal stage and probability to 100 on Closed Won', () => {
    const state = dealsReducer(
      initialState,
      updateDealStage({ id: 'deal-1', stage: 'Closed Won' })
    );
    expect(state.items[0].stage).toBe('Closed Won');
    expect(state.items[0].probability).toBe(100);
  });

  it('updates deal stage and probability to 0 on Closed Lost', () => {
    const state = dealsReducer(
      initialState,
      updateDealStage({ id: 'deal-1', stage: 'Closed Lost' })
    );
    expect(state.items[0].stage).toBe('Closed Lost');
    expect(state.items[0].probability).toBe(0);
  });

  it('handles addDeal action', () => {
    const newDeal = {
      title: 'Global Expansion',
      company: 'OmniCorp',
      amount: 300000,
      stage: 'Discovery' as const,
      probability: 20,
      expectedCloseDate: '2026-12-15',
      assignedTo: 'Alex Rivera',
      priority: 'Urgent' as const,
      tags: ['Global'],
    };

    const state = dealsReducer(initialState, addDeal(newDeal));
    expect(state.items.length).toBe(2);
    expect(state.items[0].title).toBe('Global Expansion');
    expect(state.items[0].id).toContain('deal-');
  });

  it('handles deleteDeal action', () => {
    const state = dealsReducer(initialState, deleteDeal('deal-1'));
    expect(state.items.length).toBe(0);
  });
});

