import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAuth0 } from '@auth0/auth0-react';
import { useApi } from '@/lib/api';
import { Notification, NotificationListResponse, PaginationResponse } from '@/types/spend';
import { getRelativeTime } from '@/lib/constants';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  Bell,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Receipt,
  CheckCheck,
  Inbox,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function NotificationsPage() {
  const { user } = useAuth0();
  const navigate = useNavigate();
  const { getNotifications, markNotificationRead, markAllNotificationsRead } = useApi();
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState<NotificationListResponse>({
    items: [],
    total: 0,
    limit: 20,
    offset: 0
  });
  

  useEffect(() => {
    if (!user) return;
  
    const fetchNotifications = async () => {
      try {
        const data = await getNotifications({ pageSize: 20 });
        setNotifications(data);
      } catch (err) {
        console.error("Failed to fetch notifications", err);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchNotifications(); // initial fetch
  
    const interval = setInterval(fetchNotifications, 30000); // fetch every 30s
    return () => clearInterval(interval); // cleanup on unmount
  }, [user]); // dependency is just user
  

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.read) {
      try {
        await markNotificationRead(notification.id);
        // Update local state for immediate feedback
        setNotifications(prev => prev ? {
          ...prev,
          data: prev.data.map(n => n.id === notification.id ? { ...n, read: true } : n)
        } : null);
      } catch (error) {
        console.error("Failed to mark as read");
      }
    }

    // Contextual Navigation
    if (notification.spendId) {
      navigate(`/spends/${notification.spendId}`);
    }
  };

  const handleMarkAllRead = async () => {
    if (!user?.sub) return;
    const toastId = toast.loading("Clearing your inbox...");
    try {
      await markAllNotificationsRead(user.sub);
      setNotifications(prev => prev ? {
        ...prev,
        data: prev.items.map(n => ({ ...n, read: true }))
      } : null);
      toast.success("All caught up!", { id: toastId });
    } catch (error) {
      toast.error("Failed to update notifications", { id: toastId });
    }
  };

  const getStatusConfig = (type: Notification['type']) => {
    switch (type) {
      case 'spend_approved':
        return { icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' };
      case 'spend_rejected':
        return { icon: XCircle, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100' };
      case 'policy_alert':
        return { icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' };
      default:
        return { icon: Receipt, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' };
    }
  };

  const unreadCount = Array.isArray(notifications.items)
  ? notifications.items.filter(n => !n.read).length
  : 0;

  return (
    <AppLayout
      title="Activity Feed"
      actions={
        unreadCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleMarkAllRead}
            className="text-slate-500 hover:text-[#0047AB]"
          >
            <CheckCheck className="h-4 w-4 mr-2" />
            Mark all read
          </Button>
        )
      }
    >
      <div className="max-w-3xl mx-auto space-y-6">
        <Card className="border-slate-200/60 shadow-sm overflow-hidden">
          <CardHeader className="bg-white border-b border-slate-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-100 rounded-lg">
                  <Bell className="h-5 w-5 text-slate-600" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold">Notifications</CardTitle>
                  <CardDescription>
                    {unreadCount > 0 
                      ? `You have ${unreadCount} new updates requiring attention` 
                      : "You're all caught up for now"}
                  </CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {isLoading ? (
              <LoadingSkeleton />
            ) : notifications?.items.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="divide-y divide-slate-100">
                {notifications?.items.map((notification) => {
                  const config = getStatusConfig(notification.type);
                  const Icon = config.icon;

                  return (
                    <div
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                      className={cn(
                        'group flex items-start gap-4 p-5 cursor-pointer transition-all hover:bg-slate-50/80',
                        !notification.read && 'bg-[#0047AB]/[0.02] border-l-4 border-l-[#0047AB]'
                      )}
                    >
                      <div className={cn(
                        'h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 border',
                        config.bg, config.border
                      )}>
                        <Icon className={cn('h-5 w-5', config.color)} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className={cn(
                            'text-sm font-semibold truncate',
                            notification.read ? 'text-slate-600' : 'text-slate-900'
                          )}>
                            {notification.title}
                          </p>
                          <span className="text-[10px] font-medium text-slate-400 whitespace-nowrap">
                            {getRelativeTime(notification.created_at)}
                          </span>
                        </div>
                        <p className="text-sm text-slate-500 line-clamp-2 mt-0.5">
                          {notification.message}
                        </p>
                        
                        {!notification.read && (
                          <div className="mt-3 flex items-center text-xs font-bold text-[#0047AB] uppercase tracking-wider group-hover:translate-x-1 transition-transform">
                            View Details <ArrowRight className="ml-1 h-3 w-3" />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

function LoadingSkeleton() {
  return (
    <div className="p-6 space-y-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex gap-4 items-center">
          <div className="h-10 w-10 bg-slate-100 rounded-xl animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-1/3 bg-slate-100 animate-pulse rounded" />
            <div className="h-3 w-full bg-slate-100 animate-pulse rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-20">
      <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
        <Inbox className="h-8 w-8 text-slate-200" />
      </div>
      <h3 className="text-slate-900 font-bold">Clear Skies</h3>
      <p className="text-sm text-slate-400 mt-1">No new activity to report.</p>
    </div>
  );
}