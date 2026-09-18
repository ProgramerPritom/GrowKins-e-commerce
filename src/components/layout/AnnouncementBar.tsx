import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { ShieldCheck, Truck, PhoneCall } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="bg-[#24221F] text-[#FAF7F1] text-xs font-medium tracking-wide py-2.5 px-4 text-center transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 sm:gap-4 flex-wrap">
        <span className="inline-flex items-center gap-1.5 opacity-95">
          <Truck className="w-3.5 h-3.5 text-[#F7E198]" />
          {t.announcement.cod}
        </span>
        <span className="hidden sm:inline-block opacity-40">·</span>
        <span className="inline-flex items-center gap-1.5 opacity-95">
          <ShieldCheck className="w-3.5 h-3.5 text-[#A3C1AD]" />
          {t.announcement.freeShipping}
        </span>
        <span className="hidden lg:inline-block opacity-40">·</span>
        <span className="hidden lg:inline-flex items-center gap-1.5 opacity-90">
          <PhoneCall className="w-3.5 h-3.5 text-[#F28F79]" />
          {t.announcement.hotline}
        </span>
      </div>
    </div>
  );
};
