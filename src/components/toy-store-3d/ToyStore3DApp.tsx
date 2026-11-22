import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, Volume2, VolumeX, ArrowLeft, 
  ChevronUp, ChevronDown, Compass, RefreshCw, CheckCircle2, Users,
  Play, Pause 
} from 'lucide-react';
import { productService } from '../../services';
import { apiClient } from '../../lib/api/client';
import { PRODUCTS } from '../../data/products';
import { Store3DCanvas } from './Store3DCanvas';
import { FamilyWalkthroughOverlay } from './FamilyWalkthroughOverlay';
import { StoreCheckoutDrawer, type CartItem } from './StoreCheckoutDrawer';
import { ExitWalkoutAnimation } from './ExitWalkoutAnimation';
import { ToyProductDetailModal } from '../toy-world/ToyProductDetailModal';
import { getBengaliProductDetails } from '../toy-world/bengaliToyData';

export const ToyStore3DApp: React.FC = () => {
  // Catalog State
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Walkthrough State (0.0 to 1.0 along the shop aisle)
  const [walkProgress, setWalkProgress] = useState<number>(0.05);
  const [isWalking, setIsWalking] = useState<boolean>(false);
  const [isAutoWalking, setIsAutoWalking] = useState<boolean>(false);
  const walkTimeoutRef = useRef<any>(null);

  // Auto-tour walker (smoothly strolls through store, pause on interaction)
  useEffect(() => {
    if (!isAutoWalking) return;
    const interval = setInterval(() => {
      setWalkProgress((prev) => {
        if (prev >= 0.98) {
          setIsAutoWalking(false);
          return 0.98;
        }
        setIsWalking(true);
        return Math.min(0.98, prev + 0.006);
      });
    }, 80);
    return () => clearInterval(interval);
  }, [isAutoWalking]);

  // Cart & Modal State
  const [cart, setCart] = useState<Record<string, CartItem>>({});
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [selectedProductForModal, setSelectedProductForModal] = useState<any | null>(null);
  const [hoveredProduct, setHoveredProduct] = useState<any | null>(null);
  const [showFamily, setShowFamily] = useState<boolean>(true);

  // Post-Checkout Exit Animation State
  const [confirmedOrder, setConfirmedOrder] = useState<any | null>(null);

  // Audio Ambiance Synthesizer State (Gentle toy store music box)
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const soundTimerRef = useRef<any>(null);

  // Toast Notification
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Change walk progress smoothly
  const handleWalkChange = useCallback((newVal: number) => {
    const clamped = Math.max(0, Math.min(1, newVal));
    setWalkProgress(clamped);
    setIsWalking(true);
    if (walkTimeoutRef.current) clearTimeout(walkTimeoutRef.current);
    walkTimeoutRef.current = setTimeout(() => {
      setIsWalking(false);
    }, 600);
  }, []);

  // Step Forward / Backward button handlers
  const stepForward = () => handleWalkChange(walkProgress + 0.12);
  const stepBackward = () => handleWalkChange(walkProgress - 0.12);

  // Keyboard navigation support (Arrow Up / Down, W / S)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedProductForModal || isCartOpen || confirmedOrder) return;
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        handleWalkChange(walkProgress + 0.05);
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        handleWalkChange(walkProgress - 0.05);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [walkProgress, selectedProductForModal, isCartOpen, confirmedOrder, handleWalkChange]);

  // Fetch Live Google Sheets Products (Matching /growkins-toy-world)
  useEffect(() => {
    let isMounted = true;
    async function loadCatalog() {
      setLoading(true);
      try {
        const [res, settingsRes] = await Promise.allSettled([
          productService.list({ limit: 100, status: 'active' }),
          apiClient.get<any>('/settings/landing_products')
        ]);

        const allCatalog = (res.status === 'fulfilled' && res.value && Array.isArray(res.value.data) && res.value.data.length > 0)
          ? res.value.data
          : PRODUCTS;

        let serverActiveIds: string[] | null = null;
        if (settingsRes.status === 'fulfilled' && settingsRes.value?.data?.activeIds && Array.isArray(settingsRes.value.data.activeIds)) {
          serverActiveIds = settingsRes.value.data.activeIds;
        }

        let localActiveIds: string[] | null = null;
        try {
          const saved = localStorage.getItem('gk_active_toy_world_ids');
          if (saved) localActiveIds = JSON.parse(saved);
        } catch (e) {}

        const activeIds = serverActiveIds || localActiveIds;
        let visibleProducts: any[];
        if (activeIds && Array.isArray(activeIds) && activeIds.length > 0) {
          visibleProducts = allCatalog.filter(p => activeIds.includes(p.id));
          if (visibleProducts.length === 0) visibleProducts = allCatalog;
        } else {
          visibleProducts = allCatalog;
        }

        if (isMounted) {
          setProducts(visibleProducts);
        }
      } catch (err) {
        console.warn('API error, falling back to local products:', err);
        if (isMounted) setProducts(PRODUCTS);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadCatalog();
    return () => { isMounted = false; };
  }, []);

  // Web Audio Toy Store Melody Synthesizer (Zero asset download, warm music-box chime)
  const toggleSound = () => {
    if (!soundEnabled) {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioCtx();
        audioCtxRef.current = ctx;

        // Cute lullaby arpeggio notes (Frequencies: C5, E5, G5, A5, C6)
        const notes = [523.25, 659.25, 783.99, 880.0, 1046.5, 880.0, 783.99, 659.25];
        let noteIdx = 0;

        const playChime = () => {
          if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') return;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(notes[noteIdx % notes.length], ctx.currentTime);
          noteIdx++;

          // Soft bell attack and warm decay
          gain.gain.setValueAtTime(0.001, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.06, ctx.currentTime + 0.05);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(ctx.currentTime);
          osc.stop(ctx.currentTime + 1.25);
        };

        const interval = setInterval(playChime, 800);
        soundTimerRef.current = interval;
        setSoundEnabled(true);
        showToast('🎵 মৃদু সঙ্গীত চালু হয়েছে');
      } catch (err) {
        console.warn('Web Audio playback failed', err);
      }
    } else {
      if (soundTimerRef.current) clearInterval(soundTimerRef.current);
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
        audioCtxRef.current = null;
      }
      setSoundEnabled(false);
      showToast('🔇 সঙ্গীত বন্ধ করা হয়েছে');
    }
  };

  // Cart operations
  const handleAddToCart = (product: any, qty: number = 1) => {
    const bData = getBengaliProductDetails(product);
    const pId = product.id;
    const price = Number(product.price) || 750;
    const originalPrice = Number(product.originalPrice || product.compareAtPrice) || Math.round(price * 1.35);
    const image = product.featuredImage || product.images?.main || (Array.isArray(product.images) ? product.images[0]?.url : '/items/busy-cube.jfif');

    setCart((prev) => {
      const existing = prev[pId];
      const newQty = existing ? existing.quantity + qty : qty;
      return {
        ...prev,
        [pId]: {
          productId: pId,
          name: bData.bName || product.name,
          price,
          originalPrice,
          image,
          quantity: newQty,
        },
      };
    });

    showToast(`🛒 "${bData.bName || product.name}" বাস্কেটে যোগ করা হয়েছে!`);
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCart((prev) => {
      const existing = prev[productId];
      if (!existing) return prev;
      const nextQty = existing.quantity + delta;
      if (nextQty <= 0) {
        const next = { ...prev };
        delete next[productId];
        return next;
      }
      return {
        ...prev,
        [productId]: { ...existing, quantity: nextQty },
      };
    });
  };

  const handleRemoveItem = (productId: string) => {
    setCart((prev) => {
      const next = { ...prev };
      delete next[productId];
      return next;
    });
  };

  const cartItemCount = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);

  // Aisle sector name based on walking progress
  const getSectorLabel = () => {
    if (walkProgress < 0.15) return '🚪 স্টোর প্রবেশদ্বার (Entrance)';
    if (walkProgress < 0.45) return '🧩 শিক্ষণীয় কিউব ও মোটর স্কিল কর্নার';
    if (walkProgress < 0.75) return '🎨 ক্রিয়েটিভ ও বোর্ড গেমস জোন';
    return '💳 ক্যাশ কাউন্টার ও উপহার জোন';
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#FAF7F1] flex flex-col font-sans select-none">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#24221F] text-white px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-2.5 text-xs font-bold animate-in fade-in slide-in-from-top-2 border border-white/20">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* ================= Top Branded Navigation Bar ================= */}
      <header className="absolute top-0 inset-x-0 z-30 h-16 sm:h-20 bg-gradient-to-b from-[#24221F]/90 via-[#24221F]/60 to-transparent px-4 sm:px-8 flex items-center justify-between text-white pointer-events-auto">
        {/* Brand & 2D link */}
        <div className="flex items-center gap-3">
          <a
            href="/growkins-toy-world"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-white/20 hover:bg-white/30 backdrop-blur-md flex items-center justify-center text-white transition-all shadow cursor-pointer"
            title="সাধারণ ভিউতে ফিরে যান"
          >
            <ArrowLeft className="w-5 h-5" />
          </a>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <h1 className="text-base sm:text-xl font-black tracking-wide text-white drop-shadow">
                GrowKins 3D Toy World
              </h1>
            </div>
            <span className="text-[10px] sm:text-xs text-amber-200 font-semibold hidden sm:inline-block">
              {getSectorLabel()}
            </span>
          </div>
        </div>

        {/* Audio Ambiance, Family Toggle & Cart Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Family Toggle */}
          <button
            type="button"
            onClick={() => setShowFamily(!showFamily)}
            className={`px-3 py-2 rounded-2xl backdrop-blur-md text-xs font-black flex items-center gap-1.5 transition-all shadow cursor-pointer border ${
              showFamily
                ? 'bg-emerald-600/80 text-white border-emerald-400'
                : 'bg-white/20 hover:bg-white/30 text-white border-white/20'
            }`}
            title="মা ও সোনামনিদের উপস্থিতি চালু/বন্ধ করুন"
          >
            <Users className="w-4 h-4" />
            <span className="hidden md:inline">{showFamily ? 'পরিবার অন' : 'পরিবার লুকানো'}</span>
          </button>

          {/* Audio toggle button */}
          <button
            type="button"
            onClick={toggleSound}
            className={`px-3 py-2 rounded-2xl backdrop-blur-md text-xs font-black flex items-center gap-1.5 transition-all shadow cursor-pointer border ${
              soundEnabled
                ? 'bg-amber-500/80 text-white border-amber-300'
                : 'bg-white/20 hover:bg-white/30 text-white border-white/20'
            }`}
            title="মৃদু মিউজিক চালু/বন্ধ করুন"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden md:inline">{soundEnabled ? 'সাউন্ড অন' : 'মিউজিক'}</span>
          </button>

          {/* Cart Button */}
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="relative px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl bg-gradient-to-r from-[#E76F51] to-[#F4A261] text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>বাস্কেট</span>
            {cartItemCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-white text-[#E76F51] text-xs font-black flex items-center justify-center shadow">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Floating Hover Product Card (Sleek, Clean, No giant 3D billboards!) */}
      <AnimatePresence>
        {hoveredProduct && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-20 sm:top-24 left-1/2 -translate-x-1/2 z-40 bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-2xl border-2 border-[#E76F51] flex items-center gap-3.5 max-w-[92vw] sm:max-w-md pointer-events-auto cursor-pointer hover:scale-105 transition-all"
            onClick={() => setSelectedProductForModal({ product: hoveredProduct, initialTab: 'gallery' })}
          >
            <img
              src={hoveredProduct.featuredImage || hoveredProduct.images?.main || (Array.isArray(hoveredProduct.images) ? hoveredProduct.images[0]?.url : '/items/busy-cube.jfif')}
              alt={hoveredProduct.name}
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl object-cover bg-amber-50 shrink-0 border border-amber-200"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black bg-[#2D6A4F] text-white px-2 py-0.5 rounded-full uppercase">
                  {getBengaliProductDetails(hoveredProduct).ageBadge || '১–৫ বছর'}
                </span>
                <span className="text-[10px] sm:text-[11px] font-bold text-gray-500">
                  ক্লিক করে ৩ডি বিবরণ ও ভিডিও ডেমো দেখুন 👉
                </span>
              </div>
              <h4 className="text-xs sm:text-sm font-black text-[#24221F] truncate mt-0.5">
                {getBengaliProductDetails(hoveredProduct).bName || hoveredProduct.name}
              </h4>
              <div className="text-xs font-black text-[#E76F51] mt-0.5">
                ৳{hoveredProduct.price || 750}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= 3D Canvas Viewport ================= */}
      <div className="relative flex-1 w-full h-full">
        {loading ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-[#FAF7F1] text-center p-6 space-y-4">
            <RefreshCw className="w-12 h-12 text-[#E76F51] animate-spin" />
            <h3 className="text-xl font-black text-gray-800">
              ৩ডি খেলনা স্টোর সাজানো হচ্ছে...
            </h3>
            <p className="text-xs text-gray-500 max-w-sm">
              Google Sheets থেকে আপনার নির্বাচিত খেলনাগুলো ৩ডি সেলফে লোড করা হচ্ছে।
            </p>
          </div>
        ) : (
          <>
            <Store3DCanvas
              products={products}
              walkProgress={walkProgress}
              onWalkProgressChange={handleWalkChange}
              onSelectProduct={(prod) => {
                setSelectedProductForModal({ product: prod, initialTab: 'gallery' });
              }}
              onHoverProductChange={(prod) => setHoveredProduct(prod)}
            />

            {/* Mother, Daughter, and Son Walking Overlay */}
            {showFamily && (
              <FamilyWalkthroughOverlay
                walkProgress={walkProgress}
                isWalking={isWalking}
              />
            )}
          </>
        )}
      </div>

      {/* ================= On-Screen Walking Navigation Controls (Mobile & Desktop) ================= */}
      <div className="absolute left-3 sm:left-8 bottom-3 sm:bottom-6 z-30 flex items-center gap-2 pointer-events-auto">
        <button
          type="button"
          onClick={stepForward}
          className="h-10 sm:h-12 px-3 sm:px-4 rounded-2xl bg-white/95 hover:bg-white text-[#24221F] shadow-xl border border-[#E76F51]/40 flex items-center gap-1.5 font-black text-xs sm:text-sm transition-all active:scale-95 cursor-pointer"
          title="সামনে এগিয়ে যান"
        >
          <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-[#E76F51]" />
          <span>সামনে</span>
        </button>

        <button
          type="button"
          onClick={stepBackward}
          className="h-10 sm:h-12 px-3 sm:px-4 rounded-2xl bg-white/95 hover:bg-white text-[#24221F] shadow-xl border border-[#E8E0D2] flex items-center gap-1.5 font-black text-xs sm:text-sm transition-all active:scale-95 cursor-pointer"
          title="পেছনে আসুন"
        >
          <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
          <span>পেছনে</span>
        </button>

        {/* Auto Tour Toggle */}
        <button
          type="button"
          onClick={() => {
            const next = !isAutoWalking;
            setIsAutoWalking(next);
            showToast(next ? '▶️ অটো ট্যুর চালু হয়েছে' : '⏸️ অটো ট্যুর বন্ধ হয়েছে');
          }}
          className={`h-10 sm:h-12 px-3 sm:px-4 rounded-2xl shadow-xl flex items-center gap-1.5 font-black text-xs sm:text-sm transition-all active:scale-95 cursor-pointer ${
            isAutoWalking
              ? 'bg-[#E76F51] text-white border-2 border-white animate-pulse'
              : 'bg-white/95 hover:bg-white text-[#2D6A4F] border border-[#2D6A4F]/40'
          }`}
          title="স্বয়ংক্রিয়ভাবে পুরো স্টোরে হেঁটে বেড়ান"
        >
          {isAutoWalking ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
          <span>{isAutoWalking ? 'পজ' : 'অটো ট্যুর'}</span>
        </button>
      </div>

      {/* Floating Walkthrough Progress & Instructions Bar */}
      <div className="absolute right-3 sm:right-8 bottom-3 sm:bottom-6 z-30 flex items-center gap-2.5 bg-white/95 backdrop-blur-md px-3.5 py-2 sm:py-2.5 rounded-2xl shadow-xl border border-[#E8E0D2] text-[11px] sm:text-xs font-bold text-gray-700 pointer-events-auto">
        <Compass className="w-4 h-4 text-[#E76F51] animate-spin hidden sm:inline-block" style={{ animationDuration: '6s' }} />
        <span className="hidden md:inline">সোয়াইপ বা বোতামে হাঁটুন | যেকোনো খেলনায় ক্লিকে দেখুন</span>
        <span className="md:hidden">প্রগ্রেস</span>
        <div className="w-16 sm:w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#E76F51] to-[#2D6A4F] transition-all duration-300"
            style={{ width: `${Math.round(walkProgress * 100)}%` }}
          />
        </div>
      </div>

      {/* ================= Product Inspection Modal ================= */}
      {selectedProductForModal && (
        <ToyProductDetailModal
          product={selectedProductForModal.product}
          initialTab={selectedProductForModal.initialTab || 'gallery'}
          onClose={() => setSelectedProductForModal(null)}
          onAddToCart={(prod, qty) => {
            handleAddToCart(prod, qty);
          }}
          onScrollToCheckout={() => {
            setSelectedProductForModal(null);
            setIsCartOpen(true);
          }}
        />
      )}

      {/* ================= Fast Cash On Delivery Checkout Drawer ================= */}
      <StoreCheckoutDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onOrderSuccess={(orderData) => {
          setIsCartOpen(false);
          setCart({});
          setConfirmedOrder(orderData);
        }}
      />

      {/* ================= Exit Walkout Animation & Order Receipt ================= */}
      {confirmedOrder && (
        <ExitWalkoutAnimation
          confirmedOrder={confirmedOrder}
          onRestart={() => {
            setConfirmedOrder(null);
            setWalkProgress(0.05);
          }}
        />
      )}
    </div>
  );
};
