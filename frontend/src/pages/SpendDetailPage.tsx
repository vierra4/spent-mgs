import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useApi } from '@/lib/api';
import { Spend } from '@/types/spend';
import { StatusBadge } from '@/components/spend/StatusBadge';
import { CATEGORY_LABELS, formatCurrency, formatDate, formatDateTime } from '@/lib/constants';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  ArrowLeft,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  Calendar,
  Tag,
  Receipt,
  ExternalLink,
  Maximize2,
  Clock,
  MessageSquare
} from 'lucide-react';

export function SpendDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth0();
  const { getSpend, approveSpend, rejectSpend } = useApi();
  const navigate = useNavigate();
  
  const [spend, setSpend] = useState<Spend | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  // Reality Check: Auth0 roles usually come via a custom namespace in the token
  const roles = (user as any)?.['https://spendflow.ai/roles'] || [];
  const isApprover = roles.some((r: string) => ['admin', 'finance', 'manager'].includes(r.toLowerCase()));
  
  const canApprove = isApprover && 
    spend && 
    (spend.status === 'pending' || spend.status === 'awaiting_approval');

  useEffect(() => {
    loadSpend();
  }, [id]);

  const loadSpend = async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const data = await getSpend(id);
      setSpend(data);
    } catch (error) {
      toast.error('Failed to load expense details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = async (action: 'approve' | 'reject') => {
    if (!spend || !user) return;
    setIsProcessing(true);
    const toastId = toast.loading(`${action === 'approve' ? 'Approving' : 'Rejecting'} expense...`);
    
    try {
      if (action === 'approve') {
        await approveSpend(spend.id, user.sub!, user.name || 'Approver', 'Verified via Dashboard');
      } else {
        await rejectSpend(spend.id, user.sub!, user.name || 'Approver', 'Rejected via Dashboard');
      }
      toast.success(`Expense ${action}d successfully`, { id: toastId });
      loadSpend();
    } catch (error) {
      toast.error(`Failed to ${action} expense`, { id: toastId });
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) return <DetailSkeleton />;

  if (!spend) {
    return (
      <AppLayout title="Not Found">
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="bg-slate-100 p-4 rounded-full mb-4">
            <AlertCircle className="h-8 w-8 text-slate-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Expense not found</h2>
          <p className="text-slate-500 mb-6">The expense you're looking for doesn't exist or you don't have access.</p>
          <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      title=""
      actions={
        canApprove && (
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="text-red-600 border-red-200 hover:bg-red-50"
              onClick={() => handleAction('reject')}
              disabled={isProcessing}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Reject
            </Button>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={() => handleAction('approve')}
              disabled={isProcessing}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve
            </Button>
          </div>
        )
      }
    >
      <div className="max-w-6xl mx-auto pb-12">
        {/* Breadcrumbs & Header */}
        <div className="mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-sm font-medium text-slate-500 hover:text-[#0047AB] transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to History
          </button>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <StatusBadge status={spend.status} />
                <span className="text-slate-400 text-sm font-mono uppercase tracking-wider">REF: {spend.id.slice(0,8)}</span>
              </div>
              <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
                {formatCurrency(spend.amount, spend.currency)}
              </h1>
              <p className="text-lg text-slate-600 mt-2 max-w-2xl">{spend.description}</p>
            </div>
            <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm min-w-[200px]">
              <p className="text-xs font-bold text-slate-400 uppercase mb-1">Current Owner</p>
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-[#0047AB] flex items-center justify-center text-[10px] text-white">
                  {spend.user_name?.charAt(0) || 'U'}
                </div>
                <span className="font-semibold text-slate-700">{spend.user_name}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-slate-200/60 shadow-sm overflow-hidden">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <FileText className="h-4 w-4 text-slate-400" /> 
                  Submission Details
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-y-8">
                  <InfoBlock label="Category" value={CATEGORY_LABELS[spend.category] || spend.category} icon={Tag} />
                  <InfoBlock label="Date Created" value={formatDateTime(spend.created_at)} icon={Calendar} />
                  <InfoBlock label="Merchant/Vendor" value={spend.vendor || "Not specified"} icon={Receipt} />
                  <InfoBlock label="Payment Currency" value={spend.currency} icon={Clock} />
                </div>
              </CardContent>
            </Card>

            {/* Receipt Preview - Cloudinary Powered */}
            <Card className="border-slate-200/60 shadow-sm overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Maximize2 className="h-4 w-4 text-slate-400" /> 
                  Receipt Image
                </CardTitle>
                {spend.receipt_url && (
                  <Button variant="ghost" size="sm" asChild>
                    <a href={spend.receipt_url} target="_blank" rel="noreferrer">
                      <ExternalLink className="h-3 w-3 mr-2" /> View Original
                    </a>
                  </Button>
                )}
              </CardHeader>
              <CardContent className="p-0 bg-slate-100/50">
                {spend.receipt_url ? (
                  <div 
                    className="relative group cursor-zoom-in aspect-[4/3] flex items-center justify-center overflow-hidden"
                    onClick={() => window.open(spend.receipt_url, '_blank')}
                  >
                    <img 
                      src={spend.receipt_url} 
                      alt="Receipt" 
                      className="max-h-full object-contain transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition-colors flex items-center justify-center">
                      <div className="bg-white px-4 py-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all font-semibold text-sm">
                        Click to expand
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-12 text-center text-slate-400">
                    <AlertCircle className="h-10 w-10 mx-auto mb-2 opacity-20" />
                    <p>No receipt image attached</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Audit Log / Timeline */}
            <Card className="border-slate-200/60 shadow-sm">
              <CardHeader className="border-b border-slate-100">
                <CardTitle className="text-sm font-bold">Activity Log</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="relative space-y-6 before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px before:h-full before:w-0.5 before:bg-slate-100">
                  {spend.approvalHistory?.map((event, i) => (
                    <div key={event.id} className="relative flex items-start gap-4">
                      <div className={`mt-1.5 h-6 w-6 rounded-full border-4 border-white shadow-sm flex items-center justify-center z-10 ${
                        event.action === 'approved' ? 'bg-emerald-500' :
                        event.action === 'rejected' ? 'bg-red-500' : 'bg-blue-500'
                      }`}>
                        <div className="h-1.5 w-1.5 rounded-full bg-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-slate-900 capitalize">
                          {event.action.replace('_', ' ')}
                        </p>
                        <p className="text-[11px] text-slate-500 uppercase font-medium">
                          {event.actorName} • {formatDate(event.timestamp)}
                        </p>
                        {event.comment && (
                          <div className="mt-2 text-xs text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100 flex gap-2">
                            <MessageSquare className="h-3 w-3 shrink-0 mt-0.5 opacity-40" />
                            "{event.comment}"
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* AI Policy Analysis */}
            <Card className="border-slate-200/60 shadow-sm bg-[#0047AB]/[0.02]">
              <CardHeader>
                <CardTitle className="text-sm font-bold text-slate-900">Compliance Check</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className={`p-4 rounded-xl border ${
                  spend.policy_passed 
                    ? 'bg-emerald-50/50 border-emerald-100' 
                    : 'bg-amber-50/50 border-amber-100'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    {spend.policy_passed ? (
                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-amber-600" />
                    )}
                    <span className={`text-sm font-bold ${spend.policy_passed ? 'text-emerald-700' : 'text-amber-700'}`}>
                      {spend.policy_passed ? 'Auto-Verified' : 'Flagged for Review'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {spend.policy_message || "This expense is within the standard threshold for your department's budget."}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

// Helper: Info Block
function InfoBlock({ label, value, icon: Icon }: { label: string, value: string, icon: any }) {
  return (
    <div className="flex gap-3">
      <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
        <Icon className="h-4 w-4 text-slate-400" />
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">{label}</p>
        <p className="text-sm font-semibold text-slate-700">{value}</p>
      </div>
    </div>
  );
}

// Helper: Skeleton Loader
function DetailSkeleton() {
  return (
    <AppLayout title="Loading...">
      <div className="max-w-6xl mx-auto animate-pulse">
        <div className="h-4 w-24 bg-slate-200 rounded mb-8" />
        <div className="flex justify-between items-end mb-12">
          <div className="space-y-4">
            <div className="h-4 w-32 bg-slate-200 rounded" />
            <div className="h-12 w-64 bg-slate-200 rounded" />
          </div>
          <div className="h-16 w-48 bg-slate-200 rounded-xl" />
        </div>
        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2 h-[500px] bg-slate-100 rounded-2xl" />
          <div className="h-[500px] bg-slate-100 rounded-2xl" />
        </div>
      </div>
    </AppLayout>
  );
}

const CURRENCY_SYMBOLS = { USD: '$', EUR: '€', GBP: '£', CAD: 'CA$', AUD: 'A$' };