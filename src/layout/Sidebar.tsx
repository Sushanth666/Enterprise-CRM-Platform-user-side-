import React, { useState, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { setActiveTab, toggleSidebar, openModal, setWorkspaceScope, ActiveNavTab } from '@/store/uiSlice';
import {
  LayoutDashboard,
  UserPlus,
  GitBranch,
  Users,
  CheckSquare,
  Activity,
  BarChart3,
  Bell,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  TrendingUp,
  Mail,
  Building2,
  MapPin,
  Camera,
  User,
} from 'lucide-react';
import { Avatar, getPortraitPhoto } from '@/components/Avatar';
import { VedaFlowLogo } from '@/components/brand/VedaFlowLogo';

interface NavItem {
  id: ActiveNavTab;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

export const Sidebar: React.FC = () => {
  const dispatch = useAppDispatch();
  const { activeTab, sidebarCollapsed, workspaceScope } = useAppSelector((state) => state.ui);
  const currentUser = useAppSelector((state) => state.auth.user);
  const leads = useAppSelector((state) => state.leads.items);
  const tasks = useAppSelector((state) => state.tasks.items);
  const deals = useAppSelector((state) => state.deals.items);
  const notifications = useAppSelector((state) => state.notifications.items);

  const [profileHovered, setProfileHovered] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleProfileMouseEnter = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setProfileHovered(true);
  };

  const handleProfileMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setProfileHovered(false);
    }, 180);
  };

  const pendingTasksCount = tasks.filter((t) => t.status !== 'Completed').length;
  const activeDealsCount = deals.filter((d) => d.stage !== 'Closed Won' && d.stage !== 'Closed Lost').length;
  const unreadNotifCount = notifications.filter((n) => !n.read).length;

  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      label: workspaceScope === 'personal' ? 'My Cockpit' : 'Dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      id: 'leads',
      label: 'Lead Management',
      icon: <UserPlus className="w-5 h-5" />,
      badge: leads.length,
    },
    {
      id: 'pipeline',
      label: 'Sales Pipeline',
      icon: <GitBranch className="w-5 h-5" />,
      badge: activeDealsCount,
    },
    {
      id: 'customers',
      label: 'Customer Profiles',
      icon: <Users className="w-5 h-5" />,
    },
    {
      id: 'tasks',
      label: 'Task Management',
      icon: <CheckSquare className="w-5 h-5" />,
      badge: pendingTasksCount,
    },
    {
      id: 'activities',
      label: 'Activity Tracking',
      icon: <Activity className="w-5 h-5" />,
    },
    {
      id: 'analytics',
      label: 'Analytics & Reports',
      icon: <BarChart3 className="w-5 h-5" />,
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: <Bell className="w-5 h-5" />,
      badge: unreadNotifCount > 0 ? unreadNotifCount : undefined,
    },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 z-30 h-screen transition-all duration-300 ease-in-out border-r border-slate-200 bg-white flex flex-col ${
        sidebarCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div
        className={`h-16 flex items-center border-b border-slate-100 transition-all ${
          sidebarCollapsed ? 'justify-center px-2' : 'justify-between px-4'
        }`}
      >
        {sidebarCollapsed ? (
          <button
            onClick={() => dispatch(toggleSidebar())}
            className="relative group p-1.5 rounded-xl hover:bg-[#201613] transition-all flex items-center justify-center focus:outline-none"
            title="Click to expand sidebar"
          >
            <VedaFlowLogo size="sm" showText={false} />
            <div className="absolute -bottom-1 -right-1 bg-[#181210] border border-[#ca5e3a]/40 rounded-full p-0.5 text-slate-400 shadow-xs group-hover:text-[#ca5e3a] group-hover:border-[#ca5e3a] transition-colors">
              <ChevronRight className="w-3 h-3 stroke-[2.5]" />
            </div>
          </button>
        ) : (
          <>
            <VedaFlowLogo size="md" subtitle="SALES INTELLIGENCE PLATFORM" />

            <button
              onClick={() => dispatch(toggleSidebar())}
              className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:text-[#ca5e3a] hover:bg-[#201613] transition-colors"
              title="Collapse sidebar"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

      {/* Navigation Links */}
      <div className={`flex-1 py-3 overflow-y-auto space-y-1 ${sidebarCollapsed ? 'px-2' : 'px-3'}`}>
        {!sidebarCollapsed && (
          <div className="px-2 mb-3">
            <div className="flex items-center p-0.5 rounded-xl bg-slate-100 border border-slate-200/80 text-xs font-semibold">
              <button
                type="button"
                onClick={() => dispatch(setWorkspaceScope('personal'))}
                className={`flex-1 py-1 rounded-lg text-center transition-all ${
                  workspaceScope === 'personal'
                    ? 'bg-white text-slate-900 shadow-2xs font-bold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Personal User Panel: focus on my assigned items"
              >
                👤 User Panel
              </button>
              <button
                type="button"
                onClick={() => dispatch(setWorkspaceScope('team'))}
                className={`flex-1 py-1 rounded-lg text-center transition-all ${
                  workspaceScope === 'team'
                    ? 'bg-white text-slate-900 shadow-2xs font-bold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Team Overview: view organization-wide pipeline"
              >
                👥 Team View
              </button>
            </div>
          </div>
        )}

        {!sidebarCollapsed && (
          <div className="px-3 mb-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {workspaceScope === 'personal' ? 'User Panel Modules' : 'Enterprise Modules'}
            </p>
          </div>
        )}

        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => dispatch(setActiveTab(item.id))}
              title={sidebarCollapsed ? item.label : undefined}
              className={`w-full flex items-center rounded-xl font-medium text-sm transition-all group ${
                sidebarCollapsed ? 'justify-center px-0 py-3' : 'gap-3 px-3 py-2.5'
              } ${
                isActive
                  ? 'bg-indigo-50/80 text-indigo-600 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div
                className={`transition-colors shrink-0 ${
                  isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'
                }`}
              >
                {item.icon}
              </div>

              {!sidebarCollapsed && (
                <>
                  <span className="flex-1 text-left truncate">{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-semibold shrink-0 ${
                        isActive
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </button>
          );
        })}
      </div>

      {/* Security & Organization Badge */}
      {!sidebarCollapsed && (
        <div className="p-3 mx-3 mb-3 rounded-xl bg-slate-50 border border-slate-200/80">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>DPDP Act 2023 & ISO 27001</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Data Resides in AWS Mumbai (ap-south-1)</p>
        </div>
      )}

      {/* User Footer Profile */}
      <div
        className={`relative p-3 border-t border-slate-100/20 ${sidebarCollapsed ? 'px-2' : 'px-3'}`}
        onMouseEnter={handleProfileMouseEnter}
        onMouseLeave={handleProfileMouseLeave}
      >
        {/* Floating Profile Hover Card ("Shows Above Image" on Arrow Hover) */}
        {profileHovered && (
          <div
            onMouseEnter={handleProfileMouseEnter}
            onMouseLeave={handleProfileMouseLeave}
            className={`absolute bottom-full mb-2.5 z-50 animate-in fade-in zoom-in-95 duration-200 ${
              sidebarCollapsed ? 'left-1 w-72' : 'left-2 right-2'
            } rounded-2xl bg-[#181210]/95 backdrop-blur-xl border border-[#ca5e3a]/50 shadow-2xl p-4 text-left pointer-events-auto`}
            style={{
              boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.8), 0 0 25px 2px rgba(202, 94, 58, 0.3)',
            }}
          >
            {/* Header info with Photo */}
            <div className="flex items-start gap-3 pb-3 border-b border-[#3d271e]">
              <div className="relative shrink-0">
                <img
                  src={getPortraitPhoto(currentUser.name, currentUser.avatar)}
                  alt={currentUser.name}
                  className="w-14 h-14 rounded-full object-cover ring-2 ring-[#ca5e3a] ring-offset-2 ring-offset-[#181210] shadow-md"
                />
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-[#181210]" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-bold text-slate-100 truncate">{currentUser.name}</h4>
                  <span className="inline-flex items-center px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded bg-emerald-950 text-emerald-400 border border-emerald-800/60 shrink-0">
                    Active
                  </span>
                </div>
                <p className="text-xs font-medium text-[#ca5e3a] truncate mt-0.5">{currentUser.role}</p>
                <div className="flex items-center gap-1 text-[11px] text-slate-400 truncate mt-1">
                  <Mail className="w-3 h-3 text-slate-500 shrink-0" />
                  <span className="truncate">{currentUser.email}</span>
                </div>
              </div>
            </div>

            {/* Quick Details */}
            <div className="py-2.5 space-y-1.5 text-[11px] border-b border-[#3d271e]">
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-500 flex items-center gap-1">
                  <Building2 className="w-3 h-3 text-[#ca5e3a]" /> Company
                </span>
                <span className="font-medium text-slate-200 truncate max-w-[140px]">
                  {currentUser.company || 'VedaFlow Technologies India'}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#ca5e3a]" /> Location
                </span>
                <span className="font-medium text-slate-200 truncate">
                  {currentUser.timezone || 'Asia/Kolkata (IST)'}
                </span>
              </div>
            </div>

            {/* Action CTA Button */}
            <button
              onClick={() => {
                setProfileHovered(false);
                dispatch(openModal('userProfileModalOpen'));
              }}
              className="mt-2.5 w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-gradient-to-r from-[#ca5e3a] to-[#b34c2a] hover:from-[#d96a45] hover:to-[#ca5e3a] text-white text-xs font-semibold shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Manage Profile & Avatar</span>
            </button>

            {/* Arrow pointer */}
            <div className="absolute -bottom-1.5 left-7 w-3 h-3 bg-[#181210] border-r border-b border-[#ca5e3a]/50 transform rotate-45" />
          </div>
        )}

        <div
          onClick={() => dispatch(openModal('userProfileModalOpen'))}
          title="Click to manage profile & settings"
          className={`flex items-center rounded-xl hover:bg-[#201613] hover:border-[#ca5e3a]/40 border border-transparent transition-all cursor-pointer group ${
            sidebarCollapsed ? 'justify-center p-2' : 'gap-3 p-2'
          }`}
        >
          <Avatar
            name={currentUser.name}
            src={currentUser.avatar}
            size="sm"
            status={currentUser.status}
            showHoverPhoto={true}
            isHovered={profileHovered}
          />
          {!sidebarCollapsed && (
            <div className="flex-1 min-w-0 text-left">
              <p className="text-sm font-semibold text-slate-200 group-hover:text-[#ca5e3a] transition-colors truncate">
                {currentUser.name}
              </p>
              <p className="text-xs text-slate-400 truncate">{currentUser.role}</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
