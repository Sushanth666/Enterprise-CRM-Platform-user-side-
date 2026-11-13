import React, { useState } from 'react';
import { formatCurrency, formatCompactCurrency } from '@/utils/formatters';
import { Award, TrendingUp, Calculator, Sparkles, DollarSign } from 'lucide-react';

interface CommissionCalculatorWidgetProps {
  currentClosedAmount?: number;
  currentQuota?: number;
  repName?: string;
}

export const CommissionCalculatorWidget: React.FC<CommissionCalculatorWidgetProps> = ({
  currentClosedAmount = 62000000,
  currentQuota = 75000000,
  repName = 'Priya Nair',
}) => {
  const [pipelineSimulatedAmount, setPipelineSimulatedAmount] = useState(15000000); // 1.5 Cr deal

  const totalSimulated = currentClosedAmount + pipelineSimulatedAmount;
  const currentAttainment = Math.round((currentClosedAmount / currentQuota) * 100);
  const projectedAttainment = Math.round((totalSimulated / currentQuota) * 100);

  // Commission calculation
  const calculateCommission = (amount: number, quota: number) => {
    const percent = (amount / quota) * 100;
    if (percent < 70) return 0;
    if (percent <= 90) return Math.round(amount * 0.015);
    if (percent <= 100) return Math.round(amount * 0.03);
    // Above 100% accelerator: 3% up to 100% + 5% on overage + 2.5L bonus
    const baseComm = Math.round(quota * 0.03);
    const overage = amount - quota;
    return baseComm + Math.round(overage * 0.05) + 250000;
  };

  const currentCommission = calculateCommission(currentClosedAmount, currentQuota);
  const projectedCommission = calculateCommission(totalSimulated, currentQuota);
  const commissionGain = projectedCommission - currentCommission;

  return (
    <div className="bg-white dark:bg-[#1c1410] rounded-2xl border border-slate-200/90 dark:border-[#33221b] p-5 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#2a1b15] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[#2a1711] text-[#ca5e3a] border border-[#ca5e3a]/30">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-[#fbf5f2]">
              Sales Commission & Incentive Simulator
            </h4>
            <p className="text-xs text-slate-500 dark:text-[#9f8c83]">
              Simulate quarterly bonus payouts for {repName}
            </p>
          </div>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40">
          Q4 Incentive Tier
        </span>
      </div>

      {/* Metric Cards Comparison */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#18110e] border border-slate-200/80 dark:border-[#2f2019]">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Current Quota Attainment
          </p>
          <p className="text-xl font-extrabold text-slate-900 dark:text-[#fbf5f2] mt-1">
            {currentAttainment}%
          </p>
          <p className="text-[11px] text-slate-500 dark:text-[#9f8c83] mt-0.5">
            {formatCompactCurrency(currentClosedAmount)} of {formatCompactCurrency(currentQuota)}
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#18110e] border border-slate-200/80 dark:border-[#2f2019]">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Current Earned Commission
          </p>
          <p className="text-xl font-extrabold text-[#ca5e3a] mt-1">
            {formatCurrency(currentCommission)}
          </p>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
            Tier: Tier 2 (3.0% Standard)
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-[#2a1711] border border-[#ca5e3a]/40 shadow-xs">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#e08a68]">
            Projected with Simulated Deal
          </p>
          <p className="text-xl font-extrabold text-white mt-1">
            {formatCurrency(projectedCommission)}
          </p>
          <p className="text-[11px] text-amber-300 font-bold mt-0.5 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>+{formatCurrency(commissionGain)} added bonus!</span>
          </p>
        </div>
      </div>

      {/* Simulator Slider */}
      <div className="pt-2">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            Simulate Closing Pending Opportunity:
          </span>
          <span className="font-extrabold text-[#ca5e3a] text-sm">
            +{formatCurrency(pipelineSimulatedAmount)}
          </span>
        </div>
        <input
          type="range"
          min="1000000"
          max="35000000"
          step="1000000"
          value={pipelineSimulatedAmount}
          onChange={(e) => setPipelineSimulatedAmount(Number(e.target.value))}
          className="w-full h-2 bg-slate-200 dark:bg-[#281a14] rounded-lg appearance-none cursor-pointer accent-[#ca5e3a]"
        />
        <div className="flex justify-between text-[10px] text-slate-400 mt-1">
          <span>₹10 Lakhs (Add-on)</span>
          <span>₹1.5 Crores (Avg Enterprise)</span>
          <span>₹3.5 Crores (Mega Deal)</span>
        </div>
      </div>
    </div>
  );
};

