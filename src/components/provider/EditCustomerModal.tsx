import React, { useState } from 'react';
import { X, Save, RefreshCw, User, Globe, ShoppingBag, Plus, Trash2 } from 'lucide-react';
import type { AdminOrder } from '../../types/admin';

interface EditCustomerModalProps {
  customer: {
    phone: string;
    name: string;
    streetAddress: string;
    district: string;
    facebookUrl: string;
    notes: string;
    tag: 'new' | 'repeat' | 'vip';
    orders: AdminOrder[];
    itemsBought: { id?: string; name: string; quantity: number; price: number; image?: string }[];
  };
  products?: any[];
  onClose: () => void;
  onSaveCustomer: (updatedCustomer: {
    phone: string;
    name: string;
    streetAddress: string;
    district: string;
    facebookUrl: string;
    notes: string;
    tag: 'new' | 'repeat' | 'vip';
  }) => Promise<void>;
  onUpdateOrder: (orderId: string, payload: Partial<AdminOrder>) => Promise<void>;
}

export const EditCustomerModal: React.FC<EditCustomerModalProps> = ({
  customer,
  products = [],
  onClose,
  onSaveCustomer,
  onUpdateOrder
}) => {
  // Customer profile state
  const [name, setName] = useState<string>(customer.name || '');
  const [phone] = useState<string>(customer.phone || '');
  const [streetAddress, setStreetAddress] = useState<string>(customer.streetAddress || '');
  const [district, setDistrict] = useState<string>(customer.district || 'ঢাকা');
  const [facebookUrl, setFacebookUrl] = useState<string>(customer.facebookUrl || '');
  const [notes, setNotes] = useState<string>(customer.notes || '');
  const [tag, setTag] = useState<'new' | 'repeat' | 'vip'>(customer.tag || 'new');

  // Selected Order for items modification
  const customerOrders = customer.orders || [];
  const [selectedOrderId, setSelectedOrderId] = useState<string>(() => {
    return customerOrders[0]?.id || '';
  });

  const activeOrder = customerOrders.find(o => o.id === selectedOrderId) || customerOrders[0] || null;

  // Items State for the currently selected order
  const [orderItems, setOrderItems] = useState<{
    id?: string;
    productId?: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
  }[]>(() => {
    if (activeOrder && Array.isArray(activeOrder.items) && activeOrder.items.length > 0) {
      return activeOrder.items.map((it: any, idx: number) => ({
        id: it.id || it.productId || `it_${idx}`,
        productId: it.productId || it.id || `prod_${idx}`,
        name: it.name || 'খেলনা পণ্য',
        price: Number(it.price) || 0,
        quantity: Number(it.quantity) || 1,
        image: it.image || ''
      }));
    }
    return [];
  });

  // Adding product to active order
  const [selectedCatalogId, setSelectedCatalogId] = useState<string>('');
  const [showCustomAdd, setShowCustomAdd] = useState<boolean>(false);
  const [customItemName, setCustomItemName] = useState<string>('');
  const [customItemPrice, setCustomItemPrice] = useState<number>(0);

  // Delivery & financials for active order
  const [deliveryFee, setDeliveryFee] = useState<number>(() => {
    return activeOrder?.deliveryFee !== undefined ? Number(activeOrder.deliveryFee) : (district === 'ঢাকা' ? 70 : 130);
  });
  const [discount, setDiscount] = useState<number>(() => {
    return Number(activeOrder?.discount) || 0;
  });

  const [isSaving, setIsSaving] = useState<boolean>(false);

  // When selected order changes, reload its items
  const handleSelectOrder = (orderId: string) => {
    setSelectedOrderId(orderId);
    const target = customerOrders.find(o => o.id === orderId);
    if (target && Array.isArray(target.items)) {
      setOrderItems(target.items.map((it: any, idx: number) => ({
        id: it.id || it.productId || `it_${idx}`,
        productId: it.productId || it.id || `prod_${idx}`,
        name: it.name || 'খেলনা পণ্য',
        price: Number(it.price) || 0,
        quantity: Number(it.quantity) || 1,
        image: it.image || ''
      })));
      setDeliveryFee(target.deliveryFee !== undefined ? Number(target.deliveryFee) : 70);
      setDiscount(Number(target.discount) || 0);
    }
  };

  // Item adjustments
  const handleUpdateItemName = (idx: number, newName: string) => {
    const updated = [...orderItems];
    updated[idx].name = newName;
    setOrderItems(updated);
  };

  const handleUpdateItemPrice = (idx: number, newPrice: number) => {
    const updated = [...orderItems];
    updated[idx].price = Math.max(0, Number(newPrice) || 0);
    setOrderItems(updated);
  };

  const handleUpdateItemQty = (idx: number, newQty: number) => {
    if (newQty <= 0) {
      setOrderItems(prev => prev.filter((_, i) => i !== idx));
      return;
    }
    const updated = [...orderItems];
    updated[idx].quantity = newQty;
    setOrderItems(updated);
  };

  const handleRemoveItem = (idx: number) => {
    setOrderItems(prev => prev.filter((_, i) => i !== idx));
  };

  // Catalog item add
  const handleAddCatalogProduct = () => {
    if (!selectedCatalogId) return;
    const prod = products.find(p => p.id === selectedCatalogId);
    if (!prod) return;

    setOrderItems(prev => [
      ...prev,
      {
        id: `it_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        productId: prod.id,
        name: prod.title || prod.name,
        price: Number(prod.price) || 0,
        quantity: 1,
        image: prod.images?.[0] || prod.featuredImage || prod.image || ''
      }
    ]);
    setSelectedCatalogId('');
  };

  // Custom item add
  const handleAddCustomItem = () => {
    if (!customItemName.trim()) return;
    setOrderItems(prev => [
      ...prev,
      {
        id: `it_custom_${Date.now()}`,
        productId: `custom_${Date.now()}`,
        name: customItemName.trim(),
        price: Number(customItemPrice) || 0,
        quantity: 1
      }
    ]);
    setCustomItemName('');
    setCustomItemPrice(0);
    setShowCustomAdd(false);
  };

  // Calculations
  const itemsSubtotal = orderItems.reduce((sum, it) => sum + (Number(it.price) * Number(it.quantity)), 0);
  const totalAmount = Math.max(0, itemsSubtotal + Number(deliveryFee) - Number(discount));

  // Save everything
  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      // 1. Save customer personal metadata
      await onSaveCustomer({
        phone,
        name: name.trim(),
        streetAddress: streetAddress.trim(),
        district: district.trim(),
        facebookUrl: facebookUrl.trim(),
        notes: notes.trim(),
        tag
      });

      // 2. If an active order was modified, save order payload
      if (activeOrder && activeOrder.id) {
        const sanitizedItems = orderItems.map(it => ({
          id: it.id || it.productId,
          productId: it.productId,
          name: it.name.trim(),
          price: Number(it.price) || 0,
          quantity: Number(it.quantity) || 1,
          total: (Number(it.price) || 0) * (Number(it.quantity) || 1),
          image: it.image || ''
        }));

        await onUpdateOrder(activeOrder.id, {
          customer: {
            ...activeOrder.customer,
            name: name.trim(),
            phone
          },
          deliveryAddress: {
            ...activeOrder.deliveryAddress,
            fullName: name.trim(),
            phone,
            streetAddress: streetAddress.trim(),
            district: district.trim()
          },
          items: sanitizedItems as any,
          subtotal: itemsSubtotal,
          deliveryFee: Number(deliveryFee),
          discount: Number(discount),
          total: totalAmount,
          notes: notes.trim()
        });
      }

      onClose();
    } catch (err) {
      console.error('Failed to update customer and order:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in">
      <div 
        className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-gray-100 space-y-6 my-auto relative animate-in zoom-in-95 max-h-[94vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4 shrink-0">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600">
              কাস্টমার তথ্য ও অর্ডার এডিটর (CRM Database)
            </span>
            <h3 className="text-lg sm:text-xl font-black text-gray-900 flex items-center gap-2">
              <span>{name || 'কাস্টমার প্রোফাইল'}</span>
              <span className="text-xs font-bold text-gray-400">({phone})</span>
            </h3>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center font-bold cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSaveAll} className="space-y-5 overflow-y-auto pr-1 flex-1">
          {/* Section 1: Customer Personal Details */}
          <div className="p-4 bg-gray-50/80 rounded-2xl border border-gray-200/80 space-y-3.5">
            <h4 className="text-xs font-black text-gray-800 flex items-center gap-1.5 uppercase tracking-wider">
              <User className="w-3.5 h-3.5 text-[#E76F51]" />
              <span>১. কাস্টমার ব্যক্তিগত ও যোগাযোগের তথ্য</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  কাস্টমারের পুরো নাম
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:border-[#E76F51] bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  মোবাইল নম্বর (স্থির)
                </label>
                <input
                  type="text"
                  disabled
                  value={phone}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold bg-gray-100 text-gray-600 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  ডেলিভারি ঠিকানা
                </label>
                <input
                  type="text"
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  placeholder="বাসা / রোড / এলাকা"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:border-[#E76F51] bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  জেলা
                </label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:border-[#E76F51] bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-blue-600" />
                  <span>ফেসবুক প্রোফাইল বা পেজ লিংক (Facebook Profile URL)</span>
                </label>
                <input
                  type="url"
                  value={facebookUrl}
                  onChange={(e) => setFacebookUrl(e.target.value)}
                  placeholder="https://www.facebook.com/username"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-blue-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  কাস্টমার ক্যাটাগরি / ট্যাগ
                </label>
                <select
                  value={tag}
                  onChange={(e) => setTag(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold bg-white focus:outline-none focus:border-[#E76F51] cursor-pointer"
                >
                  <option value="new">🟢 নতুন কাস্টমার (New)</option>
                  <option value="repeat">⭐ নিয়মিত / রিপিট কাস্টমার (Repeat)</option>
                  <option value="vip">👑 ভিআইপি কাস্টমার (VIP Loyalty)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                কাস্টমার নোট / টেক্সট বিবরণ (যেকোনো মন্তব্য লিখে রাখুন)
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="কাস্টমার সম্পর্কে যেকোনো বিশেষ নোট যেমন: বাচ্চার বয়স, পছন্দ ইত্যাদি..."
                className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#E76F51] bg-white"
              />
            </div>
          </div>

          {/* Section 2: Order & Product Customizer */}
          <div className="p-4 bg-orange-50/50 rounded-2xl border border-orange-200/80 space-y-3.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h4 className="text-xs font-black text-gray-800 flex items-center gap-1.5 uppercase tracking-wider">
                <ShoppingBag className="w-3.5 h-3.5 text-[#E76F51]" />
                <span>২. অর্ডারকৃত খেলনাসমূহ ও মূল্য কাস্টমাইজেশন</span>
              </h4>

              {/* Order selector if customer has multiple orders */}
              {customerOrders.length > 1 && (
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="font-bold text-gray-600">অর্ডার নির্বাচন:</span>
                  <select
                    value={selectedOrderId}
                    onChange={(e) => handleSelectOrder(e.target.value)}
                    className="px-2.5 py-1 rounded-lg border border-gray-200 text-xs font-bold bg-white focus:outline-none"
                  >
                    {customerOrders.map(o => (
                      <option key={o.id} value={o.id}>
                        #{o.orderNumber} (৳{o.total})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Product Add Controls */}
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-gray-600">
                {activeOrder ? `অর্ডার #${activeOrder.orderNumber}-এর খেলনাসমূহ (${orderItems.length}টি):` : 'খেলনাসমূহ:'}
              </span>
              <button
                type="button"
                onClick={() => setShowCustomAdd(!showCustomAdd)}
                className="text-[11px] font-bold text-[#E76F51] hover:underline cursor-pointer"
              >
                {showCustomAdd ? 'ক্যাটালগ থেকে নির্বাচন করুন' : '+ কাস্টম খেলনা লিখুন'}
              </button>
            </div>

            {!showCustomAdd ? (
              <div className="flex items-center gap-2">
                <select
                  value={selectedCatalogId}
                  onChange={(e) => setSelectedCatalogId(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white focus:outline-none focus:border-[#E76F51]"
                >
                  <option value="">-- ক্যাটালগ থেকে খেলনা নির্বাচন করুন --</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name || p.title} — ৳{p.price}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleAddCatalogProduct}
                  disabled={!selectedCatalogId}
                  className="px-3.5 py-2 rounded-xl bg-[#E76F51] hover:bg-[#D45A3D] text-white font-bold text-xs flex items-center gap-1 cursor-pointer disabled:opacity-40 transition-colors shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>যোগ</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-2 p-2.5 bg-white rounded-xl border border-orange-200">
                <input
                  type="text"
                  value={customItemName}
                  onChange={(e) => setCustomItemName(e.target.value)}
                  placeholder="খেলনার নাম (যেমন: কাঠের ফ্রুট কাটিং সেট)"
                  className="flex-1 min-w-[170px] px-3 py-1.5 rounded-lg border border-gray-200 text-xs focus:outline-none focus:border-[#E76F51]"
                />
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-500 font-bold">৳</span>
                  <input
                    type="number"
                    value={customItemPrice || ''}
                    onChange={(e) => setCustomItemPrice(Number(e.target.value))}
                    placeholder="মূল্য"
                    className="w-20 px-2 py-1.5 rounded-lg border border-gray-200 text-xs focus:outline-none font-bold"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddCustomItem}
                  disabled={!customItemName.trim()}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer disabled:opacity-40 shrink-0"
                >
                  যোগ করুন
                </button>
              </div>
            )}

            {/* Order Items List */}
            <div className="space-y-2 pt-1">
              {orderItems.length === 0 ? (
                <p className="text-xs text-gray-400 italic text-center py-3 bg-white rounded-xl border border-dashed border-gray-200">
                  কোনো খেলনা নেই। উপর থেকে খেলনা যোগ করুন।
                </p>
              ) : (
                orderItems.map((it, idx) => (
                  <div
                    key={it.id || idx}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-3 bg-white rounded-xl border border-gray-200 shadow-2xs"
                  >
                    <div className="flex items-center gap-2.5 flex-1 min-w-0">
                      {it.image ? (
                        <img
                          src={it.image}
                          alt={it.name}
                          className="w-9 h-9 rounded-lg object-cover bg-gray-50 border shrink-0"
                          onError={(e) => { (e.target as any).style.display = 'none'; }}
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center text-xs font-black shrink-0">
                          {idx + 1}
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <input
                          type="text"
                          value={it.name}
                          onChange={(e) => handleUpdateItemName(idx, e.target.value)}
                          className="w-full text-xs font-bold text-gray-900 border-b border-dashed border-gray-300 focus:border-[#E76F51] focus:outline-none bg-transparent"
                          placeholder="পণ্যের নাম লিখুন"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                      {/* Custom Unit Price */}
                      <div className="flex items-center gap-1" title="এই খেলনাটির একক মূল্য কাস্টমাইজ করুন">
                        <span className="text-[11px] text-gray-500 font-bold">৳</span>
                        <input
                          type="number"
                          value={it.price}
                          onChange={(e) => handleUpdateItemPrice(idx, Number(e.target.value))}
                          className="w-18 px-2 py-1 text-right font-bold text-xs rounded-lg border border-gray-200 focus:border-[#E76F51] focus:outline-none"
                        />
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                        <button
                          type="button"
                          onClick={() => handleUpdateItemQty(idx, it.quantity - 1)}
                          className="px-2 py-0.5 hover:bg-gray-200 font-bold text-xs"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-bold text-gray-800">{it.quantity}</span>
                        <button
                          type="button"
                          onClick={() => handleUpdateItemQty(idx, it.quantity + 1)}
                          className="px-2 py-0.5 hover:bg-gray-200 font-bold text-xs"
                        >
                          +
                        </button>
                      </div>

                      {/* Subtotal */}
                      <span className="font-black text-emerald-700 text-xs w-16 text-right">
                        ৳{Number(it.price) * Number(it.quantity)}
                      </span>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        className="p-1 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="পণ্যটি মুছে ফেলুন"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Financial Summary */}
            <div className="p-3 bg-white rounded-xl border border-gray-200 space-y-2 text-xs">
              <div className="flex items-center justify-between text-gray-600">
                <span>পণ্যসমূহের মোট মূল্য (Subtotal):</span>
                <span className="font-bold text-gray-900">৳{itemsSubtotal}</span>
              </div>

              <div className="flex items-center justify-between text-gray-600">
                <span>ডেলিভারি চার্জ:</span>
                <div className="flex items-center gap-1">
                  <span>৳</span>
                  <input
                    type="number"
                    value={deliveryFee}
                    onChange={(e) => setDeliveryFee(Number(e.target.value))}
                    className="w-18 px-2 py-1 text-right font-bold text-xs rounded-lg border border-gray-200 bg-gray-50"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-gray-600">
                <span>বিশেষ ছাড় / ডিসকাউন্ট:</span>
                <div className="flex items-center gap-1">
                  <span>৳</span>
                  <input
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                    className="w-18 px-2 py-1 text-right font-bold text-xs rounded-lg border border-gray-200 bg-gray-50 text-rose-600"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-gray-100 flex items-center justify-between font-black text-sm">
                <span className="text-gray-800">সর্বমোট প্রদেয় মূল্য:</span>
                <span className="text-emerald-700 text-base">৳{totalAmount}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 cursor-pointer"
            >
              বাতিল
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>{isSaving ? 'সংরক্ষণ হচ্ছে...' : 'কাস্টমার ও অর্ডার আপডেট করুন'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
