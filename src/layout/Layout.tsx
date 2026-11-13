import React from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { ToastContainer } from '@/components/Toast';
import { setMobileMenuOpen, setActiveTab, ActiveNavTab } from '@/store/uiSlice';
import {
  X,
  LayoutDashboard,
  UserPlus,
  GitBranch,
  Users,
  CheckSquare,
  Activity,
  BarChart3,
  Menu,
} from 'lucide-react';
import { VedaFlowLogo } from '@/components/brand/VedaFlowLogo';
import { Avatar } from '@/components/Avatar';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { sidebarCollapsed, mobileMenuOpen, activeTab } = useAppSelector((state) => state.ui);
  const currentUser = useAppSelector((state) => state.auth.user);

  const mobileNavItems: { id: ActiveNavTab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'leads', label: 'Lead Management', icon: <UserPlus className="w-4 h-4" /> },
    { id: 'pipeline', label: 'Sales Pipeline', icon: <GitBranch className="w-4 h-4" /> },
    { id: 'customers', label: 'Customer Profiles', icon: <Users className="w-4 h-4" /> },
    { id: 'tasks', label: 'Task Management', icon: <CheckSquare className="w-4 h-4" /> },
    { id: 'activities', label: 'Activity Tracking', icon: <Activity className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analytics & Reports', icon: <BarChart3 className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Toast Notifications */}
      <ToastContainer />

      {/* Desktop & Tablet Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => dispatch(setMobileMenuOpen(false))}
          />
          <div className="fixed inset-y-0 left-0 w-72 bg-white dark:bg-[#1a120e] shadow-2xl z-50 flex flex-col border-r border-slate-200 dark:border-[#38261f] animate-in slide-in-from-left duration-200">
            <div className="h-16 px-4 border-b border-slate-100 dark:border-[#2e1f18] flex items-center justify-between">
              <VedaFlowLogo size="sm" subtitle="Sales Intelligence" />
              <button
                onClick={() => dispatch(setMobileMenuOpen(false))}
                className="p-1.5 rounded-lg text-slate-400 hover:text-[#ca5e3a] hover:bg-slate-100 dark:hover:bg-[#251713] transition-colors"
                title="Close navigation"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 p-3 space-y-1 overflow-y-auto">
              {mobileNavItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    dispatch(setActiveTab(item.id));
                    dispatch(setMobileMenuOpen(false));
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    activeTab === item.id
                      ? 'bg-[#2a1711] text-[#ca5e3a] font-bold shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#251713]'
                  }`}
                >
                  <span className={activeTab === item.id ? 'text-[#ca5e3a]' : 'text-slate-400'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            {/* Mobile Drawer Footer: Logged-in Rep */}
            <div className="p-3 border-t border-slate-100 dark:border-[#2e1f18] bg-slate-50 dark:bg-[#150d0a] flex items-center gap-3">
              <Avatar
                name={currentUser.name}
                src={currentUser.avatar}
                size="sm"
                status={currentUser.status}
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                  {currentUser.name}
                </p>
                <p className="text-[10px] text-slate-400 truncate">{currentUser.role}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
          sidebarCollapsed ? 'md:pl-20' : 'md:pl-64'
        }`}
      >
        <Navbar />

        <main className="flex-1 pt-20 pb-24 md:pb-12 px-3 sm:px-6 lg:px-8 max-w-7xl w-full mx-auto">
          {children}
        </main>

        {/* Mobile Sticky Bottom Navigation Bar */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 dark:bg-[#1a120e]/95 backdrop-blur-md border-t border-slate-200 dark:border-[#38261f] px-2 py-1 flex items-center justify-around shadow-lg">
          <button
            onClick={() => dispatch(setActiveTab('dashboard'))}
            className={`flex flex-col items-center py-1 px-2.5 rounded-lg transition-colors ${
              activeTab === 'dashboard'
                ? 'text-[#ca5e3a] font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 mb-0.5" />
            <span className="text-[10px]">Dashboard</span>
          </button>

          <button
            onClick={() => dispatch(setActiveTab('leads'))}
            className={`flex flex-col items-center py-1 px-2.5 rounded-lg transition-colors ${
              activeTab === 'leads'
                ? 'text-[#ca5e3a] font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <UserPlus className="w-4 h-4 mb-0.5" />
            <span className="text-[10px]">Leads</span>
          </button>

          <button
            onClick={() => dispatch(setActiveTab('pipeline'))}
            className={`flex flex-col items-center py-1 px-2.5 rounded-lg transition-colors ${
              activeTab === 'pipeline'
                ? 'text-[#ca5e3a] font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <GitBranch className="w-4 h-4 mb-0.5" />
            <span className="text-[10px]">Pipeline</span>
          </button>

          <button
            onClick={() => dispatch(setActiveTab('tasks'))}
            className={`flex flex-col items-center py-1 px-2.5 rounded-lg transition-colors ${
              activeTab === 'tasks'
                ? 'text-[#ca5e3a] font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <CheckSquare className="w-4 h-4 mb-0.5" />
            <span className="text-[10px]">Tasks</span>
          </button>

          <button
            onClick={() => dispatch(setMobileMenuOpen(true))}
            className="flex flex-col items-center py-1 px-2.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
          >
            <Menu className="w-4 h-4 mb-0.5" />
            <span className="text-[10px]">More</span>
          </button>
        </div>
      </div>
    </div>
  );
};

