import React from 'react';
import { MessageSquare, Sun } from 'lucide-react';
const testimonials = [
  {
    name: "Hikmet Atçeken",
    handle: "@hiatceken",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Hikmet",
    text: "Spendin's our daily tool to bypass averages and reveal true insights, for the whole team!",
    animate: true
  },
  {
    name: "Arda Guler",
    handle: "@ardaguler_",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Arda",
    text: "Spendin levels the analytics field for our team, enabling both beginners and pros to easily bypass average data and uncover the actionable insights that truly shape our marketing strategies."
  },
  {
    name: "Maria Ancelotti",
    handle: "@maria_ancelotti",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
    text: "From novice to pro, Spendin helps our team uncover the extraordinary in our marketing data!"
  },
  {
    name: "Ragip Diler",
    handle: "@rgdiler",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ragip",
    text: "Spendin empowers our whole team, techies or not, to dive into marketing analytics and spot the insights that really matter—no more average data!"
  },
  {
    name: "Jenny Wilson",
    handle: "@wilson_jenny_19",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jenny",
    text: "Spendin's user-friendly analytics let our whole team, regardless of skill, bypass averages to unearth and act on true, game-changing marketing insights every day."
  },
  {
    name: "Guy Hawkins",
    handle: "@ghawkins",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Guy",
    text: "Spendin is a game-changer for our team—easy for beginners and powerful for digging beyond average data. It's our daily ally in unearthing those pivotal marketing insights that really drive strategy!"
  }
];

const Testimonials: React.FC = () => {
  return (
    <section className="bg-background-light dark:bg-background-dark py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-300">
      {/* Spendin-style background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-96 bg-primary/10 dark:bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>

      {/* CSS Masonry Logic */}
      <style dangerouslySetInnerHTML={{ __html: `
        .masonry-grid {
            column-count: 1;
            column-gap: 1.5rem;
        }
        @media (min-width: 768px) {
            .masonry-grid { column-count: 2; }
        }
        @media (min-width: 1024px) {
            .masonry-grid { column-count: 3; }
        }
        .masonry-item {
            break-inside: avoid;
            margin-bottom: 1.5rem;
        }
      `}} />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-card-dark border border-gray-200 dark:border-gray-700 shadow-sm backdrop-blur-sm">
            <span className="material-icons-outlined text-sm text-gray-900 dark:text-white"><MessageSquare color="black" size={24} /></span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">Testimonials</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white tracking-tight">
            Public Cheers for <span className="text-gray-400 dark:text-white/40">Us!</span>
          </h2>
          <p className="text-lg text-text-secondary-light dark:text-text-secondary-dark max-w-2xl mx-auto">
            Find out how our users are spreading the word!
          </p>
        </div>

        <div className="masonry-grid">
          {testimonials.map((item, index) => (
            <div key={index} className="masonry-item">
              <div className="bg-card-light dark:bg-card-dark rounded-3xl p-8 shadow-sm hover:shadow-md border border-gray-100 dark:border-gray-800 transition-all duration-300 group">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-3">
                    <img 
                      alt={`Portrait of ${item.name}`} 
                      className="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-gray-700" 
                      src={item.image}
                    />
                    <div className="text-left">
                      <h3 className="font-bold text-gray-900 dark:text-white leading-tight">{item.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{item.handle}</p>
                    </div>
                  </div>
                  <span className={`material-icons-outlined text-[#FF7A59] text-2xl ${item.animate ? 'animate-pulse' : ''}`}>
                    <Sun/>
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-left">
                  {item.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;