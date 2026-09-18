import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../../context/StoreContext';
import { useLanguage } from '../../context/LanguageContext';
import { MegaMenu } from './MegaMenu';
import { AnimatedCounter } from '../motion/AnimatedCounter';
import { Search, Heart, ShoppingBag, Menu, X, ChevronDown, Globe } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    view, 
    setView, 
    cartCount, 
    setCartDrawerOpen, 
    wishlistCount, 
    setSearchModalOpen,
    setFilter,
    resetFilters
  } = useStore();

  const { language, toggleLanguage, t } = useLanguage();

  const [megaMenuTab, setMegaMenuTab] = useState<'shop' | 'age' | 'play' | 'gifts' | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (targetView: 'shop' | 'our-story', _filterType?: string) => {
    resetFilters();
    setView(targetView);
    setMegaMenuTab(null);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F1]/95 backdrop-blur-md border-b border-[#E8E0D2] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Left: Mobile hamburger & Brand Wordmark */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#24221F] hover:bg-[#F4EFE6] rounded-full transition-colors cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <button 
              onClick={() => { setView('home'); resetFilters(); }}
              className="text-left group flex items-baseline gap-1 cursor-pointer"
            >
              <span className="font-serif text-3xl font-bold tracking-tight text-[#24221F] group-hover:text-[#1C4CB8] transition-colors">
                GrowKins
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#F28F79] mb-1 inline-block"></span>
            </button>
          </div>

          {/* Center: Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <button
              onMouseEnter={() => setMegaMenuTab('shop')}
              onClick={() => handleNavClick('shop')}
              className={`flex items-center gap-1 text-sm font-medium transition-colors hover:text-[#1C4CB8] py-2 cursor-pointer ${
                view === 'shop' ? 'text-[#1C4CB8] font-semibold' : 'text-[#24221F]'
              }`}
            >
              <span>{t.nav.shop}</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-60" />
            </button>

            <button
              onMouseEnter={() => setMegaMenuTab('age')}
              onClick={() => handleNavClick('shop')}
              className="flex items-center gap-1 text-sm font-medium text-[#24221F] hover:text-[#1C4CB8] transition-colors py-2 cursor-pointer"
            >
              <span>{t.nav.byAge}</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-60" />
            </button>

            <button
              onMouseEnter={() => setMegaMenuTab('play')}
              onClick={() => handleNavClick('shop')}
              className="flex items-center gap-1 text-sm font-medium text-[#24221F] hover:text-[#1C4CB8] transition-colors py-2 cursor-pointer"
            >
              <span>{t.nav.play}</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-60" />
            </button>

            <button
              onClick={() => {
                setFilter('occasion', ['Everyday play']);
                setView('shop');
                setMegaMenuTab(null);
              }}
              className="text-sm font-medium text-[#24221F] hover:text-[#1C4CB8] transition-colors py-2 cursor-pointer"
            >
              {t.nav.everyday}
            </button>

            <button
              onClick={() => {
                setFilter('occasion', ['Gift']);
                setView('shop');
                setMegaMenuTab(null);
              }}
              className="text-sm font-medium text-[#24221F] hover:text-[#1C4CB8] transition-colors py-2 cursor-pointer"
            >
              {t.nav.gifts}
            </button>

            <button
              onClick={() => {
                setView('our-story');
                setMegaMenuTab(null);
              }}
              className={`text-sm font-medium transition-colors hover:text-[#1C4CB8] py-2 cursor-pointer ${
                view === 'our-story' ? 'text-[#1C4CB8] font-semibold' : 'text-[#24221F]'
              }`}
            >
              {t.nav.ourStory}
            </button>
          </nav>

          {/* Right: Actions (Language Switcher, Search, Wishlist, Bag) */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Language Switcher Pill (Item 6) */}
            <motion.button
              whileTap={{ scale: 0.94 }}
              onClick={toggleLanguage}
              className="px-3 py-1.5 rounded-full bg-white border border-[#D9D3C7] hover:border-[#24221F] text-[#24221F] text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
              title={language === 'en' ? 'বাংলা ভাষায় পরিবর্তন করুন' : 'Switch to English'}
              aria-label="Toggle language between English and Bangla"
            >
              <Globe className="w-3.5 h-3.5 text-[#1C4CB8]" />
              <span className="font-sans">
                {language === 'en' ? (
                  <>EN · <span className="font-semibold text-[#757169]">বাং</span></>
                ) : (
                  <>বাংলা · <span className="font-semibold text-[#757169]">EN</span></>
                )}
              </span>
            </motion.button>

            {/* Search Icon */}
            <button
              onClick={() => setSearchModalOpen(true)}
              className="p-2.5 text-[#24221F] hover:bg-[#F4EFE6] rounded-full transition-colors flex items-center gap-2 group cursor-pointer"
              title="Search discoveries"
              aria-label="Search products"
            >
              <Search className="w-5 h-5 group-hover:scale-105 transition-transform" />
              <span className="hidden xl:inline-block text-xs text-[#757169] bg-[#F4EFE6] px-2.5 py-1 rounded-full border border-[#E8E0D2]">
                {t.nav.searchPlaceholder}
              </span>
            </button>

            {/* Wishlist Icon */}
            <button
              onClick={() => setView('wishlist')}
              className="p-2.5 text-[#24221F] hover:bg-[#F4EFE6] rounded-full transition-colors relative group cursor-pointer"
              title="Saved discoveries"
              aria-label="Wishlist"
            >
              <Heart className={`w-5 h-5 transition-transform group-hover:scale-105 ${
                wishlistCount > 0 ? 'text-[#F28F79] fill-[#F28F79]/20' : ''
              }`} />
              {wishlistCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#F28F79] text-white text-[10px] font-bold flex items-center justify-center animate-in zoom-in">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Bag Icon */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCartDrawerOpen(true)}
              className="p-2.5 bg-[#24221F] text-[#FAF7F1] hover:bg-[#1C4CB8] rounded-full transition-all flex items-center gap-2 px-3.5 sm:px-4 shadow-sm hover:shadow cursor-pointer"
              title="View your shopping bag"
              aria-label="Shopping Bag"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="text-xs font-semibold flex items-center gap-1">
                <span>{t.nav.bag} (</span>
                <AnimatedCounter count={cartCount} />
                <span>)</span>
              </span>
            </motion.button>
          </div>

        </div>
      </div>

      {/* Desktop Mega Menu */}
      <MegaMenu 
        isOpen={Boolean(megaMenuTab)}
        onClose={() => setMegaMenuTab(null)}
        activeTab={megaMenuTab}
      />

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[115px] z-50 bg-[#FAF7F1] border-t border-[#E8E0D2] overflow-y-auto p-6 pb-24 animate-in slide-in-from-left duration-200 text-left">
          <div className="space-y-6">
            
            {/* Language Switcher in Mobile Drawer */}
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E0D2]">
              <span className="text-xs font-bold uppercase tracking-wider text-[#757169]">Language / ভাষা:</span>
              <button
                onClick={toggleLanguage}
                className="px-3 py-1.5 rounded-full bg-white border border-[#D9D3C7] text-xs font-bold flex items-center gap-1.5"
              >
                <Globe className="w-3.5 h-3.5 text-[#1C4CB8]" />
                <span>{language === 'en' ? 'Switch to বাংলা' : 'Switch to English'}</span>
              </button>
            </div>

            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-[#757169] mb-3">
                Navigation
              </div>
              <div className="space-y-2">
                <button
                  onClick={() => handleNavClick('shop')}
                  className="w-full text-left font-serif text-2xl text-[#24221F] py-2 border-b border-[#E8E0D2]/50"
                >
                  {t.nav.shop}
                </button>
                <button
                  onClick={() => {
                    setFilter('age', ['1–2Y', '3–5Y']);
                    setView('shop');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left font-serif text-2xl text-[#24221F] py-2 border-b border-[#E8E0D2]/50"
                >
                  {t.nav.byAge}
                </button>
                <button
                  onClick={() => {
                    setFilter('occasion', ['Gift']);
                    setView('shop');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left font-serif text-2xl text-[#24221F] py-2 border-b border-[#E8E0D2]/50"
                >
                  {t.nav.gifts}
                </button>
                <button
                  onClick={() => {
                    setView('our-story');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left font-serif text-2xl text-[#24221F] py-2 border-b border-[#E8E0D2]/50"
                >
                  {t.nav.ourStory}
                </button>
              </div>
            </div>

            <div className="bg-[#F4EFE6] rounded-2xl p-5 border border-[#E8E0D2]">
              <div className="text-xs font-bold uppercase tracking-wider text-[#1C4CB8] mb-1">
                {t.announcement.cod}
              </div>
              <p className="text-xs text-[#24221F] leading-relaxed">
                Nana Tower, Bosila, Dhaka · Hotline: 01767026831
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
