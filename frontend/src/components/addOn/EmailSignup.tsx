import React, { useState } from 'react';

const EmailSignup: React.FC = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // You can add your actual signup logic/API call here
    console.log("User signed up with:", email);
  };

  return (
    <section className="bg-black flex items-center justify-center py-24 p-6 w-full">
      <div className="w-full max-w-xl">
        <form className="relative" onSubmit={handleSubmit}>
          {/* Input Container */}
          <div className="flex items-center p-1.5 bg-[#121212] border border-white/10 rounded-full transition-all duration-300 focus-within:border-white/30">
            
            <div className="flex-1 flex items-center px-6">
              <input 
                className="w-full bg-transparent border-none focus:ring-0 text-white placeholder-gray-500 py-4 text-lg font-normal outline-none" 
                placeholder="What's your email?" 
                required 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <button 
              className="bg-white text-black font-bold px-8 py-3.5 rounded-full hover:opacity-90 active:scale-[0.98] transition-all text-base" 
              type="submit"
            >
              Start for Free
            </button>
            
          </div>
        </form>
      </div>
    </section>
  );
};

export default EmailSignup;