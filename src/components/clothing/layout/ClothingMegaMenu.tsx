import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

interface ClothingMegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
}

export const ClothingMegaMenu: React.FC<ClothingMegaMenuProps> = ({
  isOpen,
  onClose,
  onNavigate
}) => {
  if (!isOpen) return null;

  const ageGroups = [
    { label: 'Newborn', age: 'newborn', cm: 'Up to 56 cm' },
    { label: '0–3 Months', age: '0-3m', cm: '56–62 cm' },
    { label: '3–6 Months', age: '3-6m', cm: '62–68 cm' },
    { label: '6–9 Months', age: '6-9m', cm: '68–74 cm' },
    { label: '9–12 Months', age: '9-12m', cm: '74–80 cm' },
    { label: '12–18 Months', age: '12-18m', cm: '80–86 cm' },
    { label: '18–24 Months', age: '18-24m', cm: '86–92 cm' }
  ];

  const clothingCategories = [
    { label: 'All Tops & Shirts', path: '/clothing/tops' },
    { label: 'Pants & Cargo Trousers', path: '/clothing/bottoms' },
    { label: 'Matching Sets & Co-Ords', path: '/clothing/sets' },
    { label: 'Muslin Rompers & One-Pieces', path: '/clothing/rompers' },
    { label: 'Knitwear & Layering Cardigans', path: '/clothing/outerwear' },
    { label: 'Everyday Organic Bodysuits', path: '/clothing/baby' }
  ];

  const shoeCategories = [
    { label: 'First-Step Leather Sneakers', path: '/clothing/shoes?type=sneakers' },
    { label: 'Pre-Walker Soft Suede Sandals', path: '/clothing/shoes?type=sandals' },
    { label: 'Soft-Sole Flexible Shoes', path: '/clothing/shoes' },
    { label: 'Shoe Sizing Guide', path: '/clothing/size-guide' }
  ];

  const discoverLinks = [
    { label: 'Just Landed / New In', path: '/clothing/new', highlight: true },
    { label: 'Shop The Look (Outfits)', path: '/clothing/lookbook' },
    { label: 'Everyday Adventures Edit', path: '/clothing/collections/everyday-essentials' },
    { label: 'Summer Little Things', path: '/clothing/collections/summer-edit' },
    { label: 'Interactive Outfit Builder', path: '/clothing#builder' }
  ];

  const handleLinkClick = (url: string) => {
    onClose();
    onNavigate(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      onMouseLeave={onClose}
      className="absolute top-full left-0 right-0 z-50 bg-[#FCFAF7] border-b border-[#E8E2D5] shadow-xl pt-7 pb-9 text-left"
    >
      <div className="fashion-container">
        <div className="grid grid-cols-12 gap-8 items-start">
          
          {/* Column 1: Shop by Age */}
          <div className="col-span-3 space-y-4 border-r border-[#E8E2D5]/60 pr-6">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#857E73]">
                Shop By Age
              </span>
            </div>
            <ul className="space-y-2">
              {ageGroups.map((item) => (
                <li key={item.age}>
                  <button
                    onClick={() => handleLinkClick(`/clothing/baby?size=${item.age}`)}
                    className="group flex items-center justify-between w-full text-xs hover:text-[#C85A32] text-[#171715] transition-colors py-1 cursor-pointer"
                  >
                    <span className="font-semibold group-hover:translate-x-1 transition-transform">
                      {item.label}
                    </span>
                    <span className="text-[10px] text-[#857E73] font-mono">
                      {item.cm}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Shop Clothing */}
          <div className="col-span-3 space-y-4 border-r border-[#E8E2D5]/60 pr-6">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#857E73]">
              Shop Apparel
            </span>
            <ul className="space-y-2.5">
              {clothingCategories.map((item) => (
                <li key={item.label}>
                  <button
                    onClick={() => handleLinkClick(item.path)}
                    className="text-xs font-semibold text-[#171715] hover:text-[#C85A32] transition-colors py-0.5 cursor-pointer block text-left"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Shoes & Discover */}
          <div className="col-span-3 space-y-6 pr-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#857E73] block mb-3">
                Footwear
              </span>
              <ul className="space-y-2">
                {shoeCategories.map((item) => (
                  <li key={item.label}>
                    <button
                      onClick={() => handleLinkClick(item.path)}
                      className="text-xs font-semibold text-[#171715] hover:text-[#C85A32] transition-colors py-0.5 cursor-pointer block text-left"
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-3 border-t border-[#E8E2D5]/60">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#857E73] block mb-3">
                Curated Edits
              </span>
              <ul className="space-y-2">
                {discoverLinks.map((item) => (
                  <li key={item.label}>
                    <button
                      onClick={() => handleLinkClick(item.path)}
                      className={`text-xs font-semibold transition-colors py-0.5 cursor-pointer flex items-center gap-1.5 ${
                        item.highlight ? 'text-[#C85A32]' : 'text-[#171715] hover:text-[#C85A32]'
                      }`}
                    >
                      {item.highlight && <Sparkles className="w-3 h-3 text-[#C85A32]" />}
                      <span>{item.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Column 4: Campaign Feature Card */}
          <div className="col-span-3">
            <div
              onClick={() => handleLinkClick('/clothing/new')}
              className="group relative rounded-2xl overflow-hidden cursor-pointer bg-[#F0ECE1] border border-[#E8E2D5] aspect-4/5"
            >
              <img
                src="https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=600&auto=format&fit=crop"
                alt="The Little Wardrobe Editorial Spring"
                className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#171715]/80 via-[#171715]/20 to-transparent p-5 flex flex-col justify-end text-white">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#EBD699] mb-1">
                  Spring / Summer Edit
                </span>
                <h4 className="font-serif text-base font-bold leading-tight mb-2">
                  Tiny fits. Big personality.
                </h4>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-[#FCFAF7] group-hover:translate-x-1 transition-transform">
                  <span>Shop New In</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
};
