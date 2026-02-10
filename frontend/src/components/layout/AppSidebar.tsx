import { Link, useLocation } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { cn } from '@/lib/utils';
import { getInitials } from '@/lib/constants';
import {
  LayoutDashboard,
  Receipt,
  Bell,
  Shield,
  FileText,
  LogOut,
  ChevronRight,
  Settings,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'My Spends', href: '/spends', icon: Receipt, roles: ['employee'] },
  { label: 'Approvals', href: '/approvals', icon: FileText, roles: ['manager', 'finance'] },
  { label: 'Notifications', href: '/notifications', icon: Bell },
  { label: 'Policies', href: '/policies', icon: Shield, roles: ['admin', 'finance'] },
  { label: 'Audit Logs', href: '/audit', icon: FileText, roles: ['admin'] },
  { label: 'Settings', href: '/settings', icon: Settings, roles: ['manager', 'finance', 'admin'] },
];

export function AppSidebar() {
  const location = useLocation();
  const { user, logout } = useAuth0();

  // Role Logic: Adjust the key to match your Auth0 Action/Rule namespace
  const userRoles: string[] = (user?.['https://spendflow.com/roles'] as string[]) || [];
  
  const hasRole = (allowedRoles: string[]) => {
    return allowedRoles.some(role => userRoles.includes(role));
  };

  const visibleItems = navItems.filter(item => {
    if (!item.roles) return true;
    return hasRole(item.roles);
  });

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-white border-r border-slate-200">
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center px-6 border-b border-slate-100">
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-[#0047AB] flex items-center justify-center text-white font-bold text-sm">SF</div>
            <span className="text-xl font-bold text-[#1A1A1A] tracking-tight">SpendFlow</span>
          </Link>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-1">
          {visibleItems.map((item) => {
            const isActive = location.pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors relative',
                  isActive ? 'bg-slate-100 text-[#0047AB]' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                )}
              >
                {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#0047AB] rounded-r-full" />}
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
                {isActive && <ChevronRight className="h-4 w-4 ml-auto" />}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-slate-100 p-4">
          <div className="flex items-center gap-3 mb-3">
            <Avatar className="h-10 w-10 border border-slate-200">
              <AvatarImage src={user?.picture} alt={user?.name} />
              <AvatarFallback className="bg-slate-100 text-[#0047AB] font-bold">
                {getInitials(user?.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">
                {user?.name || 'User'}
              </p>
              <p className="text-xs text-slate-500 capitalize">
                {userRoles[0] || 'Member'}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start text-slate-600 hover:text-red-600 hover:bg-red-50"
            onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign out
          </Button>
        </div>
      </div>
    </aside>
  );
}