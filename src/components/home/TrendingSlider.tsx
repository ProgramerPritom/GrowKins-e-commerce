import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../../context/StoreContext';
import { useLanguage } from '../../context/LanguageContext';
import { PRODUCTS } from '../../data/products';
import { TrendingUp, ChevronLeft, ChevronRight, Star, ShoppingBag, ArrowRight } from 'lucide-react';

export const TrendingSlider: React.FC = () => {
  const { openProduct, addToCart, setView } = useStore();
  const { t } = useLanguage();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Filter trending products (bestsellers, staff picks, high ratings)
  const trendingProducts = PRODUCTS.filter(
    p => p.tag === 'BESTSELLER' || p.tag === 'STAFF PICK' || p.rating >= 4.8
  ).slice(0, 8);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 340;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-12 sm:py-16 md:py-24 bg-[#FAF7F1] border-b border-[#E8E0D2]/60 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header with Navigation Arrows */}
        <div className="flex flex-row items-end justify-between mb-6 sm:mb-12 gap-4">
          <div className="space-y-1.5 sm:space-y-2 text-left max-w-xl">
            <div className="text-[11px] font-bold tracking-widest uppercase text-[#1C4CB8] flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-[#1C4CB8]" />
              <span>{t.trending.tag}</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#24221F]">
              {t.trending.headline}
            </h2>
            <p className="text-xs sm:text-base text-[#6E6A63] line-clamp-2 sm:line-clamp-none">
              {t.trending.subheading}
            </p>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              onClick={() => handleScroll('left')}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-[#D9D3C7] bg-white text-[#24221F] hover:bg-[#F4EFE6] hover:border-[#24221F] flex items-center justify-center transition-all shadow-2xs active:scale-95"
              aria-label="Previous trending slide"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={() => handleScroll('right')}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-[#D9D3C7] bg-white text-[#24221F] hover:bg-[#F4EFE6] hover:border-[#24221F] flex items-center justify-center transition-all shadow-2xs active:scale-95"
              aria-label="Next trending slide"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Horizontal Slider Track */}
        <div 
          ref={scrollRef}
          className="flex gap-4 sm:gap-5 overflow-x-auto pb-6 scrollbar-none snap-x snap-mandatory text-left -mx-4 px-4 sm:mx-0 sm:px-0"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {trendingProducts.map((product) => (
            <div
              key={product.id}
              className="shrink-0 w-[230px] sm:w-[290px] snap-start group bg-white rounded-3xl p-3.5 sm:p-4 border border-[#E8E0D2] shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div 
                onClick={() => openProduct(product.id)}
                className="cursor-pointer"
              >
                {/* Image Container */}
                <div className="aspect-square rounded-2xl overflow-hidden bg-[#FAF7F1] relative mb-3.5">
                  <img
                    src={product.images.main}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Badge */}
                  <span className="absolute top-2.5 left-2.5 bg-[#F7E198] text-[#24221F] text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-2xs">
                    {product.ageBadge}
                  </span>
                  {product.tag && (
                    <span className="absolute top-2.5 right-2.5 bg-[#24221F] text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {product.tag}
                    </span>
                  )}
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1 text-[#A67E14] mb-1 text-xs">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span className="font-bold text-[#24221F]">{product.rating}</span>
                  <span className="text-[#A8A49C] text-[11px]">({product.reviewCount})</span>
                </div>

                {/* Title */}
                <h3 className="font-serif font-bold text-base text-[#24221F] line-clamp-1 group-hover:text-[#1C4CB8] transition-colors">
                  {product.name}
                </h3>
                <p className="text-xs text-[#757169] mt-0.5 line-clamp-1">
                  {product.valueStatement}
                </p>
              </div>

              {/* Price & Quick Add */}
              <div className="mt-4 pt-3 border-t border-[#FAF7F1] flex items-center justify-between">
                <div>
                  <div className="font-bold text-base text-[#24221F] font-sans">
                    ৳{product.price}
                  </div>
                  {product.originalPrice && (
                    <div className="text-[11px] text-[#A8A49C] line-through font-sans">
                      ৳{product.originalPrice}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <motion.button
                    whileTap={{ scale: 0.92 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product, 1);
                    }}
                    className="p-2.5 rounded-full bg-[#24221F] text-white hover:bg-[#1C4CB8] transition-colors shadow-2xs cursor-pointer"
                    title="Add to Bag"
                    aria-label={`Add ${product.name} to Bag`}
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </div>
          ))}

          {/* End-of-slider Call to Action Card */}
          <div 
            onClick={() => setView('shop')}
            className="shrink-0 w-[240px] snap-start bg-[#FCF4DB]/80 rounded-3xl p-6 border border-[#F2E0B2] flex flex-col justify-center items-center text-center cursor-pointer hover:bg-[#FCF4DB] hover:shadow-lg transition-all group"
          >
            <div className="w-12 h-12 rounded-full bg-white text-[#1C4CB8] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-xs">
              <ArrowRight className="w-5 h-5" />
            </div>
            <h4 className="font-serif font-bold text-lg text-[#24221F] mb-1">
              {t.trending.viewAll}
            </h4>
            <p className="text-xs text-[#757169]">
              Browse our complete catalog of open-ended Montessori toys.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};
