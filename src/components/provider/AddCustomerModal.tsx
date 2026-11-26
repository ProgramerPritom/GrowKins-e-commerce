import React, { useState } from 'react';
import { X, UserPlus, Phone, MapPin, Globe, ShoppingBag, Plus, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import type { AdminOrder, OrderItemSnapshot } from '../../types/admin/order';

interface AddCustomerModalProps {
  products: any[];
  existingCustomer?: {
    name: string;
    phone: string;
    streetAddress?: string;
    district?: string;
    facebookUrl?: string;
    notes?: string;
  } | null;
  allExistingPhones?: string[];
  onClose: () => void;
  onSave: (
    customerInfo: {
      name: string;
      phone: string;
      streetAddress: string;
      district: string;
      facebookUrl: string;
      notes: string;
      tag: 'new' | 'repeat' | 'vip';
    },
    orderData: Partial<AdminOrder>,
    syncGoogleSheets: boolean
  ) => Promise<void>;
}

const POPULAR_DISTRICTS = [
  'ঢাকা', 'চট্টগ্রাম', 'সিলেট', 'রাজশাহী', 'খুলনা', 'বরিশাল', 'রংপুর', 'ময়মনসিংহ', 'গাজীপুর', 'নারায়ণগঞ্জ', 'কুমিল্লা', 'বগুড়া'
];

export const AddCustomerModal: React.FC<AddCustomerModalProps> = ({
  products,
  existingCustomer,
  allExistingPhones = [],
  onClose,
  onSave
}) => {
  const isRepeatOrderMode = Boolean(existingCustomer);

  const [name, setName] = useState<string>(existingCustomer?.name || '');
  const [phone, setPhone] = useState<string>(existingCustomer?.phone || '');
  const [streetAddress, setStreetAddress] = useState<string>(existingCustomer?.streetAddress || '');
  const [district, setDistrict] = useState<string>(existingCustomer?.district || 'ঢাকা');
  const [facebookUrl, setFacebookUrl] = useState<string>(existingCustomer?.facebookUrl || '');
  const [notes, setNotes] = useState<string>(existingCustomer?.notes || '');
  const [tag, setTag] = useState<'new' | 'repeat' | 'vip'>(isRepeatOrderMode ? 'repeat' : 'new');

  // Order items
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [items, setItems] = useState<{
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
  }[]>([]);

  // Custom Item inputs
  const [showCustomItem, setShowCustomItem] = useState<boolean>(false);
  const [customItemName, setCustomItemName] = useState<string>('');
  const [customItemPrice, setCustomItemPrice] = useState<number>(0);

  // Delivery & financials
  const [deliveryFee, setDeliveryFee] = useState<number>(district === 'ঢাকা' ? 70 : 130);
  const [discount, setDiscount] = useState<number>(0);
  const [syncGoogleSheets, setSyncGoogleSheets] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Check if phone matches an existing customer in new customer mode
  const isPhoneAlreadyExisting = !isRepeatOrderMode && phone.trim().length >= 11 && allExistingPhones.includes(phone.trim());

  // Handle adding catalog product to order items
  const handleAddProduct = () => {
    if (!selectedProductId) return;
    const prod = products.find(p => p.id === selectedProductId);
    if (!prod) return;

    const existingIdx = items.findIndex(it => it.productId === prod.id);
    if (existingIdx >= 0) {
      const updated = [...items];
      updated[existingIdx].quantity += 1;
      setItems(updated);
    } else {
      setItems([
        ...items,
        {
          productId: prod.id,
          name: prod.title || prod.name,
          price: Number(prod.price) || 0,
          quantity: 1,
          image: prod.images?.[0] || prod.image || ''
        }
      ]);
    }
    setSelectedProductId('');
  };

  // Handle adding custom toy item
  const handleAddCustomItem = () => {
    if (!customItemName.trim()) return;
    setItems([
      ...items,
      {
        productId: `custom_${Date.now()}`,
        name: customItemName.trim(),
        price: Number(customItemPrice) || 0,
        quantity: 1
      }
    ]);
    setCustomItemName('');
    setCustomItemPrice(0);
    setShowCustomItem(false);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleUpdateItemName = (index: number, newName: string) => {
    const updated = [...items];
    updated[index].name = newName;
    setItems(updated);
  };

  const handleUpdateItemPrice = (index: number, newPrice: number) => {
    const updated = [...items];
    updated[index].price = Math.max(0, Number(newPrice) || 0);
    setItems(updated);
  };

  const handleUpdateItemQuantity = (index: number, qty: number) => {
    if (qty <= 0) {
      handleRemoveItem(index);
      return;
    }
    const updated = [...items];
    updated[index].quantity = qty;
    setItems(updated);
  };

  // Financial calculations
  const itemsSubtotal = items.reduce((sum, it) => sum + (it.price * it.quantity), 0);
  const totalAmount = Math.max(0, itemsSubtotal + deliveryFee - discount);

  // Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanPhone = phone.trim().replace(/[^0-9]/g, '');
    if (!name.trim()) {
      setErrorMessage('অনুগ্রহ করে কাস্টমারের নাম লিখুন।');
      return;
    }
    if (cleanPhone.length < 11) {
      setErrorMessage('সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 017XXXXXXXX)।');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderNumber = `GK-${Date.now().toString().slice(-6)}`;
      const orderItemsSnapshots: OrderItemSnapshot[] = items.length > 0 
        ? items.map(it => ({
            productId: it.productId,
            name: it.name,
            price: it.price,
            quantity: it.quantity,
            total: it.price * it.quantity,
            image: it.image || 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=300'
          }))
        : [{
            productId: 'toy_custom_manual',
            name: 'গ্রাহকের পছন্দকৃত খেলনা',
            price: itemsSubtotal > 0 ? itemsSubtotal : 850,
            quantity: 1,
            total: itemsSubtotal > 0 ? itemsSubtotal : 850,
            image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=300'
          }];

      const calculatedSubtotal = items.length > 0 ? itemsSubtotal : (itemsSubtotal > 0 ? itemsSubtotal : 850);
      const calculatedTotal = items.length > 0 ? totalAmount : (calculatedSubtotal + deliveryFee - discount);

      const newOrderPayload: Partial<AdminOrder> = {
        orderNumber,
        customer: {
          name: name.trim(),
          phone: cleanPhone,
          isGuest: true
        },
        deliveryAddress: {
          fullName: name.trim(),
          phone: cleanPhone,
          deliveryZone: district === 'ঢাকা' ? 'inside-dhaka' : 'outside-dhaka',
          district: district.trim() || 'ঢাকা',
          thanaArea: district.trim() || 'ঢাকা',
          streetAddress: streetAddress.trim() || 'অফিস / শোরুম / ফেসবুক অর্ডার'
        },
        items: orderItemsSnapshots,
        subtotal: calculatedSubtotal,
        deliveryFee,
        discount,
        total: calculatedTotal,
        currency: 'BDT',
        paymentMethod: 'Cash on Delivery',
        paymentStatus: 'cod_pending',
        status: 'confirmed',
        notes: notes.trim(),
        timeline: [
          {
            id: `tml_${Date.now()}`,
            status: 'confirmed',
            title: isRepeatOrderMode ? 'Repeat Order Added via CRM' : 'Customer Added via CRM Portal',
            description: `Manual entry by GrowKins Merchant. Order: ${orderNumber}`,
            timestamp: new Date().toISOString(),
            actor: 'Provider CRM'
          }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await onSave(
        {
          name: name.trim(),
          phone: cleanPhone,
          streetAddress: streetAddress.trim(),
          district: district.trim(),
          facebookUrl: facebookUrl.trim(),
          notes: notes.trim(),
          tag
        },
        newOrderPayload,
        syncGoogleSheets
      );

      onClose();
    } catch (err: any) {
      console.error('Error saving customer/order:', err);
      setErrorMessage(err?.message || 'কাস্টমার সংরক্ষণ করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-gray-100 overflow-hidden animate-in zoom-in-95">
        {/* Modal Header */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-emerald-600 via-teal-600 to-[#E76F51] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black tracking-tight">
                {isRepeatOrderMode ? `রিপিট অর্ডার এন্ট্রি — ${name}` : 'নতুন কাস্টমার যোগ করুন (CRM Database)'}
              </h3>
              <p className="text-[11px] text-white/80">
                {isRepeatOrderMode
                  ? 'এই নিয়মিত কাস্টমারের জন্য নতুন একটি অর্ডার ও বিক্রয়ের হিসাব যুক্ত করুন'
                  : 'গ্রাহকের নাম, ঠিকানা, ফোন ও ক্রয়কৃত খেলনার তথ্য সংরক্ষণ করুন'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 text-xs">
          {errorMessage && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {isPhoneAlreadyExisting && (
            <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
              <div>
                <strong>মনোযোগ দিন:</strong> এই ফোন নম্বরটি ইতিমধ্যে একজন কাস্টমারের সাথে যুক্ত আছে। সাবমিট করলে এই নতুন অর্ডারটি তার হিস্ট্রিতে <strong>রিপিট অর্ডার</strong> হিসেবে যুক্ত হয়ে যাবে!
              </div>
            </div>
          )}

          {/* Section 1: Customer Info */}
          <div className="space-y-3 bg-gray-50/80 p-4 rounded-2xl border border-gray-100">
            <h4 className="font-extrabold text-gray-900 text-xs flex items-center gap-1.5 uppercase tracking-wider text-emerald-800">
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span>১. কাস্টমার ব্যক্তিগত ও যোগাযোগের তথ্য</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  কাস্টমারের পুরো নাম <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="যেমন: নিগার সুলতানা / সাদিয়া রহমান"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-500 bg-white shadow-2xs font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  মোবাইল নম্বর (১১ ডিজিট) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="017XXXXXXXX"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-500 bg-white shadow-2xs font-mono font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  <MapPin className="w-3 h-3 inline mr-1 text-gray-400" />
                  ঠিকানা (বাসা / রোড / এলাকা)
                </label>
                <input
                  type="text"
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  placeholder="যেমন: বাড়ি ১২, রোড ৫, সেক্টর ৭, উত্তরা"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-500 bg-white shadow-2xs font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">জেলা</label>
                <div className="flex gap-2">
                  <select
                    value={POPULAR_DISTRICTS.includes(district) ? district : 'custom'}
                    onChange={(e) => {
                      if (e.target.value !== 'custom') {
                        setDistrict(e.target.value);
                        setDeliveryFee(e.target.value === 'ঢাকা' ? 70 : 130);
                      }
                    }}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-emerald-500 font-medium"
                  >
                    {POPULAR_DISTRICTS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                    <option value="custom">অন্যান্য জেলা...</option>
                  </select>
                  {!POPULAR_DISTRICTS.includes(district) && (
                    <input
                      type="text"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      placeholder="জেলার নাম লিখুন"
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-emerald-500 font-medium"
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  <Globe className="w-3 h-3 inline mr-1 text-blue-600" />
                  ফেসবুক প্রোফাইল বা পেজ লিংক
                </label>
                <input
                  type="url"
                  value={facebookUrl}
                  onChange={(e) => setFacebookUrl(e.target.value)}
                  placeholder="https://facebook.com/username"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-500 bg-white shadow-2xs font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  কাস্টমার ট্যাগ / ক্যাটাগরি
                </label>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => setTag('new')}
                    className={`flex-1 py-2 rounded-xl text-center font-bold border transition-all cursor-pointer ${
                      tag === 'new'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-2xs'
                        : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    🟢 নতুন
                  </button>
                  <button
                    type="button"
                    onClick={() => setTag('repeat')}
                    className={`flex-1 py-2 rounded-xl text-center font-bold border transition-all cursor-pointer ${
                      tag === 'repeat'
                        ? 'bg-amber-50 border-amber-500 text-amber-800 shadow-2xs'
                        : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    ⭐ রিপিট
                  </button>
                  <button
                    type="button"
                    onClick={() => setTag('vip')}
                    className={`flex-1 py-2 rounded-xl text-center font-bold border transition-all cursor-pointer ${
                      tag === 'vip'
                        ? 'bg-purple-50 border-purple-500 text-purple-800 shadow-2xs'
                        : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    👑 ভিআইপি
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Purchased Toys / Items */}
          <div className="space-y-3 bg-gray-50/80 p-4 rounded-2xl border border-gray-100">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-gray-900 text-xs flex items-center gap-1.5 uppercase tracking-wider text-[#E76F51]">
                <ShoppingBag className="w-3.5 h-3.5 text-[#E76F51]" />
                <span>২. অর্ডারকৃত খেলনাসমূহ (Toy Products)</span>
              </h4>
              <button
                type="button"
                onClick={() => setShowCustomItem(!showCustomItem)}
                className="text-[11px] font-bold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
              >
                {showCustomItem ? 'ক্যাটালগ থেকে নির্বাচন' : '+ কাস্টম খেলনা লিখুন'}
              </button>
            </div>

            {/* Catalog Dropdown Picker */}
            {!showCustomItem ? (
              <div className="flex gap-2">
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-[#E76F51] font-medium"
                >
                  <option value="">-- GrowKins খেলনা নির্বাচন করুন --</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title || p.name} — ৳{p.price}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleAddProduct}
                  disabled={!selectedProductId}
                  className="px-4 py-2.5 rounded-xl bg-[#E76F51] hover:bg-[#D45A3D] disabled:opacity-50 text-white font-bold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>যোগ</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-2 p-3 bg-white rounded-xl border border-gray-200">
                <input
                  type="text"
                  value={customItemName}
                  onChange={(e) => setCustomItemName(e.target.value)}
                  placeholder="খেলনার নাম (যেমন: মন্টেসরি ফ্রুট কাটিং সেট)"
                  className="flex-1 min-w-[180px] px-3 py-2 rounded-lg border border-gray-200 focus:outline-none"
                />
                <input
                  type="number"
                  value={customItemPrice || ''}
                  onChange={(e) => setCustomItemPrice(Number(e.target.value))}
                  placeholder="মূল্য ৳"
                  className="w-24 px-3 py-2 rounded-lg border border-gray-200 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddCustomItem}
                  disabled={!customItemName.trim()}
                  className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold cursor-pointer"
                >
                  যোগ করুন
                </button>
              </div>
            )}

            {/* Selected Items List */}
            {items.length > 0 ? (
              <div className="space-y-2 pt-2">
                {items.map((it, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-3 bg-white rounded-xl border border-gray-200 shadow-2xs"
                  >
                    <div className="flex items-center gap-2.5 flex-1 min-w-0">
                      {it.image ? (
                        <img src={it.image} alt={it.name} className="w-8 h-8 rounded-lg object-cover bg-gray-50 border shrink-0" onError={(e) => { (e.target as any).style.display = 'none'; }} />
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center text-xs font-black shrink-0">
                          {idx + 1}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <input
                          type="text"
                          value={it.name}
                          onChange={(e) => handleUpdateItemName(idx, e.target.value)}
                          className="w-full text-xs font-bold text-gray-900 border-b border-dashed border-gray-300 focus:border-[#E76F51] focus:outline-none bg-transparent"
                          placeholder="পণ্যের নাম"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                      <div className="flex items-center gap-1">
                        <span className="text-[11px] text-gray-500 font-bold">৳</span>
                        <input
                          type="number"
                          value={it.price}
                          onChange={(e) => handleUpdateItemPrice(idx, Number(e.target.value))}
                          className="w-18 px-2 py-1 text-right font-bold text-xs rounded-lg border border-gray-200 focus:border-[#E76F51] focus:outline-none"
                          title="একক মূল্য পরিবর্তন করুন"
                        />
                      </div>

                      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                        <button
                          type="button"
                          onClick={() => handleUpdateItemQuantity(idx, it.quantity - 1)}
                          className="px-2 py-0.5 hover:bg-gray-200 font-bold text-xs"
                        >
                          -
                        </button>
                        <span className="px-2 font-bold text-xs text-gray-800">{it.quantity}</span>
                        <button
                          type="button"
                          onClick={() => handleUpdateItemQuantity(idx, it.quantity + 1)}
                          className="px-2 py-0.5 hover:bg-gray-200 font-bold text-xs"
                        >
                          +
                        </button>
                      </div>

                      <span className="font-black text-emerald-700 text-xs w-16 text-right">
                        ৳{it.price * it.quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        className="p-1 rounded-lg text-rose-500 hover:bg-rose-50 cursor-pointer"
                        title="বাতিল"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 italic text-center py-2 bg-white rounded-xl border border-dashed border-gray-200">
                কোনো খেলনা নির্বাচন করা হয়নি (ডিফল্ট মূল্য রাখা হবে অথবা উপর থেকে খেলনা যোগ করুন)
              </p>
            )}

            {/* Financial Calculations */}
            <div className="pt-2 border-t border-gray-200/80 space-y-2">
              <div className="flex items-center justify-between text-gray-600">
                <span>পণ্যসমূহের মোট মূল্য (Subtotal):</span>
                <span className="font-bold text-gray-900">৳{itemsSubtotal}</span>
              </div>
              <div className="flex items-center justify-between text-gray-600">
                <span className="flex items-center gap-1">
                  <span>ডেলিভারি চার্জ ({district === 'ঢাকা' ? 'ঢাকার ভেতরে ৳৭০' : 'ঢাকার বাইরে ৳১৩০'}):</span>
                </span>
                <div className="flex items-center gap-1">
                  <span>৳</span>
                  <input
                    type="number"
                    value={deliveryFee}
                    onChange={(e) => setDeliveryFee(Number(e.target.value) || 0)}
                    className="w-16 px-2 py-1 text-right font-bold rounded-lg border border-gray-200 bg-white"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between text-gray-600">
                <span>বিশেষ ছাড় / ডিসকাউন্ট (যদি থাকে):</span>
                <div className="flex items-center gap-1">
                  <span>৳</span>
                  <input
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value) || 0)}
                    className="w-16 px-2 py-1 text-right font-bold rounded-lg border border-gray-200 bg-white"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between text-sm font-black pt-2 border-t border-gray-200 text-gray-900">
                <span>সর্বমোট পরিশোধযোগ্য মূল্য:</span>
                <span className="text-base text-emerald-700">৳{totalAmount}</span>
              </div>
            </div>
          </div>

          {/* Section 3: Notes & Text Editor */}
          <div className="space-y-2 bg-gray-50/80 p-4 rounded-2xl border border-gray-100">
            <label className="block font-extrabold text-gray-900 uppercase tracking-wider text-amber-800">
              ৩. কাস্টমার নোট ও বিশেষ নির্দেশনা (Notes Editor)
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="বাচ্চার বয়স, প্রিয় খেলনা, পূর্ববর্তী পছন্দ, বিশেষ কোনো উপহার নির্দেশনা বা ফলোআপ লিখে রাখুন..."
              className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-amber-500 bg-white font-medium"
            />
          </div>

          {/* Section 4: Google Sheets Sync Option */}
          <div className="p-3.5 bg-blue-50/80 rounded-2xl border border-blue-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className={`w-5 h-5 ${syncGoogleSheets ? 'text-blue-600' : 'text-gray-400'}`} />
              <div>
                <p className="font-extrabold text-blue-950">গুগল শিট ডাটাবেজে সিঙ্ক করুন (Live Sheets Database)</p>
                <p className="text-[11px] text-blue-800">
                  অর্ডারটি সরাসরি আপনার লাইভ গুগল স্প্রেডশিটে ব্যাকআপ হিসেবে যোগ হয়ে যাবে
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={syncGoogleSheets}
                onChange={(e) => setSyncGoogleSheets(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Modal Bottom Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100 shrink-0">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-bold text-xs hover:bg-gray-50 transition-colors cursor-pointer"
            >
              বাতিল
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-[#E76F51] hover:from-emerald-700 hover:to-[#D45A3D] text-white font-black text-xs shadow-md transition-all cursor-pointer flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>সংরক্ষণ ও শিটে সিঙ্ক হচ্ছে...</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>{isRepeatOrderMode ? 'রিপিট অর্ডার সংরক্ষণ করুন' : 'কাস্টমার সংরক্ষণ করুন'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
