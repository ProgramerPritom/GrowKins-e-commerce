import React from 'react';
import type { ApparelProduct } from '../../../types/clothing';
import { ClothingProductCard } from '../catalog/ClothingProductCard';
import { ArrowRight, Sparkles } from 'lucide-react';

interface NewDropGridProps {
  products: ApparelProduct[];
  onOpenProduct: (slug: string) => void;
  onNavigate: (path: string) => void;
  onOpenSizeGuide?: () => void;
}

export const NewDropGrid: React.FC<NewDropGridProps> = ({
  products,
  onOpenProduct,
  onNavigate,
  onOpenSizeGuide
}) => {
  const featuredDropProducts = products.slice(0, 4);

  return (
    <section className="py-12 sm:py-20 bg-[#FCFAF7] border-t border-[#E8E2D5] text-left">
      <div className="fashion-container">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-12">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-widest text-[#C85A32] mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Just Landed</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#171715]">
              New Drop · Spring / Summer
            </h2>
            <p className="text-xs sm:text-sm text-[#524E47] mt-1">
              Airy double-gauze silhouettes, sun-washed neutrals, and flexible first-step shoes.
            </p>
          </div>

          <button
            onClick={() => onNavigate('/clothing/new')}
            className="text-xs font-bold text-[#171715] hover:text-[#C85A32] flex items-center gap-1.5 transition-colors cursor-pointer group"
          >
            <span>Explore The Full Drop</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Magazine Asymmetrical Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
          
          {/* Large Campaign Feature (5 Cols) */}
          <div
            onClick={() => onNavigate('/clothing/new')}
            className="lg:col-span-5 group relative rounded-3xl overflow-hidden bg-[#F0ECE1] border border-[#E8E2D5] cursor-pointer min-h-[380px] lg:min-h-full flex flex-col justify-end p-6 sm:p-8 text-white shadow-sm"
          >
            <img
              src="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?q=80&w=1000&auto=format&fit=crop"
              alt="Spring Collection Campaign"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-104 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#171715]/85 via-[#171715]/30 to-transparent" />

            <div className="relative z-10 space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#EBD699]">
                Editorial Focus
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold leading-tight">
                Made for sunny garden explorations.
              </h3>
              <p className="text-xs text-[#E6DFD5] leading-relaxed max-w-sm">
                Breathable organic knits and featherweight double-gauze tops that soften with every single tumble wash.
              </p>
              <div className="pt-2 flex items-center gap-1.5 text-xs font-bold text-white group-hover:translate-x-1 transition-transform">
                <span>Shop Campaign Pieces</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Product Cards Grid (7 Cols) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {featuredDropProducts.map((p) => (
              <ClothingProductCard
                key={p.id}
                product={p}
                onOpenProduct={onOpenProduct}
                onOpenSizeGuide={onOpenSizeGuide}
              />
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};
