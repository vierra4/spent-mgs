import { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useApi } from '@/lib/api';
import { Spend, PaginatedResponse } from '@/types/spend';
import { SpendTable } from '@/components/spend/SpendTable';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { 
  CheckSquare, 
  AlertCircle, 
  Wallet, 
  ChevronLeft, 
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

export function ApprovalsPage() {
  const { user } = useAuth0();
  const { getPendingSpends, approveSpend, rejectSpend } = useApi();
  const [spends, setSpends] = useState<PaginatedResponse<Spend> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadSpends();
  }, [page]);

  const loadSpends = async () => {
    setIsLoading(true);
    try {
      // Fetches only 'pending' or 'awaiting_approval' status
      const data = await getPendingSpends(page, 10);
      setSpends(data);
    } catch (error) {
      toast.error('Failed to load approval queue');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = async (spend: Spend, action: 'approve' | 'reject') => {
    if (!user) return;
    
    const actionLabel = action === 'approve' ? 'Approving' : 'Rejecting';
    const toastId = toast.loading(`${actionLabel} ${spend.id.slice(0,8)}...`);

    try {
      if (action === 'approve') {
        await approveSpend(spend.id, user.sub!, user.name || 'Manager', 'Quick Approval');
      } else {
        await rejectSpend(spend.id, user.sub!, user.name || 'Manager', 'Quick Rejection');
      }
      
      toast.success(`Expense ${action}d`, { id: toastId });
      loadSpends(); // Refresh list to remove the item from queue
    } catch (error) {
      toast.error(`Could not process ${action}`, { id: toastId });
    }
  };

  // Calculate quick summary for the manager
  const totalPendingAmount = spends?.items?.reduce((acc, curr) => acc + curr.amount, 0) || 0;

  return (
    <AppLayout title="Approvals">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Quick Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard 
            title="Items in Queue" 
            value={spends?.total.toString() || '0'} 
            icon={CheckSquare}
            color="text-[#0047AB]"
          />
          <StatCard 
            title="Total Value" 
            value={`$${totalPendingAmount.toLocaleString()}`} 
            icon={Wallet}
            color="text-emerald-600"
          />
          <StatCard 
            title="Policy Flags" 
            value={spends?.items?.filter(s => !s.policy_passed).length.toString() || '0'} 
            icon={ShieldCheck}
            color="text-amber-600"
          />
        </div>

        <Card className="border-slate-200/60 shadow-sm overflow-hidden">
          <CardHeader className="border-b border-slate-50 bg-white">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-slate-900">Pending Approvals</CardTitle>
                <CardDescription className="text-slate-500 mt-1">
                  Review and process team expense submissions
                </CardDescription>
              </div>
              <Badge variant="outline" className="bg-blue-50 text-[#0047AB] border-blue-100">
                Action Required
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            <SpendTable
              spends={spends?.data || []}
              showUser
              showActions
              onApprove={(s) => handleAction(s, 'approve')}
              onReject={(s) => handleAction(s, 'reject')}
              isLoading={isLoading}
            />
            
            {/* Professional Pagination */}
            {spends && spends.total > 0 && (
              <div className="flex items-center justify-between px-6 py-4 bg-slate-50/50 border-t border-slate-100">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Page {page} of {Math.ceil(spends.total / spends.pageSize)}
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => setPage(p => p - 1)}
                    disabled={page === 1 || isLoading}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => setPage(p => p + 1)}
                    disabled={!spends.hasMore || isLoading}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

// Helper Components
function StatCard({ title, value, icon: Icon, color }: any) {
  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{title}</p>
            <p className={`text-2xl font-black ${color}`}>{value}</p>
          </div>
          <div className={`h-12 w-12 rounded-xl bg-slate-50 flex items-center justify-center`}>
            <Icon className={`h-6 w-6 ${color}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function Badge({ children, className, variant }: any) {
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${className}`}>
      {children}
    </span>
  );
}