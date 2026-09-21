import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, ArrowRight } from 'lucide-react';

interface FitFinderDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onApplySize: (sizeId: string) => void;
  isShoe?: boolean;
}

export function calculateRecommendedSize(
  ageMonths: number,
  heightCm: number,
  weightKg: number,
  build: 'slim' | 'regular' | 'chunky',
  isShoe = false
): { sizeId: string; label: string; note: string } {
  if (isShoe) {
    if (ageMonths <= 6) return { sizeId: 'eu-17', label: 'EU 17 (10.5 cm)', note: 'Ideal for pre-walkers and tiny kicks.' };
    if (ageMonths <= 9) return { sizeId: 'eu-18', label: 'EU 18 (11.0 cm)', note: 'Roomy fit for early pull-to-stand movements.' };
    if (ageMonths <= 12) return { sizeId: 'eu-19', label: 'EU 19 (11.5 cm)', note: 'Standard first-steps size for 1st birthday toddlers.' };
    if (ageMonths <= 15) return { sizeId: 'eu-20', label: 'EU 20 (12.2 cm)', note: 'Steady walker fit with extra toe splay room.' };
    if (ageMonths <= 18) return { sizeId: 'eu-21', label: 'EU 21 (13.0 cm)', note: 'Flexible balance support for active explorers.' };
    if (ageMonths <= 21) return { sizeId: 'eu-22', label: 'EU 22 (13.7 cm)', note: 'Comfortable width for running toddlers.' };
    return { sizeId: 'eu-23', label: 'EU 23 (14.4 cm)', note: 'Spacious ergonomic fit.' };
  }

  // Baby Apparel Logic
  let effectiveMonths = ageMonths;
  if (build === 'chunky' || weightKg > (ageMonths * 0.45 + 5.5)) {
    effectiveMonths += 2.5;
  } else if (build === 'slim') {
    effectiveMonths -= 1;
  }

  if (effectiveMonths <= 3 || heightCm <= 62) {
    return { sizeId: '0-3m', label: '0–3M (up to 62 cm)', note: 'Snug and cozy for newborn days.' };
  }
  if (effectiveMonths <= 6 || heightCm <= 68) {
    return { sizeId: '3-6m', label: '3–6M (up to 68 cm)', note: 'Comfortable tummy ease for rolling and sitting.' };
  }
  if (effectiveMonths <= 9 || heightCm <= 74) {
    return { sizeId: '6-9m', label: '6–9M (up to 74 cm)', note: 'Generous diaper room for crawling adventures.' };
  }
  if (effectiveMonths <= 12 || heightCm <= 80) {
    return { sizeId: '9-12m', label: '9–12M (up to 80 cm)', note: 'Tailored for active standing and early steps.' };
  }
  if (effectiveMonths <= 18 || heightCm <= 86) {
    return { sizeId: '12-18m', label: '12–18M (up to 86 cm)', note: 'Room to grow through endless toddler sprints.' };
  }
  return { sizeId: '18-24m', label: '18–24M (up to 92 cm)', note: 'Spacious toddler cut with roll-up ease.' };
}

export const FitFinderDrawer: React.FC<FitFinderDrawerProps> = ({
  isOpen,
  onClose,
  onApplySize,
  isShoe = false
}) => {
  const [ageMonths, setAgeMonths] = useState<number>(8);
  const [heightCm, setHeightCm] = useState<number>(72);
  const [weightKg, setWeightKg] = useState<number>(9);
  const [build, setBuild] = useState<'slim' | 'regular' | 'chunky'>('regular');

  if (!isOpen) return null;

  const recommendation = calculateRecommendedSize(ageMonths, heightCm, weightKg, build, isShoe);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden text-left">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#171715]/50 backdrop-blur-xs"
        />

        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 280 }}
          className="absolute inset-y-0 right-0 max-w-md w-full bg-[#FCFAF7] border-l border-[#E8E2D5] shadow-2xl p-6 sm:p-8 flex flex-col justify-between overflow-y-auto"
        >
          {/* Top */}
          <div className="space-y-6">
            <div className="flex items-start justify-between border-b border-[#E8E2D5] pb-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#C85A32]">
                  Fit Finder
                </span>
                <h3 className="font-serif text-xl font-bold text-[#171715]">
                  Find Their Size
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-[#F2ECE1] text-[#857E73] hover:text-[#171715] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#857E73]">
              Answer a few quick questions about your child and our atelier algorithm will recommend the ideal size.
            </p>

            {/* Input 1: Age in months */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-[#171715]">
                <span>Child's Age:</span>
                <span className="text-[#C85A32] font-mono">{ageMonths} Months</span>
              </div>
              <input
                type="range"
                min="0"
                max="24"
                step="1"
                value={ageMonths}
                onChange={(e) => setAgeMonths(parseInt(e.target.value))}
                className="w-full accent-[#C85A32] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#857E73]">
                <span>Newborn</span>
                <span>12M</span>
                <span>24M</span>
              </div>
            </div>

            {/* Input 2: Approximate Height */}
            {!isShoe && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-[#171715]">
                  <span>Approximate Height:</span>
                  <span className="text-[#C85A32] font-mono">{heightCm} cm</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="95"
                  step="1"
                  value={heightCm}
                  onChange={(e) => setHeightCm(parseInt(e.target.value))}
                  className="w-full accent-[#C85A32] cursor-pointer"
                />
              </div>
            )}

            {/* Input 3: Approximate Weight */}
            {!isShoe && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-[#171715]">
                  <span>Approximate Weight:</span>
                  <span className="text-[#C85A32] font-mono">{weightKg} kg</span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="16"
                  step="0.5"
                  value={weightKg}
                  onChange={(e) => setWeightKg(parseFloat(e.target.value))}
                  className="w-full accent-[#C85A32] cursor-pointer"
                />
              </div>
            )}

            {/* Input 4: Build */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#171715]">
                Current Build:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['slim', 'regular', 'chunky'] as const).map((b) => (
                  <button
                    key={b}
                    onClick={() => setBuild(b)}
                    className={`py-2 px-1 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                      build === b
                        ? 'bg-[#171715] text-white shadow-xs'
                        : 'bg-white border border-[#E8E2D5] text-[#857E73] hover:text-[#171715]'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            {/* Recommendation Result Card */}
            <div className="p-5 rounded-2xl bg-[#FAF3EE] border border-[#C85A32]/30 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#C85A32] uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>We Recommend Starting With:</span>
              </div>
              <div className="font-serif text-2xl font-bold text-[#171715]">
                {recommendation.label}
              </div>
              <p className="text-xs text-[#524E47] leading-relaxed">
                {recommendation.note}
              </p>
              <div className="text-[10px] text-[#857E73] italic pt-1 border-t border-[#C85A32]/15">
                Note: Fit can vary slightly by fabric cut and diaper type.
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="pt-6 border-t border-[#E8E2D5] space-y-2">
            <button
              onClick={() => {
                onApplySize(recommendation.sizeId);
                onClose();
              }}
              className="w-full py-3.5 rounded-xl bg-[#C85A32] hover:bg-[#B24E2A] text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <span>Select {recommendation.label}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
