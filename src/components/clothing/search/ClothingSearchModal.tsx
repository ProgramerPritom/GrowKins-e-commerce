import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowRight } from 'lucide-react';
import type { ApparelProduct } from '../../../types/clothing';
import { clothingService } from '../../../services';

interface ClothingSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenProduct: (slug: string) => void;
  onNavigate?: (path: string) => void;
}

export const ClothingSearchModal: React.FC<ClothingSearchModalProps> = ({
  isOpen,
  onClose,
  onOpenProduct
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ApparelProduct[]>([]);
  const [searching, setSearching] = useState(false);

  const suggestedQueries = [
    'White baby shirt',
    'Cargo pants',
    'First steps leather sneakers',
    'Muslin romper',
    'Matching set',
    'Merino cardigan'
  ];

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setResults([]);
      return;
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setSearching(true);
      const res = await clothingService.getProducts({ search: query, limit: 6 });
      setResults(res.items);
      setSearching(false);
    }, 180);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-start justify-center pt-16 sm:pt-24 p-4 text-left">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#171715]/60 backdrop-blur-xs"
        />

        {/* Search Modal Dialog */}
        <motion.div
          initial={{ opacity: 0, y: -16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -16, scale: 0.98 }}
          className="relative w-full max-w-2xl bg-[#FCFAF7] border border-[#E8E2D5] rounded-3xl shadow-2xl p-6 sm:p-8 z-10 space-y-6"
        >
          {/* Search Input Bar */}
          <div className="relative">
            <Search className="w-5 h-5 text-[#857E73] absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by piece, fabric, age or color (e.g. 'muslin romper', 'shoes')..."
              className="w-full h-13 pl-12 pr-12 rounded-2xl bg-white border border-[#E8E2D5] text-sm text-[#171715] placeholder:text-[#857E73] focus:outline-none focus:border-[#C85A32] shadow-2xs"
            />
            <button
              onClick={onClose}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-[#857E73] hover:text-[#171715] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Suggestions */}
          {!query.trim() && (
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#857E73]">
                Popular Searches
              </span>
              <div className="flex flex-wrap gap-2">
                {suggestedQueries.map((sq) => (
                  <button
                    key={sq}
                    onClick={() => setQuery(sq)}
                    className="px-3 py-1.5 rounded-xl bg-white border border-[#E8E2D5] text-xs font-semibold text-[#524E47] hover:border-[#C85A32] hover:text-[#C85A32] transition-colors cursor-pointer"
                  >
                    {sq}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Results List */}
          {query.trim() && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-[#857E73]">
                <span>Results for "{query}"</span>
                <span>{results.length} found</span>
              </div>

              {searching ? (
                <div className="py-8 text-center text-xs text-[#857E73]">
                  Searching the Little Wardrobe catalog...
                </div>
              ) : results.length === 0 ? (
                <div className="py-8 text-center text-xs text-[#857E73]">
                  No garments matching your terms. Try broader keywords like "cotton" or "shirt".
                </div>
              ) : (
                <div className="divide-y divide-[#F2ECE1] max-h-80 overflow-y-auto">
                  {results.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => {
                        onClose();
                        onOpenProduct(p.slug);
                      }}
                      className="py-3 flex items-center justify-between gap-3 hover:bg-[#FAF7F1] px-2 rounded-xl transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={p.images[0]?.url}
                          alt={p.name}
                          className="w-12 h-12 rounded-xl object-cover bg-white border border-[#E8E2D5] shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="font-serif font-bold text-xs sm:text-sm text-[#171715] truncate">
                            {p.name}
                          </div>
                          <div className="text-[10px] text-[#857E73]">
                            {p.ageLabel} · {p.productType}
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0 flex items-center gap-3">
                        <span className="font-bold text-xs sm:text-sm font-sans text-[#171715]">
                          ৳{p.price.toLocaleString()}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#857E73]" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
