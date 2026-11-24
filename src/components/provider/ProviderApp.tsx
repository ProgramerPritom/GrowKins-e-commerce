import React, { useState, useEffect, useMemo } from 'react';
import {
  Package, Truck, CheckCircle2, Clock, Search, RefreshCw,
  Lock, LogOut, Phone, MapPin, Calendar,
  ChevronRight, Copy, Check, Filter, Plus, Edit, Trash2,
  Image as ImageIcon, Video, ExternalLink, Menu, X, ArrowLeft,
  ShoppingBag, ChevronLeft, Save, Sparkles, Users, LayoutGrid, List, FileText, Heart, MessageSquare
} from 'lucide-react';
import { orderService, productService } from '../../services';
import { apiClient } from '../../lib/api/client';
import type { AdminOrder, OrderStatus } from '../../types/admin';
import { MediaPicker } from '../admin/common/MediaPicker';
import { PRODUCTS } from '../../data/products';
import { BENGALI_TOY_MAP } from '../toy-world/bengaliToyData';
import { InvoiceModal } from './InvoiceModal';
import { EditOrderModal } from './EditOrderModal';

type ProviderTab = 'orders' | 'products' | 'customers' | 'new-product' | 'media' | 'delivery';

export const ProviderApp: React.FC = () => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('gk_provider_auth') === 'true';
  });
  const [passcode, setPasscode] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');

  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState<ProviderTab>('orders');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  // Orders State
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState<boolean>(false);
  const [orderSearchQuery, setOrderSearchQuery] = useState<string>('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [orderPage, setOrderPage] = useState<number>(1);
  const [ordersPerPage] = useState<number>(10);
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  // Order CRUD & Invoice Modals
  const [invoiceOrder, setInvoiceOrder] = useState<AdminOrder | null>(null);
  const [editingOrder, setEditingOrder] = useState<AdminOrder | null>(null);

  // Customer CRM State
  const [customerSearchQuery, setCustomerSearchQuery] = useState<string>('');
  const [crmMeta, setCrmMeta] = useState<Record<string, { facebookUrl: string; notes: string }>>(() => {
    try {
      const saved = localStorage.getItem('gk_crm_customer_meta');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse saved CRM meta', e);
    }
    return {};
  });
  const [editingCrmCustomer, setEditingCrmCustomer] = useState<{
    phone: string;
    name: string;
    facebookUrl: string;
    notes: string;
  } | null>(null);

  // Products State
  const [products, setProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState<boolean>(false);
  const [productSearchQuery, setProductSearchQuery] = useState<string>('');
  const [productViewMode, setProductViewMode] = useState<'grid' | 'list'>('grid');
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  // Active Landing Products Selection State (Controls what shows on /growkins-toy-world)
  const [activeLandingProductIds, setActiveLandingProductIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('gk_active_toy_world_ids');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse saved active toy ids', e);
    }
    return [];
  });
  const [productVisibilityFilter, setProductVisibilityFilter] = useState<'all' | 'landing_active' | 'landing_inactive'>('all');

  // Load Server-Synced Active Landing Product IDs from Google Sheets Database
  useEffect(() => {
    let isMounted = true;
    async function loadServerLandingIds() {
      try {
        const res = await apiClient.get<any>('/settings/landing_products');
        if (isMounted && res?.data?.activeIds && Array.isArray(res.data.activeIds)) {
          setActiveLandingProductIds(res.data.activeIds);
          localStorage.setItem('gk_active_toy_world_ids', JSON.stringify(res.data.activeIds));
        }
      } catch (err) {
        console.warn('Could not fetch server landing products, using local cache:', err);
      }
    }
    loadServerLandingIds();
    return () => { isMounted = false; };
  }, []);

  // Sync active landing IDs with both local storage and Google Sheets backend
  const syncActiveLandingIds = async (newIds: string[]) => {
    setActiveLandingProductIds(newIds);
    localStorage.setItem('gk_active_toy_world_ids', JSON.stringify(newIds));
    try {
      await apiClient.patch('/settings/landing_products', { activeIds: newIds });
    } catch (err) {
      console.warn('Failed to persist landing products to server:', err);
    }
  };

  // Product Form State
  const [formName, setFormName] = useState<string>('');
  const [formSubtitle, setFormSubtitle] = useState<string>('');
  const [formPrice, setFormPrice] = useState<string>('');
  const [formOriginalPrice, setFormOriginalPrice] = useState<string>('');
  const [formAgeBadge, setFormAgeBadge] = useState<string>('১–৩ বছর');
  const [formImage, setFormImage] = useState<string>('');
  const [formVideoUrl, setFormVideoUrl] = useState<string>('');
  const [formFeatures, setFormFeatures] = useState<string[]>([
    'হাতের সূক্ষ্ম মোটর স্কিল ও একাগ্রতা বৃদ্ধি করে',
    '১০০% মসৃণ, নন-টক্সিক ও নিরাপদ কাঠের উপাদান',
    'শিশুর মোবাইল ও স্ক্রিন-টাইমের আসক্তি দূর করে'
  ]);
  const [formDescription, setFormDescription] = useState<string>('');
  const [formStatus, setFormStatus] = useState<'active' | 'draft'>('active');
  const [isSavingProduct, setIsSavingProduct] = useState<boolean>(false);

  // Media Picker Modal State (Google Drive)
  const [mediaPickerOpen, setMediaPickerOpen] = useState<boolean>(false);

  // Delivery Settings State
  const [insideDhakaFee, setInsideDhakaFee] = useState<number>(70);
  const [outsideDhakaFee, setOutsideDhakaFee] = useState<number>(130);

  // Quick Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'GrowKins — Provider Dashboard & Order Fulfillment';
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Load Orders
  const loadOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await orderService.list({ limit: 100 });
      if (res && Array.isArray(res.data)) {
        setOrders(res.data);
      }
    } catch (err) {
      console.error('Failed to load orders for provider portal:', err);
    } finally {
      setLoadingOrders(false);
    }
  };

  // Load Products (Toy World specific catalog)
  const loadProducts = async () => {
    setLoadingProducts(true);
    try {
      const res = await productService.list({ limit: 100 });
      let list: any[] = (res && Array.isArray(res.data) && res.data.length > 0) ? res.data : PRODUCTS;
      // Strictly filter out clothing/apparel to keep only toys for toy world
      list = list.filter((p: any) => p.category !== 'Clothing' && p.category !== 'clothing');
      setProducts(list);
    } catch (err) {
      console.warn('Fallback to local products for provider:', err);
      setProducts(PRODUCTS.filter((p: any) => p.category !== 'Clothing' && p.category !== 'clothing'));
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadOrders();
      loadProducts();
    }
  }, [isAuthenticated]);

  // Handle Passcode Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.trim() === 'growkins2026' || passcode.trim() === 'provider123') {
      setIsAuthenticated(true);
      localStorage.setItem('gk_provider_auth', 'true');
      setAuthError('');
    } else {
      setAuthError('ভুল পাসকোড! সঠিক প্রোভাইডার পাসকোড দিন।');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('gk_provider_auth');
  };

  // Status Change
  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingOrderId(orderId);
    try {
      await orderService.updateStatus(orderId, {
        status: newStatus,
        note: `Status updated by Provider to ${newStatus}`
      });
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
      }
      showToast(`অর্ডার স্ট্যাটাস সফলভাবে '${newStatus}'-এ পরিবর্তিত হয়েছে`);
    } catch (err) {
      console.error('Failed to update order status:', err);
      showToast('স্ট্যাটাস আপডেট করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // Delete Order
  const handleDeleteOrder = async (orderId: string) => {
    if (!window.confirm('আপনি কি নিশ্চিত যে এই অর্ডারটি মুছে ফেলতে চান?')) return;
    try {
      await orderService.delete(orderId);
      setOrders(prev => prev.filter(o => o.id !== orderId));
      if (selectedOrder?.id === orderId) setSelectedOrder(null);
      showToast('অর্ডারটি সফলভাবে মুছে ফেলা হয়েছে');
    } catch (err) {
      console.error('Failed to delete order:', err);
      showToast('অর্ডার মুছতে সমস্যা হয়েছে');
    }
  };

  // Update Order
  const handleUpdateOrder = async (orderId: string, updatedPayload: Partial<AdminOrder>) => {
    try {
      await orderService.update(orderId, updatedPayload);
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, ...updatedPayload } : o));
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(prev => prev ? { ...prev, ...updatedPayload } : null);
      }
      showToast('অর্ডারের তথ্য সফলভাবে আপডেট করা হয়েছে');
      setEditingOrder(null);
    } catch (err) {
      console.error('Failed to update order:', err);
      showToast('অর্ডার আপডেট করতে সমস্যা হয়েছে');
    }
  };

  // Save CRM Customer Details (Facebook, Notes)
  const handleSaveCrmCustomer = (phone: string, meta: { facebookUrl: string; notes: string }) => {
    const updated = { ...crmMeta, [phone]: meta };
    setCrmMeta(updated);
    localStorage.setItem('gk_crm_customer_meta', JSON.stringify(updated));
    setEditingCrmCustomer(null);
    showToast('কাস্টমার তথ্য ও নোট সফলভাবে সংরক্ষিত হয়েছে');
  };

  const handleCopyPhone = (phone: string) => {
    navigator.clipboard.writeText(phone);
    setCopiedPhone(phone);
    showToast(`ফোন নম্বর কপি হয়েছে: ${phone}`);
    setTimeout(() => setCopiedPhone(null), 2500);
  };

  // Open Edit Form for an existing product
  const handleOpenEditProduct = (prod: any) => {
    setEditingProductId(prod.id);
    const customB = BENGALI_TOY_MAP[prod.id];
    setFormName(customB?.bName || prod.name || '');
    setFormSubtitle(customB?.bSubtitle || prod.subtitle || '');
    setFormPrice(String(prod.price || ''));
    setFormOriginalPrice(String(prod.originalPrice || prod.compareAtPrice || ''));
    setFormAgeBadge(customB?.ageBadge || prod.ageBadge || '১–৩ বছর');
    setFormImage(prod.featuredImage || prod.images?.main || (Array.isArray(prod.images) ? prod.images[0]?.url : ''));
    setFormVideoUrl(prod.videoUrl || '');
    setFormFeatures(customB?.features || [
      'হাতের সূক্ষ্ম মোটর স্কিল ও একাগ্রতা বৃদ্ধি করে',
      '১০০% মসৃণ, নন-টক্সিক ও নিরাপদ কাঠের উপাদান',
      'শিশুর মোবাইল ও স্ক্রিন-টাইমের আসক্তি দূর করে'
    ]);
    setFormDescription(customB?.description || prod.description || '');
    setFormStatus(prod.status === 'draft' ? 'draft' : 'active');
    setActiveTab('new-product');
  };

  // Reset Product Form
  const handleResetProductForm = () => {
    setEditingProductId(null);
    setFormName('');
    setFormSubtitle('');
    setFormPrice('');
    setFormOriginalPrice('');
    setFormAgeBadge('১–৩ বছর');
    setFormImage('');
    setFormVideoUrl('');
    setFormFeatures([
      'হাতের সূক্ষ্ম মোটর স্কিল ও একাগ্রতা বৃদ্ধি করে',
      '১০০% মসৃণ, নন-টক্সিক ও নিরাপদ কাঠের উপাদান',
      'শিশুর মোবাইল ও স্ক্রিন-টাইমের আসক্তি দূর করে'
    ]);
    setFormDescription('');
    setFormStatus('active');
  };

  // Save Product (Create or Update)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formPrice) {
      showToast('অনুগ্রহ করে পণ্যের নাম ও বিক্রয় মূল্য দিন');
      return;
    }

    setIsSavingProduct(true);
    try {
      const priceNum = Number(formPrice) || 0;
      const originalPriceNum = Number(formOriginalPrice) || Math.round(priceNum * 1.35);

      const payload: any = {
        name: formName.trim(),
        subtitle: formSubtitle.trim() || 'বাচ্চাদের মানসিক ও শারীরিক বিকাশের নিরাপদ খেলনা',
        price: priceNum,
        originalPrice: originalPriceNum,
        currency: 'BDT',
        status: formStatus,
        ageBadge: formAgeBadge.trim(),
        featuredImage: formImage.trim() || '/items/busy-cube.jfif',
        videoUrl: formVideoUrl.trim(),
        benefits: formFeatures.filter(f => f.trim().length > 0),
        description: formDescription.trim() || `${formName} হলো শিশুদের জন্য একটি আকর্ষণীয় ও শিক্ষণীয় খেলনা।`,
        images: formImage ? [{ id: 'img_1', url: formImage, alt: formName, type: 'primary', sortOrder: 1 }] : [],
        category: 'Wooden Toys',
        inStock: true
      };

      if (editingProductId) {
        await productService.update(editingProductId, payload);
        showToast('খেলনা পণ্যটি সফলভাবে আপডেট হয়েছে!');
      } else {
        const created = await productService.create(payload);
        const newId = (created as any)?.data?.id;
        if (newId && formStatus === 'active') {
          const updated = [...activeLandingProductIds, newId];
          await syncActiveLandingIds(updated);
        }
        showToast('নতুন খেলনা সফলভাবে যুক্ত হয়েছে এবং ল্যান্ডিং পেজে দৃশ্যমান হবে!');
      }

      await loadProducts();
      handleResetProductForm();
      setActiveTab('products');
    } catch (err) {
      console.error('Failed to save product:', err);
      showToast('পণ্য সংরক্ষণ করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setIsSavingProduct(false);
    }
  };

  // Delete Product
  const handleDeleteProduct = async (pId: string) => {
    if (!window.confirm('আপনি কি নিশ্চিত যে এই খেলনাটি মুছে ফেলতে চান?')) return;
    try {
      await productService.delete(pId);
      setProducts(prev => prev.filter(p => p.id !== pId));
      showToast('খেলনা পণ্যটি মুছে ফেলা হয়েছে');
    } catch (err) {
      console.error('Failed to delete product:', err);
      showToast('পণ্য মুছতে সমস্যা হয়েছে');
    }
  };

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const q = orderSearchQuery.toLowerCase().trim();
      const matchesSearch = !q ||
        o.orderNumber?.toLowerCase().includes(q) ||
        o.customer?.name?.toLowerCase().includes(q) ||
        o.customer?.phone?.includes(q) ||
        o.deliveryAddress?.phone?.includes(q) ||
        o.deliveryAddress?.streetAddress?.toLowerCase().includes(q) ||
        o.deliveryAddress?.district?.toLowerCase().includes(q);

      const matchesStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, orderSearchQuery, orderStatusFilter]);

  // Paginated Orders
  const totalOrderPages = Math.ceil(filteredOrders.length / ordersPerPage) || 1;
  const paginatedOrders = useMemo(() => {
    const start = (orderPage - 1) * ordersPerPage;
    return filteredOrders.slice(start, start + ordersPerPage);
  }, [filteredOrders, orderPage, ordersPerPage]);

  // Filtered Products with Visibility Filter
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const q = productSearchQuery.toLowerCase().trim();
      const matchesSearch = !q ||
        p.name?.toLowerCase().includes(q) ||
        p.subtitle?.toLowerCase().includes(q);

      const isLandingActive = activeLandingProductIds.includes(p.id);
      const matchesVisibility = productVisibilityFilter === 'all' ||
        (productVisibilityFilter === 'landing_active' && isLandingActive) ||
        (productVisibilityFilter === 'landing_inactive' && !isLandingActive);

      return matchesSearch && matchesVisibility;
    });
  }, [products, productSearchQuery, activeLandingProductIds, productVisibilityFilter]);

  // Toggle individual product landing page visibility
  const handleToggleLandingProduct = async (productId: string) => {
    const exists = activeLandingProductIds.includes(productId);
    const updated = exists
      ? activeLandingProductIds.filter(id => id !== productId)
      : [...activeLandingProductIds, productId];
    await syncActiveLandingIds(updated);
    showToast(exists
      ? 'পণ্যটি ল্যান্ডিং পেজ থেকে নিষ্ক্রিয় করা হয়েছে'
      : 'পণ্যটি ল্যান্ডিং পেজে সফলভাবে সক্রিয় করা হয়েছে!');
  };

  // Bulk actions for storefront visibility
  const handleSelectAllProducts = async () => {
    const allIds = products.map(p => p.id);
    await syncActiveLandingIds(allIds);
    showToast(`সবগুলো (${allIds.length}টি) পণ্য ল্যান্ডিং পেজে সক্রিয় করা হয়েছে!`);
  };

  const handleDeselectAllProducts = async () => {
    await syncActiveLandingIds([]);
    showToast('সকল পণ্য ল্যান্ডিং পেজ থেকে নিষ্ক্রিয় করা হয়েছে');
  };

  const handleSelectTop20 = async () => {
    const top20 = products.slice(0, 20).map(p => p.id);
    await syncActiveLandingIds(top20);
    showToast('প্রথম ২০টি মূল খেলনা ল্যান্ডিং পেজে সক্রিয় করা হয়েছে!');
  };

  const handleSelectTop10 = async () => {
    const top10 = products.slice(0, 10).map(p => p.id);
    await syncActiveLandingIds(top10);
    showToast('প্রথম ১০টি খেলনা ল্যান্ডিং পেজে সক্রিয় করা হয়েছে!');
  };

  // Customer CRM aggregation from orders
  const customersList = useMemo(() => {
    const map = new Map<string, {
      phone: string;
      name: string;
      streetAddress: string;
      district: string;
      orders: AdminOrder[];
      totalSpent: number;
      itemsBought: { id?: string; name: string; quantity: number; price: number; image?: string }[];
      facebookUrl: string;
      notes: string;
      lastOrderDate: string;
    }>();

    orders.forEach(order => {
      const phone = (order.customer?.phone || order.deliveryAddress?.phone || '').trim();
      if (!phone) return;
      const name = order.customer?.name || order.deliveryAddress?.fullName || 'সম্মানিত অভিভাবক';
      const streetAddress = order.deliveryAddress?.streetAddress || '';
      const district = order.deliveryAddress?.district || 'ঢাকা';
      const orderTotal = Number(order.total) || 0;
      const orderDate = order.createdAt || '';

      if (!map.has(phone)) {
        const meta = crmMeta[phone] || { facebookUrl: '', notes: '' };
        map.set(phone, {
          phone,
          name,
          streetAddress,
          district,
          orders: [order],
          totalSpent: orderTotal,
          itemsBought: [],
          facebookUrl: meta.facebookUrl || '',
          notes: meta.notes || order.notes || '',
          lastOrderDate: orderDate
        });
      } else {
        const existing = map.get(phone)!;
        existing.orders.push(order);
        existing.totalSpent += orderTotal;
        if (orderDate && (!existing.lastOrderDate || new Date(orderDate) > new Date(existing.lastOrderDate))) {
          existing.lastOrderDate = orderDate;
        }
      }

      // Collect items bought
      const existing = map.get(phone)!;
      if (Array.isArray(order.items)) {
        order.items.forEach((it, idx) => {
          const found = existing.itemsBought.find(b => b.name === it.name);
          if (found) {
            found.quantity += (Number(it.quantity) || 1);
          } else {
            existing.itemsBought.push({
              id: (it as any).id || (it as any).productId || String(idx),
              name: it.name,
              quantity: Number(it.quantity) || 1,
              price: Number(it.price) || 0,
              image: it.image
            });
          }
        });
      }
    });

    return Array.from(map.values()).sort((a, b) => {
      const dateA = a.lastOrderDate ? new Date(a.lastOrderDate).getTime() : 0;
      const dateB = b.lastOrderDate ? new Date(b.lastOrderDate).getTime() : 0;
      return dateB - dateA;
    });
  }, [orders, crmMeta]);

  // Filtered customers for CRM search
  const filteredCustomers = useMemo(() => {
    const q = customerSearchQuery.toLowerCase().trim();
    if (!q) return customersList;
    return customersList.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      c.district.toLowerCase().includes(q) ||
      c.facebookUrl.toLowerCase().includes(q) ||
      c.notes.toLowerCase().includes(q) ||
      c.itemsBought.some(it => it.name.toLowerCase().includes(q))
    );
  }, [customersList, customerSearchQuery]);

  // Stats
  const stats = useMemo(() => {
    const total = orders.length;
    const pending = orders.filter(o => o.status === 'pending').length;
    const processing = orders.filter(o => o.status === 'processing' || o.status === 'confirmed').length;
    const delivered = orders.filter(o => o.status === 'delivered').length;
    const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
    return { total, pending, processing, delivered, totalRevenue };
  }, [orders]);

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">অপেক্ষমান</span>;
      case 'confirmed':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800">নিশ্চিত</span>;
      case 'processing':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-indigo-100 text-indigo-800">প্যাকেজিং</span>;
      case 'shipped':
      case 'out_for_delivery':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-100 text-purple-800">ডেলিভারিতে</span>;
      case 'delivered':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">সম্পন্ন</span>;
      case 'cancelled':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800">বাতিল</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  // If not authenticated, render secure passcode entry screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FAF7F1] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl border border-[#E8E0D2]">
          <div className="w-14 h-14 rounded-2xl bg-[#E76F51]/10 text-[#E76F51] flex items-center justify-center mx-auto mb-4">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black text-[#24221F] text-center mb-1">
            প্রোভাইডার পোর্টাল লগইন
          </h2>
          <p className="text-xs text-gray-500 text-center mb-6">
            অর্ডার ফুলফিলমেন্ট ও খেলনা প্রোডাক্ট ম্যানেজ করতে প্রোভাইডার অ্যাক্সেস কোড দিন
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                অ্যাক্সেস কোড (Passcode)
              </label>
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="growkins2026"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#E76F51] focus:ring-2 focus:ring-[#E76F51]/20 outline-none text-sm transition-all"
                required
              />
              {authError && (
                <p className="text-xs font-bold text-rose-600 mt-2">
                  {authError}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#24221F] hover:bg-[#383530] text-white font-bold text-sm shadow-md transition-colors cursor-pointer"
            >
              প্রবেশ করুন
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-gray-100 text-center">
            <p className="text-[11px] text-gray-400">
              GrowKins Bangladesh • Provider Order & Product Control
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#24221F] flex flex-col lg:flex-row font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#24221F] text-white px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-bold animate-in fade-in slide-in-from-top-2 border border-white/10">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Media Picker Modal (Google Drive) */}
      <MediaPicker
        isOpen={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        onSelect={(asset) => {
          setFormImage(asset.url);
          setMediaPickerOpen(false);
          showToast('গুগল ড্রাইভ থেকে ছবি নির্বাচন করা হয়েছে!');
        }}
        title="গুগল ড্রাইভ থেকে প্রোডাক্ট ছবি নির্বাচন করুন"
      />

      {/* Mobile Top Header */}
      <div className="lg:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-xl text-gray-700 hover:bg-gray-100"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-extrabold text-base text-[#24221F]">
            GrowKins Provider
          </span>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="/growkins-toy-world"
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1.5 rounded-xl bg-[#E76F51]/10 text-[#E76F51] text-xs font-bold flex items-center gap-1"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>স্টোরফ্রন্ট</span>
          </a>
        </div>
      </div>

      {/* Left Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-[#24221F] text-[#FAF7F1] flex flex-col justify-between transition-transform duration-300 ease-in-out
        lg:static lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
      `}>
        {/* Brand & Menu */}
        <div className="p-5 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#E76F51] to-[#F4A261] text-white flex items-center justify-center font-black text-xl shadow-md">
                G
              </div>
              <div>
                <h2 className="font-black text-base tracking-tight leading-none text-white">
                  GrowKins
                </h2>
                <span className="text-[10px] font-bold text-[#F4A261] uppercase tracking-wider">
                  প্রোভাইডার পোর্টাল
                </span>
              </div>
            </div>

            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-xl text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5 pt-4">
            <button
              onClick={() => { setActiveTab('orders'); setSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'orders'
                ? 'bg-[#E76F51] text-white shadow-md'
                : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
            >
              <div className="flex items-center gap-3">
                <Package className="w-4 h-4" />
                <span>অর্ডারসমূহ</span>
              </div>
              {stats.pending > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-gray-900">
                  {stats.pending}
                </span>
              )}
            </button>

            <button
              onClick={() => { setActiveTab('customers'); setSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'customers'
                ? 'bg-[#E76F51] text-white shadow-md'
                : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
            >
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4" />
                <span>কাস্টমার লিস্ট (CRM)</span>
              </div>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-white/10 text-emerald-300">
                {customersList.length} জন
              </span>
            </button>

            <button
              onClick={() => { setActiveTab('products'); setSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'products'
                ? 'bg-[#E76F51] text-white shadow-md'
                : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
            >
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-4 h-4" />
                <span>টয় প্রোডাক্টস</span>
              </div>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-white/10 text-[#F4A261]">
                {activeLandingProductIds.length}/{products.length} সক্রিয়
              </span>
            </button>

            <button
              onClick={() => { handleResetProductForm(); setActiveTab('new-product'); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'new-product'
                ? 'bg-[#E76F51] text-white shadow-md'
                : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
            >
              <Plus className="w-4 h-4" />
              <span>নতুন খেলনা যোগ করুন</span>
            </button>

            <button
              onClick={() => { setMediaPickerOpen(true); setSidebarOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold text-gray-300 hover:bg-white/10 hover:text-white transition-all cursor-pointer"
            >
              <ImageIcon className="w-4 h-4" />
              <span>গুগল ড্রাইভ মিডিয়া</span>
            </button>

            <button
              onClick={() => { setActiveTab('delivery'); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'delivery'
                ? 'bg-[#E76F51] text-white shadow-md'
                : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
            >
              <Truck className="w-4 h-4" />
              <span>ডেলিভারি সেটিংস</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-5 border-t border-white/10 space-y-3">
          <a
            href="/growkins-toy-world"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-gray-300 hover:text-white transition-colors"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#F4A261]" />
              <span>টয় ওয়ার্ল্ড দেখুন</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
          </a>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3.5 py-2 rounded-xl text-rose-400 hover:bg-rose-500/10 text-xs font-bold transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>লগআউট</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Bar for Desktop */}
        <header className="hidden lg:flex items-center justify-between h-16 bg-white border-b border-gray-200 px-8 sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="font-black text-base text-gray-900">
              {activeTab === 'orders' && '📦 অর্ডার ম্যানেজমেন্ট ও ডেলিভারি লোকেশন'}
              {activeTab === 'customers' && '👥 কাস্টমার লিস্ট ও অর্ডার ইতিহাস (CRM)'}
              {activeTab === 'products' && '🧸 টয় ওয়ার্ল্ড প্রোডাক্ট ক্যাটালগ'}
              {activeTab === 'new-product' && (editingProductId ? '✏️ খেলনা সম্পাদনা' : '➕ নতুন খেলনা প্রোডাক্ট তৈরি')}
              {activeTab === 'delivery' && '⚙️ ডেলিভারি চার্জ সেটিংস'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => { loadOrders(); loadProducts(); }}
              className="p-2 rounded-xl text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors cursor-pointer"
              title="তথ্য রিফ্রেশ করুন"
            >
              <RefreshCw className={`w-4 h-4 ${loadingOrders || loadingProducts ? 'animate-spin text-[#E76F51]' : ''}`} />
            </button>
            <a
              href="/growkins-toy-world"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#E76F51]/10 text-[#E76F51] text-xs font-bold hover:bg-[#E76F51]/20 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>লাইভ টয় ওয়ার্ল্ড</span>
            </a>
          </div>
        </header>

        {/* Tab 1: Orders Tab with Visible Pagination */}
        {activeTab === 'orders' && (
          <div className="p-4 sm:p-8 space-y-6">
            {/* Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">মোট অর্ডার</p>
                  <p className="text-xl font-black text-gray-800 mt-0.5">{stats.total}</p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">অপেক্ষমান</p>
                  <p className="text-xl font-black text-amber-600 mt-0.5">{stats.pending}</p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">প্রসেসিং</p>
                  <p className="text-xl font-black text-purple-600 mt-0.5">{stats.processing}</p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">ডেলিভার্ড</p>
                  <p className="text-xl font-black text-emerald-600 mt-0.5">{stats.delivered}</p>
                </div>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {/* Status Filter Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                <Filter className="w-4 h-4 text-gray-400 shrink-0 ml-1 mr-1" />
                {[
                  { id: 'all', label: 'সব অর্ডার' },
                  { id: 'pending', label: 'অপেক্ষমান' },
                  { id: 'confirmed', label: 'নিশ্চিত' },
                  { id: 'processing', label: 'প্যাকেজিং' },
                  { id: 'delivered', label: 'সম্পন্ন' },
                  { id: 'cancelled', label: 'বাতিল' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => { setOrderStatusFilter(tab.id); setOrderPage(1); }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${orderStatusFilter === tab.id
                      ? 'bg-[#E76F51] text-white shadow-xs'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Search Box */}
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={orderSearchQuery}
                  onChange={(e) => { setOrderSearchQuery(e.target.value); setOrderPage(1); }}
                  placeholder="নাম, ফোন বা অর্ডার নং খুঁজুন..."
                  className="w-full sm:w-72 pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#E76F51]"
                />
              </div>
            </div>

            {/* Orders List Container */}
            <div className="space-y-4">
              {loadingOrders ? (
                <div className="bg-white rounded-3xl p-12 text-center text-gray-400 border border-gray-200">
                  <RefreshCw className="w-8 h-8 animate-spin mx-auto text-[#E76F51] mb-3" />
                  <p className="text-sm font-bold text-gray-600">অর্ডার লোড হচ্ছে...</p>
                </div>
              ) : paginatedOrders.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center text-gray-400 border border-gray-200">
                  <Package className="w-10 h-10 mx-auto text-gray-300 mb-2" />
                  <p className="text-sm font-bold text-gray-600">কোনো অর্ডার পাওয়া যায়নি</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {paginatedOrders.map((order) => {
                    const phone = order.customer?.phone || order.deliveryAddress?.phone || '';
                    const customerName = order.customer?.name || order.deliveryAddress?.fullName || 'Valued Customer';
                    const itemsCount = Array.isArray(order.items) ? order.items.reduce((s, it) => s + (it.quantity || 1), 0) : 0;
                    const formattedDate = order.createdAt ? new Date(order.createdAt).toLocaleDateString('bn-BD', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    }) : 'সম্প্রতি';

                    return (
                      <div
                        key={order.id}
                        className="bg-white rounded-2xl border border-gray-200 shadow-xs hover:shadow-md transition-shadow p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                      >
                        {/* Customer & Address */}
                        <div className="space-y-2 flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-black text-sm text-[#24221F]">
                              #{order.orderNumber}
                            </span>
                            {getStatusBadge(order.status)}
                            <span className="text-[11px] text-gray-400 flex items-center gap-1">
                              <Calendar className="w-3 h-3" /> {formattedDate}
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
                              ক্যাশ অন ডেলিভারি (COD)
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                            <div className="font-extrabold text-gray-900 text-sm">
                              👤 {customerName}
                            </div>
                            {phone && (
                              <div className="flex items-center gap-1.5">
                                <a
                                  href={`tel:${phone}`}
                                  className="inline-flex items-center gap-1 font-bold text-blue-600 hover:text-blue-800 bg-blue-50 px-2.5 py-1 rounded-lg"
                                >
                                  <Phone className="w-3 h-3 text-blue-600" />
                                  <span>{phone}</span>
                                </a>
                                <button
                                  onClick={() => handleCopyPhone(phone)}
                                  className="p-1 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 cursor-pointer"
                                  title="কপি করুন"
                                >
                                  {copiedPhone === phone ? (
                                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                                  ) : (
                                    <Copy className="w-3.5 h-3.5" />
                                  )}
                                </button>
                              </div>
                            )}
                          </div>

                          <div className="flex items-start gap-1.5 text-xs text-gray-600 bg-gray-50/80 p-2.5 rounded-xl border border-gray-100">
                            <MapPin className="w-4 h-4 text-[#E76F51] shrink-0 mt-0.5" />
                            <div>
                              <span className="font-semibold text-gray-800">
                                {order.deliveryAddress?.streetAddress || 'ঠিকানা দেওয়া হয়নি'}
                              </span>
                              {order.deliveryAddress?.district && (
                                <span className="text-gray-500 font-medium">
                                  , {order.deliveryAddress.district}
                                </span>
                              )}
                              <span className="ml-2 inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                                {order.deliveryAddress?.deliveryZone === 'inside-dhaka' ? 'ঢাকার ভিতরে' : 'ঢাকার বাইরে'}
                              </span>
                            </div>
                          </div>

                          <div className="pt-1">
                            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                              অর্ডারকৃত খেলনাসমূহ ({itemsCount} টি):
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {Array.isArray(order.items) && order.items.map((it, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center gap-2 bg-gray-100/80 px-2.5 py-1.5 rounded-xl text-xs text-gray-800"
                                >
                                  {it.image && (
                                    <img
                                      src={it.image}
                                      alt={it.name}
                                      className="w-5 h-5 rounded object-cover bg-white shrink-0"
                                    />
                                  )}
                                  <span className="font-bold truncate max-w-[180px]">{it.name}</span>
                                  <span className="text-gray-500 font-semibold">× {it.quantity}</span>
                                  <span className="text-emerald-700 font-bold">৳{it.price * it.quantity}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Status Changer & Action */}
                        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 sm:border-l border-gray-100 pt-3 sm:pt-0 sm:pl-6 shrink-0 gap-3">
                          <div className="text-left sm:text-right">
                            <p className="text-[10px] uppercase font-bold text-gray-400">সর্বমোট প্রদেয়</p>
                            <p className="text-lg sm:text-xl font-black text-emerald-700">
                              ৳{order.total}
                            </p>
                            <p className="text-[11px] text-gray-500 font-medium">
                              ডেলিভারি চার্জ: ৳{order.deliveryFee || 0}
                            </p>
                          </div>

                          <div className="flex items-center gap-1.5 flex-wrap justify-end">
                            <select
                              value={order.status}
                              disabled={updatingOrderId === order.id}
                              onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                              className="px-2.5 py-1.5 rounded-xl border border-gray-200 text-xs font-bold bg-white text-gray-800 focus:outline-none focus:border-[#E76F51] shadow-xs cursor-pointer"
                            >
                              <option value="pending">অপেক্ষমান (Pending)</option>
                              <option value="confirmed">নিশ্চিত (Confirmed)</option>
                              <option value="processing">প্যাকেজিং (Processing)</option>
                              <option value="shipped">ডেলিভারিতে (Shipped)</option>
                              <option value="delivered">সম্পন্ন (Delivered)</option>
                              <option value="cancelled">বাতিল (Cancelled)</option>
                            </select>

                            {/* 1-Click Invoice */}
                            <button
                              type="button"
                              onClick={() => setInvoiceOrder(order)}
                              className="px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center gap-1 border border-emerald-200 transition-colors cursor-pointer"
                              title="ইনভয়েস তৈরি ও প্রিন্ট করুন"
                            >
                              <FileText className="w-3.5 h-3.5 text-emerald-600" />
                              <span>ইনভয়েস</span>
                            </button>

                            {/* Edit Order */}
                            <button
                              type="button"
                              onClick={() => setEditingOrder(order)}
                              className="p-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition-colors cursor-pointer"
                              title="অর্ডারের ঠিকানা ও তথ্য পরিবর্তন করুন"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>

                            {/* Delete Order */}
                            <button
                              type="button"
                              onClick={() => handleDeleteOrder(order.id)}
                              className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition-colors cursor-pointer"
                              title="অর্ডার মুছে ফেলুন"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>

                            {/* View Detail Modal */}
                            <button
                              onClick={() => setSelectedOrder(order)}
                              className="p-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
                              title="সম্পূর্ণ বিস্তারিত দেখুন"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Clear, Visible Orders Pagination Controls */}
            {filteredOrders.length > 0 && (
              <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="text-gray-500 font-semibold">
                  <span>মোট {filteredOrders.length} টি অর্ডারের মধ্যে </span>
                  <span className="font-bold text-gray-800">
                    {Math.min((orderPage - 1) * ordersPerPage + 1, filteredOrders.length)} থেকে {Math.min(orderPage * ordersPerPage, filteredOrders.length)}
                  </span>
                  <span> দেখানো হচ্ছে (পৃষ্ঠা {orderPage} এর {totalOrderPages})</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setOrderPage(p => Math.max(1, p - 1))}
                    disabled={orderPage <= 1}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>পূর্ববর্তী</span>
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalOrderPages }, (_, i) => i + 1).slice(0, 5).map(pageNum => (
                      <button
                        key={pageNum}
                        onClick={() => setOrderPage(pageNum)}
                        className={`w-7 h-7 rounded-xl text-xs font-bold cursor-pointer transition-colors ${orderPage === pageNum
                          ? 'bg-[#E76F51] text-white shadow-xs'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                      >
                        {pageNum}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setOrderPage(p => Math.min(totalOrderPages, p + 1))}
                    disabled={orderPage >= totalOrderPages}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <span>পরবর্তী</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab: Customer CRM as per Order */}
        {activeTab === 'customers' && (
          <div className="p-4 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                  <Users className="w-6 h-6 text-[#E76F51]" />
                  <span>কাস্টমার লিস্ট ও অর্ডার বিবরণ (CRM)</span>
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  প্রতিটি কাস্টমারের ক্রয়কৃত পণ্যের হিসাব, মোট খরচ, ফেসবুক প্রোফাইল ও নিজস্ব কাস্টমার নোট
                </p>
              </div>

              {/* CRM Search */}
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={customerSearchQuery}
                  onChange={(e) => setCustomerSearchQuery(e.target.value)}
                  placeholder="নাম, ফোন, ফেসবুক বা খেলনার নাম খুঁজুন..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#E76F51] bg-white shadow-xs"
                />
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">মোট কাস্টমার</p>
                <p className="text-xl font-black text-gray-900 mt-0.5">{customersList.length} জন</p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">মোট অর্ডার সংখ্যা</p>
                <p className="text-xl font-black text-blue-600 mt-0.5">{orders.length} টি</p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">মোট বিক্রয় রেভিনিউ</p>
                <p className="text-xl font-black text-emerald-600 mt-0.5">
                  ৳{customersList.reduce((sum, c) => sum + c.totalSpent, 0)}
                </p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">গড় অর্ডার মূল্য</p>
                <p className="text-xl font-black text-purple-600 mt-0.5">
                  ৳{customersList.length > 0 ? Math.round(customersList.reduce((s, c) => s + c.totalSpent, 0) / customersList.length) : 0}
                </p>
              </div>
            </div>

            {/* Customers List Container */}
            <div className="space-y-4">
              {filteredCustomers.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center text-gray-400 border border-gray-200">
                  <Users className="w-10 h-10 mx-auto text-gray-300 mb-2" />
                  <p className="text-sm font-bold text-gray-600">কোনো কাস্টমার পাওয়া যায়নি</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {filteredCustomers.map((cust) => {
                    const latestOrder = cust.orders[0];
                    return (
                      <div
                        key={cust.phone}
                        className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs hover:shadow-md transition-shadow space-y-4"
                      >
                        {/* Top: Customer Name, Phone, Total Spend & Badges */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#E76F51] to-[#F4A261] text-white flex items-center justify-center font-black text-base shadow-sm shrink-0">
                              {cust.name.slice(0, 1) || 'C'}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-extrabold text-gray-900 text-sm">{cust.name}</h4>
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                                  {cust.district || 'ঢাকা'}
                                </span>
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700">
                                  {cust.orders.length}টি অর্ডার
                                </span>
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <a
                                  href={`tel:${cust.phone}`}
                                  className="inline-flex items-center gap-1 font-bold text-xs text-blue-600 hover:text-blue-800"
                                >
                                  <Phone className="w-3 h-3" />
                                  <span>{cust.phone}</span>
                                </a>
                                <button
                                  onClick={() => handleCopyPhone(cust.phone)}
                                  className="p-1 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 cursor-pointer"
                                  title="ফোন নম্বর কপি করুন"
                                >
                                  {copiedPhone === cust.phone ? (
                                    <Check className="w-3 h-3 text-emerald-600" />
                                  ) : (
                                    <Copy className="w-3 h-3" />
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 sm:text-right">
                            <div>
                              <p className="text-[10px] uppercase font-bold text-gray-400">সর্বমোট ক্রয়কৃত মূল্য</p>
                              <p className="text-lg font-black text-emerald-700">৳{cust.totalSpent}</p>
                            </div>
                            {latestOrder && (
                              <button
                                type="button"
                                onClick={() => setInvoiceOrder(latestOrder)}
                                className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1.5 border border-emerald-200 transition-colors cursor-pointer"
                              >
                                <FileText className="w-3.5 h-3.5 text-emerald-600" />
                                <span>ইনভয়েস</span>
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Middle: Facebook Link and Customer Notes Editor */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Facebook Profile Box */}
                          <div className="bg-blue-50/50 p-3.5 rounded-xl border border-blue-100 flex flex-col justify-between">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[11px] font-bold text-blue-900 flex items-center gap-1.5">
                                <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
                                <span>ফেসবুক অ্যাকাউন্ট</span>
                              </span>
                              <button
                                onClick={() => setEditingCrmCustomer({
                                  phone: cust.phone,
                                  name: cust.name,
                                  facebookUrl: cust.facebookUrl,
                                  notes: cust.notes
                                })}
                                className="text-[10px] font-bold text-blue-700 hover:underline cursor-pointer"
                              >
                                {cust.facebookUrl ? 'লিংক পরিবর্তন' : '+ ফেসবুক লিংক যোগ করুন'}
                              </button>
                            </div>
                            {cust.facebookUrl ? (
                              <a
                                href={cust.facebookUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs font-bold text-blue-700 hover:underline truncate block"
                              >
                                🔗 {cust.facebookUrl}
                              </a>
                            ) : (
                              <p className="text-xs text-gray-400 italic">কোনো ফেসবুক প্রোফাইল লিংক সংরক্ষণ করা নেই</p>
                            )}
                          </div>

                          {/* Notes / Text Editor Box */}
                          <div className="bg-amber-50/50 p-3.5 rounded-xl border border-amber-100 flex flex-col justify-between">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[11px] font-bold text-amber-900 flex items-center gap-1.5">
                                <FileText className="w-3.5 h-3.5 text-amber-600" />
                                <span>কাস্টমার নোট (টেক্সট এডিটর)</span>
                              </span>
                              <button
                                onClick={() => setEditingCrmCustomer({
                                  phone: cust.phone,
                                  name: cust.name,
                                  facebookUrl: cust.facebookUrl,
                                  notes: cust.notes
                                })}
                                className="text-[10px] font-bold text-amber-800 hover:underline cursor-pointer"
                              >
                                ✏️ নোট লিখুন / এডিট করুন
                              </button>
                            </div>
                            <p className="text-xs text-gray-700 whitespace-pre-wrap line-clamp-2">
                              {cust.notes || <span className="text-gray-400 italic">এই কাস্টমারের জন্য কোনো নোট এখনো যোগ করা হয়নি।</span>}
                            </p>
                          </div>
                        </div>

                        {/* Bottom: Linked Products Bought Breakdown with direct links */}
                        <div className="pt-2">
                          <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                            গ্রাহকের ক্রয়কৃত খেলনাসমূহ ({cust.itemsBought.length} রকমের পণ্য):
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                            {cust.itemsBought.map((it, idx) => (
                              <div
                                key={idx}
                                className="flex items-center justify-between bg-gray-50 p-2.5 rounded-xl border border-gray-100 text-xs"
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  {it.image && (
                                    <img src={it.image} alt={it.name} className="w-7 h-7 rounded-lg object-cover bg-white shrink-0 border border-gray-200" />
                                  )}
                                  <div className="min-w-0">
                                    <p className="font-bold text-gray-900 truncate max-w-[140px]">{it.name}</p>
                                    <p className="text-[10px] text-gray-500 font-semibold">পরিমাণ: {it.quantity} টি</p>
                                  </div>
                                </div>
                                <span className="font-black text-emerald-700 shrink-0">৳{it.price * it.quantity}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Quick Message Templates */}
                        {latestOrder && (
                          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100">
                            <span className="text-[11px] font-bold text-gray-400">মেসেজ টেমপ্লেট:</span>
                            <button
                              type="button"
                              onClick={() => {
                                const greeting = `আসসালামু আলাইকুম ${cust.name} আপু/ভাইয়া! 💚\nGrowKins Toy World থেকে আপনার সাথে যোগাযোগ করা হচ্ছে। আপনার অর্ডারকৃত পণ্যের ব্যাপারে কোনো জিজ্ঞাসা থাকলে আমাদের জানাতে পারেন। হটলাইন: 01767026831`;
                                navigator.clipboard.writeText(greeting);
                                showToast('শুভেচ্ছা বার্তা কপি হয়েছে!');
                              }}
                              className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              <MessageSquare className="w-3 h-3 text-blue-500" />
                              <span>শুভেচ্ছা বার্তা কপি</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const thankyou = `প্রিয় ${cust.name} আপু/ভাইয়া, 💚\nআপনার সন্তানের জন্য GrowKins-এর মন্টেসরি কাঠের শিক্ষণীয় খেলনাগুলো বেছে নেওয়ার জন্য আন্তরিক ধন্যবাদ। পণ্য হাতে পাওয়ার পর কেমন লাগলো আমাদের ফেসবুক পেইজ বা হটলাইনে (01767026831) জানাবেন!`;
                                navigator.clipboard.writeText(thankyou);
                                showToast('ধন্যবাদ বার্তা কপি হয়েছে!');
                              }}
                              className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              <Heart className="w-3 h-3 text-rose-500" />
                              <span>ধন্যবাদ বার্তা কপি</span>
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Toy World Products Management */}
        {activeTab === 'products' && (
          <div className="p-4 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-xl font-black text-gray-900">
                  খেলনা প্রোডাক্ট ক্যাটালগ ও ল্যান্ডিং পেজ সিলেকশন
                </h3>
                <p className="text-xs text-gray-500">
                  যেসব প্রোডাক্ট আপনি সক্রিয় করবেন, শুধুমাত্র সেই কয়টি প্রোডাক্টই সরাসরি /growkins-toy-world পেজে শো করবে
                </p>
              </div>

              <div className="flex items-center gap-3">
                {/* 2-Way View Switcher: Grid View vs List View */}
                <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl border border-gray-200">
                  <button
                    type="button"
                    onClick={() => setProductViewMode('grid')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${productViewMode === 'grid'
                      ? 'bg-white text-gray-900 shadow-xs'
                      : 'text-gray-500 hover:text-gray-800'
                      }`}
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                    <span>গ্রিড ভিউ</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setProductViewMode('list')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${productViewMode === 'list'
                      ? 'bg-white text-gray-900 shadow-xs'
                      : 'text-gray-500 hover:text-gray-800'
                      }`}
                  >
                    <List className="w-3.5 h-3.5" />
                    <span>লিস্ট ভিউ</span>
                  </button>
                </div>

                <button
                  onClick={() => { handleResetProductForm(); setActiveTab('new-product'); }}
                  className="px-4 py-2.5 rounded-xl bg-[#E76F51] hover:bg-[#D45A3D] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>নতুন খেলনা যোগ করুন</span>
                </button>
              </div>
            </div>

            {/* Storefront Display Selection Control Panel */}
            <div className="bg-gradient-to-r from-[#24221F] via-[#383530] to-[#24221F] text-white p-5 rounded-2xl shadow-md border border-white/10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-[#F4A261]" />
                  <h4 className="font-black text-sm text-white">
                    ল্যান্ডিং পেজ ডিসপ্লে কন্ট্রোল
                  </h4>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-black text-xs animate-pulse">
                    বর্তমানে ল্যান্ডিংয়ে সক্রিয়: {activeLandingProductIds.length}টি খেলনা
                  </span>
                </div>
                <p className="text-xs text-gray-300">
                  আপনি যে কয়টি পণ্য নির্বাচন করবেন (১০টি, ২০টি বা ৫০টি), ঠিক সেই কয়টি পণ্যই সরাসরি
                  <a href="/growkins-toy-world" target="_blank" rel="noopener noreferrer" className="underline font-bold text-[#F4A261] ml-1">
                    /growkins-toy-world
                  </a> পেজে লাইভ থাকবে।
                </p>
              </div>

              {/* Quick Bulk Selection Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleSelectTop10}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors cursor-pointer border border-white/10"
                >
                  প্রথম ১০টি বাছুন
                </button>
                <button
                  type="button"
                  onClick={handleSelectTop20}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#F4A261] font-bold text-xs transition-colors cursor-pointer border border-white/10"
                >
                  প্রথম ২০টি বাছুন
                </button>
                <button
                  type="button"
                  onClick={handleSelectAllProducts}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors cursor-pointer shadow-sm"
                >
                  সব সক্রিয় ({products.length}টি)
                </button>
                <button
                  type="button"
                  onClick={handleDeselectAllProducts}
                  className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-bold text-xs transition-colors cursor-pointer border border-rose-500/30"
                >
                  সব বাদ দিন
                </button>
              </div>
            </div>

            {/* Visibility Filters & Search */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {/* Filter Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                <button
                  onClick={() => setProductVisibilityFilter('all')}
                  className={`px-3 py-1.5 rounded-xl font-bold cursor-pointer transition-all ${productVisibilityFilter === 'all'
                    ? 'bg-[#24221F] text-white shadow-xs'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                    }`}
                >
                  সকল খেলনা ({products.length})
                </button>
                <button
                  onClick={() => setProductVisibilityFilter('landing_active')}
                  className={`px-3 py-1.5 rounded-xl font-bold cursor-pointer transition-all ${productVisibilityFilter === 'landing_active'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                    }`}
                >
                  ল্যান্ডিংয়ে সক্রিয় ({activeLandingProductIds.length})
                </button>
                <button
                  onClick={() => setProductVisibilityFilter('landing_inactive')}
                  className={`px-3 py-1.5 rounded-xl font-bold cursor-pointer transition-all ${productVisibilityFilter === 'landing_inactive'
                    ? 'bg-gray-700 text-white shadow-xs'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                    }`}
                >
                  নিষ্ক্রিয় / লুকানো ({Math.max(0, products.length - activeLandingProductIds.length)})
                </button>
              </div>

              {/* Product Search */}
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={productSearchQuery}
                  onChange={(e) => setProductSearchQuery(e.target.value)}
                  placeholder="খেলনার নাম দিয়ে খুঁজুন..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#E76F51] bg-white"
                />
              </div>
            </div>

            {/* Products Display (No pagination - all products visible) */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center text-gray-400 border border-gray-200">
                <ShoppingBag className="w-10 h-10 mx-auto text-gray-300 mb-2" />
                <p className="text-sm font-bold text-gray-600">কোনো খেলনা পণ্য পাওয়া যায়নি</p>
              </div>
            ) : productViewMode === 'grid' ? (
              /* View 1: Responsive Grid View */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
                {filteredProducts.map((prod) => {
                  const customB = BENGALI_TOY_MAP[prod.id];
                  const displayName = customB?.bName || prod.name;
                  const displaySubtitle = customB?.bSubtitle || prod.subtitle || '';
                  const image = prod.featuredImage || prod.images?.main || (Array.isArray(prod.images) ? prod.images[0]?.url : '/items/busy-cube.jfif');
                  const price = Number(prod.price) || 0;
                  const originalPrice = Number(prod.originalPrice || prod.compareAtPrice) || Math.round(price * 1.35);
                  const isLandingActive = activeLandingProductIds.includes(prod.id);

                  return (
                    <div
                      key={prod.id}
                      className={`bg-white rounded-2xl border transition-all overflow-hidden flex flex-col justify-between ${isLandingActive
                        ? 'border-emerald-300 shadow-sm ring-2 ring-emerald-500/10'
                        : 'border-gray-200 opacity-70 hover:opacity-100'
                        }`}
                    >
                      <div>
                        {/* Thumbnail */}
                        <div className="relative aspect-video bg-[#FAF7F1] overflow-hidden">
                          <img src={image} alt={displayName} className="w-full h-full object-cover" />
                          <span className="absolute top-2 left-2 bg-[#24221F]/80 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                            {customB?.ageBadge || prod.ageBadge || '১–৩ বছর'}
                          </span>

                          {/* Live Landing Badge */}
                          <span className={`absolute top-2 right-2 text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs ${isLandingActive
                            ? 'bg-emerald-600 text-white'
                            : 'bg-gray-700/80 text-gray-200'
                            }`}>
                            {isLandingActive ? '✓ ল্যান্ডিংয়ে সক্রিয়' : 'লুকানো'}
                          </span>

                          {prod.videoUrl && (
                            <span className="absolute bottom-2 right-2 bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                              <Video className="w-3 h-3" />
                              <span>ভিডিও যুক্ত</span>
                            </span>
                          )}
                        </div>

                        {/* Content */}
                        <div className="p-4 space-y-2">
                          <h4 className="font-black text-sm text-gray-900 line-clamp-1">
                            {displayName}
                          </h4>
                          <p className="text-xs text-gray-500 line-clamp-2">
                            {displaySubtitle}
                          </p>
                          <div className="flex items-baseline gap-2 pt-1">
                            <span className="text-lg font-black text-[#2D6A4F]">
                              ৳{price}
                            </span>
                            {originalPrice > price && (
                              <span className="text-xs font-semibold text-gray-400 line-through">
                                ৳{originalPrice}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Actions & Landing Toggle */}
                      <div className="p-4 pt-3 border-t border-gray-100 flex items-center justify-between gap-2 bg-gray-50/50">
                        <button
                          type="button"
                          onClick={() => handleToggleLandingProduct(prod.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${isLandingActive
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200'
                            : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                            }`}
                          title={isLandingActive ? 'ল্যান্ডিং পেজ থেকে সরাতে ক্লিক করুন' : 'ল্যান্ডিং পেজে দেখাতে ক্লিক করুন'}
                        >
                          {isLandingActive ? (
                            <>
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                              <span>সক্রিয়</span>
                            </>
                          ) : (
                            <>
                              <span className="w-2 h-2 rounded-full bg-gray-500" />
                              <span>লুকানো</span>
                            </>
                          )}
                        </button>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleOpenEditProduct(prod)}
                            className="p-1.5 rounded-lg bg-white hover:bg-gray-100 text-gray-700 border border-gray-200 transition-colors cursor-pointer"
                            title="সম্পাদনা করুন"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(prod.id)}
                            className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                            title="মুছে ফেলুন"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* View 2: Detailed Responsive List / Table View */
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#FAF7F1] border-b border-gray-200 text-gray-700 uppercase font-black text-[10px] tracking-wider">
                      <tr>
                        <th className="p-3.5">খেলনা পণ্য বিবরণ</th>
                        <th className="p-3.5">বিক্রয় মূল্য</th>
                        <th className="p-3.5">বয়সের গ্রুপ</th>
                        <th className="p-3.5">ভিডিও ডেমো</th>
                        <th className="p-3.5 text-center">ল্যান্ডিং ডিসপ্লে</th>
                        <th className="p-3.5 text-right">অ্যাকশন</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredProducts.map((prod) => {
                        const customB = BENGALI_TOY_MAP[prod.id];
                        const displayName = customB?.bName || prod.name;
                        const displaySubtitle = customB?.bSubtitle || prod.subtitle || '';
                        const image = prod.featuredImage || prod.images?.main || (Array.isArray(prod.images) ? prod.images[0]?.url : '/items/busy-cube.jfif');
                        const price = Number(prod.price) || 0;
                        const originalPrice = Number(prod.originalPrice || prod.compareAtPrice) || Math.round(price * 1.35);
                        const isLandingActive = activeLandingProductIds.includes(prod.id);

                        return (
                          <tr
                            key={prod.id}
                            className={`hover:bg-gray-50/80 transition-colors ${isLandingActive ? 'bg-emerald-50/20' : ''
                              }`}
                          >
                            <td className="p-3.5">
                              <div className="flex items-center gap-3">
                                <img
                                  src={image}
                                  alt={displayName}
                                  className="w-12 h-12 rounded-xl object-cover bg-[#FAF7F1] border border-gray-200 shrink-0"
                                />
                                <div>
                                  <p className="font-extrabold text-gray-900 text-xs">{displayName}</p>
                                  <p className="text-[11px] text-gray-500 line-clamp-1">{displaySubtitle}</p>
                                </div>
                              </div>
                            </td>
                            <td className="p-3.5">
                              <div className="flex items-baseline gap-1.5">
                                <span className="font-black text-emerald-700 text-sm">৳{price}</span>
                                {originalPrice > price && (
                                  <span className="text-[10px] line-through text-gray-400">৳{originalPrice}</span>
                                )}
                              </div>
                            </td>
                            <td className="p-3.5">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                                {customB?.ageBadge || prod.ageBadge || '১–৩ বছর'}
                              </span>
                            </td>
                            <td className="p-3.5">
                              {prod.videoUrl ? (
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
                                  <Video className="w-3 h-3" />
                                  <span>ভিডিও আছে</span>
                                </span>
                              ) : (
                                <span className="text-gray-400 text-[11px]">ভিডিও নেই</span>
                              )}
                            </td>
                            <td className="p-3.5 text-center">
                              <button
                                type="button"
                                onClick={() => handleToggleLandingProduct(prod.id)}
                                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${isLandingActive
                                  ? 'bg-emerald-600 text-white shadow-xs'
                                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                  }`}
                              >
                                {isLandingActive ? '✓ সক্রিয়' : 'লুকানো'}
                              </button>
                            </td>
                            <td className="p-3.5 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => handleOpenEditProduct(prod)}
                                  className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
                                  title="সম্পাদনা করুন"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(prod.id)}
                                  className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                                  title="মুছে ফেলুন"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Fast Product Add/Edit Form (Connected to Google Drive Media) */}
        {activeTab === 'new-product' && (
          <div className="p-4 sm:p-8 max-w-4xl space-y-6">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setActiveTab('products')}
                className="flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-gray-900 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>প্রোডাক্ট তালিকায় ফিরে যান</span>
              </button>

              <h3 className="text-lg font-black text-gray-900">
                {editingProductId ? '✏️ খেলনা সম্পাদনা করুন' : '➕ নতুন খেলনা প্রোডাক্ট তৈরি করুন'}
              </h3>
            </div>

            <form onSubmit={handleSaveProduct} className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
              {/* Product Basic Info */}
              <div className="space-y-4">
                <h4 className="text-xs font-black uppercase tracking-wider text-gray-400">
                  ১. সাধারণ তথ্য ও শিরোনাম
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      খেলনার নাম (বাংলা/ইংরেজি) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="যেমন: মন্টেসরি সেন্সরি বিজি কিউব"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#E76F51]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      বয়সের গ্রুপ (Age Badge)
                    </label>
                    <input
                      type="text"
                      value={formAgeBadge}
                      onChange={(e) => setFormAgeBadge(e.target.value)}
                      placeholder="যেমন: ১–৩ বছর / ২–৫ বছর"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#E76F51]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    বাংলা সাবটাইটেল (সংক্ষিপ্ত বিবরণী)
                  </label>
                  <input
                    type="text"
                    value={formSubtitle}
                    onChange={(e) => setFormSubtitle(e.target.value)}
                    placeholder="যেমন: বাচ্চার ব্রেন ডেভেলপমেন্ট ও একাগ্রতা বৃদ্ধির নিরাপদ খেলনা"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#E76F51]"
                  />
                </div>
              </div>

              {/* Pricing */}
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <h4 className="text-xs font-black uppercase tracking-wider text-gray-400">
                  ২. মূল্য নির্ধারণ (BDT ৳)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      বিক্রয় মূল্য / অফার প্রাইস (৳) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formPrice}
                      onChange={(e) => setFormPrice(e.target.value)}
                      placeholder="যেমন: 850"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#E76F51]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      আগের দাম / রেগুলার প্রাইস (৳)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formOriginalPrice}
                      onChange={(e) => setFormOriginalPrice(e.target.value)}
                      placeholder="যেমন: 1200 (ছাড় বোঝাতে)"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#E76F51]"
                    />
                  </div>
                </div>
              </div>

              {/* Media: Google Drive Picker & YouTube Link */}
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <h4 className="text-xs font-black uppercase tracking-wider text-gray-400">
                  ৩. ছবি ও ইউটিউব ভিডিও ডেমো লিংক
                </h4>

                {/* Google Drive Media Picker */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    প্রোডাক্টের ছবি (Google Drive)
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setMediaPickerOpen(true)}
                      className="px-4 py-2.5 rounded-xl bg-[#24221F] hover:bg-[#383530] text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs"
                    >
                      <ImageIcon className="w-4 h-4 text-amber-400" />
                      <span>গুগল ড্রাইভ থেকে ছবি বাছুন</span>
                    </button>
                    <span className="text-xs text-gray-400">অথবা সরাসরি ইমেজ লিংক পেস্ট করুন</span>
                  </div>

                  <input
                    type="url"
                    value={formImage}
                    onChange={(e) => setFormImage(e.target.value)}
                    placeholder="https://drive.google.com/... বা ইমেজ লিংক"
                    className="w-full mt-2 px-4 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#E76F51]"
                  />

                  {formImage && (
                    <div className="mt-2.5 flex items-center gap-3 p-2 bg-gray-50 rounded-xl border border-gray-200 w-fit">
                      <img src={formImage} alt="preview" className="w-12 h-12 rounded-lg object-cover" />
                      <span className="text-xs text-emerald-700 font-bold">✓ ছবি সিলেক্টেড</span>
                    </div>
                  )}
                </div>

                {/* YouTube Video Link */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    ইউটিউব ডেমো ভিডিও লিংক (YouTube URL / Shorts)
                  </label>
                  <div className="relative">
                    <Video className="w-4 h-4 text-rose-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="url"
                      value={formVideoUrl}
                      onChange={(e) => setFormVideoUrl(e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#E76F51]"
                    />
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1">
                    * সাধারণ ইউটিউব ভিডিও, শর্টস (Shorts) বা youtu.be লিংক দিন—ল্যান্ডিং পেজের ডেমো প্লেয়ারে সরাসরি চলবে।
                  </p>
                </div>
              </div>

              {/* Bengali Feature Bullets */}
              <div className="space-y-3 pt-4 border-t border-gray-100">
                <h4 className="text-xs font-black uppercase tracking-wider text-gray-400">
                  ৪. প্রধান ৩টি বৈশিষ্ট্য / শিশুর উপকারিতা
                </h4>

                {formFeatures.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <input
                      type="text"
                      value={feat}
                      onChange={(e) => {
                        const updated = [...formFeatures];
                        updated[idx] = e.target.value;
                        setFormFeatures(updated);
                      }}
                      placeholder={`ফিচার ${idx + 1}`}
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#E76F51]"
                    />
                  </div>
                ))}
              </div>

              {/* Detailed Description */}
              <div className="space-y-2 pt-4 border-t border-gray-100">
                <label className="block text-xs font-bold text-gray-700">
                  ৫. বিস্তারিত বিবরণ (খেলনাটির কার্যকারিতা)
                </label>
                <textarea
                  rows={4}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="খেলনাটি দিয়ে বাচ্চা কীভাবে খেলবে এবং এটি কীভাবে মনোযোগ ও বুদ্ধিমত্তা বাড়ায় তা লিখুন..."
                  className="w-full p-3.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#E76F51]"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('products')}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-bold text-xs hover:bg-gray-50 cursor-pointer"
                >
                  বাতিল করুন
                </button>

                <button
                  type="submit"
                  disabled={isSavingProduct}
                  className="px-6 py-2.5 rounded-xl bg-[#E76F51] hover:bg-[#D45A3D] text-white font-bold text-xs flex items-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {isSavingProduct ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>সংরক্ষণ হচ্ছে...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>{editingProductId ? 'আপডেট করুন' : 'পণ্য যোগ করুন'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab 4: Delivery Settings */}
        {activeTab === 'delivery' && (
          <div className="p-4 sm:p-8 max-w-xl space-y-6">
            <div>
              <h3 className="text-xl font-black text-gray-900">
                ডেলিভারি চার্জ সেটিংস
              </h3>
              <p className="text-xs text-gray-500">
                গ্রোকিন্স টয় ওয়ার্ল্ডের চেকআউট ফর্মে এই ডেলিভারি রেটগুলো ব্যবহৃত হচ্ছে
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  ঢাকার ভেতরে ডেলিভারি চার্জ (BDT ৳)
                </label>
                <input
                  type="number"
                  value={insideDhakaFee}
                  onChange={(e) => setInsideDhakaFee(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#E76F51]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  ঢাকার বাইরে ডেলিভারি চার্জ (BDT ৳)
                </label>
                <input
                  type="number"
                  value={outsideDhakaFee}
                  onChange={(e) => setOutsideDhakaFee(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#E76F51]"
                />
              </div>

              <button
                type="button"
                onClick={() => showToast('ডেলিভারি চার্জ সফলভাবে আপডেট হয়েছে!')}
                className="w-full py-2.5 rounded-xl bg-[#24221F] hover:bg-[#383530] text-white text-xs font-bold cursor-pointer transition-colors shadow-xs"
              >
                চার্জ পরিবর্তন সংরক্ষণ করুন
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Full Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-gray-200 space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-lg font-black text-gray-900">
                  অর্ডার বিস্তারিত: #{selectedOrder.orderNumber}
                </h3>
                <p className="text-xs text-gray-500">
                  {selectedOrder.createdAt && new Date(selectedOrder.createdAt).toLocaleString('bn-BD')}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Customer Details Box */}
            <div className="bg-gray-50 p-4 rounded-2xl space-y-2 text-xs">
              <p className="font-bold text-gray-700 uppercase tracking-wider text-[10px]">
                গ্রাহক ও ডেলিভারি বিবরণ
              </p>
              <p className="text-sm font-extrabold text-gray-900">
                {selectedOrder.customer?.name || selectedOrder.deliveryAddress?.fullName}
              </p>
              <div className="flex items-center gap-2">
                <a
                  href={`tel:${selectedOrder.customer?.phone || selectedOrder.deliveryAddress?.phone}`}
                  className="inline-flex items-center gap-1 font-bold text-blue-600 hover:underline"
                >
                  <Phone className="w-3.5 h-3.5" />
                  {selectedOrder.customer?.phone || selectedOrder.deliveryAddress?.phone}
                </a>
              </div>
              <p className="text-gray-700 font-medium pt-1">
                <span className="font-bold">ঠিকানা:</span> {selectedOrder.deliveryAddress?.streetAddress}, {selectedOrder.deliveryAddress?.district}
              </p>
              {selectedOrder.notes && (
                <p className="text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200 font-medium">
                  <span className="font-bold">কাস্টমার নোট:</span> {selectedOrder.notes}
                </p>
              )}
            </div>

            {/* Product Breakdown */}
            <div className="space-y-3">
              <p className="font-bold text-gray-700 uppercase tracking-wider text-[10px]">
                পণ্য তালিকা ও হিসাব
              </p>
              <div className="divide-y divide-gray-100 border rounded-2xl overflow-hidden">
                {Array.isArray(selectedOrder.items) && selectedOrder.items.map((it, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      {it.image && (
                        <img src={it.image} alt={it.name} className="w-8 h-8 rounded object-cover bg-gray-50 border" />
                      )}
                      <div>
                        <p className="font-bold text-gray-900">{it.name}</p>
                        <p className="text-[11px] text-gray-500">৳{it.price} × {it.quantity}</p>
                      </div>
                    </div>
                    <span className="font-extrabold text-gray-900">৳{it.price * it.quantity}</span>
                  </div>
                ))}
              </div>

              {/* Total calculations */}
              <div className="bg-gray-50 p-3 rounded-2xl space-y-1 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>সাবটোটাল</span>
                  <span>৳{selectedOrder.subtotal}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>ডেলিভারি চার্জ</span>
                  <span>৳{selectedOrder.deliveryFee || 0}</span>
                </div>
                <div className="flex justify-between font-black text-sm text-emerald-800 pt-1 border-t border-gray-200">
                  <span>সর্বমোট বিল (ক্যাশ অন ডেলিভারি)</span>
                  <span>৳{selectedOrder.total}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
              <button
                onClick={() => {
                  setInvoiceOrder(selectedOrder);
                }}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>ইনভয়েস দেখুন ও প্রিন্ট</span>
              </button>
              <button
                onClick={() => {
                  setEditingOrder(selectedOrder);
                  setSelectedOrder(null);
                }}
                className="px-4 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold border border-blue-200 transition-colors cursor-pointer flex items-center gap-1"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>এডিট</span>
              </button>
              <button
                onClick={() => handleDeleteOrder(selectedOrder.id)}
                className="px-3.5 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold border border-rose-200 transition-colors cursor-pointer"
                title="মুছে ফেলুন"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setSelectedOrder(null)}
              className="w-full py-2.5 rounded-xl bg-gray-900 text-white text-xs font-bold hover:bg-gray-800 transition-colors cursor-pointer"
            >
              বন্ধ করুন
            </button>
          </div>
        </div>
      )}

      {/* Invoice Modal */}
      {invoiceOrder && (
        <InvoiceModal
          order={invoiceOrder}
          onClose={() => setInvoiceOrder(null)}
        />
      )}

      {/* Edit Order Modal */}
      {editingOrder && (
        <EditOrderModal
          order={editingOrder}
          onClose={() => setEditingOrder(null)}
          onSave={handleUpdateOrder}
        />
      )}

      {/* Customer Facebook & Text Notes Quick Editor Modal */}
      {editingCrmCustomer && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-base font-black text-gray-900">
                  কাস্টমার তথ্য ও নোট সম্পাদনা
                </h3>
                <p className="text-xs text-gray-500">
                  {editingCrmCustomer.name} • {editingCrmCustomer.phone}
                </p>
              </div>
              <button
                onClick={() => setEditingCrmCustomer(null)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  ফেসবুক প্রোফাইল বা পেজ লিংক (Facebook Profile URL)
                </label>
                <input
                  type="url"
                  value={editingCrmCustomer.facebookUrl}
                  onChange={(e) => setEditingCrmCustomer(prev => prev ? { ...prev, facebookUrl: e.target.value } : null)}
                  placeholder="https://www.facebook.com/username"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#E76F51]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  কাস্টমার নোট (টেক্সট এডিটর)
                </label>
                <textarea
                  rows={4}
                  value={editingCrmCustomer.notes}
                  onChange={(e) => setEditingCrmCustomer(prev => prev ? { ...prev, notes: e.target.value } : null)}
                  placeholder="বাচ্চার বয়স, পছন্দ, পূর্বে কি কি নিয়েছে, ফলোআপ বা বিশেষ নির্দেশনা লিখে রাখুন..."
                  className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#E76F51]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setEditingCrmCustomer(null)}
                className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 font-bold text-xs hover:bg-gray-50 cursor-pointer"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={() => {
                  if (editingCrmCustomer) {
                    handleSaveCrmCustomer(editingCrmCustomer.phone, {
                      facebookUrl: editingCrmCustomer.facebookUrl,
                      notes: editingCrmCustomer.notes
                    });
                  }
                }}
                className="px-5 py-2 rounded-xl bg-[#E76F51] hover:bg-[#D45A3D] text-white font-bold text-xs shadow-xs cursor-pointer"
              >
                সংরক্ষণ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
