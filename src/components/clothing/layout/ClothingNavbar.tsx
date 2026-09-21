import React, { useState } from 'react';
import { useStore } from '../../../context/StoreContext';
import { ClothingMegaMenu } from './ClothingMegaMenu';
import {
  Search,
  Heart,
  ShoppingBag,
  Menu,
  X,
  ChevronDown,
  ArrowLeft,
  Sparkles
} from 'lucide-react';

interface ClothingNavbarProps {
  currentSubRoute?: string;
  onNavigate: (path: string) => void;
  onOpenSearch: () => void;
}

export const ClothingNavbar: React.FC<ClothingNavbarProps> = ({
  currentSubRoute = '/clothing',
  onNavigate,
  onOpenSearch
}) => {
  const { cartCount, setCartDrawerOpen, wishlistCount, setView } = useStore();
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const navLinks = [
    { label: 'NEW IN', path: '/clothing/new', highlight: true },
    { label: 'BABY (0–24M)', path: '/clothing/baby' },
    { label: 'TOPS', path: '/clothing/tops' },
    { label: 'BOTTOMS', path: '/clothing/bottoms' },
    { label: 'SETS', path: '/clothing/sets' },
    { label: 'ROMPERS', path: '/clothing/rompers' },
    { label: 'SHOES', path: '/clothing/shoes' },
    { label: 'LOOKBOOK', path: '/clothing/lookbook' },
    { label: 'SIZE GUIDE', path: '/clothing/size-guide' }
  ];

  const handleReturnToToys = () => {
    window.history.pushState({}, '', '/');
    setView('home');
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FCFAF7]/95 backdrop-blur-md border-b border-[#E8E2D5] transition-all">
      {/* Top Utility Line: Cross-store Bridge */}
      <div className="bg-[#171715] text-[#FCFAF7] px-4 py-1.5 text-[11px] font-medium tracking-wide">
        <div className="fashion-container flex items-center justify-between">
          <button
            onClick={handleReturnToToys}
            className="flex items-center gap-1.5 text-[#E6DFD5] hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#F28F79]" />
            <span>← Explore Toys & Playroom (Main Store)</span>
          </button>

          <div className="hidden sm:flex items-center gap-4 text-[#C5BFB5]">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#EBD699]" />
              <span>Small sizes. Big style.</span>
            </span>
            <span>·</span>
            <span>Cash on Delivery across Bangladesh</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="fashion-container">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Left: Mobile hamburger & Boutique Wordmark */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => setMobileDrawerOpen(true)}
              className="lg:hidden p-2 text-[#171715] hover:bg-[#F2ECE1] rounded-full transition-colors cursor-pointer"
              aria-label="Open Fashion Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <button
              onClick={() => onNavigate('/clothing')}
              className="text-left group cursor-pointer"
            >
              <div className="flex items-baseline gap-1.5">
                <span className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-[#171715] group-hover:text-[#C85A32] transition-colors">
                  The Little Wardrobe
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#C85A32]" />
              </div>
              <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-widest text-[#857E73] block -mt-0.5 sm:-mt-1">
                By GrowKins Atelier
              </span>
            </button>
          </div>

          {/* Center: Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-7">
            <button
              onMouseEnter={() => setMegaMenuOpen(true)}
              onClick={() => setMegaMenuOpen(!megaMenuOpen)}
              className="flex items-center gap-1 text-xs uppercase font-bold tracking-wider text-[#171715] hover:text-[#C85A32] py-2 cursor-pointer transition-colors"
            >
              <span>Explore All</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${megaMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {navLinks.map((link) => {
              const isActive = currentSubRoute === link.path;
              return (
                <button
                  key={link.path}
                  onClick={() => {
                    setMegaMenuOpen(false);
                    onNavigate(link.path);
                  }}
                  className={`text-xs uppercase tracking-wider font-semibold py-2 transition-colors cursor-pointer relative ${
                    isActive
                      ? 'text-[#C85A32] font-bold'
                      : link.highlight
                      ? 'text-[#C85A32] hover:text-[#B24E2A]'
                      : 'text-[#171715] hover:text-[#C85A32]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C85A32] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right: Actions (Search, Wishlist, Cart) */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            <button
              onClick={onOpenSearch}
              className="p-2 sm:p-2.5 rounded-full text-[#171715] hover:bg-[#F2ECE1] transition-colors cursor-pointer flex items-center gap-1.5"
              title="Search Clothing"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden xl:inline text-xs font-medium text-[#857E73]">Search</span>
            </button>

            <button
              onClick={() => {
                window.history.pushState({}, '', '/');
                setView('wishlist');
              }}
              className="p-2 sm:p-2.5 rounded-full text-[#171715] hover:bg-[#F2ECE1] transition-colors cursor-pointer relative"
              title="Saved Items"
            >
              <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#C85A32] text-white text-[10px] font-bold flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setCartDrawerOpen(true)}
              className="flex items-center gap-2 pl-2.5 sm:pl-3.5 pr-3 sm:pr-4 py-2 sm:py-2.5 rounded-full bg-[#171715] text-[#FCFAF7] hover:bg-[#C85A32] transition-colors shadow-xs cursor-pointer ml-1"
              title="View Bag"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="text-xs font-bold font-sans">
                {cartCount}
              </span>
            </button>
          </div>

        </div>
      </div>

      {/* Mega Menu Dropdown */}
      <ClothingMegaMenu
        isOpen={megaMenuOpen}
        onClose={() => setMegaMenuOpen(false)}
        onNavigate={onNavigate}
      />

      {/* Mobile Drawer */}
      {mobileDrawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 overflow-hidden">
          <div
            onClick={() => setMobileDrawerOpen(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-xs"
          />
          <div className="absolute inset-y-0 left-0 max-w-xs w-full bg-[#FCFAF7] border-r border-[#E8E2D5] p-6 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-6 text-left">
              <div className="flex items-center justify-between border-b border-[#E8E2D5] pb-4">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#171715]">The Little Wardrobe</h3>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-[#857E73]">By GrowKins</p>
                </div>
                <button
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-1.5 rounded-full hover:bg-[#F2ECE1] text-[#171715] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile links */}
              <nav className="space-y-3">
                {navLinks.map((link) => (
                  <button
                    key={link.path}
                    onClick={() => {
                      setMobileDrawerOpen(false);
                      onNavigate(link.path);
                    }}
                    className={`block w-full text-left text-sm font-bold uppercase tracking-wider py-1.5 transition-colors cursor-pointer ${
                      currentSubRoute === link.path ? 'text-[#C85A32]' : 'text-[#171715] hover:text-[#C85A32]'
                    }`}
                  >
                    {link.label}
                  </button>
                ))}
              </nav>

              <div className="pt-4 border-t border-[#E8E2D5] space-y-2 text-xs">
                <button
                  onClick={() => {
                    setMobileDrawerOpen(false);
                    onNavigate('/clothing/size-guide');
                  }}
                  className="block w-full text-left font-semibold text-[#857E73] hover:text-[#171715] py-1 cursor-pointer"
                >
                  Size & Measurement Guide
                </button>
                <button
                  onClick={() => {
                    setMobileDrawerOpen(false);
                    onNavigate('/clothing/lookbook');
                  }}
                  className="block w-full text-left font-semibold text-[#857E73] hover:text-[#171715] py-1 cursor-pointer"
                >
                  Shop Complete Looks
                </button>
              </div>
            </div>

            {/* Switch back to playroom */}
            <div className="pt-6 border-t border-[#E8E2D5]">
              <button
                onClick={() => {
                  setMobileDrawerOpen(false);
                  handleReturnToToys();
                }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#FAF7F1] border border-[#E8E0D2] text-xs font-bold text-[#24221F] hover:bg-[#F4EFE6] transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 text-[#F28F79]" />
                <span>Return to Toy Playroom</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
