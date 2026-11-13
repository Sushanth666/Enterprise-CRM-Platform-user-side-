import { Deal } from '@/types/crm';

export interface DealHealthMetrics {
  healthScore: number; // 0 - 100
  status: 'healthy' | 'attention' | 'risk';
  daysInStage: number;
  riskReason?: string;
  recommendation: string;
}

/**
 * Calculates deal velocity health score and identifies slip risk based on:
 * - Days stagnant in current stage
 * - Proximity to expected close date
 * - Stage probability alignment
 */
export const calculateDealHealth = (deal: Deal): DealHealthMetrics => {
  // Approximate days since last update from createdAt/updatedAt
  const lastDate = new Date(deal.updatedAt || deal.createdAt);
  const now = new Date();
  const diffDays = Math.max(0, Math.floor((now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)));

  // If deal is closed, it's finished
  if (deal.stage === 'Closed Won') {
    return {
      healthScore: 100,
      status: 'healthy',
      daysInStage: diffDays,
      recommendation: 'Deal Closed Won. Transition to Customer Success onboarding.',
    };
  }

  if (deal.stage === 'Closed Lost') {
    return {
      healthScore: 0,
      status: 'risk',
      daysInStage: diffDays,
      riskReason: 'Opportunity marked as Closed Lost.',
      recommendation: 'Conduct lost-deal post-mortem and set 6-month re-engagement drip.',
    };
  }

  let healthScore = 88;
  let riskReason = '';
  let recommendation = 'Deal velocity healthy. Maintain weekly contact cadence.';

  // Deduct based on days stagnant in stage
  if (diffDays > 25) {
    healthScore -= 35;
    riskReason = `Stagnant in ${deal.stage} for ${diffDays} days without stage progression.`;
    recommendation = 'High slip risk. Escalate to Regional Director for executive sponsor check-in.';
  } else if (diffDays > 14) {
    healthScore -= 18;
    riskReason = `Over 14 days without active stage change.`;
    recommendation = 'Schedule commercial review meeting to unblock evaluation bottlenecks.';
  }

  // Adjust for probability and close date
  const closeDate = new Date(deal.expectedCloseDate);
  const daysToClose = Math.floor((closeDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (daysToClose < 0) {
    healthScore -= 20;
    riskReason = riskReason ? `${riskReason} Past expected close date.` : 'Passed projected closing date.';
    recommendation = 'Close date overdue. Update timeline with client decision makers.';
  } else if (deal.priority === 'Urgent' && deal.probability < 50) {
    healthScore -= 12;
    riskReason = riskReason || 'Urgent deal with low win probability.';
    recommendation = 'Align technical architects to demonstrate ROI and increase confidence.';
  }

  // Clamp health score between 5 and 98
  healthScore = Math.max(5, Math.min(98, healthScore));

  let status: 'healthy' | 'attention' | 'risk' = 'healthy';
  if (healthScore < 55) {
    status = 'risk';
  } else if (healthScore < 75) {
    status = 'attention';
  }

  return {
    healthScore,
    status,
    daysInStage: diffDays,
    riskReason,
    recommendation,
  };
};
