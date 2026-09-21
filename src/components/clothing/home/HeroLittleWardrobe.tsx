import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import type { ClothingHomepageCMS } from '../../../types/clothing';

interface HeroLittleWardrobeProps {
  content?: ClothingHomepageCMS['hero'];
  onNavigate: (path: string) => void;
}

export const HeroLittleWardrobe: React.FC<HeroLittleWardrobeProps> = ({
  content,
  onNavigate
}) => {
  const eyebrow = content?.eyebrow || 'THE LITTLE WARDROBE · SPRING / SUMMER';
  const headline = content?.headline || 'Tiny fits.\nBig personality.';
  const description =
    content?.description ||
    'Modern, photographic everyday pieces made for crawling, running, exploring and everything in between. Tailored in pure organic double-gauze and breathable natural fibers.';
  const desktopImage =
    content?.desktopImage ||
    'https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?q=80&w=1400&auto=format&fit=crop';
  const primaryCtaText = content?.primaryCtaText || 'Shop New In';
  const primaryCtaLink = content?.primaryCtaLink || '/clothing/new';
  const secondaryCtaText = content?.secondaryCtaText || 'Explore Baby (0–24M)';
  const secondaryCtaLink = content?.secondaryCtaLink || '/clothing/baby';

  return (
    <section className="relative overflow-hidden bg-[#F7F4EE] pt-6 pb-12 sm:pb-20 text-left">
      <div className="fashion-container">
        
        {/* Editorial Split / Asymmetrical Composition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Text Content (5 Cols) */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 space-y-5 lg:pr-4"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FCFAF7] border border-[#E8E2D5] text-[10px] uppercase font-bold tracking-widest text-[#C85A32] shadow-2xs">
              <Sparkles className="w-3 h-3" />
              <span>{eyebrow}</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl xl:text-6xl font-bold tracking-tight text-[#171715] leading-[1.08] whitespace-pre-line">
              {headline}
            </h1>

            <p className="text-xs sm:text-sm text-[#524E47] leading-relaxed max-w-md">
              {description}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onNavigate(primaryCtaLink)}
                className="px-6 py-3.5 rounded-xl bg-[#171715] hover:bg-[#C85A32] text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shadow-md cursor-pointer"
              >
                <span>{primaryCtaText}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate(secondaryCtaLink)}
                className="px-5 py-3.5 rounded-xl bg-[#FCFAF7] hover:bg-white text-[#171715] border border-[#E8E2D5] text-xs font-bold transition-all cursor-pointer shadow-2xs"
              >
                <span>{secondaryCtaText}</span>
              </button>
            </div>

            {/* Highlights */}
            <div className="pt-6 border-t border-[#E8E2D5] flex items-center gap-6 text-[11px] text-[#857E73] font-medium">
              <div>• 100% Organic Double-Gauze</div>
              <div>• Pre-Washed Softness</div>
              <div>• Doorstep Cash On Delivery</div>
            </div>
          </motion.div>

          {/* Editorial Visual Image (7 Cols) */}
          <motion.div
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 relative"
          >
            <div className="relative rounded-3xl overflow-hidden bg-[#FCFAF7] border border-[#E8E2D5] aspect-4/3 sm:aspect-16/10 shadow-lg">
              <img
                src={desktopImage}
                alt="The Little Wardrobe Editorial"
                className="w-full h-full object-cover"
              />

              {/* Editorial Floating Accent Pill */}
              <div className="absolute bottom-6 right-6 z-10 bg-[#171715]/85 backdrop-blur-md text-white p-4 rounded-2xl border border-white/15 max-w-xs shadow-xl hidden sm:block">
                <span className="text-[9px] uppercase font-bold tracking-widest text-[#EBD699] block mb-1">
                  Atelier Philosophy
                </span>
                <p className="text-xs text-[#FCFAF7] font-serif leading-snug">
                  "Clothes soft enough for slumber, durable enough for the garden."
                </p>
              </div>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
};
