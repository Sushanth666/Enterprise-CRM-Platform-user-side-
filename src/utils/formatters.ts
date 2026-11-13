export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatCompactCurrency = (amount: number): string => {
  if (amount >= 10_000_000) {
    return `₹${(amount / 10_000_000).toFixed(2)} Cr`;
  }
  if (amount >= 100_000) {
    return `₹${(amount / 100_000).toFixed(1)} L`;
  }
  if (amount >= 1_000) {
    return `₹${(amount / 1_000).toFixed(0)} K`;
  }
  return `₹${amount}`;
};

export const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

export const formatDateTime = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return formatDate(dateString);
};

export const getLeadStatusColor = (status: string) => {
  switch (status) {
    case 'New':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'Contacted':
      return 'bg-purple-50 text-purple-700 border-purple-200';
    case 'Qualified':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'Proposal':
      return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    case 'Negotiation':
      return 'bg-cyan-50 text-cyan-700 border-cyan-200';
    case 'Converted':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'Unqualified':
    case 'Lost':
      return 'bg-rose-50 text-rose-700 border-rose-200';
    default:
      return 'bg-slate-50 text-slate-700 border-slate-200';
  }
};

export const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case 'Urgent':
      return 'bg-red-50 text-red-700 border-red-200';
    case 'High':
      return 'bg-orange-50 text-orange-700 border-orange-200';
    case 'Medium':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'Low':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    default:
      return 'bg-slate-50 text-slate-700 border-slate-200';
  }
};

export const getStageColor = (stage: string) => {
  switch (stage) {
    case 'Discovery':
      return 'border-sky-400 bg-sky-50 text-sky-700';
    case 'Qualification':
      return 'border-blue-400 bg-blue-50 text-blue-700';
    case 'Proposal':
      return 'border-indigo-400 bg-indigo-50 text-indigo-700';
    case 'Negotiation':
      return 'border-amber-400 bg-amber-50 text-amber-700';
    case 'Contract Sent':
      return 'border-purple-400 bg-purple-50 text-purple-700';
    case 'Closed Won':
      return 'border-emerald-500 bg-emerald-50 text-emerald-700';
    case 'Closed Lost':
      return 'border-rose-400 bg-rose-50 text-rose-700';
    default:
      return 'border-slate-300 bg-slate-50 text-slate-700';
  }
};
