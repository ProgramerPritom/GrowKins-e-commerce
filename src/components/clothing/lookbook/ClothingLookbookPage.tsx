import React, { useState, useEffect } from 'react';
import type { FashionLook, ApparelProduct } from '../../../types/clothing';
import { clothingService } from '../../../services';
import { ShopTheLookSection } from '../home/ShopTheLookSection';
import { Sparkles } from 'lucide-react';

interface ClothingLookbookPageProps {
  onNavigate: (path: string) => void;
  onOpenProduct: (slug: string) => void;
}

export const ClothingLookbookPage: React.FC<ClothingLookbookPageProps> = ({
  onNavigate,
  onOpenProduct
}) => {
  const [looks, setLooks] = useState<FashionLook[]>([]);
  const [products, setProducts] = useState<ApparelProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadLooks() {
      const [looksData, prodsData] = await Promise.all([
        clothingService.getLooks(),
        clothingService.getProducts({ limit: 50 })
      ]);
      if (isMounted) {
        setLooks(looksData);
        setProducts(prodsData.items);
        setLoading(false);
      }
    }
    loadLooks();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="bg-[#F7F4EE] min-h-screen py-8 sm:py-14 text-left">
      <div className="fashion-container">
        
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-10 sm:mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E8E2D5] text-[10px] uppercase font-bold tracking-widest text-[#C85A32]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Lookbook</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#171715]">
            Styled Looks & Stories
          </h1>
          <p className="text-xs sm:text-sm text-[#524E47] leading-relaxed">
            Curated outfits styled by our children’s fashion atelier. Tap any hotspot pin to explore individual garments or bundle full complete looks in 1 click.
          </p>
        </div>

        {/* Looks List */}
        {loading ? (
          <div className="h-96 rounded-3xl bg-white border border-[#E8E2D5] animate-pulse" />
        ) : (
          <div className="space-y-12 sm:space-y-16">
            {looks.map((look) => (
              <ShopTheLookSection
                key={look.id}
                look={look}
                products={products}
                onOpenProduct={onOpenProduct}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
