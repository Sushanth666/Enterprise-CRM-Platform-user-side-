import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { populateUserRandomData } from '@/utils/randomDataGenerator';
import { Layout } from '@/layout/Layout';
import { DashboardView } from '@/modules/dashboard/DashboardView';
import { LeadManagementView } from '@/modules/leads/LeadManagementView';
import { PipelineBoard } from '@/modules/pipeline/PipelineBoard';
import { CustomerList } from '@/modules/customers/CustomerList';
import { TaskList } from '@/modules/tasks/TaskList';
import { ActivityFeed } from '@/modules/activities/ActivityFeed';
import { AnalyticsOverview } from '@/modules/analytics/AnalyticsOverview';
import { NotificationCenter } from '@/modules/notifications/NotificationCenter';
import { LeadFormModal } from '@/modules/leads/LeadFormModal';
import { LeadDetailModal } from '@/modules/leads/LeadDetailModal';
import { LeadFollowUpModal } from '@/modules/leads/LeadFollowUpModal';
import { DealFormModal } from '@/modules/pipeline/DealFormModal';
import { DealDetailModal } from '@/modules/pipeline/DealDetailModal';
import { CustomerFormModal } from '@/modules/customers/CustomerFormModal';
import { TaskFormModal } from '@/modules/tasks/TaskFormModal';
import { LogActivityModal } from '@/modules/activities/LogActivityModal';
import { UserProfileModal } from '@/modules/auth/UserProfileModal';
import { AuthPage } from '@/modules/auth/AuthPage';
import { ToastContainer } from '@/components/Toast';
import { useTabTitleMarquee } from '@/hooks/useTabTitleMarquee';

export const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const currentUser = useAppSelector((state) => state.auth.user);
  const leads = useAppSelector((state) => state.leads.items);
  const deals = useAppSelector((state) => state.deals.items);
  const customers = useAppSelector((state) => state.customers.items);
  const tasks = useAppSelector((state) => state.tasks.items);
  const colorTheme = useAppSelector((state) => state.ui.colorTheme);
  const activeTab = useAppSelector((state) => state.ui.activeTab);

  // Auto-populate random data for the authenticated user if any CRM section is missing records
  useEffect(() => {
    if (isAuthenticated && currentUser?.name) {
      const normalizedName = currentUser.name.trim().toLowerCase();
      const hasLeads = leads.some((l) => l.assignedTo?.toLowerCase() === normalizedName);
      const hasDeals = deals.some((d) => d.assignedTo?.toLowerCase() === normalizedName);
      const hasCustomers = customers.some((c) => c.accountManager?.toLowerCase() === normalizedName);
      const hasTasks = tasks.some((t) => t.assignedTo?.toLowerCase() === normalizedName);

      if (!hasLeads || !hasDeals || !hasCustomers || !hasTasks) {
        populateUserRandomData(dispatch, currentUser);
      }
    }
  }, [isAuthenticated, currentUser?.name, leads.length, deals.length, customers.length, tasks.length]);

  // Smooth moving animation in the browser tab title
  useTabTitleMarquee('VedaFlow - Sales Intelligence Platform', {
    speed: 280,
    separator: '   •   ',
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', colorTheme || 'sunset-copper');
  }, [colorTheme]);

  // Lock browser window scrollbar when on login / signup screen
  useEffect(() => {
    if (!isAuthenticated) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="h-screen w-full overflow-hidden bg-[#0d0806] [data-theme='sunset-copper']_&:bg-[#0d0806] flex flex-col justify-center items-center no-scrollbar">
        <ToastContainer />
        <AuthPage />
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'leads':
        return <LeadManagementView />;
      case 'pipeline':
        return <PipelineBoard />;
      case 'customers':
        return <CustomerList />;
      case 'tasks':
        return <TaskList />;
      case 'activities':
        return <ActivityFeed />;
      case 'analytics':
        return <AnalyticsOverview />;
      case 'notifications':
        return <NotificationCenter />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <Layout>
      <div key={activeTab} className="page-view-enter">
        {renderContent()}
      </div>

      {/* Global Quick Action, Detail & Profile Modals */}
      <LeadFormModal />
      <LeadDetailModal />
      <LeadFollowUpModal />
      <DealFormModal />
      <DealDetailModal />
      <CustomerFormModal />
      <TaskFormModal />
      <LogActivityModal />
      <UserProfileModal />
    </Layout>
  );
};

export default App;
