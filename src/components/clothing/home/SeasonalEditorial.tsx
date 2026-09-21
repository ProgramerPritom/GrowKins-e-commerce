import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import type { ClothingHomepageCMS } from '../../../types/clothing';

interface SeasonalEditorialProps {
  content?: ClothingHomepageCMS['seasonalEditorial'];
  onNavigate: (path: string) => void;
}

export const SeasonalEditorial: React.FC<SeasonalEditorialProps> = ({
  content,
  onNavigate
}) => {
  const title = content?.title || 'Summer Little Things';
  const subtitle =
    content?.subtitle ||
    'From rooftop breezes to barefoot lawn discoveries. Our lightweight summer edit is made for easy laundry cycles and non-stop sunny curiosity.';
  const image =
    content?.image ||
    'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?q=80&w=1400&auto=format&fit=crop';
  const link = content?.link || '/clothing/collections/summer-edit';
  const ctaText = content?.ctaText || 'Discover The Summer Edit';

  return (
    <section className="py-12 sm:py-20 bg-[#F7F4EE] border-t border-[#E8E2D5] text-left">
      <div className="fashion-container">
        <div className="relative rounded-3xl overflow-hidden bg-[#171715] text-white border border-[#E8E2D5] aspect-16/10 sm:aspect-21/9 shadow-xl">
          <img
            src={image}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover opacity-65"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#171715]/90 via-[#171715]/60 to-transparent" />

          <div className="relative z-10 h-full flex flex-col justify-center p-6 sm:p-12 lg:p-16 max-w-xl space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-[10px] uppercase font-bold tracking-widest text-[#EBD699] w-fit">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Seasonal Editorial</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
              {title}
            </h2>

            <p className="text-xs sm:text-sm text-[#E6DFD5] leading-relaxed">
              {subtitle}
            </p>

            <div className="pt-2">
              <button
                onClick={() => onNavigate(link)}
                className="px-6 py-3.5 rounded-xl bg-white text-[#171715] hover:bg-[#C85A32] hover:text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shadow-md cursor-pointer"
              >
                <span>{ctaText}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
