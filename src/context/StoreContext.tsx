import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Product, CartItem, DeliveryDetails, Order, AgeRange, Category, Interest, DevelopmentalBenefit, Material, Occasion } from '../types';
import { PRODUCTS } from '../data/products';
import { MockDatabase } from '../lib/mockDb/MockDatabase';
import { orderService, productService } from '../services';
import type { AdminOrder } from '../types/admin';

export type AppView = 
  | 'home' 
  | 'shop' 
  | 'product' 
  | 'cart' 
  | 'checkout' 
  | 'confirmation' 
  | 'wishlist' 
  | 'our-story';

export interface FilterState {
  age: AgeRange[];
  category: Category[];
  interest: Interest[];
  benefit: DevelopmentalBenefit[];
  material: Material[];
  occasion: Occasion[];
  maxPrice: number;
  inStockOnly: boolean;
  sortBy: 'featured' | 'price-low' | 'price-high' | 'rating';
  searchQuery: string;
}

const DEFAULT_FILTERS: FilterState = {
  age: [],
  category: [],
  interest: [],
  benefit: [],
  material: [],
  occasion: [],
  maxPrice: 5000,
  inStockOnly: false,
  sortBy: 'featured',
  searchQuery: ''
};

export interface StoreToast {
  id: string;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info' | 'delete';
  title?: string;
  image?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface StoreContextType {
  // Navigation
  view: AppView;
  setView: (view: AppView) => void;
  selectedProductId: string;
  openProduct: (productId: string) => void;
  cartDrawerOpen: boolean;
  setCartDrawerOpen: (open: boolean) => void;
  searchModalOpen: boolean;
  setSearchModalOpen: (open: boolean) => void;

  // Cart
  cartItems: CartItem[];
  cartCount: number;
  addToCart: (product: Product | any, quantity?: number, variant?: any) => void;
  updateQuantity: (cartItemIdOrProductId: string, delta: number) => void;
  removeFromCart: (cartItemIdOrProductId: string) => void;
  clearCart: () => void;
  subtotal: number;
  freeShippingThreshold: number;
  isFreeShipping: boolean;
  amountUntilFreeShipping: number;
  deliveryFee: number;
  total: number;

  // Gift options
  isGift: boolean;
  setIsGift: (isGift: boolean) => void;
  giftRecipient: string;
  setGiftRecipient: (name: string) => void;
  giftMessage: string;
  setGiftMessage: (msg: string) => void;

  // Wishlist
  wishlist: string[];
  wishlistCount: number;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Filters
  filters: FilterState;
  setFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  toggleArrayFilter: <K extends 'age' | 'category' | 'interest' | 'benefit' | 'material' | 'occasion'>(
    key: K,
    value: FilterState[K][number]
  ) => void;
  resetFilters: () => void;

  // Checkout & COD Order
  deliveryDetails: DeliveryDetails;
  updateDeliveryDetails: (details: Partial<DeliveryDetails>) => void;
  activeOrder: Order | null;
  placeCodOrder: () => Promise<Order>;
  
  // Products Live State
  products: Product[];
  productsLoading: boolean;
  refreshProducts: () => Promise<void>;

  // Toast
  toast: StoreToast | null;
  toastMessage: string | null;
  showToast: (
    msg: string,
    type?: 'success' | 'error' | 'warning' | 'info' | 'delete',
    options?: { title?: string; image?: string; action?: { label: string; onClick: () => void } }
  ) => void;
  hideToast: () => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Parse initial view and product from URL pathname
  const getInitialRouteState = () => {
    if (typeof window === 'undefined') return { initialView: 'home' as AppView, initialProduct: 'busy-cube-montessori' };
    const pathname = window.location.pathname;
    if (pathname.startsWith('/product/')) {
      return { initialView: 'product' as AppView, initialProduct: pathname.replace('/product/', '') };
    }
    if (pathname.startsWith('/p/')) {
      return { initialView: 'product' as AppView, initialProduct: pathname.replace('/p/', '') };
    }
    if (pathname === '/shop' || pathname === '/products') return { initialView: 'shop' as AppView, initialProduct: 'busy-cube-montessori' };
    if (pathname === '/cart') return { initialView: 'cart' as AppView, initialProduct: 'busy-cube-montessori' };
    if (pathname === '/checkout') return { initialView: 'checkout' as AppView, initialProduct: 'busy-cube-montessori' };
    if (pathname === '/wishlist') return { initialView: 'wishlist' as AppView, initialProduct: 'busy-cube-montessori' };
    if (pathname === '/our-story' || pathname === '/about') return { initialView: 'our-story' as AppView, initialProduct: 'busy-cube-montessori' };
    return { initialView: 'home' as AppView, initialProduct: 'busy-cube-montessori' };
  };

  const initialRoute = getInitialRouteState();
  const [view, setViewInternal] = useState<AppView>(initialRoute.initialView);
  const [selectedProductId, setSelectedProductId] = useState<string>(initialRoute.initialProduct);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  // Cart state persisted to localStorage (starts empty until user adds items)
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('growkins_cart_bd') || localStorage.getItem('littlekin_cart_bd');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Clean out legacy mock starter items if present
        const isLegacyStarter = Array.isArray(parsed) &&
          parsed.length === 2 &&
          parsed.some(item => item?.product?.id === 'woodland-balance-friends') &&
          parsed.some(item => item?.product?.id === 'sunrise-stacking-arch');
        if (!isLegacyStarter && Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch {
      // fallback
    }
    return [];
  });

