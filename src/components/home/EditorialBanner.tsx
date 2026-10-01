import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { ArrowRight } from 'lucide-react';
import { contentService } from '../../services';
import type { HomepageCMS } from '../../types/admin';

export const EditorialBanner: React.FC = () => {
  const { setView } = useStore();
  const [cms, setCms] = useState<HomepageCMS | null>(null);

  const loadCms = async () => {
    try {
      const res = await contentService.getHomepage();
      if (res?.data) setCms(res.data);
    } catch (e) {
      console.warn(e);
    }
  };

  useEffect(() => {
    loadCms();
    const handleUpdate = (e: Event) => {
      const ce = e as CustomEvent;
      if (ce.detail?.type === 'homepage' && ce.detail?.data) setCms(ce.detail.data);
      else loadCms();
    };
    window.addEventListener('growkins:content-updated', handleUpdate);
    return () => window.removeEventListener('growkins:content-updated', handleUpdate);
  }, []);

  const isEnabled = cms?.editorialBanner?.enabled ?? true;
  if (!isEnabled) return null;

  const heading = cms?.editorialBanner?.heading || 'The Art of Peaceful Playrooms';
  const subheading =
    cms?.editorialBanner?.subheading ||
    'We believe a handful of beautifully balanced, open-ended pieces nurture deeper attention, longer creative focus, and peaceful living spaces for both children and grown-ups.';
  const buttonText = cms?.editorialBanner?.buttonText || 'Read our story';

  return (
    <section className="py-12 sm:py-20 md:py-28 bg-[#FAF7F1] border-b border-[#E8E0D2]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-[24px] sm:rounded-[32px] overflow-hidden min-h-[380px] sm:min-h-[460px] flex items-center p-6 sm:p-14 bg-[#24221F] shadow-lg">
          
          {/* Background image */}
          <img
            src="https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=1600&q=85"
            alt="Warm modern playroom"
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover opacity-45"
          />

          <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-black/90 via-black/70 sm:via-black/55 to-black/30 sm:to-transparent" />

          {/* Editorial Card Content */}
          <div className="relative z-10 max-w-lg text-left space-y-3 sm:space-y-4 text-white">
            <span className="text-[11px] font-bold tracking-widest uppercase text-[#F7E198]">
              Brand Philosophy
            </span>

            <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
              {heading}
            </h2>

            <p className="text-base text-white/80 leading-relaxed">
              {subheading}
            </p>

            <div className="pt-2">
              <button
                onClick={() => setView('our-story')}
                className="px-6 py-3 rounded-full bg-white text-[#24221F] hover:bg-[#F7E198] text-xs font-bold transition-all flex items-center gap-2 active:scale-95 shadow-md cursor-pointer"
              >
                <span>{buttonText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
