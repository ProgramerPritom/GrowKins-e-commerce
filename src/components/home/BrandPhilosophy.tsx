import React from 'react';
import { ShieldCheck, Heart, Sparkles, RotateCcw, Leaf, Baby } from 'lucide-react';

export const BrandPhilosophy: React.FC = () => {
  return (
    <section className="py-20 md:py-28 bg-[#24221F] text-[#FAF7F1] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Editorial Text */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="text-[11px] font-bold tracking-widest uppercase text-[#F7E198] flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#F7E198]" />
              <span>Our Promise to Parents</span>
            </div>

            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#FAF7F1] leading-[1.15]">
              Made for little hands.{' '}
              <span className="italic font-normal text-[#F28F79] block mt-1">
                Chosen by grown-ups.
              </span>
            </h2>

            <p className="text-base sm:text-lg text-[#A8A49C] leading-relaxed max-w-lg">
              We know every purchase is an act of trust. You don’t need more plastic clutter in the hallway — you need toys that hold up to toddler energy, nurture natural curiosity, and look at home in your space.
            </p>

            <div className="pt-2 text-xs text-[#FAF7F1]/80 flex items-center gap-3">
              <span className="inline-block w-2 h-2 rounded-full bg-[#A3C1AD]"></span>
              <span>Cash on Delivery · Pay only when your order safely arrives</span>
            </div>
          </div>

          {/* Right Trust Pillars List */}
          <div className="lg:col-span-6 space-y-4">
            {[
              {
                title: 'Age Appropriate',
                desc: 'Calibrated weight and dimensions for precise developmental grips and growing minds.',
                icon: Baby,
                color: 'text-[#F7E198]'
              },
              {
                title: 'Child-Safe Materials',
                desc: 'Zero harmful finishes. EN71, ASTM F963 certified with pure beeswax and vegetable dyes.',
                icon: ShieldCheck,
                color: 'text-[#A3C1AD]'
              },
              {
                title: 'FSC-Certified Beechwood',
                desc: 'Harvested from responsibly managed European forests built to survive generations.',
                icon: Leaf,
                color: 'text-[#F28F79]'
              },
              {
                title: 'Easy 30-Day Returns',
                desc: 'If it doesn’t bring pure delight to your playroom, we take it back with zero fuss.',
                icon: RotateCcw,
                color: 'text-[#C6B8D8]'
              },
              {
                title: 'Parent-Loved & Tested',
                desc: 'Endorsed by hundreds of real families, educators, and pediatric play specialists.',
                icon: Heart,
                color: 'text-[#F28F79]'
              }
            ].map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div 
                  key={idx}
                  className="flex items-start gap-4 p-4 rounded-2xl bg-[#2D2A26] border border-[#3D3A35] hover:border-[#F7E198]/40 transition-colors"
                >
                  <div className={`mt-0.5 w-8 h-8 rounded-full bg-[#FAF7F1]/10 flex items-center justify-center shrink-0 ${pillar.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-sm text-white">{pillar.title}</h3>
                    <p className="text-xs text-[#A8A49C] mt-0.5 leading-relaxed">{pillar.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
};
