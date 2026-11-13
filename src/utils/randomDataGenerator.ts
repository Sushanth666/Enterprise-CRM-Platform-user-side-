import { Lead, Deal, Customer, Task, Activity, CrmNotification } from '@/types/crm';

interface UserIdentity {
  name: string;
  avatar?: string;
  role?: string;
}

const COMPANIES = [
  { name: 'Reliance Jio Infocomm', domain: 'jio.com', city: 'Mumbai', state: 'Maharashtra', industry: 'Telecom & Cloud' },
  { name: 'Tata Digital & Payments', domain: 'tatadigital.com', city: 'Mumbai', state: 'Maharashtra', industry: 'E-Commerce & Digital' },
  { name: 'Zomato Enterprise Logistics', domain: 'zomato.com', city: 'Gurugram', state: 'Haryana', industry: 'Consumer Tech' },
  { name: 'Swiggy Cloud Solutions', domain: 'swiggy.in', city: 'Bengaluru', state: 'Karnataka', industry: 'Hyperlocal Logistics' },
  { name: 'Razorpay Financial Technologies', domain: 'razorpay.com', city: 'Bengaluru', state: 'Karnataka', industry: 'FinTech & Payments' },
  { name: 'PhonePe Payments Platform', domain: 'phonepe.com', city: 'Bengaluru', state: 'Karnataka', industry: 'FinTech' },
  { name: 'Zerodha Broking Ltd', domain: 'zerodha.com', city: 'Bengaluru', state: 'Karnataka', industry: 'BFSI & WealthTech' },
  { name: 'Nykaa E-Commerce Retail', domain: 'nykaa.com', city: 'Mumbai', state: 'Maharashtra', industry: 'Retail & Consumer' },
  { name: 'Cred Tech India', domain: 'cred.club', city: 'Bengaluru', state: 'Karnataka', industry: 'FinTech' },
  { name: 'L&T Infotech Solutions', domain: 'ltimindtree.com', city: 'Mumbai', state: 'Maharashtra', industry: 'IT & Enterprise SaaS' },
  { name: 'Delhivery Supply Chain', domain: 'delhivery.com', city: 'Gurugram', state: 'Haryana', industry: 'Logistics & Supply Chain' },
  { name: 'Pine Labs POS Solutions', domain: 'pinelabs.com', city: 'Noida', state: 'Uttar Pradesh', industry: 'FinTech & Merchant SaaS' },
  { name: 'Meesho Social Commerce', domain: 'meesho.com', city: 'Bengaluru', state: 'Karnataka', industry: 'E-Commerce' },
  { name: 'Groww NextBillion Tech', domain: 'groww.in', city: 'Bengaluru', state: 'Karnataka', industry: 'WealthTech' },
  { name: 'Urban Company Services', domain: 'urbancompany.com', city: 'Gurugram', state: 'Haryana', industry: 'Services Marketplace' },
  { name: 'Ather Energy Mobility', domain: 'atherenergy.com', city: 'Bengaluru', state: 'Karnataka', industry: 'CleanTech & Automotive' },
];

const CONTACTS = [
  { name: 'Vikram Singhania', title: 'VP of Engineering', phone: '+91 98451 22341' },
  { name: 'Sneha Reddy', title: 'Head of Enterprise Procurement', phone: '+91 98200 77123' },
  { name: 'Rohan Malhotra', title: 'Chief Technology Officer', phone: '+91 98199 44321' },
  { name: 'Kavita Desai', title: 'Director of Digital Transformation', phone: '+91 98330 99876' },
  { name: 'Arjun Nair', title: 'VP of Sales Operations', phone: '+91 98401 11223' },
  { name: 'Meera Pillai', title: 'Chief Operating Officer', phone: '+91 98201 44529' },
  { name: 'Aditya Joshi', title: 'Head of Cloud & Infrastructure', phone: '+91 98112 33445' },
  { name: 'Tanvi Bhatia', title: 'VP of Product Management', phone: '+91 98223 44556' },
  { name: 'Divya Chandran', title: 'Principal Enterprise Architect', phone: '+91 98440 55667' },
  { name: 'Suresh Nambiar', title: 'Chief Revenue Officer', phone: '+91 98310 66778' },
  { name: 'Pooja Agarwal', title: 'Senior Director of FinOps', phone: '+91 98105 77889' },
  { name: 'Karthik Sundaram', title: 'VP of Information Security', phone: '+91 98455 88990' },
];

