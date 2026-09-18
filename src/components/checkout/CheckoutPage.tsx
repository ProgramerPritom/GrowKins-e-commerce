import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../context/StoreContext';
import { useLanguage } from '../../context/LanguageContext';
import { 
  ShieldCheck, PackageCheck, ArrowRight, ArrowLeft, 
  Check, Phone, MapPin, AlertCircle, ChevronDown, ChevronUp 
} from 'lucide-react';

const BANGLADESH_DISTRICTS = [
  'Dhaka', 'Chattogram', 'Sylhet', 'Gazipur', 'Narayanganj', 
  'Cumilla', 'Rajshahi', 'Khulna', 'Barishal', 'Rangpur', 
  'Mymensingh', 'Bogura', "Cox's Bazar", 'Jashore', 'Dinajpur',
  'Tangail', 'Faridpur', 'Kushtia', 'Pabna', 'Noakhali', 'Feni',
  'Brahmanbaria', 'Jamalpur', 'Sirajganj', 'Narsingdi', 'Manikganj'
];

export const CheckoutPage: React.FC = () => {
  const { 
    cartItems, 
    subtotal, 
    deliveryFee, 
    total, 
    deliveryDetails, 
    updateDeliveryDetails, 
    placeCodOrder, 
    setView 
  } = useStore();

  const { t } = useLanguage();

  const [step, setStep] = useState<1 | 2>(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mobileSummaryOpen, setMobileSummaryOpen] = useState(false);

  // Validate Bangladesh localized fields in clean English
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!deliveryDetails.fullName.trim()) {
      newErrors.fullName = 'Please enter your full name.';
    }

    const phoneClean = deliveryDetails.phone.replace(/[\s-]/g, '');
    if (!phoneClean) {
      newErrors.phone = 'Please provide an active mobile number for courier confirmation.';
    } else if (phoneClean.length < 11) {
      newErrors.phone = 'Please enter a valid 11-digit mobile number (e.g. 017XXXXXXXX).';
    }

    if (!deliveryDetails.streetAddress.trim()) {
      newErrors.streetAddress = 'Please enter your house/road or detailed street address.';
    }

    if (!deliveryDetails.thanaArea.trim()) {
      newErrors.thanaArea = 'Please enter your thana or area name (e.g. Dhanmondi, Gulshan, Uttara).';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProceedToReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePlaceOrder = async () => {
    setIsSubmitting(true);
    try {
      await placeCodOrder();
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0 && step === 1) {
    return (
      <div className="py-24 text-center">
        <h2 className="font-serif text-2xl font-bold text-[#24221F]">Your shopping bag is currently empty.</h2>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setView('shop')}
          className="mt-4 px-6 py-2.5 rounded-full bg-[#24221F] text-white text-xs font-bold"
        >
          Explore Discoveries
        </motion.button>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF7F1] min-h-screen py-8 text-left">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Focused Checkout Header */}
        <div className="flex items-center justify-between border-b border-[#E8E0D2] pb-6 mb-8">
          <button 
            onClick={() => setView('home')}
            className="group flex items-baseline gap-1"
          >
            <span className="font-serif text-2xl sm:text-3xl font-bold text-[#24221F]">
              GrowKins
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#F28F79]"></span>
          </button>

          <div className="flex items-center gap-2 text-xs font-semibold text-[#4F7A5E] bg-[#E6EFE9] px-3.5 py-1.5 rounded-full border border-[#C9DEC0]">
            <ShieldCheck className="w-4 h-4" />
            <span>100% Cash on Delivery Across Bangladesh</span>
          </div>
        </div>

        {/* Progress Stepper */}
        <div className="max-w-md mx-auto mb-10 flex items-center justify-center gap-4 text-xs font-semibold">
          <div className={`flex items-center gap-2 ${step === 1 ? 'text-[#1C4CB8]' : 'text-[#4F7A5E]'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs text-white ${step === 1 ? 'bg-[#1C4CB8]' : 'bg-[#4F7A5E]'}`}>
              {step > 1 ? '✓' : '1'}
            </span>
            <span>1. Delivery Address</span>
          </div>

          <span className="h-px w-8 bg-[#E8E0D2]"></span>

          <div className={`flex items-center gap-2 ${step === 2 ? 'text-[#1C4CB8]' : 'text-[#A8A49C]'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step === 2 ? 'bg-[#1C4CB8] text-white' : 'bg-[#E8E0D2] text-[#757169]'}`}>
              2
            </span>
            <span>2. Review & Place Order</span>
          </div>
        </div>

        {/* Mobile Collapsible Order Summary */}
        <div className="lg:hidden mb-6">
          <button
            onClick={() => setMobileSummaryOpen(!mobileSummaryOpen)}
            className="w-full p-4 rounded-2xl bg-white border border-[#E8E0D2] flex items-center justify-between text-xs font-semibold text-[#24221F] shadow-2xs"
          >
            <span>Your Order · {cartItems.reduce((s, i) => s + i.quantity, 0)} items · ৳{total}</span>
            <div className="flex items-center gap-1 text-[#1C4CB8]">
              <span>{mobileSummaryOpen ? 'Hide' : 'Details'}</span>
              {mobileSummaryOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </div>
          </button>

          {mobileSummaryOpen && (
            <div className="mt-2 p-4 rounded-2xl bg-white border border-[#E8E0D2] space-y-3 animate-in fade-in duration-150">
              {cartItems.map(item => (
                <div key={item.product.id} className="flex justify-between text-xs">
                  <span>{item.quantity}× {item.product.name}</span>
                  <span className="font-semibold font-sans">৳{item.product.price * item.quantity}</span>
                </div>
              ))}
              <div className="pt-2 border-t border-[#E8E0D2] flex justify-between font-bold text-sm">
                <span>Total Payable (Cash on Delivery)</span>
                <span className="font-sans">৳{total}</span>
              </div>
            </div>
          )}
        </div>

        {/* Main Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* LEFT: Checkout Step Form / Review */}
          <div className="lg:col-span-7">
            
            <AnimatePresence mode="wait">
              {/* STEP 1: DELIVERY DETAILS */}
              {step === 1 && (
                <motion.form 
                  key="step-1"
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 16 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] as const }}
                  onSubmit={handleProceedToReview} 
                  className="space-y-8"
                >
                  
                  {/* Headline */}
                  <div>
                    <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#24221F]">
                      Where should we deliver your parcel?
                    </h1>
                    <p className="text-sm text-[#6E6A63] mt-1">
                      Enter your delivery details. Our team will call you to confirm before dispatch.
                    </p>
                  </div>

                  {/* COD Reassurance Card for Bangladesh */}
                  <div className="bg-[#FCF4DB] border border-[#F2E0B2] rounded-2xl p-5 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-white text-[#A67E14] flex items-center justify-center shrink-0 shadow-2xs">
                      <PackageCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-[#856404]">
                        100% Cash on Delivery (COD)
                      </h3>
                      <p className="text-xs text-[#5E4D1D] mt-0.5 leading-relaxed">
                        No advance payment needed. Inspect your parcel at your doorstep before handing cash to the courier rider.
                      </p>
                    </div>
                  </div>

                  {/* Delivery Zone Selection (Inside vs Outside Dhaka) - User Item 10 */}
                  <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E0D2] shadow-2xs space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="font-serif text-lg font-bold text-[#24221F]">
                        {t.checkout.zoneTitle}
                      </h2>
                      <span className="text-xs text-[#1C4CB8] font-semibold bg-[#E7EDFB] px-2.5 py-1 rounded-full">
                        {deliveryDetails.deliveryZone === 'inside-dhaka' ? 'Inside Dhaka (৳70)' : 'Outside Dhaka (৳130)'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Inside Dhaka Checkmark Card */}
                      <label 
                        onClick={() => updateDeliveryDetails({ deliveryZone: 'inside-dhaka', district: 'Dhaka' })}
                        className={`p-4 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                          deliveryDetails.deliveryZone === 'inside-dhaka'
                            ? 'border-[#1C4CB8] bg-[#E7EDFB]/50 shadow-xs'
                            : 'border-[#E8E0D2] hover:bg-[#FAF7F1]'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`mt-0.5 w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                            deliveryDetails.deliveryZone === 'inside-dhaka'
                              ? 'border-[#1C4CB8] bg-[#1C4CB8] text-white'
                              : 'border-[#D9D3C7] bg-white'
                          }`}>
                            {deliveryDetails.deliveryZone === 'inside-dhaka' && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <div>
                            <div className="font-bold text-sm text-[#24221F] flex items-center gap-1">
                              <span>Inside Dhaka City</span>
                              {deliveryDetails.deliveryZone === 'inside-dhaka' && (
                                <span className="text-[10px] text-[#1C4CB8] font-bold bg-white px-1.5 py-0.2 rounded-full border border-[#1C4CB8]/30">Active</span>
                              )}
                            </div>
                            <div className="text-xs text-[#757169] mt-0.5">24–48 hours doorstep delivery</div>
                          </div>
                        </div>
                        <div className="text-right font-sans font-bold text-base text-[#1C4CB8]">
                          {subtotal >= 2500 ? <span className="text-[#4F7A5E]">FREE</span> : '৳70'}
                        </div>
                      </label>

                      {/* Outside Dhaka Checkmark Card */}
                      <label 
                        onClick={() => updateDeliveryDetails({ deliveryZone: 'outside-dhaka', district: deliveryDetails.district === 'Dhaka' ? 'Chattogram' : deliveryDetails.district })}
                        className={`p-4 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                          deliveryDetails.deliveryZone === 'outside-dhaka'
                            ? 'border-[#1C4CB8] bg-[#E7EDFB]/50 shadow-xs'
                            : 'border-[#E8E0D2] hover:bg-[#FAF7F1]'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`mt-0.5 w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                            deliveryDetails.deliveryZone === 'outside-dhaka'
                              ? 'border-[#1C4CB8] bg-[#1C4CB8] text-white'
                              : 'border-[#D9D3C7] bg-white'
                          }`}>
                            {deliveryDetails.deliveryZone === 'outside-dhaka' && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <div>
                            <div className="font-bold text-sm text-[#24221F] flex items-center gap-1">
                              <span>Outside Dhaka (All BD)</span>
                              {deliveryDetails.deliveryZone === 'outside-dhaka' && (
                                <span className="text-[10px] text-[#1C4CB8] font-bold bg-white px-1.5 py-0.2 rounded-full border border-[#1C4CB8]/30">Active</span>
                              )}
                            </div>
                            <div className="text-xs text-[#757169] mt-0.5">2–4 days across 64 districts</div>
                          </div>
                        </div>
                        <div className="text-right font-sans font-bold text-base text-[#1C4CB8]">
                          {subtotal >= 2500 ? <span className="text-[#4F7A5E]">FREE</span> : '৳130'}
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Customer Information */}
                  <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E0D2] shadow-2xs space-y-4">
                    <h2 className="font-serif text-lg font-bold text-[#24221F]">
                      Recipient Information
                    </h2>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#757169] mb-1.5">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        value={deliveryDetails.fullName}
                        onChange={(e) => updateDeliveryDetails({ fullName: e.target.value })}
                        placeholder="e.g. Nusrat Jahan or Tanvir Ahmed"
                        className={`w-full h-13 px-4 rounded-xl border bg-[#FAF7F1] text-sm text-[#24221F] focus:outline-none focus:ring-2 focus:ring-[#1C4CB8]/20 ${
                          errors.fullName ? 'border-[#D96F58]' : 'border-[#D9D3C7]'
                        }`}
                      />
                      {errors.fullName && (
                        <p className="text-xs text-[#D96F58] mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" /> {errors.fullName}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#24221F] mb-1.5 flex items-center justify-between">
                          <span>Active Mobile Number *</span>
                          <span className="text-[10px] text-[#A67E14] font-medium">for courier call</span>
                        </label>
                        <div className="relative">
                          <input
                            type="tel"
                            value={deliveryDetails.phone}
                            onChange={(e) => updateDeliveryDetails({ phone: e.target.value })}
                            placeholder="017XXXXXXXX"
                            className={`w-full h-13 px-4 rounded-xl border bg-[#FAF7F1] text-sm text-[#24221F] focus:outline-none focus:ring-2 focus:ring-[#1C4CB8]/20 font-mono ${
                              errors.phone ? 'border-[#D96F58]' : 'border-[#D9D3C7]'
                            }`}
                          />
                          <Phone className="w-4 h-4 text-[#A8A49C] absolute right-3.5 top-4 pointer-events-none" />
                        </div>
                        {errors.phone && (
                          <p className="text-xs text-[#D96F58] mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5" /> {errors.phone}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#757169] mb-1.5">
                          Email Address <span className="text-[#A8A49C] lowercase font-normal">(optional)</span>
                        </label>
                        <input
                          type="email"
                          value={deliveryDetails.email}
                          onChange={(e) => updateDeliveryDetails({ email: e.target.value })}
                          placeholder="yourname@gmail.com"
                          className="w-full h-13 px-4 rounded-xl border border-[#D9D3C7] bg-[#FAF7F1] text-sm text-[#24221F] focus:outline-none focus:ring-2 focus:ring-[#1C4CB8]/20"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Delivery Address */}
                  <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E0D2] shadow-2xs space-y-4">
                    <h2 className="font-serif text-lg font-bold text-[#24221F]">
                      Delivery Street Address
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#757169] mb-1.5">
                          District *
                        </label>
                        <select
                          value={deliveryDetails.district}
                          onChange={(e) => {
                            const dist = e.target.value;
                            const isInsideDhaka = dist === 'Dhaka';
                            updateDeliveryDetails({ 
                              district: dist,
                              deliveryZone: isInsideDhaka ? 'inside-dhaka' : 'outside-dhaka'
                            });
                          }}
                          className="w-full h-13 px-4 rounded-xl border border-[#D9D3C7] bg-[#FAF7F1] text-sm text-[#24221F] focus:outline-none focus:ring-2 focus:ring-[#1C4CB8]/20 cursor-pointer"
                        >
                          {BANGLADESH_DISTRICTS.map((dist) => (
                            <option key={dist} value={dist}>
                              {dist}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#757169] mb-1.5">
                          Thana / Area *
                        </label>
                        <input
                          type="text"
                          value={deliveryDetails.thanaArea}
                          onChange={(e) => updateDeliveryDetails({ thanaArea: e.target.value })}
                          placeholder="e.g. Dhanmondi, Gulshan, or Agrabad"
                          className={`w-full h-13 px-4 rounded-xl border bg-[#FAF7F1] text-sm text-[#24221F] focus:outline-none focus:ring-2 focus:ring-[#1C4CB8]/20 ${
                            errors.thanaArea ? 'border-[#D96F58]' : 'border-[#D9D3C7]'
                          }`}
                        />
                        {errors.thanaArea && (
                          <p className="text-xs text-[#D96F58] mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5" /> {errors.thanaArea}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#757169] mb-1.5">
                        House / Road / Flat No. & Full Address *
                      </label>
                      <input
                        type="text"
                        value={deliveryDetails.streetAddress}
                        onChange={(e) => updateDeliveryDetails({ streetAddress: e.target.value })}
                        placeholder="e.g. House 12, Road 5, Flat 4B, Block C"
                        className={`w-full h-13 px-4 rounded-xl border bg-[#FAF7F1] text-sm text-[#24221F] focus:outline-none focus:ring-2 focus:ring-[#1C4CB8]/20 ${
                          errors.streetAddress ? 'border-[#D96F58]' : 'border-[#D9D3C7]'
                        }`}
                      />
                      {errors.streetAddress && (
                        <p className="text-xs text-[#D96F58] mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" /> {errors.streetAddress}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Optional Delivery Instructions */}
                  <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E0D2] shadow-2xs space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#757169]">
                      Special Delivery Instructions <span className="text-[#A8A49C] lowercase font-normal">(optional)</span>
                    </label>
                    <textarea
                      rows={2}
                      value={deliveryDetails.orderNote}
                      onChange={(e) => updateDeliveryDetails({ orderNote: e.target.value })}
                      placeholder="e.g. 'Please call before arrival', 'Leave at reception if busy'..."
                      className="w-full p-4 rounded-xl border border-[#D9D3C7] bg-[#FAF7F1] text-sm text-[#24221F] focus:outline-none focus:ring-2 focus:ring-[#1C4CB8]/20"
                    />
                  </div>

                  {/* Continue CTA */}
                  <div className="space-y-2 pt-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      type="submit"
                      className="w-full py-4 rounded-full bg-[#24221F] text-white hover:bg-[#1C4CB8] text-base font-bold flex items-center justify-center gap-2 shadow-md transition-colors cursor-pointer"
                    >
                      <span>Review My Order</span>
                      <ArrowRight className="w-4 h-4" />
                    </motion.button>

                    <p className="text-center text-xs text-[#757169]">
                      No online payment required · Pay cash upon doorstep inspection
                    </p>
                  </div>

                </motion.form>
              )}

              {/* STEP 2: REVIEW ORDER */}
              {step === 2 && (
                <motion.div 
                  key="step-2"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] as const }}
                  className="space-y-8"
                >
                  <div>
                    <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#24221F]">
                      Review your order before confirmation
                    </h1>
                    <p className="text-sm text-[#6E6A63] mt-1">
                      Please confirm your delivery address and items below.
                    </p>
                  </div>

                  {/* Delivery details review box */}
                  <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E0D2] shadow-2xs space-y-4">
                    <div className="flex items-center justify-between border-b border-[#FAF7F1] pb-3">
                      <h2 className="font-serif text-lg font-bold text-[#24221F]">
                        Delivery Information
                      </h2>
                      <button
                        onClick={() => setStep(1)}
                        className="text-xs font-bold text-[#1C4CB8] hover:underline"
                      >
                        Edit Details
                      </button>
                    </div>

                    <div className="text-sm text-[#4D4943] space-y-1">
                      <div className="font-bold text-base text-[#24221F]">{deliveryDetails.fullName}</div>
                      <div className="flex items-center gap-2 text-[#757169] font-mono">
                        <Phone className="w-3.5 h-3.5" />
                        <span>{deliveryDetails.phone}</span>
                      </div>
                      {deliveryDetails.email && (
                        <div className="text-xs text-[#757169]">{deliveryDetails.email}</div>
                      )}
                      <div className="pt-2 flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-[#A67E14] shrink-0 mt-0.5" />
                        <div>
                          <div>{deliveryDetails.streetAddress}</div>
                          <div>{deliveryDetails.thanaArea}, {deliveryDetails.district}</div>
                          <div className="text-xs text-[#1C4CB8] font-medium mt-0.5">
                            {deliveryDetails.deliveryZone === 'inside-dhaka' ? 'Inside Dhaka City (24–48h)' : 'Outside Dhaka (2–4 days)'}
                          </div>
                        </div>
                      </div>
                      {deliveryDetails.orderNote && (
                        <div className="mt-3 p-3 rounded-xl bg-[#FAF7F1] text-xs italic text-[#757169]">
                          Special note: "{deliveryDetails.orderNote}"
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Items Review Box */}
                  <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E0D2] shadow-2xs space-y-4">
                    <h2 className="font-serif text-lg font-bold text-[#24221F]">
                      Parcel Contents
                    </h2>

                    <div className="divide-y divide-[#FAF7F1]">
                      {cartItems.map((item) => (
                        <div key={item.product.id} className="py-3 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={item.product.images.main}
                              alt={item.product.name}
                              className="w-14 h-14 rounded-xl object-cover bg-[#FAF7F1] border border-[#E8E0D2]"
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

                  {/* Payment Method Details */}
                  <div className="bg-[#FCF4DB] rounded-3xl p-6 border border-[#F2E0B2] space-y-2">
                    <div className="flex items-center gap-2 font-bold text-[#856404]">
                      <PackageCheck className="w-5 h-5 text-[#A67E14]" />
                      <span>100% Cash on Delivery (COD)</span>
                    </div>
                    <p className="text-xs text-[#5E4D1D] leading-relaxed">
                      You will pay <strong>৳{total}</strong> in cash directly to the courier agent upon doorstep delivery and inspection. Zero advance payment required.
                    </p>
                  </div>

                  {/* Place Order CTA Button */}
                  <div className="space-y-3 pt-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={handlePlaceOrder}
                      disabled={isSubmitting}
                      className="w-full py-4 rounded-full bg-[#1C4CB8] hover:bg-[#123788] text-white text-base font-bold flex items-center justify-center gap-2 shadow-lg transition-all disabled:opacity-60 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                          <span>Placing your order… Just a moment</span>
                        </span>
                      ) : (
                        <>
                          <Check className="w-5 h-5" />
                          <span className="font-sans">Place Cash on Delivery Order (৳{total})</span>
                        </>
                      )}
                    </motion.button>

                    <div className="flex items-center justify-between text-xs text-[#757169]">
                      <button
                        onClick={() => setStep(1)}
                        className="flex items-center gap-1 hover:text-[#24221F]"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" /> Return to delivery address
                      </button>

                      <span>Doorstep inspection guaranteed</span>
                    </div>
                  </div>

                </motion.div>
              )}
            </AnimatePresence>

          </div>

          {/* RIGHT: Sticky Desktop Order Summary */}
          <aside className="hidden lg:block lg:col-span-5 bg-white rounded-3xl p-8 border border-[#E8E0D2] shadow-sm sticky top-28 space-y-6">
            <h2 className="font-serif text-xl font-bold text-[#24221F]">
              Your Order
            </h2>

            {/* List of items */}
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {cartItems.map((item) => (
                <div key={item.product.id} className="flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={item.product.images.main}
                      alt={item.product.name}
                      className="w-12 h-12 rounded-lg object-cover bg-[#FAF7F1]"
                    />
                    <div>
                      <div className="font-semibold text-[#24221F] line-clamp-1">{item.product.name}</div>
                      <div className="text-[#757169]">Quantity: {item.quantity}</div>
                    </div>
                  </div>
                  <span className="font-bold text-[#24221F] font-sans">৳{item.product.price * item.quantity}</span>
                </div>
              ))}
            </div>

            {/* Costs calculation */}
            <div className="border-t border-[#E8E0D2] pt-4 space-y-2 text-xs text-[#6E6A63]">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-semibold text-[#24221F] font-sans">৳{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>
                  Courier Delivery ({deliveryDetails.deliveryZone === 'inside-dhaka' ? 'Inside Dhaka' : 'Outside Dhaka'})
                </span>
                <span>{deliveryFee === 0 ? <strong className="text-[#4F7A5E]">FREE</strong> : `৳${deliveryFee}`}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-[#E8E0D2] text-lg font-bold text-[#24221F]">
                <span>Total Cash Payable</span>
                <span className="font-sans">৳{total}</span>
              </div>
            </div>

            {/* Trust Checklist for Bangladesh Parents */}
            <div className="pt-2 border-t border-[#E8E0D2] space-y-2 text-xs text-[#4D4943]">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#4F7A5E]" />
                <span>100% Cash on Delivery across Bangladesh</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#4F7A5E]" />
                <span>Phone confirmation call before dispatch</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#4F7A5E]" />
                <span>Doorstep inspection before paying cash</span>
              </div>
            </div>
          </aside>

        </div>

      </div>
    </div>
  );
};
