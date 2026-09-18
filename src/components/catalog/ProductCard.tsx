import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Product } from '../../types';
import { useStore } from '../../context/StoreContext';
import { Heart, Star, Plus, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { openProduct, addToCart, isInWishlist, toggleWishlist } = useStore();
  const [isHovered, setIsHovered] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const isFavorited = isInWishlist(product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1400);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <motion.div 
      layout
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] as const }}
      onClick={() => openProduct(product.id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group cursor-pointer flex flex-col justify-between relative text-left"
    >
      {/* Product Image Container */}
      <div className="aspect-square w-full rounded-[24px] overflow-hidden bg-[#F4EFE6] relative mb-3.5 border border-[#E8E0D2] shadow-xs group-hover:shadow-xl transition-shadow duration-300">
        
        {/* Main vs Secondary Image Swap with smooth crossfade */}
        <div className="w-full h-full relative overflow-hidden">
          <img
            src={product.images.main}
            alt={product.name}
            className={`w-full h-full object-cover transition-all duration-500 ease-out group-hover:scale-104 ${
              isHovered && product.images.secondary ? 'opacity-0' : 'opacity-100'
            }`}
            loading="lazy"
          />
          {product.images.secondary && (
            <img
              src={product.images.secondary}
              alt={`${product.name} alternate view`}
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ease-out group-hover:scale-104 ${
                isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
              loading="lazy"
            />
          )}
        </div>

        {/* Tag Pill (BESTSELLER / NEW / STAFF PICK) */}
        {product.tag && (
          <div className="absolute top-3 left-3 bg-[#F7E198] text-[#24221F] text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full shadow-xs pointer-events-none">
            {product.tag}
          </div>
        )}

        {/* Wishlist Heart Button */}
        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.88 }}
          onClick={handleWishlistClick}
          aria-label={isFavorited ? 'Remove from wishlist' : 'Save to wishlist'}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-xs border border-[#E8E0D2] flex items-center justify-center text-[#24221F] transition-colors shadow-xs z-10"
        >
          <Heart 
            className={`w-4 h-4 transition-colors ${
              isFavorited ? 'text-[#F28F79] fill-[#F28F79]' : 'text-[#757169] group-hover:text-[#24221F]'
            }`} 
          />
        </motion.button>

        {/* Tactile Quick Add Overlay Button on Desktop Hover */}
        <div className="absolute bottom-3 left-3 right-3 transition-all duration-200 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 hidden sm:block z-10">
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={handleQuickAdd}
            disabled={addedAnimation}
            className={`w-full py-2.5 px-4 rounded-full text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md transition-all duration-200 ${
              addedAnimation
                ? 'bg-[#A3C1AD] text-white'
                : 'bg-[#24221F] text-[#FAF7F1] hover:bg-[#1C4CB8]'
            }`}
          >
            <AnimatePresence mode="wait" initial={false}>
              {addedAnimation ? (
                <motion.span
                  key="added"
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  className="flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" /> Added to Bag ✓
                </motion.span>
              ) : (
                <motion.span
                  key="add"
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  className="flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" /> Add to Bag
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Mobile Quick Add Floating Button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleQuickAdd}
          className="sm:hidden absolute bottom-3 right-3 w-9 h-9 rounded-full bg-[#24221F] text-[#FAF7F1] flex items-center justify-center shadow-md z-10"
          aria-label="Add to Bag"
        >
          {addedAnimation ? <Check className="w-4 h-4 text-[#A3C1AD]" /> : <Plus className="w-4 h-4" />}
        </motion.button>

      </div>

      {/* Card Info Section */}
      <div className="space-y-1 px-1">
        
        {/* Top: Age Badge + Star Rating */}
        <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#757169]">
          <span className="font-semibold text-[#6E6A63]">
            {product.ageBadge}
          </span>
          
          <div className="flex items-center gap-1 text-[#24221F] font-sans font-medium">
            <Star className="w-3 h-3 fill-[#A67E14] text-[#A67E14]" />
            <span>{product.rating}</span>
            <span className="text-[#A8A49C] text-[10px]">({product.reviewCount})</span>
          </div>
        </div>

        {/* Title + Price Row */}
        <div className="flex items-baseline justify-between gap-2 pt-0.5">
          <h3 className="font-serif text-base font-bold text-[#24221F] line-clamp-1 group-hover:text-[#1C4CB8] transition-colors">
            {product.name}
          </h3>
          <span className="font-semibold text-sm text-[#24221F] shrink-0 font-sans">
            ৳{product.price}
          </span>
        </div>

        {/* Developmental Benefit Statement */}
        <p className="text-xs text-[#757169] line-clamp-1 font-normal">
          {product.valueStatement}
        </p>

      </div>
    </motion.div>
  );
};
