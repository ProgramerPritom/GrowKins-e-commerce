import React, { useState, useEffect } from 'react';
import { ClothingNavbar } from './layout/ClothingNavbar';
import { ClothingFooter } from './layout/ClothingFooter';
import { ClothingHomePage } from './home/ClothingHomePage';
import { ClothingCatalogPage } from './catalog/ClothingCatalogPage';
import { ClothingPDP } from './pdp/ClothingPDP';
import { ClothingLookbookPage } from './lookbook/ClothingLookbookPage';
import { ClothingSearchModal } from './search/ClothingSearchModal';
import { SizeGuideModal } from './pdp/SizeGuideModal';
import { CartDrawer } from '../cart/CartDrawer';
import { PageLoader } from '../motion/PageLoader';
import { clothingService } from '../../services';
import type { ApparelProduct } from '../../types/clothing';

interface ClothingAppProps {
  initialPath?: string;
}

export const ClothingApp: React.FC<ClothingAppProps> = ({ initialPath = '/clothing' }) => {
  const [currentPath, setCurrentPath] = useState(() =>
    typeof window !== 'undefined' ? window.location.pathname : initialPath
  );
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ApparelProduct | null>(null);
  const [loadingProduct, setLoadingProduct] = useState(false);

  // Sync browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenProduct = (slug: string) => {
    navigate(`/clothing/product/${slug}`);
  };

  // Resolve current route
  const isHome = currentPath === '/clothing' || currentPath === '/clothing/';
  const isLookbook = currentPath.startsWith('/clothing/lookbook');
  const isSizeGuide = currentPath.startsWith('/clothing/size-guide');
  const isProduct = currentPath.startsWith('/clothing/product/');

  // Handle PDP product slug loading
  useEffect(() => {
    if (isProduct) {
      const parts = currentPath.split('/clothing/product/');
      const slug = parts[1];
      if (slug) {
        setLoadingProduct(true);
        clothingService.getProductBySlug(slug).then((p) => {
          setSelectedProduct(p);
          setLoadingProduct(false);
        });
      }
    } else {
      setSelectedProduct(null);
    }
  }, [currentPath, isProduct]);

  // Extract category or collection from path
  let categorySlug: string | undefined = undefined;
  let collectionSlug: string | undefined = undefined;

  if (currentPath.startsWith('/clothing/collections/')) {
    collectionSlug = currentPath.split('/clothing/collections/')[1];
  } else if (!isHome && !isLookbook && !isSizeGuide && !isProduct && currentPath.startsWith('/clothing/')) {
    categorySlug = currentPath.replace('/clothing/', '').split('?')[0];
  }

  return (
    <div
      data-store-theme="fashion"
      className="min-h-screen bg-[#F7F4EE] text-[#171715] flex flex-col justify-between selection:bg-[#C85A32]/20 selection:text-[#171715] relative font-sans"
    >
      <PageLoader />

      {/* Shared Cart Drawer */}
      <CartDrawer />

      {/* Clothing-Specific Search Modal */}
      <ClothingSearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onOpenProduct={handleOpenProduct}
        onNavigate={navigate}
      />

      {/* Standalone Size Guide Modal */}
      <SizeGuideModal
        isOpen={sizeGuideOpen || isSizeGuide}
        onClose={() => {
          setSizeGuideOpen(false);
          if (isSizeGuide) navigate('/clothing');
        }}
      />

      {/* Boutique Navbar */}
      <ClothingNavbar
        currentSubRoute={currentPath}
        onNavigate={navigate}
        onOpenSearch={() => setSearchModalOpen(true)}
      />

      {/* Main Viewport Router */}
      <main className="flex-1">
        {isHome && (
          <ClothingHomePage
            onNavigate={navigate}
            onOpenProduct={handleOpenProduct}
          />
        )}

        {isLookbook && (
          <ClothingLookbookPage
            onNavigate={navigate}
            onOpenProduct={handleOpenProduct}
          />
        )}

        {isProduct && (
          loadingProduct ? (
            <div className="min-h-[60vh] flex items-center justify-center">
              <div className="w-8 h-8 rounded-full border-2 border-[#C85A32] border-t-transparent animate-spin" />
            </div>
          ) : selectedProduct ? (
            <ClothingPDP
              product={selectedProduct}
              onNavigate={navigate}
              onOpenProduct={handleOpenProduct}
            />
          ) : (
            <div className="py-20 text-center space-y-3">
              <h2 className="font-serif text-2xl font-bold">Garment Not Found</h2>
              <p className="text-xs text-[#857E73]">The requested apparel item may have moved or sold out.</p>
              <button
                onClick={() => navigate('/clothing')}
                className="px-5 py-2.5 rounded-xl bg-[#171715] text-white text-xs font-bold"
              >
                Return to The Little Wardrobe
              </button>
            </div>
          )
        )}

        {!isHome && !isLookbook && !isProduct && (
          <ClothingCatalogPage
            categorySlug={categorySlug}
            collectionSlug={collectionSlug}
            onOpenProduct={handleOpenProduct}
            onNavigate={navigate}
          />
        )}
      </main>

      {/* Boutique Footer */}
      <ClothingFooter onNavigate={navigate} />
    </div>
  );
};
