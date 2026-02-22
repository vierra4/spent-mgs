import React from 'react';
import { ArrowRight, LayoutGrid, FileText } from 'lucide-react';

const Integration: React.FC = () => {
  return (
    <section className="bg-background-light dark:bg-background-dark text-gray-900 dark:text-gray-100 min-h-screen flex items-center justify-center p-6 antialiased selection:bg-gray-200 dark:selection:bg-gray-700 relative overflow-hidden transition-colors duration-300">
      
      {/* Custom Styles for Scrollbars */}
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: rgba(255, 255, 255, 0.1);
            border-radius: 20px;
        }
      `}} />

      <main className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center z-10">
        
        {/* Left Side Content */}
        <div className="space-y-8 lg:pr-12 animate-fade-in-up">
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl leading-tight text-gray-900 dark:text-white">
            Sync to your <br /> <span className="italic">general ledger</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 font-light leading-relaxed max-w-lg">
            Categorize card and bank transactions on Spendin and sync to Quickbooks, Xero, and more.
          </p>
          <button className="group relative inline-flex items-center justify-center px-8 py-4 bg-primary text-white text-lg font-medium rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 dark:focus:ring-white dark:bg-white dark:text-gray-900">
            Start Syncing
            <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>

        {/* Right Side UI Mockup */}
        <div className="relative flex justify-center lg:justify-end py-10">
          <div className="absolute inset-0 bg-gradient-to-tr from-gray-200/50 to-green-100/50 dark:from-gray-800/50 dark:to-green-900/20 rounded-[3rem] transform rotate-3 scale-95 blur-2xl -z-10"></div>
          
          <div className="relative w-full max-w-md">
            
            {/* Background Faded Card */}
            <div className="absolute top-0 right-0 w-full transform -translate-y-24 scale-90 opacity-40 blur-[1px] pointer-events-none">
              <div className="bg-card-dark rounded-xl p-4 flex items-center justify-between shadow-lg border border-gray-700/30">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center"></div>
                  <div className="space-y-1">
                    <div className="h-2 w-24 bg-gray-500 rounded"></div>
                    <div className="h-2 w-16 bg-gray-600 rounded"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Front Interactive Card */}
            <div className="relative z-10 bg-card-dark rounded-xl p-4 shadow-xl border border-gray-700/50 mb-4 transform transition-transform hover:-translate-y-1 duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center overflow-hidden">
                    <div className="w-6 h-6 bg-gray-800 rounded-sm"></div>
                  </div>
                  <div className="text-left">
                    <h3 className="text-white font-medium text-sm">To VubaVuba</h3>
                    <p className="text-gray-400 text-xs">Instant Transfer</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-semibold text-sm">$55.50</p>
                  <p className="text-gray-500 text-xs">Visa</p>
                </div>
              </div>
            </div>

            {/* Middle Stacked Card */}
            <div className="relative z-0 bg-card-dark rounded-xl p-4 shadow-lg border border-gray-700/50 mb-4 opacity-90 scale-95 origin-top">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-accent-red flex items-center justify-center">
                    <LayoutGrid className="text-white w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-white font-medium text-sm">To Corp...</h3>
                    <p className="text-gray-400 text-xs">Corp...</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Back Stacked Card */}
            <div className="relative z-0 bg-card-dark rounded-xl p-4 shadow-lg border border-gray-700/50 mb-4 opacity-80 scale-90 origin-top -mt-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                    <span className="text-gray-800 font-bold text-xs">G</span>
                  </div>
                  <div className="text-left">
                    <h3 className="text-white font-medium text-sm">To G...</h3>
                    <p className="text-gray-400 text-xs">Cloud...</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Dropdown Menu Mockup */}
            <div className="absolute top-16 right-[-10px] sm:right-[-40px] w-72 bg-[#18181b] rounded-xl shadow-2xl border border-gray-800 z-30 overflow-hidden transform transition-all hover:scale-[1.02] duration-300">
              <div className="p-4 border-b border-gray-800 flex items-center space-x-3 text-left">
                <div className="w-8 h-8 rounded bg-green-600 flex items-center justify-center flex-shrink-0">
                  <FileText className="text-white w-4 h-4" />
                </div>
                <span className="text-white text-sm font-medium">Select QuickBooks Account</span>
              </div>
              <div className="p-2 space-y-1 text-left">
                <div className="group flex items-center justify-between px-3 py-2.5 bg-gray-800 rounded-lg cursor-pointer border border-gray-700">
                  <span className="text-white text-sm">Accrued Revenue</span>
                  <ArrowRight className="text-gray-400 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
                <div className="px-3 py-2.5 rounded-lg cursor-pointer hover:bg-gray-800 transition-colors">
                  <span className="text-gray-400 text-sm hover:text-white transition-colors">Prepaid Expenses</span>
                </div>
                <div className="px-3 py-2.5 rounded-lg cursor-pointer hover:bg-gray-800 transition-colors">
                  <span className="text-gray-400 text-sm hover:text-white transition-colors">Fixed Assets</span>
                </div>
                <div className="px-3 py-2.5 rounded-lg cursor-pointer hover:bg-gray-800 transition-colors">
                  <span className="text-gray-400 text-sm hover:text-white transition-colors">Column Unredeemed Reward</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Floating Background Glows */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-50 dark:bg-blue-900/10 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-gray-100 dark:bg-gray-800/10 rounded-full blur-3xl opacity-50"></div>
      </div>

    </section>
  );
};

export default Integration;