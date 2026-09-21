import React, { useState } from 'react';
import type { ApparelProduct } from '../../../types/clothing';
import { useStore } from '../../../context/StoreContext';
import { Sparkles, ShoppingBag } from 'lucide-react';

interface OutfitBuilderProps {
  products: ApparelProduct[];
}

export const OutfitBuilder: React.FC<OutfitBuilderProps> = ({ products }) => {
  const { addToCart } = useStore();

  const tops = products.filter((p) => p.productType === 'shirt' || p.productType === 'tshirt' || p.categoryIds.includes('tops'));
  const bottoms = products.filter((p) => p.productType === 'pants' || p.productType === 'shorts' || p.categoryIds.includes('bottoms'));
  const shoes = products.filter((p) => p.productType === 'shoe' || p.categoryIds.includes('shoes'));

  const [selectedTopId, setSelectedTopId] = useState<string>(tops[0]?.id || '');
  const [selectedBottomId, setSelectedBottomId] = useState<string>(bottoms[0]?.id || '');
  const [selectedShoeId, setSelectedShoeId] = useState<string>(shoes[0]?.id || '');

  const selectedTop = tops.find((p) => p.id === selectedTopId) || tops[0];
  const selectedBottom = bottoms.find((p) => p.id === selectedBottomId) || bottoms[0];
  const selectedShoe = shoes.find((p) => p.id === selectedShoeId) || shoes[0];

  const totalPrice =
    (selectedTop ? selectedTop.price : 0) +
    (selectedBottom ? selectedBottom.price : 0) +
    (selectedShoe ? selectedShoe.price : 0);

  const handleAddLookToBag = () => {
    const itemsToAdd = [selectedTop, selectedBottom, selectedShoe].filter(Boolean);
    itemsToAdd.forEach((item) => {
      const firstVar = item.variants.find((v) => v.inventoryQuantity > 0) || item.variants[0];
      if (firstVar) {
        addToCart(item, 1, firstVar);
      }
    });
  };

  return (
    <section id="builder" className="py-14 sm:py-24 bg-[#FCFAF7] border-t border-[#E8E2D5] text-left">
      <div className="fashion-container">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-10 sm:mb-14 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF3EE] border border-[#C85A32]/20 text-[10px] uppercase font-bold tracking-widest text-[#C85A32]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Styling Tool</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#171715]">
            Build A Little Look
          </h2>
          <p className="text-xs sm:text-sm text-[#524E47]">
            Select one top, one bottom, and a pair of first-step shoes to compose their personalized outfit.
          </p>
        </div>

        {/* 3 Step Selectors + Live Composition Tray */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: 3 Category Pickers (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* 1. Pick Top */}
            <div className="bg-white border border-[#E8E2D5] rounded-2xl p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#171715] uppercase tracking-wider text-[11px]">
                  1. Choose Top or Shirt
                </span>
                <span className="text-[#857E73]">{selectedTop?.name}</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {tops.map((top) => {
                  const isSelected = selectedTop?.id === top.id;
                  return (
                    <div
                      key={top.id}
                      onClick={() => setSelectedTopId(top.id)}
                      className={`p-2 rounded-xl border-2 transition-all cursor-pointer flex items-center gap-2.5 ${
                        isSelected ? 'border-[#C85A32] bg-[#FAF3EE]' : 'border-[#E8E2D5] hover:border-[#D5CDBD] bg-[#FCFAF7]'
                      }`}
                    >
                      <img
                        src={top.images[0]?.url}
                        alt={top.name}
                        className="w-12 h-12 rounded-lg object-cover bg-white shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-[#171715] truncate">{top.name}</div>
                        <div className="text-[10px] text-[#857E73]">৳{top.price}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. Pick Bottom */}
            <div className="bg-white border border-[#E8E2D5] rounded-2xl p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#171715] uppercase tracking-wider text-[11px]">
                  2. Choose Pants or Shorts
                </span>
                <span className="text-[#857E73]">{selectedBottom?.name}</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {bottoms.map((bottom) => {
                  const isSelected = selectedBottom?.id === bottom.id;
                  return (
                    <div
                      key={bottom.id}
                      onClick={() => setSelectedBottomId(bottom.id)}
                      className={`p-2 rounded-xl border-2 transition-all cursor-pointer flex items-center gap-2.5 ${
                        isSelected ? 'border-[#C85A32] bg-[#FAF3EE]' : 'border-[#E8E2D5] hover:border-[#D5CDBD] bg-[#FCFAF7]'
                      }`}
                    >
                      <img
                        src={bottom.images[0]?.url}
                        alt={bottom.name}
                        className="w-12 h-12 rounded-lg object-cover bg-white shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-[#171715] truncate">{bottom.name}</div>
                        <div className="text-[10px] text-[#857E73]">৳{bottom.price}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3. Pick Shoes */}
            <div className="bg-white border border-[#E8E2D5] rounded-2xl p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#171715] uppercase tracking-wider text-[11px]">
                  3. Choose First-Step Shoes
                </span>
                <span className="text-[#857E73]">{selectedShoe?.name}</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {shoes.map((shoe) => {
                  const isSelected = selectedShoe?.id === shoe.id;
                  return (
                    <div
                      key={shoe.id}
                      onClick={() => setSelectedShoeId(shoe.id)}
                      className={`p-2 rounded-xl border-2 transition-all cursor-pointer flex items-center gap-2.5 ${
                        isSelected ? 'border-[#C85A32] bg-[#FAF3EE]' : 'border-[#E8E2D5] hover:border-[#D5CDBD] bg-[#FCFAF7]'
                      }`}
                    >
                      <img
                        src={shoe.images[0]?.url}
                        alt={shoe.name}
                        className="w-12 h-12 rounded-lg object-cover bg-white shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-[#171715] truncate">{shoe.name}</div>
                        <div className="text-[10px] text-[#857E73]">৳{shoe.price}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right Column: Visual Result Card & Total (4 Cols) */}
          <div className="lg:col-span-4 bg-[#171715] text-white rounded-3xl p-6 sm:p-7 shadow-xl space-y-5 lg:sticky lg:top-28">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#EBD699] block mb-1">
                Outfit Composition
              </span>
              <h3 className="font-serif text-xl font-bold">
                Your Little Look
              </h3>
            </div>

            {/* 3 Visual Items stacked neatly */}
            <div className="space-y-3 divide-y divide-white/10">
              {selectedTop && (
                <div className="flex items-center gap-3 pt-2">
                  <img src={selectedTop.images[0]?.url} alt={selectedTop.name} className="w-12 h-12 rounded-xl object-cover bg-white/10 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold truncate">{selectedTop.name}</div>
                    <div className="text-[11px] text-[#C5BFB5]">৳{selectedTop.price}</div>
                  </div>
                </div>
              )}
              {selectedBottom && (
                <div className="flex items-center gap-3 pt-3">
                  <img src={selectedBottom.images[0]?.url} alt={selectedBottom.name} className="w-12 h-12 rounded-xl object-cover bg-white/10 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold truncate">{selectedBottom.name}</div>
                    <div className="text-[11px] text-[#C5BFB5]">৳{selectedBottom.price}</div>
                  </div>
                </div>
              )}
              {selectedShoe && (
                <div className="flex items-center gap-3 pt-3">
                  <img src={selectedShoe.images[0]?.url} alt={selectedShoe.name} className="w-12 h-12 rounded-xl object-cover bg-white/10 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold truncate">{selectedShoe.name}</div>
                    <div className="text-[11px] text-[#C5BFB5]">৳{selectedShoe.price}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Total Price & Add to Bag CTA */}
            <div className="pt-4 border-t border-white/15 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#C5BFB5]">Total Look Price:</span>
                <span className="font-bold text-xl font-sans text-white">৳{totalPrice.toLocaleString()}</span>
              </div>

              <button
                onClick={handleAddLookToBag}
                className="w-full py-3.5 rounded-xl bg-[#C85A32] hover:bg-[#B24E2A] text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-lg cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add Complete Look To Bag</span>
              </button>

              <p className="text-[10px] text-[#A69E91] text-center">
                Added directly into your shared GrowKins bag with Cash on Delivery.
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
