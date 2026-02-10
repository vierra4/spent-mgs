import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, LifeBuoy, ShieldAlert } from "lucide-react";
import { Link } from "react-router-dom"; 

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#FDFDFD] px-6 py-24 sm:py-32 lg:px-8 font-sans antialiased">
      {/* Background Decorative Element */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[50%] top-0 h-[640px] w-[640px] -translate-x-[50%] translate-y-[-30%] bg-blue-50/50 blur-3xl rounded-full" />
      </div>

      <div className="text-center">
        {/* Icon with fintech styling */}
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white border border-slate-200 shadow-sm">
          <ShieldAlert className="h-8 w-8 text-blue-600" />
        </div>

        <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">404 Error</p>
        
        <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
          Page not found
        </h1>
        
        <p className="mt-6 text-lg leading-7 text-slate-600 max-w-md mx-auto">
          The requested URL was not found on our servers. You may have typed the address incorrectly or the page has moved.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          {/* Main Action: Go to Home/Dashboard */}
          <Button 
            size="lg" 
            className="h-12 px-6 bg-slate-950 text-white hover:bg-slate-800 flex items-center gap-2 group"
            onClick={() => window.location.href = "/"}
          >
            <Home size={18} />
            Back to Home
          </Button>

          {/* Secondary Action: Support */}
          <Button 
            variant="outline" 
            size="lg" 
            className="h-12 px-6 flex items-center gap-2"
          >
            <LifeBuoy size={18} />
            Contact Support
          </Button>
        </div>
      </div>

      {/* Quick Links for Fintech UI */}
      <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 border-t pt-10 text-left max-w-2xl w-full">
        <div className="relative flex gap-x-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100">
            <ArrowLeft className="h-5 w-5 text-slate-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">System Status</h3>
            <p className="text-sm text-slate-500">Check if Forge services are operational.</p>
          </div>
        </div>
        <div className="relative flex gap-x-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100">
            <ShieldAlert className="h-5 w-5 text-slate-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Security</h3>
            <p className="text-sm text-slate-500">Report a potential security vulnerability.</p>
          </div>
        </div>
      </div>

      <footer className="mt-auto text-sm text-slate-400">
        © 2026 Forge Technologies Inc.
      </footer>
    </div>
  );
}