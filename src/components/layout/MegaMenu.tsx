import React from 'react';
import { useStore } from '../../context/StoreContext';
import { STAGES } from '../../data/stages';
import { PRODUCTS } from '../../data/products';
import { ArrowRight, Sparkles, Gift, Layers, Compass, Heart, Baby, ShieldCheck, Truck } from 'lucide-react';
import type { AgeRange, Category } from '../../types';

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: 'shop' | 'age' | 'play' | 'gifts' | null;
}

export const MegaMenu: React.FC<MegaMenuProps> = ({ isOpen, onClose, activeTab }) => {
  const { setView, openProduct, setFilter, resetFilters, products } = useStore();

  if (!isOpen || !activeTab) return null;

  const sourceProducts = products && products.length > 0 ? products : PRODUCTS;
  const featuredProduct = sourceProducts[0] || PRODUCTS[0];

  const handleSelectAge = (age: AgeRange) => {
    resetFilters();
    setFilter('age', [age]);
    setView('shop');
    onClose();
  };

  const handleSelectCategory = (cat: Category) => {
    resetFilters();
    setFilter('category', [cat]);
    setView('shop');
    onClose();
  };

  const handleSelectOccasion = (occ: string) => {
    resetFilters();
    setFilter('occasion', [occ as any]);
    setView('shop');
    onClose();
  };

  return (
    <div 
      onMouseLeave={onClose}
      className="absolute top-full left-0 w-full bg-[#FAF7F1] border-b border-[#E8E0D2] shadow-2xl z-40 py-8 px-6 transition-all duration-200 animate-in fade-in slide-in-from-top-2"
    >
      <div className="max-w-7xl mx-auto">
        
        {/* TAB 1: SHOP DIRECTORY */}
        {activeTab === 'shop' && (
          <div className="grid grid-cols-12 gap-8 text-left">
            {/* Play Categories */}
            <div className="col-span-4 border-r border-[#E8E0D2] pr-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[11px] font-bold tracking-widest uppercase text-[#757169] flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#1C4CB8]" />
                  Toy Collections
                </span>
                <span className="h-px flex-1 bg-[#E8E0D2]"></span>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { name: 'Stacking toys' as Category, desc: 'Balance curves, arches, nesting forest animals' },
                  { name: 'Building sets' as Category, desc: 'Architectural columns, arches & smooth beech blocks' },
                  { name: 'Sensory' as Category, desc: 'Acoustic maple bell rattles & quilted leaf mats' },
                  { name: 'Art & Craft' as Category, desc: 'Pure beeswax blocks, studio easels & safe colorants' },
                  { name: 'Pretend play' as Category, desc: 'Pocket woodland friends, kaleidoscope cameras' },
                  { name: 'Open-ended play' as Category, desc: 'Molded wobble balance boards & flexible climbers' }
                ].map(cat => (
                  <button
                    key={cat.name}
                    onClick={() => handleSelectCategory(cat.name)}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-[#F4EFE6] transition-colors group flex items-center justify-between"
                  >
                    <div>
                      <span className="font-semibold text-xs sm:text-sm text-[#24221F] group-hover:text-[#1C4CB8] transition-colors">
                        {cat.name}
                      </span>
                      <p className="text-[11px] text-[#757169] line-clamp-1">{cat.desc}</p>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-[#757169] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all shrink-0" />
                  </button>
                ))}
              </div>
            </div>

            {/* Curated Highlights */}
            <div className="col-span-5 pr-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[11px] font-bold tracking-widest uppercase text-[#757169] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#A67E14]" />
                  Quick Filters & Highlights
                </span>
                <span className="h-px flex-1 bg-[#E8E0D2]"></span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => { resetFilters(); setView('shop'); onClose(); }}
                  className="p-4 rounded-2xl bg-white border border-[#E8E0D2] hover:border-[#1C4CB8] hover:shadow-xs transition-all text-left group"
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#1C4CB8] block">Catalog</span>
                  <div className="font-bold text-sm text-[#24221F] group-hover:text-[#1C4CB8] mt-1">All Discoveries</div>
                  <p className="text-[11px] text-[#757169] mt-0.5">Explore full range of Montessori pieces</p>
                </button>
                <button
                  onClick={() => { resetFilters(); setFilter('occasion', ['Everyday play']); setView('shop'); onClose(); }}
                  className="p-4 rounded-2xl bg-white border border-[#E8E0D2] hover:border-[#1C4CB8] hover:shadow-xs transition-all text-left group"
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#DDA428] block">Bestsellers</span>
                  <div className="font-bold text-sm text-[#24221F] group-hover:text-[#1C4CB8] mt-1">Most Loved Toys</div>
                  <p className="text-[11px] text-[#757169] mt-0.5">Top-rated by 1,000+ parents across BD</p>
                </button>
                <button
                  onClick={() => { resetFilters(); setFilter('occasion', ['Gift']); setView('shop'); onClose(); }}
                  className="p-4 rounded-2xl bg-white border border-[#E8E0D2] hover:border-[#1C4CB8] hover:shadow-xs transition-all text-left group"
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#F28F79] block">Gifting</span>
                  <div className="font-bold text-sm text-[#24221F] group-hover:text-[#1C4CB8] mt-1">Akika & Birthday</div>
                  <p className="text-[11px] text-[#757169] mt-0.5">Keepsake boxes with custom gift message</p>
                </button>
                <button
                  onClick={() => { resetFilters(); setFilter('material', ['FSC beechwood']); setView('shop'); onClose(); }}
                  className="p-4 rounded-2xl bg-white border border-[#E8E0D2] hover:border-[#1C4CB8] hover:shadow-xs transition-all text-left group"
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#4F7A5E] block">Pure Organic</span>
                  <div className="font-bold text-sm text-[#24221F] group-hover:text-[#1C4CB8] mt-1">Natural Beechwood</div>
                  <p className="text-[11px] text-[#757169] mt-0.5">Solid wood with zero chemical varnishes</p>
                </button>
              </div>

              <div className="mt-5 pt-3 border-t border-[#E8E0D2] flex items-center justify-between text-xs text-[#757169]">
                <span className="flex items-center gap-1.5"><Truck className="w-3.5 h-3.5 text-[#1C4CB8]" /> 100% Cash on Delivery in all 64 districts</span>
                <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-[#4F7A5E]" /> Free returns on inspection</span>
              </div>
            </div>

            {/* Signature Piece Spotlight */}
            <div className="col-span-3">
              <div className="bg-[#F4EFE6] rounded-2xl p-4 border border-[#E8E0D2]">
                <div className="flex items-center gap-1 text-[10px] font-bold tracking-wider text-[#A67E14] uppercase mb-2">
                  <Sparkles className="w-3 h-3 text-[#DDA428]" />
                  Signature Piece
                </div>
                <div 
                  onClick={() => { openProduct(featuredProduct.id); onClose(); }}
                  className="cursor-pointer group"
                >
                  <div className="aspect-[4/3] rounded-xl overflow-hidden mb-3 relative bg-white">
                    <img 
                      src={Array.isArray(featuredProduct.images) ? (featuredProduct.images[0]?.url || (featuredProduct as any).featuredImage) : (featuredProduct.images?.main || '')} 
                      alt={featuredProduct.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h4 className="font-serif font-bold text-sm text-[#24221F] group-hover:text-[#1C4CB8] transition-colors truncate">
                    {featuredProduct.name}
                  </h4>
                  <p className="text-[11px] text-[#757169] mt-1 line-clamp-2">
                    {featuredProduct.subtitle || featuredProduct.description}
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="font-semibold text-sm text-[#24221F]">৳{featuredProduct.price}</span>
                    <span className="text-xs text-[#1C4CB8] font-medium flex items-center gap-0.5">
                      View details <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: BY AGE (GROWTH TIMELINE) */}
        {activeTab === 'age' && (
          <div className="grid grid-cols-12 gap-8 text-left">
            <div className="col-span-8 border-r border-[#E8E0D2] pr-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[11px] font-bold tracking-widest uppercase text-[#757169] flex items-center gap-1.5">
                  <Baby className="w-3.5 h-3.5 text-[#1C4CB8]" />
                  Developmental Stages by Age
                </span>
                <span className="h-px flex-1 bg-[#E8E0D2]"></span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {STAGES.map(stage => (
                  <button
                    key={stage.id}
                    onClick={() => handleSelectAge(stage.id)}
                    className="p-4 rounded-2xl bg-white border border-[#E8E0D2] hover:border-[#1C4CB8] hover:shadow-xs transition-all text-left group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-sm text-[#24221F] group-hover:text-[#1C4CB8] transition-colors">
                        {stage.persona}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[#FCF4DB] text-[#8C6C38] font-mono font-bold">
                        {stage.label}
                      </span>
                    </div>
                    <p className="text-xs text-[#757169] line-clamp-2 leading-relaxed mt-1">
                      {stage.description}
                    </p>
                    <div className="mt-2 text-[11px] text-[#1C4CB8] font-medium flex items-center gap-1">
                      <span>Explore {stage.label} toys</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="col-span-4">
              <div className="bg-[#FAF7F1] p-5 rounded-2xl border border-[#E8E0D2] space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#1C4CB8] block">
                  Montessori Philosophy
                </span>
                <h4 className="font-serif font-bold text-base text-[#24221F]">
                  Designed for Sensitive Periods of Development
                </h4>
                <p className="text-xs text-[#6E6A63] leading-relaxed">
                  Every GrowKins toy is scaled to specific developmental milestones—from infant grasping to preschool architecture and collaborative problem-solving.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => { resetFilters(); setView('shop'); onClose(); }}
                    className="w-full py-2.5 rounded-xl bg-[#24221F] text-white text-xs font-semibold hover:bg-[#1C4CB8] transition-colors text-center"
                  >
                    Shop All Age Groups
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PLAY & SKILLS */}
        {activeTab === 'play' && (
          <div className="grid grid-cols-12 gap-8 text-left">
            <div className="col-span-12">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[11px] font-bold tracking-widest uppercase text-[#757169] flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-[#1C4CB8]" />
                  Play Styles & Cognitive Skills
                </span>
                <span className="h-px flex-1 bg-[#E8E0D2]"></span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {[
                  {
                    title: 'Fine Motor Dexterity',
                    cat: 'Stacking toys' as Category,
                    desc: 'Stacking, grasping, and bilateral hand-eye coordination with natural tactile wood.'
                  },
                  {
                    title: 'Spatial Thinking & Architecture',
                    cat: 'Building sets' as Category,
                    desc: 'Balance, geometric structural reasoning, and cause-and-effect sequencing.'
                  },
                  {
                    title: 'Sensory Exploration',
                    cat: 'Sensory' as Category,
                    desc: 'Acoustic maple tones, organic quilted fabrics, and calming textures for infants.'
                  },
                  {
                    title: 'Narrative & Pretend Play',
                    cat: 'Pretend play' as Category,
                    desc: 'Wooden cameras, forest creatures, and small-world imaginative storytelling.'
                  },
                  {
                    title: 'Open-Ended Movement',
                    cat: 'Open-ended play' as Category,
                    desc: 'Curved balance rockers, wobble bridges, and physical posture confidence.'
                  },
                  {
                    title: 'Creative Arts & Expression',
                    cat: 'Art & Craft' as Category,
                    desc: 'Honey-scented beeswax blocks, non-toxic mineral dyes, and studio creativity.'
                  }
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectCategory(item.cat)}
                    className="p-4 rounded-2xl bg-white border border-[#E8E0D2] hover:border-[#1C4CB8] hover:shadow-xs transition-all text-left group"
                  >
                    <div className="font-bold text-sm text-[#24221F] group-hover:text-[#1C4CB8] transition-colors">
                      {item.title}
                    </div>
                    <p className="text-xs text-[#757169] mt-1.5 leading-relaxed">
                      {item.desc}
                    </p>
                    <span className="inline-block mt-3 text-[11px] font-semibold text-[#1C4CB8] group-hover:underline">
                      View {item.cat} →
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: GIFTS */}
        {activeTab === 'gifts' && (
          <div className="grid grid-cols-12 gap-8 text-left">
            <div className="col-span-8 border-r border-[#E8E0D2] pr-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[11px] font-bold tracking-widest uppercase text-[#757169] flex items-center gap-1.5">
                  <Gift className="w-3.5 h-3.5 text-[#F28F79]" />
                  Curated Gift Finder by Milestone
                </span>
                <span className="h-px flex-1 bg-[#E8E0D2]"></span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    title: 'Akika & Newborn Welcoming',
                    tag: '0–12M',
                    desc: 'Acoustic bell rattles and soft organic cotton leaf mats in heirloom muslin pouches.'
                  },
                  {
                    title: '1st Birthday Montessori Keepsake',
                    tag: '1–2Y',
                    desc: 'Sunrise nesting arches and sensory cubes to celebrate first independent steps.'
                  },
                  {
                    title: 'Eid & Family Celebrations',
                    tag: 'All Ages',
                    desc: 'Solid beechwood woodland balance friends and architectural construction sets.'
                  },
                  {
                    title: 'Screen-Free Travel Activity Packs',
                    tag: '2–6Y',
                    desc: 'Quiet zipper activity pouches, finger count boards, and pocket animal friends.'
                  }
                ].map((gift, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectOccasion('Gift')}
                    className="p-4 rounded-2xl bg-white border border-[#E8E0D2] hover:border-[#F28F79] hover:shadow-xs transition-all text-left group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-sm text-[#24221F] group-hover:text-[#F28F79] transition-colors">
                        {gift.title}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FAF7F1] border border-[#E8E0D2] text-[#757169] font-mono">
                        {gift.tag}
                      </span>
                    </div>
                    <p className="text-xs text-[#757169] line-clamp-2 mt-1">
                      {gift.desc}
                    </p>
                    <span className="mt-2 text-[11px] font-semibold text-[#F28F79] block">
                      Shop this gift milestone →
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="col-span-4">
              <div className="bg-[#FAF7F1] p-5 rounded-2xl border border-[#E8E0D2] space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase text-[#F28F79]">
                  <Heart className="w-4 h-4 fill-current" />
                  Free Gift Messaging & Packaging
                </div>
                <h4 className="font-serif font-bold text-base text-[#24221F]">
                  Send a Gift Directly Anywhere in Bangladesh
                </h4>
                <p className="text-xs text-[#6E6A63] leading-relaxed">
                  Enter your recipient's address at checkout and add a handwritten personalized gift note. We package it in our recyclable keepsake box with zero invoice pricing shown to the recipient.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => { resetFilters(); setFilter('occasion', ['Gift']); setView('shop'); onClose(); }}
                    className="w-full py-2.5 rounded-xl bg-[#24221F] text-white text-xs font-semibold hover:bg-[#F28F79] transition-colors text-center"
                  >
                    Explore Gifting Collection
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
