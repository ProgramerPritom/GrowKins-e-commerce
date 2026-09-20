import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, Sparkles, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  location: string;
  avatar: string;
  rating: number;
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote: 'My daughter has reached for the Woodland Balance Friends every morning for three weeks.',
    author: 'Maya S.',
    role: 'Mum of two (aged 2 & 4)',
    location: 'Dhanmondi, Dhaka',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    rating: 5
  },
  {
    quote: 'Finally, genuine chemical-free wooden toys in Bangladesh. Delivery was next-day with cash on delivery.',
    author: 'Tanvir & Farah Ahmed',
    role: 'Parents of 18M baby',
    location: 'Uttara, Dhaka',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    rating: 5
  },
  {
    quote: 'The Sunrise Stacking Arch transformed our living room. Peaceful, screen-free playtime that lasts over an hour!',
    author: 'Nusrat Jahan',
    role: 'Mother & Early Educator',
    location: 'Gulshan, Dhaka',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    rating: 5
  },
  {
    quote: 'Ordered from Chittagong with cash on delivery. Courier called ahead and parcel arrived in perfect condition.',
    author: 'Dr. Sabina Yasmin',
    role: 'Pediatrician & Mother of 3Y',
    location: 'Nasirabad, Chattogram',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
    rating: 5
  }
];

export const UgcMosaic: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-advance testimonials every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const current = TESTIMONIALS[currentIndex];

  return (
    <section className="py-12 sm:py-20 md:py-28 bg-[#FAF7F1] border-b border-[#E8E0D2]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-left mb-8 sm:mb-12 space-y-2">
          <div className="text-[11px] font-bold tracking-widest uppercase text-[#757169] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#A67E14]" />
            <span>See It In Their World</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#24221F]">
            Real play is beautifully imperfect.
          </h2>
          <p className="text-xs sm:text-base text-[#6E6A63] max-w-xl">
            Towers tumble, pieces scatter across the floorboards, and that is exactly how little brains learn. Real moments from real playrooms across Bangladesh.
          </p>
        </div>

        {/* Asymmetrical Lifestyle Mosaic Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
          
          {/* Large Left Image */}
          <div className="lg:col-span-6 rounded-[24px] sm:rounded-[28px] overflow-hidden bg-[#F4EFE6] border border-[#E8E0D2] shadow-xs relative aspect-[4/3] lg:aspect-auto group">
            <img
              src="https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=1000&q=80"
              alt="Parent and child engaged in quiet building play on the rug"
              className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />
            <div className="absolute bottom-4 left-4 right-4 sm:bottom-5 sm:left-5 sm:right-5 text-white text-left">
              <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider bg-white/20 backdrop-blur-xs px-2.5 py-1 rounded-full">
                Living Room Moments
              </span>
              <p className="text-xs sm:text-sm font-medium mt-1.5 sm:mt-2 text-white/90">
                "No screens needed. Just thirty uninterrupted minutes of quiet imagination."
              </p>
            </div>
          </div>

          {/* Right Side: 2 Images (side-by-side on mobile) + Testimonial Slider Card (Item 5) */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-3.5 sm:gap-6">
            
            {/* Top Right Image 1 */}
            <div className="rounded-[20px] sm:rounded-[24px] overflow-hidden bg-[#F4EFE6] border border-[#E8E0D2] relative aspect-square group">
              <img
                src="https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=600&q=80"
                alt="Child stacking wooden animals"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Top Right Image 2 */}
            <div className="rounded-[20px] sm:rounded-[24px] overflow-hidden bg-[#F4EFE6] border border-[#E8E0D2] relative aspect-square group">
              <img
                src="https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=600&q=80"
                alt="Montessori stacking rainbow and crayons"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Bottom Full-Width Parent Review Slider Card with Profile Pictures */}
            <div className="col-span-2 rounded-[20px] sm:rounded-[24px] bg-[#FCE8E3] border border-[#F3CCC2] p-5 sm:p-7 text-left relative flex flex-col justify-between shadow-xs overflow-hidden min-h-[200px] sm:min-h-[220px]">
              
              {/* Header row with quote mark and slide controls */}
              <div className="flex items-center justify-between mb-3">
                <Quote className="w-7 h-7 text-[#F28F79] opacity-50" />
                
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handlePrev}
                    className="w-7 h-7 rounded-full bg-white/80 hover:bg-white text-[#24221F] flex items-center justify-center transition-colors shadow-2xs cursor-pointer active:scale-90"
                    aria-label="Previous review"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="w-7 h-7 rounded-full bg-white/80 hover:bg-white text-[#24221F] flex items-center justify-center transition-colors shadow-2xs cursor-pointer active:scale-90"
                    aria-label="Next review"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Animated Sliding Quote & Profile */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] as const }}
                  className="space-y-4"
                >
                  <blockquote className="font-serif text-lg sm:text-xl font-semibold text-[#24221F] leading-snug">
                    “{current.quote}”
                  </blockquote>

                  <div className="flex items-center justify-between border-t border-[#F3CCC2]/70 pt-3">
                    
                    {/* Profile Picture & Details */}
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-white shadow-2xs bg-white shrink-0">
                        <img
                          src={current.avatar}
                          alt={current.author}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-[#24221F] flex items-center gap-1">
                          <span>{current.author}</span>
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#4F7A5E] fill-[#4F7A5E]/10" />
                        </div>
                        <div className="text-xs text-[#757169]">
                          {current.role} · <span className="text-[#24221F] font-medium">{current.location}</span>
                        </div>
                      </div>
                    </div>

                    {/* 5 Stars */}
                    <div className="flex items-center gap-0.5 text-[#D96F58]">
                      {[...Array(current.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current text-[#D96F58]" />
                      ))}
                    </div>

                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Slider Dots */}
              <div className="flex items-center justify-center gap-1 mt-3">
                {TESTIMONIALS.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      idx === currentIndex ? 'w-5 bg-[#F28F79]' : 'w-1.5 bg-[#F3CCC2]'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
