import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FamilyWalkthroughOverlayProps {
  walkProgress: number; // 0 to 1
  isWalking: boolean;
}

interface Dialogue {
  speaker: 'mother' | 'daughter' | 'son';
  name: string;
  avatar: string;
  text: string;
}

export const FamilyWalkthroughOverlay: React.FC<FamilyWalkthroughOverlayProps> = ({
  walkProgress,
  isWalking,
}) => {
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState<number>(0);
  const [showBubble, setShowBubble] = useState<boolean>(true);

  // Scripted dialogues that progress as the family walks down the toy store aisle
  const dialogues: Dialogue[] = [
    {
      speaker: 'mother',
      name: 'আম্মু',
      avatar: '👩',
      text: 'দেখো সোনামনিরা, গ্রো কিন্সে কত চমৎকার ও শিক্ষণীয় খেলনা!',
    },
    {
      speaker: 'daughter',
      name: 'ছোট্ট মেহক',
      avatar: '👧',
      text: 'আম্মু! ওই বিজি কিউব আর ম্যাগনেটিক ব্লকটা দেখো, কি সুন্দর!',
    },
    {
      speaker: 'son',
      name: 'ছোট্ট আয়ান',
      avatar: '👦',
      text: 'ওয়াও! পাঞ্চিং ব্যাগ আর ফিশিং বোর্ড গেমটা আমি ট্রাই করব!',
    },
    {
      speaker: 'mother',
      name: 'আম্মু',
      avatar: '👩',
      text: 'যেকোনো খেলনায় ক্লিক করে ভিডিও ও বিবরণ দেখে বাস্কেটে নাও!',
    },
    {
      speaker: 'daughter',
      name: 'ছোট্ট মেহক',
      avatar: '👧',
      text: 'আম্মু, আমি কি এটা বন্ধুদের সাথে নিয়ে খেলতে পারব?',
    },
    {
      speaker: 'son',
      name: 'ছোট্ট আয়ান',
      avatar: '👦',
      text: 'হ্যাঁ আপু! আর এটা একদম নিরাপদ ও টেকসই উপাদান দিয়ে তৈরি!',
    },
  ];

  // Rotate dialogues dynamically based on aisle walking progress
  useEffect(() => {
    const idx = Math.min(
      dialogues.length - 1,
      Math.floor(walkProgress * dialogues.length)
    );
    setCurrentDialogueIndex(idx);
    setShowBubble(true);
  }, [walkProgress, dialogues.length]);

  // Periodic subtle dialogue pulse
  const activeDialogue = dialogues[currentDialogueIndex];

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-center justify-end pb-1 sm:pb-2 z-20 overflow-hidden">
      {/* Speech Bubble Floating Above Family */}
      <AnimatePresence mode="wait">
        {showBubble && activeDialogue && (
          <motion.div
            key={currentDialogueIndex}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="pointer-events-auto mb-1 max-w-[90vw] sm:max-w-sm bg-white/95 backdrop-blur-md rounded-2xl px-3.5 py-2 shadow-xl border border-[#E76F51]/40 text-[#24221F] flex items-center gap-2.5 cursor-pointer hover:border-[#E76F51] transition-all"
            onClick={() => {
              setCurrentDialogueIndex((prev) => (prev + 1) % dialogues.length);
            }}
          >
            {/* Avatar badge */}
            <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-lg shrink-0 border border-amber-200">
              {activeDialogue.avatar}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black text-[#E76F51] uppercase">
                  {activeDialogue.name}
                </span>
                <span className="text-[9px] text-gray-500 font-bold">
                  ক্লিক করে পরটা শুনুন 💬
                </span>
              </div>
              <p className="text-xs font-bold text-gray-800 leading-tight mt-0.5">
                "{activeDialogue.text}"
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mother and Two Kids (Walking Animation Rig) */}
      <motion.div
        animate={
          isWalking
            ? {
                y: [0, -4, 0],
                transition: { repeat: Infinity, duration: 0.45, ease: 'easeInOut' },
              }
            : {
                y: [0, -1.5, 0],
                transition: { repeat: Infinity, duration: 2.2, ease: 'easeInOut' },
              }
        }
        className="relative flex items-end justify-center select-none"
        style={{ width: '250px', height: '130px' }}
      >
        <svg
          viewBox="0 0 320 180"
          className="w-full h-full filter drop-shadow-[0_12px_18px_rgba(0,0,0,0.18)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle Ground Shadows */}
          <ellipse cx="90" cy="172" rx="30" ry="6" fill="#24221F" fillOpacity="0.18" />
          <ellipse cx="160" cy="174" rx="42" ry="7" fill="#24221F" fillOpacity="0.22" />
          <ellipse cx="230" cy="172" rx="30" ry="6" fill="#24221F" fillOpacity="0.18" />

          {/* ================= 1. DAUGHTER (Left, holding Mother's hand) ================= */}
          <g transform="translate(60, 55)">
            {/* Legs */}
            <line x1="22" y1="95" x2="16" y2="115" stroke="#F4A261" strokeWidth="5" strokeLinecap="round" />
            <line x1="32" y1="95" x2="38" y2="115" stroke="#F4A261" strokeWidth="5" strokeLinecap="round" />
            {/* Shoes */}
            <ellipse cx="14" cy="116" rx="5" ry="3" fill="#E76F51" />
            <ellipse cx="40" cy="116" rx="5" ry="3" fill="#E76F51" />
            {/* Dress / Body */}
            <path d="M18 55 L36 55 L44 95 L10 95 Z" fill="#F28F79" />
            <path d="M12 70 Q27 82 42 70" stroke="#FAF7F1" strokeWidth="2" strokeDasharray="3 3" />
            {/* Left Arm (raised/holding Mom's hand) */}
            <path d="M34 60 Q55 68 75 72" stroke="#F4A261" strokeWidth="4" strokeLinecap="round" />
            {/* Head & Hair */}
            <circle cx="27" cy="35" r="15" fill="#FCEADE" />
            {/* Cute twin pigtails with bows */}
            <path d="M14 26 Q8 18 16 14 Q22 20 18 28 Z" fill="#4A2E18" />
            <path d="M40 26 Q46 18 38 14 Q32 20 36 28 Z" fill="#4A2E18" />
            <circle cx="17" cy="24" r="3" fill="#F4A261" />
            <circle cx="37" cy="24" r="3" fill="#F4A261" />
            {/* Hair back */}
            <path d="M14 34 C12 22 42 22 40 34 C36 26 18 26 14 34 Z" fill="#4A2E18" />
            {/* Hair ribbon */}
            <ellipse cx="27" cy="22" rx="12" ry="4" fill="#E76F51" />
            {/* Face details (seen from rear-profile looking into shop) */}
            <circle cx="34" cy="34" r="2" fill="#E76F51" fillOpacity="0.4" />
          </g>

          {/* ================= 2. MOTHER (Center, tall & loving) ================= */}
          <g transform="translate(125, 10)">
            {/* Legs */}
            <line x1="28" y1="125" x2="24" y2="160" stroke="#FCEADE" strokeWidth="6" strokeLinecap="round" />
            <line x1="42" y1="125" x2="46" y2="160" stroke="#FCEADE" strokeWidth="6" strokeLinecap="round" />
            {/* Elegant flats */}
            <ellipse cx="22" cy="161" rx="7" ry="3.5" fill="#2D6A4F" />
            <ellipse cx="48" cy="161" rx="7" ry="3.5" fill="#2D6A4F" />
            {/* Traditional / Modern Elegant Kurti Dress */}
            <path d="M22 65 Q35 60 48 65 L58 130 L12 130 Z" fill="#2D6A4F" />
            {/* Dupatta drape accent */}
            <path d="M18 68 Q28 95 44 125" stroke="#F7E198" strokeWidth="4" strokeLinecap="round" fill="none" />
            {/* Left Hand holding daughter */}
            <path d="M18 72 Q0 95 10 115" stroke="#FCEADE" strokeWidth="4.5" strokeLinecap="round" />
            {/* Right Hand holding son */}
            <path d="M52 72 Q70 95 60 115" stroke="#FCEADE" strokeWidth="4.5" strokeLinecap="round" />
            {/* Head & Elegant Hair Bun */}
            <circle cx="35" cy="40" r="18" fill="#FCEADE" />
            {/* Long black hair with neat bun */}
            <path d="M18 42 C16 24 54 24 52 42 C48 30 22 30 18 42 Z" fill="#24221F" />
            <circle cx="35" cy="22" r="10" fill="#24221F" />
            <circle cx="35" cy="22" r="3" fill="#F7E198" />
          </g>

          {/* ================= 3. SON (Right, holding Mother's hand) ================= */}
          <g transform="translate(205, 50)">
            {/* Legs with shorts */}
            <line x1="20" y1="95" x2="16" y2="120" stroke="#FCEADE" strokeWidth="5.5" strokeLinecap="round" />
            <line x1="32" y1="95" x2="36" y2="120" stroke="#FCEADE" strokeWidth="5.5" strokeLinecap="round" />
            {/* Sneakers */}
            <ellipse cx="14" cy="121" rx="6" ry="3.5" fill="#264653" />
            <ellipse cx="38" cy="121" rx="6" ry="3.5" fill="#264653" />
            {/* Shorts */}
            <path d="M14 78 L38 78 L42 98 L10 98 Z" fill="#264653" />
            {/* Polo T-Shirt */}
            <path d="M12 55 Q26 50 40 55 L42 80 L10 80 Z" fill="#E76F51" />
            {/* Hand holding Mother's hand */}
            <path d="M12 60 Q-8 75 -15 75" stroke="#FCEADE" strokeWidth="4" strokeLinecap="round" />
            {/* Head & Boy Hair */}
            <circle cx="26" cy="35" r="16" fill="#FCEADE" />
            <path d="M12 34 C10 18 42 18 40 34 C36 24 16 24 12 34 Z" fill="#3D2B1F" />
            {/* Cap/Cap peak */}
            <ellipse cx="26" cy="24" rx="14" ry="5" fill="#2A9D8F" />
          </g>
        </svg>
      </motion.div>
    </div>
  );
};
