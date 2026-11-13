import React, { useState } from 'react';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/Button';
import { Deal } from '@/types/crm';
import { calculateGstQuotation, printGstQuotation } from '@/utils/gstQuotation';
import { formatCurrency } from '@/utils/formatters';
import { Printer, Download, Receipt, Building, CheckCircle2 } from 'lucide-react';

interface GstQuotationModalProps {
  isOpen: boolean;
  onClose: () => void;
  deal: Deal | null;
}

export const GstQuotationModal: React.FC<GstQuotationModalProps> = ({
  isOpen,
  onClose,
  deal,
}) => {
  const [isInterstate, setIsInterstate] = useState(false);

  if (!deal) return null;

  const quotation = calculateGstQuotation(deal, isInterstate);

  const handlePrint = () => {
    printGstQuotation(deal, isInterstate);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="GST Commercial Quotation"
      description={`Official GST estimate calculation for ${deal.title} (${deal.company})`}
      maxWidth="xl"
    >
      <div className="space-y-4 pt-1">
        {/* State Supply Toggle */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#1a120e] border border-slate-200 dark:border-[#38261f] flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-800 dark:text-[#fbf5f2]">
              GST Supply Jurisdiction
            </p>
            <p className="text-[11px] text-slate-500 dark:text-[#9f8c83]">
              {isInterstate ? 'Inter-state transaction (IGST 18%)' : 'Intra-state transaction in Karnataka (CGST 9% + SGST 9%)'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsInterstate(false)}
              className={`px-3 py-1 text-xs rounded-lg font-semibold transition-all ${
                !isInterstate
                  ? 'bg-[#ca5e3a] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#281c16]'
              }`}
            >
              Intra-state (9+9%)
            </button>
            <button
              type="button"
              onClick={() => setIsInterstate(true)}
              className={`px-3 py-1 text-xs rounded-lg font-semibold transition-all ${
                isInterstate
                  ? 'bg-[#ca5e3a] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#281c16]'
              }`}
            >
              Inter-state (IGST 18%)
            </button>
          </div>
        </div>

        {/* Quotation Details Card */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-[#36251e] bg-white dark:bg-[#1f1512] space-y-3">
          <div className="flex items-start justify-between border-b border-slate-100 dark:border-[#2e1f18] pb-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#ca5e3a]">
                Quotation #{quotation.quotationNumber}
              </span>
              <h4 className="text-sm font-bold text-slate-900 dark:text-[#fbf5f2] mt-0.5">
                {deal.title}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                <Building className="w-3.5 h-3.5" />
                <span>{deal.company} (Client GSTIN: {quotation.clientGstin})</span>
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-semibold text-slate-400 block">Valid Until</span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {quotation.validUntil}
              </span>
            </div>
          </div>

          {/* Pricing Table */}
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between py-1 text-slate-600 dark:text-slate-300">
              <span>Base Contract Value (12 Months, SAC {quotation.sacCode})</span>
              <span className="font-bold">{formatCurrency(quotation.baseAmount)}</span>
            </div>

            {isInterstate ? (
              <div className="flex justify-between py-1 text-slate-600 dark:text-slate-300">
                <span>Integrated GST (IGST @ 18%)</span>
                <span>{formatCurrency(quotation.igstAmount)}</span>
              </div>
            ) : (
              <>
                <div className="flex justify-between py-1 text-slate-600 dark:text-slate-300">
                  <span>Central GST (CGST @ 9%)</span>
                  <span>{formatCurrency(quotation.cgstAmount)}</span>
                </div>
                <div className="flex justify-between py-1 text-slate-600 dark:text-slate-300">
                  <span>State GST (SGST @ 9%)</span>
                  <span>{formatCurrency(quotation.sgstAmount)}</span>
                </div>
              </>
            )}

            <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-[#38261f] text-sm font-extrabold text-[#ca5e3a]">
              <span>Grand Total Payable (Incl. Taxes)</span>
              <span>{formatCurrency(quotation.grandTotal)}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <p className="text-[11px] text-slate-400">
            Official GST estimate. Compliant with CBIC e-invoicing standards.
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>
            <Button
              size="sm"
              onClick={handlePrint}
              leftIcon={<Printer className="w-4 h-4" />}
            >
              Print / Save PDF Quotation
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

