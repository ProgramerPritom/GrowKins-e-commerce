import React, { useState } from 'react';
import type { FashionLook, ApparelProduct } from '../../../types/clothing';
import { useStore } from '../../../context/StoreContext';
import { Sparkles, ShoppingBag, ArrowRight } from 'lucide-react';

interface ShopTheLookSectionProps {
  look: FashionLook;
  products: ApparelProduct[];
  onOpenProduct?: (slug: string) => void;
  onNavigate: (path: string) => void;
}

export const ShopTheLookSection: React.FC<ShopTheLookSectionProps> = ({
  look,
  products,
  onNavigate
}) => {
  const { addToCart } = useStore();
  const [activeHotspotId, setActiveHotspotId] = useState<string | null>(look.hotspots[0]?.id || null);

  // Find product matching active hotspot
  const activeHotspot = look.hotspots.find((h) => h.id === activeHotspotId);
  const activeProduct = products.find((p) => p.id === activeHotspot?.productId);

  // All outfit products
  const outfitProducts = products.filter((p) => look.productIds.includes(p.id));
  const outfitTotal = outfitProducts.reduce((sum, p) => sum + p.price, 0);

  const handleAddFullLookToBag = () => {
    outfitProducts.forEach((prod) => {
      const firstAvailableVar = prod.variants.find((v) => v.inventoryQuantity > 0) || prod.variants[0];
      if (firstAvailableVar) {
        addToCart(prod, 1, firstAvailableVar);
      }
    });
  };

  const handleAddSingleItem = (prod: ApparelProduct) => {
    const firstAvailableVar = prod.variants.find((v) => v.inventoryQuantity > 0) || prod.variants[0];
    if (firstAvailableVar) {
      addToCart(prod, 1, firstAvailableVar);
    }
  };

  return (
    <section className="py-14 sm:py-24 bg-[#F7F4EE] border-t border-[#E8E2D5] text-left">
      <div className="fashion-container">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-12">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-widest text-[#C85A32] mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Interactive Editorial</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#171715]">
              Shop The Complete Look
            </h2>
            <p className="text-xs sm:text-sm text-[#524E47] mt-1">
              Click on any hotspot pin to explore individual garments, or bundle the entire curated outfit.
            </p>
          </div>

          <button
            onClick={() => onNavigate('/clothing/lookbook')}
            className="text-xs font-bold text-[#171715] hover:text-[#C85A32] flex items-center gap-1.5 transition-colors cursor-pointer group"
          >
            <span>Explore All Looks</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Interactive Look Component */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white border border-[#E8E2D5] rounded-3xl p-4 sm:p-8 shadow-sm">
          
          {/* Visual Model Canvas with Hotspots (7 Cols) */}
          <div className="lg:col-span-7 relative rounded-2xl overflow-hidden bg-[#F5F2EA] border border-[#E8E2D5] aspect-4/5 sm:aspect-16/11 shadow-2xs">
            <img
              src={look.image}
              alt={look.title}
              className="w-full h-full object-cover"
            />

            {/* Interactive Hotspots Overlay */}
            {look.hotspots.map((spot) => {
              const isActive = activeHotspotId === spot.id;
              const spotProduct = products.find((p) => p.id === spot.productId);

              return (
                <div
                  key={spot.id}
                  style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
                >
                  <button
                    onClick={() => setActiveHotspotId(isActive ? null : spot.id)}
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center cursor-pointer transition-all shadow-lg ${
                      isActive
                        ? 'bg-[#C85A32] text-white ring-4 ring-[#C85A32]/30 scale-110'
                        : 'bg-white/95 text-[#171715] hover:bg-[#C85A32] hover:text-white hotspot-pin'
                    }`}
                    title={spotProduct?.name || 'Explore piece'}
                  >
                    <span className="w-2 h-2 rounded-full bg-current" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Look Details & Outfit Bundler (5 Cols) */}
          <div className="lg:col-span-5 space-y-6 lg:pl-4">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#857E73]">
                Atelier Styling
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#171715]">
                {look.title}
              </h3>
              {look.subtitle && (
                <p className="text-xs text-[#524E47] mt-1 leading-relaxed">
                  {look.subtitle}
                </p>
              )}
            </div>

            {/* Outfit Products Stack */}
            <div className="space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#171715] block">
                Pieces In This Look:
              </span>

              <div className="divide-y divide-[#F2ECE1] rounded-2xl border border-[#E8E2D5] bg-[#FCFAF7] p-2">
                {outfitProducts.map((item) => {
                  const isHighlighted = activeProduct?.id === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        const spot = look.hotspots.find((h) => h.productId === item.id);
                        if (spot) setActiveHotspotId(spot.id);
                      }}
                      className={`p-3 rounded-xl flex items-center justify-between gap-3 transition-colors cursor-pointer ${
                        isHighlighted ? 'bg-[#FAF3EE] border border-[#C85A32]/30' : 'hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={item.images[0]?.url}
                          alt={item.name}
                          className="w-12 h-12 rounded-lg object-cover bg-[#F5F2EA] border border-[#E8E2D5] shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="font-serif font-bold text-xs text-[#171715] truncate">
                            {item.name}
                          </div>
                          <div className="text-[10px] text-[#857E73]">{item.ageLabel}</div>
                        </div>
                      </div>

                      <div className="text-right shrink-0 flex items-center gap-2">
                        <span className="font-bold text-xs text-[#171715] font-sans">
                          ৳{item.price}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddSingleItem(item);
                          }}
                          className="p-1.5 rounded-lg bg-[#171715] text-white hover:bg-[#C85A32] transition-colors cursor-pointer"
                          title="Add piece to bag"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Shop Full Look Banner */}
            <div className="p-4 rounded-2xl bg-[#171715] text-white space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold uppercase tracking-wider text-[#EBD699]">
                  Bundle Full 3-Piece Look
                </span>
                <span className="font-bold font-sans text-sm">৳{outfitTotal.toLocaleString()}</span>
              </div>
              <button
                onClick={handleAddFullLookToBag}
                className="w-full py-3 rounded-xl bg-[#C85A32] hover:bg-[#B24E2A] text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Shop The Full Look (Add All To Bag)</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
