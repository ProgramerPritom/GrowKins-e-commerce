import React, { useState } from 'react';
import { X, Save, RefreshCw, User, Phone, MapPin } from 'lucide-react';
import type { AdminOrder, OrderStatus } from '../../types/admin';

interface EditOrderModalProps {
  order: AdminOrder;
  onClose: () => void;
  onSave: (orderId: string, updatedPayload: Partial<AdminOrder>) => Promise<void>;
}

export const EditOrderModal: React.FC<EditOrderModalProps> = ({ order, onClose, onSave }) => {
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
  const [deliveryFee, setDeliveryFee] = useState<number>(Number(order.deliveryFee) || 70);
  const [total, setTotal] = useState<number>(Number(order.total) || 0);
  const [status, setStatus] = useState<OrderStatus>(order.status || 'pending');
  const [notes, setNotes] = useState<string>(order.notes || '');
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
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
        deliveryFee: Number(deliveryFee),
        total: Number(total),
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
        className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-gray-100 space-y-6 my-auto relative animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-[#E76F51]">
              অর্ডার তথ্য পরিবর্তন / মডিফাই
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
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

          {/* Pricing & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                ডেলিভারি চার্জ (৳)
              </label>
              <input
                type="number"
                value={deliveryFee}
                onChange={(e) => setDeliveryFee(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold focus:outline-none focus:border-[#E76F51]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                সর্বমোট প্রদেয় (৳)
              </label>
              <input
                type="number"
                value={total}
                onChange={(e) => setTotal(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-black text-emerald-800 focus:outline-none focus:border-[#E76F51]"
              />
            </div>

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
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              প্রোভাইডার নোট / মন্তব্য
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="অর্ডার বা কাস্টমার সম্পর্কে বিশেষ তথ্য..."
              className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#E76F51]"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2.5">
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
