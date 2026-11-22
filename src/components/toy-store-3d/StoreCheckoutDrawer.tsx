import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, ShoppingBag, Plus, Minus, Trash2, ShieldCheck, 
  ArrowRight, AlertCircle, Phone, MapPin, User 
} from 'lucide-react';
import { orderService } from '../../services';

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  quantity: number;
}

interface StoreCheckoutDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: Record<string, CartItem>;
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onOrderSuccess: (orderData: any) => void;
}

export const StoreCheckoutDrawer: React.FC<StoreCheckoutDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onOrderSuccess,
}) => {
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [streetAddress, setStreetAddress] = useState<string>('');
  const [district, setDistrict] = useState<string>('ঢাকা');
  const [deliveryZone, setDeliveryZone] = useState<'inside-dhaka' | 'outside-dhaka'>('inside-dhaka');
  const [customerNote, setCustomerNote] = useState<string>('');

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formError, setFormError] = useState<string>('');

  const itemsList = Object.values(cart);
  const itemCount = itemsList.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = itemsList.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryCharge = deliveryZone === 'inside-dhaka' ? 80 : 150;
  const grandTotal = subtotal + deliveryCharge;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (itemsList.length === 0) {
      setFormError('আপনার বাস্কেটে কোনো খেলনা যোগ করা নেই।');
      return;
    }

    if (!customerName.trim()) {
      setFormError('অনুগ্রহ করে আপনার পুরো নাম লিখুন।');
      return;
    }

    const cleanedPhone = customerPhone.replace(/\D/g, '');
    if (!cleanedPhone.startsWith('01') || cleanedPhone.length !== 11) {
      setFormError('সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 017XXXXXXXX)');
      return;
    }

    if (!streetAddress.trim() || streetAddress.trim().length < 6) {
      setFormError('অনুগ্রহ করে আপনার বিস্তারিত ডেলিভারি ঠিকানা লিখুন (বাসা/রোড/এলাকা)।');
      return;
    }

    setIsSubmitting(true);
    try {
      const orderPayload: any = {
        orderNumber: `GK-3D-${Date.now().toString().slice(-6)}`,
        items: itemsList.map((item) => ({
          productId: item.productId,
          title: item.name,
          quantity: item.quantity,
          price: item.price,
          total: item.price * item.quantity,
          image: item.image,
        })),
        customer: {
          name: customerName.trim(),
          phone: cleanedPhone,
          address: {
            street: streetAddress.trim(),
            city: district.trim(),
            district: district.trim(),
            deliveryZone: deliveryZone === 'inside-dhaka' ? 'ঢাকা সিটি' : 'ঢাকার বাইরে',
          },
        },
        shippingAddress: {
          name: customerName.trim(),
          phone: cleanedPhone,
          street: streetAddress.trim(),
          city: district.trim(),
          district: district.trim(),
        },
        subtotal,
        shipping: deliveryCharge,
        deliveryCharge,
        discount: 0,
        total: grandTotal,
        paymentMethod: 'cash_on_delivery',
        paymentStatus: 'cod_pending',
        status: 'pending',
        notes: customerNote.trim() || 'GrowKins 3D Virtual Toy Store Order',
      };

      const res = await orderService.create(orderPayload);
      const saved = res.data || orderPayload;

      onOrderSuccess({
        ...saved,
        orderNumber: saved.orderNumber || orderPayload.orderNumber,
        items: itemsList,
        total: grandTotal,
        deliveryCharge,
        customerName: customerName.trim(),
        customerPhone: cleanedPhone,
        address: `${streetAddress.trim()}, ${district.trim()}`,
      });
    } catch (err) {
      console.error('3D Store Order submission failed:', err);
      setFormError('অর্ডার সাবমিট করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 cursor-pointer"
            onClick={onClose}
          />

          {/* Sliding Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-lg bg-[#FAF7F1] z-50 shadow-2xl flex flex-col justify-between border-l border-[#E8E0D2] overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 sm:p-5 bg-white border-b border-[#E8E0D2] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#E76F51]/10 text-[#E76F51] flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-[#24221F]">
                    আপনার শপিং বাস্কেট
                  </h3>
                  <p className="text-xs text-gray-500 font-semibold">
                    মোট {itemCount}টি খেলনা নির্বাচিত হয়েছে
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6">
              {/* Items List */}
              {itemsList.length === 0 ? (
                <div className="py-12 text-center space-y-3">
                  <div className="w-16 h-16 rounded-3xl bg-amber-50 mx-auto flex items-center justify-center text-3xl">
                    🧸
                  </div>
                  <h4 className="text-base font-black text-gray-800">
                    আপনার বাস্কেট এখনো খালি!
                  </h4>
                  <p className="text-xs text-gray-500 max-w-xs mx-auto">
                    দোকানের সেলফ থেকে যেকোনো খেলনায় ক্লিক করে "বাস্কেটে রাখুন" বোতাম চাপুন।
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <span className="text-xs font-black text-gray-500 uppercase tracking-wider">
                    নির্বাচিত খেলনাসমূহ:
                  </span>
                  {itemsList.map((item) => (
                    <div
                      key={item.productId}
                      className="p-3 bg-white rounded-2xl border border-[#E8E0D2] flex items-center gap-3 shadow-sm"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 rounded-xl object-cover bg-amber-50 shrink-0 border border-amber-100"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs sm:text-sm font-black text-[#24221F] truncate">
                          {item.name}
                        </h4>
                        <div className="text-xs font-black text-[#E76F51] mt-0.5">
                          ৳{item.price}{' '}
                          <span className="text-[10px] text-gray-600 line-through font-normal">
                            ৳{item.originalPrice}
                          </span>
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.productId, -1)}
                          className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-black text-[#24221F] w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.productId, 1)}
                          className="w-7 h-7 rounded-lg bg-[#E76F51] text-white flex items-center justify-center cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onRemoveItem(item.productId)}
                          className="w-7 h-7 rounded-lg text-rose-500 hover:bg-rose-50 flex items-center justify-center ml-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Fast Checkout Form */}
              {itemsList.length > 0 && (
                <form id="checkout-drawer-form" onSubmit={handleSubmitOrder} className="space-y-4 pt-4 border-t border-[#E8E0D2]">
                  <span className="text-xs font-black text-gray-500 uppercase tracking-wider block">
                    ক্যাশ অন ডেলিভারি তথ্য:
                  </span>

                  {formError && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{formError}</span>
                    </div>
                  )}

                  {/* Customer Name */}
                  <div>
                    <label className="block text-xs font-black text-gray-700 mb-1">
                      আপনার নাম <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-gray-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="যেমন: ফারিয়া ইসলাম"
                        className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-[#E8E0D2] rounded-xl text-xs sm:text-sm font-semibold focus:outline-none focus:border-[#E76F51]"
                      />
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-xs font-black text-gray-700 mb-1">
                      মোবাইল নম্বর <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-gray-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        required
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="01XXXXXXXXX"
                        className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-[#E8E0D2] rounded-xl text-xs sm:text-sm font-semibold focus:outline-none focus:border-[#E76F51]"
                      />
                    </div>
                  </div>

                  {/* Delivery Location Selection */}
                  <div>
                    <label className="block text-xs font-black text-gray-700 mb-1.5">
                      ডেলিভারি এরিয়া নির্বাচন করুন
                    </label>
                    <div className="grid grid-cols-2 gap-2.5">
                      <label
                        className={`p-3 rounded-xl border cursor-pointer text-center transition-all ${
                          deliveryZone === 'inside-dhaka'
                            ? 'border-[#2D6A4F] bg-[#2D6A4F]/10 text-[#2D6A4F] font-black ring-1 ring-[#2D6A4F]'
                            : 'border-[#E8E0D2] bg-white text-gray-700 font-semibold'
                        }`}
                      >
                        <input
                          type="radio"
                          name="deliveryZone"
                          className="sr-only"
                          checked={deliveryZone === 'inside-dhaka'}
                          onChange={() => setDeliveryZone('inside-dhaka')}
                        />
                        <div className="text-xs">ঢাকা সিটির ভেতর</div>
                        <div className="text-xs font-black mt-0.5">৳৮০</div>
                      </label>

                      <label
                        className={`p-3 rounded-xl border cursor-pointer text-center transition-all ${
                          deliveryZone === 'outside-dhaka'
                            ? 'border-[#2D6A4F] bg-[#2D6A4F]/10 text-[#2D6A4F] font-black ring-1 ring-[#2D6A4F]'
                            : 'border-[#E8E0D2] bg-white text-gray-700 font-semibold'
                        }`}
                      >
                        <input
                          type="radio"
                          name="deliveryZone"
                          className="sr-only"
                          checked={deliveryZone === 'outside-dhaka'}
                          onChange={() => setDeliveryZone('outside-dhaka')}
                        />
                        <div className="text-xs">ঢাকার বাইরে</div>
                        <div className="text-xs font-black mt-0.5">৳১৫০</div>
                      </label>
                    </div>
                  </div>

                  {/* District / City */}
                  {deliveryZone === 'outside-dhaka' && (
                    <div>
                      <label className="block text-xs font-black text-gray-700 mb-1">
                        জেলা ও থানার নাম <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        placeholder="যেমন: চট্টগ্রাম, খুলনা, সিলেট ইত্যাদি"
                        className="w-full px-3.5 py-2.5 bg-white border border-[#E8E0D2] rounded-xl text-xs sm:text-sm font-semibold focus:outline-none focus:border-[#E76F51]"
                      />
                    </div>
                  )}

                  {/* Street Address */}
                  <div>
                    <label className="block text-xs font-black text-gray-700 mb-1">
                      সম্পূর্ণ ডেলিভারি ঠিকানা <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-gray-600 absolute left-3.5 top-3" />
                      <textarea
                        required
                        rows={2}
                        value={streetAddress}
                        onChange={(e) => setStreetAddress(e.target.value)}
                        placeholder="বাসা নম্বর, রোড নম্বর, এলাকা ও থানার নাম"
                        className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-[#E8E0D2] rounded-xl text-xs sm:text-sm font-semibold focus:outline-none focus:border-[#E76F51]"
                      />
                    </div>
                  </div>

                  {/* Customer Note (Optional) */}
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">
                      বিশেষ কোনো নির্দেশনা (ঐচ্ছিক)
                    </label>
                    <input
                      type="text"
                      value={customerNote}
                      onChange={(e) => setCustomerNote(e.target.value)}
                      placeholder="যেমন: বিকেলে ডেলিভারি দিলে ভালো হয়"
                      className="w-full px-3.5 py-2 bg-white border border-[#E8E0D2] rounded-xl text-xs font-semibold focus:outline-none focus:border-[#E76F51]"
                    />
                  </div>
                </form>
              )}
            </div>

            {/* Sticky Bottom Actions */}
            {itemsList.length > 0 && (
              <div className="p-4 sm:p-5 bg-white border-t border-[#E8E0D2] space-y-3">
                <div className="space-y-1.5 text-xs font-bold text-gray-600">
                  <div className="flex justify-between">
                    <span>পণ্যের মূল্য:</span>
                    <span>৳{subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ডেলিভারি চার্জ:</span>
                    <span>৳{deliveryCharge}</span>
                  </div>
                  <div className="flex justify-between text-base font-black text-[#24221F] pt-1.5 border-t border-gray-100">
                    <span>সর্বমোট প্রদেয় মূল্য:</span>
                    <span className="text-[#E76F51]">৳{grandTotal}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  form="checkout-drawer-form"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#E76F51] to-[#F4A261] text-white font-black text-sm sm:text-base shadow-xl hover:shadow-2xl hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <span>অর্ডার নিশ্চিত করা হচ্ছে...</span>
                  ) : (
                    <>
                      <span>অর্ডার নিশ্চিত করুন (ক্যাশ অন ডেলিভারি)</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-2 text-[11px] text-gray-500 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>পণ্য হাতে পেয়ে মূল্য পরিশোধ করার ১০০% নিশ্চয়তা</span>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
