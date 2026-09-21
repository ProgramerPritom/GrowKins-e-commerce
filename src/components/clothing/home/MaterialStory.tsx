import React from 'react';
import { Sparkles } from 'lucide-react';
import type { ClothingHomepageCMS } from '../../../types/clothing';

interface MaterialStoryProps {
  content?: ClothingHomepageCMS['materialStory'];
}

export const MaterialStory: React.FC<MaterialStoryProps> = ({ content }) => {
  const headline = content?.headline || 'FEELS GOOD, TOO.';
  const subheadline =
    content?.subheadline ||
    'Children’s skin is up to 30% thinner than adult skin. We obsess over open weaves, natural breathability, non-toxic plant dyes, and flatlock inner seams.';

  const defaultCards = [
    {
      title: 'Organic Double-Gauze',
      description: 'Two featherlight layers of open-weave pure cotton that trap comforting warmth while breathing effortlessly.',
      image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=800&auto=format&fit=crop'
    },
    {
      title: 'Heirloom Fine Merino',
      description: 'Australian extra-fine merino wool that naturally regulates baby body temperature without itching.',
      image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800&auto=format&fit=crop'
    },
    {
      title: 'Triple-Layer Muslin',
      description: 'Ultra-absorbent crinkled cloud cotton that gets visibly softer and fluffier with every laundry cycle.',
      image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?q=80&w=800&auto=format&fit=crop'
    },
    {
      title: 'Washed Twill & Canvas',
      description: 'Enzyme-softened durable cotton twill engineered with reinforced knee patches for tireless floor crawling.',
      image: 'https://images.unsplash.com/photo-1471286174890-9c112ffca564?q=80&w=800&auto=format&fit=crop'
    }
  ];

  const cards = content?.cards && content.cards.length > 0 ? content.cards : defaultCards;

  return (
    <section className="py-14 sm:py-24 bg-[#FCFAF7] border-t border-[#E8E2D5] text-left">
      <div className="fashion-container">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF3EE] border border-[#C85A32]/20 text-[10px] uppercase font-bold tracking-widest text-[#C85A32]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tactile Standards</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#171715]">
            {headline}
          </h2>
          <p className="text-xs sm:text-sm text-[#524E47] leading-relaxed">
            {subheadline}
          </p>
        </div>

        {/* 4 Tactile Material Macro Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, idx) => (
            <div
              key={idx}
              className="group bg-white rounded-3xl overflow-hidden border border-[#E8E2D5] shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="relative aspect-4/3 overflow-hidden bg-[#F5F2EA]">
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
                <span className="absolute bottom-2.5 left-3 text-[9px] uppercase font-bold tracking-widest text-white bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-full">
                  Macro Fabric Detail
                </span>
              </div>

              <div className="p-5 space-y-2">
                <h3 className="font-serif text-base font-bold text-[#171715]">
                  {card.title}
                </h3>
                <p className="text-xs text-[#787267] leading-relaxed">
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
