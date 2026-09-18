import React from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../../context/StoreContext';
import { 
  Phone, Sparkles, ArrowRight, Printer, Star 
} from 'lucide-react';

export const OrderConfirmationPage: React.FC = () => {
  const { activeOrder, setView } = useStore();

  if (!activeOrder) {
    return (
      <div className="py-24 text-center">
        <h2 className="font-serif text-2xl font-bold text-[#24221F]">No active order found.</h2>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setView('shop')}
          className="mt-4 px-6 py-2 rounded-full bg-[#24221F] text-white text-xs font-bold"
        >
          Explore Discoveries
        </motion.button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-[#FAF7F1] min-h-screen py-12 text-left">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        {/* Memorable Tasteful Celebration Header */}
        <div className="text-center space-y-4 mb-10">
          
          {/* Animated check circle with self-drawing checkmark */}
          <div className="relative w-20 h-20 mx-auto">
            {/* Soft circle scaling in */}
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] as const }}
              className="w-20 h-20 rounded-full bg-[#E6EFE9] text-[#4F7A5E] flex items-center justify-center shadow-md"
            >
              <svg 
                className="w-10 h-10 text-[#4F7A5E]" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <motion.path
                  d="M20 6L9 17L4 12"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
                />
              </svg>
            </motion.div>

            {/* 4 subtle floating stars around checkmark */}
            {[
              { top: '-6px', left: '-6px', delay: 0.35, color: '#F7E198' },
              { top: '-4px', right: '-4px', delay: 0.45, color: '#F28F79' },
              { bottom: '-4px', left: '2px', delay: 0.55, color: '#A3C1AD' },
              { bottom: '-6px', right: '4px', delay: 0.65, color: '#1C4CB8' },
            ].map((star, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 0.8] }}
                transition={{ duration: 0.4, delay: star.delay }}
                style={{ position: 'absolute', top: star.top, left: star.left, right: star.right, bottom: star.bottom }}
              >
                <Star className="w-4 h-4 fill-current" style={{ color: star.color }} />
              </motion.div>
            ))}
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3, ease: [0.22, 1, 0.36, 1] as const }}
            className="font-serif text-4xl sm:text-5xl font-bold text-[#24221F]"
          >
            Yay — your order is in!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="text-base sm:text-lg text-[#6E6A63] max-w-md mx-auto"
          >
            We are preparing your little explorer's parcel with mindful care.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white border border-[#E8E0D2] shadow-2xs text-xs font-mono"
          >
            <span className="font-bold text-[#24221F]">Order Reference: #{activeOrder.orderNumber}</span>
            <span className="text-[#A8A49C]">·</span>
            <span className="text-[#4F7A5E] font-semibold">{activeOrder.status}</span>
          </motion.div>
        </div>

        {/* Reassurance Timeline: "What happens next?" in Bangladesh */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E0D2] shadow-sm mb-8 space-y-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#A67E14]" />
            <h2 className="font-serif text-xl font-bold text-[#24221F]">
              What happens next?
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
            <div className="bg-[#FAF7F1] p-4 rounded-2xl border border-[#E8E0D2] space-y-1">
              <span className="w-5 h-5 rounded-full bg-[#1C4CB8] text-white font-bold flex items-center justify-center text-[10px] mb-2">1</span>
              <div className="font-bold text-[#24221F]">Order Logged</div>
              <p className="text-[#757169]">Your order is recorded in our atelier queue.</p>
            </div>

            <div className="bg-[#FAF7F1] p-4 rounded-2xl border border-[#E8E0D2] space-y-1">
              <span className="w-5 h-5 rounded-full bg-[#1C4CB8] text-white font-bold flex items-center justify-center text-[10px] mb-2">2</span>
              <div className="font-bold text-[#24221F]">Confirmation Call</div>
              <p className="text-[#757169]">Our team calls your phone to verify address details.</p>
            </div>

            <div className="bg-[#FAF7F1] p-4 rounded-2xl border border-[#E8E0D2] space-y-1">
              <span className="w-5 h-5 rounded-full bg-[#1C4CB8] text-white font-bold flex items-center justify-center text-[10px] mb-2">3</span>
              <div className="font-bold text-[#24221F]">Courier Dispatched</div>
              <p className="text-[#757169]">Steadfast/Pathao: 24–48h Dhaka, 2–4 days all BD.</p>
            </div>

            <div className="bg-[#FCF4DB] p-4 rounded-2xl border border-[#F2E0B2] space-y-1">
              <span className="w-5 h-5 rounded-full bg-[#A67E14] text-white font-bold flex items-center justify-center text-[10px] mb-2">4</span>
              <div className="font-bold text-[#856404]">Cash on Delivery</div>
              <p className="text-[#5E4D1D]">Inspect parcel at doorstep and pay ৳{activeOrder.total}.</p>
            </div>
          </div>
        </div>

        {/* Order Details Breakdown Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E0D2] shadow-sm mb-8 space-y-6">
          <div className="flex items-center justify-between border-b border-[#FAF7F1] pb-4">
            <h2 className="font-serif text-lg font-bold text-[#24221F]">
              Delivery Details
            </h2>
            <span className="text-xs text-[#757169]">{activeOrder.createdAt}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-[#4D4943]">
            <div className="space-y-1">
              <div className="text-xs font-bold uppercase tracking-wider text-[#757169]">Recipient & Contact</div>
              <div className="font-bold text-base text-[#24221F]">{activeOrder.delivery.fullName}</div>
              <div className="flex items-center gap-1.5 text-xs text-[#757169] font-mono">
                <Phone className="w-3.5 h-3.5" />
                <span>{activeOrder.delivery.phone}</span>
              </div>
              {activeOrder.delivery.email && (
                <div className="text-xs text-[#757169]">{activeOrder.delivery.email}</div>
              )}
            </div>

            <div className="space-y-1">
              <div className="text-xs font-bold uppercase tracking-wider text-[#757169]">Address & Delivery Zone</div>
              <div className="text-sm">
                <div>{activeOrder.delivery.streetAddress}</div>
                <div>{activeOrder.delivery.thanaArea}, {activeOrder.delivery.district}</div>
                <div className="text-xs text-[#1C4CB8] font-semibold mt-0.5">
                  {activeOrder.delivery.deliveryZone === 'inside-dhaka' ? 'Inside Dhaka City (24–48h)' : 'Outside Dhaka (2–4 days)'}
                </div>
              </div>
              {activeOrder.delivery.orderNote && (
                <div className="text-xs text-[#757169] italic pt-1">
                  Special Note: "{activeOrder.delivery.orderNote}"
                </div>
              )}
            </div>
          </div>

          {/* Ordered Products */}
          <div className="border-t border-[#E8E0D2] pt-4 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-[#757169]">
              Ordered Discoveries
            </div>
            <div className="divide-y divide-[#FAF7F1]">
              {activeOrder.items.map((item) => (
                <div key={item.product.id} className="py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.product.images.main}
                      alt={item.product.name}
                      className="w-12 h-12 rounded-lg object-cover bg-[#FAF7F1]"
                    />
                    <div>
                      <div className="font-semibold text-sm text-[#24221F]">{item.product.name}</div>
                      <div className="text-xs text-[#757169] font-sans">{item.quantity}× · ৳{item.product.price} each</div>
                    </div>
                  </div>
                  <span className="font-bold text-sm text-[#24221F] font-sans">
                    ৳{item.product.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Price breakdown */}
          <div className="border-t border-[#E8E0D2] pt-4 space-y-2 text-xs text-[#6E6A63]">
            <div className="flex justify-between">
              <span>Items Subtotal</span>
              <span className="font-semibold text-[#24221F] font-sans">৳{activeOrder.subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Courier Delivery</span>
              <span>{activeOrder.deliveryFee === 0 ? <strong className="text-[#4F7A5E]">FREE</strong> : `৳${activeOrder.deliveryFee}`}</span>
            </div>
            <div className="flex justify-between pt-3 border-t border-[#E8E0D2] text-lg font-bold text-[#24221F]">
              <span>Total Payable upon Delivery (COD)</span>
              <span className="font-sans">৳{activeOrder.total}</span>
            </div>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={handlePrint}
            className="px-6 py-3 rounded-full bg-white border border-[#E8E0D2] hover:bg-[#FAF7F1] text-xs font-semibold flex items-center gap-2 transition-colors shadow-2xs"
          >
            <Printer className="w-4 h-4" />
            <span>Print Order Receipt</span>
          </button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setView('shop')}
            className="px-8 py-3.5 rounded-full bg-[#24221F] hover:bg-[#1C4CB8] text-white text-xs font-bold flex items-center gap-2 transition-colors shadow-md"
          >
            <span>Continue Exploring Discoveries</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>

      </div>
    </div>
  );
};
