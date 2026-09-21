import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StoreProvider, useStore } from './context/StoreContext';
import { LanguageProvider } from './context/LanguageContext';
import { AnnouncementBar } from './components/layout/AnnouncementBar';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HeroPlayroom } from './components/home/HeroPlayroom';
import { StageSelector } from './components/home/StageSelector';
import { TrendingSlider } from './components/home/TrendingSlider';
import { PlayShelf } from './components/home/PlayShelf';
import { PersonalityGrid } from './components/home/PersonalityGrid';
import { BrandPhilosophy } from './components/home/BrandPhilosophy';
import { UgcMosaic } from './components/home/UgcMosaic';
import { RecommendationQuiz } from './components/home/RecommendationQuiz';
import { EditorialBanner } from './components/home/EditorialBanner';
import { CommunitySection } from './components/home/CommunitySection';
import { NewsletterSection } from './components/home/NewsletterSection';
import { CatalogPage } from './components/catalog/CatalogPage';
import { ProductDetailPage } from './components/pdp/ProductDetailPage';
import { FullCartPage } from './components/cart/FullCartPage';
import { CheckoutPage } from './components/checkout/CheckoutPage';
import { OrderConfirmationPage } from './components/checkout/OrderConfirmationPage';
import { WishlistPage } from './components/wishlist/WishlistPage';
import { OurStoryPage } from './components/story/OurStoryPage';
import { CartDrawer } from './components/cart/CartDrawer';
import { SearchModal } from './components/search/SearchModal';
import { PageLoader } from './components/motion/PageLoader';
import { AnimatedPage } from './components/motion/AnimatedPage';
import { Check } from 'lucide-react';
import { AdminApp } from './components/admin/AdminApp';
import { ClothingApp } from './components/clothing/ClothingApp';

// Global history interceptor to ensure popstate is dispatched when pushState or replaceState is called
if (typeof window !== 'undefined') {
  const originalPush = window.history.pushState.bind(window.history);
  window.history.pushState = function (...args) {
    const result = originalPush(...args);
    window.dispatchEvent(new PopStateEvent('popstate'));
    return result;
  };

  const originalReplace = window.history.replaceState.bind(window.history);
  window.history.replaceState = function (...args) {
    const result = originalReplace(...args);
    window.dispatchEvent(new PopStateEvent('popstate'));
    return result;
  };
}

const AppContent: React.FC = () => {
  const { view, setView, toastMessage } = useStore();

  React.useEffect(() => {
    const handlePop = () => {
      const path = window.location.pathname;
      if ((path === '/' || path === '') && view !== 'home' && view !== 'cart' && view !== 'checkout') {
        setView('home');
      }
    };
    window.addEventListener('popstate', handlePop);
    if ((window.location.pathname === '/' || window.location.pathname === '') && view !== 'home' && view !== 'cart' && view !== 'checkout' && view !== 'wishlist') {
      setView('home');
    }
    return () => window.removeEventListener('popstate', handlePop);
  }, [view, setView]);

  return (
    <div
      data-store-theme="play"
      className="min-h-screen bg-[#FAF7F1] text-[#24221F] flex flex-col justify-between selection:bg-[#F28F79]/20 selection:text-[#24221F] relative"
    >
      
      {/* Lightweight Branded Initial Load Splash */}
      <PageLoader />

      {/* Toast Notification Pill */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] as const }}
            className="fixed bottom-6 left-1/2 z-50 bg-[#24221F] text-white px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-2 text-xs font-semibold"
          >
            <div className="w-4 h-4 rounded-full bg-[#A3C1AD] text-white flex items-center justify-center">
              <Check className="w-2.5 h-2.5" />
            </div>
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Slide-over Drawers & Modals */}
      <CartDrawer />
      <SearchModal />

      {/* Main View Router */}
      {view === 'checkout' ? (
        /* Focused Checkout View without navigation distractions */
        <main className="flex-1">
          <AnimatePresence mode="wait">
            <AnimatedPage key="checkout">
              <CheckoutPage />
            </AnimatedPage>
          </AnimatePresence>
        </main>
      ) : (
        <>
          {/* Announcement Bar & Sticky Header */}
          <AnnouncementBar />
          <Navbar />

          <main className="flex-1">
            <AnimatePresence mode="wait">
              {view === 'home' && (
                <AnimatedPage key="home">
                  <HeroPlayroom />
                  <StageSelector />
                  {/* New Trending Items Slider Section */}
                  <TrendingSlider />
                  {/* PlayShelf positioned for immediate product visibility */}
                  <PlayShelf />
                  <PersonalityGrid />
                  <BrandPhilosophy />
                  <UgcMosaic />
                  <RecommendationQuiz />
                  <EditorialBanner />
                  <CommunitySection />
                  <NewsletterSection />
                </AnimatedPage>
              )}

              {view === 'shop' && (
                <AnimatedPage key="shop">
                  <CatalogPage />
                </AnimatedPage>
              )}

              {view === 'product' && (
                <AnimatedPage key="product">
                  <ProductDetailPage />
                </AnimatedPage>
              )}

              {view === 'cart' && (
                <AnimatedPage key="cart">
                  <FullCartPage />
                </AnimatedPage>
              )}

              {view === 'confirmation' && (
                <AnimatedPage key="confirmation">
                  <OrderConfirmationPage />
                </AnimatedPage>
              )}

              {view === 'wishlist' && (
                <AnimatedPage key="wishlist">
                  <WishlistPage />
                </AnimatedPage>
              )}

              {view === 'our-story' && (
                <AnimatedPage key="our-story">
                  <OurStoryPage />
                </AnimatedPage>
              )}
            </AnimatePresence>
          </main>

          <Footer />
        </>
      )}

    </div>
  );
};

export default function App() {
  const [currentPath, setCurrentPath] = React.useState(() => 
    typeof window !== 'undefined' ? window.location.pathname : '/'
  );

  React.useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  if (currentPath.startsWith('/admin')) {
    return <AdminApp />;
  }

  return (
    <StoreProvider>
      <LanguageProvider>
        {currentPath.startsWith('/clothing') ? (
          <ClothingApp initialPath={currentPath} />
        ) : (
          <AppContent />
        )}
      </LanguageProvider>
    </StoreProvider>
  );
}