const DEAL_TITLES = [
  'Enterprise Cloud ERP Migration & Analytics',
  'Omni-Channel Customer Intelligence Engine',
  'AI-Powered Sales Automation Cockpit',
  'Global B2B Multi-Currency Payment Gateway',
  'Real-Time Supply Chain Telemetry Integration',
  'Enterprise Zero-Trust Cybersecurity & Compliance',
  'Core Banking Microservices Architecture (Phase II)',
  'Pan-India Hybrid Cloud Infrastructure Rollout',
  'Automated Revenue Recognition & GST Compliance',
  'Unified Customer Data Platform (CDP) Deployment',
];

const TASK_TEMPLATES = [
  { title: 'Present Q4 executive commercial quotation & GST invoice', priority: 'Urgent' as const },
  { title: 'Conduct technical security review with Chief InfoSec Officer', priority: 'High' as const },
  { title: 'Finalize MSA contract amendments with legal counsel', priority: 'High' as const },
  { title: 'Deliver pilot demo milestone presentation to leadership', priority: 'Medium' as const },
  { title: 'Follow up on pending master software agreement signature', priority: 'Urgent' as const },
  { title: 'Review technical architecture specifications with engineering lead', priority: 'Medium' as const },
  { title: 'Prepare custom SLA pricing matrix for enterprise rollout', priority: 'High' as const },
];

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffleArray<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

/**
 * Generates dynamic, realistic randomized CRM data tailored specifically
 * for any logged-in user so that all sections are populated on login.
 */
