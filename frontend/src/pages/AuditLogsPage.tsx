import { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useApi } from '@/lib/api';
import { AuditLogEntry, PaginatedResponse } from '@/types/spend';
import { formatDateTime } from '@/lib/constants';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { toast } from 'sonner';
import { 
  FileText, 
  RefreshCw, 
  Search, 
  Eye, 
  ExternalLink,
  History,
  User as UserIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

export function AuditLogsPage() {
  const navigate = useNavigate();
  const { getAuditLogs } = useApi();
  const [logs, setLogs] = useState<PaginatedResponse<AuditLogEntry> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<{
    action?: string;
    entityType?: string;
  }>({});

  useEffect(() => {
    loadLogs();
  }, [page, filters]);

  const loadLogs = async () => {
    setIsLoading(true);
    try {
      const data = await getAuditLogs({ ...filters, page, pageSize: 20 });
      setLogs(data);
    } catch (error) {
      toast.error('Security sync failed');
    } finally {
      setIsLoading(false);
    }
  };

  const getActionStyles = (action: string) => {
    const act = action.toLowerCase();
    if (act.includes('approve') || act.includes('create')) return 'bg-emerald-50 text-emerald-700 border-emerald-100';
    if (act.includes('reject') || act.includes('delete')) return 'bg-red-50 text-red-700 border-red-100';
    if (act.includes('update')) return 'bg-amber-50 text-amber-700 border-amber-100';
    return 'bg-slate-50 text-slate-600 border-slate-100';
  };

  return (
    <AppLayout
      title="Compliance & Audit"
      actions={
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => loadLogs()} 
          className="border-slate-200"
          disabled={isLoading}
        >
          <RefreshCw className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")} />
          Refresh Trail
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-3 p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 text-slate-400 mr-2">
            <Search className="h-4 w-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Filters</span>
          </div>
          
          <Select 
            value={filters.action || 'all'} 
            onValueChange={(v) => setFilters(f => ({ ...f, action: v === 'all' ? undefined : v }))}
          >
            <SelectTrigger className="w-[160px] h-9 text-xs font-medium">
              <SelectValue placeholder="Action Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Actions</SelectItem>
              <SelectItem value="create">Create</SelectItem>
              <SelectItem value="approve">Approve</SelectItem>
              <SelectItem value="reject">Reject</SelectItem>
              <SelectItem value="update">Update</SelectItem>
            </SelectContent>
          </Select>

          <Select 
            value={filters.entityType || 'all'} 
            onValueChange={(v) => setFilters(f => ({ ...f, entityType: v === 'all' ? undefined : v }))}
          >
            <SelectTrigger className="w-[160px] h-9 text-xs font-medium">
              <SelectValue placeholder="Entity Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Entities</SelectItem>
              <SelectItem value="spend">Expense</SelectItem>
              <SelectItem value="user">User Profile</SelectItem>
              <SelectItem value="policy">Policy Engine</SelectItem>
            </SelectContent>
          </Select>

          {(filters.action || filters.entityType) && (
            <Button variant="ghost" size="sm" className="h-9 text-xs text-slate-500" onClick={() => setFilters({})}>
              Reset
            </Button>
          )}
        </div>

        <Card className="border-slate-200/60 shadow-sm overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold">Immutable Activity Log</CardTitle>
                <CardDescription>Tracing every financial and administrative event</CardDescription>
              </div>
              <History className="h-5 w-5 text-slate-300" />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-b border-slate-100">
                  <TableHead className="w-[200px] text-[10px] font-bold text-slate-400 uppercase">Timestamp</TableHead>
                  <TableHead className="text-[10px] font-bold text-slate-400 uppercase">Actor</TableHead>
                  <TableHead className="text-[10px] font-bold text-slate-400 uppercase">Event</TableHead>
                  <TableHead className="text-[10px] font-bold text-slate-400 uppercase">Target Entity</TableHead>
                  <TableHead className="text-right text-[10px] font-bold text-slate-400 uppercase">Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableSkeleton />
                ) : logs?.data.map((log) => (
                  <TableRow key={log.id} className="hover:bg-slate-50/50 transition-colors">
                    <TableCell className="font-mono text-[11px] text-slate-500">
                      {formatDateTime(log.timestamp)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                          <UserIcon className="h-3.5 w-3.5 text-slate-400" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-slate-700">{log.actorName}</span>
                          <span className="text-[10px] text-slate-400">{log.actorEmail}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn("text-[10px] font-bold uppercase py-0", getActionStyles(log.action))}>
                        {log.action}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-slate-600 capitalize">{log.entityType}</span>
                        <button 
                          onClick={() => log.entityType === 'spend' && navigate(`/spends/${log.entityId}`)}
                          className="text-[10px] font-mono text-blue-500 hover:underline flex items-center gap-1"
                        >
                          {log.entityId.slice(0, 12)}... <ExternalLink className="h-2 w-2" />
                        </button>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Sheet>
                        <SheetTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Eye className="h-4 w-4 text-slate-400" />
                          </Button>
                        </SheetTrigger>
                        <SheetContent className="sm:max-w-md">
                          <SheetHeader>
                            <SheetTitle>Log Metadata</SheetTitle>
                            <SheetDescription>Detailed payload for Event ID: {log.id}</SheetDescription>
                          </SheetHeader>
                          <div className="mt-6 space-y-4">
                            <div className="bg-slate-900 rounded-lg p-4 overflow-auto max-h-[70vh]">
                              <pre className="text-[11px] text-emerald-400 font-mono">
                                {JSON.stringify(log.metadata || { info: "No additional metadata recorded" }, null, 2)}
                              </pre>
                            </div>
                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                              <p className="text-xs text-blue-700 font-medium leading-relaxed">
                                <strong>Security Note:</strong> IP addresses and User-Agent strings are obfuscated for privacy but logged in the secure vault.
                              </p>
                            </div>
                          </div>
                        </SheetContent>
                      </Sheet>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

function TableSkeleton() {
  return [...Array(8)].map((_, i) => (
    <TableRow key={i}>
      {[...Array(5)].map((_, j) => (
        <TableCell key={j}><div className="h-4 w-full bg-slate-100 animate-pulse rounded" /></TableCell>
      ))}
    </TableRow>
  ));
}