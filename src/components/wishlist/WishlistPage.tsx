import React from 'react';
import { useStore } from '../../context/StoreContext';
import { PRODUCTS } from '../../data/products';
import { ProductCard } from '../catalog/ProductCard';
import { Heart } from 'lucide-react';

export const WishlistPage: React.FC = () => {
  const { wishlist, setView } = useStore();

  const savedProducts = PRODUCTS.filter(p => wishlist.includes(p.id));

  return (
    <div className="py-12 bg-[#FAF7F1] min-h-[70vh] text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-[#757169] mb-6">
          <button onClick={() => setView('home')} className="hover:text-[#24221F]">Home</button>
          <span>›</span>
          <span className="text-[#24221F] font-semibold">Wishlist</span>
        </nav>

        <div className="flex items-end justify-between mb-8 border-b border-[#E8E0D2] pb-6">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#24221F]">
              Saved discoveries
            </h1>
            <p className="text-sm text-[#757169] mt-1">
              Pieces you're holding onto for birthdays, milestones, or quiet afternoons.
            </p>
          </div>
          <span className="text-xs font-semibold text-[#757169]">
            {savedProducts.length} saved
          </span>
        </div>

        {savedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {savedProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#FCE8E3] text-[#F28F79] flex items-center justify-center mx-auto">
              <Heart className="w-8 h-8" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-[#24221F]">
              Nothing saved yet — but there is plenty to discover.
            </h2>
            <p className="text-sm text-[#757169] leading-relaxed">
              Tap the heart on any toy to keep track of gifts for upcoming birthdays or developmental stages.
            </p>
            <button
              onClick={() => setView('shop')}
              className="px-8 py-3 rounded-full bg-[#24221F] text-white hover:bg-[#1C4CB8] text-xs font-bold transition-all shadow-md active:scale-95"
            >
              Explore the Play Shelf
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
