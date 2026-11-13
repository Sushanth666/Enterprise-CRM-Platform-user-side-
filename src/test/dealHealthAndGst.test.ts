import { describe, it, expect } from 'vitest';
import { calculateDealHealth } from '@/utils/dealHealth';
import { calculateGstQuotation } from '@/utils/gstQuotation';
import { Deal } from '@/types/crm';

describe('calculateDealHealth', () => {
  const baseDeal: Deal = {
    id: 'deal-test-1',
    title: 'Test Enterprise CRM',
    company: 'Reliance Digital',
    amount: 15000000,
    stage: 'Proposal',
    probability: 60,
    expectedCloseDate: '2026-12-31',
    assignedTo: 'Aarav Sharma',
    priority: 'High',
    tags: ['Enterprise', 'Cloud'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  it('calculates 100% health for Closed Won deals', () => {
    const result = calculateDealHealth({ ...baseDeal, stage: 'Closed Won' });
    expect(result.healthScore).toBe(100);
    expect(result.status).toBe('healthy');
  });

  it('calculates 0% health for Closed Lost deals', () => {
    const result = calculateDealHealth({ ...baseDeal, stage: 'Closed Lost' });
    expect(result.healthScore).toBe(0);
    expect(result.status).toBe('risk');
  });

  it('detects healthy velocity for newly active deals', () => {
    const result = calculateDealHealth(baseDeal);
    expect(result.healthScore).toBeGreaterThanOrEqual(75);
    expect(result.status).toBe('healthy');
    expect(result.recommendation).toBeDefined();
  });

  it('identifies slip risk for stagnant deals', () => {
    const stagnantDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const result = calculateDealHealth({
      ...baseDeal,
      updatedAt: stagnantDate,
      createdAt: stagnantDate,
    });
    expect(result.healthScore).toBeLessThan(75);
    expect(result.riskReason).toBeDefined();
  });
});

describe('calculateGstQuotation', () => {
  const testDeal: Deal = {
    id: 'deal-101',
    title: 'HDFC Portal',
    company: 'HDFC Securities',
    amount: 100000,
    stage: 'Proposal',
    probability: 50,
    expectedCloseDate: '2026-11-20',
    assignedTo: 'Priya Nair',
    priority: 'High',
    tags: ['BFSI'],
    createdAt: '2026-10-01',
    updatedAt: '2026-10-01',
  };

  it('correctly calculates CGST and SGST (9% + 9%) for intra-state', () => {
    const quotation = calculateGstQuotation(testDeal, false);

    expect(quotation.baseAmount).toBe(100000);
    expect(quotation.cgstAmount).toBe(9000); // 9%
    expect(quotation.sgstAmount).toBe(9000); // 9%
    expect(quotation.igstAmount).toBe(0);
    expect(quotation.totalGst).toBe(18000);
    expect(quotation.grandTotal).toBe(118000);
    expect(quotation.sacCode).toBe('998313');
    expect(quotation.quotationNumber).toContain('VF-QUO-2026');
  });

  it('correctly calculates IGST (18%) for inter-state', () => {
    const quotation = calculateGstQuotation({ ...testDeal, amount: 200000 }, true);

    expect(quotation.baseAmount).toBe(200000);
    expect(quotation.cgstAmount).toBe(0);
    expect(quotation.sgstAmount).toBe(0);
    expect(quotation.igstAmount).toBe(36000); // 18%
    expect(quotation.totalGst).toBe(36000);
    expect(quotation.grandTotal).toBe(236000);
  });
});
