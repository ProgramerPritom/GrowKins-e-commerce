import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ShieldCheck, ArrowRight } from 'lucide-react';

export const OurStoryPage: React.FC = () => {
  const { setView } = useStore();

  return (
    <div className="py-12 bg-[#FAF7F1] min-h-screen text-left">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Top Header */}
        <div className="space-y-4">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#F28F79]">
            Our Story & Values
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-[#24221F] leading-tight">
            A grown-up shopping experience for little people.
          </h1>
          <p className="text-lg text-[#6E6A63] leading-relaxed">
            We started GrowKins because we were tired of noisy, flashing plastic toys that broke after three days and cluttered modern living rooms. We believe play should be calm, sensory, and deeply respectful of a child's natural pace.
          </p>
        </div>

        {/* Big Editorial Image */}
        <div className="rounded-[32px] overflow-hidden bg-[#F4EFE6] border border-[#E8E0D2] shadow-sm aspect-[16/9]">
          <img
            src="https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=1400&q=85"
            alt="Warm modern playroom"
            className="w-full h-full object-cover"
          />
        </div>

        {/* 3 Core Principles */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div className="space-y-2">
            <span className="font-serif text-2xl font-bold text-[#1C4CB8]">01</span>
            <h3 className="font-serif text-xl font-bold text-[#24221F]">Less stuff. Better play.</h3>
            <p className="text-sm text-[#757169] leading-relaxed">
              When a child has fewer, open-ended objects, their imagination steps in to fill the silence. A wooden arch becomes a mountain, a bridge, or a cradle.
            </p>
          </div>

          <div className="space-y-2">
            <span className="font-serif text-2xl font-bold text-[#A67E14]">02</span>
            <h3 className="font-serif text-xl font-bold text-[#24221F]">Sensory Integrity</h3>
            <p className="text-sm text-[#757169] leading-relaxed">
              Solid European beechwood, French organic linen, and natural honey-scented beeswax. Materials that feel grounding in small hands.
            </p>
          </div>

          <div className="space-y-2">
            <span className="font-serif text-2xl font-bold text-[#4F7A5E]">03</span>
            <h3 className="font-serif text-xl font-bold text-[#24221F]">Parent Trust First</h3>
            <p className="text-sm text-[#757169] leading-relaxed">
              Every detail is designed to remove parental stress. Cash on delivery ordering, rigorous laboratory safety certifications, and easy 30-day play returns.
            </p>
          </div>
        </div>

        {/* Cash on Delivery Commitment */}
        <div className="bg-[#FCF4DB] rounded-3xl p-8 border border-[#F2E0B2] space-y-3">
          <div className="flex items-center gap-2 text-[#856404] font-bold">
            <ShieldCheck className="w-5 h-5 text-[#A67E14]" />
            <span>Our Cash on Delivery Commitment</span>
          </div>
          <p className="text-sm text-[#5E4D1D] leading-relaxed">
            We operate on complete trust. When you order from GrowKins, no online card transactions or payment gateways are needed. We prepare your parcel with care, and you pay directly to the delivery courier when the box reaches your home.
          </p>
        </div>

        <div className="text-center pt-8">
          <button
            onClick={() => setView('shop')}
            className="px-8 py-3.5 rounded-full bg-[#24221F] text-white hover:bg-[#1C4CB8] text-sm font-bold inline-flex items-center gap-2 shadow-md active:scale-95 transition-all"
          >
            <span>Explore the Play Shelf</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
