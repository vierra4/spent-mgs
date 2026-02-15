import { useNavigate } from 'react-router-dom';
import { Spend } from '@/types/spend';
import { StatusBadge } from './StatusBadge';
import { CATEGORY_LABELS, formatCurrency, formatDate } from '@/lib/constants';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { 
  ChevronRight, 
  Inbox, 
  FileImage, 
  ExternalLink,
  User as UserIcon 
} from 'lucide-react';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';

interface SpendTableProps {
  spends: Spend[];
  showUser?: boolean;
  showActions?: boolean;
  onApprove?: (spend: Spend) => void;
  onReject?: (spend: Spend) => void;
  isLoading?: boolean;
}

export function SpendTable({
  spends,
  showUser = false,
  showActions = false,
  onApprove,
  onReject,
  isLoading = false,
}: SpendTableProps) {
  const navigate = useNavigate();

  // Skeleton Loading State
  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 w-full bg-slate-50 animate-pulse rounded-xl border border-slate-100" />
        ))}
      </div>
    );
  }

  // Empty State
  if (spends.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500 bg-slate-50/30 rounded-xl border border-dashed border-slate-200 m-4">
        <div className="h-12 w-12 rounded-full bg-white shadow-sm flex items-center justify-center mb-4">
          <Inbox className="h-6 w-6 text-slate-300" />
        </div>
        <p className="text-sm font-bold text-slate-900">No expenses found</p>
        <p className="text-xs text-slate-400 mt-1">Try adjusting your filters or search query.</p>
      </div>
    );
  }

  return (
    <div className="relative overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-b border-slate-100">
            <TableHead className="py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Amount</TableHead>
            <TableHead className="py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Details</TableHead>
            <TableHead className="py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Receipt</TableHead>
            {showUser && (
              <TableHead className="py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Employee</TableHead>
            )}
            <TableHead className="py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Date</TableHead>
            <TableHead className="py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Status</TableHead>
            {showActions && (
              <TableHead className="py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right">Actions</TableHead>
            )}
            <TableHead className="w-10"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {spends.map((spend) => (
            <TableRow
              key={spend.id}
              className="cursor-pointer group hover:bg-slate-50/80 transition-all border-b border-slate-50"
              onClick={() => navigate(`/spends/${spend.id}`)}
            >
              {/* Amount */}
              <TableCell className="font-mono font-bold text-slate-900 text-base">
                {formatCurrency(spend.amount, spend.currency)}
              </TableCell>

              {/* Description & Category */}
              <TableCell>
                <div className="flex flex-col max-w-[200px]">
                  <span className="font-semibold text-slate-800 truncate leading-snug">
                    {spend.description || 'No description'}
                  </span>
                  <span className="text-[11px] font-medium text-slate-400 uppercase tracking-tight">
                    {CATEGORY_LABELS[spend.category as keyof typeof CATEGORY_LABELS] ?? spend.category}
                  </span>
                </div>
              </TableCell>

              {/* Cloudinary Receipt Hover Card */}
              <TableCell onClick={(e) => e.stopPropagation()}>
                {spend.receipt_url ? (
                  <HoverCard openDelay={100}>
                    <HoverCardTrigger asChild>
                      <button className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-100 text-slate-600 hover:bg-[#0047AB] hover:text-white transition-all">
                        <FileImage className="h-3.5 w-3.5" />
                        <span className="text-[10px] font-bold uppercase">View</span>
                      </button>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-64 p-0 shadow-2xl border-slate-200 overflow-hidden" side="top">
                      <div className="bg-slate-50 aspect-square flex items-center justify-center p-2">
                        <img 
                          src={spend.receipt_url} 
                          alt="Receipt Preview" 
                          className="max-w-full max-h-full object-contain rounded shadow-sm"
                        />
                      </div>
                      <div className="p-2 bg-white border-t flex justify-between items-center">
                        <span className="text-[10px] font-bold text-slate-400 uppercase px-2">Preview</span>
                        <Button 
                          variant="ghost" 
                          size="xs" 
                          className="h-6 text-[10px]"
                          onClick={() => window.open(spend.receipt_url, '_blank')}
                        >
                          <ExternalLink className="h-3 w-3 mr-1" /> Full Size
                        </Button>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                ) : (
                  <span className="text-[10px] font-medium text-slate-300 italic">No receipt</span>
                )}
              </TableCell>

              {/* Employee Column (Manager/Admin View) */}
              {showUser && (
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                      <UserIcon className="h-3 w-3 text-slate-400" />
                    </div>
                    <span className="text-sm font-medium text-slate-700">
                      {spend.user?.full_name || spend.user_name || 'System User'}
                    </span>
                  </div>
                </TableCell>
              )}

              {/* Date */}
              <TableCell className="text-sm text-slate-500 font-medium">
                {formatDate(spend.created_at ||spend.spend_date|| '')}
              </TableCell>

              {/* Status Badge */}
              <TableCell>
                <StatusBadge status={spend.status} />
              </TableCell>

              {/* Quick Actions (Manager View) */}
              {showActions && (
                <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                  {(spend.status === 'pending' || spend.status === 'awaiting_approval') ? (
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 text-emerald-600 hover:bg-emerald-50 text-xs font-bold"
                        onClick={() => onApprove?.(spend)}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 text-red-600 hover:bg-red-50 text-xs font-bold"
                        onClick={() => onReject?.(spend)}
                      >
                        Reject
                      </Button>
                    </div>
                  ) : (
                    <span className="text-[10px] font-bold text-slate-300 uppercase mr-4">Processed</span>
                  )}
                </TableCell>
              )}

              {/* Interaction Chevron */}
              <TableCell className="pr-4">
                <div className="flex justify-end">
                  <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-[#0047AB] group-hover:translate-x-1 transition-all" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}