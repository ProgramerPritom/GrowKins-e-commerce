import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ArrowRight } from 'lucide-react';

export const EditorialBanner: React.FC = () => {
  const { setView } = useStore();

  return (
    <section className="py-12 sm:py-20 md:py-28 bg-[#FAF7F1] border-b border-[#E8E0D2]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-[24px] sm:rounded-[32px] overflow-hidden min-h-[380px] sm:min-h-[460px] flex items-center p-6 sm:p-14 bg-[#24221F] shadow-lg">
          
          {/* Background image */}
          <img
            src="https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=1600&q=85"
            alt="Warm modern playroom"
            className="absolute inset-0 w-full h-full object-cover opacity-45"
          />

          <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-black/90 via-black/70 sm:via-black/55 to-black/30 sm:to-transparent" />

          {/* Editorial Card Content */}
          <div className="relative z-10 max-w-lg text-left space-y-3 sm:space-y-4 text-white">
            <span className="text-[11px] font-bold tracking-widest uppercase text-[#F7E198]">
              Brand Philosophy
            </span>

            <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
              Less stuff.<br />
              Better play.
            </h2>

            <p className="text-base text-white/80 leading-relaxed">
              We believe a handful of beautifully balanced, open-ended pieces nurture deeper attention, longer creative focus, and peaceful living spaces for both children and grown-ups.
            </p>

            <div className="pt-2">
              <button
                onClick={() => setView('our-story')}
                className="px-6 py-3 rounded-full bg-white text-[#24221F] hover:bg-[#F7E198] text-xs font-bold transition-all flex items-center gap-2 active:scale-95 shadow-md"
              >
                <span>Read our story</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
