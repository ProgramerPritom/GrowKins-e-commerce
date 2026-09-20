import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../context/StoreContext';
import { useLanguage } from '../../context/LanguageContext';
import { PRODUCTS } from '../../data/products';
import { 
  X, Plus, Minus, Trash2, ArrowRight, 
  Sparkles, Gift, PackageCheck, ShoppingBag 
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const { 
    cartDrawerOpen, 
    setCartDrawerOpen, 
    cartItems, 
    updateQuantity, 
    removeFromCart, 
    subtotal, 
    total, 
    freeShippingThreshold, 
    isFreeShipping, 
    amountUntilFreeShipping, 
    isGift, 
    setIsGift, 
    giftRecipient, 
    setGiftRecipient, 
    giftMessage, 
    setGiftMessage, 
    addToCart, 
    setView,
    deliveryDetails,
    updateDeliveryDetails,
    deliveryFee
  } = useStore();

  const { t } = useLanguage();

  // Cross sell recommendation: pick item not in cart
  const crossSellProduct = PRODUCTS.find(p => !cartItems.some(item => item.product.id === p.id)) || PRODUCTS[3];

  const handleContinueToCheckout = () => {
    setCartDrawerOpen(false);
    setView('checkout');
  };

  const handleViewFullCart = () => {
    setCartDrawerOpen(false);
    setView('cart');
  };

  return (
    <AnimatePresence>
      {cartDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setCartDrawerOpen(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-xs"
          />

          {/* Slide-in Panel from Right */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="absolute inset-y-0 right-0 max-w-md w-full bg-[#FAF7F1] shadow-2xl flex flex-col justify-between border-l border-[#E8E0D2]"
          >
            
            {/* Top Header */}
            <div className="p-4 sm:p-6 border-b border-[#E8E0D2] flex items-center justify-between bg-white">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#24221F]" />
                <h2 className="font-serif text-lg sm:text-xl font-bold text-[#24221F]">
                  {t.cart.title} ({cartItems.reduce((s, i) => s + i.quantity, 0)})
                </h2>
              </div>
              <motion.button 
                whileTap={{ scale: 0.9 }}
                onClick={() => setCartDrawerOpen(false)}
                className="p-1.5 sm:p-2 rounded-full hover:bg-[#F4EFE6] text-[#757169] hover:text-[#24221F] transition-colors cursor-pointer"
                aria-label="Close bag"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Free Delivery Meter */}
            <div className="bg-[#FAF3DE] px-6 py-3 border-b border-[#EADBB6] text-xs">
              <div className="flex items-center justify-between font-semibold text-[#6C5311] mb-1.5">
                <span>
                  {isFreeShipping ? (
                    <span className="flex items-center gap-1.5 text-[#4F7A5E]">
                      <Sparkles className="w-3.5 h-3.5" /> Free Nationwide Delivery Unlocked!
                    </span>
                  ) : (
                    <span>Add ৳{amountUntilFreeShipping.toFixed(0)} more for Free Delivery!</span>
                  )}
                </span>
                <span className="font-mono text-[11px]">৳{subtotal} / ৳{freeShippingThreshold}</span>
              </div>

              <div className="w-full bg-[#EADBB6] h-1.5 rounded-full overflow-hidden">
                <motion.div 
                  className="bg-[#1C4CB8] h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%` }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                />
              </div>
            </div>

            {/* Scrollable Items Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {cartItems.length > 0 ? (
                <>
                  {/* Product List */}
                  <div className="space-y-3">
                    <AnimatePresence>
                      {cartItems.map((item, idx) => (
                        <motion.div 
                          key={item.product.id}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
                          transition={{ delay: idx * 0.04, duration: 0.2 }}
                          className="flex gap-3 sm:gap-4 p-3 sm:p-3.5 rounded-2xl bg-white border border-[#E8E0D2] shadow-2xs text-left"
                        >
                          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-[#FAF7F1] shrink-0 border border-[#E8E0D2]">
                            <img
                              src={item.product.images.main}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <div className="flex-1 min-w-0 flex flex-col justify-between">
                            <div>
                              <div className="flex items-start justify-between gap-1 sm:gap-2">
                                <h3 className="font-serif font-bold text-xs sm:text-sm text-[#24221F] line-clamp-1">
                                  {item.product.name}
                                </h3>
                                <motion.button
                                  whileTap={{ scale: 0.85 }}
                                  onClick={() => removeFromCart(item.product.id)}
                                  className="text-[#A8A49C] hover:text-[#D96F58] p-1 transition-colors cursor-pointer shrink-0"
                                  title="Remove item"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </motion.button>
                              </div>
                              <span className="text-[10px] sm:text-[11px] font-mono text-[#757169] block">
                                {item.product.ageBadge}
                              </span>
                            </div>

                            <div className="flex items-center justify-between pt-1.5 sm:pt-2">
                              <div className="flex items-center border border-[#E8E0D2] rounded-full px-1.5 sm:px-2 py-0.5 bg-[#FAF7F1]">
                                <motion.button
                                  whileTap={{ scale: 0.85 }}
                                  onClick={() => updateQuantity(item.product.id, -1)}
                                  className="w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-[#757169] hover:text-[#24221F] cursor-pointer"
                                >
                                  <Minus className="w-3 h-3" />
                                </motion.button>
                                <span className="w-5 sm:w-6 text-center font-bold text-[11px] sm:text-xs">
                                  {item.quantity}
                                </span>
                                <motion.button
                                  whileTap={{ scale: 0.85 }}
                                  onClick={() => updateQuantity(item.product.id, 1)}
                                  className="w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-[#757169] hover:text-[#24221F] cursor-pointer"
                                >
                                  <Plus className="w-3 h-3" />
                                </motion.button>
                              </div>

                              <span className="font-bold text-xs sm:text-sm text-[#24221F] font-sans">
                                ৳{item.product.price * item.quantity}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>

                  {/* Gift Toggle Section */}
                  <div className="bg-[#FAF7F1] border border-[#E8E0D2] rounded-2xl p-3.5 sm:p-4 text-left space-y-2.5 sm:space-y-3">
                    <label className="flex items-center gap-2 text-xs font-semibold text-[#24221F] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isGift}
                        onChange={(e) => setIsGift(e.target.checked)}
                        className="w-4 h-4 rounded text-[#1C4CB8] focus:ring-[#1C4CB8]"
                      />
                      <span className="flex items-center gap-1.5">
                        <Gift className="w-3.5 h-3.5 text-[#F28F79] shrink-0" /> Special gift (Complimentary card)
                      </span>
                    </label>

                    {isGift && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-2 pt-1"
                      >
                        <input
                          type="text"
                          placeholder="Recipient's Name (optional)"
                          value={giftRecipient}
                          onChange={(e) => setGiftRecipient(e.target.value)}
                          className="w-full text-xs p-2 sm:p-2.5 rounded-xl border border-[#D9D3C7] bg-white text-[#24221F]"
                        />
                        <textarea
                          placeholder="Gift card message (e.g. 'Happy Birthday! Lots of love')"
                          value={giftMessage}
                          onChange={(e) => setGiftMessage(e.target.value)}
                          rows={2}
                          className="w-full text-xs p-2 sm:p-2.5 rounded-xl border border-[#D9D3C7] bg-white text-[#24221F]"
                        />
                      </motion.div>
                    )}
                  </div>

                  {/* Pairs Nicely With Cross-Sell */}
                  {crossSellProduct && (
                    <div className="bg-white rounded-2xl p-3 sm:p-3.5 border border-[#E8E0D2] text-left">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#A67E14] block mb-2">
                        Pairs Nicely With
                      </span>
                      <div className="flex items-center gap-2.5 sm:gap-3">
                        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl overflow-hidden bg-[#FAF7F1] shrink-0">
                          <img
                            src={crossSellProduct.images.main}
                            alt={crossSellProduct.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-[#24221F] truncate">{crossSellProduct.name}</div>
                          <div className="text-[11px] text-[#757169] font-sans">৳{crossSellProduct.price}</div>
                        </div>
                        <motion.button
                          whileTap={{ scale: 0.94 }}
                          onClick={() => addToCart(crossSellProduct, 1)}
                          className="px-2.5 sm:px-3 py-1 rounded-full bg-[#FAF7F1] hover:bg-[#1C4CB8] hover:text-white border border-[#E8E0D2] text-[11px] sm:text-xs font-semibold text-[#24221F] transition-colors cursor-pointer shrink-0"
                        >
                          + Add
                        </motion.button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                /* Empty State with Personality */
                <div className="text-center py-12 sm:py-16 space-y-4">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#FCF4DB] text-[#A67E14] flex items-center justify-center mx-auto">
                    <ShoppingBag className="w-7 h-7 sm:w-8 sm:h-8" />
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#24221F]">
                    Your shopping bag is empty.
                  </h3>
                  <p className="text-xs sm:text-sm text-[#757169] max-w-xs mx-auto">
                    Discover screen-free Montessori wooden toys crafted for growing hands and curious minds.
                  </p>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setCartDrawerOpen(false);
                      setView('shop');
                    }}
                    className="px-5 sm:px-6 py-2.5 rounded-full bg-[#24221F] text-white hover:bg-[#1C4CB8] text-xs font-bold transition-all cursor-pointer"
                  >
                    Explore Discoveries
                  </motion.button>
                </div>
              )}
            </div>

            {/* Bottom Checkout Action Panel */}
            {cartItems.length > 0 && (
              <div className="p-4 sm:p-6 border-t border-[#E8E0D2] bg-white space-y-3 sm:space-y-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
                
                {/* Delivery Zone Toggle in Drawer */}
                <div className="flex flex-wrap items-center justify-between p-2 sm:p-2.5 rounded-xl bg-[#FAF7F1] border border-[#E8E0D2] text-[11px] sm:text-xs gap-1.5">
                  <span className="text-[#6E6A63] font-medium shrink-0">Delivery Zone:</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => updateDeliveryDetails({ deliveryZone: 'inside-dhaka', district: 'Dhaka' })}
                      className={`px-2 sm:px-2.5 py-1 rounded-lg text-[11px] sm:text-xs font-semibold cursor-pointer transition-colors ${
                        deliveryDetails.deliveryZone === 'inside-dhaka'
                          ? 'bg-[#1C4CB8] text-white shadow-2xs'
                          : 'bg-white text-[#24221F] border border-[#E8E0D2]'
                      }`}
                    >
                      Dhaka (৳70)
                    </button>
                    <button
                      onClick={() => updateDeliveryDetails({ deliveryZone: 'outside-dhaka', district: 'Chattogram' })}
                      className={`px-2 sm:px-2.5 py-1 rounded-lg text-[11px] sm:text-xs font-semibold cursor-pointer transition-colors ${
                        deliveryDetails.deliveryZone === 'outside-dhaka'
                          ? 'bg-[#1C4CB8] text-white shadow-2xs'
                          : 'bg-white text-[#24221F] border border-[#E8E0D2]'
                      }`}
                    >
                      Outside (৳130)
                    </button>
                  </div>
                </div>

                {/* Price Calculations */}
                <div className="space-y-1 sm:space-y-1.5 text-xs text-[#6E6A63]">
                  <div className="flex justify-between">
                    <span>{t.cart.subtotal}</span>
                    <span className="font-semibold text-[#24221F] font-sans">৳{subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t.cart.deliveryFee}</span>
                    <span>{deliveryFee === 0 ? <strong className="text-[#4F7A5E]">{t.cart.free}</strong> : `৳${deliveryFee}`}</span>
                  </div>
                  <div className="flex justify-between pt-1.5 sm:pt-2 border-t border-[#E8E0D2] text-sm font-bold text-[#24221F]">
                    <span>{t.cart.total}</span>
                    <span className="font-sans">৳{total}</span>
                  </div>
                </div>

                {/* COD Safety & Reassurance Badge */}
                <div className="flex items-center gap-2 p-2.5 sm:p-3 rounded-xl bg-[#FAF7F1] border border-[#E8E0D2] text-xs text-[#24221F]">
                  <PackageCheck className="w-4 h-4 text-[#A67E14] shrink-0" />
                  <div>
                    <span className="font-bold text-[11px] sm:text-xs">Cash on Delivery Across Bangladesh</span>
                    <p className="text-[10px] sm:text-[11px] text-[#757169]">Zero advance payment. Inspect parcel at doorstep before paying.</p>
                  </div>
                </div>

                {/* Primary Action Button */}
                <div className="space-y-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleContinueToCheckout}
                    className="w-full py-3 sm:py-3.5 rounded-full bg-[#24221F] text-[#FAF7F1] hover:bg-[#1C4CB8] text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-md transition-colors cursor-pointer"
                  >
                    <span>{t.cart.proceedToCheckout}</span>
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>

                  <div className="flex items-center justify-between text-xs text-[#757169] px-1">
                    <button
                      onClick={handleViewFullCart}
                      className="hover:text-[#24221F] underline cursor-pointer"
                    >
                      View full bag
                    </button>
                    <button
                      onClick={() => setCartDrawerOpen(false)}
                      className="hover:text-[#24221F] cursor-pointer"
                    >
                      Keep Shopping
                    </button>
                  </div>
                </div>

              </div>
            )}

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
