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
  const { view, toast, hideToast } = useStore();

  React.useEffect(() => {
    const handlePop = () => {
      const path = window.location.pathname;
      if (path === '/' || path === '') {
        // Only on actual browser back button pop
      }
    };
    window.addEventListener('popstate', handlePop);
    return () => window.removeEventListener('popstate', handlePop);
  }, []);

  return (
    <div
      data-store-theme="play"
      className="min-h-screen bg-[#FAF7F1] text-[#24221F] flex flex-col justify-between selection:bg-[#F28F79]/20 selection:text-[#24221F] relative"
    >
      
      {/* Lightweight Branded Initial Load Splash */}
      <PageLoader />

      {/* Rich Storefront Toast Notification Banner */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 24, x: '-50%', scale: 0.95 }}
            animate={{ opacity: 1, y: 0, x: '-50%', scale: 1 }}
            exit={{ opacity: 0, y: 15, x: '-50%', scale: 0.95 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] as const }}
            className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl shadow-2xl border backdrop-blur-md flex items-center gap-3.5 max-w-[92vw] sm:max-w-md w-auto ${
              toast.type === 'error'
                ? 'bg-[#24221F] text-white border-[#F28F79]/50'
                : toast.type === 'warning'
                ? 'bg-[#24221F] text-white border-[#F7E198]/50'
                : toast.type === 'delete'
                ? 'bg-[#24221F] text-white border-[#F28F79]/40'
                : 'bg-[#24221F] text-[#FAF7F1] border-[#E8E0D2]/30'
            }`}
          >
            {toast.image ? (
              <img
                src={toast.image}
                alt="Product item"
                className="w-9 h-9 rounded-xl object-cover bg-white/10 shrink-0 border border-white/20"
              />
            ) : (
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                  toast.type === 'error'
                    ? 'bg-[#B83A28] text-white'
                    : toast.type === 'warning'
                    ? 'bg-[#DDA428] text-white'
                    : toast.type === 'delete'
                    ? 'bg-[#C85A32] text-white'
                    : 'bg-[#2D6A4F] text-white'
                }`}
              >
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
            )}

            <div className="flex-1 min-w-0 pr-1">
              {toast.title && (
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#F7E198] leading-tight">
                  {toast.title}
                </div>
              )}
              <div className="text-xs font-semibold text-white/95 truncate sm:whitespace-normal">
                {toast.message}
              </div>
            </div>

            {toast.action && (
              <button
                onClick={() => {
                  toast.action?.onClick();
                  hideToast();
                }}
                className="px-2.5 py-1 rounded-full bg-white/15 hover:bg-white/25 text-white text-[11px] font-bold shrink-0 transition-colors cursor-pointer"
              >
                {toast.action.label}
              </button>
            )}

            <button
              onClick={hideToast}
              className="p-1 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer shrink-0"
              aria-label="Dismiss notification"
            >
              <span className="text-sm font-bold leading-none">✕</span>
            </button>
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
