import { describe, it, expect } from 'vitest';
import { generateRandomUserData, populateUserRandomData } from '@/utils/randomDataGenerator';
import { store } from '@/store';

describe('Random Data Generator', () => {
  it('generates non-zero randomized CRM data for any user identity', () => {
    const user = { name: 'Sushanth Rep', role: 'Enterprise AE' };
    const data = generateRandomUserData(user);

    expect(data.leads.length).toBeGreaterThanOrEqual(5);
    expect(data.deals.length).toBeGreaterThanOrEqual(4);
    expect(data.customers.length).toBeGreaterThanOrEqual(3);
    expect(data.tasks.length).toBeGreaterThanOrEqual(3);
    expect(data.activities.length).toBeGreaterThanOrEqual(4);
    expect(data.notifications.length).toBeGreaterThanOrEqual(3);

    // Verify all records are assigned to the specified user
    data.leads.forEach((lead) => {
      expect(lead.assignedTo).toBe('Sushanth Rep');
      expect(lead.estimatedValue).toBeGreaterThan(0);
    });

    data.deals.forEach((deal) => {
      expect(deal.assignedTo).toBe('Sushanth Rep');
      expect(deal.amount).toBeGreaterThan(0);
    });

    data.customers.forEach((customer) => {
      expect(customer.accountManager).toBe('Sushanth Rep');
      expect(customer.totalRevenue).toBeGreaterThan(0);
    });

    data.tasks.forEach((task) => {
      expect(task.assignedTo).toBe('Sushanth Rep');
    });

    data.activities.forEach((act) => {
      expect(act.performedBy).toBe('Sushanth Rep');
    });
  });

  it('populates Redux store slices dynamically for any login', () => {
    const user = { name: 'Test User 99', role: 'Enterprise Account Executive' };
    populateUserRandomData(store.dispatch, user);

    const state = store.getState();
    const userLeads = state.leads.items.filter((l) => l.assignedTo === 'Test User 99');
    const userDeals = state.deals.items.filter((d) => d.assignedTo === 'Test User 99');
    const userCustomers = state.customers.items.filter((c) => c.accountManager === 'Test User 99');
    const userTasks = state.tasks.items.filter((t) => t.assignedTo === 'Test User 99');

    expect(userLeads.length).toBeGreaterThanOrEqual(5);
    expect(userDeals.length).toBeGreaterThanOrEqual(4);
    expect(userCustomers.length).toBeGreaterThanOrEqual(3);
    expect(userTasks.length).toBeGreaterThanOrEqual(3);
  });
});

