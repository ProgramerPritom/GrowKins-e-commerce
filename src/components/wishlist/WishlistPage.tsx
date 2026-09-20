import React from 'react';
import { useStore } from '../../context/StoreContext';
import { PRODUCTS } from '../../data/products';
import { ProductCard } from '../catalog/ProductCard';
import { Heart } from 'lucide-react';

export const WishlistPage: React.FC = () => {
  const { wishlist, setView } = useStore();

  const savedProducts = PRODUCTS.filter(p => wishlist.includes(p.id));

  return (
    <div className="py-6 sm:py-12 bg-[#FAF7F1] min-h-[70vh] text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-[#757169] mb-4 sm:mb-6">
          <button onClick={() => setView('home')} className="hover:text-[#24221F] cursor-pointer">Home</button>
          <span>›</span>
          <span className="text-[#24221F] font-semibold">Wishlist</span>
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-8 border-b border-[#E8E0D2] pb-4 sm:pb-6 gap-2">
          <div>
            <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold text-[#24221F]">
              Saved discoveries
            </h1>
            <p className="text-xs sm:text-sm text-[#757169] mt-1">
              Pieces you're holding onto for birthdays, milestones, or quiet afternoons.
            </p>
          </div>
          <span className="text-xs font-semibold text-[#757169] shrink-0">
            {savedProducts.length} saved
          </span>
        </div>

        {savedProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-8">
            {savedProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-12 sm:py-20 text-center max-w-md mx-auto space-y-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#FCE8E3] text-[#F28F79] flex items-center justify-center mx-auto">
              <Heart className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#24221F]">
              Nothing saved yet — but there is plenty to discover.
            </h2>
            <p className="text-xs sm:text-sm text-[#757169] leading-relaxed">
              Tap the heart on any toy to keep track of gifts for upcoming birthdays or developmental stages.
            </p>
            <button
              onClick={() => setView('shop')}
              className="px-6 sm:px-8 py-3 rounded-full bg-[#24221F] text-white hover:bg-[#1C4CB8] text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
            >
              Explore the Play Shelf
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
