import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../context/StoreContext';
import { PRODUCTS, MOCK_REVIEWS } from '../../data/products';
import { ProductCard } from '../catalog/ProductCard';
import { LightboxModal } from '../motion/LightboxModal';
import { 
  Star, Heart, Plus, Minus, ShieldCheck, Check, 
  PackageCheck, Truck, RotateCcw, ChevronDown, ChevronLeft, ChevronRight, Sparkles, Box, Maximize2
} from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const { 
    selectedProductId, 
    addToCart, 
    isInWishlist, 
    toggleWishlist, 
    setView 
  } = useStore();

  const product = PRODUCTS.find(p => p.id === selectedProductId) || PRODUCTS[0];
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(0);
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [reviewSlide, setReviewSlide] = useState(0);

  // Reset image selection when product changes
  useEffect(() => {
    setSelectedImageIndex(0);
  }, [product.id]);

  // Gallery items - supports dynamic gallery array or fallback fields
  const galleryList = useMemo(() => {
    if (product.images.gallery && product.images.gallery.length > 0) {
      return product.images.gallery.map((url, idx) => ({
        label: idx === 0 ? 'Primary Angle' : idx === 1 ? 'Detailed View' : `Angle ${idx + 1}`,
        url
      }));
    }

    const raw = [
      { label: 'Studio Cutout', url: product.images.main },
      { label: 'Secondary Angle', url: product.images.secondary },
      product.images.childHolding && { label: 'In Little Hands', url: product.images.childHolding },
      product.images.inPlay && { label: 'In Play Action', url: product.images.inPlay },
      product.images.detail && { label: 'Craft Detail', url: product.images.detail },
      product.images.scaleRef && { label: 'Scale Reference', url: product.images.scaleRef }
    ].filter(Boolean) as { label: string; url: string }[];

    const seen = new Set<string>();
    return raw.filter(item => {
      if (!item.url || seen.has(item.url)) return false;
      seen.add(item.url);
      return true;
    });
  }, [product.images]);

  const currentImageUrl = galleryList[selectedImageIndex]?.url || product.images.main;
  const allImages = galleryList.map(item => item.url);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1400);
  };

  const isFavorited = isInWishlist(product.id);

  // Related products ("Keep the play going")
  const relatedProducts = PRODUCTS.filter(p => p.id !== product.id).slice(0, 3);

  // FAQ list tailored for parents in Bangladesh in clean English
  const faqs = [
    {
      q: "How does Cash on Delivery (COD) work across Bangladesh?",
      a: "You pay zero advance payment. No bKash, Nogod, or credit card required upfront. Simply enter your delivery address and active phone number at checkout. Our courier partner (Steadfast/Pathao) brings the parcel to your doorstep anywhere in Bangladesh; you inspect the package and pay cash directly to the delivery person."
    },
    {
      q: "How long does delivery take and what are the delivery fees?",
      a: "Inside Dhaka city, orders are delivered within 24 to 48 hours (standard fee ৳70). Outside Dhaka across all 64 districts, doorstep delivery arrives in 2 to 4 business days (fee ৳130). All orders over ৳2,500 receive 100% Free Nationwide Shipping!"
    },
    {
      q: "Is this piece age-appropriate and developmentally aligned?",
      a: `Yes, this discovery is carefully scaled and calibrated for children aged ${product.ageBadge}. Its proportions, weight, and textures are aligned with international Montessori developmental milestones for fine motor dexterity, problem-solving, and sensory curiosity.`
    },
    {
      q: "What materials are used and is it safe if mouthed?",
      a: `Handcrafted from certified solid European beechwood (${product.materials.join(', ')}). Sealed with pure natural plant-based vegetable oils and organic beeswax. 100% free of lead, formaldehyde, phthalates, and harsh chemical varnishes.`
    },
    {
      q: "What is your doorstep inspection and exchange policy?",
      a: "You are welcome to inspect the package upon courier delivery. If any item arrives damaged or your child is not delighted, we provide a 3-day hassle-free doorstep exchange and return policy."
    }
  ];

  return (
    <div className="bg-[#FAF7F1] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs text-[#757169] mb-8">
          <button onClick={() => setView('home')} className="hover:text-[#24221F] transition-colors">
            Home
          </button>
          <span>›</span>
          <button onClick={() => setView('shop')} className="hover:text-[#24221F] transition-colors">
            Shop
          </button>
          <span>›</span>
          <span className="text-[#24221F] font-medium">{product.category}</span>
          <span>›</span>
          <span className="text-[#24221F] font-semibold">{product.name}</span>
        </nav>

        {/* Top Product Hero Split Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 mb-20 items-start">
          
          {/* LEFT: Multi-Angle Gallery */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Main Stage Image with Directional Crossfade & Lightbox Trigger */}
            <div 
              onClick={() => setLightboxOpen(true)}
              className="aspect-square sm:aspect-[4/3] rounded-[32px] overflow-hidden bg-white border border-[#E8E0D2] shadow-sm relative group cursor-zoom-in"
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImageIndex}
                  src={currentImageUrl}
                  alt={product.name}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] as const }}
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500 ease-out"
                />
              </AnimatePresence>

              {/* Tag Pill */}
              {product.tag && (
                <div className="absolute top-4 left-4 bg-[#F7E198] text-[#24221F] text-xs font-bold px-3 py-1 rounded-full shadow-xs pointer-events-none">
                  {product.tag}
                </div>
              )}

              {/* Expand to fullscreen badge */}
              <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md rounded-full p-2.5 shadow-md border border-white/80 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Maximize2 className="w-4 h-4 text-[#24221F]" />
              </div>
            </div>

            {/* Thumbnail Strip */}
            <div className={`grid gap-2 sm:gap-3 ${
              galleryList.length <= 3 
                ? 'grid-cols-3 max-w-xs' 
                : galleryList.length <= 4 
                ? 'grid-cols-4 max-w-sm' 
                : 'grid-cols-6'
            }`}>
              {galleryList.map((item, idx) => (
                <motion.button
                  key={idx}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all p-0.5 bg-white relative ${
                    selectedImageIndex === idx 
                      ? 'border-[#1C4CB8] ring-2 ring-[#1C4CB8]/20' 
                      : 'border-[#E8E0D2] opacity-75 hover:opacity-100'
                  }`}
                  title={item.label}
                >
                  <img
                    src={item.url}
                    alt={item.label}
                    className="w-full h-full object-cover rounded-xl"
                  />
                </motion.button>
              ))}
            </div>

          </div>

          {/* RIGHT: Purchase Information Panel */}
          <div className="lg:col-span-5 text-left space-y-6">
            
            {/* Age Badge & Review Rating */}
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-[#FCF4DB] text-[#A67E14] text-xs font-mono font-bold tracking-wider uppercase">
                {product.ageBadge}
              </span>

              <div className="flex items-center gap-1.5 text-xs text-[#24221F]">
                <div className="flex text-[#A67E14]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <span className="font-bold">{product.rating}</span>
                <span className="text-[#757169]">· {product.reviewCount} parent reviews</span>
              </div>
            </div>

            {/* Title & Price */}
            <div>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#24221F]">
                {product.name}
              </h1>
              <div className="mt-3 flex items-baseline gap-3">
                <span className="font-bold text-3xl text-[#24221F] font-sans">
                  ৳{product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-base text-[#A8A49C] line-through font-sans">
                    ৳{product.originalPrice}
                  </span>
                )}
                <span className="text-xs text-[#4F7A5E] bg-[#E6EFE9] px-2.5 py-0.5 rounded-full font-semibold">
                  In Stock · Cash on Delivery Across Bangladesh
                </span>
              </div>
            </div>

            {/* Sensory Play Quote */}
            <p className="font-serif italic text-base text-[#4D4943] bg-[#F4EFE6] p-4 rounded-2xl border border-[#E8E0D2]">
              {product.sensoryQuote}
            </p>

            {/* Key Developmental Benefits */}
            <div className="space-y-2 border-y border-[#E8E0D2] py-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#757169]">
                Key Developmental Milestones
              </span>
              <div className="flex flex-wrap gap-2 pt-1">
                {product.benefits.map((benefit, idx) => (
                  <span 
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E8E0D2] text-xs font-semibold text-[#24221F]"
                  >
                    <Sparkles className="w-3 h-3 text-[#A67E14]" />
                    {benefit}
                  </span>
                ))}
              </div>
            </div>

            {/* Value Statement */}
            <p className="text-sm text-[#6E6A63] leading-relaxed">
              {product.description}
            </p>

            {/* Quantity Selector & Action CTAs */}
            <div className="space-y-4 pt-2">
              
              <div className="flex items-center gap-4">
                {/* Stepper */}
                <div className="flex items-center border border-[#D9D3C7] rounded-full px-3 py-2 bg-white">
                  <motion.button 
                    whileTap={{ scale: 0.85 }}
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-6 h-6 flex items-center justify-center text-[#757169] hover:text-[#24221F] transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </motion.button>
                  <span className="w-8 text-center font-bold text-sm text-[#24221F]">
                    {quantity}
                  </span>
                  <motion.button 
                    whileTap={{ scale: 0.85 }}
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-6 h-6 flex items-center justify-center text-[#757169] hover:text-[#24221F] transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </motion.button>
                </div>

                {/* Primary Add to Bag Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleAddToCart}
                  disabled={addedAnimation}
                  className={`flex-1 py-3.5 px-8 rounded-full text-sm font-semibold flex items-center justify-center gap-2 shadow-md transition-all duration-200 ${
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
                        <Check className="w-4 h-4" /> Added to Bag ✓
                      </motion.span>
                    ) : (
                      <motion.span
                        key="add"
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.85 }}
                        className="flex items-center gap-1.5"
                      >
                        <span>Add to Bag</span>
                        <span>·</span>
                        <span>৳{product.price * quantity}</span>
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>

                {/* Wishlist Button */}
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => toggleWishlist(product.id)}
                  className={`w-12 h-12 rounded-full border border-[#D9D3C7] bg-white flex items-center justify-center transition-colors shadow-2xs ${
                    isFavorited ? 'text-[#F28F79] border-[#F28F79]' : 'text-[#757169] hover:text-[#24221F]'
                  }`}
                  title="Save to Wishlist"
                >
                  <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
                </motion.button>
              </div>

              {/* Cash on Delivery Notice Card (Reassurance) */}
              <div className="p-4 rounded-2xl bg-[#FCF4DB]/70 border border-[#F2E0B2] text-xs text-[#24221F] space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-[#856404]">
                  <PackageCheck className="w-4 h-4 text-[#A67E14]" />
                  <span>100% Cash on Delivery Across Bangladesh</span>
                </div>
                <p className="text-[#5E4D1D] leading-relaxed">
                  Pay cash only after inspecting your parcel at your doorstep. Zero advance bKash or online card payment required.
                </p>
              </div>

              {/* Delivery & Returns Reassurance */}
              <div className="grid grid-cols-3 gap-2 pt-2 text-[11px] text-[#757169]">
                <div className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-[#1C4CB8]" />
                  <span>Dhaka: 24–48h</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <RotateCcw className="w-3.5 h-3.5 text-[#F28F79]" />
                  <span>Doorstep Inspection</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#A3C1AD]" />
                  <span>Phone Confirmation</span>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* Product Story: Why Little Ones Love It */}
        <div className="bg-white rounded-[32px] p-8 sm:p-12 border border-[#E8E0D2] mb-16 text-left shadow-xs">
          <div className="max-w-3xl space-y-4">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#1C4CB8]">
              Playroom Story
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#24221F]">
              Why little ones love it
            </h2>
            <p className="text-base sm:text-lg text-[#6E6A63] leading-relaxed">
              {product.whyKidsLoveIt}
            </p>
          </div>

          {/* 3 Developmental Milestones */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 pt-8 border-t border-[#FAF7F1]">
            {product.developmentMilestones.map((milestone, idx) => (
              <div key={idx} className="space-y-1">
                <span className="text-xs font-mono font-bold text-[#A67E14] block">
                  0{idx + 1}
                </span>
                <h3 className="font-serif font-bold text-base text-[#24221F]">
                  {milestone.title}
                </h3>
                <p className="text-xs text-[#757169] leading-relaxed">
                  {milestone.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* What's In The Box Section */}
        <div className="bg-[#FAF7F1] rounded-[32px] p-8 sm:p-12 border border-[#E8E0D2] mb-16 text-left">
          <div className="flex items-center gap-2 mb-6">
            <Box className="w-5 h-5 text-[#1C4CB8]" />
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#24221F]">
              What's in the box
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {product.whatsInside.map((item, idx) => (
              <div key={idx} className="bg-white p-4 rounded-2xl border border-[#E8E0D2] flex items-center justify-between">
                <div>
                  <div className="font-semibold text-sm text-[#24221F]">{item.name}</div>
                  <div className="text-xs text-[#757169]">{item.detail}</div>
                </div>
                <span className="text-xs font-mono font-bold text-[#1C4CB8] bg-[#FAF7F1] px-2.5 py-1 rounded-full border border-[#E8E0D2]">
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Parent FAQs with Smooth Framer Motion Accordion */}
        <div className="max-w-3xl mx-auto mb-20 text-left">
          <div className="text-center mb-8">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#757169]">
              Common Inquiries
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#24221F] mt-1">
              Parent questions answered
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaqIndex === idx;
              return (
                <div 
                  key={idx}
                  className="bg-white rounded-2xl border border-[#E8E0D2] overflow-hidden transition-all shadow-2xs"
                >
                  <button
                    onClick={() => setActiveFaqIndex(isOpen ? null : idx)}
                    className="w-full p-5 text-left font-semibold text-sm text-[#24221F] flex items-center justify-between gap-4"
                  >
                    <span>{faq.q}</span>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="w-4 h-4 text-[#757169]" />
                    </motion.div>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] as const }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 text-xs sm:text-sm text-[#6E6A63] leading-relaxed border-t border-[#FAF7F1] pt-3">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* Loved in Real Playrooms: Interactive Reviews Slider (Item 8) */}
        <div className="bg-white rounded-[32px] p-8 sm:p-12 border border-[#E8E0D2] mb-20 text-left shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#757169]">
                Verified Feedback
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#24221F] mt-1">
                Loved in real playrooms.
              </h2>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="font-serif text-3xl font-bold text-[#24221F]">4.9</div>
                  <div className="text-xs text-[#757169]">Based on {product.reviewCount} reviews</div>
                </div>
                <div className="flex text-[#A67E14]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
              </div>

              {/* Slider Prev / Next Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setReviewSlide(prev => (prev - 1 + Math.ceil(MOCK_REVIEWS.length / 2)) % Math.ceil(MOCK_REVIEWS.length / 2))}
                  className="w-9 h-9 rounded-full border border-[#D9D3C7] bg-[#FAF7F1] text-[#24221F] hover:bg-white flex items-center justify-center transition-all shadow-2xs cursor-pointer active:scale-95"
                  aria-label="Previous review slide"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setReviewSlide(prev => (prev + 1) % Math.ceil(MOCK_REVIEWS.length / 2))}
                  className="w-9 h-9 rounded-full border border-[#D9D3C7] bg-[#FAF7F1] text-[#24221F] hover:bg-white flex items-center justify-center transition-all shadow-2xs cursor-pointer active:scale-95"
                  aria-label="Next review slide"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Animated Review Cards Grid / Slide */}
          <AnimatePresence mode="wait">
            <motion.div
              key={reviewSlide}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] as const }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {MOCK_REVIEWS.slice(reviewSlide * 2, reviewSlide * 2 + 2).map((review) => (
                <div key={review.id} className="bg-[#FAF7F1] rounded-2xl p-6 border border-[#E8E0D2] flex flex-col justify-between shadow-2xs">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex text-[#A67E14]">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>
                      <span className="text-[11px] text-[#A8A49C]">{review.date}</span>
                    </div>

                    <h4 className="font-serif font-bold text-base text-[#24221F] mb-1">
                      "{review.title}"
                    </h4>
                    <p className="text-xs sm:text-sm text-[#6E6A63] leading-relaxed">
                      {review.content}
                    </p>
                  </div>

                  <div className="mt-4 pt-4 border-t border-[#E8E0D2] flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-[#24221F]">{review.author}</span>
                      <span className="text-[#757169] block text-[11px]">{review.authorRole}</span>
                    </div>
                    {review.verified && (
                      <span className="px-2 py-0.5 rounded-full bg-[#E6EFE9] text-[#4F7A5E] text-[10px] font-bold">
                        Verified Play-Tester
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Dots Indicator */}
          <div className="flex items-center justify-center gap-1.5 mt-8">
            {Array.from({ length: Math.ceil(MOCK_REVIEWS.length / 2) }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setReviewSlide(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  idx === reviewSlide ? 'w-6 bg-[#24221F]' : 'w-2 bg-[#E8E0D2] hover:bg-[#A8A49C]'
                }`}
                aria-label={`Go to review slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Keep the Play Going: Related Products */}
        <div className="text-left mb-12">
          <div className="mb-8">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#757169]">
              Complementary Pieces
            </span>
            <h2 className="font-serif text-3xl font-bold text-[#24221F] mt-1">
              Keep the play going.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>

      </div>

      {/* Fullscreen Lightbox Modal */}
      <LightboxModal
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        images={allImages}
        currentIndex={selectedImageIndex}
        onNavigate={(idx) => setSelectedImageIndex(idx)}
        title={product.name}
      />

      {/* Mobile Sticky Add to Cart Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-[#E8E0D2] p-3 px-4 flex items-center justify-between gap-3 shadow-lg">
        <div>
          <div className="font-semibold text-sm text-[#24221F] line-clamp-1">{product.name}</div>
          <div className="text-xs text-[#757169] font-bold font-sans">৳{product.price} · Cash on Delivery</div>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleAddToCart}
          className="px-6 py-2.5 rounded-full bg-[#24221F] text-white hover:bg-[#1C4CB8] text-xs font-bold shrink-0 shadow-sm"
        >
          {addedAnimation ? 'Added ✓' : 'Add to Bag'}
        </motion.button>
      </div>

    </div>
  );
};
