import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../context/StoreContext';
import { useLanguage } from '../../context/LanguageContext';
import { ArrowRight, Sparkles, Star, ChevronLeft, ChevronRight, ShieldCheck, Truck } from 'lucide-react';

const HERO_SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=1200&q=85',
    badgeAge: '0–8Y',
    badgeTitle: 'Montessori Open-Ended Play',
    badgeSubtitle: 'Screen-Free Sensory Development',
    alt: 'Child playing peacefully with wooden toys in a bright Montessori playroom'
  },
  {
    image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=1200&q=85',
    badgeAge: '1–5Y',
    badgeTitle: 'Natural Beechwood Stacking',
    badgeSubtitle: 'Tactile Equilibrium & Motor Skills',
    alt: 'Wooden rainbow stacking arch and handcrafted balancing toys'
  },
  {
    image: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=1200&q=85',
    badgeAge: '2–7Y',
    badgeTitle: 'Imaginative World Building',
    badgeSubtitle: 'Architectural Blocks & Animal Figures',
    alt: 'Parent and child building wooden block castles together'
  }
];

export const HeroPlayroom: React.FC = () => {
  const { setView, setFilter } = useStore();
  const { t } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Auto-advance slider every 4.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY, currentTarget } = e;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const x = (clientX - left) / width - 0.5;
    const y = (clientY - top) / height - 0.5;
    setMousePos({ x, y });
  };

  const slide = HERO_SLIDES[currentSlide];

  return (
    <section 
      onMouseMove={handleMouseMove}
      className="relative overflow-x-clip bg-gradient-to-b from-[#FCF4DB]/80 via-[#FAF7F1] to-[#FAF7F1] pt-8 pb-14 md:pt-16 md:pb-24 border-b border-[#E8E0D2]/60"
    >
      {/* Decorative organic background shapes */}
      <div 
        style={{
          transform: `translate(${mousePos.x * -18}px, ${mousePos.y * -18}px)`
        }}
        className="absolute -top-16 -left-16 w-96 h-96 rounded-full bg-[#F7E198]/30 blur-3xl pointer-events-none transition-transform duration-500 ease-out"
      />
      <div 
        style={{
          transform: `translate(${mousePos.x * 24}px, ${mousePos.y * 24}px)`
        }}
        className="absolute top-1/3 right-10 w-80 h-80 rounded-full bg-[#F28F79]/15 blur-3xl pointer-events-none transition-transform duration-500 ease-out"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
          
          {/* Left Editorial Copy */}
          <div className="lg:col-span-6 space-y-5 sm:space-y-6 text-left">
            
            {/* Subtle Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFFFFF]/80 border border-[#E8E0D2] shadow-xs text-xs font-semibold tracking-wider uppercase text-[#757169]">
              <Sparkles className="w-3.5 h-3.5 text-[#A67E14]" />
              <span>{t.hero.tag}</span>
            </div>

            {/* Headline */}
            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#24221F] leading-[1.12] sm:leading-[1.08]">
              {t.hero.headlinePart1}{' '}
              <span className="italic font-normal text-[#F28F79] inline-block hover:scale-105 transition-transform duration-300">
                {t.hero.headlineAccent}
              </span>{' '}
              {t.hero.headlinePart2}
            </h1>

            {/* Supporting paragraph */}
            <p className="text-base sm:text-xl text-[#6E6A63] max-w-lg leading-relaxed font-normal">
              {t.hero.subheading}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-2">
              <button
                onClick={() => {
                  setFilter('age', ['1–2Y', '3–5Y']);
                  setView('shop');
                }}
                className="px-7 py-3.5 sm:px-8 sm:py-4 rounded-full bg-[#24221F] text-[#FAF7F1] text-sm font-semibold hover:bg-[#1C4CB8] transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 active:scale-95 group cursor-pointer"
              >
                <span>{t.hero.shopByAge}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => setView('shop')}
                className="px-7 py-3.5 sm:px-8 sm:py-4 rounded-full bg-[#FFFFFF] border border-[#D9D3C7] text-[#24221F] text-sm font-semibold hover:bg-[#F4EFE6] transition-all duration-200 shadow-xs active:scale-95 cursor-pointer text-center"
              >
                {t.hero.exploreAll}
              </button>
            </div>

            {/* Reassurance microcopy with meaningful icons */}
            <div className="pt-4 flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-[#757169] border-t border-[#E8E0D2]/60 max-w-md">
              <span className="flex items-center gap-1.5 font-medium">
                <Truck className="w-4 h-4 text-[#4F7A5E] shrink-0" />
                {t.hero.codNotice}
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-4 h-4 text-[#A67E14] shrink-0" />
                {t.hero.woodNotice}
              </span>
            </div>

          </div>

          {/* Right Playroom Composition with Interactive Image Slider */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              
              {/* Main Playroom Image Slider Container */}
              <div 
                style={{
                  transform: `translate(${mousePos.x * -10}px, ${mousePos.y * -10}px)`
                }}
                className="relative rounded-[32px] overflow-hidden bg-[#FAF7F1] border-4 border-[#FFFFFF] shadow-2xl transition-transform duration-300 ease-out aspect-[4/3] group"
              >
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentSlide}
                    src={slide.image}
                    alt={slide.alt}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
                  />
                </AnimatePresence>

                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

                {/* Floating badge inside image, synchronized with active slide */}
                <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-md border border-white/80 flex items-center gap-3 z-10 max-w-[80%] sm:max-w-none">
                  <div className="w-9 h-9 rounded-xl bg-[#E6EFE9] flex items-center justify-center text-[#4F7A5E] font-bold text-xs shrink-0">
                    {slide.badgeAge}
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold text-[#24221F] line-clamp-1">{slide.badgeTitle}</div>
                    <div className="text-[11px] text-[#757169] line-clamp-1">{slide.badgeSubtitle}</div>
                  </div>
                </div>

                {/* Slider Navigation Arrows */}
                <div className="absolute top-1/2 -translate-y-1/2 left-3 right-3 flex items-center justify-between opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200 z-10 pointer-events-auto">
                  <button
                    onClick={handlePrevSlide}
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/90 backdrop-blur-sm text-[#24221F] hover:bg-white shadow-md flex items-center justify-center cursor-pointer active:scale-95 transition-all"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  <button
                    onClick={handleNextSlide}
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/90 backdrop-blur-sm text-[#24221F] hover:bg-white shadow-md flex items-center justify-center cursor-pointer active:scale-95 transition-all"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>

                {/* Slider Indicator Dots */}
                <div className="absolute top-4 right-4 flex items-center gap-1.5 z-10 bg-black/30 backdrop-blur-sm px-2.5 py-1 rounded-full">
                  {HERO_SLIDES.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlide(idx)}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        idx === currentSlide ? 'w-5 bg-white' : 'w-2 bg-white/60 hover:bg-white/80'
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>

              {/* Floating Tactile Cobalt Star Badge */}
              <div 
                style={{
                  transform: `translate(${mousePos.x * 20}px, ${mousePos.y * 20}px)`
                }}
                className="absolute -top-4 -left-2 sm:-top-8 sm:-left-8 w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#1C4CB8] text-white shadow-xl flex items-center justify-center transition-transform duration-300 ease-out hover:rotate-12 cursor-pointer z-20"
                title="100% Non-toxic & certified"
              >
                <Star className="w-5 h-5 sm:w-7 sm:h-7 fill-white text-white animate-pulse" />
              </div>

              {/* Floating Bottom Card */}
              <div 
                style={{
                  transform: `translate(${mousePos.x * 12}px, ${mousePos.y * 12}px)`
                }}
                onClick={() => setView('shop')}
                className="absolute -bottom-5 right-2 sm:-bottom-8 sm:-right-6 bg-white rounded-2xl p-3 sm:p-4 shadow-xl border border-[#E8E0D2] flex items-center gap-2.5 sm:gap-3 cursor-pointer hover:shadow-2xl transition-all duration-200 z-20 max-w-[85%] sm:max-w-none"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl overflow-hidden bg-[#FCF4DB] shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=200&q=80"
                    alt="Sunrise Arch"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-left pr-1 sm:pr-2">
                  <div className="text-xs font-semibold text-[#24221F] line-clamp-1">Sunrise Arch</div>
                  <div className="text-[10px] sm:text-[11px] text-[#A67E14] font-medium">Bestseller · ৳1,950</div>
                </div>
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#FAF7F1] flex items-center justify-center text-[#24221F] shrink-0">
                  <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