export function generateRandomUserData(user: UserIdentity) {
  const seedTime = Date.now();
  const userName = user.name || 'Enterprise Rep';
  const userAvatar = user.avatar || '';

  // 1. Generate Random Leads (5 to 8 leads)
  const leadCount = getRandomInt(5, 8);
  const shuffledCompaniesForLeads = shuffleArray(COMPANIES);
  const shuffledContactsForLeads = shuffleArray(CONTACTS);

  const leads: Lead[] = [];
  const leadStatuses: Lead['status'][] = ['Qualified', 'Proposal', 'Negotiation', 'New', 'Contacted'];

  for (let i = 0; i < leadCount; i++) {
    const comp = shuffledCompaniesForLeads[i % shuffledCompaniesForLeads.length];
    const contact = shuffledContactsForLeads[i % shuffledContactsForLeads.length];
    const status = i < 3 ? leadStatuses[i] : leadStatuses[getRandomInt(0, leadStatuses.length - 1)];
    const score = getRandomInt(72, 98);
    const estimatedValue = getRandomInt(18, 90) * 100000; // ₹18L to ₹90L

    leads.push({
      id: `lead-user-${seedTime}-${i + 1}`,
      name: contact.name,
      email: `${contact.name.toLowerCase().replace(/\s+/g, '.')}@${comp.domain}`,
      phone: contact.phone,
      company: comp.name,
      title: contact.title,
      status: status,
      source: ['LinkedIn', 'Referral', 'Website', 'Conference', 'Partner'][getRandomInt(0, 4)] as Lead['source'],
      score: score,
      estimatedValue: estimatedValue,
      assignedTo: userName,
      assignedAvatar: userAvatar,
      country: 'India',
      tags: ['Enterprise', 'High Intent', 'Q4 Pipeline'],
      createdAt: new Date(seedTime - getRandomInt(2, 14) * 86400000).toISOString(),
      lastContactedAt: new Date(seedTime - getRandomInt(1, 4) * 86400000).toISOString(),
      nextFollowUpDate: new Date(seedTime + getRandomInt(1, 5) * 86400000).toISOString().split('T')[0],
      nextFollowUpType: ['Call', 'Meeting', 'Demo', 'Email'][getRandomInt(0, 3)] as any,
      nextFollowUpNotes: `Review Q4 solution proposal and commercial terms with ${contact.name}.`,
    });
  }

  // 2. Generate Random Deals (4 to 7 deals)
  const dealCount = getRandomInt(4, 7);
  const shuffledCompaniesForDeals = shuffleArray(COMPANIES);
  const shuffledTitles = shuffleArray(DEAL_TITLES);
  const deals: Deal[] = [];

  const dealStages: Deal['stage'][] = ['Proposal', 'Negotiation', 'Contract Sent', 'Discovery', 'Qualification', 'Closed Won'];

  for (let i = 0; i < dealCount; i++) {
    const comp = shuffledCompaniesForDeals[(i + 3) % shuffledCompaniesForDeals.length];
    const title = shuffledTitles[i % shuffledTitles.length];
    const stage = i < 4 ? dealStages[i] : dealStages[getRandomInt(0, dealStages.length - 1)];
    const amount = getRandomInt(25, 140) * 100000; // ₹25L to ₹1.4 Cr
    const probability =
      stage === 'Closed Won' ? 100 :
      stage === 'Contract Sent' ? 90 :
      stage === 'Negotiation' ? 80 :
      stage === 'Proposal' ? 65 :
      stage === 'Qualification' ? 50 : 35;

    deals.push({
      id: `deal-user-${seedTime}-${i + 1}`,
      title: `${comp.name} — ${title}`,
      company: comp.name,
      amount: amount,
      stage: stage,
      probability: probability,
      expectedCloseDate: new Date(seedTime + getRandomInt(10, 45) * 86400000).toISOString().split('T')[0],
      assignedTo: userName,
      assignedAvatar: userAvatar,
      priority: ['Urgent', 'High', 'Medium'][getRandomInt(0, 2)] as Deal['priority'],
      tags: ['Strategic', 'Q4 Priority', 'Direct AE'],
      notes: `Enterprise procurement ongoing. Primary sponsor aligned on pricing and technical requirements.`,
      createdAt: new Date(seedTime - getRandomInt(15, 60) * 86400000).toISOString(),
      updatedAt: new Date(seedTime - getRandomInt(1, 3) * 86400000).toISOString(),
    });
  }

  // 3. Generate Random Active Customers (3 to 6 customers)
  const customerCount = getRandomInt(3, 6);
  const shuffledCompaniesForCust = shuffleArray(COMPANIES);
  const shuffledContactsForCust = shuffleArray(CONTACTS);
  const customers: Customer[] = [];

  for (let i = 0; i < customerCount; i++) {
    const comp = shuffledCompaniesForCust[(i + 6) % shuffledCompaniesForCust.length];
    const contact = shuffledContactsForCust[(i + 4) % shuffledContactsForCust.length];
    const totalRev = getRandomInt(24, 95) * 100000; // ₹24L to ₹95L

    customers.push({
      id: `cust-user-${seedTime}-${i + 1}`,
      name: contact.name,
      company: comp.name,
      title: contact.title,
      email: `${contact.name.toLowerCase().replace(/\s+/g, '.')}@${comp.domain}`,
      phone: contact.phone,
      industry: comp.industry,
      website: `https://${comp.domain}`,
      tier: ['Enterprise', 'Mid-Market', 'Growth'][i % 3] as Customer['tier'],
      status: 'Active',
      totalRevenue: totalRev,
      healthScore: getRandomInt(88, 98),
      accountManager: userName,
      address: {
        city: comp.city,
        state: comp.state,
        country: 'India',
      },
      tags: ['Key Account', 'Annual Contract', 'High Health'],
      joinedDate: new Date(seedTime - getRandomInt(90, 365) * 86400000).toISOString().split('T')[0],
      lastActive: new Date(seedTime - getRandomInt(1, 5) * 86400000).toISOString(),
    });
  }

  // 4. Generate Random Tasks (3 to 6 tasks)
  const taskCount = getRandomInt(3, 6);
  const shuffledTemplates = shuffleArray(TASK_TEMPLATES);
  const tasks: Task[] = [];

  for (let i = 0; i < taskCount; i++) {
    const template = shuffledTemplates[i % shuffledTemplates.length];
    const linkedDeal = deals[i % deals.length];

    tasks.push({
      id: `task-user-${seedTime}-${i + 1}`,
      title: `${template.title} (${linkedDeal.company.split(' ')[0]})`,
      description: `Action item assigned for ${userName}. Review key deliverables and follow up with commercial stakeholders.`,
      assignedTo: userName,
      assignedAvatar: userAvatar,
      priority: template.priority,
      status: i === 0 ? 'In Progress' : 'Todo',
      dueDate: new Date(seedTime + getRandomInt(0, 4) * 86400000).toISOString().split('T')[0],
      relatedTo: {
        type: 'Deal',
        id: linkedDeal.id,
        name: linkedDeal.title,
      },
      createdAt: new Date(seedTime - getRandomInt(1, 5) * 86400000).toISOString(),
    });
  }

  // 5. Generate Random Activities (4 to 7 activities)
  const activityCount = getRandomInt(4, 7);
  const activities: Activity[] = [];
  const activityTypes: Activity['type'][] = ['Meeting', 'Call', 'Email', 'Note', 'Status Change'];

  for (let i = 0; i < activityCount; i++) {
    const type = activityTypes[i % activityTypes.length];
    const linkedDeal = deals[i % deals.length];

    activities.push({
      id: `act-user-${seedTime}-${i + 1}`,
      type: type,
      title: `${type}: ${linkedDeal.company}`,
      description: `Touchpoint completed by ${userName}. Aligned on commercial milestones and delivery timeline.`,
      performedBy: userName,
      performedAvatar: userAvatar,
      timestamp: new Date(seedTime - (i + 1) * getRandomInt(3, 18) * 3600000).toISOString(),
      entityType: 'Deal',
      entityId: linkedDeal.id,
      entityName: linkedDeal.title,
      durationMinutes: type === 'Call' ? 18 : type === 'Meeting' ? 45 : undefined,
    });
  }

  // 6. Generate Notifications (3 to 5 notifications)
  const notifCount = getRandomInt(3, 5);
  const notifications: CrmNotification[] = [];

  for (let i = 0; i < notifCount; i++) {
    const linkedLead = leads[i % leads.length];
    notifications.push({
      id: `notif-user-${seedTime}-${i + 1}`,
      type: i === 0 ? 'lead_assignment' : i === 1 ? 'meeting' : 'deal_update',
      title: i === 0 ? 'New Enterprise Lead Assigned' : i === 1 ? 'Upcoming Client Demo' : 'Deal Stage Advanced',
      message: `${linkedLead.name} from ${linkedLead.company} has been assigned to your sales queue.`,
      timestamp: new Date(seedTime - (i + 1) * 35 * 60000).toISOString(),
      read: false,
      priority: 'high',
      linkTab: i === 0 ? 'leads' : 'activities',
      entityId: linkedLead.id,
    });
  }

  return {
    leads,
    deals,
    customers,
    tasks,
    activities,
    notifications,
  };
}

