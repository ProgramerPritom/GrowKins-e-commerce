import React from 'react';
import { useStore } from '../../context/StoreContext';
import { useLanguage } from '../../context/LanguageContext';
import { PRODUCTS } from '../../data/products';
import { ProductCard } from '../catalog/ProductCard';
import { ArrowRight, Sparkles } from 'lucide-react';

export const PlayShelf: React.FC = () => {
  const { setView } = useStore();
  const { t } = useLanguage();
  const featuredProducts = PRODUCTS.slice(0, 4);

  return (
    <section className="py-20 md:py-28 bg-[#FAF7F1] border-b border-[#E8E0D2]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div className="space-y-2 text-left">
            <div className="text-[11px] font-bold tracking-widest uppercase text-[#757169] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#A67E14]" />
              <span>{t.playShelf.tag}</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#24221F]">
              {t.playShelf.headline}
            </h2>
          </div>
          <button
            onClick={() => setView('shop')}
            className="text-xs font-semibold text-[#1C4CB8] hover:text-[#123788] flex items-center gap-1 transition-colors self-start sm:self-auto cursor-pointer"
          >
            <span>{t.playShelf.viewAll}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

      </div>
    </section>
  );
};
