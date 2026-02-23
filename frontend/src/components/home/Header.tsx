import React from 'react';
import { 
  LayoutDashboard, 
  ArrowLeftRight, 
  Users, 
  ExternalLink, 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  ArrowDown, 
  Share2,
  BookOpen,
  Briefcase,
  CreditCard,
  BarChart,
  FileText
} from 'lucide-react';

// Custom Hooks & Components
import { useAuthenticatedUser } from '@/hooks/useAuthenticatedUser';
import EmailSignup from '../addOn/EmailSignup';
import { Button } from '../ui/button';
import LogoutButton from '../auth/LogoutButton';
import SignupButton from '../auth/SignupButton';
import LoginButton from '../auth/LoginButton';
import { 
  NavigationMenu, 
  NavigationMenuList, 
  NavigationMenuItem, 
  NavigationMenuTrigger, 
  NavigationMenuContent, 
  NavigationMenuLink,
  navigationMenuTriggerStyle
} from '../ui/navigation-menu';

const Hero: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuthenticatedUser();

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 transition-colors duration-300 font-sans min-h-screen">
      
      {/* Custom Styles for Animations and Gradients */}
      <style dangerouslySetInnerHTML={{ __html: `
        .font-display { font-family: 'Outfit', sans-serif; }
        .hero-gradient { background: radial-gradient(circle at 50% -20%, rgba(217, 249, 0, 0.08) 0%, rgba(255, 255, 255, 0) 50%); }
        .dark .hero-gradient { background: radial-gradient(circle at 50% -20%, rgba(217, 249, 0, 0.05) 0%, rgba(10, 10, 10, 0) 50%); }
        .floating { animation: floating 3s ease-in-out infinite; }
        @keyframes floating {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0px); }
        }
        .glass-card {
            background: rgba(255, 255, 255, 0.8);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .dark .glass-card {
            background: rgba(30, 30, 30, 0.8);
            border: 1px solid rgba(255, 255, 255, 0.05);
        }
      `}} />

      {/* Dynamic Navigation */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[1400px] z-50">
        <div className="bg-zinc-900 dark:bg-zinc-950 px-6 py-3 rounded-full flex items-center justify-between shadow-2xl border border-white/10">
          
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center overflow-hidden">
              <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
              </svg>
            </div>
            <span className="text-white font-display font-bold text-xl tracking-tighter uppercase">Spendin</span>
          </div>

          {/* Center Links & Expanded Mega Menu */}
          <div className="hidden lg:flex items-center gap-6">
            <NavigationMenu>
              <NavigationMenuList className="flex items-center gap-1">
                
                {/* Mega Menu Dropdown */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-sm font-medium text-zinc-400 hover:text-white transition-colors bg-transparent hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent border-none">
                    Product
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-[850px] p-4 bg-zinc-950 border border-white/10 rounded-2xl shadow-2xl mt-2 grid grid-cols-3 gap-6">
                      
                      {/* Highlight Card */}
                      <div className="col-span-1">
                        <div className="flex h-full w-full select-none flex-col justify-end rounded-xl bg-gradient-to-b from-primary/80 to-primary p-6 no-underline outline-none focus:shadow-md">
                          <div className="mt-4 mb-2 text-xl font-bold text-black tracking-tight">Smart Corporate Cards</div>
                          <p className="text-sm leading-relaxed text-black/80 font-medium">
                            Issue physical and virtual cards instantly. Get 1.5% cashback on every single spend.
                          </p>
                        </div>
                      </div>

                      {/* Platform Links */}
                      <div className="col-span-1 flex flex-col gap-1">
                        <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 px-3">Platform</h4>
                        <NavigationMenuLink className="p-3 hover:bg-white/5 rounded-xl transition-colors block cursor-pointer group">
                          <div className="font-medium text-white flex items-center gap-2">
                            <CreditCard className="w-4 h-4 text-zinc-400 group-hover:text-primary transition-colors" /> 
                            Bill Pay
                          </div>
                          <p className="text-xs text-zinc-400 mt-1 pl-6">Automate AP and global wires.</p>
                        </NavigationMenuLink>
                        <NavigationMenuLink className="p-3 hover:bg-white/5 rounded-xl transition-colors block cursor-pointer group">
                          <div className="font-medium text-white flex items-center gap-2">
                            <BarChart className="w-4 h-4 text-zinc-400 group-hover:text-primary transition-colors" /> 
                            Expense Management
                          </div>
                          <p className="text-xs text-zinc-400 mt-1 pl-6">No more manual receipt chasing.</p>
                        </NavigationMenuLink>
                        <NavigationMenuLink className="p-3 hover:bg-white/5 rounded-xl transition-colors block cursor-pointer group">
                          <div className="font-medium text-white flex items-center gap-2">
                            <LayoutDashboard className="w-4 h-4 text-zinc-400 group-hover:text-primary transition-colors" /> 
                            Accounting Sync
                          </div>
                          <p className="text-xs text-zinc-400 mt-1 pl-6">Real-time sync to your general ledger.</p>
                        </NavigationMenuLink>
                      </div>

                      {/* Resources Links */}
                      <div className="col-span-1 flex flex-col gap-1">
                        <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 px-3">Resources</h4>
                        <NavigationMenuLink className="p-3 hover:bg-white/5 rounded-xl transition-colors block cursor-pointer group">
                          <div className="font-medium text-white flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors" /> 
                            Case Studies
                          </div>
                          <p className="text-xs text-zinc-400 mt-1 pl-6">See how top companies scale with us.</p>
                        </NavigationMenuLink>
                        <NavigationMenuLink className="p-3 hover:bg-white/5 rounded-xl transition-colors block cursor-pointer group">
                          <div className="font-medium text-white flex items-center gap-2">
                            <FileText className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors" /> 
                            Help Center
                          </div>
                          <p className="text-xs text-zinc-400 mt-1 pl-6">Guides, documentation, and support.</p>
                        </NavigationMenuLink>
                        <NavigationMenuLink className="p-3 hover:bg-white/5 rounded-xl transition-colors block cursor-pointer group">
                          <div className="font-medium text-white flex items-center gap-2">
                            <Briefcase className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors" /> 
                            For Business
                          </div>
                          <p className="text-xs text-zinc-400 mt-1 pl-6">Tailored solutions for enterprises.</p>
                        </NavigationMenuLink>
                      </div>

                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                
                {/* Standard Links */}
                <NavigationMenuItem>
                  <a href="/features" className={`text-sm text-zinc-400 hover:text-white transition-colors bg-transparent hover:bg-transparent ${navigationMenuTriggerStyle()}`}>Features</a>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <a href="/pricing" className={`text-sm text-zinc-400 hover:text-white transition-colors bg-transparent hover:bg-transparent ${navigationMenuTriggerStyle()}`}>Pricing</a>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="text-sm text-white font-medium hover:text-primary transition-colors p-0 hidden sm:inline-flex">
              <LoginButton />
            </Button>
            <Button className="bg-primary text-black px-5 py-2 rounded-full text-sm font-bold hover:opacity-90 transition-opacity">
              <SignupButton />
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Hero Section */}
      <main className="pt-40 pb-20 px-4 hero-gradient overflow-x-clip">
        <div className="max-w-4xl mx-auto text-center relative z-20">
          <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight tracking-tight mb-6 text-zinc-900 dark:text-white">
            Revolutionizing finance for a better tomorrow. <span className="text-zinc-400">Today.</span>
          </h1>
          <p className="text-lg md:text-xl text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto mb-10">
            Fintech services leverage technology to enhance financial processes, offering innovative solutions for banking, investing, and wealth management.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 mb-20">
          <EmailSignup/>
            <button className="border border-zinc-200 dark:border-zinc-800 px-8 py-4 rounded-full font-bold text-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors bg-white dark:bg-zinc-950">
              Learn more
            </button>
          </div>
        </div>

        {/* Dashboard Mockup - Increased Max-Width */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-12 mt-12 z-10">
          <div className="relative bg-white dark:bg-zinc-900 rounded-[32px] shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-visible min-h-[500px] flex">
            
            {/* Sidebar */}
            <aside className="w-64 border-r border-zinc-100 dark:border-zinc-800 p-6 flex-shrink-0 hidden md:block rounded-l-[32px]">
              <div className="flex items-center gap-2 mb-10">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center overflow-hidden">
              <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
              </svg>
            </div>
            <span className="text-secondary font-display font-bold text-xl tracking-tighter uppercase">Spendin</span>
              </div>
              <nav className="space-y-6">
                <div className="flex items-center gap-3 text-black dark:text-white font-medium bg-primary/10 p-2 -mx-2 rounded-lg">
                  <LayoutDashboard className="w-5 h-5 text-primary" />
                  <span>Dashboard</span>
                </div>
                <div className="flex items-center gap-3 text-zinc-400">
                  <ArrowLeftRight className="w-5 h-5" />
                  <span>Transactions</span>
                </div>
                <div className="flex items-center gap-3 text-zinc-400">
                  <Users className="w-5 h-5" />
                  <span>Recipients</span>
                </div>
              </nav>
            </aside>

            {/* Dashboard Content */}
            <div className="flex-1 p-8 text-left overflow-hidden rounded-r-[32px]">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    Welcome back, William 👋
                  </h2>
                </div>
                <div className="flex items-center gap-3 bg-zinc-50 dark:bg-zinc-800/50 p-2 rounded-full border border-zinc-100 dark:border-zinc-800">
                  <img alt="William Grace" className="w-8 h-8 rounded-full border-2 border-white dark:border-zinc-700" src="https://api.dicebear.com/7.x/avataaars/svg?seed=William" />
                  <div className="pr-3">
                    <p className="text-[10px] font-bold leading-none">William Grace</p>
                    <p className="text-[8px] text-zinc-500 uppercase">Admin</p>
                  </div>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-zinc-50 dark:bg-zinc-800/40 p-5 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs text-zinc-500 font-medium">Available balance</span>
                    <ExternalLink className="w-4 h-4 text-zinc-400" />
                  </div>
                  <div className="text-2xl font-bold mb-2">$12,480.50</div>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-500">
                    <TrendingUp className="w-4 h-4" />
                    +2.2%
                  </div>
                </div>
                <div className="bg-zinc-50 dark:bg-zinc-800/40 p-5 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs text-zinc-500 font-medium">This month volume</span>
                    <ExternalLink className="w-4 h-4 text-zinc-400" />
                  </div>
                  <div className="text-2xl font-bold mb-2">$48,320.00</div>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-rose-500">
                    <TrendingDown className="w-4 h-4" />
                    -0.2%
                  </div>
                </div>
                <div className="bg-zinc-50 dark:bg-zinc-800/40 p-5 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs text-zinc-500 font-medium">Fees paid</span>
                    <ExternalLink className="w-4 h-4 text-zinc-400" />
                  </div>
                  <div className="text-2xl font-bold mb-2">$320.40</div>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-orange-400">
                    <TrendingUp className="w-4 h-4" />
                    +14.7%
                  </div>
                </div>
              </div>

              {/* Chart Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Payment volume over time</h3>
                  <div className="flex gap-2 text-[10px] font-bold">
                    <span className="px-2 py-1 rounded bg-zinc-200 dark:bg-zinc-700">7D</span>
                    <span className="px-2 py-1 text-zinc-400">30D</span>
                  </div>
                </div>
                <div className="h-32 flex items-end justify-between gap-1">
                  <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-t-lg h-[40%]"></div>
                  <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-t-lg h-[60%]"></div>
                  <div className="w-full bg-primary/20 rounded-t-lg h-[80%] relative group cursor-pointer">
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white dark:bg-zinc-700 shadow-xl p-2 rounded text-[8px] whitespace-nowrap border border-zinc-100 dark:border-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="block text-zinc-400">Friday, Jun 12</span>
                      <span className="font-bold">$2,340.00</span>
                    </div>
                  </div>
                  <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-t-lg h-[45%]"></div>
                  <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-t-lg h-[70%]"></div>
                  <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-t-lg h-[55%]"></div>
                  <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-t-lg h-[90%]"></div>
                </div>
              </div>
            </div>

            {/* Floating Glass Cards - Positioned outside but not clipped anymore */}
            <div className="absolute -left-4 md:-left-12 top-1/2 -translate-y-1/2 floating glass-card p-5 rounded-2xl shadow-2xl w-64 border border-zinc-200 dark:border-zinc-800 hidden lg:block z-30 text-left">
              <div className="flex items-center gap-3 mb-6">
                <img alt="Jhon Barrel" className="w-12 h-12 rounded-full ring-4 ring-primary/20" src="https://api.dicebear.com/7.x/avataaars/svg?seed=Jhon" />
                <div>
                  <p className="font-bold text-sm">Jhon Barrel</p>
                  <p className="text-[10px] text-zinc-500">Personal account</p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    <ArrowUpRight className="w-4 h-4 text-black" />
                  </div>
                  <span className="text-xs font-bold">Transfer</span>
                </div>
                <span className="text-xs font-bold opacity-30 italic">VISA</span>
              </div>
            </div>

            <div className="absolute -left-10 md:-left-20 top-1/4 floating glass-card px-4 py-2 rounded-full shadow-lg border border-zinc-200 dark:border-zinc-800 hidden lg:flex items-center gap-2 z-30" style={{ animationDelay: '0.5s' }}>
              <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                <ArrowDown className="w-3 h-3 text-black" />
              </div>
              <span className="text-xs font-bold">+$347.23</span>
            </div>

            <div className="absolute -left-2 md:-left-6 bottom-1/4 floating glass-card p-3 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-800 hidden lg:flex items-center gap-3 z-30" style={{ animationDelay: '1.2s' }}>
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M7 21h-4l3-18h11c4.5 0 5 3 5 4.5s-2 5.5-5 5.5h-3l-1.5 8zm3.5-11.5c2.5 0 3-1.5 3-2.5s-.5-2.5-3-2.5h-5.5l-.83 5h6.33z"></path></svg>
              </div>
              <div className="text-left">
                <p className="text-[10px] font-bold leading-none">Paypal</p>
                <p className="text-[8px] text-zinc-500">Money transfer</p>
              </div>
            </div>

            <div className="absolute -right-4 md:-right-8 top-1/3 floating glass-card p-5 rounded-2xl shadow-2xl w-56 border border-zinc-200 dark:border-zinc-800 hidden xl:block z-30" style={{ animationDelay: '0.8s' }}>
              <p className="text-[10px] font-bold text-zinc-500 mb-4 text-left">Average spend in half a year</p>
              <div className="flex items-end gap-1.5 h-20 mb-2">
                <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-[20%] rounded-sm"></div>
                <div className="w-full bg-indigo-500 h-[60%] rounded-sm"></div>
                <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-[30%] rounded-sm"></div>
                <div className="w-full bg-indigo-500 h-[80%] rounded-sm"></div>
                <div className="w-full bg-indigo-500 h-[70%] rounded-sm"></div>
                <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-[40%] rounded-sm"></div>
              </div>
              <div className="flex justify-between text-[8px] text-zinc-400 font-bold uppercase">
                <span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
              </div>
            </div>

            <div className="absolute -right-8 md:-right-16 bottom-1/4 floating glass-card p-4 rounded-2xl shadow-2xl w-60 border border-zinc-200 dark:border-zinc-800 hidden xl:block z-30" style={{ animationDelay: '1.5s' }}>
              <div className="flex items-center -space-x-2 mb-4">
                <img alt="User" className="w-8 h-8 rounded-full border-2 border-white dark:border-zinc-800" src="https://api.dicebear.com/7.x/avataaars/svg?seed=A" />
                <img alt="User" className="w-8 h-8 rounded-full border-2 border-white dark:border-zinc-800" src="https://api.dicebear.com/7.x/avataaars/svg?seed=B" />
                <img alt="User" className="w-8 h-8 rounded-full border-2 border-white dark:border-zinc-800" src="https://api.dicebear.com/7.x/avataaars/svg?seed=C" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold">Share spendings</span>
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                  <Share2 className="w-3.5 h-3.5 text-black" />
                </div>
              </div>
            </div>

            <div className="absolute -right-2 md:-right-4 top-[20%] floating w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white shadow-lg hidden lg:flex z-30" style={{ animationDelay: '2s' }}>
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.36 15.5L12 14.14l-3.36 3.36-1.42-1.42L10.58 12.7 7.22 9.34l1.42-1.42L12 11.28l3.36-3.36 1.42 1.42-3.36 3.36 3.36 3.36-1.42 1.42z"></path></svg>
            </div>
            
            <div className="absolute -right-5 md:-right-10 bottom-[40%] floating w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg hidden lg:flex z-30" style={{ animationDelay: '2.5s' }}>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5.5 11h-4.5v4.5h-2V13h-4.5v-2h4.5V6.5h2V11h4.5v2z"></path></svg>
            </div>
          </div>
        </div>
      </main>

      {/* Logos Section */}
      <section className="max-w-7xl mx-auto px-4 py-20 text-center relative z-20">
        <h2 className="text-3xl font-display font-bold mb-12">Trusted by 20,000+ businesses globally</h2>
        <div className="flex flex-wrap justify-center items-center gap-12 opacity-40 grayscale contrast-125 dark:invert">
          <span className="text-2xl font-black italic tracking-tighter">VOLT</span>
          <span className="text-2xl font-black italic tracking-tighter">ZENITH</span>
          <span className="text-2xl font-black italic tracking-tighter">NEXUS</span>
          <span className="text-2xl font-black italic tracking-tighter">PRISM</span>
          <span className="text-2xl font-black italic tracking-tighter">FLUX</span>
        </div>
      </section>
    </div>
  );
};

export default Hero;