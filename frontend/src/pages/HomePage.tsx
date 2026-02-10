import React from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, Wallet, ShieldCheck, Zap, BarChart3 } from "lucide-react";
import LoginButton  from "@/components/auth/LoginButton"; 
import SignupButton  from "@/components/auth/SignupButton";
import LogoutButton  from "@/components/auth/LogoutButton.tsx";
import { useAuthenticatedUser } from '../hooks/useAuthenticatedUser';

export default function HomePage() {
  const { user, accessToken, isLoading, isAuthenticated } = useAuthenticatedUser();

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900 font-sans antialiased">
      {/* --- NAVIGATION --- */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-10">
            <a href="/" className="flex items-center gap-2 font-bold text-2xl tracking-tighter">
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                <Zap size={18} fill="currentColor" />
              </div>
              Spendin
            </a>

            <NavigationMenu className="hidden md:flex">
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Product</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      <li className="row-span-3">
                        <div className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-blue-500 to-blue-700 p-6 no-underline outline-none focus:shadow-md">
                          <div className="mt-4 mb-2 text-lg font-medium text-white">Smart Corporate Cards</div>
                          <p className="text-sm leading-tight text-white/90">
                            Issue physical and virtual cards with 1.5% cashback on every spend.
                          </p>
                        </div>
                      </li>
                      <NavigationMenuLink className="p-3 hover:bg-slate-100 rounded-md transition-colors">
                        <div className="font-medium">Bill Pay</div>
                        <p className="text-xs text-slate-500">Automate AP and global wires.</p>
                      </NavigationMenuLink>
                      <NavigationMenuLink className="p-3 hover:bg-slate-100 rounded-md transition-colors">
                        <div className="font-medium">Expense Management</div>
                        <p className="text-xs text-slate-500">No more manual receipt chasing.</p>
                      </NavigationMenuLink>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <a href="/pricing" className={navigationMenuTriggerStyle()}>Pricing</a>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className="flex items-center gap-3">
            {isLoading ? (
              <div className="h-8 w-20 animate-pulse bg-slate-100 rounded" />
            ) : !isAuthenticated ? (
              <>
                <LoginButton />
                <SignupButton />
              </>
            ) : (
              <div className="flex items-center gap-4">
              <a href="/dashboard"><Button variant="ghost">Dashboard</Button></a>
                <LogoutButton />
              </div>
            )}
          </div>
        </div>
      </header>

      {/* --- HERO SECTION --- */}
      <main>
        <section className="container mx-auto px-4 pt-20 pb-16 text-center lg:pt-32">
          <h1 className="mx-auto max-w-4xl text-5xl font-extrabold tracking-tight sm:text-7xl lg:leading-[1.1]">
            Finance operations <br />
            <span className="text-blue-600">on autopilot.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 sm:text-xl">
            Spendin is the all-in-one spend management platform that gives you total control over company spend while saving you thousands.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="h-14 px-8 bg-slate-950 text-lg hover:bg-slate-800 transition-all">
              Get Started for Free
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-8 text-lg">
              Book a Demo
            </Button>
          </div>

          {/* Genric using UI using AI */}
          <div className="mt-16 relative mx-auto max-w-5xl">
            <div className="rounded-xl border bg-white shadow-2xl overflow-hidden p-2 sm:p-4">
              <div className="flex items-center justify-between border-b pb-4 mb-4">
                <div className="flex gap-2 font-semibold"><BarChart3 size={20}/> Spend Overview</div>
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none">Live</Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                <div className="space-y-1">
                  <p className="text-sm text-slate-500">Total Spend (MTD)</p>
                  <p className="text-3xl font-bold">$142,500.00</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-slate-500">Active Cards</p>
                  <p className="text-3xl font-bold">128</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-slate-500">Savings Identified</p>
                  <p className="text-3xl font-bold text-blue-600">$4,210.40</p>
                </div>
              </div>
            </div>
            {/* Decorative background glow */}
            <div className="absolute -top-10 -z-10 h-full w-full bg-blue-400/10 blur-[120px] rounded-full" />
          </div>
        </section>

        {/* FEATURES  */}
        <section className="bg-slate-50 py-24 border-t">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureItem 
                icon={<Wallet className="text-blue-600" />}
                title="1.5% Unlimited Cashback"
                description="The highest cashback in the industry on every physical and virtual card transaction."
              />
              <FeatureItem 
                icon={<ShieldCheck className="text-blue-600" />}
                title="Advanced Controls"
                description="Set individual merchant blocks, daily limits, and auto-locking cards."
              />
              <FeatureItem 
                icon={<ArrowUpRight className="text-blue-600" />}
                title="ERP Integration"
                description="Sync transactions instantly with NetSuite, Xero, and QuickBooks."
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t container mx-auto px-4 text-center text-slate-500 text-sm">
        © 2026 Spendin ltd. All rights reserved.
      </footer>
    </div>
  );
}

function FeatureItem({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardHeader className="px-0">
        <div className="mb-4 h-12 w-12 rounded-lg bg-white shadow-sm flex items-center justify-center border border-slate-100">
          {icon}
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        <p className="text-slate-600 leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  );
}