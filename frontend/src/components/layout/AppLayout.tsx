import { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react'; // Direct Auth0 usage
import { AppSidebar } from './AppSidebar';
import { useApi } from '@/lib/api';
import { Bell, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AppLayoutProps {
  children: ReactNode;
  title?: string;
  actions?: ReactNode;
}

export function AppLayout({ children, title, actions }: AppLayoutProps) {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();
  const navigate = useNavigate();
  const { getNotifications } = useApi();
  const [unreadCount, setUnreadCount] = useState(0);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      loginWithRedirect();
    }
  }, [isAuthenticated, isLoading, loginWithRedirect]);

  // Fetch notifications
  useEffect(() => {
    if (!isAuthenticated) return;
  
    let isMounted = true;
  
    const fetchUnreadCount = async () => {
      try {
        const response = await getNotifications({ unreadOnly: true });
        if (isMounted) setUnreadCount(response.total);
      } catch (e) {
        console.error(e);
      }
    };
  
    fetchUnreadCount();
  
    const interval = setInterval(fetchUnreadCount, 60000);
  
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [isAuthenticated]);
  

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#0047AB]" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <AppSidebar />
      <div className="pl-64">
        <header className="sticky top-0 z-30 bg-[#FAFAFA]/80 backdrop-blur-sm border-b border-slate-200">
          <div className="flex h-16 items-center justify-between px-8">
            <h1 className="text-2xl font-bold text-[#1A1A1A] tracking-tight">{title}</h1>
            <div className="flex items-center gap-4">
              {actions}
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => navigate('/notifications')}
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </header>

        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}