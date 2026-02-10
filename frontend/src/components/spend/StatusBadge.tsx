import { SpendStatus } from '@/types/spend';
import { cn } from '@/lib/utils';
import { STATUS_CONFIG } from '@/lib/constants';

interface StatusBadgeProps {
  status: SpendStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? {
    label: status,
    color: 'text-slate-700',
    bgColor: 'bg-slate-100',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-1 rounded text-xs font-semibold tracking-wide uppercase',
        config.bgColor,
        config.color,
        className
      )}
    >
      {config.label}
    </span>
  );
}