/**
 * Dispatches randomized data across all Redux slices for the authenticated user,
 * guaranteeing all dashboard metric cards, leads, pipeline, customers, and tasks
 * are populated with realistic data on login.
 */
export function populateUserRandomData(
  dispatch: any,
  user: { name: string; avatar?: string; role?: string }
) {
  if (!user || !user.name) return;
  const data = generateRandomUserData(user);

  dispatch({
    type: 'leads/seedUserLeads',
    payload: { userName: user.name, leads: data.leads },
  });

  dispatch({
    type: 'deals/seedUserDeals',
    payload: { userName: user.name, deals: data.deals },
  });

  dispatch({
    type: 'customers/seedUserCustomers',
    payload: { userName: user.name, customers: data.customers },
  });

  dispatch({
    type: 'tasks/seedUserTasks',
    payload: { userName: user.name, tasks: data.tasks },
  });

  dispatch({
    type: 'activities/seedUserActivities',
    payload: { userName: user.name, activities: data.activities },
  });

  dispatch({
    type: 'notifications/seedUserNotifications',
    payload: data.notifications,
  });

  // Calculate closed won amount from deals
  const closedWon = data.deals
    .filter((d) => d.stage === 'Closed Won')
    .reduce((sum, d) => sum + d.amount, 0);
  const activeDeals = data.deals.filter(
    (d) => d.stage !== 'Closed Won' && d.stage !== 'Closed Lost'
  ).length;

  dispatch({
    type: 'auth/updateAuthUser',
    payload: {
      closedWonAmount: closedWon > 0 ? closedWon : 48000000,
      activeDealsCount: activeDeals,
      quota: 85000000,
    },
  });

  return data;
}

