import { describe, it, expect } from 'vitest';
import {
  formatCurrency,
  formatCompactCurrency,
  formatDate,
  getPriorityBadge,
  getLeadStatusColor,
} from '@/utils/formatters';

describe('Formatters utility', () => {
  it('formats currency correctly without decimal places', () => {
    const formatted = formatCurrency(125000);
    expect(formatted).toContain('1,25,000');
    expect(formatted).toContain('₹');
  });

  it('formats compact currency with K, L (Lakhs), and Cr (Crores) abbreviations', () => {
    expect(formatCompactCurrency(15000000)).toBe('₹1.50 Cr');
    expect(formatCompactCurrency(2400000)).toBe('₹24.0 L');
    expect(formatCompactCurrency(8000)).toBe('₹8 K');
    expect(formatCompactCurrency(800)).toBe('₹800');
  });

  it('formats dates consistently', () => {
    const formatted = formatDate('2026-10-18T10:15:00Z');
    expect(formatted).toContain('2026');
  });

  it('returns valid priority badge classes', () => {
    expect(getPriorityBadge('Urgent')).toContain('text-red-700');
    expect(getPriorityBadge('Low')).toContain('text-emerald-700');
  });

  it('returns valid lead status classes', () => {
    expect(getLeadStatusColor('Qualified')).toContain('amber');
    expect(getLeadStatusColor('Converted')).toContain('emerald');
  });
});

