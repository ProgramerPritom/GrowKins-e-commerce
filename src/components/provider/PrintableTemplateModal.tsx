import React, { useState } from 'react';
import { X, Printer, Copy, Check, Heart, Sparkles, Phone, Globe, Star, ShieldCheck } from 'lucide-react';
import { printElement } from '../../utils/printHelper';

interface PrintableTemplateModalProps {
  customerName: string;
  customerPhone?: string;
  orderNumber?: string;
  items?: { name: string; quantity: number }[];
  onClose: () => void;
  initialType?: 'thankyou' | 'greeting';
}

export const PrintableTemplateModal: React.FC<PrintableTemplateModalProps> = ({
  customerName,
  customerPhone,
  orderNumber,
  items,
  onClose,
  initialType = 'thankyou'
}) => {
  const [templateType, setTemplateType] = useState<'thankyou' | 'greeting'>(initialType);
  const [copied, setCopied] = useState<boolean>(false);
  const [customNote, setCustomNote] = useState<string>('');

  const displayName = customerName.trim() || 'সম্মানিত অভিভাবক';

  const handlePrint = () => {
    printElement('printable-card-content', `${displayName} - GrowKins Card`, 'A5');
  };

  const handleCopyText = () => {
    const text = templateType === 'thankyou'
      ? `প্রিয় ${displayName} আপু/ভাইয়া, 💚\n\nআপনার সোনামণির হাসিমুখ ও বুদ্ধিবৃত্তিক বিকাশে GrowKins-এর শিক্ষণীয় কাঠের মন্টেসরি খেলনাগুলো বেছে নেওয়ার জন্য অন্তরের অন্তঃস্থল থেকে ধন্যবাদ।\n\nআমাদের প্রতিটি খেলনা ১০০% মসৃণ প্রাকৃতিক কাঠ ও পরিবেশবান্ধব নন-টক্সিক রঙে তৈরি, যা শিশুর স্ক্রিন-টাইম দূর করে বাস্তব চিন্তাশক্তি বাড়ায়।\n\nপণ্য হাতে পাওয়ার পর কেমন লাগলো আমাদের ফেসবুক পেইজে একটি ৫-স্টার রিভিউ দিয়ে জানাবেন!\nহটলাইন: 01767026831`
      : `প্রিয় ${displayName} আপু/ভাইয়া ও প্রিয় সোনামণি, 🎈🎁\n\nGrowKins পরিবারের পক্ষ থেকে অফুরন্ত ভালোবাসা ও রঙিন শুভেচ্ছা! তোমার প্রতিটি দিন কাটুক হাসিখুশি, আনন্দ আর নতুন নতুন আবিষ্কারে।\n\nবড় হয়ে পৃথিবী জয় করো সোনামণি!\nGrowKins Kids Toy World • 01767026831`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto print:p-0 print:bg-white print:fixed print:inset-0">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[95vh] flex flex-col shadow-2xl border border-gray-200 overflow-hidden print:border-none print:shadow-none print:max-w-none print:max-h-none print:w-full">
        {/* Modal Top Control Bar (Hidden on print) */}
        <div className="p-4 bg-gray-50 border-b border-gray-200 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <div className="flex items-center gap-1.5 bg-gray-200/80 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setTemplateType('thankyou')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                templateType === 'thankyou'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              💚 ধন্যবাদ পত্র (Thank You Card)
            </button>
            <button
              type="button"
              onClick={() => setTemplateType('greeting')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                templateType === 'greeting'
                  ? 'bg-white text-amber-800 shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              🎈 শুভেচ্ছা পত্র (Greeting Card)
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyText}
              className="px-3 py-1.5 rounded-xl bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'কপি হয়েছে' : 'টেক্সট কপি'}</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-1.5 rounded-xl bg-[#2D6A4F] hover:bg-[#245740] text-white text-xs font-black flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>🖨️ প্রিন্ট / PDF সংরক্ষণ</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-700 font-bold transition-colors cursor-pointer ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Card Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 print:p-0 bg-gray-100/60 print:bg-white flex justify-center">
          <div
            id="printable-card-content"
            className={`w-full max-w-[560px] bg-white rounded-3xl p-6 sm:p-8 border-2 shadow-lg print:shadow-none print:border-none print:w-full print:max-w-none space-y-6 ${
              templateType === 'thankyou'
                ? 'border-emerald-200/80 bg-gradient-to-b from-[#FAF7F1] via-white to-[#F0FDF4]'
                : 'border-amber-200/80 bg-gradient-to-b from-[#FFFBEB] via-white to-[#FEF3C7]/40'
            }`}
          >
            {/* Header: Official GrowKins Logo & Cheerful Badge */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-200/80">
              <div className="flex items-center gap-3">
                <img
                  src="/GrowKins_logo.png"
                  alt="GrowKins Logo"
                  className="w-14 h-14 object-contain rounded-2xl bg-white shadow-xs p-1 border border-gray-100"
                  onError={(e) => {
                    // Fallback to text logo if image fails
                    (e.target as any).style.display = 'none';
                  }}
                />
                <div>
                  <h2 className="text-xl font-black text-[#24221F] tracking-tight">
                    Grow<span className="text-[#E76F51]">Kins</span>
                  </h2>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                    Kids Toy World • Bangladesh
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black shadow-xs ${
                  templateType === 'thankyou'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-amber-100 text-amber-900 border border-amber-300'
                }`}>
                  {templateType === 'thankyou' ? (
                    <>
                      <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                      <span>ধন্যবাদ পত্র</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>রঙিন শুভেচ্ছা</span>
                    </>
                  )}
                </span>
                {orderNumber && (
                  <p className="text-[10px] font-bold text-gray-400 mt-1">অর্ডার নং #{orderNumber}</p>
                )}
                {customerPhone && (
                  <p className="text-[10px] font-medium text-gray-400">ফোন: {customerPhone}</p>
                )}
              </div>
            </div>

            {/* Salutation */}
            <div>
              <p className="text-sm font-black text-gray-800">
                প্রিয় <span className="text-[#E76F51] underline underline-offset-4 decoration-wavy decoration-[#E76F51]/40">{displayName}</span> আপু/ভাইয়া, 💚
              </p>
            </div>

            {/* Main Emotional & Child Development Message */}
            {templateType === 'thankyou' ? (
              <div className="space-y-3.5 text-xs text-gray-700 leading-relaxed">
                <p className="text-[13px] font-bold text-gray-800">
                  আপনার সোনামণির হাসিমুখ ও বুদ্ধিবৃত্তিক বিকাশের রোমাঞ্চকর যাত্রায় <span className="text-[#2D6A4F] font-black">GrowKins</span>-এর কাঠের মন্টেসরি শিক্ষণীয় খেলনাগুলো বেছে নেওয়ার জন্য আমাদের অন্তরের অন্তঃস্থল থেকে অফুরন্ত ভালোবাসা ও ধন্যবাদ!
                </p>

                <p>
                  আমাদের প্রতিটি খেলনা শিশুদের নরম আঙুলের মাপ অনুযায়ী <span className="font-bold text-gray-900">১০০% মসৃণ প্রাকৃতিক কাঠ ও পরিবেশবান্ধব ওয়াটার বেসড রঙে</span> তৈরি। এতে কোনো বিষাক্ত প্লাস্টিক নেই—যা আপনার সন্তানের ক্ষতিকর স্ক্রিন-টাইমের আসক্তি কমিয়ে শান্ত ও সৃজনশীল খেলার আনন্দ দেবে।
                </p>

                {items && items.length > 0 && (
                  <div className="bg-white/80 p-3 rounded-2xl border border-emerald-100 space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-wider text-emerald-800">
                      আপনার পার্সেলের খেলনাসমূহ:
                    </p>
                    <ul className="list-disc list-inside text-[11px] text-gray-700 font-semibold space-y-0.5">
                      {items.map((it, idx) => (
                        <li key={idx} className="truncate">
                          {it.name} (পরিমাণ: {it.quantity} টি)
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3.5 text-xs text-gray-700 leading-relaxed">
                <p className="text-[13px] font-bold text-gray-800">
                  প্রিয় সোনামণির জন্য GrowKins পরিবারের পক্ষ থেকে রইল হৃদয়গ্রাহী শুভেচ্ছা ও একরাশ ভালোবাসা! 🎈🎁
                </p>
                <p>
                  আজকের এই রঙিন খেলনাটি দিয়ে খেলতে খেলতে তোমার কল্পনাশক্তি আর চিন্তার জগৎ আরও প্রসারিত হোক। নতুন নতুন চ্যালেঞ্জ জয় করো, হাসিখুশি থেকো এবং সবসময় মা-বাবার মুখ উজ্জ্বল করো!
                </p>
                <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-center font-bold text-amber-900 text-xs">
                  “প্রতিটি শিশুর হাসিই পৃথিবীর সবচেয়ে সুন্দর অলংকার।” ✨
                </div>
              </div>
            )}

            {/* Optional Custom Note / Wish */}
            {customNote && (
              <div className="p-3 bg-blue-50/80 rounded-2xl border border-blue-200 text-xs text-blue-900">
                <span className="font-black">বিশেষ বার্তা: </span>
                <span>{customNote}</span>
              </div>
            )}

            {/* Tips & Safety Box */}
            <div className="bg-white p-3.5 rounded-2xl border border-gray-200/80 space-y-2 text-[11px]">
              <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>খেলনার যত্ন ও শিশুর খেলার টিপস:</span>
              </div>
              <ul className="text-gray-600 space-y-1 leading-normal pl-1">
                <li>• খেলনাগুলো পরিষ্কার রাখতে শুকনো বা হালকা ভেজা নরম সুতি কাপড় দিয়ে মুছে রাখুন।</li>
                <li>• শিশুকে জোর না করে তাকে নিজ কল্পনামতো স্বাধীনভাবে মেকানিজমগুলো এক্সপ্লোর করতে দিন।</li>
              </ul>
            </div>

            {/* Review Invitation & Star Ratings */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200/80 text-xs">
              <div className="space-y-0.5 text-center sm:text-left">
                <p className="font-extrabold text-emerald-950 text-xs flex items-center justify-center sm:justify-start gap-1">
                  <span>আপনার অনুভূতি আমাদের সাথে শেয়ার করুন!</span>
                  <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
                </p>
                <p className="text-[10px] text-emerald-800 font-medium">
                  বাচ্চার খেলার একটি ছবি বা ভিডিও আমাদের ফেসবুক পেইজে শেয়ার করে ৫-স্টার রিভিউ দিন
                </p>
              </div>
              <div className="flex items-center gap-0.5 text-amber-400 shrink-0">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
            </div>

            {/* Footer: Contacts & Socials */}
            <div className="pt-3 border-t border-gray-200/80 flex flex-wrap items-center justify-between gap-2 text-[10px] font-bold text-gray-500">
              <div className="flex items-center gap-1 text-gray-700">
                <Phone className="w-3.5 h-3.5 text-[#E76F51]" />
                <span>হটলাইন: <strong className="text-gray-900 font-black">01767026831</strong></span>
              </div>
              <div className="flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-blue-500" />
                <span>ফেসবুক: fb.com/GrowKinsBD</span>
              </div>
              <div>
                <span>www.growkins.vercel.app</span>
              </div>
            </div>
          </div>
        </div>

        {/* Custom Note input at bottom (Hidden on print) */}
        <div className="p-3 bg-gray-50 border-t border-gray-200 flex items-center gap-2 print:hidden">
          <input
            type="text"
            value={customNote}
            onChange={(e) => setCustomNote(e.target.value)}
            placeholder="প্রিন্টের আগে কোনো অতিরিক্ত শুভেচ্ছা বা বিশেষ নোট লিখতে চাইলে এখানে লিখুন..."
            className="flex-1 px-3.5 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#E76F51] bg-white"
          />
        </div>
      </div>

      {/* Strict Print CSS */}
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
          #printable-card-content {
            position: static !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 auto !important;
            padding: 16px !important;
            border: none !important;
            box-shadow: none !important;
            background: white !important;
            visibility: visible !important;
          }
          @page {
            size: A5 portrait;
            margin: 8mm;
          }
        }
      `}</style>
    </div>
  );
};
