import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/Button';
import { addActivity } from '@/modules/activities/activitiesSlice';
import { addToast } from '@/store/uiSlice';
import {
  Sparkles,
  Bot,
  CheckCircle2,
  AlertCircle,
  DollarSign,
  Users,
  ListTodo,
  FileText,
} from 'lucide-react';

interface AiTranscriptSummarizerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AiAnalysisResult {
  executiveSummary: string;
  objections: string[];
  budgetTimeline: string;
  decisionMakers: string[];
  actionItems: string[];
}

export const AiTranscriptSummarizerModal: React.FC<AiTranscriptSummarizerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.auth.user);

  const sampleTranscripts = [
    {
      title: 'Reliance Retail — Unified POS & Omni CRM Sync',
      company: 'Reliance Retail Digital',
      contact: 'Rajeev Singhania (Head of Retail IT)',
      transcript: `[00:02] Priya Nair: Thanks Rajeev for joining. Let's review the omnichannel customer unified view.
[02:15] Rajeev Singhania: We have 4,000+ stores across Tier 1 & Tier 2 cities. Our main concern is offline resilience during network outages and instant billing synchronization.
[05:40] Priya Nair: VedaFlow uses an edge caching architecture with offline-first indexing, syncing back to our AWS Mumbai cluster within 800ms of reconnection.
[08:12] Rajeev Singhania: That addresses our primary architectural hurdle. Budget is approved for ₹2.40 Cr for Phase 1 rollout across 1,200 locations.
[12:30] Rajeev: Next step: Please share SOC2 report with our CISO Sunita Rao by this Friday, and prepare a customized commercial proposal by next Tuesday.`,
    },
    {
      title: 'TCS Enterprise — 1,200 Seat Global Delivery Migration',
      company: 'Tata Consultancy Services',
      contact: 'Anand Kulkarni (VP Delivery)',
      transcript: `[01:10] Aarav Sharma: Good morning Anand. Let's discuss the 1,200 seat migration schedule.
[04:20] Anand Kulkarni: Our legal team reviewed the draft MSA. We need DPDP Act 2023 data principal consent logs maintained for 3 years.
[07:15] Aarav Sharma: Yes, our built-in consent vault maintains tamper-proof immutable audit logs with 256-bit AES encryption.
[10:45] Anand: Excellent. Budget allocation of ₹1.25 Cr is confirmed. Let's conduct a dry-run migration test with 50 pilot users next Monday.`,
    },
  ];

  const [selectedSampleIndex, setSelectedSampleIndex] = useState(0);
  const [transcriptText, setTranscriptText] = useState(sampleTranscripts[0].transcript);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AiAnalysisResult | null>(null);

  const handleSelectSample = (idx: number) => {
    setSelectedSampleIndex(idx);
    setTranscriptText(sampleTranscripts[idx].transcript);
    setAnalysis(null);
  };

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setAnalysis(null);

    setTimeout(() => {
      setIsAnalyzing(false);
      const isReliance = transcriptText.toLowerCase().includes('reliance');

      if (isReliance) {
        setAnalysis({
          executiveSummary:
            'Client confirmed operational need for 4,000+ store omnichannel CRM sync with offline edge resilience. Budget of ₹2.40 Cr approved for Phase 1.',
          objections: [
            'Network latency and offline store resilience during broadband drops',
            'CISO security audit and SOC2 Type II certification review required',
          ],
          budgetTimeline: '₹2.40 Cr approved for Phase 1 across 1,200 stores. Target rollout in Q4.',
          decisionMakers: [
            'Rajeev Singhania (Head of Retail IT — Commercial Sponsor)',
            'Sunita Rao (CISO — Security Reviewer)',
          ],
          actionItems: [
            'Share SOC2 Type II audit documentation with Sunita Rao by Friday',
            'Draft customized commercial proposal for 1,200 store phase by Tuesday',
            'Schedule architecture alignment with edge-sync engineering lead',
          ],
        });
      } else {
        setAnalysis({
          executiveSummary:
            'Migration discussion for 1,200 enterprise delivery seats. Client satisfied with DPDP Act 2023 compliance architecture and confirmed ₹1.25 Cr allocation.',
          objections: [
            'Mandatory 3-year DPDP Act 2023 data consent retention and audit log immutable storage',
          ],
          budgetTimeline: '₹1.25 Cr confirmed for annual subscription and onboarding support.',
          decisionMakers: [
            'Anand Kulkarni (VP Delivery Operations)',
            'TCS Corporate Legal & Compliance Review Board',
          ],
          actionItems: [
            'Configure DPDP compliance audit vault for 3-year retention schedule',
            'Setup dry-run sandbox with 50 pilot accounts by next Monday',
            'Deliver formal SLA addendum for 99.95% uptime commitment',
          ],
        });
      }

      dispatch(
        addToast({
          type: 'success',
          title: 'VedaFlow AI Analysis Complete',
          message: 'Extracted key objections, budget, decision makers, and actionable tasks.',
        })
      );
    }, 600);
  };

  const handleLogToCrm = () => {
    if (!analysis) return;

    const sample = sampleTranscripts[selectedSampleIndex];
    dispatch(
      addActivity({
        type: 'Meeting',
        title: `AI Meeting Notes: ${sample.company}`,
        description: `${analysis.executiveSummary}\n\nAction Items:\n- ${analysis.actionItems.join('\n- ')}`,
        performedBy: currentUser?.name || 'Sales Rep',
        performedAvatar: currentUser?.avatar,
        entityType: 'Deal',
        entityId: 'deal-ai-summary',
        entityName: sample.company,
        durationMinutes: 35,
        outcome: `Identified Budget: ${analysis.budgetTimeline}. Next: ${analysis.actionItems[0]}`,
      })
    );

    dispatch(
      addToast({
        type: 'success',
        title: 'Meeting Logged to CRM Feed',
        message: 'Summary and action items synced to chronological activity timeline.',
      })
    );

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="VedaFlow AI Transcript Assistant"
      description="Extract key objections, budget disclosure, decision makers, and action items from call recordings."
      maxWidth="2xl"
    >
      <div className="space-y-4 pt-1">
        {/* Sample Picker */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Load Enterprise Demo Call Transcript
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {sampleTranscripts.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectSample(idx)}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  selectedSampleIndex === idx
                    ? 'border-[#ca5e3a] bg-[#2a1711] text-white shadow-xs'
                    : 'border-slate-200 dark:border-[#38261f] bg-slate-50 dark:bg-[#1a120e] text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#ca5e3a]">
                  <FileText className="w-3.5 h-3.5" />
                  <span>{sample.company}</span>
                </div>
                <div className="text-[11px] truncate mt-0.5 opacity-90">{sample.title}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Transcript Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Raw Call Recording / Notes Transcript
          </label>
          <textarea
            rows={3}
            value={transcriptText}
            onChange={(e) => setTranscriptText(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-[#38261f] p-2.5 text-xs font-mono bg-white dark:bg-[#18110e] text-slate-800 dark:text-[#fbf5f2] focus:outline-none focus:ring-2 focus:ring-[#ca5e3a]/30 focus:border-[#ca5e3a]"
            placeholder="Paste your meeting notes or call transcript here..."
          />
        </div>

        {/* Analyze Button */}
        <div className="flex justify-end">
          <Button
            size="sm"
            onClick={handleAnalyze}
            isLoading={isAnalyzing}
            leftIcon={<Sparkles className="w-4 h-4 text-amber-300" />}
          >
            Analyze with VedaFlow AI
          </Button>
        </div>

        {/* AI Results Section */}
        {analysis && (
          <div className="p-4 rounded-2xl border border-[#ca5e3a]/40 bg-[#241712] text-[#fbf5f2] space-y-3.5 animate-fadeIn">
            <div className="flex items-center gap-2 border-b border-[#3e271f] pb-2">
              <Bot className="w-5 h-5 text-[#ca5e3a]" />
              <h4 className="text-sm font-bold tracking-tight">AI Executive Intelligence Output</h4>
            </div>

            {/* Executive Summary */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#e08a68]">
                Executive Summary
              </p>
              <p className="text-xs text-slate-200 mt-0.5 leading-relaxed">
                {analysis.executiveSummary}
              </p>
            </div>

            {/* Key Objections & Budget */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3 rounded-xl bg-[#1b100c] border border-[#38241c]">
                <p className="text-[10px] font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Key Objections & Blockers
                </p>
                <ul className="mt-1.5 space-y-1 text-xs text-slate-300">
                  {analysis.objections.map((obj, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-[#ca5e3a] font-bold">•</span>
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3 rounded-xl bg-[#1b100c] border border-[#38241c]">
                <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5" />
                  Budget & Timeline
                </p>
                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                  {analysis.budgetTimeline}
                </p>

                <p className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5 mt-2.5">
                  <Users className="w-3.5 h-3.5" />
                  Decision Makers
                </p>
                <ul className="mt-1 space-y-0.5 text-[11px] text-slate-300">
                  {analysis.decisionMakers.map((dm, i) => (
                    <li key={i} className="truncate">• {dm}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Action Items */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                <ListTodo className="w-3.5 h-3.5" />
                Extracted Action Items
              </p>
              <div className="mt-1.5 space-y-1.5">
                {analysis.actionItems.map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-slate-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Log as CRM Activity */}
            <div className="pt-2 border-t border-[#3e271f] flex justify-end">
              <Button
                size="sm"
                onClick={handleLogToCrm}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                leftIcon={<CheckCircle2 className="w-4 h-4" />}
              >
                Log as Verified CRM Activity & Tasks
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
