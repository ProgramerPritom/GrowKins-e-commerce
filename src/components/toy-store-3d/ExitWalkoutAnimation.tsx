import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, Truck, ArrowRight, 
  Copy, Check, Sparkles, RefreshCw 
} from 'lucide-react';
import { CelebrationFirecrackers } from '../toy-world/CelebrationFirecrackers';

interface ExitWalkoutAnimationProps {
  confirmedOrder: any;
  onRestart: () => void;
}

export const ExitWalkoutAnimation: React.FC<ExitWalkoutAnimationProps> = ({
  confirmedOrder,
  onRestart,
}) => {
  const [copiedOrderId, setCopiedOrderId] = useState<boolean>(false);

  const handleCopyOrderId = () => {
    if (!confirmedOrder?.orderNumber) return;
    navigator.clipboard.writeText(confirmedOrder.orderNumber);
    setCopiedOrderId(true);
    setTimeout(() => setCopiedOrderId(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#FAF7F1]/98 backdrop-blur-md flex flex-col justify-between overflow-y-auto overflow-x-hidden selection:bg-[#E76F51]/20">
      {/* Background celebration firecrackers / confetti */}
      <CelebrationFirecrackers />

      {/* Top Notice */}
      <div className="w-full bg-[#2D6A4F] text-[#FAF7F1] py-2.5 px-4 text-center text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-md relative z-10">
        <Sparkles className="w-4 h-4 text-[#F7E198] animate-pulse" />
        <span>🎉 অভিনন্দন! আপনার খেলনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে!</span>
      </div>

      {/* Main Center Stage: Family Joyfully Walking Out with Bags */}
      <div className="w-full max-w-4xl mx-auto px-4 py-8 flex flex-col items-center justify-center text-center relative z-10 my-auto">
        {/* Animated Celebration Badge */}
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', damping: 14, stiffness: 200 }}
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-[#2D6A4F] to-[#52B788] text-white flex items-center justify-center shadow-2xl mb-4 border-4 border-white"
        >
          <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12" />
        </motion.div>

        <h1 className="text-2xl sm:text-4xl font-black text-[#24221F] tracking-tight">
          ধন্যবাদ গ্রো কিন্স টয় ওয়ার্ল্ডে আসার জন্য!
        </h1>
        <p className="text-xs sm:text-base text-gray-600 mt-2 max-w-lg">
          আপনার সোনামনির জন্য পছন্দের খেলনাটি প্যাকেজিং শুরু হয়েছে। খুব শীঘ্রই আমাদের রাইডার আপনার ঠিকানায় পৌঁছে দেবে।
        </p>

        {/* ================= Family Walking Out Rig with Shopping Bags ================= */}
        <div className="my-8 relative w-full max-w-md h-52 sm:h-64 flex items-end justify-center select-none">
          {/* Joyful Speech Bubbles */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="absolute top-0 inset-x-0 flex items-center justify-center gap-2"
          >
            <div className="bg-white/95 rounded-2xl px-3.5 py-1.5 shadow-lg border border-[#E76F51]/30 text-xs font-black text-gray-800 flex items-center gap-1.5">
              <span>👧</span>
              <span>"বাসায় গিয়েই খেলব!"</span>
            </div>
            <div className="bg-white/95 rounded-2xl px-3.5 py-1.5 shadow-lg border border-[#2D6A4F]/30 text-xs font-black text-gray-800 flex items-center gap-1.5">
              <span>👦</span>
              <span>"থ্যাংক ইউ আম্মু!"</span>
            </div>
          </motion.div>

          {/* SVG Character Group (Walking Forward Toward Customer/Exit with GrowKins Bags) */}
          <motion.div
            animate={{
              y: [0, -8, 0],
              scale: [1, 1.02, 1],
            }}
            transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
            className="w-full h-44 sm:h-52 relative flex items-center justify-center"
          >
            <svg
              viewBox="0 0 340 180"
              className="w-full h-full filter drop-shadow-[0_12px_20px_rgba(0,0,0,0.15)]"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Ground Shadow */}
              <ellipse cx="170" cy="172" rx="100" ry="8" fill="#24221F" fillOpacity="0.2" />

              {/* DAUGHTER (Left, holding gift box) */}
              <g transform="translate(65, 50)">
                <ellipse cx="25" cy="116" rx="5" ry="3" fill="#E76F51" />
                <ellipse cx="40" cy="116" rx="5" ry="3" fill="#E76F51" />
                <line x1="25" y1="95" x2="25" y2="115" stroke="#F4A261" strokeWidth="5" />
                <line x1="40" y1="95" x2="40" y2="115" stroke="#F4A261" strokeWidth="5" />
                <path d="M18 55 L46 55 L52 95 L12 95 Z" fill="#F28F79" />
                <circle cx="32" cy="35" r="16" fill="#FCEADE" />
                {/* Smiling happy face */}
                <circle cx="28" cy="33" r="2" fill="#24221F" />
                <circle cx="36" cy="33" r="2" fill="#24221F" />
                <path d="M28 40 Q32 44 36 40" stroke="#24221F" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="25" cy="37" r="2" fill="#E76F51" fillOpacity="0.4" />
                <circle cx="39" cy="37" r="2" fill="#E76F51" fillOpacity="0.4" />
                {/* Hair */}
                <path d="M16 26 Q10 18 18 14 Q24 20 20 28 Z" fill="#4A2E18" />
                <path d="M44 26 Q50 18 42 14 Q36 20 40 28 Z" fill="#4A2E18" />
                {/* Gift Box with Ribbon */}
                <rect x="0" y="65" width="22" height="20" rx="3" fill="#F4A261" />
                <line x1="11" y1="65" x2="11" y2="85" stroke="#FAF7F1" strokeWidth="2.5" />
                <line x1="0" y1="75" x2="22" y2="75" stroke="#FAF7F1" strokeWidth="2.5" />
                <circle cx="11" cy="65" r="3" fill="#E76F51" />
              </g>

              {/* MOTHER (Center, holding 2 GrowKins bags) */}
              <g transform="translate(135, 12)">
                <line x1="28" y1="125" x2="28" y2="160" stroke="#FCEADE" strokeWidth="6" strokeLinecap="round" />
                <line x1="44" y1="125" x2="44" y2="160" stroke="#FCEADE" strokeWidth="6" strokeLinecap="round" />
                <ellipse cx="28" cy="161" rx="7" ry="3.5" fill="#2D6A4F" />
                <ellipse cx="44" cy="161" rx="7" ry="3.5" fill="#2D6A4F" />
                {/* Dress */}
                <path d="M22 65 Q36 60 50 65 L60 130 L12 130 Z" fill="#2D6A4F" />
                {/* Gold dupatta */}
                <path d="M18 68 Q28 95 44 125" stroke="#F7E198" strokeWidth="4" strokeLinecap="round" fill="none" />
                {/* Head */}
                <circle cx="36" cy="40" r="18" fill="#FCEADE" />
                <circle cx="31" cy="38" r="2" fill="#24221F" />
                <circle cx="41" cy="38" r="2" fill="#24221F" />
                <path d="M32 46 Q36 50 40 46" stroke="#24221F" strokeWidth="1.5" strokeLinecap="round" />
                {/* Hair */}
                <path d="M18 36 C18 18 54 18 54 36 Z" fill="#24221F" />
                <circle cx="36" cy="20" r="9" fill="#24221F" />
                {/* Left Shopping Bag (GrowKins Branded) */}
                <path d="M-8 80 L8 80 L6 115 L-6 115 Z" fill="#E76F51" />
                <path d="M-4 80 Q0 68 4 80" stroke="#FAF7F1" strokeWidth="2" fill="none" />
                <text x="-2" y="98" fill="#FFFFFF" fontSize="6" fontWeight="bold">GK</text>
                {/* Right Shopping Bag */}
                <path d="M64 80 L80 80 L78 115 L66 115 Z" fill="#2A9D8F" />
                <path d="M68 80 Q72 68 76 80" stroke="#FAF7F1" strokeWidth="2" fill="none" />
                <text x="70" y="98" fill="#FFFFFF" fontSize="6" fontWeight="bold">GK</text>
              </g>

              {/* SON (Right, holding a toy shopping bag) */}
              <g transform="translate(225, 48)">
                <line x1="20" y1="95" x2="20" y2="120" stroke="#FCEADE" strokeWidth="5.5" strokeLinecap="round" />
                <line x1="34" y1="95" x2="34" y2="120" stroke="#FCEADE" strokeWidth="5.5" strokeLinecap="round" />
                <ellipse cx="20" cy="121" rx="6" ry="3.5" fill="#264653" />
                <ellipse cx="34" cy="121" rx="6" ry="3.5" fill="#264653" />
                <path d="M14 78 L40 78 L44 98 L10 98 Z" fill="#264653" />
                <path d="M12 55 Q27 50 42 55 L44 80 L10 80 Z" fill="#E76F51" />
                {/* Head */}
                <circle cx="27" cy="35" r="16" fill="#FCEADE" />
                <circle cx="23" cy="33" r="2" fill="#24221F" />
                <circle cx="31" cy="33" r="2" fill="#24221F" />
                <path d="M23 40 Q27 44 31 40" stroke="#24221F" strokeWidth="1.5" strokeLinecap="round" />
                <ellipse cx="27" cy="24" rx="14" ry="5" fill="#2A9D8F" />
                {/* Small shopping bag */}
                <path d="M48 70 L64 70 L62 96 L50 96 Z" fill="#F7E198" />
                <path d="M52 70 Q56 60 60 70" stroke="#24221F" strokeWidth="1.5" fill="none" />
                <text x="53" y="84" fill="#24221F" fontSize="6" fontWeight="bold">TOY</text>
              </g>
            </svg>
          </motion.div>
        </div>

        {/* ================= Order Summary Card ================= */}
        <div className="w-full max-w-lg bg-white rounded-3xl p-5 sm:p-6 shadow-xl border border-[#E8E0D2] text-left space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <span className="text-[11px] font-black text-gray-600 uppercase tracking-wider block">
                অর্ডার ট্র্যাকিং নম্বর
              </span>
              <span className="text-base font-black text-[#24221F]">
                {confirmedOrder?.orderNumber || 'GK-3D-CONFIRMED'}
              </span>
            </div>
            <button
              type="button"
              onClick={handleCopyOrderId}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-700 transition-colors cursor-pointer"
            >
              {copiedOrderId ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">কপি হয়েছে</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>কপি করুন</span>
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-gray-600 block">গ্রাহকের নাম:</span>
              <span className="font-black text-gray-800">
                {confirmedOrder?.customerName || 'গ্রাহক'}
              </span>
            </div>
            <div>
              <span className="text-gray-600 block">মোবাইল নম্বর:</span>
              <span className="font-black text-gray-800">
                {confirmedOrder?.customerPhone || '01XXXXXXXXX'}
              </span>
            </div>
            <div className="col-span-2">
              <span className="text-gray-600 block">ডেলিভারি ঠিকানা:</span>
              <span className="font-semibold text-gray-800">
                {confirmedOrder?.address || 'বাংলাদেশ'}
              </span>
            </div>
            <div>
              <span className="text-gray-600 block">পেমেন্ট মেথড:</span>
              <span className="font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md inline-block">
                ক্যাশ অন ডেলিভারি
              </span>
            </div>
            <div>
              <span className="text-gray-600 block">সর্বমোট প্রদেয়:</span>
              <span className="font-black text-[#E76F51] text-sm">
                ৳{confirmedOrder?.total || 0}
              </span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center gap-2.5 text-xs text-amber-900 font-semibold">
            <Truck className="w-4 h-4 text-[#E76F51] shrink-0" />
            <span>
              আমাদের প্রতিনিধি খুব দ্রুত আপনার সাথে ফোনে যোগাযোগ করে ডেলিভারি নিশ্চিত করবেন।
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mt-6 w-full max-w-lg">
          <button
            type="button"
            onClick={onRestart}
            className="w-full sm:flex-1 py-3 px-5 rounded-2xl bg-gradient-to-r from-[#E76F51] to-[#F4A261] text-white font-black text-sm shadow-lg hover:shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>আবার ৩ডি স্টোর ঘুরুন</span>
          </button>
          <a
            href="/growkins-toy-world"
            className="w-full sm:flex-1 py-3 px-5 rounded-2xl bg-white border border-[#E8E0D2] hover:bg-gray-50 text-gray-800 font-bold text-sm shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>সাধারণ ল্যান্ডিং পেজ দেখুন</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};
