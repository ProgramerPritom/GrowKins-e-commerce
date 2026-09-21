import React from 'react';
import type { ApparelProduct } from '../../../types/clothing';
import { Sparkles, Feather, WashingMachine, RefreshCw, Wind } from 'lucide-react';
import { ClothingProductCard } from '../catalog/ClothingProductCard';

interface EverydayEssentialsProps {
  products: ApparelProduct[];
  onOpenProduct: (slug: string) => void;
  onNavigate?: (path: string) => void;
}

export const EverydayEssentials: React.FC<EverydayEssentialsProps> = ({
  products,
  onOpenProduct
}) => {
  const essentials = products.slice(1, 5);

  const attributes = [
    {
      icon: Feather,
      title: 'Cloud-Soft Touch',
      desc: 'Enzyme pre-washed double-gauze and combed long-staple cottons that will never scratch tender newborn skin.'
    },
    {
      icon: RefreshCw,
      title: 'Lightning-Fast Changes',
      desc: 'Concealed shoulder snaps and nickel-free inseam poppers make diaper checks effortless without tears.'
    },
    {
      icon: WashingMachine,
      title: 'Real-Life Machine Washable',
      desc: 'Tested to retain shape, color, and seam integrity across dozens of gentle home laundry cycles.'
    },
    {
      icon: Wind,
      title: 'Breathable Thermo-Balance',
      desc: 'Open-weave organic cottons and fine merino blends naturally circulate air through humid Bangladesh days.'
    }
  ];

  return (
    <section className="py-14 sm:py-24 bg-[#F7F4EE] border-t border-[#E8E2D5] text-left">
      <div className="fashion-container">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E8E2D5] text-[10px] uppercase font-bold tracking-widest text-[#C85A32]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Everyday Wearability</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#171715]">
            Made For Everyday Adventures
          </h2>
          <p className="text-xs sm:text-sm text-[#524E47] leading-relaxed">
            Beautiful enough for photographs, durable enough for floor rolls, juice spills, and afternoon naps.
          </p>
        </div>

        {/* 4 Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-16">
          {attributes.map((attr, idx) => {
            const Icon = attr.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-5 border border-[#E8E2D5] shadow-2xs space-y-2.5"
              >
                <div className="w-10 h-10 rounded-xl bg-[#FAF3EE] text-[#C85A32] flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-sm font-bold text-[#171715]">
                  {attr.title}
                </h3>
                <p className="text-[11px] text-[#787267] leading-relaxed">
                  {attr.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Essentials Product Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          {essentials.map((prod) => (
            <ClothingProductCard
              key={prod.id}
              product={prod}
              onOpenProduct={onOpenProduct}
            />
          ))}
        </div>

      </div>
    </section>
  );
};
