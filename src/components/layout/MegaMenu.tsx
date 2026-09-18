import React from 'react';
import { useStore } from '../../context/StoreContext';
import { STAGES } from '../../data/stages';
import { PRODUCTS } from '../../data/products';
import { ArrowRight, Sparkles } from 'lucide-react';
import type { AgeRange, Category } from '../../types';

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: 'shop' | 'age' | 'play' | 'gifts' | null;
}

export const MegaMenu: React.FC<MegaMenuProps> = ({ isOpen, onClose, activeTab }) => {
  const { setView, openProduct, setFilter } = useStore();

  if (!isOpen || !activeTab) return null;

  const handleSelectAge = (age: AgeRange) => {
    setFilter('age', [age]);
    setView('shop');
    onClose();
  };

  const handleSelectCategory = (cat: Category) => {
    setFilter('category', [cat]);
    setView('shop');
    onClose();
  };

  const featuredProduct = PRODUCTS[0];

  return (
    <div 
      onMouseLeave={onClose}
      className="absolute top-full left-0 w-full bg-[#FAF7F1] border-b border-[#E8E0D2] shadow-xl z-40 py-8 px-6 transition-all duration-200 animate-in fade-in slide-in-from-top-2"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-8">
        
        {/* By Age Column */}
        <div className="col-span-4 border-r border-[#E8E0D2] pr-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[11px] font-bold tracking-widest uppercase text-[#757169]">
              Growth Timeline
            </span>
            <span className="h-px flex-1 bg-[#E8E0D2]"></span>
          </div>
          <div className="space-y-2">
            {STAGES.map(stage => (
              <button
                key={stage.id}
                onClick={() => handleSelectAge(stage.id)}
                className="w-full text-left p-2.5 rounded-xl hover:bg-[#F4EFE6] transition-colors flex items-center justify-between group"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-[#24221F] group-hover:text-[#1C4CB8] transition-colors">
                      {stage.persona}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[#FAF7F1] border border-[#E8E0D2] text-[#757169] font-mono">
                      {stage.label}
                    </span>
                  </div>
                  <p className="text-xs text-[#757169] mt-0.5 line-clamp-1">
                    {stage.tagline}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-[#757169] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </button>
            ))}
          </div>
        </div>

        {/* Curated Categories */}
        <div className="col-span-5 pr-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[11px] font-bold tracking-widest uppercase text-[#757169]">
              Curated Play Categories
            </span>
            <span className="h-px flex-1 bg-[#E8E0D2]"></span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { name: 'Stacking toys' as Category, count: '4 finds', desc: 'Arches, animals, towers' },
              { name: 'Building sets' as Category, count: '3 finds', desc: 'Nordic architectural blocks' },
              { name: 'Art & Craft' as Category, count: '3 finds', desc: 'Beeswax blocks & folding easels' },
              { name: 'Sensory' as Category, count: '4 finds', desc: 'Quilted linen & maple rattles' },
              { name: 'Pretend play' as Category, count: '4 finds', desc: 'Miniature creatures & cameras' },
              { name: 'Open-ended play' as Category, count: '3 finds', desc: 'Balance boards & wobble curves' }
            ].map(cat => (
              <button
                key={cat.name}
                onClick={() => handleSelectCategory(cat.name)}
                className="text-left p-3 rounded-xl hover:bg-[#F4EFE6] transition-colors border border-transparent hover:border-[#E8E0D2] group"
              >
                <div className="font-medium text-sm text-[#24221F] group-hover:text-[#1C4CB8] transition-colors">
                  {cat.name}
                </div>
                <div className="text-xs text-[#757169] mt-0.5">
                  {cat.desc}
                </div>
              </button>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-[#E8E0D2] flex items-center justify-between">
            <button
              onClick={() => { setView('shop'); onClose(); }}
              className="text-xs font-semibold tracking-wide text-[#24221F] hover:text-[#1C4CB8] flex items-center gap-1.5 transition-colors"
            >
              Browse Complete Catalog <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs text-[#757169]">Cash on Delivery on all orders</span>
          </div>
        </div>

        {/* Highlighted Discovery Card */}
        <div className="col-span-3">
          <div className="bg-[#F4EFE6] rounded-2xl p-4 border border-[#E8E0D2]">
            <div className="flex items-center gap-1 text-[11px] font-bold tracking-wider text-[#A67E14] uppercase mb-2">
              <Sparkles className="w-3 h-3 text-[#F7E198]" />
              Signature Piece
            </div>
            <div 
              onClick={() => { openProduct(featuredProduct.id); onClose(); }}
              className="cursor-pointer group"
            >
              <div className="aspect-[4/3] rounded-xl overflow-hidden mb-3 relative">
                <img 
                  src={featuredProduct.images.main} 
                  alt={featuredProduct.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2 left-2 bg-[#F7E198] text-[#24221F] text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {featuredProduct.tag}
                </span>
              </div>
              <h4 className="font-serif font-bold text-sm text-[#24221F] group-hover:text-[#1C4CB8] transition-colors">
                {featuredProduct.name}
              </h4>
              <p className="text-xs text-[#757169] mt-1 line-clamp-2">
                {featuredProduct.valueStatement}
              </p>
              <div className="mt-2 flex items-center justify-between">
                <span className="font-semibold text-sm text-[#24221F]">৳{featuredProduct.price}</span>
                <span className="text-xs text-[#1C4CB8] font-medium flex items-center gap-0.5">
                  View piece <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
