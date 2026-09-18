import React from 'react';
import { Sparkles, Heart } from 'lucide-react';

export const CommunitySection: React.FC = () => {
  const communityPhotos = [
    {
      img: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?auto=format&fit=crop&w=600&q=80',
      caption: 'Weekend building session.',
      author: '@clara_makes'
    },
    {
      img: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=600&q=80',
      caption: 'Her new bedtime favorite.',
      author: '@oliver_and_co'
    },
    {
      img: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=600&q=80',
      caption: 'Birthday morning balance tower.',
      author: '@studio_nord'
    },
    {
      img: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=600&q=80',
      caption: 'Quiet rainy afternoon on the rug.',
      author: '@the_slow_nursery'
    }
  ];

  return (
    <section className="py-20 md:py-28 bg-[#F1EDF6] border-b border-[#E8E0D2]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-left mb-12 space-y-2">
          <div className="text-[11px] font-bold tracking-widest uppercase text-[#7A6199] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#7A6199]" />
            <span>Community Stories</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#24221F]">
            Little moments, shared.
          </h2>
          <p className="text-sm sm:text-base text-[#6E6A63] max-w-lg">
            Glimpses from family homes across the country. Real playrooms, quiet mornings, and big imaginative leaps.
          </p>
        </div>

        {/* 4 Image Grid with Subtle Hover Captions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {communityPhotos.map((item, idx) => (
            <div
              key={idx}
              className="group relative rounded-[24px] overflow-hidden aspect-square bg-white border border-[#E8E0D2] shadow-xs cursor-pointer"
            >
              <img
                src={item.img}
                alt={item.caption}
                className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500 ease-out"
              />

              {/* Hover caption overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-white text-left">
                <p className="font-serif text-sm font-semibold leading-tight">
                  "{item.caption}"
                </p>
                <div className="flex items-center justify-between text-[11px] text-white/80 mt-1">
                  <span>{item.author}</span>
                  <Heart className="w-3 h-3 text-[#F28F79] fill-[#F28F79]" />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
