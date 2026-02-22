import React from 'react';

const Footer: React.FC = () => {
  return (
    <div className="bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark font-sans transition-colors duration-300">
      {/* Custom Styles for Animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        .floating-card {
            animation: float 6s ease-in-out infinite;
        }
        .floating-card-delayed {
            animation: float 6s ease-in-out 3s infinite;
        }
        @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-15px); }
            100% { transform: translateY(0px); }
        }
      `}} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen flex flex-col">
        {/* Ready to get started Section */}
        <section className="relative bg-green-gradient rounded-4xl overflow-hidden p-8 md:p-16 lg:p-24 flex flex-col items-center justify-center text-center min-h-[600px] shadow-lg mb-16 group">
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/30 rounded-full"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/30 rounded-full"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-white/30 rounded-full"></div>
          </div>

          {/* Floating UI Elements */}
          <div className="absolute top-12 right-8 md:right-20 w-64 bg-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-xl transform rotate-2 floating-card hidden lg:block">
            <div className="flex items-center -space-x-2 mb-3">
              <img alt="User 1" className="w-10 h-10 rounded-full border-2 border-white" src="https://api.dicebear.com/7.x/avataaars/svg?seed=1" />
              <img alt="User 2" className="w-10 h-10 rounded-full border-2 border-white" src="https://api.dicebear.com/7.x/avataaars/svg?seed=2" />
              <img alt="User 3" className="w-10 h-10 rounded-full border-2 border-white" src="https://api.dicebear.com/7.x/avataaars/svg?seed=3" />
            </div>
            <p className="text-sm font-medium text-gray-800 text-left">Share spendings</p>
            <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2">
              <div className="bg-primary h-1.5 rounded-full" style={{ width: '75%' }}></div>
            </div>
          </div>

          <div className="absolute top-48 right-4 md:right-12 bg-white/95 backdrop-blur-sm px-4 py-3 rounded-xl shadow-lg transform -rotate-2 floating-card-delayed hidden lg:flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">P</div>
            <div className="text-left">
              <p className="text-xs text-gray-500 font-semibold">Paypal</p>
              <p className="text-sm font-bold text-gray-900">Money transfer</p>
            </div>
          </div>

          <div className="absolute top-32 left-8 md:left-24 bg-white p-4 rounded-2xl shadow-xl transform -rotate-3 floating-card-delayed hidden lg:block w-48">
            <p className="text-[10px] text-gray-500 mb-2 text-left">Average spend in half a year</p>
            <div className="flex items-end justify-between h-16 gap-1">
              <div className="w-4 bg-purple-200 rounded-t-sm h-[40%]"></div>
              <div className="w-4 bg-purple-300 rounded-t-sm h-[60%]"></div>
              <div className="w-4 bg-purple-500 rounded-t-sm h-[30%]"></div>
              <div className="w-4 bg-purple-700 rounded-t-sm h-[80%]"></div>
              <div className="w-4 bg-purple-600 rounded-t-sm h-[50%]"></div>
            </div>
            <div className="flex justify-between mt-1 text-[8px] text-gray-400">
              <span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span>
            </div>
          </div>

          <div className="absolute bottom-24 left-4 md:left-16 bg-white p-3 rounded-xl shadow-lg transform rotate-6 floating-card hidden lg:block w-56 text-left">
            <div className="flex items-center gap-3 mb-3">
              <img alt="Jhon" className="w-10 h-10 rounded-full" src="https://api.dicebear.com/7.x/avataaars/svg?seed=4" />
              <div>
                <p className="text-sm font-bold text-gray-900">Jhon Barrel</p>
                <p className="text-xs text-gray-500">Personal account</p>
              </div>
            </div>
            <div className="flex justify-between items-center text-xs">
              <div className="flex items-center gap-1 text-green-600">
                <span className="material-symbols-outlined text-sm">arrow_outward</span>
                Transfer
              </div>
              <span className="font-bold text-blue-900 italic">VISA</span>
            </div>
          </div>

          <div className="relative z-10 max-w-2xl mx-auto">
            <div className="mx-auto w-16 h-16 bg-[#D9FF50] rounded-full flex items-center justify-center mb-6 shadow-inner border border-white/20">
              <svg fill="none" height="32" viewBox="0 0 24 24" width="32" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 12C4 12 7 8 12 8C17 8 20 12 20 12" stroke="#4A5D23" strokeLinecap="round" strokeWidth="2"></path>
                <path d="M4 16C4 16 7 12 12 12C17 12 20 16 20 16" stroke="#4A5D23" strokeLinecap="round" strokeWidth="2"></path>
                <path d="M4 8C4 8 7 4 12 4C17 4 20 8 20 8" stroke="#4A5D23" strokeLinecap="round" strokeWidth="2"></path>
              </svg>
            </div>
            <h1 className="font-display text-5xl md:text-7xl font-bold text-gray-900 tracking-tight leading-[1.1] mb-6">
              Ready to get <br /> started?
            </h1>
            <p className="text-gray-700 text-lg md:text-xl mb-10 max-w-lg mx-auto font-medium">
              Create a free account and make your first transfer today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gray-900 text-white px-8 py-3.5 rounded-full font-medium hover:bg-gray-800 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                Create account
              </button>
              <button className="bg-white/50 backdrop-blur-sm border border-gray-900/10 text-gray-900 px-8 py-3.5 rounded-full font-medium hover:bg-white transition">
                Learn more
              </button>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="flex flex-col md:flex-row justify-between items-start md:items-center py-12 mb-12 border-b border-gray-100 dark:border-gray-800">
          <h2 className="font-display text-4xl font-semibold mb-4 md:mb-0">Contact Us</h2>
          <a className="font-display text-2xl md:text-4xl font-medium hover:text-primary transition-colors" href="mailto:hello@Spendin.business">
            hello@Spendin.business
          </a>
        </section>

        {/* Footer Links & App Download */}
        <footer className="rounded-t-3xl bg-footer-gradient dark:bg-footer-gradient-dark pt-16 pb-8 px-4 sm:px-8 relative overflow-hidden text-left">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20 relative z-10">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
              <div>
                <h3 className="font-bold text-lg mb-6">About</h3>
                <ul className="space-y-4 text-sm text-text-secondary-light dark:text-text-secondary-dark">
                  <li><a className="hover:text-black dark:hover:text-white transition" href="#">About</a></li>
                  <li><a className="hover:text-black dark:hover:text-white transition" href="#">Careers</a></li>
                  <li><a className="hover:text-black dark:hover:text-white transition" href="#">Press</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-6">Product</h3>
                <ul className="space-y-4 text-sm text-text-secondary-light dark:text-text-secondary-dark">
                  <li><a className="hover:text-black dark:hover:text-white transition" href="#">Features</a></li>
                  <li><a className="hover:text-black dark:hover:text-white transition" href="#">Pricing</a></li>
                  <li><a className="hover:text-black dark:hover:text-white transition" href="#">API</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-6">Support</h3>
                <ul className="space-y-4 text-sm text-text-secondary-light dark:text-text-secondary-dark">
                  <li><a className="hover:text-black dark:hover:text-white transition" href="#">Help Center</a></li>
                  <li><a className="hover:text-black dark:hover:text-white transition" href="#">Security</a></li>
                  <li><a className="hover:text-black dark:hover:text-white transition" href="#">Contact Us</a></li>
                </ul>
              </div>
            </div>

            <div className="bg-card-light dark:bg-card-dark rounded-3xl p-8 flex flex-col sm:flex-row items-center justify-between shadow-xl border border-gray-100 dark:border-gray-700 relative overflow-hidden group hover:border-primary/50 transition duration-300">
              <div className="z-10 w-full sm:w-1/2 mb-8 sm:mb-0">
                <h3 className="font-display text-2xl font-bold mb-8 leading-tight">
                  Spendin available<br /> to download:
                </h3>
                <div className="flex gap-4">
                  <button className="flex flex-col items-center justify-center w-16 h-16 bg-black text-white rounded-full hover:bg-gray-800 transition">
                    <span className="material-symbols-outlined text-3xl">apple</span>
                    <span className="text-[10px] mt-1">iOS</span>
                  </button>
                  <button className="flex flex-col items-center justify-center w-16 h-16 bg-black text-white rounded-full hover:bg-gray-800 transition">
                    <span className="material-symbols-outlined text-3xl">play_arrow</span>
                    <span className="text-[10px] mt-1">Android</span>
                  </button>
                </div>
              </div>

              {/* Phone UI */}
              <div className="relative w-full sm:w-1/2 flex justify-center sm:justify-end">
                <div className="relative w-48 h-80 bg-black rounded-[2.5rem] p-2 border-[6px] border-gray-800 shadow-2xl transform rotate-2 group-hover:rotate-0 transition duration-500">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-24 bg-black rounded-b-xl z-20"></div>
                  <div className="bg-white h-full w-full rounded-[2rem] overflow-hidden flex flex-col relative">
                    <div className="h-8 flex justify-between items-center px-4 text-[10px] font-bold text-black pt-2">
                      <span>9:41</span>
                      <div className="flex gap-1">
                        <span className="material-symbols-outlined text-[10px]">signal_cellular_alt</span>
                        <span className="material-symbols-outlined text-[10px]">wifi</span>
                        <span className="material-symbols-outlined text-[10px]">battery_full</span>
                      </div>
                    </div>
                    <div className="px-4 py-2 flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm">chevron_left</span>
                      <span className="text-xs font-bold mx-auto">Transfer</span>
                      <span className="material-symbols-outlined text-sm">more_horiz</span>
                    </div>
                    <div className="p-4 flex flex-col items-center text-center">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-2">
                        <span className="text-xs font-bold">WG</span>
                      </div>
                      <p className="text-[10px] text-gray-500">From William Grace</p>
                      <p className="text-xl font-bold mb-4">€ 275.00</p>
                      <div className="w-full h-px bg-gray-100 my-2"></div>
                      <div className="w-full flex items-center gap-2 mt-2 text-left">
                        <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                          <span className="text-[10px] font-bold">AS</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-[10px] text-gray-500">To Anabel Smith</p>
                          <p className="text-sm font-bold">$ 324.50</p>
                        </div>
                      </div>
                      <div className="mt-8 w-full bg-gray-100 rounded-full p-1 flex items-center">
                        <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white">
                          <span className="material-symbols-outlined text-sm">chevron_right</span>
                        </div>
                        <span className="text-[8px] ml-2 text-gray-400">Swipe to confirm sending</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Footer Bar */}
          <div className="flex flex-col md:flex-row justify-between items-end gap-8 relative z-10 pt-8 border-t border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-black dark:bg-white rounded-full flex items-center justify-center overflow-hidden relative">
                <div className="absolute inset-0 flex flex-col justify-center items-center gap-1.5 opacity-90">
                  <div className="w-16 h-1 bg-white dark:bg-black rounded-full transform -rotate-12 translate-x-2"></div>
                  <div className="w-16 h-1 bg-white dark:bg-black rounded-full transform -rotate-12"></div>
                  <div className="w-16 h-1 bg-white dark:bg-black rounded-full transform -rotate-12 -translate-x-2"></div>
                  <div className="w-16 h-1 bg-white dark:bg-black rounded-full transform -rotate-12 translate-x-1"></div>
                </div>
              </div>
              <span className="font-display font-bold text-5xl md:text-7xl tracking-widest text-black dark:text-white uppercase">Spendin</span>
            </div>
            <div className="flex gap-6 text-xs text-text-secondary-light dark:text-text-secondary-dark mb-2">
              <a className="hover:text-black dark:hover:text-white transition" href="#">Privacy Policy</a>
              <a className="hover:text-black dark:hover:text-white transition" href="#">Terms of Service</a>
              <span>© 2025 Spendin</span>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-primary/30 to-transparent pointer-events-none filter blur-3xl"></div>
        </footer>
      </main>
    </div>
  );
};

export default Footer;