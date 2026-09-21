import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ApparelProduct, ApparelVariant } from '../../../types/clothing';
import { useStore } from '../../../context/StoreContext';
import { clothingService } from '../../../services';
import { SizeGuideModal } from './SizeGuideModal';
import { FitFinderDrawer } from './FitFinderDrawer';
import {
  Star,
  Heart,
  ShoppingBag,
  Truck,
  Ruler,
  Sparkles,
  ChevronDown,
  Check,
  Info
} from 'lucide-react';

interface ClothingPDPProps {
  product: ApparelProduct;
  onNavigate: (path: string) => void;
  onOpenProduct: (slug: string) => void;
}

export const ClothingPDP: React.FC<ClothingPDPProps> = ({
  product,
  onNavigate,
  onOpenProduct
}) => {
  const { addToCart, isInWishlist, toggleWishlist } = useStore();

  // Selected Color (defaults to first color)
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  
  // Selected Size (defaults to first available in this color)
  const [selectedSizeId, setSelectedSizeId] = useState<string>('');
  
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Modals
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [fitFinderOpen, setFitFinderOpen] = useState(false);

  // Accordion state
  const [openAccordions, setOpenAccordions] = useState<{ [key: string]: boolean }>({
    details: true,
    materials: false,
    fit: false,
    care: false,
    delivery: false
  });

  // Coordinating items for Complete The Look
  const [completeLookProducts, setCompleteLookProducts] = useState<ApparelProduct[]>([]);
  const [recentlyViewedProducts, setRecentlyViewedProducts] = useState<ApparelProduct[]>([]);

  // Filter gallery images for selected color
  const colorImages = product.images.filter(
    (img) => !img.colorId || img.colorId === selectedColor.id
  );
  const galleryImages = colorImages.length > 0 ? colorImages : product.images;

  // Selected variant
  const currentVariant: ApparelVariant | undefined = product.variants.find(
    (v) => v.color.id === selectedColor.id && v.size.id === selectedSizeId
  );

  // Set default size once sizes are available
  useEffect(() => {
    const firstAvailable = product.variants.find(
      (v) => v.color.id === selectedColor.id && v.inventoryQuantity > 0
    );
    if (firstAvailable) {
      setSelectedSizeId(firstAvailable.size.id);
    } else if (product.sizes[0]) {
      setSelectedSizeId(product.sizes[0].id);
    }
  }, [selectedColor, product]);

  // Load Complete the Look and Recently Viewed
  useEffect(() => {
    let isMounted = true;

    async function loadComplements() {
      if (product.completeTheLookIds && product.completeTheLookIds.length > 0) {
        const found: ApparelProduct[] = [];
        for (const cid of product.completeTheLookIds) {
          const item = await clothingService.getProductBySlug(cid);
          if (item) found.push(item);
        }
        if (isMounted) setCompleteLookProducts(found);
      }

      // Track recently viewed in localStorage
      try {
        const key = 'growkins_recently_viewed_apparel';
        const saved = localStorage.getItem(key);
        let list: string[] = saved ? JSON.parse(saved) : [];
        list = [product.slug, ...list.filter((s) => s !== product.slug)].slice(0, 6);
        localStorage.setItem(key, JSON.stringify(list));

        // Load other products for carousel
        const otherSlugs = list.filter((s) => s !== product.slug).slice(0, 4);
        const recents: ApparelProduct[] = [];
        for (const slug of otherSlugs) {
          const p = await clothingService.getProductBySlug(slug);
          if (p) recents.push(p);
        }
        if (isMounted) setRecentlyViewedProducts(recents);
      } catch (e) {
        console.warn(e);
      }
    }

    loadComplements();
    return () => {
      isMounted = false;
    };
  }, [product]);

  const toggleAccordion = (section: string) => {
    setOpenAccordions((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleAddToCart = () => {
    if (!currentVariant) return;
    addToCart(product, quantity, currentVariant);
  };

  const handleAddAllToLook = () => {
    // Add main item
    if (currentVariant) {
      addToCart(product, 1, currentVariant);
    }
    // Add coordinating items
    completeLookProducts.forEach((comp) => {
      const firstVar = comp.variants.find((v) => v.inventoryQuantity > 0) || comp.variants[0];
      if (firstVar) {
        addToCart(comp, 1, firstVar);
      }
    });
  };

  const isFavorited = isInWishlist(product.id);
  const isOutOfStock = !currentVariant || currentVariant.inventoryQuantity <= 0;
  const isLowStock = currentVariant && currentVariant.inventoryQuantity > 0 && currentVariant.inventoryQuantity <= (currentVariant.lowStockThreshold || 3);
  const isShoe = product.productType === 'shoe';

  return (
    <div className="bg-[#F7F4EE] min-h-screen py-6 sm:py-10 text-left">
      <div className="fashion-container">
        
        {/* Breadcrumb Path */}
        <nav className="flex items-center gap-2 text-xs text-[#857E73] mb-6 sm:mb-8 font-medium">
          <button onClick={() => onNavigate('/clothing')} className="hover:text-[#171715] cursor-pointer">
            The Little Wardrobe
          </button>
          <span>/</span>
          <button
            onClick={() => onNavigate(`/clothing/${product.categoryIds[0] || 'tops'}`)}
            className="hover:text-[#171715] capitalize cursor-pointer"
          >
            {product.categoryIds[0] || 'Apparel'}
          </button>
          <span>/</span>
          <span className="text-[#171715] font-semibold truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Main PDP Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          
          {/* Left: Large Editorial Media Gallery (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Main Stage Image */}
            <div className="relative w-full rounded-3xl overflow-hidden bg-[#FCFAF7] border border-[#E8E2D5] aspect-4/5 shadow-xs">
              <AnimatePresence mode="wait">
                <motion.img
                  key={galleryImages[activeImageIndex]?.url || product.images[0].url}
                  src={galleryImages[activeImageIndex]?.url || product.images[0].url}
                  alt={galleryImages[activeImageIndex]?.alt || product.name}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.28, ease: 'easeOut' }}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>

              {/* Wishlist Button Overlay */}
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`absolute top-4 right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-all cursor-pointer ${
                  isFavorited
                    ? 'bg-[#C85A32] text-white shadow-sm'
                    : 'bg-white/85 text-[#171715] hover:bg-white hover:text-[#C85A32]'
                }`}
                title="Save to Wishlist"
              >
                <Heart className="w-5 h-5" fill={isFavorited ? 'currentColor' : 'none'} />
              </button>

              {/* Editorial Caption Pill */}
              {galleryImages[activeImageIndex]?.type && (
                <div className="absolute bottom-4 left-4 z-10 px-3 py-1 rounded-full bg-[#171715]/75 text-white backdrop-blur-md text-[10px] uppercase font-bold tracking-widest">
                  {galleryImages[activeImageIndex].type} perspective
                </div>
              )}
            </div>

            {/* Thumbnail Strip */}
            <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
              {galleryImages.map((img, idx) => (
                <button
                  key={img.id || idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-20 sm:w-24 aspect-square rounded-2xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                    activeImageIndex === idx
                      ? 'border-[#171715] shadow-xs'
                      : 'border-[#E8E2D5] opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Sticky Purchase Panel (5 Cols) */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-6">
            
            {/* Header / Badges */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {product.badges?.map((badge) => (
                  <span
                    key={badge}
                    className="text-[9px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-[#171715] text-white"
                  >
                    {badge}
                  </span>
                ))}
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#857E73]">
                  {product.ageLabel}
                </span>
              </div>

              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#171715] leading-tight">
                {product.name}
              </h1>

              {product.subtitle && (
                <p className="text-xs text-[#524E47] font-medium leading-relaxed">
                  {product.subtitle}
                </p>
              )}

              {/* Rating & Reviews */}
              <div className="flex items-center gap-2 pt-1 text-xs">
                <div className="flex items-center text-[#DDA15E]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <span className="font-bold text-[#171715]">{product.rating}</span>
                <span className="text-[#857E73]">· {product.reviewCount} customer reviews</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 pt-2">
                <span className="font-sans font-bold text-2xl sm:text-3xl text-[#171715]">
                  ৳{(currentVariant?.price || product.price).toLocaleString()}
                </span>
                {product.compareAtPrice && product.compareAtPrice > product.price && (
                  <span className="font-sans text-sm text-[#857E73] line-through">
                    ৳{product.compareAtPrice.toLocaleString()}
                  </span>
                )}
                <span className="text-[11px] text-[#4F7A5E] font-bold bg-[#E6EFE9] px-2 py-0.5 rounded">
                  In Stock · COD Available
                </span>
              </div>
            </div>

            {/* Color Swatches */}
            <div className="pt-2 border-t border-[#E8E2D5] space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#171715]">Color:</span>
                <span className="text-[#524E47] font-medium">{selectedColor.name}</span>
              </div>

              <div className="flex items-center gap-3">
                {product.colors.map((col) => {
                  const isSelected = selectedColor.id === col.id;
                  return (
                    <button
                      key={col.id}
                      onClick={() => {
                        setSelectedColor(col);
                        setActiveImageIndex(0);
                      }}
                      className={`relative w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                        isSelected
                          ? 'ring-2 ring-offset-2 ring-[#171715] scale-105'
                          : 'hover:scale-105 opacity-85 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: col.hex }}
                      title={col.name}
                      aria-label={`Select color ${col.name}`}
                    >
                      {isSelected && (
                        <Check
                          className={`w-4 h-4 ${
                            col.hex === '#FFFFFF' || col.hex.toLowerCase().includes('cream') || col.hex.toLowerCase().includes('white')
                              ? 'text-[#171715]'
                              : 'text-white'
                          }`}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Size Selector */}
            <div className="pt-2 border-t border-[#E8E2D5] space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#171715]">
                  {isShoe ? 'Shoe Size:' : 'Clothing Size:'}
                </span>

                <div className="flex items-center gap-3 text-[11px]">
                  <button
                    onClick={() => setSizeGuideOpen(true)}
                    className="flex items-center gap-1 text-[#857E73] hover:text-[#C85A32] underline cursor-pointer"
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    <span>Size Guide</span>
                  </button>
                  <span>·</span>
                  <button
                    onClick={() => setFitFinderOpen(true)}
                    className="flex items-center gap-1 text-[#C85A32] font-semibold hover:underline cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Find Their Size</span>
                  </button>
                </div>
              </div>

              {/* Size Buttons Matrix */}
              <div className="grid grid-cols-3 gap-2">
                {product.sizes.map((s) => {
                  const variant = product.variants.find(
                    (v) => v.color.id === selectedColor.id && v.size.id === s.id
                  );
                  const isAvailable = variant && variant.inventoryQuantity > 0;
                  const isSelected = selectedSizeId === s.id;
                  const isItemLowStock = isAvailable && variant.inventoryQuantity <= (variant.lowStockThreshold || 3);

                  return (
                    <button
                      key={s.id}
                      disabled={!isAvailable}
                      onClick={() => setSelectedSizeId(s.id)}
                      className={`relative py-3 px-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center cursor-pointer ${
                        isSelected
                          ? 'bg-[#171715] text-white shadow-xs'
                          : !isAvailable
                          ? 'bg-[#EFEAE1] text-[#A69E91] line-through cursor-not-allowed opacity-60'
                          : 'bg-white text-[#171715] border border-[#E8E2D5] hover:border-[#C85A32]'
                      }`}
                    >
                      <span>{s.label}</span>
                      {s.cm && (
                        <span className={`text-[10px] font-mono mt-0.5 ${isSelected ? 'text-[#C5BFB5]' : 'text-[#857E73]'}`}>
                          {s.cm}
                        </span>
                      )}
                      {isItemLowStock && !isSelected && (
                        <span className="absolute -top-1.5 -right-1 text-[8px] font-bold px-1.5 py-0.2 rounded-full bg-[#C85A32] text-white">
                          Only {variant.inventoryQuantity} left
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {isOutOfStock ? (
                <p className="text-xs text-[#D96F58] font-semibold">
                  This combination is currently out of stock. Please select another size or color.
                </p>
              ) : isLowStock ? (
                <p className="text-xs text-[#C85A32] font-semibold flex items-center gap-1">
                  <Info className="w-3.5 h-3.5" />
                  Low stock: only {currentVariant?.inventoryQuantity} pieces left in this size!
                </p>
              ) : null}
            </div>

            {/* Quantity and Primary Add to Bag CTA */}
            <div className="pt-3 border-t border-[#E8E2D5] space-y-3">
              <div className="flex gap-3">
                {/* Quantity input */}
                <div className="flex items-center border border-[#E8E2D5] rounded-xl bg-white px-3 py-2 shrink-0">
                  <button
                    disabled={quantity <= 1}
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-6 h-6 flex items-center justify-center text-[#857E73] hover:text-[#171715] disabled:opacity-40 cursor-pointer font-bold"
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-bold text-sm text-[#171715]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-6 h-6 flex items-center justify-center text-[#857E73] hover:text-[#171715] cursor-pointer font-bold"
                  >
                    +
                  </button>
                </div>

                {/* Add to Bag CTA */}
                <button
                  disabled={isOutOfStock}
                  onClick={handleAddToCart}
                  className="flex-1 py-3.5 px-6 rounded-xl bg-[#171715] hover:bg-[#C85A32] disabled:bg-[#857E73] text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{isOutOfStock ? 'Sold Out' : 'Add To Bag'}</span>
                </button>
              </div>

              {/* COD Reassurance Points */}
              <div className="bg-[#FAF7F1] border border-[#E8E2D5] rounded-2xl p-4 space-y-2 text-xs text-[#524E47]">
                <div className="flex items-center gap-2 font-semibold text-[#171715]">
                  <Truck className="w-4 h-4 text-[#C85A32]" />
                  <span>Cash on Delivery — Pay at your doorstep</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-[#787267] pt-1">
                  <div>• Inside Dhaka: 24–48 Hours</div>
                  <div>• Outside Dhaka: 2–4 Days</div>
                  <div>• Easy Sizing Exchanges</div>
                  <div>• Free Delivery over ৳2,500</div>
                </div>
              </div>
            </div>

            {/* Shoe specific attributes display */}
            {isShoe && product.shoeAttributes && (
              <div className="bg-white border border-[#E8E2D5] rounded-2xl p-4 space-y-2 text-xs">
                <div className="font-bold text-[#171715] uppercase tracking-wider text-[10px]">
                  Shoe Specifications & First Steps
                </div>
                <div className="grid grid-cols-2 gap-2 text-[#524E47] text-[11px]">
                  <div><strong>Upper:</strong> {product.shoeAttributes.upperMaterial}</div>
                  <div><strong>Sole:</strong> {product.shoeAttributes.soleMaterial}</div>
                  <div><strong>Closure:</strong> {product.shoeAttributes.closureType}</div>
                  <div><strong>Foot Range:</strong> {product.shoeAttributes.footLengthCm}</div>
                </div>
              </div>
            )}

            {/* Fashion Accordions */}
            <div className="pt-2 border-t border-[#E8E2D5] divide-y divide-[#E8E2D5] text-xs">
              
              {/* Accordion 1: Details */}
              <div className="py-3">
                <button
                  onClick={() => toggleAccordion('details')}
                  className="flex items-center justify-between w-full font-bold text-[#171715] hover:text-[#C85A32] transition-colors cursor-pointer"
                >
                  <span className="uppercase tracking-wider text-[11px]">Product Details</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${openAccordions.details ? 'rotate-180' : ''}`} />
                </button>
                {openAccordions.details && (
                  <div className="pt-2.5 text-[#524E47] leading-relaxed whitespace-pre-line text-xs">
                    {product.description}
                  </div>
                )}
              </div>

              {/* Accordion 2: Materials */}
              <div className="py-3">
                <button
                  onClick={() => toggleAccordion('materials')}
                  className="flex items-center justify-between w-full font-bold text-[#171715] hover:text-[#C85A32] transition-colors cursor-pointer"
                >
                  <span className="uppercase tracking-wider text-[11px]">Material & Texture</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${openAccordions.materials ? 'rotate-180' : ''}`} />
                </button>
                {openAccordions.materials && (
                  <div className="pt-2.5 space-y-2 text-[#524E47] text-xs">
                    {product.materials.map((m, idx) => (
                      <div key={idx} className="bg-white p-2.5 rounded-xl border border-[#E8E2D5]">
                        <div className="font-bold text-[#171715]">
                          {m.percentage ? `${m.percentage}% ` : ''}{m.name}
                        </div>
                        {m.description && (
                          <div className="text-[11px] text-[#857E73] mt-0.5">{m.description}</div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Accordion 3: Fit & Measurements */}
              {product.fit && (
                <div className="py-3">
                  <button
                    onClick={() => toggleAccordion('fit')}
                    className="flex items-center justify-between w-full font-bold text-[#171715] hover:text-[#C85A32] transition-colors cursor-pointer"
                  >
                    <span className="uppercase tracking-wider text-[11px]">Fit & Silhouette</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${openAccordions.fit ? 'rotate-180' : ''}`} />
                  </button>
                  {openAccordions.fit && (
                    <div className="pt-2.5 space-y-1.5 text-[#524E47] text-xs">
                      <div><strong>Cut:</strong> {product.fit.type.toUpperCase()} silhouette</div>
                      {product.fit.stretchLevel && <div><strong>Stretch:</strong> {product.fit.stretchLevel} stretch</div>}
                      {product.fit.notes && <div><strong>Notes:</strong> {product.fit.notes}</div>}
                    </div>
                  )}
                </div>
              )}

              {/* Accordion 4: Care Instructions */}
              <div className="py-3">
                <button
                  onClick={() => toggleAccordion('care')}
                  className="flex items-center justify-between w-full font-bold text-[#171715] hover:text-[#C85A32] transition-colors cursor-pointer"
                >
                  <span className="uppercase tracking-wider text-[11px]">Care Instructions</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${openAccordions.care ? 'rotate-180' : ''}`} />
                </button>
                {openAccordions.care && (
                  <div className="pt-2.5 space-y-1 text-[#524E47] text-xs">
                    {product.careInstructions.map((inst, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="text-[#C85A32]">•</span>
                        <span>{inst}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Accordion 5: Delivery & Returns */}
              <div className="py-3">
                <button
                  onClick={() => toggleAccordion('delivery')}
                  className="flex items-center justify-between w-full font-bold text-[#171715] hover:text-[#C85A32] transition-colors cursor-pointer"
                >
                  <span className="uppercase tracking-wider text-[11px]">Nationwide COD & Returns</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${openAccordions.delivery ? 'rotate-180' : ''}`} />
                </button>
                {openAccordions.delivery && (
                  <div className="pt-2.5 space-y-1.5 text-[#524E47] text-xs leading-relaxed">
                    <p>Orders are dispatched daily via Steadfast & Pathao courier networks.</p>
                    <p>You can open and inspect the parcel in front of the delivery partner. We offer free size exchanges within 7 days.</p>
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>

        {/* Complete The Look Section */}
        {completeLookProducts.length > 0 && (
          <div className="mt-16 sm:mt-24 pt-10 border-t border-[#E8E2D5]">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#C85A32]">
                  Style It With
                </span>
                <h2 className="font-serif text-2xl font-bold text-[#171715]">
                  Complete The Look
                </h2>
              </div>
              <button
                onClick={handleAddAllToLook}
                className="px-5 py-2.5 rounded-xl bg-[#171715] text-white hover:bg-[#C85A32] text-xs font-bold transition-colors cursor-pointer"
              >
                Add Look Pieces To Bag
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {completeLookProducts.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onOpenProduct(item.slug)}
                  className="group bg-white border border-[#E8E2D5] rounded-2xl p-3 flex gap-3 cursor-pointer hover:border-[#C85A32] transition-colors"
                >
                  <img
                    src={item.images[0]?.url}
                    alt={item.name}
                    className="w-20 h-20 rounded-xl object-cover bg-[#F5F2EA] shrink-0"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="font-serif font-bold text-xs text-[#171715] group-hover:text-[#C85A32] line-clamp-1">
                        {item.name}
                      </div>
                      <div className="text-[10px] text-[#857E73]">{item.ageLabel}</div>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <span className="font-bold text-xs font-sans text-[#171715]">৳{item.price}</span>
                      <span className="text-[10px] font-bold text-[#C85A32]">View Item →</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recently Viewed */}
        {recentlyViewedProducts.length > 0 && (
          <div className="mt-16 sm:mt-20 pt-10 border-t border-[#E8E2D5]">
            <h3 className="font-serif text-xl font-bold text-[#171715] mb-6">
              Recently Viewed
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              {recentlyViewedProducts.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onOpenProduct(item.slug)}
                  className="group cursor-pointer space-y-2"
                >
                  <div className="w-full aspect-4/5 rounded-2xl overflow-hidden bg-[#F5F2EA] border border-[#E8E2D5]">
                    <img
                      src={item.images[0]?.url}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500"
                    />
                  </div>
                  <div className="font-serif font-bold text-xs text-[#171715] group-hover:text-[#C85A32] line-clamp-1">
                    {item.name}
                  </div>
                  <div className="font-bold text-xs font-sans text-[#171715]">
                    ৳{item.price}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      {/* Mobile Sticky Add-To-Bag Action Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FCFAF7]/95 backdrop-blur-md border-t border-[#E8E2D5] p-3 shadow-lg flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="font-serif font-bold text-xs text-[#171715] truncate">
            {product.name}
          </div>
          <div className="flex items-center gap-1.5 text-[11px]">
            <span className="font-bold text-[#C85A32] font-sans">
              ৳{displayPrice.toLocaleString()}
            </span>
            <span className="text-[#857E73]">·</span>
            <span className="font-semibold text-[#171715]">
              {selectedVariant ? selectedVariant.size.label : 'Select Size'}
            </span>
          </div>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={!selectedVariant || selectedVariant.inventoryQuantity === 0}
          className="px-5 py-2.5 rounded-xl bg-[#C85A32] hover:bg-[#B24E2A] text-white text-xs font-bold transition-all shadow-sm shrink-0 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>
            {!selectedVariant
              ? 'Choose Size'
              : selectedVariant.inventoryQuantity === 0
              ? 'Sold Out'
              : 'Add to Bag'}
          </span>
        </button>
      </div>

      {/* Size Guide Modal */}
      <SizeGuideModal
        isOpen={sizeGuideOpen}
        onClose={() => setSizeGuideOpen(false)}
        initialTab={isShoe ? 'shoes' : 'clothing'}
      />

      {/* Fit Finder Drawer */}
      <FitFinderDrawer
        isOpen={fitFinderOpen}
        onClose={() => setFitFinderOpen(false)}
        isShoe={isShoe}
        onApplySize={(sizeId) => setSelectedSizeId(sizeId)}
      />
    </div>
  );
};
