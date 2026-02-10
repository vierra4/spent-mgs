import { SpendStatus, Currency, SpendCategory } from '@/types/spend';

/*
  UI Configuration for Spend Statuses
  Matches the SpendStatus type exactly
 */
export const STATUS_CONFIG: Record<SpendStatus, { label: string; color: string; bgColor: string; dotColor: string }> = {
  draft: {
    label: 'Draft',
    color: 'text-slate-600',
    bgColor: 'bg-slate-100',
    dotColor: 'bg-slate-400',
  },
  pending: { // Standardized from 'submitted' to match backend
    label: 'Pending',
    color: 'text-amber-700',
    bgColor: 'bg-amber-100/50',
    dotColor: 'bg-amber-500',
  },
  approved: {
    label: 'Approved',
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-100/80',
    dotColor: 'bg-emerald-500',
  },
  rejected: {
    label: 'Rejected',
    color: 'text-red-700',
    bgColor: 'bg-red-100/80',
    dotColor: 'bg-red-500',
  },
  blocked: {
    label: 'Blocked',
    color: 'text-slate-900',
    bgColor: 'bg-slate-200',
    dotColor: 'bg-slate-600',
  },
};

/*
  Currency Symbols for UI display
 */
export const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  CAD: 'C$',
  AUD: 'A$',
};


/*
  Formats numbers into currency strings based on backend currency code
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  const symbol = CURRENCY_SYMBOLS[currency] || '$';
  return `${symbol}${Number(amount).toLocaleString('en-US', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  })}`;
}

/*
  Formats ISODateStrings into "Feb 10, 2026"
 */
export function formatDate(dateString: string): string {
  if (!dateString) return '—';
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/*
  Formats ISODateStrings into "Feb 10, 2024, 4:00 PM"
 */
export function formatDateTime(dateString: string): string {
  if (!dateString) return '—';
  return new Date(dateString).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

/*
  Provides a human-readable relative time (e.g., "2h ago")
 */
export function getRelativeTime(dateString: string): string {
  if (!dateString) return '';
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return formatDate(dateString);
}

/*
  Helper to get initials for Avatars if full_name is provided
 */
export function getInitials(name?: string): string {
  if (!name) return '??';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
}
export const CATEGORY_LABELS: Record<SpendCategory, string> = {
  travel: 'Travel',
  meals: 'Meals & Entertainment',
  software: 'Software',
  equipment: 'Equipment',
  office_supplies: 'Office Supplies',
  marketing: 'Marketing',
  professional_services: 'Professional Services',
  other: 'Other',
};

