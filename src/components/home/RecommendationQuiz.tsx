import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../context/StoreContext';
import { PRODUCTS } from '../../data/products';
import type { AgeRange, Interest, Occasion } from '../../types';
import { Sparkles, ArrowRight, RotateCcw } from 'lucide-react';

export const RecommendationQuiz: React.FC = () => {
  const { openProduct, addToCart, setView } = useStore();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [isCurating, setIsCurating] = useState(false);

  const [selectedAge, setSelectedAge] = useState<AgeRange | null>(null);
  const [selectedInterest, setSelectedInterest] = useState<Interest | null>(null);
  const [selectedOccasion, setSelectedOccasion] = useState<Occasion | null>(null);

  const ages: AgeRange[] = ['0–12M', '1–2Y', '3–5Y', '6–8Y', '9Y+'];
  const interests: Interest[] = ['Creating', 'Building', 'Exploring', 'Moving', 'Pretending', 'Reading'];
  const occasions: Occasion[] = ['Eid gift', 'Birthday', 'Akika / New baby', 'Everyday play', 'Gift'];

  const handleAgeSelect = (age: AgeRange) => {
    setSelectedAge(age);
    setDirection(1);
    setStep(2);
  };

  const handleInterestSelect = (interest: Interest) => {
    setSelectedInterest(interest);
    setDirection(1);
    setStep(3);
  };

  const handleOccasionSelect = (occasion: Occasion) => {
    setSelectedOccasion(occasion);
    setDirection(1);
    setIsCurating(true);
    setStep(4);
    setTimeout(() => {
      setIsCurating(false);
    }, 600);
  };

  const handleBack = (targetStep: 1 | 2 | 3) => {
    setDirection(-1);
    setStep(targetStep);
  };

  const handleReset = () => {
    setSelectedAge(null);
    setSelectedInterest(null);
    setSelectedOccasion(null);
    setDirection(-1);
    setStep(1);
  };

  // Compute matches
  const matchedProducts = PRODUCTS.filter(p => {
    if (selectedAge && p.ageGroup !== selectedAge) {
      // allow slight flexibility
    }
    if (selectedInterest && !p.interests.includes(selectedInterest)) {
      return false;
    }
    return true;
  });

  const displayList = matchedProducts.length > 0 ? matchedProducts : PRODUCTS.slice(0, 3);

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 30 : -30,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.28,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -30 : 30,
      opacity: 0,
      transition: {
        duration: 0.2,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    }),
  };

  return (
    <section className="py-12 sm:py-20 md:py-28 bg-[#1C4CB8] text-white relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        {/* Top Tracking */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[11px] sm:text-xs font-semibold tracking-widest uppercase mb-3 sm:mb-4 text-[#F7E198]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive Discovery Finder</span>
        </div>

        <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-2 sm:mb-3">
          Not sure where to start?
        </h2>

        <p className="text-sm sm:text-lg text-white/80 max-w-lg mx-auto mb-8 sm:mb-10">
          Tell us a little about them. We'll curate the three most loved pieces for their stage.
        </p>

        {/* Step Progress Tracker */}
        <div className="flex items-center justify-center gap-2.5 sm:gap-3 mb-8 sm:mb-10">
          {[1, 2, 3].map((s) => (
            <motion.div
              key={s}
              animate={{
                width: step === s ? 44 : 20,
                backgroundColor: step === s ? '#FFFFFF' : step > s ? '#A3C1AD' : 'rgba(255, 255, 255, 0.2)',
              }}
              transition={{ duration: 0.3 }}
              className="h-1.5 rounded-full"
            />
          ))}
        </div>

        {/* Dynamic Question Container */}
        <AnimatePresence mode="wait" custom={direction}>
          {/* Step 1: Age */}
          {step === 1 && (
            <motion.div
              key="step-1"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="max-w-2xl mx-auto"
            >
              <h3 className="text-lg sm:text-2xl font-serif font-semibold text-white mb-5 sm:mb-6">
                Step 1: How old are they?
              </h3>
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                {ages.map((age) => (
                  <motion.button
                    key={age}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => handleAgeSelect(age)}
                    className="px-4 py-2.5 sm:px-6 sm:py-3.5 rounded-full bg-white text-[#24221F] text-xs sm:text-sm font-semibold hover:bg-[#F7E198] transition-colors shadow-md cursor-pointer"
                  >
                    {age}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 2: Interests */}
          {step === 2 && (
            <motion.div
              key="step-2"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="max-w-2xl mx-auto"
            >
              <div className="flex items-center justify-center gap-2 mb-2 text-xs text-white/70">
                <span>Selected age: <strong>{selectedAge}</strong></span>
                <span>·</span>
                <button onClick={() => handleBack(1)} className="underline hover:text-white">Change</button>
              </div>
              <h3 className="text-lg sm:text-2xl font-serif font-semibold text-white mb-5 sm:mb-6">
                Step 2: What do they love doing most?
              </h3>
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                {interests.map((interest) => (
                  <motion.button
                    key={interest}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => handleInterestSelect(interest)}
                    className="px-4 py-2.5 sm:px-6 sm:py-3.5 rounded-full bg-white text-[#24221F] text-xs sm:text-sm font-semibold hover:bg-[#F7E198] transition-colors shadow-md cursor-pointer"
                  >
                    {interest}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 3: Occasion */}
          {step === 3 && (
            <motion.div
              key="step-3"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="max-w-2xl mx-auto"
            >
              <div className="flex items-center justify-center gap-2 mb-2 text-xs text-white/70">
                <span>Age: <strong>{selectedAge}</strong> · Interest: <strong>{selectedInterest}</strong></span>
                <span>·</span>
                <button onClick={() => handleBack(2)} className="underline hover:text-white">Change</button>
              </div>
              <h3 className="text-lg sm:text-2xl font-serif font-semibold text-white mb-5 sm:mb-6">
                Step 3: What are you shopping for?
              </h3>
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                {occasions.map((occasion) => (
                  <motion.button
                    key={occasion}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => handleOccasionSelect(occasion)}
                    className="px-4 py-2.5 sm:px-6 sm:py-3.5 rounded-full bg-white text-[#24221F] text-xs sm:text-sm font-semibold hover:bg-[#F7E198] transition-colors shadow-md cursor-pointer"
                  >
                    {occasion}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 4: Loading Curating State OR Matched Results */}
          {step === 4 && (
            <motion.div
              key="step-4"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
            >
              {isCurating ? (
                <div className="py-16 space-y-4">
                  <div className="flex items-center justify-center gap-2">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        animate={{ y: [0, -8, 0] }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          delay: i * 0.15,
                          ease: 'easeInOut',
                        }}
                        className="w-3 h-3 rounded-full bg-[#F7E198]"
                      />
                    ))}
                  </div>
                  <h4 className="font-serif text-2xl text-white">
                    Finding their next favorite…
                  </h4>
                  <p className="text-xs text-white/70">
                    Hand-picking play essentials for {selectedAge}
                  </p>
                </div>
              ) : (
                <div>
                  <div className="mb-8">
                    <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-2">
                      We found {displayList.length} thoughtful things for your little explorer!
                    </h3>
                    <p className="text-sm text-white/80">
                      Tailored for {selectedAge} · Loved for {selectedInterest?.toLowerCase()} · Perfect for {selectedOccasion?.toLowerCase()}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left mb-8">
                    {displayList.slice(0, 3).map((product, idx) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.08, duration: 0.3 }}
                        className="bg-white rounded-[24px] p-4 text-[#24221F] shadow-xl flex flex-col justify-between"
                      >
                        <div>
                          <div 
                            onClick={() => openProduct(product.id)}
                            className="aspect-square rounded-xl overflow-hidden bg-[#F4EFE6] mb-3 cursor-pointer group relative"
                          >
                            <img
                              src={product.images.main}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <span className="absolute top-2 left-2 bg-[#F7E198] text-[#24221F] text-[10px] font-bold px-2 py-0.5 rounded-full">
                              {product.ageBadge}
                            </span>
                          </div>

                          <h4 
                            onClick={() => openProduct(product.id)}
                            className="font-serif font-bold text-base hover:text-[#1C4CB8] cursor-pointer transition-colors"
                          >
                            {product.name}
                          </h4>
                          <p className="text-xs text-[#757169] mt-0.5 line-clamp-2">
                            {product.valueStatement}
                          </p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-[#FAF7F1] flex items-center justify-between">
                          <span className="font-bold text-base text-[#24221F]">
                            ৳{product.price}
                          </span>

                          <motion.button
                            whileTap={{ scale: 0.94 }}
                            onClick={() => addToCart(product, 1)}
                            className="py-2 px-3.5 rounded-full bg-[#24221F] text-white hover:bg-[#1C4CB8] text-xs font-semibold flex items-center gap-1 transition-colors"
                          >
                            <span>Add to Bag</span>
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="flex items-center justify-center gap-4">
                    <motion.button
                      whileTap={{ scale: 0.96 }}
                      onClick={handleReset}
                      className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Start over</span>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => setView('shop')}
                      className="px-6 py-2.5 rounded-full bg-[#F7E198] hover:bg-[#FFEAA6] text-[#24221F] text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                    >
                      <span>Browse all catalog</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </motion.button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
};
