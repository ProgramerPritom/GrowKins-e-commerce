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

  const dialogues: Dialogue[] = [
    {
      speaker: 'mother',
      name: 'আম্মু',
      avatar: '👩',
      text: 'দেখো সোনামনিরা, গ্রো কিন্সে কত সুন্দর ও শিক্ষণীয় খেলনা!',
    },
    {
      speaker: 'daughter',
      name: 'ছোট্ট মেহক',
      avatar: '👧',
      text: 'আম্মু! ওই বিজি কিউব আর ম্যাগনেটিক ব্লকটা দেখো, কি দারুণ!',
    },
    {
      speaker: 'son',
      name: 'ছোট্ট আয়ান',
      avatar: '👦',
      text: 'ওয়াও! পাঞ্চিং ব্যাগ আর পাজল বোর্ডটা আমি খেলব!',
    },
    {
      speaker: 'mother',
      name: 'আম্মু',
      avatar: '👩',
      text: 'যেকোনো খেলনায় ক্লিক করে ভিডিও ডেমো দেখে বাস্কেটে নাও!',
    },
    {
      speaker: 'daughter',
      name: 'ছোট্ট মেহক',
      avatar: '👧',
      text: 'আম্মু, এগুলো তো ১০০% নিরাপদ কাঠের তৈরি, তাই না?',
    },
    {
      speaker: 'son',
      name: 'ছোট্ট আয়ান',
      avatar: '👦',
      text: 'হ্যাঁ আপু! চল ওইদিকের সেলফে যেয়ে আরও খেলনা দেখি!',
    },
  ];

  useEffect(() => {
    const idx = Math.min(
      dialogues.length - 1,
      Math.floor(walkProgress * dialogues.length)
    );
    setCurrentDialogueIndex(idx);
    setShowBubble(true);
  }, [walkProgress, dialogues.length]);

  const activeDialogue = dialogues[currentDialogueIndex];

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-center justify-end pb-0 z-20 overflow-hidden">
      {/* Speech Bubble Floating Above Mother */}
      <AnimatePresence mode="wait">
        {showBubble && activeDialogue && (
          <motion.div
            key={currentDialogueIndex}
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="pointer-events-auto mb-2 max-w-[92vw] sm:max-w-md bg-white/95 backdrop-blur-md rounded-2xl px-4 py-2.5 shadow-2xl border-2 border-[#E76F51]/50 text-[#24221F] flex items-center gap-3 cursor-pointer hover:border-[#E76F51] transition-all"
            onClick={() => {
              setCurrentDialogueIndex((prev) => (prev + 1) % dialogues.length);
            }}
          >
            <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-xl shrink-0 shadow-inner border border-amber-200">
              {activeDialogue.avatar}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-[#E76F51] uppercase tracking-wide">
                  {activeDialogue.name}
                </span>
                <span className="text-[10px] text-gray-500 font-bold bg-gray-100 px-2 py-0.5 rounded-full">
                  পরের কথা 💬
                </span>
              </div>
              <p className="text-xs sm:text-sm font-bold text-gray-800 leading-snug mt-0.5">
                "{activeDialogue.text}"
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Realistic Human-Proportioned Family Rig (Mother, Daughter, Son Walking Ahead in Aisle) */}
      <motion.div
        animate={
          isWalking
            ? {
                y: [0, -8, 0],
                transition: { repeat: Infinity, duration: 0.5, ease: 'easeInOut' },
              }
            : {
                y: [0, -3, 0],
                transition: { repeat: Infinity, duration: 2.4, ease: 'easeInOut' },
              }
        }
        className="relative flex items-end justify-center select-none"
        style={{ width: 'min(440px, 86vw)', height: 'min(260px, 50vw)' }}
      >
        <svg
          viewBox="0 0 480 320"
          className="w-full h-full filter drop-shadow-[0_16px_24px_rgba(0,0,0,0.25)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Gradients for Realistic Shading & Textures */}
            <linearGradient id="motherDress" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#2A9D8F" />
              <stop offset="50%" stopColor="#1E6B62" />
              <stop offset="100%" stopColor="#154C46" />
            </linearGradient>

            <linearGradient id="dupattaShawl" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#F4A261" />
              <stop offset="50%" stopColor="#E76F51" />
              <stop offset="100%" stopColor="#D95338" />
            </linearGradient>

            <linearGradient id="daughterDress" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FF9F93" />
              <stop offset="60%" stopColor="#F28482" />
              <stop offset="100%" stopColor="#D96B69" />
            </linearGradient>

            <linearGradient id="sonShirt" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#457B9D" />
              <stop offset="100%" stopColor="#1D3557" />
            </linearGradient>

            <linearGradient id="skinGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFDFC4" />
              <stop offset="100%" stopColor="#F0C29E" />
            </linearGradient>

            <linearGradient id="hairGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#30231D" />
              <stop offset="100%" stopColor="#1A120E" />
            </linearGradient>

            <radialGradient id="floorShadow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#000000" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.0" />
            </radialGradient>
          </defs>

          {/* Realistic Floor Contact Shadows */}
          <ellipse cx="120" cy="312" rx="42" ry="7" fill="url(#floorShadow)" />
          <ellipse cx="240" cy="314" rx="60" ry="9" fill="url(#floorShadow)" />
          <ellipse cx="360" cy="312" rx="42" ry="7" fill="url(#floorShadow)" />

          {/* ================= 1. DAUGHTER (Left, holding Mother's hand) ================= */}
          <g id="daughter-character" transform="translate(70, 95)">
            {/* Legs with natural walking stride */}
            <motion.g
              animate={isWalking ? { rotate: [6, -6, 6] } : {}}
              transition={{ repeat: Infinity, duration: 0.5, ease: 'easeInOut' }}
              style={{ transformOrigin: '38px 140px' }}
            >
              {/* Left Leg */}
              <path d="M30 140 L24 195 L22 205" stroke="url(#skinGrad)" strokeWidth="9" strokeLinecap="round" />
              {/* Left Shoe */}
              <ellipse cx="20" cy="207" rx="8" ry="4.5" fill="#E76F51" />
              <ellipse cx="19" cy="205" rx="5" ry="2" fill="#FFFFFF" fillOpacity="0.6" />

              {/* Right Leg */}
              <path d="M46 140 L52 195 L54 205" stroke="url(#skinGrad)" strokeWidth="9" strokeLinecap="round" />
              {/* Right Shoe */}
              <ellipse cx="56" cy="207" rx="8" ry="4.5" fill="#E76F51" />
              <ellipse cx="55" cy="205" rx="5" ry="2" fill="#FFFFFF" fillOpacity="0.6" />
            </motion.g>

            {/* Layered Frilly Dress */}
            <path
              d="M26 80 Q38 72 50 80 L64 145 Q38 152 12 145 Z"
              fill="url(#daughterDress)"
            />
            {/* Lace & Frill Detail */}
            <path d="M15 138 Q38 148 61 138" stroke="#FFFFFF" strokeWidth="2.5" strokeDasharray="3 3" fill="none" />
            <path d="M13 145 Q38 155 63 145" stroke="#FFFFFF" strokeWidth="2.5" fill="none" />

            {/* Arm holding Mother's hand */}
            <path
              d="M48 85 Q75 100 95 108"
              stroke="url(#skinGrad)"
              strokeWidth="7"
              strokeLinecap="round"
              fill="none"
            />

            {/* Head & Natural Hair Style (Seen from 3/4 rear-profile looking at toys) */}
            <ellipse cx="38" cy="50" rx="20" ry="22" fill="url(#skinGrad)" />
            {/* Long dark wavy hair with soft curls */}
            <path
              d="M20 50 C18 28 58 28 56 50 C54 36 22 36 20 50 Z"
              fill="url(#hairGrad)"
            />
            {/* Cute twin pigtails with floral hair ribbons */}
            <path d="M18 42 C10 32 12 18 22 22 C26 28 22 36 18 42 Z" fill="url(#hairGrad)" />
            <path d="M58 42 C66 32 64 18 54 22 C50 28 54 36 58 42 Z" fill="url(#hairGrad)" />
            <circle cx="21" cy="36" r="4.5" fill="#E76F51" />
            <circle cx="55" cy="36" r="4.5" fill="#E76F51" />

            {/* Cute backpack */}
            <rect x="26" y="86" width="24" height="28" rx="6" fill="#F4A261" />
            <path d="M30 86 Q38 78 46 86" stroke="#2D6A4F" strokeWidth="2.5" fill="none" />
          </g>

          {/* ================= 2. MOTHER (Center, tall, elegant, realistic silhouette) ================= */}
          <g id="mother-character" transform="translate(195, 20)">
            {/* Legs with natural graceful walk */}
            <motion.g
              animate={isWalking ? { rotate: [-5, 5, -5] } : {}}
              transition={{ repeat: Infinity, duration: 0.5, ease: 'easeInOut' }}
              style={{ transformOrigin: '45px 190px' }}
            >
              {/* Left Leg */}
              <path d="M36 195 L30 275 L28 288" stroke="url(#skinGrad)" strokeWidth="11" strokeLinecap="round" />
              {/* Left Sandal / Jutti */}
              <ellipse cx="26" cy="290" rx="11" ry="5.5" fill="#1D3557" />
              <ellipse cx="25" cy="288" rx="7" ry="2.5" fill="#F4A261" />

              {/* Right Leg */}
              <path d="M54 195 L60 275 L62 288" stroke="url(#skinGrad)" strokeWidth="11" strokeLinecap="round" />
              {/* Right Sandal */}
              <ellipse cx="64" cy="290" rx="11" ry="5.5" fill="#1D3557" />
              <ellipse cx="63" cy="288" rx="7" ry="2.5" fill="#F4A261" />
            </motion.g>

            {/* Elegant Modern Ethnic Kurti Dress with Beautiful Silhouette */}
            <path
              d="M30 95 Q45 88 60 95 L76 200 L14 200 Z"
              fill="url(#motherDress)"
            />
            {/* Border embroidery at hem */}
            <line x1="14" y1="196" x2="76" y2="196" stroke="#F4A261" strokeWidth="4" />
            <line x1="14" y1="199" x2="76" y2="199" stroke="#E76F51" strokeWidth="2" />

            {/* Elegant Flowing Dupatta (Draped over left shoulder down to waist) */}
            <path
              d="M26 100 Q40 140 68 185 L56 190 Q30 145 18 105 Z"
              fill="url(#dupattaShawl)"
            />

            {/* Left Arm (Holding Daughter's hand gently) */}
            <path
              d="M26 105 Q-8 145 -30 182"
              stroke="url(#skinGrad)"
              strokeWidth="9"
              strokeLinecap="round"
              fill="none"
            />
            {/* Gold Bangle */}
            <ellipse cx="-18" cy="168" rx="4" ry="7" fill="#F4A261" />

            {/* Right Arm (Holding Son's hand) */}
            <path
              d="M64 105 Q98 145 120 182"
              stroke="url(#skinGrad)"
              strokeWidth="9"
              strokeLinecap="round"
              fill="none"
            />
            {/* Gold Bangle */}
            <ellipse cx="108" cy="168" rx="4" ry="7" fill="#F4A261" />

            {/* GrowKins Shopping Tote Bag on Mother's Shoulder */}
            <path d="M12 120 L24 120 L20 160 L8 160 Z" fill="#E76F51" />
            <path d="M14 120 Q18 105 22 120" stroke="#FAF7F1" strokeWidth="2.5" fill="none" />
            <text x="10" y="145" fill="#FFFFFF" fontSize="9" fontWeight="bold">GK</text>

            {/* Head & Realistic Hair Style (Graceful Low Bun with Gold Pin) */}
            <ellipse cx="45" cy="58" rx="24" ry="27" fill="url(#skinGrad)" />
            {/* Natural glossy dark hair */}
            <path
              d="M23 60 C21 30 69 30 67 60 C61 40 29 40 23 60 Z"
              fill="url(#hairGrad)"
            />
            {/* Sophisticated hair bun */}
            <circle cx="45" cy="30" r="14" fill="url(#hairGrad)" />
            <circle cx="45" cy="30" r="4.5" fill="#F4A261" />
          </g>

          {/* ================= 3. SON (Right, holding Mother's hand) ================= */}
          <g id="son-character" transform="translate(310, 85)">
            {/* Legs with energetic walking stride */}
            <motion.g
              animate={isWalking ? { rotate: [-7, 7, -7] } : {}}
              transition={{ repeat: Infinity, duration: 0.5, ease: 'easeInOut' }}
              style={{ transformOrigin: '38px 150px' }}
            >
              {/* Left Leg */}
              <path d="M28 150 L22 210 L20 222" stroke="url(#skinGrad)" strokeWidth="10" strokeLinecap="round" />
              {/* Sporty Sneaker with White Trim */}
              <ellipse cx="18" cy="224" rx="9" ry="5" fill="#2A9D8F" />
              <rect x="12" y="222" width="14" height="3" fill="#FFFFFF" rx="1.5" />

              {/* Right Leg */}
              <path d="M48 150 L54 210 L56 222" stroke="url(#skinGrad)" strokeWidth="10" strokeLinecap="round" />
              {/* Sporty Sneaker */}
              <ellipse cx="58" cy="224" rx="9" ry="5" fill="#2A9D8F" />
              <rect x="52" y="222" width="14" height="3" fill="#FFFFFF" rx="1.5" />
            </motion.g>

            {/* Denim Shorts */}
            <path d="M20 120 L56 120 L62 152 L14 152 Z" fill="#264653" />
            <line x1="38" y1="120" x2="38" y2="152" stroke="#1D3557" strokeWidth="2" />

            {/* Sporty Polo T-Shirt with Collar */}
            <path
              d="M18 80 Q38 74 58 80 L60 124 L16 124 Z"
              fill="url(#sonShirt)"
            />
            {/* Polo collar and stripes */}
            <path d="M26 80 L38 92 L50 80" stroke="#FAF7F1" strokeWidth="3" fill="none" />
            <line x1="20" y1="105" x2="56" y2="105" stroke="#E76F51" strokeWidth="2.5" />

            {/* Left Arm (holding Mother's hand) */}
            <path
              d="M20 90 Q-2 110 -25 118"
              stroke="url(#skinGrad)"
              strokeWidth="8"
              strokeLinecap="round"
              fill="none"
            />

            {/* Head & Boyish Hair with Cap */}
            <ellipse cx="38" cy="52" rx="22" ry="24" fill="url(#skinGrad)" />
            <path
              d="M18 52 C16 30 60 30 58 52 C52 36 24 36 18 52 Z"
              fill="url(#hairGrad)"
            />
            {/* Modern Baseball Cap */}
            <path d="M18 42 Q38 28 58 42 Z" fill="#E76F51" />
            <ellipse cx="40" cy="42" rx="22" ry="7" fill="#F4A261" />
          </g>
        </svg>
      </motion.div>
    </div>
  );
};
