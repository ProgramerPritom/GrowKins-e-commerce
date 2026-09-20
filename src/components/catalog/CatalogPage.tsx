import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../context/StoreContext';
import { useLanguage } from '../../context/LanguageContext';
import { PRODUCTS } from '../../data/products';
import { ProductCard } from './ProductCard';
import type { AgeRange, Category, Interest, DevelopmentalBenefit, Material, Occasion } from '../../types';
import { SlidersHorizontal, X, ChevronDown, Sparkles, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';

const ITEMS_PER_PAGE = 6;

export const CatalogPage: React.FC = () => {
  const { 
    filters, 
    setFilter, 
    toggleArrayFilter, 
    resetFilters, 
    setView 
  } = useStore();

  const { t } = useLanguage();
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Compute filtered products
  const filteredProducts = PRODUCTS.filter((p) => {
    // Age filter
    if (filters.age.length > 0 && !filters.age.includes(p.ageGroup)) {
      return false;
    }
    // Category filter
    if (filters.category.length > 0 && !filters.category.includes(p.category)) {
      return false;
    }
    // Interest filter
    if (filters.interest.length > 0 && !p.interests.some(i => filters.interest.includes(i))) {
      return false;
    }
    // Benefit filter
    if (filters.benefit.length > 0 && !p.benefits.some(b => filters.benefit.includes(b))) {
      return false;
    }
    // Material filter
    if (filters.material.length > 0 && !p.materials.some(m => filters.material.includes(m))) {
      return false;
    }
    // Occasion filter
    if (filters.occasion.length > 0 && !p.occasions.some(o => filters.occasion.includes(o))) {
      return false;
    }
    // Max price
    if (filters.maxPrice < 100 && p.price > filters.maxPrice) {
      return false;
    }
    // In stock
    if (filters.inStockOnly && !p.inStock) {
      return false;
    }
    // Search query
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase();
      const match = 
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.valueStatement.toLowerCase().includes(q) ||
        p.interests.some(i => i.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (filters.sortBy === 'price-low') return a.price - b.price;
    if (filters.sortBy === 'price-high') return b.price - a.price;
    if (filters.sortBy === 'rating') return b.rating - a.rating;
    return 0; // featured
  });

  // Reset pagination to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(sortedProducts.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, sortedProducts.length);
  const paginatedProducts = sortedProducts.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 220, behavior: 'smooth' });
    }
  };

  const ageOptions: AgeRange[] = ['0–12M', '1–2Y', '3–5Y', '6–8Y', '9Y+'];
  const categoryOptions: Category[] = [
    'Open-ended play',
    'Stacking toys',
    'Building sets',
    'Art & Craft',
    'Sensory',
    'Pretend play',
    'Books & Storytelling'
  ];
  const interestOptions: Interest[] = [
    'Creating',
    'Building',
    'Exploring',
    'Moving',
    'Pretending',
    'Reading'
  ];
  const benefitOptions: DevelopmentalBenefit[] = [
    'Creativity',
    'Fine motor',
    'Focus',
    'Language',
    'Balance',
    'Spatial thinking'
  ];
  const materialOptions: Material[] = [
    'FSC beechwood',
    'Organic cotton',
    'Natural beeswax',
    'Recycled wool'
  ];
  const occasionOptions: Occasion[] = [
    'Eid gift',
    'Birthday',
    'Akika / New baby',
    'Everyday play',
    'Travel',
    'Gift'
  ];

  const hasActiveFilters = 
    filters.age.length > 0 ||
    filters.category.length > 0 ||
    filters.interest.length > 0 ||
    filters.benefit.length > 0 ||
    filters.material.length > 0 ||
    filters.occasion.length > 0 ||
    filters.inStockOnly ||
    Boolean(filters.searchQuery);

  return (
    <div className="py-10 bg-[#FAF7F1] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-[#757169] mb-6">
          <button onClick={() => setView('home')} className="hover:text-[#24221F] transition-colors cursor-pointer">
            {t.catalog.breadcrumbHome}
          </button>
          <span>›</span>
          <span className="text-[#24221F] font-medium">{t.catalog.breadcrumbShop}</span>
        </nav>

        {/* Category Introduction Header */}
        <div className="text-left mb-6 sm:mb-8 max-w-3xl space-y-1.5 sm:space-y-2">
          <div className="text-[11px] font-bold tracking-widest uppercase text-[#757169]">
            {t.catalog.shelfTag}
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#24221F]">
            {t.catalog.headline}
          </h1>
          <p className="text-sm sm:text-lg text-[#6E6A63] leading-relaxed">
            {t.catalog.subheading}
          </p>
        </div>

        {/* Popular Filter Chips */}
        <div className="flex flex-wrap items-center gap-2 mb-6 sm:mb-8">
          <button
            onClick={() => toggleArrayFilter('age', '3–5Y')}
            className={`px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs font-semibold transition-all shadow-2xs cursor-pointer ${
              filters.age.includes('3–5Y')
                ? 'bg-[#24221F] text-white'
                : 'bg-white text-[#24221F] border border-[#E8E0D2] hover:bg-[#F4EFE6]'
            }`}
          >
            Age 3–5
          </button>

          <button
            onClick={() => toggleArrayFilter('occasion', 'Eid gift')}
            className={`px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs font-semibold transition-all shadow-2xs cursor-pointer ${
              filters.occasion.includes('Eid gift')
                ? 'bg-[#24221F] text-white'
                : 'bg-white text-[#24221F] border border-[#E8E0D2] hover:bg-[#F4EFE6]'
            }`}
          >
            Eid Gifts
          </button>

          <button
            onClick={() => toggleArrayFilter('occasion', 'Akika / New baby')}
            className={`px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs font-semibold transition-all shadow-2xs cursor-pointer ${
              filters.occasion.includes('Akika / New baby')
                ? 'bg-[#24221F] text-white'
                : 'bg-white text-[#24221F] border border-[#E8E0D2] hover:bg-[#F4EFE6]'
            }`}
          >
            Akika & Newborn
          </button>

          <button
            onClick={() => setFilter('maxPrice', filters.maxPrice === 1500 ? 5000 : 1500)}
            className={`px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs font-semibold transition-all shadow-2xs cursor-pointer ${
              filters.maxPrice === 1500
                ? 'bg-[#24221F] text-white'
                : 'bg-white text-[#24221F] border border-[#E8E0D2] hover:bg-[#F4EFE6]'
            }`}
          >
            Under ৳1,500
          </button>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full text-xs font-medium text-[#D96F58] hover:bg-[#FCE8E3] flex items-center gap-1 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t.catalog.clearFilters}</span>
            </button>
          )}
        </div>

        {/* Counter and Sort Bar */}
        <div className="flex flex-row items-center justify-between py-3.5 sm:py-4 border-y border-[#E8E0D2] mb-6 sm:mb-8 gap-2">
          <div className="text-xs sm:text-sm font-medium text-[#6E6A63]">
            {sortedProducts.length > 0 ? (
              <span>
                <strong className="text-[#24221F]">{sortedProducts.length}</strong> {t.catalog.showing}
              </span>
            ) : (
              <span>0 {t.catalog.showing}</span>
            )}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile Filter Trigger */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white border border-[#E8E0D2] text-xs font-semibold text-[#24221F] flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>{t.catalog.filters} {hasActiveFilters && '•'}</span>
            </button>

            {/* Sort Dropdown */}
            <div className="relative inline-flex items-center">
              <select
                value={filters.sortBy}
                onChange={(e) => setFilter('sortBy', e.target.value as any)}
                className="appearance-none bg-white border border-[#E8E0D2] rounded-full pl-3.5 pr-8 sm:pl-4 sm:pr-9 py-1.5 sm:py-2 text-xs font-semibold text-[#24221F] focus:outline-none focus:ring-1 focus:ring-[#1C4CB8] shadow-2xs cursor-pointer"
              >
                <option value="featured">{t.catalog.featured}</option>
                <option value="price-low">{t.catalog.priceLow}</option>
                <option value="price-high">{t.catalog.priceHigh}</option>
                <option value="rating">{t.catalog.rating}</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#757169] absolute right-2.5 sm:right-3 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Main Catalog Layout: Sidebar + Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block lg:col-span-3 space-y-7 pr-4 border-r border-[#E8E0D2] text-left">
            
            {/* Age Filter */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#24221F] mb-3">
                Age
              </h3>
              <div className="space-y-2">
                {ageOptions.map((age) => (
                  <label key={age} className="flex items-center gap-2.5 text-xs text-[#6E6A63] hover:text-[#24221F] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.age.includes(age)}
                      onChange={() => toggleArrayFilter('age', age)}
                      className="w-4 h-4 rounded border-[#D9D3C7] text-[#1C4CB8] focus:ring-[#1C4CB8]"
                    />
                    <span>{age}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#24221F] mb-3">
                Category
              </h3>
              <div className="space-y-2">
                {categoryOptions.map((cat) => (
                  <label key={cat} className="flex items-center gap-2.5 text-xs text-[#6E6A63] hover:text-[#24221F] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.category.includes(cat)}
                      onChange={() => toggleArrayFilter('category', cat)}
                      className="w-4 h-4 rounded border-[#D9D3C7] text-[#1C4CB8] focus:ring-[#1C4CB8]"
                    />
                    <span>{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Interest Filter */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#24221F] mb-3">
                Interest
              </h3>
              <div className="space-y-2">
                {interestOptions.map((interest) => (
                  <label key={interest} className="flex items-center gap-2.5 text-xs text-[#6E6A63] hover:text-[#24221F] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.interest.includes(interest)}
                      onChange={() => toggleArrayFilter('interest', interest)}
                      className="w-4 h-4 rounded border-[#D9D3C7] text-[#1C4CB8] focus:ring-[#1C4CB8]"
                    />
                    <span>{interest}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Benefit Filter */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#24221F] mb-3">
                Development / Benefit
              </h3>
              <div className="space-y-2">
                {benefitOptions.map((ben) => (
                  <label key={ben} className="flex items-center gap-2.5 text-xs text-[#6E6A63] hover:text-[#24221F] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.benefit.includes(ben)}
                      onChange={() => toggleArrayFilter('benefit', ben)}
                      className="w-4 h-4 rounded border-[#D9D3C7] text-[#1C4CB8] focus:ring-[#1C4CB8]"
                    />
                    <span>{ben}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Material Filter */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#24221F] mb-3">
                Material
              </h3>
              <div className="space-y-2">
                {materialOptions.map((mat) => (
                  <label key={mat} className="flex items-center gap-2.5 text-xs text-[#6E6A63] hover:text-[#24221F] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.material.includes(mat)}
                      onChange={() => toggleArrayFilter('material', mat)}
                      className="w-4 h-4 rounded border-[#D9D3C7] text-[#1C4CB8] focus:ring-[#1C4CB8]"
                    />
                    <span>{mat}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Occasion Filter */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#24221F] mb-3">
                Occasion
              </h3>
              <div className="space-y-2">
                {occasionOptions.map((occ) => (
                  <label key={occ} className="flex items-center gap-2.5 text-xs text-[#6E6A63] hover:text-[#24221F] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.occasion.includes(occ)}
                      onChange={() => toggleArrayFilter('occasion', occ)}
                      className="w-4 h-4 rounded border-[#D9D3C7] text-[#1C4CB8] focus:ring-[#1C4CB8]"
                    />
                    <span>{occ}</span>
                  </label>
                ))}
              </div>
            </div>

          </aside>

          {/* Products Grid & Pagination (Item 4) */}
          <main className="lg:col-span-9">
            {sortedProducts.length > 0 ? (
              <div className="space-y-8 sm:space-y-10">
                {/* 2-column mobile grid, 3-column desktop */}
                <motion.div layout className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6 lg:gap-8">
                  <AnimatePresence>
                    {paginatedProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </AnimatePresence>
                </motion.div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="pt-6 sm:pt-8 border-t border-[#E8E0D2] flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
                    <div className="text-xs text-[#757169]">
                      {t.catalog.page} <strong className="text-[#24221F]">{currentPage}</strong> {t.catalog.of} <strong className="text-[#24221F]">{totalPages}</strong>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap justify-center">
                      {/* Previous Page Button */}
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full border border-[#D9D3C7] bg-white text-xs font-semibold text-[#24221F] hover:bg-[#F4EFE6] disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1 transition-all shadow-2xs cursor-pointer"
                        aria-label="Previous page"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                        <span>{t.catalog.prev}</span>
                      </button>

                      {/* Page Number Pills */}
                      <div className="flex items-center gap-1 mx-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full text-xs font-bold transition-all cursor-pointer ${
                              pageNum === currentPage
                                ? 'bg-[#24221F] text-white shadow-sm'
                                : 'bg-white text-[#757169] border border-[#E8E0D2] hover:bg-[#F4EFE6] hover:text-[#24221F]'
                            }`}
                            aria-label={`Page ${pageNum}`}
                            aria-current={pageNum === currentPage ? 'page' : undefined}
                          >
                            {pageNum}
                          </button>
                        ))}
                      </div>

                      {/* Next Page Button */}
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full border border-[#D9D3C7] bg-white text-xs font-semibold text-[#24221F] hover:bg-[#F4EFE6] disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1 transition-all shadow-2xs cursor-pointer"
                        aria-label="Next page"
                      >
                        <span>{t.catalog.next}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-[24px] sm:rounded-[28px] border border-[#E8E0D2] p-8 sm:p-12 text-center max-w-md mx-auto space-y-4 shadow-xs">
                <div className="w-12 h-12 rounded-full bg-[#FCF4DB] text-[#A67E14] flex items-center justify-center mx-auto">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#24221F]">
                  {t.catalog.emptyTitle}
                </h3>
                <p className="text-sm text-[#757169] leading-relaxed">
                  {t.catalog.emptyDesc}
                </p>
                <button
                  onClick={resetFilters}
                  className="px-6 py-2.5 rounded-full bg-[#24221F] text-white hover:bg-[#1C4CB8] text-xs font-bold transition-all active:scale-95 cursor-pointer"
                >
                  {t.catalog.clearFilters}
                </button>
              </div>
            )}
          </main>

        </div>

      </div>

      {/* Mobile Filter Bottom Sheet Modal */}
      <AnimatePresence>
        {mobileFilterOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFilterOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-xs"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 280 }}
              className="bg-[#FAF7F1] rounded-t-[28px] p-5 sm:p-6 max-h-[85vh] overflow-y-auto space-y-5 relative z-10 text-left"
            >
              <div className="flex items-center justify-between border-b border-[#E8E0D2] pb-3.5">
                <h2 className="font-serif text-lg sm:text-xl font-bold text-[#24221F]">
                  {t.catalog.filters}
                </h2>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1.5 rounded-full hover:bg-[#F4EFE6] cursor-pointer"
                  aria-label="Close filters"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Age Options */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#24221F] mb-2.5">
                  Age
                </h3>
                <div className="flex flex-wrap gap-2">
                  {ageOptions.map((age) => (
                    <button
                      key={age}
                      onClick={() => toggleArrayFilter('age', age)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border cursor-pointer transition-colors ${
                        filters.age.includes(age)
                          ? 'bg-[#24221F] text-white border-[#24221F]'
                          : 'bg-white text-[#24221F] border-[#E8E0D2]'
                      }`}
                    >
                      {age}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Categories */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#24221F] mb-2.5">
                  Category
                </h3>
                <div className="flex flex-wrap gap-2">
                  {categoryOptions.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => toggleArrayFilter('category', cat)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border cursor-pointer transition-colors ${
                        filters.category.includes(cat)
                          ? 'bg-[#24221F] text-white border-[#24221F]'
                          : 'bg-white text-[#24221F] border-[#E8E0D2]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Occasions */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#24221F] mb-2.5">
                  Occasion
                </h3>
                <div className="flex flex-wrap gap-2">
                  {occasionOptions.map((occ) => (
                    <button
                      key={occ}
                      onClick={() => toggleArrayFilter('occasion', occ)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border cursor-pointer transition-colors ${
                        filters.occasion.includes(occ)
                          ? 'bg-[#24221F] text-white border-[#24221F]'
                          : 'bg-white text-[#24221F] border-[#E8E0D2]'
                      }`}
                    >
                      {occ}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Developmental Benefits */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#24221F] mb-2.5">
                  Developmental Benefit
                </h3>
                <div className="flex flex-wrap gap-2">
                  {benefitOptions.map((benefit) => (
                    <button
                      key={benefit}
                      onClick={() => toggleArrayFilter('benefit', benefit)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border cursor-pointer transition-colors ${
                        filters.benefit.includes(benefit)
                          ? 'bg-[#24221F] text-white border-[#24221F]'
                          : 'bg-white text-[#24221F] border-[#E8E0D2]'
                      }`}
                    >
                      {benefit}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Price & In-stock */}
              <div className="pt-2 border-t border-[#E8E0D2] flex items-center justify-between">
                <button
                  onClick={() => setFilter('maxPrice', filters.maxPrice === 1500 ? 5000 : 1500)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border cursor-pointer ${
                    filters.maxPrice === 1500
                      ? 'bg-[#24221F] text-white border-[#24221F]'
                      : 'bg-white text-[#24221F] border-[#E8E0D2]'
                  }`}
                >
                  Under ৳1,500
                </button>

                <label className="flex items-center gap-2 text-xs text-[#24221F] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.inStockOnly}
                    onChange={(e) => setFilter('inStockOnly', e.target.checked)}
                    className="w-4 h-4 rounded border-[#D9D3C7] text-[#1C4CB8]"
                  />
                  <span>In stock only</span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-[#E8E0D2] flex items-center gap-3">
                <button
                  onClick={resetFilters}
                  className="flex-1 py-2.5 sm:py-3 rounded-full bg-white border border-[#E8E0D2] text-xs font-semibold text-[#24221F] cursor-pointer hover:bg-[#F4EFE6]"
                >
                  Reset
                </button>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="flex-2 py-2.5 sm:py-3 rounded-full bg-[#24221F] text-white text-xs font-semibold cursor-pointer hover:bg-[#1C4CB8]"
                >
                  Show {sortedProducts.length} results
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
