import React from 'react';
import { useStore } from '../../context/StoreContext';
import { PERSONALITIES } from '../../data/personalities';
import { ArrowRight, Sparkles } from 'lucide-react';

export const PersonalityGrid: React.FC = () => {
  const { setView, setFilter } = useStore();

  const handleSelectPersonality = (personality: typeof PERSONALITIES[0]) => {
    setFilter('category', [personality.recommendedCategory]);
    setView('shop');
  };

  return (
    <section className="py-20 md:py-28 bg-[#FAF7F1] border-b border-[#E8E0D2]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div className="space-y-2">
            <div className="text-[11px] font-bold tracking-widest uppercase text-[#757169] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#A67E14]" />
              <span>Shop by Little Personality</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#24221F]">
              What makes them light up?
            </h2>
          </div>
          <button
            onClick={() => setView('shop')}
            className="text-xs font-semibold text-[#1C4CB8] hover:text-[#123788] flex items-center gap-1 transition-colors self-start sm:self-auto"
          >
            <span>See all personalities</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 6 Personality Cards Grid / Mobile Horizontal Scroll */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 overflow-x-auto pb-4 no-scrollbar">
          {PERSONALITIES.map((item) => (
            <div
              key={item.id}
              onClick={() => handleSelectPersonality(item)}
              className="group cursor-pointer flex flex-col justify-between rounded-[24px] overflow-hidden bg-white border border-[#E8E0D2] shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 min-w-[220px] sm:min-w-0"
            >
              {/* Image with subtle overlay */}
              <div className="aspect-[4/5] relative overflow-hidden bg-[#FAF7F1]">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                />
                
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                {/* Card Title on Image */}
                <div className="absolute bottom-3 left-3 right-3 text-left">
                  <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/90 text-[#24221F] mb-1">
                    {item.badge}
                  </span>
                  <h3 className="font-serif text-base sm:text-lg font-bold text-white leading-snug">
                    {item.title}
                  </h3>
                </div>
              </div>

              {/* Card Footer Detail */}
              <div className="p-3.5 flex items-center justify-between bg-white text-left">
                <span className="text-[11px] text-[#757169] line-clamp-1 font-medium">
                  {item.subtitle}
                </span>
                <div className="w-7 h-7 rounded-full bg-[#FAF7F1] group-hover:bg-[#1C4CB8] group-hover:text-white flex items-center justify-center text-[#24221F] transition-colors shrink-0 ml-1">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
