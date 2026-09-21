import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
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

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Close mobile menu on desktop resize or Escape key press
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleNavClick = (targetView: 'shop' | 'our-story', _filterType?: string) => {
    resetFilters();
    setView(targetView);
    setMegaMenuTab(null);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F1]/95 backdrop-blur-md border-b border-[#E8E0D2] transition-all">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4 xl:gap-8">
          
          {/* Left: Mobile hamburger & Brand Wordmark */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-[#24221F] hover:bg-[#F4EFE6] rounded-full transition-colors cursor-pointer"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <button 
              onClick={() => { setView('home'); resetFilters(); }}
              className="text-left group flex items-baseline gap-1 cursor-pointer whitespace-nowrap"
            >
              <span className="font-serif text-xl sm:text-3xl font-bold tracking-tight text-[#24221F] group-hover:text-[#1C4CB8] transition-colors">
                GrowKins
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#F28F79] mb-0.5 sm:mb-1 inline-block"></span>
            </button>
          </div>

          {/* Center: Desktop Navigation */}
          <nav className="hidden lg:flex items-center justify-center gap-5 xl:gap-8 flex-1 min-w-0">
            <button
              onMouseEnter={() => setMegaMenuTab('shop')}
              onClick={() => handleNavClick('shop')}
              className={`flex items-center gap-1 text-sm font-medium transition-colors hover:text-[#1C4CB8] py-2 cursor-pointer whitespace-nowrap shrink-0 ${
                view === 'shop' ? 'text-[#1C4CB8] font-semibold' : 'text-[#24221F]'
              }`}
            >
              <span>{t.nav.shop}</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-60" />
            </button>

            <button
              onMouseEnter={() => setMegaMenuTab('age')}
              onClick={() => handleNavClick('shop')}
              className="flex items-center gap-1 text-sm font-medium text-[#24221F] hover:text-[#1C4CB8] transition-colors py-2 cursor-pointer whitespace-nowrap shrink-0"
            >
              <span>{t.nav.byAge}</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-60" />
            </button>

            <button
              onMouseEnter={() => setMegaMenuTab('play')}
              onClick={() => handleNavClick('shop')}
              className="flex items-center gap-1 text-sm font-medium text-[#24221F] hover:text-[#1C4CB8] transition-colors py-2 cursor-pointer whitespace-nowrap shrink-0"
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
              className="text-sm font-medium text-[#24221F] hover:text-[#1C4CB8] transition-colors py-2 cursor-pointer whitespace-nowrap shrink-0"
            >
              {t.nav.everyday}
            </button>

            <button
              onClick={() => {
                setFilter('occasion', ['Gift']);
                setView('shop');
                setMegaMenuTab(null);
              }}
              className="text-sm font-medium text-[#24221F] hover:text-[#1C4CB8] transition-colors py-2 cursor-pointer whitespace-nowrap shrink-0"
            >
              {t.nav.gifts}
            </button>

            <button
              onClick={() => {
                setView('our-story');
                setMegaMenuTab(null);
              }}
              className={`text-sm font-medium transition-colors hover:text-[#1C4CB8] py-2 cursor-pointer whitespace-nowrap shrink-0 ${
                view === 'our-story' ? 'text-[#1C4CB8] font-semibold' : 'text-[#24221F]'
              }`}
            >
              {t.nav.ourStory}
            </button>

            {/* Direct Bridge into The Little Wardrobe Fashion Boutique */}
            <button
              onClick={() => {
                window.history.pushState({}, '', '/clothing');
                window.dispatchEvent(new PopStateEvent('popstate'));
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#171715] text-[#FCFAF7] hover:bg-[#C85A32] text-xs font-bold transition-all shadow-2xs cursor-pointer ml-1 whitespace-nowrap shrink-0"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#EBD699]" />
              <span>The Little Wardrobe</span>
            </button>
          </nav>

          {/* Right: Actions (Language Switcher, Search, Wishlist, Bag) */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            
            {/* Language Switcher Pill */}
            <motion.button
              whileTap={{ scale: 0.94 }}
              onClick={toggleLanguage}
              className="px-2 py-1.5 sm:px-3 sm:py-1.5 rounded-full bg-white border border-[#D9D3C7] hover:border-[#24221F] text-[#24221F] text-[11px] sm:text-xs font-bold flex items-center gap-1 sm:gap-1.5 transition-all shadow-2xs cursor-pointer shrink-0"
              title={language === 'en' ? 'বাংলা ভাষায় পরিবর্তন করুন' : 'Switch to English'}
              aria-label="Toggle language between English and Bangla"
            >
              <Globe className="w-3.5 h-3.5 text-[#1C4CB8] shrink-0" />
              <span className="font-sans">
                {language === 'en' ? (
                  <>
                    <span className="hidden sm:inline">EN · <span className="font-semibold text-[#757169]">বাং</span></span>
                    <span className="sm:hidden text-[10px]">বাং</span>
                  </>
                ) : (
                  <>
                    <span className="hidden sm:inline">বাংলা · <span className="font-semibold text-[#757169]">EN</span></span>
                    <span className="sm:hidden text-[10px]">EN</span>
                  </>
                )}
              </span>
            </motion.button>

            {/* Search Icon */}
            <button
              onClick={() => setSearchModalOpen(true)}
              className="p-2 sm:p-2.5 text-[#24221F] hover:bg-[#F4EFE6] rounded-full transition-colors flex items-center gap-2 group cursor-pointer shrink-0"
              title="Search discoveries"
              aria-label="Search products"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-105 transition-transform" />
              <span className="hidden xl:inline-block text-xs text-[#757169] bg-[#F4EFE6] px-2.5 py-1 rounded-full border border-[#E8E0D2]">
                {t.nav.searchPlaceholder}
              </span>
            </button>

            {/* Wishlist Icon */}
            <button
              onClick={() => setView('wishlist')}
              className="p-2 sm:p-2.5 text-[#24221F] hover:bg-[#F4EFE6] rounded-full transition-colors relative group cursor-pointer shrink-0"
              title="Saved discoveries"
              aria-label="Wishlist"
            >
              <Heart className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:scale-105 ${
                wishlistCount > 0 ? 'text-[#F28F79] fill-[#F28F79]/20' : ''
              }`} />
              {wishlistCount > 0 && (
                <span className="absolute top-0.5 right-0.5 sm:top-1.5 sm:right-1.5 w-4 h-4 rounded-full bg-[#F28F79] text-white text-[10px] font-bold flex items-center justify-center animate-in zoom-in">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Bag Icon */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCartDrawerOpen(true)}
              className="p-1.5 sm:p-2.5 bg-[#24221F] text-[#FAF7F1] hover:bg-[#1C4CB8] rounded-full transition-all flex items-center gap-1 sm:gap-2 px-2.5 sm:px-4 shadow-sm hover:shadow cursor-pointer shrink-0"
              title="View your shopping bag"
              aria-label="Shopping Bag"
            >
              <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="text-[11px] sm:text-xs font-semibold flex items-center gap-0.5 sm:gap-1">
                <span className="hidden sm:inline">{t.nav.bag}</span>
                <span>(</span>
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

      {/* Mobile Slide-Over Drawer with Backdrop (Portaled directly to document.body) */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {mobileMenuOpen && (
            <div className="lg:hidden fixed inset-0 z-50 flex">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setMobileMenuOpen(false)}
                className="fixed inset-0 bg-black/50 backdrop-blur-xs"
              />

              {/* Drawer Panel */}
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 26, stiffness: 260 }}
                className="relative w-[85vw] max-w-[320px] bg-[#FAF7F1] h-full shadow-2xl flex flex-col justify-between p-6 overflow-y-auto z-10 text-left border-r border-[#E8E0D2]"
              >
                <div className="space-y-6">
                  
                  {/* Drawer Top Header with Brand & Close */}
                  <div className="flex items-center justify-between pb-4 border-b border-[#E8E0D2]">
                    <button 
                      onClick={() => { setView('home'); resetFilters(); setMobileMenuOpen(false); }}
                      className="flex items-baseline gap-1 cursor-pointer"
                    >
                      <span className="font-serif text-2xl font-bold tracking-tight text-[#24221F]">
                        GrowKins
                      </span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#F28F79]"></span>
                    </button>
                    <button
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-2 rounded-full hover:bg-[#F4EFE6] text-[#24221F] transition-colors cursor-pointer"
                      aria-label="Close menu"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Language Switcher in Mobile Drawer */}
                  <div className="flex items-center justify-between pb-3 border-b border-[#E8E0D2]">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#757169]">Language / ভাষা:</span>
                    <button
                      onClick={toggleLanguage}
                      className="px-3 py-1.5 rounded-full bg-white border border-[#D9D3C7] text-xs font-bold flex items-center gap-1.5 shadow-2xs hover:border-[#24221F] transition-colors cursor-pointer"
                    >
                      <Globe className="w-3.5 h-3.5 text-[#1C4CB8]" />
                      <span>{language === 'en' ? 'বাংলা' : 'English'}</span>
                    </button>
                  </div>

                  {/* Navigation Links */}
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-widest text-[#757169] mb-3">
                      Discoveries
                    </div>
                    <div className="space-y-1">
                      <button
                        onClick={() => handleNavClick('shop')}
                        className="w-full text-left font-serif text-xl text-[#24221F] py-2.5 border-b border-[#E8E0D2]/50 hover:text-[#1C4CB8] transition-colors cursor-pointer"
                      >
                        {t.nav.shop}
                      </button>
                      <button
                        onClick={() => {
                          setFilter('age', ['1–2Y', '3–5Y']);
                          setView('shop');
                          setMobileMenuOpen(false);
                        }}
                        className="w-full text-left font-serif text-xl text-[#24221F] py-2.5 border-b border-[#E8E0D2]/50 hover:text-[#1C4CB8] transition-colors cursor-pointer"
                      >
                        {t.nav.byAge}
                      </button>
                      <button
                        onClick={() => {
                          setFilter('occasion', ['Everyday play']);
                          setView('shop');
                          setMobileMenuOpen(false);
                        }}
                        className="w-full text-left font-serif text-xl text-[#24221F] py-2.5 border-b border-[#E8E0D2]/50 hover:text-[#1C4CB8] transition-colors cursor-pointer"
                      >
                        {t.nav.everyday}
                      </button>
                      <button
                        onClick={() => {
                          setFilter('occasion', ['Gift']);
                          setView('shop');
                          setMobileMenuOpen(false);
                        }}
                        className="w-full text-left font-serif text-xl text-[#24221F] py-2.5 border-b border-[#E8E0D2]/50 hover:text-[#1C4CB8] transition-colors cursor-pointer"
                      >
                        {t.nav.gifts}
                      </button>
                      <button
                        onClick={() => {
                          setView('our-story');
                          setMobileMenuOpen(false);
                        }}
                        className="w-full text-left font-serif text-xl text-[#24221F] py-2.5 border-b border-[#E8E0D2]/50 hover:text-[#1C4CB8] transition-colors cursor-pointer"
                      >
                        {t.nav.ourStory}
                      </button>

                      {/* Little Wardrobe Mobile Link */}
                      <button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          window.history.pushState({}, '', '/clothing');
                          window.dispatchEvent(new PopStateEvent('popstate'));
                        }}
                        className="w-full mt-3 p-3 rounded-2xl bg-[#171715] text-[#FCFAF7] flex items-center justify-between font-serif text-base font-bold shadow-xs cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#EBD699]" />
                          <span>The Little Wardrobe Boutique</span>
                        </div>
                        <span className="text-[10px] font-mono text-[#E6DFD5] uppercase">Explore →</span>
                      </button>
                    </div>
                  </div>

                  {/* Service Details Card */}
                  <div className="bg-[#F4EFE6] rounded-2xl p-4 border border-[#E8E0D2] space-y-1">
                    <div className="text-xs font-bold uppercase tracking-wider text-[#1C4CB8]">
                      {t.announcement.cod}
                    </div>
                    <p className="text-xs text-[#24221F] leading-relaxed">
                      Nana Tower, Bosila, Dhaka · Hotline: 01767026831
                    </p>
                  </div>

                </div>

                {/* Drawer Footer actions */}
                <div className="pt-6 border-t border-[#E8E0D2] flex items-center justify-between text-xs text-[#757169]">
                  <button
                    onClick={() => { setView('wishlist'); setMobileMenuOpen(false); }}
                    className="hover:text-[#24221F] flex items-center gap-1.5 cursor-pointer font-medium"
                  >
                    <Heart className="w-4 h-4 text-[#F28F79]" />
                    <span>Wishlist ({wishlistCount})</span>
                  </button>
                  <button
                    onClick={() => { setCartDrawerOpen(true); setMobileMenuOpen(false); }}
                    className="hover:text-[#24221F] font-bold flex items-center gap-1.5 text-[#24221F] cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4 text-[#1C4CB8]" />
                    <span>Bag ({cartCount})</span>
                  </button>
                </div>

              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </header>
  );
};