  const [isGift, setIsGift] = useState(false);
  const [giftRecipient, setGiftRecipient] = useState('');
  const [giftMessage, setGiftMessage] = useState('');

  // Wishlist state persisted to localStorage (starts empty until user hearts items)
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('growkins_wishlist_bd') || localStorage.getItem('littlekin_wishlist_bd');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Clean out legacy mock starter item if present
        const isLegacyStarter = Array.isArray(parsed) &&
          parsed.length === 1 &&
          parsed[0] === 'little-architect-blocks';
        if (!isLegacyStarter && Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch {
      // fallback
    }
    return [];
  });

  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Live Products State fetched from Google Sheets Backend (with static fallback)
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [productsLoading, setProductsLoading] = useState<boolean>(false);

  const loadProducts = async () => {
    try {
      setProductsLoading(true);
      const res = await productService.list({ limit: 100 });
      if (res && res.data && res.data.length > 0) {
        const mapped: Product[] = res.data.map((p: any) => ({
          ...p,
          images: {
            main: Array.isArray(p.images) ? (p.images[0]?.url || p.featuredImage || '') : (p.images?.main || ''),
            secondary: Array.isArray(p.images) ? (p.images[1]?.url || p.images[0]?.url || '') : (p.images?.secondary || ''),
            gallery: Array.isArray(p.images) ? p.images.map((img: any) => img.url) : (p.images?.gallery || [])
          },
          inStock: p.status === 'active' && ((p.inventory?.quantity ?? 1) > 0)
        }));
        setProducts(mapped);
      }
    } catch (err) {
      console.warn('Failed to load products from live backend, keeping fallback:', err);
    } finally {
      setProductsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const refreshProducts = async () => {
    await loadProducts();
  };

  // Bangladesh localized delivery details
  const [deliveryDetails, setDeliveryDetails] = useState<DeliveryDetails>(() => {
    try {
      const saved = localStorage.getItem('growkins_delivery_bd') || localStorage.getItem('littlekin_delivery_bd');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return {
      fullName: '',
      phone: '',
      email: '',
      deliveryZone: 'inside-dhaka',
      district: 'Dhaka',
      thanaArea: 'Dhanmondi',
      streetAddress: '',
      orderNote: '',
      isGift: false,
      giftRecipientName: '',
      giftMessage: ''
    };
  });

  const [activeOrder, setActiveOrder] = useState<Order | null>(() => {
    try {
      const saved = localStorage.getItem('growkins_last_order_bd') || localStorage.getItem('littlekin_last_order_bd');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return null;
  });

  useEffect(() => {
    try {
      localStorage.setItem('growkins_cart_bd', JSON.stringify(cartItems));
      localStorage.removeItem('littlekin_cart_bd');
    } catch (e) {
      console.warn(e);
    }
  }, [cartItems]);

  useEffect(() => {
    try {
      localStorage.setItem('growkins_wishlist_bd', JSON.stringify(wishlist));
      localStorage.removeItem('littlekin_wishlist_bd');
    } catch (e) {
      console.warn(e);
    }
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem('growkins_delivery_bd', JSON.stringify(deliveryDetails));
      localStorage.removeItem('littlekin_delivery_bd');
    } catch (e) {
      console.warn(e);
    }
  }, [deliveryDetails]);

  const [toast, setToast] = useState<StoreToast | null>(null);

  const showToast = (
    msg: string,
    type: 'success' | 'error' | 'warning' | 'info' | 'delete' = 'success',
    options?: { title?: string; image?: string; action?: { label: string; onClick: () => void } }
  ) => {
    const id = `toast-${Date.now()}`;
    setToastMessage(msg);
    setToast({
      id,
      message: msg,
      type,
      title: options?.title,
      image: options?.image,
      action: options?.action
    });
    setTimeout(() => {
      setToast(prev => (prev?.id === id ? null : prev));
      setToastMessage(prev => (prev === msg ? null : prev));
    }, 3600);
  };

  const hideToast = () => {
    setToast(null);
    setToastMessage(null);
  };

  const setView = (newView: AppView) => {
    setViewInternal(newView);
    if (typeof window !== 'undefined') {
      const pathToPush = 
        newView === 'home' ? '/' :
        newView === 'shop' ? '/shop' :
        newView === 'cart' ? '/cart' :
        newView === 'checkout' ? '/checkout' :
        newView === 'wishlist' ? '/wishlist' :
        newView === 'our-story' ? '/our-story' :
        newView === 'product' ? `/product/${selectedProductId}` : '/';
      
      if (window.location.pathname !== pathToPush) {
        window.history.pushState({}, '', pathToPush);
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openProduct = (productId: string) => {
    setSelectedProductId(productId);
    setViewInternal('product');
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', `/product/${productId}`);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Sync state when browser back/forward buttons are pressed
  useEffect(() => {
    const handlePopState = () => {
      const pathname = window.location.pathname;
      if (pathname.startsWith('/product/') || pathname.startsWith('/p/')) {
        const prodId = pathname.replace('/product/', '').replace('/p/', '');
        if (prodId) setSelectedProductId(prodId);
        setViewInternal('product');
      } else if (pathname === '/shop' || pathname === '/products') {
        setViewInternal('shop');
      } else if (pathname === '/cart') {
        setViewInternal('cart');
      } else if (pathname === '/checkout') {
        setViewInternal('checkout');
      } else if (pathname === '/wishlist') {
        setViewInternal('wishlist');
      } else if (pathname === '/our-story' || pathname === '/about') {
        setViewInternal('our-story');
      } else if (pathname === '/' || pathname === '') {
        setViewInternal('home');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const addToCart = (product: Product | any, quantity = 1, variant?: any) => {
    // Normalize images if it's an apparel product with array of images
    let normalizedProduct = product;
    if (Array.isArray(product.images)) {
      const colorImg = variant?.color?.id
        ? product.images.find((img: any) => img.colorId === variant.color.id)?.url
        : null;
      const mainUrl = colorImg || product.images[0]?.url || '';
      normalizedProduct = {
        ...product,
        images: {
          main: mainUrl,
          secondary: product.images[1]?.url || mainUrl,
          gallery: product.images.map((img: any) => img.url)
        }
      };
    }

    const lineId = variant?.sku ? `${product.id}-${variant.sku}` : (product.id || `item-${Date.now()}`);

    setCartItems(prev => {
      const existing = prev.find(item => (item.id || item.product.id) === lineId);
      if (existing) {
        return prev.map(item =>
          (item.id || item.product.id) === lineId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          id: lineId,
          product: normalizedProduct,
          quantity,
          variant: variant ? {
            sku: variant.sku,
            color: variant.color,
            size: variant.size,
            price: variant.price || product.price
          } : undefined
        }
      ];
    });

    const variantLabel = variant?.size?.label ? ` (${variant.size.label})` : '';
    showToast(`"${product.name}${variantLabel}" added to your bag`);
    setCartDrawerOpen(true);
  };

  const updateQuantity = (lineIdOrProductId: string, delta: number) => {
    setCartItems(prev => {
      return prev
        .map(item => {
          const match = item.id === lineIdOrProductId || (!item.id && item.product.id === lineIdOrProductId);
          if (match) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const removeFromCart = (lineIdOrProductId: string) => {
    setCartItems(prev => {
      const hasExactId = prev.some(item => item.id === lineIdOrProductId);
      if (hasExactId) {
        return prev.filter(item => item.id !== lineIdOrProductId);
      }
      return prev.filter(item => item.product.id !== lineIdOrProductId);
    });
    showToast('Item removed from bag');
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + (item.variant?.price || item.product.price) * item.quantity, 0);
  
  // Delivery Fee & Threshold from MockDatabase settings with safe fallback (70/130, 2500)
  let freeShippingThreshold = 2500;
  let baseDeliveryFee = deliveryDetails.deliveryZone === 'inside-dhaka' ? 70 : 130;
  try {
    const ds = MockDatabase.getDeliverySettings();
    if (ds && ds.zones) {
      const zone = ds.zones.find(z => 
        deliveryDetails.deliveryZone === 'inside-dhaka' ? z.id === 'zone_dhaka' : z.id === 'zone_outside'
      );
      if (zone) {
        baseDeliveryFee = zone.fee;
        if (zone.freeDeliveryThreshold !== undefined) {
          freeShippingThreshold = zone.freeDeliveryThreshold;
        }
      }
    }
  } catch {
    // fallback
  }

  const isFreeShipping = subtotal >= freeShippingThreshold;
  const amountUntilFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const deliveryFee = cartItems.length === 0 ? 0 : isFreeShipping ? 0 : baseDeliveryFee;
  const total = subtotal + deliveryFee;

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from saved wishlist');
        return prev.filter(id => id !== productId);
      } else {
        const prod = PRODUCTS.find(p => p.id === productId);
        showToast(`"${prod?.name || 'Item'}" saved to wishlist`);
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlist.includes(productId);
  };

  const setFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const toggleArrayFilter = <K extends 'age' | 'category' | 'interest' | 'benefit' | 'material' | 'occasion'>(
    key: K,
    val: FilterState[K][number]
  ) => {
    setFilters(prev => {
      const currentList = prev[key] as any[];
      const exists = currentList.includes(val);
      const updated = exists ? currentList.filter(item => item !== val) : [...currentList, val];
      return { ...prev, [key]: updated };
    });
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const updateDeliveryDetails = (details: Partial<DeliveryDetails>) => {
    setDeliveryDetails(prev => ({ ...prev, ...details }));
  };

  const placeCodOrder = async (): Promise<Order> => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `LK-BD-${randomSuffix}`;
    
    const newOrder: Order = {
      orderNumber,
      items: [...cartItems],
      delivery: {
        ...deliveryDetails,
        isGift,
        giftRecipientName: isGift ? giftRecipient : undefined,
        giftMessage: isGift ? giftMessage : undefined
      },
      subtotal,
      deliveryFee,
      total,
      createdAt: new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      status: 'Order received',
      paymentMethod: 'Cash on Delivery'
    };

    await new Promise(res => setTimeout(res, 850));

    // Persist order to active service (Google Sheets backend in Live mode, Mock DB in mock mode)
    try {
      const adminOrder: AdminOrder = {
        id: `ord_${Date.now()}`,
        orderNumber,
        customer: {
          name: deliveryDetails.fullName || 'Valued Customer',
          phone: deliveryDetails.phone || '',
          email: deliveryDetails.email || undefined,
          isGuest: true
        },
        deliveryAddress: {
          fullName: deliveryDetails.fullName || 'Valued Customer',
          phone: deliveryDetails.phone || '',
          deliveryZone: deliveryDetails.deliveryZone,
          district: deliveryDetails.district || 'Dhaka',
          thanaArea: deliveryDetails.thanaArea || '',
          streetAddress: deliveryDetails.streetAddress || ''
        },
        items: cartItems.map(item => ({
          productId: item.product.id,
          name: item.product.name,
          sku: item.variant?.sku || `GK-${item.product.id.substring(0, 5).toUpperCase()}`,
          price: item.variant?.price || item.product.price,
          quantity: item.quantity,
          image: item.product.images?.main || (Array.isArray(item.product.images) ? item.product.images[0]?.url : '') || '',
          total: (item.variant?.price || item.product.price) * item.quantity,
          variant: item.variant ? {
            color: item.variant.color?.name,
            size: item.variant.size?.label,
            sku: item.variant.sku
          } : undefined
        })),
        subtotal,
        deliveryFee,
        total,
        currency: 'BDT',
        paymentMethod: 'Cash on Delivery',
        paymentStatus: 'cod_pending',
        status: 'pending',
        notes: deliveryDetails.orderNote || '',
        gift: isGift ? {
          enabled: true,
          recipientName: giftRecipient,
          message: giftMessage
        } : undefined,
        timeline: [
          {
            id: `tml_${Date.now()}`,
            status: 'pending',
            title: 'Order Placed (Storefront)',
            description: 'Customer placed Cash on Delivery order via online checkout',
            timestamp: new Date().toISOString(),
            actor: 'Customer'
          }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await orderService.create(adminOrder);
    } catch (e) {
      console.warn('Order sync warning:', e);
    }

    setActiveOrder(newOrder);
    localStorage.setItem('growkins_last_order_bd', JSON.stringify(newOrder));
    
    setCartItems([]);
    setCartDrawerOpen(false);
    setView('confirmation');

    return newOrder;
  };

  return (
    <StoreContext.Provider
      value={{
        view,
        setView,
        selectedProductId,
        openProduct,
        cartDrawerOpen,
        setCartDrawerOpen,
        searchModalOpen,
        setSearchModalOpen,
        cartItems,
        cartCount,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        subtotal,
        freeShippingThreshold,
        isFreeShipping,
        amountUntilFreeShipping,
        deliveryFee,
        total,
        isGift,
        setIsGift,
        giftRecipient,
        setGiftRecipient,
        giftMessage,
        setGiftMessage,
        wishlist,
        wishlistCount: wishlist.length,
        toggleWishlist,
        isInWishlist,
        filters,
        setFilter,
        toggleArrayFilter,
        resetFilters,
        deliveryDetails,
        updateDeliveryDetails,
        activeOrder,
        placeCodOrder,
        products,
        productsLoading,
        refreshProducts,
        toast,
        toastMessage,
        showToast,
        hideToast
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
