import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../context/StoreContext';
import { useLanguage } from '../../context/LanguageContext';
import { STAGES } from '../../data/stages';
import { PRODUCTS } from '../../data/products';
import { ArrowRight, Sparkles, Compass, ShoppingBag } from 'lucide-react';
import type { AgeRange } from '../../types';

export const StageSelector: React.FC = () => {
  const { setView, openProduct, setFilter } = useStore();
  const { t } = useLanguage();
  const [activeStageId, setActiveStageId] = useState<AgeRange>('3–5Y');

  const activeStage = STAGES.find(s => s.id === activeStageId) || STAGES[2];
  const matchedProducts = PRODUCTS.filter(p => activeStage.recommendedProductIds.includes(p.id));

  const handleExploreStage = () => {
    setFilter('age', [activeStage.id]);
    setView('shop');
  };

  const handleGoToShop = () => {
    setView('shop');
  };

  return (
    <section className="py-12 sm:py-20 md:py-28 bg-[#FAF7F1] border-b border-[#E8E0D2]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Direct Shop Redirect Action */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between max-w-4xl mx-auto mb-10 sm:mb-14 text-center sm:text-left gap-4">
          <div className="space-y-2 sm:space-y-3 mx-auto sm:mx-0 max-w-2xl">
            <div className="text-[11px] font-bold tracking-widest uppercase text-[#757169] flex items-center justify-center sm:justify-start gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#A67E14]" />
              <span>{t.stages.tag}</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#24221F]">
              {t.stages.headline}
            </h2>

            <p className="text-sm sm:text-lg text-[#6E6A63]">
              {t.stages.subheading}
            </p>
          </div>

          {/* Prominent Shop Navigation Action (Item 2) */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleGoToShop}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-full bg-white border border-[#D9D3C7] text-[#24221F] text-xs font-bold hover:bg-[#24221F] hover:text-white transition-all shadow-2xs self-center sm:self-end shrink-0 cursor-pointer group"
          >
            <Compass className="w-4 h-4 text-[#1C4CB8] group-hover:text-[#F7E198] transition-colors" />
            <span>{t.stages.seeMoreShop}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </div>

        {/* Tactile Growth Timeline */}
        <div className="relative max-w-3xl mx-auto mb-10 sm:mb-14 px-2 sm:px-4">
          
          {/* Horizontal connecting track */}
          <div className="absolute top-4 sm:top-5 left-6 right-6 sm:left-8 sm:right-8 h-1 bg-[#E8E0D2] -z-0 rounded-full" />
          
          <div className="flex justify-between items-center relative z-10">
            {STAGES.map((stage) => {
              const isActive = stage.id === activeStageId;
              return (
                <button
                  key={stage.id}
                  onClick={() => setActiveStageId(stage.id)}
                  className="flex flex-col items-center group cursor-pointer focus:outline-none relative px-1"
                >
                  {/* Circle Node */}
                  <motion.div 
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.94 }}
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-[11px] sm:text-xs transition-colors duration-200 relative ${
                      isActive 
                        ? 'bg-[#1C4CB8] text-white shadow-md' 
                        : 'bg-white text-[#757169] border-2 border-[#E8E0D2] group-hover:border-[#1C4CB8] group-hover:text-[#1C4CB8]'
                    }`}
                  >
                    {isActive ? (
                      <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-white animate-pulse" />
                    ) : (
                      <span>{stage.label.replace('Y', '').replace('M', '')}</span>
                    )}

                    {/* Active sliding glow ring */}
                    {isActive && (
                      <motion.div
                        layoutId="activeStageGlow"
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                        className="absolute inset-[-3px] sm:inset-[-4px] rounded-full border-2 border-[#1C4CB8] pointer-events-none"
                      />
                    )}
                  </motion.div>

                  {/* Stage Label Underneath */}
                  <span className={`mt-1.5 sm:mt-2 text-[10px] sm:text-xs font-semibold tracking-tight sm:tracking-wide transition-colors ${
                    isActive ? 'text-[#1C4CB8]' : 'text-[#757169] group-hover:text-[#24221F]'
                  }`}>
                    {stage.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Stage Presentation Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStage.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] as const }}
            className="bg-[#E6EFE9] border border-[#C9DEC0] rounded-[24px] sm:rounded-[28px] p-5 sm:p-10 shadow-sm"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Stage Details */}
              <div className="lg:col-span-5 space-y-4 text-left">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 text-xs font-semibold text-[#4F7A5E] border border-white/60">
                  <Sparkles className="w-3.5 h-3.5 text-[#4F7A5E]" />
                  {activeStage.ageYears}
                </div>

                <h3 className="font-serif text-3xl sm:text-4xl font-bold text-[#24221F]">
                  {activeStage.persona}
                </h3>

                <p className="text-base text-[#4D4943] leading-relaxed">
                  {activeStage.description}
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <motion.button
                    whileHover={{ x: 3 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleExploreStage}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#1C4CB8] hover:text-[#123788] transition-colors group cursor-pointer"
                  >
                    <span>{t.stages.exploreStage}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </motion.button>

                  <span className="text-[#A8A49C] hidden sm:inline">·</span>

                  <button
                    onClick={handleGoToShop}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#24221F] hover:text-[#1C4CB8] transition-colors cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-[#A67E14]" />
                    <span>{t.stages.seeMoreShop}</span>
                  </button>
                </div>
              </div>

              {/* Right Recommended Product Thumbnails */}
              <div className="lg:col-span-7">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {matchedProducts.slice(0, 3).map((product, idx) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.07, duration: 0.25 }}
                      whileHover={{ y: -4, boxShadow: '0 10px 25px -5px rgba(0,0,0,0.08)' }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => openProduct(product.id)}
                      className="bg-white rounded-2xl p-3.5 border border-[#E8E0D2] transition-all cursor-pointer group flex flex-col justify-between"
                    >
                      <div>
                        <div className="aspect-square rounded-xl overflow-hidden bg-[#FAF7F1] mb-3 relative">
                          <img
                            src={product.images.main}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <span className="absolute top-2 left-2 bg-[#F7E198] text-[#24221F] text-[10px] font-bold px-2 py-0.5 rounded-full">
                            {product.ageBadge}
                          </span>
                        </div>

                        <h4 className="font-medium text-sm text-[#24221F] line-clamp-1 group-hover:text-[#1C4CB8] transition-colors">
                          {product.name}
                        </h4>
                        <p className="text-xs text-[#757169] mt-0.5 line-clamp-1">
                          {product.valueStatement}
                        </p>
                      </div>

                      <div className="mt-3 pt-2 border-t border-[#FAF7F1] flex items-center justify-between">
                        <span className="font-semibold text-sm text-[#24221F] font-sans">
                          ৳{product.price}
                        </span>
                        <span className="text-[11px] text-[#1C4CB8] font-medium flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                          Details <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

            </div>
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
};
