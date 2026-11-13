import React from 'react';
import { LeadFilterBar } from './LeadFilterBar';
import { LeadList } from './LeadList';

export const LeadManagementView: React.FC = () => {
  return (
    <div className="space-y-6">
      <LeadFilterBar />
      <LeadList />
    </div>
  );
};

