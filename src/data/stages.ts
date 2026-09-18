import type { StageInfo } from '../types';

export const STAGES: StageInfo[] = [
  {
    id: '0–12M',
    label: '0–12M',
    persona: 'First Discoverer',
    ageYears: '0–12 months',
    tagline: 'Grasping, sensing, soft textures and gentle sounds.',
    description: 'Sensory-rich, safe-to-mouth discoveries designed for tummy time, tracking with little eyes, and early palm grasps.',
    themeColor: 'bg-[#FCE8E3] text-[#D96F58]',
    recommendedProductIds: ['meadow-play-mat', 'sensory-rattle-trio', 'our-little-nature-book']
  },
  {
    id: '1–2Y',
    label: '1–2Y',
    persona: 'Tiny Explorer',
    ageYears: '1–2 years',
    tagline: 'Made for touching, stacking, wobbling and discovering.',
    description: 'Encouraging first independent steps, bilateral coordination, nesting curves, and rich sensory color discovery.',
    themeColor: 'bg-[#FCF4DB] text-[#A67E14]',
    recommendedProductIds: ['sunrise-stacking-arch', 'pocket-forest-friends', 'first-beeswax-crayons']
  },
  {
    id: '3–5Y',
    label: '3–5Y',
    persona: 'Big Imaginer',
    ageYears: '3–5 years',
    tagline: 'For building stories, asking why, and creating whole worlds.',
    description: 'Unlocking narrative pretend play, architectural balance, creative storytelling, and fine motor confidence.',
    themeColor: 'bg-[#E6EFE9] text-[#4F7A5E]',
    recommendedProductIds: ['woodland-balance-friends', 'make-believe-camera', 'little-architect-blocks', 'wobble-balance-board']
  },
  {
    id: '6–8Y',
    label: '6–8Y',
    persona: 'Little Creator',
    ageYears: '6–8 years',
    tagline: 'Intricate builds, studio arts, and mindful independent projects.',
    description: 'Supporting sustained concentration, collaborative play, fine mechanical thinking, and expressive craftsmanship.',
    themeColor: 'bg-[#F1EDF6] text-[#7A6199]',
    recommendedProductIds: ['artisan-wooden-easel', 'little-architect-blocks', 'cosy-felt-tea-set']
  },
  {
    id: '9Y+',
    label: '9Y+',
    persona: 'Wonder Seeker',
    ageYears: '9+ years',
    tagline: 'Sophisticated design, balance challenges, and mindful focus.',
    description: 'Heirloom toys that bridge childhood into lifelong creative exploration, architectural design, and peaceful room accents.',
    themeColor: 'bg-[#E7EDFB] text-[#1C4CB8]',
    recommendedProductIds: ['artisan-wooden-easel', 'wobble-balance-board', 'little-architect-blocks']
  }
];
