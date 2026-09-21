import React from 'react';
import { Sparkles, ShieldCheck, HeartHandshake, Truck, ArrowLeft } from 'lucide-react';
import { useStore } from '../../../context/StoreContext';

interface ClothingFooterProps {
  onNavigate: (path: string) => void;
}

export const ClothingFooter: React.FC<ClothingFooterProps> = ({ onNavigate }) => {
  const { setView } = useStore();

  const handleReturnToToys = () => {
    setView('home');
    window.history.pushState({}, '', '/');
  };

  return (
    <footer className="bg-[#171715] text-[#FCFAF7] border-t border-[#33302B] pt-14 pb-12 text-left">
      <div className="fashion-container">
        
        {/* Editorial Values Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-12 border-b border-[#2C2925]">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-full bg-[#262420] text-[#EBD699] flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">Organic & Gentle</h4>
              <p className="text-[11px] text-[#A69E91] mt-0.5 leading-relaxed">
                Breathable double-gauze and long-staple combed cottons, free from harsh nickel snaps.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-full bg-[#262420] text-[#92A690] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">First Steps Ergonomics</h4>
              <p className="text-[11px] text-[#A69E91] mt-0.5 leading-relaxed">
                Zero-drop flexible soles with anatomical wide toe boxes that encourage natural balance.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-full bg-[#262420] text-[#F28F79] flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">Doorstep COD Service</h4>
              <p className="text-[11px] text-[#A69E91] mt-0.5 leading-relaxed">
                Inspect parcel at your doorstep before paying in cash. Fast delivery in 64 districts.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-full bg-[#262420] text-[#D8A499] flex items-center justify-center shrink-0">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">Hassle-Free Sizing Exchange</h4>
              <p className="text-[11px] text-[#A69E91] mt-0.5 leading-relaxed">
                If the fit isn’t just right, our customer concierge coordinates a fast size replacement.
              </p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 py-12 border-b border-[#2C2925]">
          
          {/* Brand Col */}
          <div className="md:col-span-4 space-y-4">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-2xl font-bold tracking-tight text-white">
                  The Little Wardrobe
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#C85A32]" />
              </div>
              <p className="text-xs font-mono uppercase tracking-widest text-[#A69E91] mt-1">
                Small sizes. Big style.
              </p>
            </div>

            <p className="text-xs text-[#A69E91] leading-relaxed max-w-sm">
              The dedicated children’s fashion atelier by GrowKins. Crafting elevated, photography-ready everyday pieces designed for running, tumbling, and dreaming.
            </p>

            <button
              onClick={handleReturnToToys}
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#EBD699] hover:underline pt-2 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Explore GrowKins Montessori Toys & Playroom</span>
            </button>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-2 space-y-3">
            <h5 className="text-[11px] font-bold uppercase tracking-widest text-[#E6DFD5]">Wardrobe</h5>
            <ul className="space-y-2 text-xs text-[#A69E91]">
              <li>
                <button onClick={() => onNavigate('/clothing/new')} className="hover:text-white transition-colors cursor-pointer">
                  New Drops
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/clothing/baby')} className="hover:text-white transition-colors cursor-pointer">
                  Baby Essentials (0–24M)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/clothing/tops')} className="hover:text-white transition-colors cursor-pointer">
                  Tops & Gauze Shirts
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/clothing/bottoms')} className="hover:text-white transition-colors cursor-pointer">
                  Cargos & Shorts
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/clothing/sets')} className="hover:text-white transition-colors cursor-pointer">
                  Co-Ord Sets
                </button>
              </li>
            </ul>
          </div>

          {/* Footwear & Looks */}
          <div className="md:col-span-3 space-y-3">
            <h5 className="text-[11px] font-bold uppercase tracking-widest text-[#E6DFD5]">Discover</h5>
            <ul className="space-y-2 text-xs text-[#A69E91]">
              <li>
                <button onClick={() => onNavigate('/clothing/shoes')} className="hover:text-white transition-colors cursor-pointer">
                  First-Steps Flexible Shoes
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/clothing/lookbook')} className="hover:text-white transition-colors cursor-pointer">
                  Shop The Look (Lookbook)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/clothing/size-guide')} className="hover:text-white transition-colors cursor-pointer">
                  Size & Measurement Charts
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/clothing/collections/summer-edit')} className="hover:text-white transition-colors cursor-pointer">
                  Summer Little Things Campaign
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter Box */}
          <div className="md:col-span-3 space-y-3">
            <h5 className="text-[11px] font-bold uppercase tracking-widest text-[#E6DFD5]">Atelier Notes</h5>
            <p className="text-xs text-[#A69E91] leading-relaxed">
              Receive secret drop notices, seasonal lookbooks, and fabric care tips directly in your inbox.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); alert('Subscribed to Little Wardrobe drop notes!'); }} className="space-y-2">
              <input
                type="email"
                required
                placeholder="parent@example.com"
                className="w-full h-9 px-3 rounded-lg bg-[#24221F] border border-[#3E3A33] text-xs text-white placeholder:text-[#6E685E] focus:outline-none focus:border-[#C85A32]"
              />
              <button
                type="submit"
                className="w-full h-9 rounded-lg bg-[#C85A32] hover:bg-[#B24E2A] text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Join Drop List
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#787267]">
          <p>© 2026 GrowKins Atelier. All rights reserved. Made for tiny adventures.</p>
          <div className="flex items-center gap-4">
            <button onClick={() => onNavigate('/clothing/size-guide')} className="hover:underline cursor-pointer">Size Guide</button>
            <span>·</span>
            <button onClick={handleReturnToToys} className="hover:underline cursor-pointer">Toys & Play Store</button>
            <span>·</span>
            <button onClick={() => { window.location.href = '/admin'; }} className="hover:underline cursor-pointer text-[#A69E91]">Staff Portal</button>
          </div>
        </div>

      </div>
    </footer>
  );
};
