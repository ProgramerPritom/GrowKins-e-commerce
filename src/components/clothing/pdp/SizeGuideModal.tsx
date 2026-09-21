import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Ruler, Sparkles } from 'lucide-react';
import { SIZE_GUIDES } from '../../../data/clothingContent';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'clothing' | 'shoes';
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'clothing'
}) => {
  const [activeTab, setActiveTab] = useState<'clothing' | 'shoes'>(initialTab);

  if (!isOpen) return null;

  const currentGuide = SIZE_GUIDES.find((g) => g.category === activeTab) || SIZE_GUIDES[0];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6 text-left">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#171715]/60 backdrop-blur-xs"
        />

        {/* Modal Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-2xl bg-[#FCFAF7] border border-[#E8E2D5] rounded-3xl shadow-2xl p-5 sm:p-8 z-10 max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-start justify-between pb-4 border-b border-[#E8E2D5]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#FAF3EE] text-[#C85A32] flex items-center justify-center">
                <Ruler className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-[#171715]">
                  Size & Measurement Guide
                </h3>
                <p className="text-[11px] text-[#857E73]">
                  All garments are pre-washed and measured with comfortable diaper room.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-[#F2ECE1] text-[#857E73] hover:text-[#171715] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Category Tabs (Apparel vs Shoes) */}
          <div className="flex gap-2 pt-5 pb-3">
            <button
              onClick={() => setActiveTab('clothing')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'clothing'
                  ? 'bg-[#171715] text-white shadow-xs'
                  : 'bg-white text-[#857E73] border border-[#E8E2D5] hover:text-[#171715]'
              }`}
            >
              Baby & Toddler Apparel
            </button>
            <button
              onClick={() => setActiveTab('shoes')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'shoes'
                  ? 'bg-[#171715] text-white shadow-xs'
                  : 'bg-white text-[#857E73] border border-[#E8E2D5] hover:text-[#171715]'
              }`}
            >
              First-Steps & Toddler Shoes
            </button>
          </div>

          {/* Guide Description */}
          <p className="text-xs text-[#857E73] mb-4">
            {currentGuide.description}
          </p>

          {/* Measurements Table */}
          <div className="overflow-x-auto rounded-2xl border border-[#E8E2D5] bg-white mb-6">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#FAF7F1] border-b border-[#E8E2D5] text-[10px] font-bold uppercase tracking-wider text-[#857E73]">
                  <th className="p-3">Age Range</th>
                  {activeTab === 'clothing' ? (
                    <>
                      <th className="p-3">Height</th>
                      <th className="p-3">Weight</th>
                      <th className="p-3">Chest</th>
                      <th className="p-3">Waist</th>
                      <th className="p-3">Recommended</th>
                    </>
                  ) : (
                    <>
                      <th className="p-3">Foot Length</th>
                      <th className="p-3">EU Size</th>
                      <th className="p-3">Recommended</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2ECE1]">
                {currentGuide.rows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-[#FCFAF7] transition-colors">
                    <td className="p-3 font-bold text-[#171715] whitespace-nowrap">{row.ageLabel}</td>
                    {activeTab === 'clothing' ? (
                      <>
                        <td className="p-3 text-[#524E47] whitespace-nowrap font-mono">{row.heightCm}</td>
                        <td className="p-3 text-[#857E73] whitespace-nowrap">{row.weightKg}</td>
                        <td className="p-3 text-[#857E73] whitespace-nowrap">{row.chestCm}</td>
                        <td className="p-3 text-[#857E73] whitespace-nowrap">{row.waistCm}</td>
                        <td className="p-3 font-bold text-[#C85A32] whitespace-nowrap">
                          {row.recommendedSize}
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="p-3 text-[#524E47] whitespace-nowrap font-mono">{row.footLengthCm}</td>
                        <td className="p-3 font-bold text-[#171715] whitespace-nowrap">{row.euSize}</td>
                        <td className="p-3 font-bold text-[#C85A32] whitespace-nowrap">
                          {row.recommendedSize}
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* How to Measure Section */}
          <div className="bg-[#FAF7F1] border border-[#E8E2D5] rounded-2xl p-4 sm:p-5 text-xs space-y-3">
            <div className="flex items-center gap-2 font-bold text-[#171715]">
              <Sparkles className="w-4 h-4 text-[#C85A32]" />
              <span>How To Measure Correctly</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(currentGuide.howToMeasure || []).map((step, sIdx) => (
                <div key={sIdx} className="bg-white p-3 rounded-xl border border-[#E8E2D5]/70 space-y-1">
                  <div className="font-bold text-[#171715] text-[11px]">{step.step}</div>
                  <p className="text-[11px] text-[#857E73] leading-relaxed">{step.instructions}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Close CTA */}
          <div className="pt-5 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-[#171715] text-white text-xs font-bold hover:bg-[#C85A32] transition-colors cursor-pointer"
            >
              Got It, Back to Shopping
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
