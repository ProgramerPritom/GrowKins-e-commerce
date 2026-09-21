import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ApparelProduct, ApparelCategory } from '../../../types/clothing';
import { clothingService } from '../../../services';
import { ClothingProductCard } from './ClothingProductCard';
import { SizeGuideModal } from '../pdp/SizeGuideModal';
import {
  SlidersHorizontal,
  LayoutGrid,
  Columns2,
  ChevronDown,
  Sparkles,
  RotateCcw,
  X
} from 'lucide-react';

interface ClothingCatalogPageProps {
  categorySlug?: string;
  collectionSlug?: string;
  ageFilter?: string;
  onOpenProduct: (slug: string) => void;
  onNavigate: (path: string) => void;
}

export const ClothingCatalogPage: React.FC<ClothingCatalogPageProps> = ({
  categorySlug,
  collectionSlug,
  ageFilter,
  onOpenProduct,
  onNavigate
}) => {
  const [products, setProducts] = useState<ApparelProduct[]>([]);
  const [categories, setCategories] = useState<ApparelCategory[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [selectedAge, setSelectedAge] = useState<string>(ageFilter || 'all');
  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [selectedShoeSize, setSelectedShoeSize] = useState<string>('all');
  const [selectedColor, setSelectedColor] = useState<string>('all');
  const [selectedMaterial, setSelectedMaterial] = useState<string>('all');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'featured' | 'newest' | 'price-asc' | 'price-desc'>('featured');
  
  // View mode: 'dense' (3/4 cols) vs 'editorial' (2 cols)
  const [viewMode, setViewMode] = useState<'dense' | 'editorial'>('dense');
  
  // Mobile filter drawer
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  // Current category info
  const activeCategory = categories.find((c) => c.slug === categorySlug);

  const babySizes = [
    { id: '0-3m', label: '0–3M', cm: '62 cm' },
    { id: '3-6m', label: '3–6M', cm: '68 cm' },
    { id: '6-9m', label: '6–9M', cm: '74 cm' },
    { id: '9-12m', label: '9–12M', cm: '80 cm' },
    { id: '12-18m', label: '12–18M', cm: '86 cm' },
    { id: '18-24m', label: '18–24M', cm: '92 cm' }
  ];

  const shoeSizes = [
    { id: 'eu-17', label: 'EU 17', cm: '10.5 cm' },
    { id: 'eu-18', label: 'EU 18', cm: '11.0 cm' },
    { id: 'eu-19', label: 'EU 19', cm: '11.5 cm' },
    { id: 'eu-20', label: 'EU 20', cm: '12.2 cm' },
    { id: 'eu-21', label: 'EU 21', cm: '13.0 cm' },
    { id: 'eu-22', label: 'EU 22', cm: '13.7 cm' },
    { id: 'eu-23', label: 'EU 23', cm: '14.4 cm' },
    { id: 'eu-24', label: 'EU 24', cm: '15.0 cm' }
  ];

  const colorsList = [
    { id: 'oat', name: 'Oatmeal', hex: '#E6DFD5' },
    { id: 'terracotta', name: 'Terracotta', hex: '#C85A32' },
    { id: 'sage', name: 'Sage', hex: '#94A392' },
    { id: 'denim', name: 'Denim', hex: '#637A8E' },
    { id: 'butter', name: 'Butter', hex: '#F0DC9C' },
    { id: 'rose', name: 'Rose', hex: '#D8A499' }
  ];

  const materialsList = ['Cotton', 'Muslin', 'Merino', 'Linen', 'Leather'];

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setLoading(true);
      const [cats, result] = await Promise.all([
        clothingService.getCategories(),
        clothingService.getProducts({
          category: categorySlug === 'new' ? undefined : categorySlug,
          collection: categorySlug === 'new' ? 'new-in' : collectionSlug,
          age: selectedAge !== 'all' ? selectedAge : undefined,
          size: selectedSize !== 'all' ? selectedSize : selectedShoeSize !== 'all' ? selectedShoeSize : undefined,
          color: selectedColor !== 'all' ? selectedColor : undefined,
          material: selectedMaterial !== 'all' ? selectedMaterial : undefined,
          inStock: inStockOnly || undefined,
          sort: sortBy
        })
      ]);
      if (isMounted) {
        setCategories(cats);
        setProducts(result.items);
        setLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, [categorySlug, collectionSlug, selectedAge, selectedSize, selectedShoeSize, selectedColor, selectedMaterial, inStockOnly, sortBy]);

  const resetAllFilters = () => {
    setSelectedAge('all');
    setSelectedSize('all');
    setSelectedShoeSize('all');
    setSelectedColor('all');
    setSelectedMaterial('all');
    setInStockOnly(false);
    setSortBy('featured');
  };

  const hasActiveFilters =
    selectedAge !== 'all' ||
    selectedSize !== 'all' ||
    selectedShoeSize !== 'all' ||
    selectedColor !== 'all' ||
    selectedMaterial !== 'all' ||
    inStockOnly;

  return (
    <div className="bg-[#F7F4EE] min-h-screen py-8 sm:py-12 text-left">
      <div className="fashion-container">
        
        {/* Category Header */}
        <div className="mb-8 sm:mb-12 pb-6 border-b border-[#E8E2D5] space-y-3">
          <div className="flex items-center gap-2 text-xs text-[#857E73]">
            <button onClick={() => onNavigate('/clothing')} className="hover:text-[#171715] cursor-pointer">
              The Little Wardrobe
            </button>
            <span>/</span>
            <span className="capitalize text-[#171715] font-semibold">
              {categorySlug === 'new' ? 'New In' : activeCategory?.name || categorySlug || 'Apparel'}
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#171715] capitalize">
                {categorySlug === 'new' ? 'New Arrivals' : activeCategory?.name || 'All Apparel'}
              </h1>
              <p className="text-xs sm:text-sm text-[#524E47] max-w-xl mt-1.5 leading-relaxed">
                {activeCategory?.description ||
                  'Feather-soft, breathable fabrics made for every tumble, crawl, and joyful adventure.'}
              </p>
            </div>

            <div className="text-xs text-[#857E73] font-mono shrink-0">
              Showing {products.length} {products.length === 1 ? 'Piece' : 'Pieces'}
            </div>
          </div>
        </div>

        {/* Filter & View Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-6 border-b border-[#E8E2D5]">
          
          {/* Left: Filter Toggle & Quick Active Badges */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden px-4 py-2 rounded-xl bg-white border border-[#E8E2D5] text-xs font-bold text-[#171715] flex items-center gap-2 shadow-2xs cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters {hasActiveFilters ? '(Active)' : ''}</span>
            </button>

            {hasActiveFilters && (
              <button
                onClick={resetAllFilters}
                className="flex items-center gap-1.5 text-xs text-[#C85A32] font-semibold hover:underline cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>

          {/* Right: View Mode Switcher and Sort Dropdown */}
          <div className="flex items-center gap-4 ml-auto">
            {/* View Mode */}
            <div className="hidden sm:flex items-center bg-white border border-[#E8E2D5] rounded-xl p-0.5">
              <button
                onClick={() => setViewMode('editorial')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'editorial' ? 'bg-[#171715] text-white' : 'text-[#857E73] hover:text-[#171715]'
                }`}
                title="Editorial 2-Column View"
              >
                <Columns2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('dense')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'dense' ? 'bg-[#171715] text-white' : 'text-[#857E73] hover:text-[#171715]'
                }`}
                title="Dense Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>

            {/* Sort Select */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="appearance-none bg-white border border-[#E8E2D5] rounded-xl pl-3.5 pr-8 py-2 text-xs font-semibold text-[#171715] focus:outline-none focus:border-[#C85A32] cursor-pointer shadow-2xs"
              >
                <option value="featured">Featured Collection</option>
                <option value="newest">Just Landed</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#857E73] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

        </div>

        {/* PLP Layout: Left Filters (Desktop) + Right Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Desktop Filter Sidebar (3 Cols) */}
          <aside className="hidden lg:block lg:col-span-3 space-y-6 pr-4">
            
            {/* Filter Section 1: Baby Clothing Sizes */}
            {categorySlug !== 'shoes' && (
              <div className="space-y-3 pb-6 border-b border-[#E8E2D5]">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[#171715]">
                    Baby Apparel Size
                  </span>
                  <button
                    onClick={() => setSizeGuideOpen(true)}
                    className="text-[10px] text-[#857E73] underline hover:text-[#C85A32] cursor-pointer"
                  >
                    Size Guide
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    onClick={() => setSelectedSize('all')}
                    className={`py-2 px-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedSize === 'all'
                        ? 'bg-[#171715] text-white shadow-xs'
                        : 'bg-white border border-[#E8E2D5] text-[#171715] hover:border-[#C85A32]'
                    }`}
                  >
                    All
                  </button>
                  {babySizes.map((s) => {
                    const isSelected = selectedSize === s.id;
                    return (
                      <button
                        key={s.id}
                        onClick={() => setSelectedSize(isSelected ? 'all' : s.id)}
                        className={`py-2 px-1 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center cursor-pointer ${
                          isSelected
                            ? 'bg-[#171715] text-white shadow-xs'
                            : 'bg-white border border-[#E8E2D5] text-[#171715] hover:border-[#C85A32]'
                        }`}
                      >
                        <span>{s.label}</span>
                        <span className={`text-[9px] font-mono ${isSelected ? 'text-[#C5BFB5]' : 'text-[#857E73]'}`}>
                          {s.cm}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Filter Section 2: Footwear Sizes */}
            {(categorySlug === 'shoes' || categorySlug === 'baby' || !categorySlug) && (
              <div className="space-y-3 pb-6 border-b border-[#E8E2D5]">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[#171715]">
                    Shoe Size (First Steps)
                  </span>
                  <button
                    onClick={() => setSizeGuideOpen(true)}
                    className="text-[10px] text-[#857E73] underline hover:text-[#C85A32] cursor-pointer"
                  >
                    Foot Chart
                  </button>
                </div>

                <div className="grid grid-cols-4 gap-1.5">
                  {shoeSizes.map((s) => {
                    const isSelected = selectedShoeSize === s.id;
                    return (
                      <button
                        key={s.id}
                        onClick={() => setSelectedShoeSize(isSelected ? 'all' : s.id)}
                        className={`py-2 px-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#171715] text-white shadow-xs'
                            : 'bg-white border border-[#E8E2D5] text-[#171715] hover:border-[#C85A32]'
                        }`}
                      >
                        {s.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Filter Section 3: Colors */}
            <div className="space-y-3 pb-6 border-b border-[#E8E2D5]">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#171715] block">
                Color Palette
              </span>
              <div className="flex flex-wrap gap-2">
                {colorsList.map((col) => {
                  const isSelected = selectedColor === col.id;
                  return (
                    <button
                      key={col.id}
                      onClick={() => setSelectedColor(isSelected ? 'all' : col.id)}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#171715] text-white border-[#171715]'
                          : 'bg-white text-[#171715] border-[#E8E2D5] hover:border-[#C85A32]'
                      }`}
                    >
                      <span className="w-2.5 h-2.5 rounded-full border border-[#D5CDBD]" style={{ backgroundColor: col.hex }} />
                      <span>{col.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Filter Section 4: Materials */}
            <div className="space-y-3 pb-6 border-b border-[#E8E2D5]">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#171715] block">
                Fabric Material
              </span>
              <div className="flex flex-wrap gap-1.5">
                {materialsList.map((mat) => {
                  const isSelected = selectedMaterial.toLowerCase() === mat.toLowerCase();
                  return (
                    <button
                      key={mat}
                      onClick={() => setSelectedMaterial(isSelected ? 'all' : mat.toLowerCase())}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#171715] text-white shadow-xs'
                          : 'bg-white border border-[#E8E2D5] text-[#524E47] hover:border-[#C85A32]'
                      }`}
                    >
                      {mat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Filter Section 5: In Stock Toggle */}
            <div className="pt-2">
              <label className="flex items-center gap-2.5 text-xs font-semibold text-[#171715] cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="w-4 h-4 rounded text-[#C85A32] focus:ring-[#C85A32]"
                />
                <span>In-Stock Items Only</span>
              </label>
            </div>

          </aside>

          {/* Product Grid Area (9 Cols) */}
          <main className="lg:col-span-9">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 animate-pulse">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="space-y-3">
                    <div className="w-full aspect-4/5 bg-[#E8E2D5]/50 rounded-2xl" />
                    <div className="h-4 bg-[#E8E2D5]/60 rounded w-3/4" />
                    <div className="h-3 bg-[#E8E2D5]/40 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white border border-[#E8E2D5] rounded-3xl p-12 text-center space-y-4">
                <Sparkles className="w-8 h-8 text-[#C85A32] mx-auto opacity-70" />
                <h3 className="font-serif text-xl font-bold text-[#171715]">
                  No matching pieces found
                </h3>
                <p className="text-xs text-[#857E73] max-w-sm mx-auto">
                  Try clearing some filter criteria to discover more from our atelier catalog.
                </p>
                <button
                  onClick={resetAllFilters}
                  className="px-5 py-2.5 rounded-xl bg-[#171715] text-white text-xs font-bold hover:bg-[#C85A32] transition-colors cursor-pointer"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div
                className={`grid gap-6 sm:gap-8 ${
                  viewMode === 'editorial'
                    ? 'grid-cols-1 sm:grid-cols-2'
                    : 'grid-cols-2 md:grid-cols-3'
                }`}
              >
                {products.map((p) => (
                  <ClothingProductCard
                    key={p.id}
                    product={p}
                    editorialMode={viewMode === 'editorial'}
                    onOpenProduct={onOpenProduct}
                    onOpenSizeGuide={() => setSizeGuideOpen(true)}
                  />
                ))}
              </div>
            )}
          </main>

        </div>

      </div>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end text-left">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFilterOpen(false)}
              className="fixed inset-0 bg-[#171715]/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="relative z-10 bg-[#FCFAF7] border-t border-[#E8E2D5] rounded-t-3xl max-h-[85vh] overflow-y-auto p-6 space-y-6 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-[#E8E2D5] pb-4">
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#171715]">
                    Refine Apparel ({products.length})
                  </h3>
                  <p className="text-[11px] text-[#857E73]">Filter by size, age, fabric and availability</p>
                </div>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-2 rounded-full hover:bg-[#F2ECE1] text-[#857E73] hover:text-[#171715]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Size Chips */}
              <div className="space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#171715]">
                  Select Size
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setSelectedSize('all')}
                    className={`py-2 px-1 rounded-xl text-xs font-bold border transition-colors ${
                      selectedSize === 'all'
                        ? 'bg-[#171715] text-white border-[#171715]'
                        : 'bg-white text-[#524E47] border-[#E8E2D5]'
                    }`}
                  >
                    All Sizes
                  </button>
                  {babySizes.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSelectedSize(s.id)}
                      className={`py-2 px-1 rounded-xl text-xs font-bold border transition-colors ${
                        selectedSize === s.id
                          ? 'bg-[#171715] text-white border-[#171715]'
                          : 'bg-white text-[#524E47] border-[#E8E2D5]'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Color Filter */}
              <div className="space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#171715]">
                  Color Palette
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedColor('all')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border ${
                      selectedColor === 'all'
                        ? 'bg-[#171715] text-white border-[#171715]'
                        : 'bg-white text-[#524E47] border-[#E8E2D5]'
                    }`}
                  >
                    All Colors
                  </button>
                  {colorsList.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedColor(c.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 ${
                        selectedColor === c.id
                          ? 'bg-[#171715] text-white border-[#171715]'
                          : 'bg-white text-[#524E47] border-[#E8E2D5]'
                      }`}
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full border border-black/15 inline-block"
                        style={{ backgroundColor: c.hex }}
                      />
                      <span>{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* In stock toggle */}
              <div className="pt-2">
                <label className="flex items-center gap-2 text-xs font-semibold text-[#171715] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="w-4 h-4 rounded text-[#C85A32] accent-[#C85A32]"
                  />
                  <span>Show in-stock items only</span>
                </label>
              </div>

              {/* Mobile Action Buttons */}
              <div className="pt-4 border-t border-[#E8E2D5] flex items-center gap-3">
                <button
                  onClick={resetAllFilters}
                  className="flex-1 py-3 rounded-xl border border-[#E8E2D5] text-xs font-bold text-[#524E47]"
                >
                  Reset All
                </button>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="flex-1 py-3 rounded-xl bg-[#C85A32] text-white text-xs font-bold shadow-md"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Size Guide Modal */}
      <SizeGuideModal
        isOpen={sizeGuideOpen}
        onClose={() => setSizeGuideOpen(false)}
        initialTab={categorySlug === 'shoes' ? 'shoes' : 'clothing'}
      />
    </div>
  );
};
