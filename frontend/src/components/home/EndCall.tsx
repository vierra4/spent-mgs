import React from 'react';

const Features: React.FC = () => {
  return (
    <section className="bg-background-light dark:bg-background-dark py-20 px-4 transition-colors duration-300">
      {/* Custom Styles for Icons and Scrollbars */}
      <style dangerouslySetInnerHTML={{ __html: `
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Column: Speed & Security */}
        <div className="lg:col-span-3 flex flex-col gap-6 order-2 lg:order-1">
          <div className="bg-card-light dark:bg-card-dark rounded-3xl p-8 shadow-xl text-center transform transition-transform hover:-translate-y-1">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 relative group">
              <span className="material-symbols-outlined text-black dark:text-gray-900 text-3xl">speed</span>
              <div className="absolute -top-1 -right-1 bg-white dark:bg-slate-700 w-6 h-6 rounded-full flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-gray-400 text-xs">arrow_upward</span>
              </div>
            </div>
            <h3 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark mb-2">Speed</h3>
            <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm leading-relaxed">
              Immediate or same-day transfers
            </p>
          </div>

          <div className="bg-card-light dark:bg-card-dark rounded-3xl p-8 shadow-xl text-center transform transition-transform hover:-translate-y-1">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 relative">
              <span className="material-symbols-outlined text-black dark:text-gray-900 text-3xl">verified_user</span>
              <div className="absolute -top-1 -right-1 bg-white dark:bg-slate-700 w-6 h-6 rounded-full flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-gray-400 text-xs">key</span>
              </div>
            </div>
            <h3 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark mb-2">Security</h3>
            <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm leading-relaxed">
              Bank-level encryption & fraud protection
            </p>
          </div>
        </div>

        {/* Center Column: Interactive UI Mockup */}
        <div className="lg:col-span-6 order-1 lg:order-2 relative group">
          <div className="bg-primary rounded-[3rem] p-8 md:p-12 relative overflow-hidden min-h-[500px] flex items-center justify-center">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none"></div>
            
            <div className="relative w-full h-full flex items-center justify-center gap-4 perspective-1000">
              
              {/* Back Dark Card */}
              <div className="absolute md:relative left-4 md:left-auto md:translate-x-12 z-10 w-[240px] h-[480px] bg-[#0F1014] rounded-[2.5rem] border-[8px] border-[#1C1C1E] shadow-2xl transform -rotate-6 md:-rotate-12 transition-transform duration-500 hover:-rotate-0">
                <div className="h-full flex flex-col items-center justify-center text-white relative">
                  <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-white/5 to-transparent rounded-[2rem] pointer-events-none"></div>
                  <div className="flex flex-col items-center gap-4">
                    <svg className="w-16 h-16 text-primary" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 10C4 10 5.6 8 8 8C10.4 8 11.6 10 14 10C16.4 10 18 8 18 8" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"></path>
                      <path d="M4 14C4 14 5.6 12 8 12C10.4 12 11.6 14 14 14C16.4 14 18 12 18 12" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"></path>
                      <path d="M4 18C4 18 5.6 16 8 16C10.4 16 11.6 18 14 18C16.4 18 18 16 18 16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"></path>
                    </svg>
                    <h2 className="text-3xl font-bold tracking-widest uppercase">Spendin</h2>
                  </div>
                </div>
              </div>

              {/* Front Light Card (App UI) */}
              <div className="relative md:translate-x-0 z-20 w-[260px] h-[520px] bg-white rounded-[3rem] border-[8px] border-[#1C1C1E] shadow-2xl overflow-hidden transform translate-x-16 md:translate-x-0">
                <div className="absolute top-0 w-full flex justify-center pt-2 z-30">
                  <div className="bg-black w-24 h-6 rounded-full"></div>
                </div>
                
                <div className="pt-10 px-5 pb-6 h-full flex flex-col">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs text-gray-500 font-bold">JB</div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-gray-800">Jhon Barrel</span>
                        <span className="text-[10px] text-gray-400">Depart account</span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <div className="w-6 h-6 rounded-full bg-[#EBFD5F] flex items-center justify-center">
                        <span className="material-symbols-outlined text-xs text-black">grid_view</span>
                      </div>
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                        <span className="material-symbols-outlined text-xs text-black">notifications</span>
                      </div>
                    </div>
                  </div>

                  {/* Balance */}
                  <div className="mb-6">
                    <p className="text-xs text-gray-500 mb-1">Available balance</p>
                    <div className="flex items-end justify-between">
                      <div className="text-3xl font-bold text-gray-900">$8,949.12</div>
                    </div>
                    <div className="mt-2 inline-flex items-center gap-1 bg-pink-100 px-2 py-0.5 rounded-md">
                      <span className="text-[10px] text-pink-600 font-bold">-0.2% (13.29$)</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-4 gap-2 mb-6 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white shadow-lg">
                        <span className="material-symbols-outlined text-sm">arrow_upward</span>
                      </div>
                      <span className="text-[9px] font-medium text-gray-600">Transfer</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white shadow-lg">
                        <span className="material-symbols-outlined text-sm">arrow_downward</span>
                      </div>
                      <span className="text-[9px] font-medium text-gray-600">Receive</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white shadow-lg">
                        <span className="material-symbols-outlined text-sm">share</span>
                      </div>
                      <span className="text-[9px] font-medium text-gray-600">Share</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white shadow-lg">
                        <span className="material-symbols-outlined text-sm">qr_code_scanner</span>
                      </div>
                      <span className="text-[9px] font-medium text-gray-600">Scan QR</span>
                    </div>
                  </div>

                  {/* Contacts List */}
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="text-sm font-bold text-gray-800">IT department</h4>
                      <span className="text-[10px] text-purple-600 font-bold cursor-pointer">See All</span>
                    </div>
                    <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                      <div className="flex flex-col items-center min-w-[40px]">
                        <div className="w-10 h-10 rounded-full bg-[#F3EFE0] mb-1"></div>
                        <span className="text-[9px] text-gray-500">Daniel</span>
                      </div>
                      <div className="flex flex-col items-center min-w-[40px]">
                        <div className="w-10 h-10 rounded-full bg-gray-100 mb-1 flex items-center justify-center text-[8px] text-gray-400">USER</div>
                        <span className="text-[9px] text-gray-500">Ethan</span>
                      </div>
                      <div className="flex flex-col items-center min-w-[40px]">
                        <div className="w-10 h-10 rounded-full bg-gray-100 mb-1 flex items-center justify-center text-[8px] text-gray-400">IMG</div>
                        <span className="text-[9px] text-gray-500">Gabriel</span>
                      </div>
                      <div className="flex flex-col items-center min-w-[40px]">
                        <div className="w-10 h-10 rounded-full bg-[#F3EFE0] mb-1"></div>
                        <span className="text-[9px] text-gray-500">Henry</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Right Column: Transparency & Ease of use */}
        <div className="lg:col-span-3 flex flex-col gap-6 order-3">
          <div className="bg-card-light dark:bg-card-dark rounded-3xl p-8 shadow-xl text-center transform transition-transform hover:-translate-y-1">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 relative">
              <span className="material-symbols-outlined text-black dark:text-gray-900 text-3xl">visibility</span>
              <div className="absolute -top-1 -right-1 bg-white dark:bg-slate-700 w-6 h-6 rounded-full flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-gray-400 text-xs">visibility_off</span>
              </div>
            </div>
            <h3 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark mb-2">Transparency</h3>
            <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm leading-relaxed">
              No hidden fees or unpredictable charges
            </p>
          </div>

          <div className="bg-card-light dark:bg-card-dark rounded-3xl p-8 shadow-xl text-center transform transition-transform hover:-translate-y-1">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 relative">
              <span className="material-symbols-outlined text-black dark:text-gray-900 text-3xl">equalizer</span>
              <div className="absolute -top-1 -right-1 bg-white dark:bg-slate-700 w-6 h-6 rounded-full flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-gray-400 text-xs">person</span>
              </div>
            </div>
            <h3 className="text-xl font-bold text-text-primary-light dark:text-text-primary-dark mb-2">Ease of use</h3>
            <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm leading-relaxed">
              Simple, intuitive dashboard for non-technical users
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Features;