import React, { useState, useEffect } from 'react';
import type { ApparelProduct, ClothingHomepageCMS, FashionLook } from '../../../types/clothing';
import { clothingService } from '../../../services';
import { HeroLittleWardrobe } from './HeroLittleWardrobe';
import { ShopTheWardrobe } from './ShopTheWardrobe';
import { ShopByAge } from './ShopByAge';
import { NewDropGrid } from './NewDropGrid';
import { ShopTheLookSection } from './ShopTheLookSection';
import { OutfitBuilder } from './OutfitBuilder';
import { EverydayEssentials } from './EverydayEssentials';
import { MaterialStory } from './MaterialStory';
import { SeasonalEditorial } from './SeasonalEditorial';
import { SizeGuideModal } from '../pdp/SizeGuideModal';

interface ClothingHomePageProps {
  onNavigate: (path: string) => void;
  onOpenProduct: (slug: string) => void;
}

export const ClothingHomePage: React.FC<ClothingHomePageProps> = ({
  onNavigate,
  onOpenProduct
}) => {
  const [cms, setCms] = useState<ClothingHomepageCMS | null>(null);
  const [products, setProducts] = useState<ApparelProduct[]>([]);
  const [looks, setLooks] = useState<FashionLook[]>([]);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      const [cmsData, prodsData, looksData] = await Promise.all([
        clothingService.getHomepageCMS(),
        clothingService.getProducts({ limit: 12 }),
        clothingService.getLooks()
      ]);
      if (isMounted) {
        setCms(cmsData);
        setProducts(prodsData.items);
        setLooks(looksData);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const featuredLook = looks[0];

  return (
    <div className="bg-[#F7F4EE]">
      {/* 1. Hero — The Little Wardrobe */}
      <HeroLittleWardrobe content={cms?.hero} onNavigate={onNavigate} />

      {/* 2. Shop the Wardrobe Categories */}
      <ShopTheWardrobe tiles={cms?.wardrobeTiles} onNavigate={onNavigate} />

      {/* 3. Shop by Age & Size */}
      <ShopByAge onNavigate={onNavigate} onOpenSizeGuide={() => setSizeGuideOpen(true)} />

      {/* 4. New Drop Magazine Grid */}
      <NewDropGrid
        products={products}
        onOpenProduct={onOpenProduct}
        onNavigate={onNavigate}
        onOpenSizeGuide={() => setSizeGuideOpen(true)}
      />

      {/* 5. Shop The Complete Look with Hotspots */}
      {featuredLook && (
        <ShopTheLookSection
          look={featuredLook}
          products={products}
          onOpenProduct={onOpenProduct}
          onNavigate={onNavigate}
        />
      )}

      {/* 6. Interactive Outfit Builder */}
      <OutfitBuilder products={products} />

      {/* 7. Everyday Essentials Attributes & Products */}
      <EverydayEssentials
        products={products}
        onOpenProduct={onOpenProduct}
        onNavigate={onNavigate}
      />

      {/* 8. Material Story — Feels Good, Too */}
      <MaterialStory content={cms?.materialStory} />

      {/* 9. Seasonal Editorial Banner */}
      <SeasonalEditorial content={cms?.seasonalEditorial} onNavigate={onNavigate} />

      {/* Size Guide Modal */}
      <SizeGuideModal
        isOpen={sizeGuideOpen}
        onClose={() => setSizeGuideOpen(false)}
      />
    </div>
  );
};
