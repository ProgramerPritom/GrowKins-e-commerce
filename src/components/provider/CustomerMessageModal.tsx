import React, { useState } from 'react';
import { X, Copy, Check, MessageSquare, Send, Heart, Sparkles, Phone, ExternalLink } from 'lucide-react';

interface CustomerMessageModalProps {
  customer: {
    name: string;
    phone: string;
    district?: string;
    totalSpent?: number;
    itemsBought?: { name: string; quantity: number }[];
    ordersCount?: number;
    latestOrderNumber?: string;
  };
  onClose: () => void;
}

export const CustomerMessageModal: React.FC<CustomerMessageModalProps> = ({
  customer,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'greeting' | 'delivery' | 'repeatOffer'>('greeting');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const displayName = customer.name.trim() || 'সম্মানিত অভিভাবক';
  const cleanPhone = customer.phone.replace(/[^0-9]/g, '');
  const waNumber = cleanPhone.startsWith('88') ? cleanPhone : (cleanPhone.startsWith('0') ? `88${cleanPhone}` : `880${cleanPhone}`);

  const itemsSummary = customer.itemsBought && customer.itemsBought.length > 0
    ? customer.itemsBought.map(it => `• ${it.name} (${it.quantity} টি)`).join('\n')
    : '• GrowKins শিক্ষণীয় মন্টেসরি কাঠের খেলনা';

  // 1. Order Confirmation & Greeting Template
  const greetingTemplate = `আসসালামু আলাইকুম ${displayName} আপু/ভাইয়া! 💚
GrowKins Toy World-এ আপনার অর্ডারটি আনন্দের সাথে গ্রহণ করা হয়েছে। 

📦 আপনার অর্ডারকৃত খেলনাসমূহ:
${itemsSummary}

🚚 ডেলিভারি পার্সেল খুব শীঘ্রই আপনার ঠিকানায় পৌঁছে দেওয়া হবে। পার্সেল হাতে পেয়ে খুলে দেখে তারপর মূল্য পরিশোধ করবেন (Cash on Delivery)। 

আপনার সোনামণির হাসিমুখ ও বুদ্ধিবৃত্তিক বিকাশের প্রতিটি ধাপে GrowKins থাকুক আপনার পাশে! 🌱
হটলাইন: 01767026831
ধন্যবাদ! 💚`;

  // 2. Delivery Tracking & Thank You Template
  const deliveryTemplate = `প্রিয় ${displayName} আপু/ভাইয়া, 💚
আপনার সোনামণির বুদ্ধিবৃত্তিক বিকাশে GrowKins-এর ১০০% মসৃণ ও পরিবেশবান্ধব কাঠের মন্টেসরি খেলনাগুলো বেছে নেওয়ার জন্য আন্তরিক ধন্যবাদ!

আপনার পার্সেলটি সুন্দরভাবে প্যাকেজিং করে ডেলিভারির জন্য পাঠানো হয়েছে। 
পণ্য হাতে পাওয়ার পর সোনামণির কেমন লাগলো এবং আপনার মূল্যবান অভিজ্ঞতা আমাদের ফেসবুক পেইজে একটি ৫-স্টার রিভিউ দিয়ে জানাবেন! ⭐⭐⭐⭐⭐

যেকোনো সহায়তায় আমাদের হটলাইনে কল করতে পারেন: 01767026831
GrowKins Kids Toy World 🎈`;

  // 3. Repeat & Loyal Customer Exclusive Offer Template
  const repeatOfferTemplate = `প্রিয় ${displayName} আপু/ভাইয়া ও সোনামণি, 👑💚
GrowKins-এর একজন নিয়মিত ও সম্মানিত অভিভাবক হওয়ার জন্য আপনাকে বিশেষ শুভেচ্ছা!

আপনার সোনামণির বয়সের সাথে মানানসই নতুন কিছু আকর্ষণীয় কাঠের পাজল ও মন্টেসরি ব্রেন-ডেভেলপমেন্ট খেলনা আমাদের কালেকশনে যুক্ত হয়েছে।
আমাদের নিয়মিত কাস্টমার হিসেবে আপনার পরবর্তী যেকোনো অর্ডারে পাচ্ছেন ফ্রি ডেলিভারি ও বিশেষ সারপ্রাইজ গিফট! 🎁

নতুন খেলনাসমূহ দেখতে ভিজিট করুন: https://growkins.vercel.app/growkins-toy-world
হটলাইন / হোয়াটসঅ্যাপ: 01767026831
GrowKins Family 🌱`;

  const getCurrentMessage = () => {
    switch (activeTab) {
      case 'greeting':
        return greetingTemplate;
      case 'delivery':
        return deliveryTemplate;
      case 'repeatOffer':
        return repeatOfferTemplate;
      default:
        return greetingTemplate;
    }
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleOpenWhatsApp = (text: string) => {
    const encoded = encodeURIComponent(text);
    const url = `https://wa.me/${waNumber}?text=${encoded}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full flex flex-col shadow-2xl border border-gray-100 overflow-hidden animate-in zoom-in-95">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-700 via-teal-700 to-[#E76F51] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-black tracking-tight">
                গ্রাহক যোগাযোগ ও মেসেজ টেমপ্লেট
              </h3>
              <p className="text-[11px] text-white/80">
                {displayName} • {customer.phone}
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

        {/* Tab Selector */}
        <div className="p-3 bg-gray-50 border-b border-gray-200 flex flex-wrap gap-2 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('greeting')}
            className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'greeting'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>১. অর্ডার ও শুভেচ্ছা বার্তা</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('delivery')}
            className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'delivery'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>২. ডেলিভারি ও ধন্যবাদ বার্তা</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('repeatOffer')}
            className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'repeatOffer'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>৩. রিপিট কাস্টমার বিশেষ অফার</span>
          </button>
        </div>

        {/* Message Preview Box */}
        <div className="p-4 sm:p-6 space-y-4 text-xs">
          <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100 space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-emerald-200/60">
              <span className="font-extrabold text-emerald-950 flex items-center gap-1.5">
                <Send className="w-3.5 h-3.5 text-emerald-600" />
                <span>মেসেজ প্রিভিউ (WhatsApp / SMS / Facebook Messenger)</span>
              </span>
              <span className="text-[10px] font-bold text-emerald-700 bg-white px-2 py-0.5 rounded-full border border-emerald-200">
                GrowKins CRM
              </span>
            </div>
            <pre className="text-gray-800 font-sans whitespace-pre-wrap leading-relaxed text-xs">
              {getCurrentMessage()}
            </pre>
          </div>

          {/* Quick Direct Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-gray-100">
            <a
              href={`tel:${cleanPhone}`}
              className="inline-flex items-center gap-1.5 text-blue-600 font-bold hover:underline text-xs"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>মোবাইলে কল দিন: {customer.phone}</span>
            </a>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => handleCopy(getCurrentMessage(), activeTab)}
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              >
                {copiedKey === activeTab ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-700 font-extrabold">কপি হয়েছে!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>মেসেজ কপি করুন</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => handleOpenWhatsApp(getCurrentMessage())}
                className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
              >
                <ExternalLink className="w-4 h-4" />
                <span>WhatsApp এ পাঠান</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
