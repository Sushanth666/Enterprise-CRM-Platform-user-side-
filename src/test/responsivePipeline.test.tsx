import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import leadsReducer from '@/modules/leads/leadsSlice';
import dealsReducer from '@/modules/pipeline/dealsSlice';
import customersReducer from '@/modules/customers/customersSlice';
import tasksReducer from '@/modules/tasks/tasksSlice';
import activitiesReducer from '@/modules/activities/activitiesSlice';
import notificationsReducer from '@/modules/notifications/notificationsSlice';
import uiReducer from '@/store/uiSlice';
import authReducer from '@/modules/auth/authSlice';
import { PipelineBoard } from '@/modules/pipeline/PipelineBoard';
import { Layout } from '@/layout/Layout';

function createTestStore() {
  return configureStore({
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
}

describe('Responsive Pipeline and Layout across Device Breakpoints', () => {
  let store: ReturnType<typeof createTestStore>;

  beforeEach(() => {
    store = createTestStore();
  });

  it('renders Layout container with valid pt-20 padding-top to prevent mobile navbar overlap', () => {
    const { container } = render(
      <Provider store={store}>
        <Layout>
          <div data-testid="test-content">CRM Content</div>
        </Layout>
      </Provider>
    );

    const mainEl = container.querySelector('main');
    expect(mainEl).toBeInTheDocument();
    // Verify pt-20 is applied unconditionally on mobile and pb-24 prevents bottom-nav overlap
    expect(mainEl?.className).toContain('pt-20');
    expect(mainEl?.className).toContain('pb-24');
  });

  it('renders all 3 Pipeline KPI metric cards with responsive typography', () => {
    render(
      <Provider store={store}>
        <PipelineBoard />
      </Provider>
    );

    expect(screen.getByText(/Active Pipeline Value/i)).toBeInTheDocument();
    expect(screen.getByText(/Closed Won Revenue/i)).toBeInTheDocument();
    expect(screen.getByText(/Avg. Win Confidence/i)).toBeInTheDocument();
  });

  it('renders quick stage navigation tabs for mobile and tablet screens (lg:hidden)', () => {
    const { container } = render(
      <Provider store={store}>
        <PipelineBoard />
      </Provider>
    );

    // Look for the stage tabs container with lg:hidden
    const stageTabsContainer = container.querySelector('.lg\\:hidden.overflow-x-auto');
    expect(stageTabsContainer).toBeInTheDocument();

    // Verify all standard deal stages exist in the stage selector tabs
    const stages = [
      'Discovery',
      'Qualification',
      'Proposal',
      'Negotiation',
      'Contract Sent',
      'Closed Won',
      'Closed Lost',
    ];
    stages.forEach((stage) => {
      const stageButtons = screen.getAllByRole('button', { name: new RegExp(stage, 'i') });
      expect(stageButtons.length).toBeGreaterThanOrEqual(1);
    });
  });

  it('renders pipeline columns with adaptive classes for Mobile, Tablet and Desktop', () => {
    const { container } = render(
      <Provider store={store}>
        <PipelineBoard />
      </Provider>
    );

    const firstColumn = container.querySelector('#pipeline-col-Discovery');
    expect(firstColumn).toBeInTheDocument();

    const classNames = firstColumn?.className || '';
    // Mobile: w-[calc(100vw-1.5rem)]
    expect(classNames).toContain('w-[calc(100vw-1.5rem)]');
    // Tablet: sm:w-[320px] md:w-[340px]
    expect(classNames).toContain('sm:w-[320px]');
    expect(classNames).toContain('md:w-[340px]');
    // Desktop: lg:w-80
    expect(classNames).toContain('lg:w-80');
    // Snapping: snap-start sm:snap-start lg:snap-align-none
    expect(classNames).toContain('snap-start');
    expect(classNames).toContain('lg:snap-align-none');
  });

  it('renders Scope Pill Tabs with both mobile-short and desktop-full labels', () => {
    render(
      <Provider store={store}>
        <PipelineBoard />
      </Provider>
    );

    // Mobile compact labels
    expect(screen.getByText('My Deals')).toBeInTheDocument();
    expect(screen.getByText('All Deals')).toBeInTheDocument();

    // Tablet/desktop extended labels
    expect(screen.getByText('My Ongoing Deals')).toBeInTheDocument();
    expect(screen.getByText('All Pipeline Deals')).toBeInTheDocument();
  });
});

