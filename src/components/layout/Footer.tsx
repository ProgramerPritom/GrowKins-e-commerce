import React from 'react';
import { useStore } from '../../context/StoreContext';
import { useLanguage } from '../../context/LanguageContext';
import { ShieldCheck, Heart, PackageCheck, Truck, MapPin, Phone, Leaf } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setView, setFilter } = useStore();
  const { t } = useLanguage();

  return (
    <footer className="bg-[#24221F] text-[#FAF7F1] pt-16 pb-12 border-t border-[#3D3A35]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Trust Pillars Banner for Bangladesh */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-12 mb-12 border-b border-[#3D3A35] text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FAF7F1]/10 flex items-center justify-center text-[#F7E198]">
              <PackageCheck className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-white">Cash on Delivery Across BD</div>
              <div className="text-[#A8A49C]">Inspect parcel at doorstep before paying</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FAF7F1]/10 flex items-center justify-center text-[#A3C1AD]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-white">100% Child-Safe Hardwood</div>
              <div className="text-[#A8A49C]">Zero toxic finishes, food-grade botanical wax</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FAF7F1]/10 flex items-center justify-center text-[#F28F79]">
              <Truck className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-white">Reliable Courier Delivery</div>
              <div className="text-[#A8A49C]">Dhaka in 24–48h, all 64 districts in 2–4 days</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FAF7F1]/10 flex items-center justify-center text-[#C6B8D8]">
              <Leaf className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-white">Free Nationwide Shipping</div>
              <div className="text-[#A8A49C]">Complimentary on all orders over ৳2,500</div>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12">
          
          {/* Brand Column */}
          <div className="md:col-span-4 space-y-4 text-left">
            <div className="flex items-baseline gap-1">
              <span className="font-serif text-3xl font-bold tracking-tight text-[#FAF7F1]">
                GrowKins
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#F28F79]"></span>
            </div>
            <p className="text-sm text-[#A8A49C] leading-relaxed max-w-sm">
              {t.footer.brandBio}
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 text-xs text-[#F7E198] bg-[#35322E] px-3 py-1.5 rounded-full border border-[#48443E]">
                <PackageCheck className="w-3.5 h-3.5" />
                {t.footer.codOnly}
              </span>
            </div>
          </div>

          {/* Shop Column */}
          <div className="md:col-span-2 space-y-3 text-left">
            <div className="text-xs font-bold uppercase tracking-widest text-[#F7E198]">
              {t.footer.categoriesTitle}
            </div>
            <ul className="space-y-2 text-sm text-[#A8A49C]">
              <li>
                <button 
                  onClick={() => { setFilter('age', ['0–12M', '1–2Y']); setView('shop'); }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Shop by Age
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setFilter('category', ['Stacking toys', 'Building sets']); setView('shop'); }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Open-Ended Play
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setFilter('occasion', ['Eid gift', 'Birthday']); setView('shop'); }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Gifts & Curations
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setView('shop'); }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  All Discoveries
                </button>
              </li>
            </ul>
          </div>

          {/* Order & Delivery Column */}
          <div className="md:col-span-3 space-y-3 text-left">
            <div className="text-xs font-bold uppercase tracking-widest text-[#F7E198]">
              {t.footer.orderTitle}
            </div>
            <ul className="space-y-2 text-sm text-[#A8A49C]">
              <li>
                <span className="text-white font-medium flex items-center gap-1.5">
                  <PackageCheck className="w-3.5 h-3.5 text-[#A3C1AD]" />
                  Cash on Delivery:
                </span>
                <p className="text-xs text-[#A8A49C] mt-0.5">Pay cash to rider upon inspecting your parcel</p>
              </li>
              <li>
                <span className="text-white font-medium flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-[#F28F79]" />
                  Delivery Zones:
                </span>
                <p className="text-xs text-[#A8A49C] mt-0.5">Inside Dhaka ৳70, Outside Dhaka ৳130 (Free over ৳2,500)</p>
              </li>
              <li>
                <span className="text-white font-medium flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#F7E198]" />
                  Courier Call Verification:
                </span>
                <p className="text-xs text-[#A8A49C] mt-0.5">Phone confirmation call before parcel dispatch</p>
              </li>
            </ul>
          </div>

          {/* Official Address & Phone (User Item 9) */}
          <div className="md:col-span-3 space-y-3 text-left">
            <div className="text-xs font-bold uppercase tracking-widest text-[#F7E198]">
              {t.footer.conciergeTitle}
            </div>
            <ul className="space-y-2.5 text-sm text-[#A8A49C]">
              <li>
                <span className="text-white font-medium flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#F28F79]" />
                  {t.footer.addressLabel}
                </span>
                <p className="text-xs text-[#E8E0D2] font-semibold mt-0.5">
                  {t.footer.addressValue}
                </p>
              </li>
              <li>
                <span className="text-white font-medium flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#A3C1AD]" />
                  {t.footer.phoneLabel}
                </span>
                <p className="text-xs text-[#FAF7F1] font-mono font-bold mt-0.5">
                  <a href="tel:01767026831" className="hover:text-[#F7E198] transition-colors">
                    {t.footer.phoneValue}
                  </a>
                  <span className="text-[#A8A49C] font-normal font-sans ml-1">(10 AM – 8 PM)</span>
                </p>
              </li>
              <li>
                <span className="text-white font-medium flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-[#C6B8D8]" />
                  Nationwide Coverage:
                </span>
                <p className="text-xs text-[#A8A49C] mt-0.5">Doorstep delivery across all 64 districts</p>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-[#3D3A35] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#757169]">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} {t.footer.copyright}</span>
            <span>·</span>
            <a 
              href="/admin" 
              className="text-[#757169] hover:text-[#FAF7F1] transition-colors underline decoration-dotted text-[11px]"
              title="Staff Administration Portal"
            >
              Staff Admin
            </a>
          </div>

          <div className="flex items-center gap-4 text-[#A8A49C]">
            <span className="inline-flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#A3C1AD]" />
              100% Cash on Delivery
            </span>
            <span>·</span>
            <span>Nana Tower, Bosila, Dhaka</span>
            <span>·</span>
            <span className="flex items-center gap-1">
              Crafted with <Heart className="w-3 h-3 text-[#F28F79] fill-[#F28F79]" /> for Bangladeshi families
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};
