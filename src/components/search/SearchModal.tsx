import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../context/StoreContext';
import { PRODUCTS } from '../../data/products';
import { Search, X, ArrowRight, Sparkles } from 'lucide-react';

export const SearchModal: React.FC = () => {
  const { searchModalOpen, setSearchModalOpen, openProduct, setView } = useStore();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchModalOpen) {
      setTimeout(() => inputRef.current?.focus(), 60);
    } else {
      setQuery('');
    }
  }, [searchModalOpen]);

  const popularSearches = [
    'Eid gift ideas',
    'Wooden stacking blocks',
    'under ৳1,500',
    'Akika & baby gifts',
    'Montessori toys Dhaka',
    'gift for 3 year old'
  ];

  // Natural query matcher
  const searchResults = PRODUCTS.filter((p) => {
    if (!query.trim()) return false;
    const q = query.toLowerCase();

    if (q.includes('eid')) {
      if (p.occasions.includes('Eid gift')) return true;
    }
    if (q.includes('akika') || q.includes('newborn') || q.includes('baby')) {
      if (p.occasions.includes('Akika / New baby') || p.ageGroup === '0–12M') return true;
    }
    if (q.includes('1500') || q.includes('under 1500')) {
      if (p.price <= 1500) return true;
    }
    if (q.includes('2000') || q.includes('under 2000')) {
      if (p.price <= 2000) return true;
    }
    if (q.includes('wood') || q.includes('wooden') || q.includes('beech')) {
      if (p.materials.includes('FSC beechwood')) return true;
    }

    return (
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.valueStatement.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.interests.some(i => i.toLowerCase().includes(q))
    );
  });

  const handleSelectProduct = (id: string) => {
    setSearchModalOpen(false);
    openProduct(id);
  };

  const handlePopularSearch = (term: string) => {
    setQuery(term);
  };

  return (
    <AnimatePresence>
      {searchModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setSearchModalOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
          />

          <div className="relative max-w-3xl mx-auto mt-4 sm:mt-24 px-3 sm:px-4 pb-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -12 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] as const }}
              className="bg-[#FAF7F1] rounded-2xl sm:rounded-[32px] shadow-2xl border border-[#E8E0D2] overflow-hidden text-left"
            >
              
              {/* Top Search Input Bar */}
              <div className="p-3.5 sm:p-6 border-b border-[#E8E0D2] bg-white flex items-center gap-2.5 sm:gap-3">
                <Search className="w-4 h-4 sm:w-5 sm:h-5 text-[#757169] shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search toys (e.g. 'stacking', 'wooden', 'under ৳1,500')..."
                  className="w-full text-sm sm:text-lg bg-transparent text-[#24221F] placeholder-[#A8A49C] focus:outline-none"
                />
                {query && (
                  <button onClick={() => setQuery('')} className="p-1 hover:bg-[#FAF7F1] rounded-full cursor-pointer shrink-0">
                    <X className="w-4 h-4 text-[#757169]" />
                  </button>
                )}
                <button
                  onClick={() => setSearchModalOpen(false)}
                  className="text-xs font-semibold text-[#757169] hover:text-[#24221F] px-2 py-1 rounded-lg hover:bg-[#FAF7F1] cursor-pointer shrink-0"
                >
                  <span className="hidden sm:inline">ESC</span>
                  <span className="sm:hidden">Close</span>
                </button>
              </div>

              {/* Body */}
              <div className="p-4 sm:p-8 max-h-[70vh] sm:max-h-[60vh] overflow-y-auto space-y-5 sm:space-y-6">
                
                {/* Quick Prompt Suggestions */}
                <div>
                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#757169] block mb-2.5 sm:mb-3">
                    Try searching
                  </span>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {popularSearches.map((term) => (
                      <motion.button
                        key={term}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => handlePopularSearch(term)}
                        className="px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-white border border-[#E8E0D2] hover:border-[#1C4CB8] hover:text-[#1C4CB8] text-[11px] sm:text-xs font-medium text-[#24221F] transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
                      >
                        <Sparkles className="w-3 h-3 text-[#A67E14] shrink-0" />
                        <span>{term}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Results Section */}
                {query.trim() && (
                  <div className="pt-2 border-t border-[#E8E0D2]">
                    <div className="text-xs font-semibold text-[#757169] mb-4">
                      {searchResults.length} matching discoveries found
                    </div>

                    {searchResults.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {searchResults.map((product) => (
                          <motion.div
                            key={product.id}
                            whileHover={{ y: -2, boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleSelectProduct(product.id)}
                            className="p-3 rounded-2xl bg-white border border-[#E8E0D2] hover:border-[#1C4CB8] shadow-2xs cursor-pointer transition-all flex items-center gap-3 group"
                          >
                            <img
                              src={product.images.main}
                              alt={product.name}
                              className="w-14 h-14 rounded-xl object-cover bg-[#FAF7F1]"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#757169] uppercase">
                                <span>{product.ageBadge}</span>
                                <span>·</span>
                                <span>★ {product.rating}</span>
                              </div>
                              <h4 className="font-serif font-bold text-sm text-[#24221F] truncate group-hover:text-[#1C4CB8]">
                                {product.name}
                              </h4>
                              <span className="font-bold text-xs text-[#24221F] font-sans">
                                ৳{product.price}
                              </span>
                            </div>
                            <ArrowRight className="w-4 h-4 text-[#A8A49C] group-hover:text-[#1C4CB8] group-hover:translate-x-0.5 transition-all shrink-0" />
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-8 text-center space-y-2">
                        <p className="font-serif text-lg font-bold text-[#24221F]">
                          Hmm, we couldn't find that one.
                        </p>
                        <p className="text-xs text-[#757169]">
                          Try terms like "stacking", "wooden", "creative", or browse our curated age stages.
                        </p>
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setSearchModalOpen(false);
                            setView('shop');
                          }}
                          className="mt-3 px-5 py-2 rounded-full bg-[#24221F] text-white text-xs font-semibold"
                        >
                          Browse All Products
                        </motion.button>
                      </div>
                    )}
                  </div>
                )}

              </div>

            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
