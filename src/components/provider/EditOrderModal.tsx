import React, { useState } from 'react';
import { X, Save, RefreshCw, User, Phone, MapPin, ShoppingBag, Plus, Trash2 } from 'lucide-react';
import type { AdminOrder, OrderStatus } from '../../types/admin';

interface OrderItemEdit {
  id?: string;
  productId?: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface EditOrderModalProps {
  order: AdminOrder;
  products?: any[];
  onClose: () => void;
  onSave: (orderId: string, updatedPayload: Partial<AdminOrder>) => Promise<void>;
}

export const EditOrderModal: React.FC<EditOrderModalProps> = ({ 
  order, 
  products = [], 
  onClose, 
  onSave 
}) => {
  const [customerName, setCustomerName] = useState<string>(
    order.customer?.name || order.deliveryAddress?.fullName || ''
  );
  const [customerPhone, setCustomerPhone] = useState<string>(
    order.customer?.phone || order.deliveryAddress?.phone || ''
  );
  const [streetAddress, setStreetAddress] = useState<string>(
    order.deliveryAddress?.streetAddress || ''
  );
  const [district, setDistrict] = useState<string>(
    order.deliveryAddress?.district || 'ঢাকা'
  );
  const [deliveryZone, setDeliveryZone] = useState<'inside-dhaka' | 'outside-dhaka'>(
    order.deliveryAddress?.deliveryZone === 'outside-dhaka' ? 'outside-dhaka' : 'inside-dhaka'
  );

  // Items State (supports customizing name, price, quantity)
  const [items, setItems] = useState<OrderItemEdit[]>(() => {
    if (Array.isArray(order.items) && order.items.length > 0) {
      return order.items.map((it: any, idx: number) => ({
        id: it.id || it.productId || `item_${idx}`,
        productId: it.productId || it.id || `prod_${idx}`,
        name: it.name || 'পণ্য',
        price: Number(it.price) || 0,
        quantity: Number(it.quantity) || 1,
        image: it.image || ''
      }));
    }
    return [
      {
        id: 'item_default',
        productId: 'toy_custom',
        name: 'গ্রাহকের পছন্দকৃত খেলনা',
        price: Number(order.subtotal) || Number(order.total) || 850,
        quantity: 1,
        image: ''
      }
    ];
  });

  // Adding new product to this order
  const [selectedCatalogId, setSelectedCatalogId] = useState<string>('');
  const [showCustomAdd, setShowCustomAdd] = useState<boolean>(false);
  const [customName, setCustomName] = useState<string>('');
  const [customPrice, setCustomPrice] = useState<number>(0);

  // Financials
  const [deliveryFee, setDeliveryFee] = useState<number>(
    order.deliveryFee !== undefined ? Number(order.deliveryFee) : (deliveryZone === 'inside-dhaka' ? 70 : 130)
  );
  const [discount, setDiscount] = useState<number>(Number(order.discount) || 0);
  const [status, setStatus] = useState<OrderStatus>(order.status || 'pending');
  const [notes, setNotes] = useState<string>(order.notes || '');
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Calculations
  const itemsSubtotal = items.reduce((sum, it) => sum + (Number(it.price) * Number(it.quantity)), 0);
  const totalAmount = Math.max(0, itemsSubtotal + Number(deliveryFee) - Number(discount));

  // Item modifications
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

  const handleUpdateItemQuantity = (index: number, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(index);
      return;
    }
    const updated = [...items];
    updated[index].quantity = newQty;
    setItems(updated);
  };

