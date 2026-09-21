import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../context/StoreContext';
import { 
  ArrowRight, Trash2, Plus, Minus, Gift, 
  PackageCheck, Sparkles, ShoppingBag 
} from 'lucide-react';

export const FullCartPage: React.FC = () => {
  const { 
    cartItems, 
    updateQuantity, 
    removeFromCart, 
    subtotal, 
    total, 
    isFreeShipping, 
    amountUntilFreeShipping, 
    isGift, 
    setIsGift, 
    giftRecipient, 
    setGiftRecipient, 
    giftMessage, 
    setGiftMessage, 
    setView,
    deliveryDetails,
    updateDeliveryDetails,
    deliveryFee
  } = useStore();

  if (cartItems.length === 0) {
    return (
      <div className="py-24 bg-[#FAF7F1] min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4 space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#FCF4DB] text-[#A67E14] flex items-center justify-center mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#24221F]">
            Your bag is currently empty.
          </h1>
          <p className="text-sm text-[#757169] leading-relaxed">
            Discover thoughtfully curated, screen-free Montessori toys crafted for curious minds and little hands.
          </p>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setView('shop')}
            className="px-8 py-3 rounded-full bg-[#24221F] text-white hover:bg-[#1C4CB8] text-xs font-bold transition-all shadow-md"
          >
            Explore the Play Shelf
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 sm:py-12 bg-[#FAF7F1] min-h-screen text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-[#757169] mb-4 sm:mb-6">
          <button onClick={() => setView('home')} className="hover:text-[#24221F] cursor-pointer">Home</button>
          <span>›</span>
          <span className="text-[#24221F] font-semibold">Shopping Bag</span>
        </nav>

        <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold text-[#24221F] mb-6 sm:mb-8">
          Your shopping bag
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 items-start">
          
          {/* Left Table / List of Cart Items */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* Free shipping alert */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-[#FAF3DE] border border-[#EADBB6] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1.5 sm:gap-0 text-xs font-semibold text-[#6C5311]">
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#A67E14] shrink-0" />
                <span>
                  {isFreeShipping 
                    ? "Congratulations! You have unlocked Free Nationwide Delivery across Bangladesh."
                    : `Add ৳${amountUntilFreeShipping.toFixed(0)} more to unlock Free Nationwide Delivery!`
                  }
                </span>
              </span>
              <span className="text-[11px] text-[#A67E14] font-normal sm:font-semibold shrink-0">Threshold: ৳2,500</span>
            </div>

            {/* Items */}
            <div className="space-y-3">
              <AnimatePresence>
                {cartItems.map((item) => (
                  <motion.div
                    key={item.id || item.product.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E8E0D2] shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4"
                  >
                    <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-[#FAF7F1] border border-[#E8E0D2] shrink-0">
                        <img
                          src={item.product.images.main}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        {item.variant ? (
                          <div className="flex items-center gap-1.5 mb-1">
                            {item.variant.color && (
                              <span className="text-[10px] font-medium text-[#757169] bg-[#F4EFE6] px-2 py-0.5 rounded">
                                {item.variant.color.name}
                              </span>
                            )}
                            {item.variant.size && (
                              <span className="text-[10px] font-bold text-[#C85A32] bg-[#FAF3EE] px-2 py-0.5 rounded border border-[#C85A32]/20">
                                {item.variant.size.label}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-[10px] font-mono text-[#757169] uppercase tracking-wider block">
                            {item.product.ageBadge}
                          </span>
                        )}
                        <h3 className="font-serif font-bold text-sm sm:text-base text-[#24221F] truncate">
                          {item.product.name}
                        </h3>
                        <p className="text-xs text-[#757169] mt-0.5 line-clamp-1">
                          {item.product.valueStatement || item.product.subtitle || ''}
                        </p>
                        <span className="text-xs font-semibold text-[#24221F] sm:hidden block mt-1 font-sans">
                          ৳{item.variant?.price || item.product.price} each
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between w-full sm:w-auto gap-4 sm:gap-6 pt-2.5 sm:pt-0 border-t sm:border-t-0 border-[#FAF7F1]">
                      <div className="flex items-center border border-[#D9D3C7] rounded-full px-2.5 sm:px-3 py-1 bg-[#FAF7F1]">
                        <motion.button
                          whileTap={{ scale: 0.85 }}
                          onClick={() => updateQuantity(item.id || item.product.id, -1)}
                          className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-[#757169] hover:text-[#24221F] cursor-pointer"
                        >
                          <Minus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        </motion.button>
                        <span className="w-6 sm:w-8 text-center font-bold text-xs sm:text-sm">
                          {item.quantity}
                        </span>
                        <motion.button
                          whileTap={{ scale: 0.85 }}
                          onClick={() => updateQuantity(item.id || item.product.id, 1)}
                          className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-[#757169] hover:text-[#24221F] cursor-pointer"
                        >
                          <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        </motion.button>
                      </div>

                      <div className="text-right">
                        <div className="font-bold text-sm sm:text-base text-[#24221F] font-sans">
                          ৳{(item.variant?.price || item.product.price) * item.quantity}
                        </div>
                        <div className="hidden sm:block text-[11px] text-[#A8A49C] font-sans">
                          ৳{item.variant?.price || item.product.price} each
                        </div>
                      </div>

                      <motion.button
                        whileTap={{ scale: 0.85 }}
                        onClick={() => removeFromCart(item.id || item.product.id)}
                        className="text-[#A8A49C] hover:text-[#D96F58] p-1.5 transition-colors cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Gift Options Box */}
            <div className="bg-white rounded-2xl p-4 sm:p-6 border border-[#E8E0D2] shadow-2xs space-y-4">
              <label className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-[#24221F] cursor-pointer">
                <input
                  type="checkbox"
                  checked={isGift}
                  onChange={(e) => setIsGift(e.target.checked)}
                  className="w-4 h-4 rounded text-[#1C4CB8] focus:ring-[#1C4CB8]"
                />
                <span className="flex items-center gap-2">
                  <Gift className="w-4 h-4 text-[#F28F79] shrink-0" /> This is a gift order (Gift note & packaging included)
                </span>
              </label>

              {isGift && (
                <div className="space-y-3 pt-2 animate-in fade-in duration-200">
                  <input
                    type="text"
                    placeholder="Recipient's Name (optional)"
                    value={giftRecipient}
                    onChange={(e) => setGiftRecipient(e.target.value)}
                    className="w-full text-xs sm:text-sm p-2.5 sm:p-3 rounded-xl border border-[#D9D3C7] bg-[#FAF7F1]"
                  />
                  <textarea
                    placeholder="Gift card message (e.g. 'Happy 3rd Birthday Ryan! Warm wishes from Khalamoni')"
                    value={giftMessage}
                    onChange={(e) => setGiftMessage(e.target.value)}
                    rows={2}
                    className="w-full text-xs sm:text-sm p-2.5 sm:p-3 rounded-xl border border-[#D9D3C7] bg-[#FAF7F1]"
                  />
                </div>
              )}
            </div>

          </div>

          {/* Right Summary Panel */}
          <div className="lg:col-span-4 bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-[#E8E0D2] shadow-sm space-y-5 sm:space-y-6">
            <h2 className="font-serif text-lg sm:text-xl font-bold text-[#24221F]">
              Order Summary
            </h2>

            {/* Delivery Zone Toggle */}
            <div className="p-3 rounded-2xl bg-[#FAF7F1] border border-[#E8E0D2] space-y-2 text-xs">
              <div className="font-semibold text-[#24221F] flex items-center justify-between">
                <span>Select Delivery Area:</span>
                <span className="text-[#1C4CB8] font-bold font-sans">
                  {deliveryDetails.deliveryZone === 'inside-dhaka' ? '৳70' : '৳130'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => updateDeliveryDetails({ deliveryZone: 'inside-dhaka', district: 'Dhaka' })}
                  className={`py-2 px-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                    deliveryDetails.deliveryZone === 'inside-dhaka'
                      ? 'bg-[#1C4CB8] text-white shadow-xs'
                      : 'bg-white text-[#24221F] border border-[#E8E0D2]'
                  }`}
                >
                  Inside Dhaka
                </button>
                <button
                  type="button"
                  onClick={() => updateDeliveryDetails({ deliveryZone: 'outside-dhaka', district: 'Chattogram' })}
                  className={`py-2 px-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                    deliveryDetails.deliveryZone === 'outside-dhaka'
                      ? 'bg-[#1C4CB8] text-white shadow-xs'
                      : 'bg-white text-[#24221F] border border-[#E8E0D2]'
                  }`}
                >
                  Outside Dhaka
                </button>
              </div>
            </div>

            <div className="space-y-2 text-xs sm:text-sm text-[#6E6A63]">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-semibold text-[#24221F] font-sans">৳{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Courier Delivery ({deliveryDetails.deliveryZone === 'inside-dhaka' ? 'Inside Dhaka' : 'Outside Dhaka'})</span>
                <span>{deliveryFee === 0 ? <strong className="text-[#4F7A5E]">FREE</strong> : `৳${deliveryFee}`}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-[#E8E0D2] text-base sm:text-lg font-bold text-[#24221F]">
                <span>Total Payable (COD)</span>
                <span className="font-sans">৳{total}</span>
              </div>
            </div>

            {/* Cash on Delivery Banner */}
            <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-[#FCF4DB] border border-[#F2E0B2] text-xs space-y-1">
              <div className="font-bold text-[#856404] flex items-center gap-1.5">
                <PackageCheck className="w-4 h-4 text-[#A67E14] shrink-0" />
                <span>Cash on Delivery Across Bangladesh</span>
              </div>
              <p className="text-[#5E4D1D] text-[11px] sm:text-xs">
                Zero advance payment needed. Inspect the parcel upon doorstep delivery before paying.
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setView('checkout')}
              className="w-full py-3.5 sm:py-4 px-4 rounded-full bg-[#24221F] text-white hover:bg-[#1C4CB8] text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-md transition-colors cursor-pointer"
            >
              <span>Proceed to Cash on Delivery Checkout</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </motion.button>

            <div className="text-center text-xs text-[#757169]">
              <button onClick={() => setView('shop')} className="hover:underline cursor-pointer">
                ← Keep shopping
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
