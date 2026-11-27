import React, { useState } from 'react';
import { X, Printer, Check, MessageSquare, Phone, MapPin, Heart } from 'lucide-react';
import type { AdminOrder } from '../../types/admin';
import { printElement } from '../../utils/printHelper';

interface InvoiceModalProps {
  order: AdminOrder;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ order, onClose }) => {
  const [copiedType, setCopiedType] = useState<'greeting' | 'thankyou' | null>(null);

  const customerName = order.customer?.name || order.deliveryAddress?.fullName || 'সম্মানিত গ্রাহক';
  const customerPhone = order.customer?.phone || order.deliveryAddress?.phone || '';
  const streetAddress = order.deliveryAddress?.streetAddress || '';
  const district = order.deliveryAddress?.district || 'ঢাকা';
  const fullAddress = `${streetAddress ? streetAddress + ', ' : ''}${district}`;

  const orderDate = order.createdAt ? new Date(order.createdAt) : new Date();
  const formattedOrderDate = orderDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  // Estimated delivery date (3 days later)
  const deliveryDate = new Date(orderDate.getTime() + 3 * 24 * 60 * 60 * 1000);
  const formattedDeliveryDate = deliveryDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const rawNum = String(order.orderNumber || '').replace(/[^0-9]/g, '');
  const invoiceNo = `INV-2026-${rawNum.slice(-4) || '1001'}`;

  const items = Array.isArray(order.items) ? order.items : [];
  const subtotal = Number(order.subtotal) || items.reduce((s, it) => s + (Number(it.price) || 0) * (Number(it.quantity) || 1), 0);
  const deliveryFee = Number(order.deliveryFee) || (order.deliveryAddress?.deliveryZone === 'inside-dhaka' ? 70 : 130);
  const discount = Number(order.discount) || 0;
  const totalDue = Number(order.total) || (subtotal + deliveryFee - discount);

  // Template 1: Greeting & Order Confirmation Message
  const greetingTemplate = `আসসালামু আলাইকুম ${customerName} আপু/ভাইয়া! 💚
GrowKins-এ আপনার অর্ডারটি (${order.orderNumber ? '#' + order.orderNumber : invoiceNo}) সফলভাবে গ্রহণ করা হয়েছে।

📦 আপনার অর্ডারকৃত খেলনাসমূহ:
${items.map((it, i) => `${i + 1}. ${it.name} (পরিমাণ: ${it.quantity} টি - ৳${(Number(it.price) || 0) * (Number(it.quantity) || 1)})`).join('\n')}

🚚 ডেলিভারি চার্জ: ৳${deliveryFee}
💵 সর্বমোট প্রদেয়: ৳${totalDue} (ক্যাশ অন ডেলিভারি)
পার্সেল হাতে পেয়ে খুলে দেখে তারপর মূল্য পরিশোধ করবেন।

আপনার সোনামণির শেখার প্রতিটি ধাপে GrowKins থাকুক আপনার পাশে! 🌱
হটলাইন: 01767026831
ধন্যবাদ! 💚`;

  // Template 2: Delivery & Thank You Message
  const thankYouTemplate = `প্রিয় ${customerName} আপু/ভাইয়া, 💚
আপনার সন্তানের শেখার প্রতিটি ধাপে, Growkins থাকুক আপনার পাশে। 🌱

আপনার বাচ্চার শেখার অভিজ্ঞতাকে আরও আনন্দময় ও সহজ করে তুলতে আমরা প্রতিশ্রুতিবদ্ধ।
Growkins-এর ওপর আস্থা রাখার জন্য আন্তরিক ধন্যবাদ। 💚

হটলাইন: 01767026831
GrowKins Bangladesh`;

  const handleCopy = (text: string, type: 'greeting' | 'thankyou') => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  const handlePrint = () => {
    printElement('growkins-invoice-sheet', `Invoice-${order.orderNumber}`, 'A4');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[96vh] flex flex-col shadow-2xl border border-gray-200 overflow-hidden my-auto relative">
        
        {/* Top Action Bar (Hidden on print) */}
        <div className="px-6 py-4 bg-[#24221F] text-white flex items-center justify-between gap-3 shrink-0 print:hidden">
          <div className="flex items-center gap-2.5">
            <Printer className="w-5 h-5 text-[#F4A261]" />
            <div>
              <h3 className="font-black text-sm text-white">ইনভয়েস ভিউ ও প্রিন্ট</h3>
              <p className="text-[11px] text-gray-400">অর্ডার #{order.orderNumber} • {customerName}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleCopy(greetingTemplate, 'greeting')}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-gray-200 flex items-center gap-1.5 cursor-pointer transition-colors"
              title="গ্রিটিংস মেসেজ কপি করুন"
            >
              {copiedType === 'greeting' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <MessageSquare className="w-3.5 h-3.5" />}
              <span>{copiedType === 'greeting' ? 'কপি হয়েছে!' : 'গ্রিটিংস মেসেজ'}</span>
            </button>

            <button
              onClick={() => handleCopy(thankYouTemplate, 'thankyou')}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-gray-200 flex items-center gap-1.5 cursor-pointer transition-colors"
              title="থ্যাংক ইউ মেসেজ কপি করুন"
            >
              {copiedType === 'thankyou' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Heart className="w-3.5 h-3.5 text-rose-400" />}
              <span>{copiedType === 'thankyou' ? 'কপি হয়েছে!' : 'থ্যাংক ইউ মেসেজ'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-4 py-1.5 rounded-xl bg-[#E76F51] hover:bg-[#D45A3D] text-xs font-black text-white flex items-center gap-1.5 cursor-pointer shadow-md transition-all hover:scale-105"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>প্রিন্ট / PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white cursor-pointer ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Invoice Document Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 bg-white text-gray-900 print:p-0 print:m-0 print:overflow-visible">
          <div id="growkins-invoice-sheet" className="max-w-3xl mx-auto space-y-6 bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-xs print:border-none print:shadow-none print:p-0 font-sans">
            
            {/* Header: Logo, Date & Invoice No */}
            <div className="flex items-start justify-between border-b border-gray-200 pb-6 gap-4">
              <div className="flex items-center gap-3.5">
                <img
                  src="/GrowKins_logo.png"
                  alt="GrowKins Logo"
                  className="h-14 sm:h-16 w-auto object-contain"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-[#24221F] tracking-tight">
                    GROWKINS
                  </h1>
                  <p className="text-xs font-bold text-[#E76F51] tracking-wider uppercase">
                    Kids Toy World Bangladesh
                  </p>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    হটলাইন: 01767026831 • growkins.vercel.app
                  </p>
                </div>
              </div>

              <div className="text-right space-y-1">
                <div className="inline-block px-3 py-1 rounded-lg bg-gray-100 text-xs font-black text-gray-800 tracking-wider">
                  {invoiceNo}
                </div>
                <p className="text-xs text-gray-600 font-semibold pt-1">
                  <span className="text-gray-400">Date:</span> {formattedOrderDate}
                </p>
                <p className="text-xs text-gray-600 font-semibold">
                  <span className="text-gray-400">Delivery Date:</span> {formattedDeliveryDate}
                </p>
              </div>
            </div>

            {/* Billed To & Payment Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-[#FAF7F1] p-5 rounded-2xl border border-[#E8E0D2] text-xs">
              <div className="space-y-1.5">
                <p className="text-[10px] font-black uppercase text-gray-400 tracking-wider">
                  Billed To:
                </p>
                <h3 className="text-sm font-black text-gray-900 uppercase">
                  {customerName}
                </h3>
                {customerPhone && (
                  <p className="font-bold text-gray-800 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-gray-400" />
                    <span>+88{customerPhone.startsWith('0') ? customerPhone : '0' + customerPhone}</span>
                  </p>
                )}
                {fullAddress && (
                  <p className="text-gray-600 flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#E76F51] shrink-0 mt-0.5" />
                    <span>{fullAddress}</span>
                  </p>
                )}
              </div>

              <div className="space-y-1.5 sm:border-l sm:border-gray-200 sm:pl-6">
                <p className="text-[10px] font-black uppercase text-gray-400 tracking-wider">
                  Payment Information:
                </p>
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-black bg-emerald-100 text-emerald-800">
                  ক্যাশ অন ডেলিভারি (COD)
                </span>
                <p className="text-xs font-semibold text-gray-700 leading-relaxed pt-1">
                  Instant Payment on Delivery Time After Check Product.
                </p>
                <p className="text-[11px] text-gray-500">
                  পণ্য হাতে পেয়ে চেক করে ডেলিভারিম্যানকে টাকা দিন।
                </p>
              </div>
            </div>

            {/* ORDER SUMMARY TABLE */}
            <div className="space-y-2">
              <p className="text-xs font-black uppercase text-gray-500 tracking-wider">
                ORDER SUMMARY:
              </p>
              <div className="border border-gray-200 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#24221F] text-white text-[11px] font-black uppercase">
                    <tr>
                      <th className="py-3 px-4 w-12 text-center">No</th>
                      <th className="py-3 px-4">Description</th>
                      <th className="py-3 px-4 w-16 text-center">Qty</th>
                      <th className="py-3 px-4 w-24 text-right">Unit Price</th>
                      <th className="py-3 px-4 w-28 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-800">
                    {items.map((it, idx) => {
                      const uPrice = Number(it.price) || 0;
                      const q = Number(it.quantity) || 1;
                      return (
                        <tr key={idx} className="hover:bg-gray-50/50">
                          <td className="py-3 px-4 font-bold text-gray-400 text-center">
                            {String(idx + 1).padStart(2, '0')}
                          </td>
                          <td className="py-3 px-4 font-extrabold text-gray-900">
                            {it.name}
                          </td>
                          <td className="py-3 px-4 font-bold text-center">
                            {String(q).padStart(2, '0')}
                          </td>
                          <td className="py-3 px-4 text-right font-medium">
                            ৳{uPrice}
                          </td>
                          <td className="py-3 px-4 text-right font-black text-gray-900">
                            ৳{uPrice * q}
                          </td>
                        </tr>
                      );
                    })}

                    {/* Delivery Charge Row */}
                    <tr className="bg-gray-50/60 font-semibold">
                      <td className="py-2.5 px-4 text-center text-gray-400">
                        {String(items.length + 1).padStart(2, '0')}
                      </td>
                      <td className="py-2.5 px-4 text-gray-700">
                        ডেলিভারি চার্জ (Delivery Charge)
                      </td>
                      <td className="py-2.5 px-4 text-center">01</td>
                      <td className="py-2.5 px-4 text-right">৳{deliveryFee}</td>
                      <td className="py-2.5 px-4 text-right font-bold text-gray-900">৳{deliveryFee}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Calculations Total Box */}
            <div className="flex justify-end pt-1">
              <div className="w-full sm:w-72 bg-[#FAF7F1] p-4 rounded-2xl border border-[#E8E0D2] space-y-2 text-xs">
                <div className="flex justify-between text-gray-600 font-semibold">
                  <span>SUBTOTAL</span>
                  <span>৳{subtotal}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-rose-600 font-bold">
                    <span>DISCOUNT</span>
                    <span>-৳{discount}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600 font-semibold">
                  <span>DELIVERY CHARGE</span>
                  <span>৳{deliveryFee}</span>
                </div>
                <div className="flex justify-between items-center border-t border-gray-300 pt-2 font-black text-base text-emerald-800">
                  <span>TOTAL DUE</span>
                  <span className="text-xl font-black">৳{totalDue}</span>
                </div>
              </div>
            </div>

            {/* Personalized Emotional Message (Exact Match to PDF) */}
            <div className="mt-8 pt-6 border-t border-dashed border-gray-300 text-center space-y-2 bg-[#FAF7F1]/60 p-5 rounded-2xl border border-[#E8E0D2]">
              <p className="text-sm font-black text-emerald-800">
                প্রিয় {customerName} আপু/ভাইয়া, 💚
              </p>
              <p className="text-xs font-semibold text-gray-700 leading-relaxed max-w-xl mx-auto">
                আপনার সন্তানের শেখার প্রতিটি ধাপে, Growkins থাকুক আপনার পাশে। 🌱
                <br />
                আপনার বাচ্চার শেখার অভিজ্ঞতাকে আরও আনন্দময় ও সহজ করে তুলতে আমরা প্রতিশ্রুতিবদ্ধ।
              </p>
              <p className="text-xs font-black text-emerald-700 pt-1">
                Growkins-এর ওপর আস্থা রাখার জন্য আন্তরিক ধন্যবাদ। 💚
              </p>
              <p className="text-[11px] text-gray-400 font-bold pt-1">
                কাস্টমার কেয়ার হটলাইন: 01767026831 • ঢাকা, বাংলাদেশ
              </p>
            </div>

          </div>
        </div>

        {/* Print Stylesheet */}
        <style>{`
          @media print {
            header, aside, nav, .print\\:hidden, button {
              display: none !important;
            }
            html, body {
              overflow: visible !important;
              height: auto !important;
              background: #fff !important;
            }
            .fixed {
              position: static !important;
              background: transparent !important;
              padding: 0 !important;
            }
            .overflow-hidden, .overflow-y-auto {
              overflow: visible !important;
              max-height: none !important;
              height: auto !important;
            }
            #growkins-invoice-sheet {
              position: static !important;
              width: 100% !important;
              max-width: 100% !important;
              box-shadow: none !important;
              border: none !important;
              padding: 0 !important;
              margin: 0 auto !important;
              visibility: visible !important;
            }
          }
        `}</style>

      </div>
    </div>
  );
};
