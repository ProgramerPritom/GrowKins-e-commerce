import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { ApparelProduct } from '../../../types/clothing';
import { useStore } from '../../../context/StoreContext';
import { Heart, Plus, X } from 'lucide-react';

interface ClothingProductCardProps {
  product: ApparelProduct;
  onOpenProduct: (slug: string) => void;
  onOpenSizeGuide?: () => void;
  editorialMode?: boolean;
}

export const ClothingProductCard: React.FC<ClothingProductCardProps> = ({
  product,
  onOpenProduct,
  onOpenSizeGuide,
  editorialMode = false
}) => {
  const { addToCart, isInWishlist, toggleWishlist } = useStore();
  const [isHovered, setIsHovered] = useState(false);
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [selectedSizeId, setSelectedSizeId] = useState<string | null>(null);

  const isFavorited = isInWishlist(product.id);

  // Images: primary, secondary or model
  const primaryImg = product.images[0]?.url || '';
  const secondaryImg = product.images[1]?.url || product.images.find(img => img.type === 'model')?.url || primaryImg;

  // Selected variant based on size (defaulting to first color)
  const defaultColor = product.colors[0];

  const handleQuickAddConfirm = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedSizeId) return;

    // Find variant matching default color and selected size
    const variant = product.variants.find(
      (v) => v.size.id === selectedSizeId && (v.color.id === defaultColor?.id || true)
    );

    if (variant) {
      addToCart(product, 1, variant);
      setQuickAddOpen(false);
      setSelectedSizeId(null);
    }
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        if (!selectedSizeId) setQuickAddOpen(false);
      }}
      className="group relative flex flex-col text-left transition-all"
    >
      {/* Media Viewport */}
      <div
        onClick={() => onOpenProduct(product.slug)}
        className={`relative w-full rounded-2xl overflow-hidden bg-[#F5F2EA] border border-[#E8E2D5] cursor-pointer ${
          editorialMode ? 'aspect-3/4' : 'aspect-4/5'
        }`}
      >
        {/* Badges */}
        <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5 pointer-events-none">
          {product.badges?.slice(0, 2).map((badge) => (
            <span
              key={badge}
              className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#171715]/85 text-white backdrop-blur-xs shadow-2xs"
            >
              {badge}
            </span>
          ))}
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#C85A32] text-white shadow-2xs">
              SALE
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-3 right-3 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
            isFavorited
              ? 'bg-[#C85A32] text-white shadow-xs'
              : 'bg-white/80 backdrop-blur-xs text-[#171715] hover:bg-white hover:text-[#C85A32]'
          }`}
          title={isFavorited ? 'Saved' : 'Save to wishlist'}
        >
          <Heart className="w-4 h-4" fill={isFavorited ? 'currentColor' : 'none'} />
        </button>

        {/* Crossfading Editorial Imagery */}
        <div className="relative w-full h-full overflow-hidden">
          <img
            src={primaryImg}
            alt={product.name}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out ${
              isHovered && secondaryImg !== primaryImg ? 'opacity-0 scale-103' : 'opacity-100 scale-100'
            }`}
          />
          {secondaryImg && (
            <img
              src={secondaryImg}
              alt={`${product.name} alternate angle`}
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out ${
                isHovered ? 'opacity-100 scale-104' : 'opacity-0 scale-100'
              }`}
            />
          )}
        </div>

        {/* Desktop Quick-Add Flyout Trigger */}
        <div className="hidden sm:block absolute bottom-3 left-3 right-3 z-20">
          {!quickAddOpen ? (
            <motion.button
              initial={false}
              animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 8 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => {
                e.stopPropagation();
                setQuickAddOpen(true);
              }}
              className="w-full py-2.5 rounded-xl bg-[#FCFAF7]/95 hover:bg-[#171715] hover:text-white backdrop-blur-md text-xs font-bold text-[#171715] transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer border border-[#E8E2D5]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Quick Add</span>
            </motion.button>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#FCFAF7] border border-[#E8E2D5] rounded-xl p-3 shadow-xl space-y-2 text-left"
            >
              <div className="flex items-center justify-between text-[11px] font-bold text-[#171715]">
                <span>Choose Size:</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setQuickAddOpen(false);
                  }}
                  className="p-1 text-[#857E73] hover:text-[#171715] cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>

              {/* Size Buttons Grid */}
              <div className="grid grid-cols-3 gap-1.5">
                {product.sizes.map((s) => {
                  const variant = product.variants.find((v) => v.size.id === s.id);
                  const isOutOfStock = !variant || variant.inventoryQuantity <= 0;
                  const isSelected = selectedSizeId === s.id;

                  return (
                    <button
                      key={s.id}
                      disabled={isOutOfStock}
                      onClick={() => setSelectedSizeId(s.id)}
                      className={`py-1.5 px-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#171715] text-white'
                          : isOutOfStock
                          ? 'bg-[#F2ECE1] text-[#A69E91] line-through cursor-not-allowed'
                          : 'bg-white text-[#171715] border border-[#E8E2D5] hover:border-[#C85A32]'
                      }`}
                    >
                      {s.label}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-1 text-[10px]">
                {onOpenSizeGuide && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenSizeGuide();
                    }}
                    className="text-[#857E73] underline hover:text-[#C85A32] cursor-pointer"
                  >
                    Size Guide
                  </button>
                )}
                <button
                  disabled={!selectedSizeId}
                  onClick={handleQuickAddConfirm}
                  className="ml-auto px-3 py-1 rounded-md bg-[#C85A32] disabled:opacity-40 text-white font-bold text-[10px] hover:bg-[#B24E2A] transition-colors cursor-pointer"
                >
                  Add to Bag
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Product Information */}
      <div className="pt-3 space-y-1">
        {/* Colors Count & Swatch Dots */}
        <div className="flex items-center justify-between text-[11px] text-[#857E73]">
          <div className="flex items-center gap-1">
            {product.colors.slice(0, 4).map((col) => (
              <span
                key={col.id}
                title={col.name}
                className="w-2.5 h-2.5 rounded-full border border-[#D5CDBD]"
                style={{ backgroundColor: col.hex }}
              />
            ))}
            {product.colors.length > 4 && (
              <span className="text-[10px] ml-0.5 font-medium">+{product.colors.length - 4}</span>
            )}
          </div>
          <span className="font-mono text-[10px] font-medium">{product.ageLabel}</span>
        </div>

        {/* Product Title */}
        <h3
          onClick={() => onOpenProduct(product.slug)}
          className="font-serif font-bold text-sm sm:text-base text-[#171715] group-hover:text-[#C85A32] transition-colors cursor-pointer line-clamp-1"
        >
          {product.name}
        </h3>

        {/* Price in BDT */}
        <div className="flex items-baseline gap-2 pt-0.5">
          <span className="font-sans font-bold text-sm text-[#171715]">
            ৳{product.price.toLocaleString()}
          </span>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="font-sans text-xs text-[#857E73] line-through">
              ৳{product.compareAtPrice.toLocaleString()}
            </span>
          )}
        </div>

        {/* Mobile Quick Add Button */}
        <div className="sm:hidden pt-2">
          <button
            onClick={() => onOpenProduct(product.slug)}
            className="w-full py-2 rounded-xl bg-[#FCFAF7] border border-[#E8E2D5] text-xs font-bold text-[#171715] hover:border-[#C85A32] transition-colors"
          >
            Select Size & Add
          </button>
        </div>
      </div>
    </div>
  );
};
