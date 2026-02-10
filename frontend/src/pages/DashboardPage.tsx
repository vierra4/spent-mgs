import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useApi } from '@/lib/api';
import { Spend, PaginatedResponse } from '@/types/spend';
import { SpendTable } from '@/components/spend/SpendTable';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, TrendingUp, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { formatCurrency } from '@/lib/constants';
import { toast } from 'sonner';

export function DashboardPage() {
  const { user } = useAuth0();
  const { getSpends, getPendingSpends, approveSpend, rejectSpend } = useApi();
  const navigate = useNavigate();
  
  const [spends, setSpends] = useState<PaginatedResponse<Spend> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Define roles based on Auth0 claims (consistent with Sidebar)
  const userRoles = (user?.['https://spendflow.com/roles'] as string[]) || [];
  const isApprover = userRoles.some(role => ['manager', 'finance', 'admin'].includes(role));

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      let data: PaginatedResponse<Spend>;
      if (isApprover) {
        // Fetch items needing attention for managers
        data = await getPendingSpends(1, 5);
      } else {
        // Fetch user's own items
        data = await getSpends({ page: 1, pageSize: 5 });
      }
      setSpends(data);
    } catch (error) {
      toast.error('Failed to load dashboard data');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [isApprover, getSpends, getPendingSpends]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleApprove = async (spend: Spend) => {
    try {
      await approveSpend(spend.id, 'Approved via Dashboard Quick Action');
      toast.success('Expense approved');
      loadData();
    } catch (error) {
      toast.error('Approval failed');
    }
  };

  const handleReject = async (spend: Spend) => {
    try {
      await rejectSpend(spend.id, 'Does not meet policy requirements');
      toast.success('Expense rejected');
      loadData();
    } catch (error) {
      toast.error('Rejection failed');
    }
  };

  // Stats derived from the current view
  const stats = {
    totalValue: spends?.data.reduce((acc, s) => acc + s.amount, 0) || 0,
    pendingCount: spends?.data.filter(s => s.status === 'pending').length || 0,
    approvedCount: spends?.data.filter(s => s.status === 'approved').length || 0,
    rejectedCount: spends?.data.filter(s => s.status === 'rejected').length || 0,
  };

  return (
    <AppLayout
      title={isApprover ? 'Approvals Overview' : 'My Expenses'}
      actions={
        !isApprover && (
          <Button
            onClick={() => navigate('/spends/new')}
            className="bg-[#0047AB] hover:bg-[#003d94] shadow-md transition-all"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Request
          </Button>
        )
      }
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          label={isApprover ? 'Total Pending Value' : 'Total Spent (Recent)'}
          value={formatCurrency(stats.totalValue)}
          icon={<TrendingUp className="h-5 w-5 text-[#0047AB]" />}
          iconBg="bg-blue-100"
        />
        <StatCard 
          label="Pending"
          value={stats.pendingCount.toString()}
          icon={<Clock className="h-5 w-5 text-amber-600" />}
          iconBg="bg-amber-100"
          textColor="text-amber-600"
        />
        <StatCard 
          label="Approved"
          value={stats.approvedCount.toString()}
          icon={<CheckCircle className="h-5 w-5 text-emerald-600" />}
          iconBg="bg-emerald-100"
          textColor="text-emerald-600"
        />
        <StatCard 
          label="Rejected"
          value={stats.rejectedCount.toString()}
          icon={<XCircle className="h-5 w-5 text-red-600" />}
          iconBg="bg-red-100"
          textColor="text-red-600"
        />
      </div>

      {/* Main Table Section */}
      <Card className="border-0 shadow-sm overflow-hidden">
        <CardHeader className="pb-4 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold text-slate-900">
                {isApprover ? 'Items Requiring Action' : 'Recent Activity'}
              </CardTitle>
              <CardDescription>
                {isApprover 
                  ? 'Expenses awaiting your review and authorization'
                  : 'Track the status of your recently submitted expenses'
                }
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(isApprover ? '/approvals' : '/spends')}
              className="text-slate-600 border-slate-200"
            >
              View Full History
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-slate-300" />
              <p className="text-sm text-slate-500">Fetching latest data...</p>
            </div>
          ) : (
            <SpendTable
              spends={spends?.data || []}
              showUser={isApprover}
              showActions={isApprover}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          )}
        </CardContent>
      </Card>
    </AppLayout>
  );
}

/*
  Reusable Stat Card Component for a cleaner Dashboard layout
 */
function StatCard({ label, value, icon, iconBg, textColor = "text-[#1A1A1A]" }: any) {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-2">
        <CardDescription className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {label}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <span className={`text-2xl font-bold font-mono ${textColor}`}>
            {value}
          </span>
          <div className={`h-10 w-10 rounded-xl ${iconBg} flex items-center justify-center`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}