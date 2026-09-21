import React from 'react';
import { ArrowRight } from 'lucide-react';

interface ShopTheWardrobeProps {
  tiles?: {
    title: string;
    slug: string;
    image: string;
    itemCountText: string;
  }[];
  onNavigate: (path: string) => void;
}

export const ShopTheWardrobe: React.FC<ShopTheWardrobeProps> = ({
  tiles,
  onNavigate
}) => {
  const defaultTiles = [
    {
      title: 'Tops & Gauze Shirts',
      slug: 'tops',
      image: 'https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?q=80&w=800&auto=format&fit=crop',
      itemCountText: '18 Styles'
    },
    {
      title: 'Cargos & Relaxed Bottoms',
      slug: 'bottoms',
      image: 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?q=80&w=800&auto=format&fit=crop',
      itemCountText: '14 Styles'
    },
    {
      title: 'Matching Sets & Co-Ords',
      slug: 'sets',
      image: 'https://images.unsplash.com/photo-1543332164-6e82f355badc?q=80&w=800&auto=format&fit=crop',
      itemCountText: '12 Sets'
    },
    {
      title: 'Muslin Rompers & One-Pieces',
      slug: 'rompers',
      image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?q=80&w=800&auto=format&fit=crop',
      itemCountText: '16 Styles'
    },
    {
      title: 'First-Steps Flexible Shoes',
      slug: 'shoes',
      image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=800&auto=format&fit=crop',
      itemCountText: '11 Styles'
    },
    {
      title: 'Knitwear & Fine Merino',
      slug: 'outerwear',
      image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800&auto=format&fit=crop',
      itemCountText: '9 Styles'
    }
  ];

  const items = tiles && tiles.length > 0 ? tiles : defaultTiles;

  return (
    <section className="py-12 sm:py-16 border-t border-[#E8E2D5] bg-[#FCFAF7] text-left">
      <div className="fashion-container">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#C85A32]">
              The Collection
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#171715]">
              Shop The Wardrobe
            </h2>
          </div>

          <button
            onClick={() => onNavigate('/clothing/new')}
            className="text-xs font-bold text-[#171715] hover:text-[#C85A32] flex items-center gap-1.5 transition-colors cursor-pointer group"
          >
            <span>View All Apparel</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Large Editorial Tiles Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {items.map((tile) => (
            <div
              key={tile.slug}
              onClick={() => onNavigate(`/clothing/${tile.slug}`)}
              className="group relative rounded-3xl overflow-hidden bg-[#F5F2EA] border border-[#E8E2D5] aspect-4/5 cursor-pointer shadow-2xs"
            >
              <img
                src={tile.image}
                alt={tile.title}
                className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-700 ease-out"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#171715]/85 via-[#171715]/20 to-transparent group-hover:from-[#171715]/90 transition-colors" />

              {/* Label and Entering Arrow */}
              <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 flex items-end justify-between text-white">
                <div className="space-y-0.5 group-hover:-translate-y-1 transition-transform">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#EBD699] block">
                    {tile.itemCountText}
                  </span>
                  <h3 className="font-serif text-sm sm:text-lg font-bold leading-snug">
                    {tile.title}
                  </h3>
                </div>

                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white opacity-80 group-hover:opacity-100 group-hover:bg-[#C85A32] transition-all shrink-0 ml-2">
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
