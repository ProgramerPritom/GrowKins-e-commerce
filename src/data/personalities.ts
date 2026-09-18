import type { Personality } from '../types';

export const PERSONALITIES: Personality[] = [
  {
    id: 'little-artist',
    title: 'The Little Artist',
    subtitle: 'Color · Marks · Tactile making',
    description: 'Drawn to beeswax, natural pigments, easels, and unrolling big sheets of paper to express what words cannot.',
    badge: 'Expressive & Bold',
    colorBg: 'bg-[#FCF4DB]',
    accentColor: '#DDA428',
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=600&q=80',
    recommendedCategory: 'Art & Craft',
    interests: ['Creating']
  },
  {
    id: 'curious-explorer',
    title: 'The Curious Explorer',
    subtitle: 'Looking closer · Pocket treasures',
    description: 'Always has a stone or leaf in their pocket, peeking under branches with a wooden camera and asking how things work.',
    badge: 'Inquisitive & Keen',
    colorBg: 'bg-[#E7EDFB]',
    accentColor: '#1C4CB8',
    image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=600&q=80',
    recommendedCategory: 'Pretend play',
    interests: ['Exploring']
  },
  {
    id: 'tiny-builder',
    title: 'The Tiny Builder',
    subtitle: 'Balance · Towers · Gravity tests',
    description: 'Quietly absorbed on the rug for an hour, calculating arches, counterweights, and stacking columns until the very edge of tipping.',
    badge: 'Focused & Patient',
    colorBg: 'bg-[#F4EFE6]',
    accentColor: '#8C6C38',
    image: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?auto=format&fit=crop&w=600&q=80',
    recommendedCategory: 'Building sets',
    interests: ['Building']
  },
  {
    id: 'nature-lover',
    title: 'The Nature Lover',
    subtitle: 'Animals · Forest tales · Moss & bark',
    description: 'Speaks for the wooden bears and squirrels, building leafy dens and caring for every creature in small-world play.',
    badge: 'Gentle & Nurturing',
    colorBg: 'bg-[#E6EFE9]',
    accentColor: '#4F7A5E',
    image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=600&q=80',
    recommendedCategory: 'Stacking toys',
    interests: ['Pretending']
  },
  {
    id: 'cozy-dreamer',
    title: 'The Cozy Dreamer',
    subtitle: 'Bedtime stories · Soft tea parties',
    description: 'Loves curling into the linen play mat, turning pages with felt flaps, and pouring imaginary herbal tea for stuffed companions.',
    badge: 'Imaginative & Calm',
    colorBg: 'bg-[#F1EDF6]',
    accentColor: '#7A6199',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
    recommendedCategory: 'Books & Storytelling',
    interests: ['Reading']
  },
  {
    id: 'always-moving',
    title: 'The Always-Moving One',
    subtitle: 'Rhythms · Balance · Boundless joy',
    description: 'Wobbling, seesawing, climbing, and running barefoot. Needs toys that turn the living room into a landscape of brave momentum.',
    badge: 'Dynamic & Joyful',
    colorBg: 'bg-[#FCE8E3]',
    accentColor: '#D96F58',
    image: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=600&q=80',
    recommendedCategory: 'Open-ended play',
    interests: ['Moving']
  }
];
