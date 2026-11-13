import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { addToast } from '@/store/uiSlice';
import { mockTeamMembers } from '@/data/mockData';
import { formatCurrency, formatCompactCurrency } from '@/utils/formatters';
import {
  downloadExcelAnalyticsReport,
  downloadPDFAnalyticsReport,
} from '@/utils/exportReport';
import { ExportFormatModal } from './ExportFormatModal';
import { CommissionCalculatorWidget } from './CommissionCalculatorWidget';
import { PersonalAnalyticsView } from './PersonalAnalyticsView';
import { Avatar } from '@/components/Avatar';
import { Button } from '@/components/Button';
import {
  Download,
  Award,
  TrendingUp,
  Percent,
  Clock,
  Zap,
  Target,
  FileSpreadsheet,
  User,
  Users,
} from 'lucide-react';

export const AnalyticsOverview: React.FC = () => {
  const dispatch = useAppDispatch();
  const deals = useAppSelector((state) => state.deals.items);
  const leads = useAppSelector((state) => state.leads.items);
  const workspaceScope = useAppSelector((state) => state.ui.workspaceScope);
  const [activeView, setActiveView] = useState<'personal' | 'team'>(
    workspaceScope === 'personal' ? 'personal' : 'team'
  );

  useEffect(() => {
    setActiveView(workspaceScope === 'personal' ? 'personal' : 'team');
  }, [workspaceScope]);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const handleExportExcel = () => {
    try {
      downloadExcelAnalyticsReport({
        deals,
        leads,
        teamMembers: mockTeamMembers,
      });

      dispatch(
        addToast({
          type: 'success',
          title: 'Excel Report Downloaded',
          message: 'VedaFlow Executive Sales Analytics Report CSV has been downloaded for Excel.',
        })
      );
    } catch (err) {
      dispatch(
        addToast({
          type: 'error',
          title: 'Export Failed',
          message: 'Could not generate the Excel file. Please try again.',
        })
      );
    }
  };

  const handleExportPDF = () => {
    try {
      downloadPDFAnalyticsReport({
        deals,
        leads,
        teamMembers: mockTeamMembers,
      });

      dispatch(
        addToast({
          type: 'info',
          title: 'PDF Print Dialog Ready',
          message: 'Print preview opened. Select "Save as PDF" to save your executive report.',
        })
      );
    } catch (err) {
      dispatch(
        addToast({
          type: 'error',
          title: 'PDF Generation Failed',
          message: 'Could not generate the PDF document. Please try again.',
        })
      );
    }
  };

  const performanceMetrics = [
    {
      title: 'Average Sales Cycle',
      value: '38 Days',
      trend: '-4 days vs last quarter',
      icon: <Clock className="w-5 h-5" />,
      color: 'text-indigo-600 bg-indigo-50',
    },
    {
      title: 'Average Deal Size (ACV)',
      value: '₹1.85 Cr',
      trend: '+14% vs annual plan',
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      title: 'Lead-to-Opportunity Ratio',
      value: '34.2%',
      trend: '+6.1% conversion efficiency',
      icon: <Zap className="w-5 h-5" />,
      color: 'text-purple-600 bg-purple-50',
    },
    {
      title: 'Overall Win Attainment',
      value: '76.8%',
      trend: 'Top quartile industry benchmark',
      icon: <Target className="w-5 h-5" />,
      color: 'text-amber-600 bg-amber-50',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Scope Switcher: Personal Performance vs Team Leaderboard */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setActiveView('personal')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
            activeView === 'personal'
              ? 'bg-indigo-600 [data-theme="sunset-copper"]_&:bg-[#ca5e3a] text-white shadow-2xs font-bold'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>My Sales Performance (User Panel)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveView('team')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
            activeView === 'team'
              ? 'bg-indigo-600 [data-theme="sunset-copper"]_&:bg-[#ca5e3a] text-white shadow-2xs font-bold'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Team Leaderboard & Quota Reports</span>
        </button>
      </div>

      {activeView === 'personal' ? (
        <PersonalAnalyticsView />
      ) : (
        <>
          {/* Top Banner & Export */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-850 to-slate-900 dark:from-[#2a1711] dark:via-[#1e120e] dark:to-[#140e0c] [data-theme='sunset-copper']_&:from-[#2a1711] [data-theme='sunset-copper']_&:via-[#1e120e] [data-theme='sunset-copper']_&:to-[#140e0c] border border-white/10 dark:border-[#3d271e] [data-theme='sunset-copper']_&:border-[#3d271e] text-white shadow-md">
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-[#e08a68]">
                Executive Intelligence
              </span>
              <h2 className="text-xl font-bold tracking-tight mt-0.5 text-white">
                Enterprise Sales Velocity & Rep Performance
              </h2>
              <p className="text-xs text-[#edd5cb] mt-1">
                Real-time revenue attribution, rep quota attainment, and funnel conversion tracking
              </p>
            </div>

            <Button
              onClick={() => setIsExportModalOpen(true)}
              variant="outline"
              size="sm"
              className="bg-white/10 hover:bg-white/20 dark:bg-[#341d15] dark:hover:bg-[#43251b] [data-theme='sunset-copper']_&:bg-[#341d15] [data-theme='sunset-copper']_&:hover:bg-[#43251b] text-white border-white/20 dark:border-[#ca5e3a]/40 [data-theme='sunset-copper']_&:border-[#ca5e3a]/40 shadow-none font-semibold transition-all hover:scale-105"
              leftIcon={<Download className="w-4 h-4" />}
            >
              Export Analytics Report
            </Button>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {performanceMetrics.map((metric, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-slate-200/80 p-3.5 sm:p-5 shadow-2xs space-y-2 sm:space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider truncate">
                    {metric.title}
                  </span>
                  <div className={`p-1.5 sm:p-2 rounded-xl ${metric.color} shrink-0`}>{metric.icon}</div>
                </div>
                <div>
                  <p className="text-lg sm:text-2xl font-bold text-slate-900">{metric.value}</p>
                  <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 sm:mt-1 truncate">{metric.trend}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Rep Leaderboard */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4 sm:mb-5">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <Award className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
                  <span>Sales Representative Quota Leaderboard</span>
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
                  Current quarter quota progression and closed deals performance
                </p>
              </div>
            </div>

            {/* Mobile Leaderboard Cards (< 640px) */}
            <div className="sm:hidden divide-y divide-slate-100">
              {mockTeamMembers.map((member) => {
                const percent = Math.min(
                  100,
                  Math.round((member.closedWonAmount / member.quota) * 100)
                );
                return (
                  <div key={member.id} className="py-3.5 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <Avatar name={member.name} src={member.avatar} size="sm" />
                        <div>
                          <p className="font-bold text-xs text-slate-900">{member.name}</p>
                          <p className="text-[11px] text-slate-400">{member.role}</p>
                        </div>
                      </div>
                      <span className="text-xs font-extrabold text-[#ca5e3a] bg-[#2a1711] px-2 py-0.5 rounded-full border border-[#ca5e3a]/30">
                        {percent}% Quota
                      </span>
                    </div>

                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          percent >= 90
                            ? 'bg-emerald-500'
                            : percent >= 75
                            ? 'bg-[#ca5e3a]'
                            : 'bg-amber-500'
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-0.5">
                      <span className="text-slate-600 font-semibold">
                        Won: {formatCurrency(member.closedWonAmount)}{' '}
                        <span className="text-slate-400 font-normal">/ {formatCurrency(member.quota)}</span>
                      </span>
                      <span className="text-slate-500">
                        Deals: <strong className="text-slate-900">{member.activeDealsCount}</strong>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop & Tablet Table View (>= 640px) */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Sales Rep</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Closed Revenue</th>
                    <th className="py-3 px-4">Quota</th>
                    <th className="py-3 px-4 w-48">Attainment</th>
                    <th className="py-3 px-4 text-center">Active Deals</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {mockTeamMembers.map((member) => {
                    const percent = Math.min(
                      100,
                      Math.round((member.closedWonAmount / member.quota) * 100)
                    );
                    return (
                      <tr key={member.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <Avatar name={member.name} src={member.avatar} size="sm" />
                            <div>
                              <p className="font-semibold text-slate-900">{member.name}</p>
                              <p className="text-xs text-slate-400">{member.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-xs font-medium text-slate-600">
                          {member.role}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-slate-900">
                          {formatCurrency(member.closedWonAmount)}
                        </td>
                        <td className="py-3.5 px-4 text-xs text-slate-500">
                          {formatCurrency(member.quota)}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs font-bold text-slate-700">
                              <span>{percent}%</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  percent >= 90
                                    ? 'bg-emerald-500'
                                    : percent >= 75
                                    ? 'bg-[#ca5e3a]'
                                    : 'bg-amber-500'
                                }`}
                                style={{ width: `${percent}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-center font-bold text-[#ca5e3a]">
                          {member.activeDealsCount}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sales Commission & OTE Incentive Simulator */}
          <CommissionCalculatorWidget />
        </>
      )}

      {/* Export Format Dialog */}
      <ExportFormatModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExportExcel={handleExportExcel}
        onExportPDF={handleExportPDF}
      />
    </div>
  );
};
export default AnalyticsOverview;

