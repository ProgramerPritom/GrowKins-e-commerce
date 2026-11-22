import React, { useState, useEffect, useCallback } from 'react';
import { 
  X, Play, Image as ImageIcon, Star, Check, ShieldCheck, 
  Truck, Plus, Minus, ShoppingBag, ArrowRight, Sparkles,
  ChevronLeft, ChevronRight, ExternalLink, Video
} from 'lucide-react';
import { getBengaliProductDetails } from './bengaliToyData';

interface ToyProductDetailModalProps {
  product: any;
  onClose: () => void;
  onAddToCart: (product: any, qty: number) => void;
  onScrollToCheckout: () => void;
  initialTab?: 'video' | 'gallery';
}

export const ToyProductDetailModal: React.FC<ToyProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onScrollToCheckout,
  initialTab = 'gallery'
}) => {
  const [activeMediaTab, setActiveMediaTab] = useState<'video' | 'gallery'>(initialTab);
  const [currentSlideIdx, setCurrentSlideIdx] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  // Extract rich Bengali details
  const bData = getBengaliProductDetails(product);

  const price = Number(product.price) || 0;
  const originalPrice = Number(product.originalPrice || product.compareAtPrice) || Math.round(price * 1.35);
  const discountAmount = originalPrice > price ? originalPrice - price : 0;

  // Extract all available gallery images (multi-angle support)
  const primaryImage = product.featuredImage || product.images?.main || (Array.isArray(product.images) ? product.images[0]?.url : '/items/busy-cube.jfif');
  const galleryImages: string[] = [];
  if (primaryImage) galleryImages.push(primaryImage);

  // Extract from images object (main, secondary, childHolding, inPlay, detail, scaleRef)
  if (product.images && typeof product.images === 'object' && !Array.isArray(product.images)) {
    const keys = ['secondary', 'childHolding', 'inPlay', 'detail', 'scaleRef'];
    keys.forEach((key) => {
      const val = (product.images as any)[key];
      if (val && typeof val === 'string' && !galleryImages.includes(val)) {
        galleryImages.push(val);
      }
    });
  }

  // Extract from images array
  if (Array.isArray(product.images)) {
    product.images.forEach((img: any) => {
      const url = typeof img === 'string' ? img : img?.url;
      if (url && typeof url === 'string' && !galleryImages.includes(url)) {
        galleryImages.push(url);
      }
    });
  } else if (product.images?.gallery && Array.isArray(product.images.gallery)) {
    product.images.gallery.forEach((url: string) => {
      if (url && typeof url === 'string' && !galleryImages.includes(url)) {
        galleryImages.push(url);
      }
    });
  }

  // Carousel navigation handlers
  const handlePrevSlide = useCallback(() => {
    if (galleryImages.length <= 1) return;
    setCurrentSlideIdx((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  }, [galleryImages.length]);

  const handleNextSlide = useCallback(() => {
    if (galleryImages.length <= 1) return;
    setCurrentSlideIdx((prev) => (prev + 1) % galleryImages.length);
  }, [galleryImages.length]);

  // Keyboard navigation (Left/Right arrow keys & Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (activeMediaTab === 'gallery') {
        if (e.key === 'ArrowLeft') handlePrevSlide();
        if (e.key === 'ArrowRight') handleNextSlide();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, activeMediaTab, handlePrevSlide, handleNextSlide]);

  // Touch Swipe Handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) handleNextSlide();
      else handlePrevSlide();
    }
    setTouchStartX(null);
  };

  // YouTube Embed Parser with clean ID extraction
  const getYouTubeId = (url?: string): string | null => {
    if (!url || typeof url !== 'string' || !url.trim()) return null;
    const targetUrl = url.trim();
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/|live\/)([^#&?]*).*/;
    const match = targetUrl.match(regExp);
    if (match && match[2] && match[2].length === 11) {
      return match[2];
    }
    // Direct 11-char ID
    if (targetUrl.length === 11 && !targetUrl.includes('/') && !targetUrl.includes('.') && !targetUrl.includes('?')) {
      return targetUrl;
    }
    return null;
  };

  const rawUrl = (product.videoUrl && String(product.videoUrl).trim()) || (bData.videoUrl && String(bData.videoUrl).trim()) || '';
  const videoId = getYouTubeId(rawUrl);
  const videoEmbedUrl = videoId ? `https://www.youtube.com/embed/${videoId}?rel=0` : '';
  const rawVideoLink = rawUrl.startsWith('http') ? rawUrl : (videoId ? `https://www.youtube.com/watch?v=${videoId}` : '');

  const handleOrderNow = () => {
    onAddToCart(product, quantity);
    onClose();
    setTimeout(() => {
      onScrollToCheckout();
    }, 200);
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl md:rounded-[32px] w-[96vw] max-w-7xl h-[92vh] max-h-[94vh] shadow-2xl border border-gray-100 flex flex-col relative overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Top Header Bar */}
        <div className="px-5 sm:px-8 py-4 sm:py-5 border-b border-gray-100 flex items-center justify-between gap-4 bg-white/95 backdrop-blur-sm sticky top-0 z-30 shrink-0">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 min-w-0">
            <span className="px-3.5 py-1 rounded-full text-xs font-black bg-[#24221F] text-white uppercase tracking-wider shadow-xs">
              {bData.ageBadge}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-black bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-rose-500" />
              <span>স্পেশাল অফার</span>
            </span>
            <div className="hidden sm:flex items-center gap-1 text-amber-500 text-xs font-bold bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/60">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>4.9 (১০০+ সন্তুষ্ট অভিভাবক)</span>
            </div>
          </div>

          {/* Close Modal Button */}
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-black flex items-center justify-center font-black transition-all cursor-pointer shadow-sm hover:scale-105 shrink-0"
            title="বন্ধ করুন (Esc)"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6">
          {/* Product Headline & Subtitle */}
          <div className="space-y-1.5">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#24221F] leading-tight">
              {bData.bName}
            </h2>
            <p className="text-sm sm:text-base text-gray-500 font-medium">
              {bData.bSubtitle}
            </p>
          </div>

          {/* 2-Column Responsive Layout (Spacious Desktop View) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
            
            {/* LEFT COLUMN: Media Showcase (Video & Photo Carousel) */}
            <div className="lg:col-span-7 xl:col-span-7 space-y-4">
              {/* Media Switcher Tab */}
              <div className="flex items-center gap-2 bg-gray-100 p-1.5 rounded-2xl w-fit shadow-inner">
                <button
                  type="button"
                  onClick={() => setActiveMediaTab('gallery')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                    activeMediaTab === 'gallery'
                      ? 'bg-[#24221F] text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <ImageIcon className="w-4 h-4" />
                  <span>ছবির গ্যালারি ({galleryImages.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveMediaTab('video')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                    activeMediaTab === 'video'
                      ? 'bg-rose-600 text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>ভিডিও ডেমো</span>
                </button>
              </div>

              {/* Main Media Viewport */}
              <div 
                className="aspect-[16/11] sm:aspect-[16/10] bg-gray-900 rounded-3xl overflow-hidden relative shadow-lg border border-gray-200 select-none group"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                {activeMediaTab === 'video' ? (
                  /* YouTube Video Player Embed or Empty Notice */
                  videoId ? (
                    <div className="relative w-full h-full bg-black flex flex-col justify-between">
                      <iframe
                        src={videoEmbedUrl}
                        title={bData.bName}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                        className="w-full h-full border-0"
                      />
                      {/* External Link Fallback Bar */}
                      {rawVideoLink && (
                        <div className="absolute bottom-2 right-2 z-10">
                          <a
                            href={rawVideoLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-xl bg-black/75 hover:bg-black text-white text-[11px] font-bold flex items-center gap-1.5 shadow-md backdrop-blur-sm transition-all"
                          >
                            <Video className="w-3.5 h-3.5 text-rose-400" />
                            <span>ইউটিউবে সরাসরি দেখুন</span>
                            <ExternalLink className="w-3 h-3 text-gray-400" />
                          </a>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="relative w-full h-full bg-[#1A1816] flex flex-col items-center justify-center p-6 text-center text-white">
                      <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mb-3">
                        <Video className="w-7 h-7" />
                      </div>
                      <h4 className="text-base font-black text-white mb-1.5">
                        ভিডিও ডেমো এখনও যুক্ত করা হয়নি
                      </h4>
                      <p className="text-xs text-gray-400 max-w-sm mb-4 leading-relaxed">
                        প্রোভাইডার পোর্টাল (<span className="text-[#E76F51]">/provider</span>) থেকে পণ্যটি এডিট করে ইউটিউব ভিডিও লিংক দিলে এখানে সরাসরি ভিডিও ডেমো চলবে।
                      </p>
                      <button
                        type="button"
                        onClick={() => setActiveMediaTab('gallery')}
                        className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center gap-2 border border-white/10 cursor-pointer"
                      >
                        <ImageIcon className="w-4 h-4" />
                        <span>পণ্যের ছবিসমূহ দেখুন ({galleryImages.length})</span>
                      </button>
                    </div>
                  )
                ) : (
                  /* Image Carousel Viewport */
                  <div className="relative w-full h-full bg-gray-50 flex items-center justify-center">
                    <img
                      src={galleryImages[currentSlideIdx] || primaryImage}
                      alt={`${bData.bName} - ভিউ ${currentSlideIdx + 1}`}
                      className="w-full h-full object-contain sm:object-cover transition-transform duration-300"
                    />

                    {/* Slide Counter Badge */}
                    <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-bold shadow-md">
                      ছবি {currentSlideIdx + 1} / {galleryImages.length}
                    </div>

                    {/* Carousel Navigation Buttons (Left / Right) */}
                    {galleryImages.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); handlePrevSlide(); }}
                          className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white/90 hover:bg-white text-gray-900 shadow-xl flex items-center justify-center transition-all cursor-pointer hover:scale-110 active:scale-95 border border-gray-100"
                          title="পূর্বের ছবি"
                        >
                          <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); handleNextSlide(); }}
                          className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white/90 hover:bg-white text-gray-900 shadow-xl flex items-center justify-center transition-all cursor-pointer hover:scale-110 active:scale-95 border border-gray-100"
                          title="পরের ছবি"
                        >
                          <ChevronRight className="w-6 h-6 stroke-[2.5]" />
                        </button>
                      </>
                    )}

                    {/* Carousel Dots Indicator */}
                    {galleryImages.length > 1 && (
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md">
                        {galleryImages.map((_, dotIdx) => (
                          <button
                            key={dotIdx}
                            type="button"
                            onClick={() => setCurrentSlideIdx(dotIdx)}
                            className={`h-2 rounded-full transition-all cursor-pointer ${
                              dotIdx === currentSlideIdx 
                                ? 'w-6 bg-[#E76F51]' 
                                : 'w-2 bg-white/70 hover:bg-white'
                            }`}
                            title={`ছবি ${dotIdx + 1}`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Thumbnails Carousel Reel */}
              {galleryImages.length > 1 && (
                <div className="space-y-1.5">
                  <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                    বিভিন্ন অ্যাঙ্গেল ও ক্লোজ-আপ ছবিসমূহ:
                  </p>
                  <div className="flex items-center gap-2.5 overflow-x-auto pb-2 pt-1 scrollbar-thin">
                    {galleryImages.map((imgUrl, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setCurrentSlideIdx(idx);
                          setActiveMediaTab('gallery');
                        }}
                        className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer bg-white ${
                          activeMediaTab === 'gallery' && currentSlideIdx === idx
                            ? 'border-[#E76F51] shadow-lg scale-105 ring-4 ring-[#E76F51]/20'
                            : 'border-gray-200 hover:border-gray-400 opacity-80 hover:opacity-100'
                        }`}
                      >
                        <img 
                          src={imgUrl} 
                          alt={`angle-${idx}`} 
                          className="w-full h-full object-cover" 
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Trust & Guarantee Banner */}
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-bold flex items-center gap-3 shadow-xs">
                <Truck className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>সারা বাংলাদেশে ক্যাশ অন ডেলিভারি — পণ্য হাতে পেয়ে খুলে চেক করে মূল্য পরিশোধ করুন!</span>
              </div>
            </div>

            {/* RIGHT COLUMN: Pricing, Benefits, Safety & Instant Order */}
            <div className="lg:col-span-5 xl:col-span-5 space-y-5">
              
              {/* Pricing Card */}
              <div className="bg-[#FAF7F1] p-5 sm:p-6 rounded-3xl border border-[#E8E0D2] shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase text-gray-400 tracking-wider">
                    বিশেষ অফার মূল্য
                  </span>
                  {discountAmount > 0 && (
                    <span className="px-3 py-1 rounded-xl text-xs font-black bg-[#E76F51] text-white shadow-xs animate-pulse">
                      ৳{discountAmount} ছাড়!
                    </span>
                  )}
                </div>

                <div className="flex items-baseline gap-3">
                  <span className="text-3xl sm:text-4xl font-black text-[#2D6A4F]">
                    ৳{price}
                  </span>
                  {originalPrice > price && (
                    <span className="text-base sm:text-lg font-bold text-rose-500 line-through">
                      ৳{originalPrice}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 font-semibold">
                  * স্টক সীমিত • আজকের অর্ডারে হোম ডেলিভারি নিশ্চয়তা
                </p>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-gray-800">
                  খেলনাটির বিস্তারিত বিবরণ:
                </h4>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
                  {bData.description}
                </p>
              </div>

              {/* Key Features & Benefits (Checkmark List) */}
              <div className="space-y-2.5 pt-1">
                <h4 className="text-xs font-black uppercase tracking-wider text-gray-800">
                  প্রধান বৈশিষ্ট্য ও শিশুর বিকাশগত উপকারিতা:
                </h4>
                <div className="space-y-2">
                  {bData.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-800">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span className="font-semibold leading-snug">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Materials & Child Safety Assurance */}
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 text-xs space-y-1.5">
                <div className="flex items-center gap-2 text-gray-900 font-black">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>উপাদান ও শিশুর নিরাপত্তা সনদ:</span>
                </div>
                <p className="text-gray-600 text-xs leading-relaxed pl-7 font-medium">
                  {bData.materials}
                </p>
              </div>

              {/* Order Quantity Stepper & Instant Order CTA */}
              <div className="pt-4 border-t border-gray-200 space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm font-bold text-gray-800">
                    অর্ডার পরিমাণ (Quantity):
                  </span>
                  <div className="flex items-center gap-3 bg-gray-100 rounded-2xl p-1.5 shadow-inner">
                    <button
                      type="button"
                      onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                      className="w-8 h-8 rounded-xl bg-white text-gray-700 hover:bg-gray-50 flex items-center justify-center shadow-sm cursor-pointer font-bold transition-all hover:scale-105 active:scale-95"
                      title="পরিমাণ কমান"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-black px-3 text-sm text-gray-900 min-w-8 text-center">
                      {quantity} টি
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(prev => prev + 1)}
                      className="w-8 h-8 rounded-xl bg-[#E76F51] text-white hover:bg-[#D45A3D] flex items-center justify-center shadow-sm cursor-pointer font-bold transition-all hover:scale-105 active:scale-95"
                      title="পরিমাণ বাড়ান"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Confirm Order CTA Button */}
                <button
                  type="button"
                  onClick={handleOrderNow}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#E76F51] via-[#E25C3C] to-[#D45A3D] hover:from-[#D45A3D] hover:to-[#C84F31] text-white font-black text-base shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2.5 cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>এখনই অর্ডার করুন (৳{price * quantity})</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
