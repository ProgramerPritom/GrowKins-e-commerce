import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Product, CartItem, DeliveryDetails, Order, AgeRange, Category, Interest, DevelopmentalBenefit, Material, Occasion } from '../types';
import { PRODUCTS } from '../data/products';
import { MockDatabase } from '../lib/mockDb/MockDatabase';
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
  addToCart: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: string, delta: number) => void;
  removeFromCart: (productId: string) => void;
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
  
  // Toast
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [view, setViewInternal] = useState<AppView>('home');
  const [selectedProductId, setSelectedProductId] = useState<string>('woodland-balance-friends');
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

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => (prev === msg ? null : prev));
    }, 2800);
  };

  const setView = (newView: AppView) => {
    setViewInternal(newView);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openProduct = (productId: string) => {
    setSelectedProductId(productId);
    setView('product');
  };

  const addToCart = (product: Product, quantity = 1) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    showToast(`"${product.name}" added to your bag`);
    setCartDrawerOpen(true);
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCartItems(prev => {
      return prev
        .map(item => {
          if (item.product.id === productId) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
    showToast('Item removed from bag');
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  
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

    // Also persist into Admin MockDatabase for real-time admin sync
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
          sku: `GK-${item.product.id.substring(0, 5).toUpperCase()}`,
          price: item.product.price,
          quantity: item.quantity,
          image: item.product.images.main || '',
          total: item.product.price * item.quantity
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

      const existingOrders = MockDatabase.getOrders();
      MockDatabase.setOrders([adminOrder, ...existingOrders]);
    } catch (e) {
      console.warn('Failed to mirror storefront order into Admin MockDatabase', e);
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
        toastMessage,
        showToast
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