  const handleRemoveItem = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  // Add from catalog
  const handleAddCatalogProduct = () => {
    if (!selectedCatalogId) return;
    const prod = products.find(p => p.id === selectedCatalogId);
    if (!prod) return;

    setItems(prev => [
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

  // Add custom toy
  const handleAddCustomItem = () => {
    if (!customName.trim()) return;
    setItems(prev => [
      ...prev,
      {
        id: `it_custom_${Date.now()}`,
        productId: `custom_${Date.now()}`,
        name: customName.trim(),
        price: Number(customPrice) || 0,
        quantity: 1
      }
    ]);
    setCustomName('');
    setCustomPrice(0);
    setShowCustomAdd(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const sanitizedItems = items.map(it => ({
        id: it.id || it.productId,
        productId: it.productId,
        name: it.name.trim(),
        price: Number(it.price) || 0,
        quantity: Number(it.quantity) || 1,
        total: (Number(it.price) || 0) * (Number(it.quantity) || 1),
        image: it.image || ''
      }));

      const payload: Partial<AdminOrder> = {
        customer: {
          ...order.customer,
          name: customerName.trim(),
          phone: customerPhone.trim()
        },
        deliveryAddress: {
          ...order.deliveryAddress,
          fullName: customerName.trim(),
          phone: customerPhone.trim(),
          streetAddress: streetAddress.trim(),
          district: district.trim(),
          deliveryZone
        },
        items: sanitizedItems as any,
        subtotal: itemsSubtotal,
        deliveryFee: Number(deliveryFee),
        discount: Number(discount),
        total: totalAmount,
        status,
        notes: notes.trim()
      };

      await onSave(order.id, payload);
      onClose();
    } catch (err) {
      console.error('Failed to update order:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-gray-100 space-y-6 my-auto relative animate-in zoom-in-95 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4 shrink-0">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-[#E76F51]">
              অর্ডার তথ্য ও পণ্য পরিবর্তন / সম্পূর্ণ এডিট
            </span>
            <h3 className="text-lg sm:text-xl font-black text-gray-900">
              অর্ডার #{order.orderNumber}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center font-bold cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body - Scrollable */}
        <form onSubmit={handleSubmit} className="space-y-5 overflow-y-auto pr-1 flex-1">
          {/* Customer Name & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                গ্রাহকের নাম
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:border-[#E76F51]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                মোবাইল নম্বর
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:border-[#E76F51]"
                />
              </div>
            </div>
          </div>

          {/* Delivery Street Address & District */}
          <div className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                ডেলিভারি ঠিকানা (বাসা/রোড/এলাকা)
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:border-[#E76F51]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  জেলা
                </label>
                <input
                  type="text"
                  required
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:border-[#E76F51]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  ডেলিভারি জোন
                </label>
                <select
                  value={deliveryZone}
                  onChange={(e) => {
                    const zone = e.target.value as 'inside-dhaka' | 'outside-dhaka';
                    setDeliveryZone(zone);
                    setDeliveryFee(zone === 'inside-dhaka' ? 70 : 130);
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold focus:outline-none focus:border-[#E76F51] bg-white cursor-pointer"
                >
                  <option value="inside-dhaka">ঢাকার ভিতরে (৳৭০)</option>
                  <option value="outside-dhaka">ঢাকার বাইরে (৳১৩০)</option>
                </select>
              </div>
            </div>
          </div>

          {/* ORDER ITEMS SECTION (Fully Customizable: Name, Price, Quantity) */}
          <div className="p-4 bg-orange-50/40 rounded-2xl border border-orange-200/70 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-gray-800 flex items-center gap-1.5">
                <ShoppingBag className="w-4 h-4 text-[#E76F51]" />
                <span>অর্ডারকৃত পণ্যসমূহ ({items.length}টি)</span>
              </span>
              <button
                type="button"
                onClick={() => setShowCustomAdd(!showCustomAdd)}
                className="text-[11px] font-bold text-[#E76F51] hover:underline cursor-pointer"
              >
                {showCustomAdd ? 'ক্যাটালগ থেকে বাছুন' : '+ কাস্টম পণ্য লিখুন'}
              </button>
            </div>

            {/* Add Item Controls */}
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
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="খেলনার নাম (যেমন: কাঠের কিউব সেট)"
                  className="flex-1 min-w-[170px] px-3 py-1.5 rounded-lg border border-gray-200 text-xs focus:outline-none focus:border-[#E76F51]"
                />
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-500 font-bold">৳</span>
                  <input
                    type="number"
                    value={customPrice || ''}
                    onChange={(e) => setCustomPrice(Number(e.target.value))}
                    placeholder="মূল্য"
                    className="w-20 px-2 py-1.5 rounded-lg border border-gray-200 text-xs focus:outline-none font-bold"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddCustomItem}
                  disabled={!customName.trim()}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer disabled:opacity-40 shrink-0"
                >
                  যোগ করুন
                </button>
              </div>
            )}

            {/* Items List Table / Cards */}
            <div className="space-y-2 pt-1">
              {items.length === 0 ? (
                <p className="text-xs text-gray-400 italic text-center py-3 bg-white rounded-xl border border-dashed border-gray-200">
                  কোনো পণ্য তালিকায় নেই। উপর থেকে পণ্য যোগ করুন।
                </p>
              ) : (
                items.map((it, idx) => (
                  <div
                    key={it.id || idx}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-3 bg-white rounded-xl border border-gray-200 shadow-2xs"
                  >
                    {/* Item Thumbnail & Name Input */}
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

                    {/* Price, Quantity, Line Total & Delete */}
                    <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                      {/* Editable Unit Price */}
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

                      {/* Quantity Controls */}
                      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                        <button
                          type="button"
                          onClick={() => handleUpdateItemQuantity(idx, it.quantity - 1)}
                          className="px-2 py-0.5 hover:bg-gray-200 font-bold text-xs"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-bold text-gray-800">{it.quantity}</span>
                        <button
                          type="button"
                          onClick={() => handleUpdateItemQuantity(idx, it.quantity + 1)}
                          className="px-2 py-0.5 hover:bg-gray-200 font-bold text-xs"
                        >
                          +
                        </button>
                      </div>

                      {/* Subtotal */}
                      <span className="font-black text-emerald-700 text-xs w-16 text-right">
                        ৳{Number(it.price) * Number(it.quantity)}
                      </span>

                      {/* Remove */}
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
          </div>

          {/* Pricing Summary & Status */}
          <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200/80 space-y-2.5">
            <div className="flex items-center justify-between text-xs text-gray-600">
              <span>পণ্যসমূহের সাব-টোটাল (Subtotal):</span>
              <span className="font-bold text-gray-900">৳{itemsSubtotal}</span>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-600">
              <span>ডেলিভারি চার্জ:</span>
              <div className="flex items-center gap-1">
                <span>৳</span>
                <input
                  type="number"
                  value={deliveryFee}
                  onChange={(e) => setDeliveryFee(Number(e.target.value))}
                  className="w-18 px-2 py-1 text-right font-bold text-xs rounded-lg border border-gray-200 bg-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-600">
              <span>বিশেষ ছাড় / ডিসকাউন্ট:</span>
              <div className="flex items-center gap-1">
                <span>৳</span>
                <input
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  className="w-18 px-2 py-1 text-right font-bold text-xs rounded-lg border border-gray-200 bg-white text-rose-600"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-gray-200 flex items-center justify-between text-xs sm:text-sm font-black">
              <span className="text-gray-800">সর্বমোট প্রদেয় মূল্য (Total Amount):</span>
              <span className="text-emerald-700 text-base">৳{totalAmount}</span>
            </div>
          </div>

          {/* Status & Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                অর্ডার স্ট্যাটাস
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as OrderStatus)}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs font-bold bg-white text-gray-800 focus:outline-none focus:border-[#E76F51] cursor-pointer"
              >
                <option value="pending">অপেক্ষমান (Pending)</option>
                <option value="confirmed">নিশ্চিত (Confirmed)</option>
                <option value="processing">প্যাকেজিং (Processing)</option>
                <option value="shipped">ডেলিভারিতে (Shipped)</option>
                <option value="delivered">সম্পন্ন (Delivered)</option>
                <option value="cancelled">বাতিল (Cancelled)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                প্রোভাইডার নোট / মন্তব্য
              </label>
              <textarea
                rows={1}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="অর্ডার বা কাস্টমার সম্পর্কে বিশেষ তথ্য..."
                className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#E76F51]"
              />
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
              className="px-5 py-2.5 rounded-xl bg-[#E76F51] hover:bg-[#D45A3D] text-white font-black text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>{isSaving ? 'সংরক্ষণ হচ্ছে...' : 'পরিবর্তন সংরক্ষণ করুন'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
