import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useApi } from '@/lib/api';
import { Spend } from '@/types/spend';
import { SpendTable } from '@/components/spend/SpendTable';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Plus, 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  ReceiptText,
  Loader2 
} from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';

export function SpendsListPage() {
  const { user, isAuthenticated } = useAuth0();
  const { getSpends } = useApi();
  const navigate = useNavigate();
  
  const [spends, setSpends] = useState<PaginatedResponse<Spend> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      loadSpends();
    }
  }, [user, page, isAuthenticated]);

  const loadSpends = async () => {
    setIsLoading(true);
    try {
      // API call using Auth0 sub and pagination
      const data = await getSpends({ 
        userId: user?.sub, 
        page, 
        pageSize: 10,
        search: searchQuery 
      });
      setSpends(data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to sync expenses');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppLayout
      title="My Expenses"
      actions={
        <Button
          onClick={() => navigate('/spends/new')}
          className="bg-[#0047AB] hover:bg-[#003d94] shadow-md transition-all active:scale-95"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Expense
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Filters & Search Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search descriptions or vendors..." 
              className="pl-10 bg-white border-slate-200 focus-visible:ring-[#0047AB]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && loadSpends()}
            />
          </div>
          <Button variant="outline" size="sm" className="w-full sm:w-auto text-slate-600 border-slate-200">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>

        <Card className="border-slate-200/60 shadow-sm overflow-hidden">
          <CardHeader className="bg-white border-b border-slate-50 py-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold text-slate-800">
                Expense History
              </CardTitle>
              {isLoading && <Loader2 className="h-4 w-4 animate-spin text-slate-400" />}
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {spends?.data?.length === 0 && !isLoading ? (
              <EmptyState onAdd={() => navigate('/spends/new')} />
            ) : (
              <SpendTable
                spends={spends?.data || []}
                isLoading={isLoading}
              />
            )}
      
            {spends && (
              <div className="flex items-center justify-between px-6 py-4 bg-slate-50/50 border-t border-slate-100">
                <p className="text-xs font-medium text-slate-500 italic">
                  Showing {((page - 1) * spends.pageSize) + 1} - {Math.min(page * spends.pageSize, spends.total)} of {spends.total}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1 || isLoading}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold px-2.5 py-1 bg-white border border-slate-200 rounded text-[#0047AB]">
                      {page}
                    </span>
                    <span className="text-xs text-slate-400 px-1">of</span>
                    <span className="text-xs font-medium text-slate-600 px-1">
                      {Math.ceil(spends.total / spends.pageSize)}
                    </span>
                  </div>

                  <Button
                    variant="ghost"
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

/**
  Empty State for new users
 */
function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
        <ReceiptText className="h-8 w-8 text-slate-300" />
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-1">No expenses yet</h3>
      <p className="text-sm text-slate-500 max-w-[280px] mb-6">
        Once you submit an expense, it will appear here for tracking and approval.
      </p>
      <Button 
        onClick={onAdd}
        variant="outline"
        className="border-[#0047AB] text-[#0047AB] hover:bg-blue-50"
      >
        <Plus className="h-4 w-4 mr-2" />
        File your first expense
      </Button>
    </div>
  );
}