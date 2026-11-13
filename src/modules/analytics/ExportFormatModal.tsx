import React from 'react';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/Button';
import {
  FileSpreadsheet,
  FileText,
  Download,
  Printer,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

interface ExportFormatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExportExcel: () => void;
  onExportPDF: () => void;
}

export const ExportFormatModal: React.FC<ExportFormatModalProps> = ({
  isOpen,
  onClose,
  onExportExcel,
  onExportPDF,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Export Executive Analytics Report"
      description="Select your preferred report format for offline review, executive presentation, or spreadsheet analysis."
      maxWidth="2xl"
    >
      <div className="space-y-4 pt-1">
        {/* Format Selection Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Option 1: Excel Format */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-[#38261f] bg-white dark:bg-[#1f1512] hover:border-[#ca5e3a] dark:hover:border-[#ca5e3a] transition-all card-hover-lift flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40">
                  <FileSpreadsheet className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50">
                  Excel (.csv)
                </span>
              </div>

              <h4 className="text-sm font-bold text-slate-900 dark:text-[#fbf5f2] group-hover:text-[#ca5e3a] transition-colors">
                Excel Spreadsheet
              </h4>
              <p className="text-xs text-slate-500 dark:text-[#9f8c83] mt-1 leading-relaxed">
                Structured workbook with separate sections for KPIs, Sales Rep Quotas, Pipeline Deals, and Inbound Leads.
              </p>

              <ul className="mt-3 space-y-1.5 text-[11px] text-slate-600 dark:text-[#d3c2b9]">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Compatible with Microsoft Excel & Sheets</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Indian Rupee (₹) symbol & formatting</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Complete raw data for analysis</span>
                </li>
              </ul>
            </div>

            <Button
              onClick={() => {
                onExportExcel();
                onClose();
              }}
              className="w-full mt-4"
              size="sm"
              leftIcon={<Download className="w-4 h-4" />}
            >
              Download Excel
            </Button>
          </div>

          {/* Option 2: PDF Document Format */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-[#38261f] bg-white dark:bg-[#1f1512] hover:border-[#ca5e3a] dark:hover:border-[#ca5e3a] transition-all card-hover-lift flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800/40">
                  <FileText className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/50">
                  PDF Doc (.pdf)
                </span>
              </div>

              <h4 className="text-sm font-bold text-slate-900 dark:text-[#fbf5f2] group-hover:text-[#ca5e3a] transition-colors">
                Executive PDF Report
              </h4>
              <p className="text-xs text-slate-500 dark:text-[#9f8c83] mt-1 leading-relaxed">
                Formatted executive summary with VedaFlow branding, metric scorecards, quota bars, and clean print layout.
              </p>

              <ul className="mt-3 space-y-1.5 text-[11px] text-slate-600 dark:text-[#d3c2b9]">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  <span>Executive presentation & review layout</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  <span>Print & "Save as PDF" ready</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  <span>DPDP Act 2023 compliance audit tag</span>
                </li>
              </ul>
            </div>

            <Button
              onClick={() => {
                onExportPDF();
                onClose();
              }}
              variant="outline"
              className="w-full mt-4 dark:bg-[#251713] dark:hover:bg-[#321e18] dark:border-[#ca5e3a]/50 text-slate-800 dark:text-[#fbf5f2] hover:text-[#ca5e3a]"
              size="sm"
              leftIcon={<Printer className="w-4 h-4" />}
            >
              Print / Save as PDF
            </Button>
          </div>
        </div>

        {/* Footer Note */}
        <div className="pt-3 border-t border-slate-100 dark:border-[#2e1f18] flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>256-bit TLS Encrypted & SOC2 Audit Verified</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};

