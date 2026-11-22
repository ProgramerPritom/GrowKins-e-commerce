import React, { useState, useEffect, useMemo } from 'react';
import { 
  Sparkles, Phone, ShoppingBag, ShieldCheck, Truck, RefreshCw, 
  Play, Plus, Minus, ArrowRight, Star, 
  CheckCircle2, AlertCircle, ChevronDown, Trash2, Check,
  Clock, Award, Copy
} from 'lucide-react';
import { productService, orderService } from '../../services';
import { apiClient } from '../../lib/api/client';
import { PRODUCTS } from '../../data/products';
import type { AdminOrder } from '../../types/admin';
import { GeminiToyChatbot } from './GeminiToyChatbot';
import { getBengaliProductDetails } from './bengaliToyData';
import { ToyProductDetailModal } from './ToyProductDetailModal';
import { CelebrationFirecrackers } from './CelebrationFirecrackers';

interface SelectedItem {
  productId: string;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  quantity: number;
}

export const GrowKinsToyWorldApp: React.FC = () => {
  // Catalog State
  const [products, setProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState<boolean>(true);

  // Cart / Selection State
  const [selectedItems, setSelectedItems] = useState<Record<string, SelectedItem>>({});

  // Product Demonstration & Feature Detail Modal State
  const [selectedProductForModal, setSelectedProductForModal] = useState<any | null>(null);

  // Checkout Form State
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [streetAddress, setStreetAddress] = useState<string>('');
  const [district, setDistrict] = useState<string>('ঢাকা');
  const [deliveryZone, setDeliveryZone] = useState<'inside-dhaka' | 'outside-dhaka'>('inside-dhaka');
  const [customerNote, setCustomerNote] = useState<string>('');

  // Order Submission State
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formError, setFormError] = useState<string>('');
  const [confirmedOrder, setConfirmedOrder] = useState<any | null>(null);
  const [reloadCountdown, setReloadCountdown] = useState<number>(6);
  const [copiedOrderId, setCopiedOrderId] = useState<boolean>(false);

  // Auto-reload countdown when order is confirmed
  useEffect(() => {
    if (!confirmedOrder) return;
    setReloadCountdown(6);
    const interval = setInterval(() => {
      setReloadCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          window.location.reload();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [confirmedOrder]);

  const handleManualReload = () => {
    window.location.reload();
  };

  // Quick Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Sync title for SEO & branding
  useEffect(() => {
    document.title = 'GrowKins Toy World — বাচ্চাদের সেরা শিক্ষণীয় ও নিরাপদ খেলনা (স্পেশাল অফার)';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Fetch Products with Dynamic Provider Storefront Selection (Synced via Google Sheets Database)
  useEffect(() => {
    let isMounted = true;
    async function loadCatalog() {
      setLoadingProducts(true);
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
        } catch (e) {
          console.warn('Error reading active toy ids from storage', e);
        }

        const activeIds = serverActiveIds || localActiveIds;

        let visibleProducts: any[];
        if (activeIds && Array.isArray(activeIds) && activeIds.length > 0) {
          // Exactly the products selected by the provider (5, 12, 25, 43 or any count)
          visibleProducts = allCatalog.filter(p => activeIds.includes(p.id));
          if (visibleProducts.length === 0) {
            visibleProducts = allCatalog;
          }
        } else {
          // If no restriction set, show all available products
          visibleProducts = allCatalog;
        }

        if (isMounted) {
          setProducts(visibleProducts);
        }
      } catch (err) {
        console.warn('API product fetch fallback to local products:', err);
        if (isMounted) {
          let activeIds: string[] | null = null;
          try {
            const saved = localStorage.getItem('gk_active_toy_world_ids');
            if (saved) activeIds = JSON.parse(saved);
          } catch (e) {}
          const visible = (activeIds && Array.isArray(activeIds) && activeIds.length > 0)
            ? PRODUCTS.filter(p => activeIds!.includes(p.id))
            : PRODUCTS;
          setProducts(visible.length > 0 ? visible : PRODUCTS);
        }
      } finally {
        if (isMounted) setLoadingProducts(false);
      }
    }

    loadCatalog();

    // Listen for real-time changes across tabs (when provider toggles items in /provider)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'gk_active_toy_world_ids') {
        loadCatalog();
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => { 
      isMounted = false;
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Delivery Charges (Configurable)
  const deliveryCharge = deliveryZone === 'inside-dhaka' ? 70 : 130;

  // Selected items calculations
  const itemsList = useMemo(() => Object.values(selectedItems), [selectedItems]);
  const totalItemCount = useMemo(() => itemsList.reduce((sum, item) => sum + item.quantity, 0), [itemsList]);
  const subtotal = useMemo(() => itemsList.reduce((sum, item) => sum + (item.price * item.quantity), 0), [itemsList]);
  const grandTotal = subtotal > 0 ? subtotal + deliveryCharge : 0;

  // Add / Increment Item
  const handleAddItem = (prod: any, qtyToAdd: number = 1) => {
    const pId = prod.id;
    const bData = getBengaliProductDetails(prod);
    const price = Number(prod.price) || 0;
    const originalPrice = Number(prod.originalPrice || prod.compareAtPrice) || Math.round(price * 1.35);
    const name = bData.bName || prod.name;
    const image = prod.featuredImage || prod.images?.main || (Array.isArray(prod.images) ? prod.images[0]?.url : '/items/busy-cube.jfif');

    setSelectedItems(prev => {
      const existing = prev[pId];
      if (existing) {
        return {
          ...prev,
          [pId]: { ...existing, quantity: existing.quantity + qtyToAdd }
        };
      } else {
        return {
          ...prev,
          [pId]: { productId: pId, name, price, originalPrice, image, quantity: qtyToAdd }
        };
      }
    });
    showToast(`'${name}' কার্টে যুক্ত হয়েছে!`);
  };

  // Decrement Item
  const handleDecrementItem = (pId: string) => {
    setSelectedItems(prev => {
      const existing = prev[pId];
      if (!existing) return prev;
      if (existing.quantity <= 1) {
        const updated = { ...prev };
        delete updated[pId];
        return updated;
      }
      return {
        ...prev,
        [pId]: { ...existing, quantity: existing.quantity - 1 }
      };
    });
  };

  // Delete / Remove Item completely
  const handleDeleteItem = (pId: string) => {
    setSelectedItems(prev => {
      const updated = { ...prev };
      delete updated[pId];
      return updated;
    });
    showToast('পণ্যটি নির্বাচন থেকে বাদ দেওয়া হয়েছে');
  };

  // Clear all items
  const handleClearAllItems = () => {
    setSelectedItems({});
    showToast('কার্ট খালি করা হয়েছে');
  };

  const handleScrollToCheckout = () => {
    const el = document.getElementById('direct-checkout-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handle Order Submit
  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (itemsList.length === 0) {
      setFormError('অনুগ্রহ করে উপরের ক্যাটালগ থেকে অন্তত একটি খেলনা নির্বাচন করুন!');
      return;
    }

    if (!customerName.trim()) {
      setFormError('অনুগ্রহ করে আপনার পূর্ণ নাম লিখুন।');
      return;
    }

    const cleanedPhone = customerPhone.trim().replace(/\D/g, '');
    const phoneRegex = /^01[3-9]\d{8}$/;
    if (!phoneRegex.test(cleanedPhone)) {
      setFormError('অনুগ্রহ করে সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 01712345678)');
      return;
    }

    if (!streetAddress.trim()) {
      setFormError('অনুগ্রহ করে আপনার সম্পূর্ণ ডেলিভারি ঠিকানা (বাসা নং, রোড, থানা) লিখুন।');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderPayload: Partial<AdminOrder> = {
        orderNumber: 'GK-' + Math.floor(100000 + Math.random() * 900000),
        customer: {
          name: customerName.trim(),
          phone: cleanedPhone
        },
        deliveryAddress: {
          fullName: customerName.trim(),
          phone: cleanedPhone,
          deliveryZone: deliveryZone,
          district: district.trim(),
          thanaArea: '',
          streetAddress: streetAddress.trim()
        },
        items: itemsList.map(it => ({
          productId: it.productId,
          name: it.name,
          image: it.image,
          price: it.price,
          quantity: it.quantity,
          total: it.price * it.quantity
        })),
        subtotal,
        deliveryFee: deliveryCharge,
        discount: 0,
        total: grandTotal,
        currency: 'BDT',
        paymentMethod: 'Cash on Delivery',
        paymentStatus: 'cod_pending',
        status: 'pending',
        notes: customerNote.trim() || 'GrowKins Toy World Landing Page Order'
      };

      const res = await orderService.create(orderPayload);
      const savedData = res.data || orderPayload;

      setConfirmedOrder({
        ...savedData,
        orderNumber: savedData.orderNumber || orderPayload.orderNumber,
        items: itemsList,
        total: grandTotal,
        deliveryCharge,
        customerName: customerName.trim(),
        customerPhone: cleanedPhone,
        address: `${streetAddress.trim()}, ${district.trim()}`
      });

      // Celebration Toast Notification
      showToast('🎉 অভিনন্দন! আপনার অর্ডার সফলভাবে নিশ্চিত হয়েছে!');

      // Clear selection
      setSelectedItems({});
      setCustomerName('');
      setCustomerPhone('');
      setStreetAddress('');
      setCustomerNote('');
    } catch (err) {
      console.error('Order submission error:', err);
      setFormError('অর্ডার সাবমিট করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F1] text-[#24221F] flex flex-col font-sans selection:bg-[#E76F51]/20 selection:text-[#24221F] w-full overflow-x-hidden">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#24221F] text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-bold animate-in fade-in slide-in-from-top-2 border border-white/10">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Urgent Offer Banner (Full Width) */}
      <div className="bg-[#2D6A4F] text-[#FAF7F1] text-xs sm:text-sm py-2.5 px-4 font-semibold text-center flex items-center justify-center gap-2 shadow-inner">
        <Sparkles className="w-4 h-4 text-[#F7E198] animate-pulse shrink-0" />
        <span>স্পেশাল অফার চলছে! সারা বাংলাদেশে ক্যাশ অন ডেলিভারি (পণ্য হাতে পেয়ে মূল্য পরিশোধ করুন)।</span>
      </div>

      {/* Branded Header (Full Width Fluid) */}
      <header className="sticky top-0 z-40 bg-[#FAF7F1]/95 backdrop-blur-md border-b border-[#E8E0D2] shadow-sm w-full">
        <div className="w-full max-w-[1520px] mx-auto px-4 sm:px-8 h-16 sm:h-20 flex items-center justify-between">
          {/* Logo & Brand Name */}
          <div 
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-[#E76F51] to-[#F4A261] flex items-center justify-center shadow-md text-white font-black text-xl sm:text-2xl">
              G
            </div>
            <div>
              <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-[#24221F] block leading-none">
                GrowKins
              </span>
              <span className="text-[10px] sm:text-xs font-black text-[#E76F51] tracking-wider uppercase">
                Toy World • স্পেশাল অফার
              </span>
            </div>
          </div>

          {/* Hotline, 3D Store & Scroll to Checkout */}
          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="/3d-toy-store"
              className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-black shadow-md hover:shadow-lg transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>৩ডি ভার্চুয়াল স্টোর 🎪</span>
            </a>

            <a
              href="tel:01700000000"
              className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 hover:bg-emerald-100 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span>হটলাইন: 01700-000000</span>
            </a>

            <button
              onClick={handleScrollToCheckout}
              className="relative flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-full bg-[#E76F51] hover:bg-[#D45A3D] text-white text-xs sm:text-sm font-extrabold shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>অর্ডার ফর্ম</span>
              {totalItemCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-white text-[#E76F51] font-black text-xs flex items-center justify-center shadow">
                  {totalItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full">
        {/* Full-Width Impact Hero Section */}
        <section className="py-10 sm:py-16 px-4 sm:px-8 bg-gradient-to-b from-[#FFFDF9] via-[#FAF7F1] to-[#FAF7F1] border-b border-[#E8E0D2]/60 w-full">
          <div className="w-full max-w-[1520px] mx-auto text-center space-y-5">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E76F51]/10 text-[#E76F51] text-xs sm:text-sm font-black tracking-wide border border-[#E76F51]/20">
              <Award className="w-4 h-4" />
              <span>বাচ্চাদের ব্রেন ডেভেলপমেন্টের সেরা শিক্ষণীয় খেলনা</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#24221F] tracking-tight leading-tight sm:leading-tight max-w-4xl mx-auto">
              সন্তানের স্ক্রিন-টাইম কমিয়ে বুদ্ধিমত্তা বিকাশে <br className="hidden sm:inline" />
              <span className="text-[#E76F51]">১০০% নিরাপদ ও শিক্ষণীয় খেলনা</span>
            </h1>

            <p className="text-sm sm:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              বাচ্চার মনোযোগ, হাত ও চোখের ব্যালেন্স এবং চিন্তা শক্তি বৃদ্ধি করতে মন্টেসরি মেথডে তৈরি। কোনো ক্ষতিকর কেমিক্যাল নেই, সম্পূর্ণ নিরাপদ কাঠের ফিনিশিং।
            </p>

            {/* Trust Badges */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm font-bold text-gray-700">
              <span className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> ১০০% নন-টক্সিক ও নিরাপদ
              </span>
              <span className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm">
                <Truck className="w-4 h-4 text-blue-600" /> ক্যাশ অন ডেলিভারি সুবিধা
              </span>
              <span className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm">
                <RefreshCw className="w-4 h-4 text-amber-600" /> সহজ রিটার্ন গ্যারান্টি
              </span>
              <span className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm">
                <Clock className="w-4 h-4 text-purple-600" /> ঢাকার ভেতর ২৪–৪৮ ঘণ্টায় ডেলিভারি
              </span>
            </div>

            {/* Quick Action Scroll Button */}
            <div className="pt-4">
              <button
                onClick={() => {
                  const el = document.getElementById('toy-catalog-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-[#24221F] hover:bg-[#383530] text-white text-sm sm:text-base font-extrabold shadow-lg hover:shadow-xl transition-all cursor-pointer hover:scale-105"
              >
                <span>খেলনা দেখুন ও অর্ডার করুন</span>
                <ChevronDown className="w-4 h-4 animate-bounce" />
              </button>
            </div>
          </div>
        </section>

        {/* 20 Curated Products Catalog Section (Full-Width Grid) */}
        <section id="toy-catalog-section" className="py-12 sm:py-16 px-4 sm:px-8 w-full max-w-[1520px] mx-auto">
          <div className="text-center mb-10 sm:mb-14">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#2D6A4F]/10 text-[#2D6A4F] text-xs font-black tracking-wider uppercase mb-2">
              🌟 আমাদের হট কালেকশন ({products.length}টি খেলনা)
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-[#24221F]">
              পছন্দের খেলনা নির্বাচন করুন
            </h2>
            <p className="text-xs sm:text-base text-gray-500 mt-1.5 max-w-2xl mx-auto">
              প্রতিটি খেলনার ভিডিও ডেমো ও বিস্তারিত ফিচার দেখে নিন। পছন্দ হলে এক ক্লিকেই অর্ডার করতে পারবেন।
            </p>
          </div>

          {loadingProducts ? (
            <div className="p-16 rounded-3xl bg-white border border-[#E8E0D2] shadow-sm text-center">
              <RefreshCw className="w-10 h-10 animate-spin mx-auto text-[#E76F51] mb-3" />
              <p className="text-base font-bold text-gray-700">খেলনা ক্যাটালগ লোড হচ্ছে...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="p-16 rounded-3xl bg-white border border-[#E8E0D2] shadow-sm text-center space-y-3">
              <ShoppingBag className="w-12 h-12 mx-auto text-gray-300" />
              <h4 className="text-lg font-black text-gray-800">বর্তমানে কোনো খেলনা সক্রিয় করা নেই</h4>
              <p className="text-xs text-gray-500 max-w-md mx-auto">
                প্রোভাইডার পোর্টাল (<a href="/provider" target="_blank" className="text-[#E76F51] underline font-bold">/provider</a>) থেকে যেসব খেলনা সক্রিয় করা হবে, শুধুমাত্র সেই খেলনাগুলোই এখানে প্রদর্শিত হবে।
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 sm:gap-8">
              {products.map((prod) => {
                const pId = prod.id;
                const bData = getBengaliProductDetails(prod);
                const name = bData.bName;
                const subtitle = bData.bSubtitle;
                const price = Number(prod.price) || 0;
                const originalPrice = Number(prod.originalPrice || prod.compareAtPrice) || Math.round(price * 1.35);
                const discountAmount = originalPrice > price ? originalPrice - price : 0;
                const discountPct = originalPrice > price ? Math.round((discountAmount / originalPrice) * 100) : 0;
                const image = prod.featuredImage || prod.images?.main || (Array.isArray(prod.images) ? prod.images[0]?.url : '/items/busy-cube.jfif');
                const ageBadge = bData.ageBadge || prod.ageBadge || '১–৫ বছর';
                const selected = selectedItems[pId];
                const features = bData.features.slice(0, 3);

                return (
                  <div
                    key={pId}
                    className={`bg-white rounded-3xl border transition-all duration-300 overflow-hidden flex flex-col justify-between ${
                      selected 
                        ? 'border-[#E76F51] shadow-xl ring-2 ring-[#E76F51]/30 bg-amber-50/10' 
                        : 'border-[#E8E0D2] shadow-sm hover:shadow-xl hover:border-[#E76F51]/40'
                    }`}
                  >
                    <div>
                      {/* Product Image & Badges */}
                      <div 
                        className="relative aspect-[4/3] bg-[#FAF7F1] overflow-hidden group cursor-pointer"
                        onClick={() => setSelectedProductForModal({ product: prod, initialTab: 'gallery' })}
                      >
                        <img
                          src={image}
                          alt={name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />

                        {/* Age Suitability Badge */}
                        <div className="absolute top-3 left-3 bg-[#24221F]/90 backdrop-blur-md text-[#FAF7F1] text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow">
                          {ageBadge}
                        </div>

                        {/* Special Discount Urgency Badge */}
                        {discountAmount > 0 && (
                          <div className="absolute top-3 right-3 bg-[#E76F51] text-white text-[11px] font-black px-2.5 py-1 rounded-full shadow-md animate-pulse">
                            ৳{discountAmount} ছাড়!
                          </div>
                        )}

                        {/* High-visibility YouTube Video & Details Modal Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedProductForModal({ product: prod, initialTab: 'video' });
                          }}
                          className="absolute bottom-3 right-3 flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/95 hover:bg-white text-gray-900 text-xs font-black shadow-lg backdrop-blur-md transition-all cursor-pointer hover:scale-105 border border-gray-100"
                        >
                          <div className="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center shrink-0">
                            <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
                          </div>
                          <span>ভিডিও ও বিস্তারিত</span>
                        </button>
                      </div>

                      {/* Product Content & Features (100% Bengali) */}
                      <div className="p-5 space-y-3">
                        {/* Rating & Review */}
                        <div className="flex items-center gap-1.5 text-amber-500 text-xs">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span className="font-bold text-gray-800">{prod.rating || '4.9'}</span>
                          <span className="text-gray-400 text-[11px]">({prod.reviewCount || '120'}+ অভিভাবকের মতামত)</span>
                        </div>

                        {/* Title & Subtitle */}
                        <h3 
                          className="font-extrabold text-lg text-[#24221F] line-clamp-1 leading-snug cursor-pointer hover:text-[#E76F51] transition-colors"
                          onClick={() => setSelectedProductForModal(prod)}
                        >
                          {name}
                        </h3>
                        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                          {subtitle}
                        </p>

                        {/* Key Features & Benefits Bullets (Checkmarks) */}
                        <div className="pt-2 border-t border-gray-100 space-y-1.5">
                          <p className="text-[10px] font-black uppercase text-gray-400 tracking-wider">
                            প্রধান বৈশিষ্ট্যসমূহ:
                          </p>
                          {features.map((feat: string, idx: number) => (
                            <div key={idx} className="flex items-start gap-1.5 text-xs text-gray-700">
                              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                              <span className="line-clamp-1 font-medium">{feat}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Pricing Block & Action Controls */}
                    <div className="p-5 pt-0">
                      {/* Price Banner */}
                      <div className="bg-[#FAF7F1] p-3 rounded-2xl border border-[#E8E0D2] flex items-center justify-between mb-3.5">
                        <div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-xl sm:text-2xl font-black text-[#2D6A4F]">
                              ৳{price}
                            </span>
                            {originalPrice > price && (
                              <span className="text-xs font-semibold text-rose-500 line-through">
                                ৳{originalPrice}
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] font-bold text-gray-500 block">
                            ক্যাশ অন ডেলিভারি • স্টক সীমিত
                          </span>
                        </div>

                        {discountPct > 0 && (
                          <span className="px-2 py-1 rounded-xl text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
                            {discountPct}% সেভ
                          </span>
                        )}
                      </div>

                      {/* Selection / Quantity & Delete Controls */}
                      {selected ? (
                        <div className="flex items-center gap-2">
                          {/* Stepper (+ / -) */}
                          <div className="flex-1 flex items-center justify-between bg-[#E76F51]/10 border border-[#E76F51]/40 rounded-2xl p-1.5">
                            <button
                              type="button"
                              onClick={() => handleDecrementItem(pId)}
                              className="w-8 h-8 rounded-xl bg-white text-[#E76F51] hover:bg-gray-100 flex items-center justify-center shadow-sm font-bold cursor-pointer"
                              title="কোয়ান্টিটি কমান"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="font-black text-sm text-[#E76F51] px-2 text-center">
                              {selected.quantity} টি
                            </span>
                            <button
                              type="button"
                              onClick={() => handleAddItem(prod)}
                              className="w-8 h-8 rounded-xl bg-[#E76F51] text-white hover:bg-[#D45A3D] flex items-center justify-center shadow-sm font-bold cursor-pointer"
                              title="কোয়ান্টিটি বাড়ান"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Delete / Remove Button */}
                          <button
                            type="button"
                            onClick={() => handleDeleteItem(pId)}
                            className="p-2.5 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition-colors cursor-pointer"
                            title="নির্বাচন থেকে বাদ দিন"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleAddItem(prod)}
                          className="w-full py-3 px-4 rounded-2xl bg-[#E76F51] hover:bg-[#D45A3D] text-white text-sm font-extrabold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02]"
                        >
                          <ShoppingBag className="w-4 h-4" />
                          <span>অর্ডার করুন</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Full-Width Trust & Why Choose GrowKins Section */}
        <section className="py-12 sm:py-16 bg-[#FAF3E8] border-y border-[#E8E0D2] w-full px-4 sm:px-8">
          <div className="w-full max-w-[1520px] mx-auto">
            <div className="text-center mb-10">
              <h3 className="text-2xl sm:text-3xl font-black text-[#24221F]">
                অভিভাবকরা কেন GrowKins খেলনা বেছে নেন?
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                আপনার সোনামণির মানসিক বিকাশ এবং আনন্দময় শৈশবের সেরা প্রতিশ্রুতি
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
              <div className="bg-white p-6 rounded-3xl border border-[#E8E0D2] shadow-sm space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-[#2D6A4F]/10 text-[#2D6A4F] flex items-center justify-center mx-auto">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <h4 className="font-black text-base text-gray-900">১০০% নন-টক্সিক ও নিরাপদ</h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  আন্তর্জাতিক শিশু নিরাপত্তা মান অনুযায়ী পরীক্ষিত। কোনো ক্ষতিকর কেমিক্যাল বা ধারালো কোণা নেই।
                </p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-[#E8E0D2] shadow-sm space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-[#E76F51]/10 text-[#E76F51] flex items-center justify-center mx-auto">
                  <Truck className="w-7 h-7" />
                </div>
                <h4 className="font-black text-base text-gray-900">ক্যাশ অন ডেলিভারি</h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  পণ্য হাতে পেয়ে চেক করে মূল্য পরিশোধ করুন। কোনো অগ্রিম পেমেন্টের ঝুঁকি নেই।
                </p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-[#E8E0D2] shadow-sm space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto">
                  <Sparkles className="w-7 h-7" />
                </div>
                <h4 className="font-black text-base text-gray-900">ব্রেন ডেভেলপমেন্ট মেথড</h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  মন্টেসরি মেথডে ডিজাইন করা, যা বাচ্চার মনোযোগ, চিন্তা শক্তি ও মোটর স্কিল দ্রুত বৃদ্ধি করে।
                </p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-[#E8E0D2] shadow-sm space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-purple-500/10 text-purple-600 flex items-center justify-center mx-auto">
                  <RefreshCw className="w-7 h-7" />
                </div>
                <h4 className="font-black text-base text-gray-900">সহজ রিটার্ন ও রিপ্লেসমেন্ট</h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  কোনো সমস্যা হলে ৭ দিনের মধ্যে দ্রুত রিপ্লেসমেন্ট সুবিধা। আমরা সবসময় আপনার পাশে আছি।
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* High-Converting Single Page Direct Checkout Section */}
        <section id="direct-checkout-section" className="py-12 sm:py-20 px-4 sm:px-8 w-full max-w-5xl mx-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-12 border border-[#E8E0D2] shadow-2xl space-y-8">
            <div className="text-center space-y-2 border-b border-gray-100 pb-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-black border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>ক্যাশ অন ডেলিভারি অর্ডার ফর্ম</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-[#24221F]">
                অর্ডার নিশ্চিত করতে নিচের তথ্যগুলো পূরণ করুন
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 max-w-lg mx-auto">
                পণ্য হাতে পেয়ে চেক করে মূল্য পরিশোধ করবেন। কোনো অগ্রিম পেমেন্টের প্রয়োজন নেই।
              </p>
            </div>

            {/* Form Error Banner */}
            {formError && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 px-5 py-3.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2.5 animate-shake">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmitOrder} className="space-y-8">
              {/* Step 1: Selected Toys Summary with Delete Option */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-black text-gray-700 uppercase tracking-wider">
                    ১. নির্বাচিত পণ্যসমূহ ({totalItemCount} টি)
                  </label>
                  {itemsList.length > 0 && (
                    <button
                      type="button"
                      onClick={handleClearAllItems}
                      className="text-xs font-bold text-rose-600 hover:text-rose-800 flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>সব মুছুন</span>
                    </button>
                  )}
                </div>

                {itemsList.length === 0 ? (
                  <div className="p-8 rounded-3xl bg-amber-50/70 border-2 border-dashed border-amber-200 text-center space-y-3">
                    <ShoppingBag className="w-8 h-8 mx-auto text-amber-600" />
                    <p className="text-sm font-bold text-amber-900">
                      আপনি এখনও কোনো খেলনা নির্বাচন করেননি!
                    </p>
                    <p className="text-xs text-amber-700 max-w-md mx-auto">
                      অর্ডার করতে উপরের ক্যাটালগ থেকে পছন্দের খেলনার নিচের "অর্ডার করুন" বাটনে ক্লিক করুন।
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        const el = document.getElementById('toy-catalog-section');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="px-6 py-2.5 rounded-full bg-[#E76F51] hover:bg-[#D45A3D] text-white text-xs font-black cursor-pointer shadow-md"
                    >
                      খেলনা নির্বাচন করতে যান
                    </button>
                  </div>
                ) : (
                  <div className="border border-gray-200 rounded-3xl divide-y divide-gray-100 overflow-hidden shadow-sm">
                    {itemsList.map((item) => (
                      <div key={item.productId} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
                        <div className="flex items-center gap-3.5 min-w-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 rounded-2xl object-cover bg-gray-50 border shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="font-black text-sm text-gray-900 truncate max-w-[240px] sm:max-w-md">
                              {item.name}
                            </p>
                            <p className="text-gray-500 text-xs">
                              ৳{item.price} প্রতি পিস
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                          {/* Quantity Stepper */}
                          <div className="flex items-center gap-1.5 bg-gray-100 rounded-2xl p-1">
                            <button
                              type="button"
                              onClick={() => handleDecrementItem(item.productId)}
                              className="w-7 h-7 rounded-xl bg-white text-gray-700 flex items-center justify-center shadow-sm cursor-pointer hover:bg-gray-50"
                              title="কমান"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="font-black px-2 text-xs text-gray-900">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => handleAddItem({ id: item.productId, name: item.name, price: item.price, images: { main: item.image } })}
                              className="w-7 h-7 rounded-xl bg-[#E76F51] text-white flex items-center justify-center shadow-sm cursor-pointer hover:bg-[#D45A3D]"
                              title="বাড়ান"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Line Total */}
                          <span className="font-black text-emerald-700 text-sm sm:text-base min-w-[70px] text-right">
                            ৳{item.price * item.quantity}
                          </span>

                          {/* Delete Item Button */}
                          <button
                            type="button"
                            onClick={() => handleDeleteItem(item.productId)}
                            className="p-2 rounded-xl text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="আইটেমটি বাদ দিন"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Step 2: Customer Contact Information */}
              <div className="space-y-4">
                <label className="block text-xs font-black text-gray-700 uppercase tracking-wider">
                  ২. আপনার নাম ও সচল মোবাইল নম্বর
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      আপনার পূর্ণ নাম <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="যেমন: রাফি আহমেদ"
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:border-[#E76F51] focus:ring-2 focus:ring-[#E76F51]/10 bg-gray-50/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      মোবাইল নম্বর (১১ ডিজিট) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="যেমন: 01712345678"
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:border-[#E76F51] focus:ring-2 focus:ring-[#E76F51]/10 bg-gray-50/50"
                    />
                  </div>
                </div>
              </div>

              {/* Step 3: Delivery Location & Area Selector */}
              <div className="space-y-4">
                <label className="block text-xs font-black text-gray-700 uppercase tracking-wider">
                  ৩. ডেলিভারি এলাকা নির্বাচন করুন
                </label>

                {/* Big Selectable Delivery Zone Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div
                    onClick={() => { setDeliveryZone('inside-dhaka'); setDistrict('ঢাকা'); }}
                    className={`p-4 rounded-3xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                      deliveryZone === 'inside-dhaka'
                        ? 'border-[#E76F51] bg-[#E76F51]/5 shadow-md ring-2 ring-[#E76F51]/20'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        deliveryZone === 'inside-dhaka' ? 'border-[#E76F51] bg-[#E76F51]' : 'border-gray-300'
                      }`}>
                        {deliveryZone === 'inside-dhaka' && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                      <div>
                        <p className="font-black text-sm text-gray-900">ঢাকার ভিতরে</p>
                        <p className="text-xs text-gray-500">হোম ডেলিভারি (২৪-৪৮ ঘণ্টা)</p>
                      </div>
                    </div>
                    <span className="font-black text-base text-[#2D6A4F]">৳৭০</span>
                  </div>

                  <div
                    onClick={() => { setDeliveryZone('outside-dhaka'); if (district === 'ঢাকা') setDistrict(''); }}
                    className={`p-4 rounded-3xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                      deliveryZone === 'outside-dhaka'
                        ? 'border-[#E76F51] bg-[#E76F51]/5 shadow-md ring-2 ring-[#E76F51]/20'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        deliveryZone === 'outside-dhaka' ? 'border-[#E76F51] bg-[#E76F51]' : 'border-gray-300'
                      }`}>
                        {deliveryZone === 'outside-dhaka' && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                      <div>
                        <p className="font-black text-sm text-gray-900">ঢাকার বাইরে</p>
                        <p className="text-xs text-gray-500">সারা বাংলাদেশ (২-৪ দিন)</p>
                      </div>
                    </div>
                    <span className="font-black text-base text-[#2D6A4F]">৳১৩০</span>
                  </div>
                </div>

                {/* Detailed Address Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                  <div className="sm:col-span-1">
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      জেলা / শহর
                    </label>
                    <input
                      type="text"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      placeholder="যেমন: চট্টগ্রাম / খুলনা"
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:border-[#E76F51] bg-gray-50/50"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      পূর্ণাঙ্গ ঠিকানা (বাসা নং, রোড, থানা) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={streetAddress}
                      onChange={(e) => setStreetAddress(e.target.value)}
                      placeholder="যেমন: বাড়ি ১২, রোড ৪, ব্লক সি, বনশ্রী, ঢাকা"
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:border-[#E76F51] bg-gray-50/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    কাস্টমার ডেলিভারি নোট (ঐচ্ছিক)
                  </label>
                  <input
                    type="text"
                    value={customerNote}
                    onChange={(e) => setCustomerNote(e.target.value)}
                    placeholder="যেমন: অফিসে বিকেলে ডেলিভারি দিলে ভালো হয়"
                    className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 text-xs focus:outline-none focus:border-[#E76F51] bg-gray-50/50"
                  />
                </div>
              </div>

              {/* Price Calculation Summary Box */}
              <div className="bg-[#FAF7F1] rounded-3xl p-6 space-y-3 border border-[#E8E0D2] text-xs sm:text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>পণ্যের মোট মূল্য (সাবটোটাল)</span>
                  <span className="font-bold text-gray-900">৳{subtotal}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>ডেলিভারি চার্জ ({deliveryZone === 'inside-dhaka' ? 'ঢাকার ভিতরে' : 'ঢাকার বাইরে'})</span>
                  <span className="font-bold text-gray-900">৳{deliveryCharge}</span>
                </div>
                <div className="flex justify-between text-base sm:text-lg font-black text-gray-900 pt-3 border-t border-[#E8E0D2]">
                  <span>সর্বমোট প্রদেয় বিল</span>
                  <span className="text-[#2D6A4F] text-xl sm:text-2xl">৳{grandTotal}</span>
                </div>
                <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>পেমেন্ট মেথড: ক্যাশ অন ডেলিভারি (পণ্য হাতে পেয়ে চেক করে টাকা পরিশোধ করবেন)</span>
                </div>
              </div>

              {/* Final Confirm Order CTA Button */}
              <button
                type="submit"
                disabled={isSubmitting || itemsList.length === 0}
                className="w-full py-4 sm:py-5 rounded-3xl bg-gradient-to-r from-[#E76F51] via-[#E25C3C] to-[#D45A3D] hover:from-[#D45A3D] hover:to-[#C84F31] text-white font-black text-base sm:text-xl shadow-2xl hover:shadow-[#E76F51]/30 transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01]"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>অর্ডার প্রসেস হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-6 h-6" />
                    <span>অর্ডার কনফার্ম করুন (সর্বমোট ৳{grandTotal})</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </section>
      </main>

      {/* Sticky Bottom Order Summary Bar (Appears when items are selected) */}
      {itemsList.length > 0 && (
        <aside aria-label="Selected cart bar" className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-2xl p-3 sm:p-4 animate-in slide-in-from-bottom-4">
          <div className="w-full max-w-[1520px] mx-auto px-4 sm:px-8 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full bg-[#E76F51] text-white font-black text-xs flex items-center justify-center shadow">
                {totalItemCount}
              </span>
              <div>
                <p className="text-xs text-gray-500 font-bold">নির্বাচিত খেলনা ({totalItemCount} টি)</p>
                <p className="text-base sm:text-xl font-black text-[#2D6A4F] leading-none mt-0.5">
                  ৳{subtotal} <span className="text-[11px] font-normal text-gray-500">(+ ডেলিভারি ৳{deliveryCharge})</span>
                </p>
              </div>
            </div>

            <button
              onClick={handleScrollToCheckout}
              className="flex items-center gap-2 px-5 sm:px-8 py-2.5 sm:py-3 rounded-full bg-[#E76F51] hover:bg-[#D45A3D] text-white text-xs sm:text-sm font-black shadow-lg transition-transform hover:scale-105 cursor-pointer"
            >
              <span>অর্ডার সম্পন্ন করতে এগিয়ে যান</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </aside>
      )}

      {/* Rich Interactive Product Demonstration & Feature Detail Modal */}
      {selectedProductForModal && (
        <ToyProductDetailModal
          product={selectedProductForModal.product || selectedProductForModal}
          initialTab={selectedProductForModal.initialTab || 'gallery'}
          onClose={() => setSelectedProductForModal(null)}
          onAddToCart={handleAddItem}
          onScrollToCheckout={handleScrollToCheckout}
        />
      )}

      {/* Firecrackers Celebration Particle Burst */}
      {confirmedOrder && <CelebrationFirecrackers />}

      {/* Order Success Confirmation Modal */}
      {confirmedOrder && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-in zoom-in-95 duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-100 text-center space-y-5 relative overflow-hidden">
            
            {/* Top celebratory firecracker pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-emerald-500/10 border border-amber-300 text-amber-800 text-xs font-black tracking-wider uppercase shadow-xs">
              <span>🎆 অভিনন্দন! অর্ডার কনফার্ম হয়েছে! 🎇</span>
            </div>

            {/* Glowing animated checkmark */}
            <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-emerald-100 animate-ping opacity-30" />
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center shadow-lg">
                <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
              </div>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight">
                অর্ডার সফল হয়েছে! 🎉
              </h3>
              <div className="flex items-center justify-center gap-2 pt-1">
                <span className="font-black text-xs sm:text-sm text-[#E76F51] bg-[#FAF7F1] px-3 py-1 rounded-xl border border-[#E8E0D2]">
                  অর্ডার আইডি: #{confirmedOrder.orderNumber}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(confirmedOrder.orderNumber || '');
                    setCopiedOrderId(true);
                    setTimeout(() => setCopiedOrderId(false), 2000);
                  }}
                  className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
                  title="অর্ডার আইডি কপি করুন"
                >
                  {copiedOrderId ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs text-gray-500 pt-1">
                আমাদের কাস্টমার কেয়ার প্রতিনিধি শীঘ্রই আপনার নম্বরে কল দিয়ে অর্ডারটি নিশ্চিত করবেন।
              </p>
            </div>

            {/* Order snapshot */}
            <div className="bg-[#FAF7F1] p-4 rounded-2xl text-left text-xs space-y-2.5 border border-[#E8E0D2]">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">গ্রাহকের নাম:</span>
                <span className="font-bold text-gray-900">{confirmedOrder.customerName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">মোবাইল নম্বর:</span>
                <span className="font-bold text-gray-900">{confirmedOrder.customerPhone}</span>
              </div>
              <div className="flex justify-between items-start gap-2">
                <span className="text-gray-500 shrink-0">ডেলিভারি ঠিকানা:</span>
                <span className="font-bold text-gray-900 text-right">{confirmedOrder.address}</span>
              </div>
              
              {/* Ordered Items Mini List */}
              {Array.isArray(confirmedOrder.items) && confirmedOrder.items.length > 0 && (
                <div className="pt-2 border-t border-gray-200 space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">
                    অর্ডারকৃত খেলনাসমূহ ({confirmedOrder.items.length}টি):
                  </span>
                  {confirmedOrder.items.map((it: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center text-[11px] text-gray-700">
                      <span className="truncate max-w-[200px]">• {it.name} × {it.quantity}</span>
                      <span className="font-bold">৳{it.price * it.quantity}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-between items-center border-t border-gray-200 pt-2.5 font-black text-sm sm:text-base text-emerald-800">
                <span>সর্বমোট প্রদেয় (ক্যাশ অন ডেলিভারি):</span>
                <span className="text-lg">৳{confirmedOrder.total}</span>
              </div>
            </div>

            {/* Auto Reload Notice & Countdown Progress Bar */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between text-xs font-bold text-gray-600">
                <span className="flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#E76F51]" />
                  <span>পৃষ্ঠাটি স্বয়ংক্রিয়ভাবে রিলোড হবে...</span>
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-600 font-black text-xs border border-rose-200">
                  {reloadCountdown} সেকেন্ড
                </span>
              </div>

              {/* Animated Progress Bar */}
              <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-[#E76F51] via-amber-500 to-emerald-500 h-full transition-all duration-1000 ease-linear rounded-full"
                  style={{ width: `${(reloadCountdown / 6) * 100}%` }}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-1">
              <button
                type="button"
                onClick={handleManualReload}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#24221F] to-[#383530] hover:from-[#E76F51] hover:to-[#D45A3D] text-white font-black text-xs sm:text-sm shadow-lg hover:shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99]"
              >
                <RefreshCw className="w-4 h-4" />
                <span>এখনই রিলোড ও নতুন অর্ডার করুন</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Footer (Full-Width) */}
      <footer className="bg-[#24221F] text-[#FAF7F1] py-12 px-4 sm:px-8 text-center text-xs text-gray-400 border-t border-[#383530] mt-12 w-full">
        <div className="w-full max-w-[1520px] mx-auto space-y-3">
          <div className="flex items-center justify-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#E76F51] text-white flex items-center justify-center font-black text-sm">
              G
            </div>
            <span className="font-bold text-base text-[#FAF7F1]">GrowKins Toy World</span>
          </div>
          <p className="max-w-md mx-auto text-gray-400">
            বাচ্চাদের ব্রেন ডেভেলপমেন্ট ও হাসিখুশি শৈশবের জন্য নিরাপদ খেলনার বিশ্বস্ত ঠিকানা।
          </p>
          <div className="pt-2 text-[11px] text-gray-500 border-t border-gray-800">
            © {new Date().getFullYear()} GrowKins Bangladesh. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Floating Bengali Gemini AI Product Assistant */}
      <GeminiToyChatbot
        products={products}
        onSelectProduct={handleAddItem}
        onScrollToCheckout={handleScrollToCheckout}
      />
    </div>
  );
};
