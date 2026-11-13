// CRM Core TypeScript Interfaces and Types

export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Proposal' | 'Negotiation' | 'Unqualified' | 'Converted';
export type LeadSource = 'Website' | 'LinkedIn' | 'Referral' | 'Cold Call' | 'Inbound Email' | 'Conference' | 'Partner';
export type PriorityLevel = 'Low' | 'Medium' | 'High' | 'Urgent';

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  title: string;
  status: LeadStatus;
  source: LeadSource;
  score: number; // 0 to 100
  estimatedValue: number;
  assignedTo: string;
  assignedAvatar?: string;
  notes?: string;
  tags: string[];
  createdAt: string;
  lastContactedAt?: string;
  country?: string;
  nextFollowUpDate?: string;
  nextFollowUpType?: 'Call' | 'Meeting' | 'Email' | 'Demo';
  nextFollowUpNotes?: string;
}

export type DealStage = 
  | 'Discovery' 
  | 'Qualification' 
  | 'Proposal' 
  | 'Negotiation' 
  | 'Contract Sent' 
  | 'Closed Won' 
  | 'Closed Lost';

export interface Deal {
  id: string;
  title: string;
  company: string;
  customerId?: string;
  leadId?: string;
  amount: number;
  stage: DealStage;
  probability: number; // 0 - 100%
  expectedCloseDate: string;
  assignedTo: string;
  assignedAvatar?: string;
  priority: PriorityLevel;
  tags: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  title: string;
  industry: string;
  website?: string;
  avatar?: string;
  status: 'Active' | 'Churned' | 'Onboarding' | 'Lead';
  totalRevenue: number;
  healthScore: number; // 0 to 100
  accountManager: string;
  tier: 'Enterprise' | 'Mid-Market' | 'Growth' | 'Startup';
  address?: {
    city: string;
    state?: string;
    country: string;
  };
  tags: string[];
  notes?: string;
  joinedDate: string;
  lastActive: string;
}

export type TaskStatus = 'Todo' | 'In Progress' | 'Under Review' | 'Completed';

export interface Task {
  id: string;
  title: string;
  description?: string;
  assignedTo: string;
  assignedAvatar?: string;
  priority: PriorityLevel;
  status: TaskStatus;
  dueDate: string;
  relatedTo?: {
    type: 'Lead' | 'Deal' | 'Customer';
    id: string;
    name: string;
  };
  createdAt: string;
  completedAt?: string;
}

export type ActivityType = 'Call' | 'Meeting' | 'Email' | 'Note' | 'Status Change' | 'Task Completed';

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  performedBy: string;
  performedAvatar?: string;
  timestamp: string;
  entityType: 'Lead' | 'Deal' | 'Customer';
  entityId: string;
  entityName: string;
  outcome?: string;
  durationMinutes?: number;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  avatar: string;
  quota: number;
  closedWonAmount: number;
  activeDealsCount: number;
}

export type NotificationType = 
  | 'lead_assignment' 
  | 'task_reminder' 
  | 'meeting' 
  | 'deal_update' 
  | 'system';

export interface CrmNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority?: 'high' | 'medium' | 'normal';
  linkTab?: string;
  entityId?: string;
}

