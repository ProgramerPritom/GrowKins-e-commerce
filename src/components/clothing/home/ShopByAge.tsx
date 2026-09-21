import React from 'react';
import { ArrowRight, Ruler } from 'lucide-react';

interface ShopByAgeProps {
  onNavigate: (path: string) => void;
  onOpenSizeGuide?: () => void;
}

export const ShopByAge: React.FC<ShopByAgeProps> = ({
  onNavigate,
  onOpenSizeGuide
}) => {
  const ageStages = [
    {
      id: 'newborn',
      age: 'Newborn',
      cm: 'Up to 56 cm',
      weight: '2.5–4 kg',
      path: '/clothing/baby?size=0-3m',
      desc: 'Enveloping soft bodysuits & sleepwear'
    },
    {
      id: '0-3m',
      age: '0–3 Months',
      cm: '56–62 cm',
      weight: '4–6 kg',
      path: '/clothing/baby?size=0-3m',
      desc: 'Gentle organic snaps & kimonos'
    },
    {
      id: '3-6m',
      age: '3–6 Months',
      cm: '62–68 cm',
      weight: '6–8 kg',
      path: '/clothing/baby?size=3-6m',
      desc: 'Rolling & kicking bloomer rompers'
    },
    {
      id: '6-9m',
      age: '6–9 Months',
      cm: '68–74 cm',
      weight: '8–9.5 kg',
      path: '/clothing/baby?size=6-9m',
      desc: 'Reinforced knees for crawling journeys'
    },
    {
      id: '9-12m',
      age: '9–12 Months',
      cm: '74–80 cm',
      weight: '9.5–11 kg',
      path: '/clothing/baby?size=9-12m',
      desc: 'Pull-to-stand sets & flexible soles'
    },
    {
      id: '12-18m',
      age: '12–18 Months',
      cm: '80–86 cm',
      weight: '11–12.5 kg',
      path: '/clothing/baby?size=12-18m',
      desc: 'First steps cargo trousers & shirts'
    },
    {
      id: '18-24m',
      age: '18–24 Months',
      cm: '86–92 cm',
      weight: '12.5–14 kg',
      path: '/clothing/baby?size=18-24m',
      desc: 'Active playground co-ords & knitwear'
    }
  ];

  return (
    <section className="py-12 sm:py-16 bg-[#F7F4EE] border-t border-[#E8E2D5] text-left">
      <div className="fashion-container">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#C85A32]">
              Growth Milestones
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#171715]">
              Shop By Age & Height
            </h2>
            <p className="text-xs text-[#524E47] mt-1">
              Never guess a baby size again. All stages clearly mapped to centimeters and growth stages.
            </p>
          </div>

          {onOpenSizeGuide && (
            <button
              onClick={onOpenSizeGuide}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#171715] hover:text-[#C85A32] underline cursor-pointer"
            >
              <Ruler className="w-3.5 h-3.5 text-[#C85A32]" />
              <span>Full Size & Measurement Chart</span>
            </button>
          )}
        </div>

        {/* Age Cards Horizontal Scroll / Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 sm:gap-4">
          {ageStages.map((stage) => (
            <div
              key={stage.id}
              onClick={() => onNavigate(stage.path)}
              className="group bg-white rounded-2xl p-4 border border-[#E8E2D5] hover:border-[#C85A32] transition-all cursor-pointer shadow-2xs hover:shadow-md flex flex-col justify-between"
            >
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#C85A32]">
                  {stage.cm}
                </span>
                <h3 className="font-serif text-sm sm:text-base font-bold text-[#171715] group-hover:text-[#C85A32] transition-colors leading-tight">
                  {stage.age}
                </h3>
                <p className="text-[10px] text-[#857E73] leading-relaxed pt-1 line-clamp-2">
                  {stage.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-[#E8E2D5]/60 flex items-center justify-between text-[10px] font-semibold text-[#171715] group-hover:text-[#C85A32]">
                <span>{stage.weight}</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
