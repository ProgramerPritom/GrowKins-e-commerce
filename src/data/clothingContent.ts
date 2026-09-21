import type {
  ApparelCategory,
  ApparelCollection,
  FashionLook,
  SizeGuide,
  ClothingHomepageCMS
} from '../types/clothing';

export const CLOTHING_CATEGORIES: ApparelCategory[] = [
  {
    id: 'tops',
    name: 'Tops & Shirts',
    slug: 'tops',
    description: 'Double gauze shirts, Breton tees, and silky organic cotton tops designed for easy dressing.',
    image: 'https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?q=80&w=900&auto=format&fit=crop',
    itemCount: 18,
    featured: true,
    sortOrder: 1
  },
  {
    id: 'bottoms',
    name: 'Pants & Shorts',
    slug: 'bottoms',
    description: 'Enzyme-washed cargo trousers, bloomer shorts, and relaxed linen bottoms.',
    image: 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?q=80&w=900&auto=format&fit=crop',
    itemCount: 14,
    featured: true,
    sortOrder: 2
  },
  {
    id: 'sets',
    name: 'Matching Sets',
    slug: 'sets',
    description: 'Thoughtfully paired 2-piece sets for fast morning dressing and coordinated style.',
    image: 'https://images.unsplash.com/photo-1543332164-6e82f355badc?q=80&w=900&auto=format&fit=crop',
    itemCount: 12,
    featured: true,
    sortOrder: 3
  },
  {
    id: 'rompers',
    name: 'Rompers & Bodysuits',
    slug: 'rompers',
    description: 'Cloud-soft muslin one-pieces and ribbed suits with nickel-free snaps for quick changes.',
    image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?q=80&w=900&auto=format&fit=crop',
    itemCount: 16,
    featured: true,
    sortOrder: 4
  },
  {
    id: 'outerwear',
    name: 'Knitwear & Layers',
    slug: 'outerwear',
    description: 'Extra-fine merino cardigans, soft hooded jackets, and lightweight cotton jumpers.',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=900&auto=format&fit=crop',
    itemCount: 9,
    featured: false,
    sortOrder: 5
  },
  {
    id: 'shoes',
    name: 'First Steps & Shoes',
    slug: 'shoes',
    description: 'Podiatrist-recommended flexible leather sneakers, pre-walker sandals, and soft soles.',
    image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=900&auto=format&fit=crop',
    itemCount: 11,
    featured: true,
    sortOrder: 6
  }
];

export const CLOTHING_COLLECTIONS: ApparelCollection[] = [
  {
    id: 'new-in',
    title: 'New Drop · Spring / Summer',
    slug: 'new-in',
    subtitle: 'Fresh silhouettes, sun-washed tones, and airy double-gauze fabrics.',
    campaignImage: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=1200&auto=format&fit=crop',
    productIds: ['cloud-soft-pocket-shirt', 'meadow-muslin-romper', 'sunny-day-matching-set', 'cozy-cable-knit-cardigan'],
    sortOrder: 1,
    status: 'active'
  },
  {
    id: 'summer-edit',
    title: 'Summer Little Things',
    slug: 'summer-edit',
    subtitle: 'Sunlit cotton, breathable rompers, and lightweight outdoor playwear.',
    campaignImage: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?q=80&w=1200&auto=format&fit=crop',
    productIds: ['cloud-soft-pocket-shirt', 'sunday-stripe-breton-tee', 'meadow-muslin-romper', 'soft-sole-walker-sandals'],
    sortOrder: 2,
    status: 'active'
  },
  {
    id: 'everyday-essentials',
    title: 'Everyday Adventures',
    slug: 'everyday-essentials',
    subtitle: 'Washed-cotton basics made for climbing, crawling, and napping.',
    campaignImage: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?q=80&w=1200&auto=format&fit=crop',
    productIds: ['sunday-stripe-breton-tee', 'little-explorer-cargo-pants', 'first-step-leather-sneakers'],
    sortOrder: 3,
    status: 'active'
  },
  {
    id: 'first-steps',
    title: 'First Steps Footwear',
    slug: 'first-steps',
    subtitle: 'Zero-drop soles and wide toe-boxes designed for natural balance development.',
    campaignImage: 'https://images.unsplash.com/photo-1516478177764-9fe5bd7e9717?q=80&w=1200&auto=format&fit=crop',
    productIds: ['first-step-leather-sneakers', 'soft-sole-walker-sandals'],
    sortOrder: 4,
    status: 'active'
  }
];

export const FASHION_LOOKS: FashionLook[] = [
  {
    id: 'look-sunday-stroll',
    title: 'The Sunday Garden Stroll',
    subtitle: 'An effortless neutral pairing: airy pocket shirt, durable cargos, and flexible leather sneakers.',
    image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=1200&auto=format&fit=crop',
    hotspots: [
      {
        id: 'hs-1',
        x: 48,
        y: 35,
        productId: 'cloud-soft-pocket-shirt'
      },
      {
        id: 'hs-2',
        x: 52,
        y: 62,
        productId: 'little-explorer-cargo-pants'
      },
      {
        id: 'hs-3',
        x: 46,
        y: 88,
        productId: 'first-step-leather-sneakers'
      }
    ],
    productIds: [
      'cloud-soft-pocket-shirt',
      'little-explorer-cargo-pants',
      'first-step-leather-sneakers'
    ],
    status: 'active',
    sortOrder: 1
  },
  {
    id: 'look-warm-afternoon',
    title: 'Warm Afternoon Discovery',
    subtitle: 'Lightweight triple-layer muslin romper styled with breathable pre-walker sandals.',
    image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?q=80&w=1200&auto=format&fit=crop',
    hotspots: [
      {
        id: 'hs-4',
        x: 50,
        y: 45,
        productId: 'meadow-muslin-romper'
      },
      {
        id: 'hs-5',
        x: 65,
        y: 82,
        productId: 'soft-sole-walker-sandals'
      }
    ],
    productIds: [
      'meadow-muslin-romper',
      'soft-sole-walker-sandals'
    ],
    status: 'active',
    sortOrder: 2
  }
];

export const SIZE_GUIDES: SizeGuide[] = [
  {
    id: 'baby-apparel',
    title: 'Baby & Toddler Clothing Size Guide',
    category: 'clothing',
    description: 'Our garments are tailored with relaxed ease. If your child is between measurements, we recommend choosing the next size up.',
    measurementUnit: 'cm',
    rows: [
      { ageLabel: 'Newborn', heightCm: 'Up to 56 cm', weightKg: '2.5–4.0 kg', chestCm: '38 cm', waistCm: '38 cm', recommendedSize: 'NB / 56' },
      { ageLabel: '0–3 Months', heightCm: '56–62 cm', weightKg: '4.0–6.0 kg', chestCm: '42 cm', waistCm: '41 cm', recommendedSize: '0–3M / 62' },
      { ageLabel: '3–6 Months', heightCm: '62–68 cm', weightKg: '6.0–8.0 kg', chestCm: '44 cm', waistCm: '43 cm', recommendedSize: '3–6M / 68' },
      { ageLabel: '6–9 Months', heightCm: '68–74 cm', weightKg: '8.0–9.5 kg', chestCm: '46 cm', waistCm: '45 cm', recommendedSize: '6–9M / 74' },
      { ageLabel: '9–12 Months', heightCm: '74–80 cm', weightKg: '9.5–11.0 kg', chestCm: '48 cm', waistCm: '47 cm', recommendedSize: '9–12M / 80' },
      { ageLabel: '12–18 Months', heightCm: '80–86 cm', weightKg: '11.0–12.5 kg', chestCm: '50 cm', waistCm: '49 cm', recommendedSize: '12–18M / 86' },
      { ageLabel: '18–24 Months', heightCm: '86–92 cm', weightKg: '12.5–14.0 kg', chestCm: '52 cm', waistCm: '51 cm', recommendedSize: '18–24M / 92' }
    ],
    howToMeasure: [
      { step: 'Height', instructions: 'Lay baby flat against a soft measuring tape from top of head to heels.' },
      { step: 'Chest', instructions: 'Measure around the fullest part of their chest directly under the armpits.' },
      { step: 'Waist', instructions: 'Measure naturally around the belly button line without pulling tight.' }
    ]
  },
  {
    id: 'baby-shoes',
    title: 'First-Steps & Toddler Shoes Guide',
    category: 'shoes',
    description: 'Measure your child’s foot while they are weight-bearing or standing gently on a sheet of paper. Add 0.5–0.8 cm for healthy toe wriggle room.',
    measurementUnit: 'cm',
    rows: [
      { ageLabel: '0–6 Months', footLengthCm: '10.0–10.5 cm', euSize: 'EU 17', recommendedSize: 'EU 17 (10.5 cm)' },
      { ageLabel: '6–9 Months', footLengthCm: '10.6–11.2 cm', euSize: 'EU 18', recommendedSize: 'EU 18 (11.0 cm)' },
      { ageLabel: '9–12 Months', footLengthCm: '11.3–11.9 cm', euSize: 'EU 19', recommendedSize: 'EU 19 (11.5 cm)' },
      { ageLabel: '12–15 Months', footLengthCm: '12.0–12.6 cm', euSize: 'EU 20', recommendedSize: 'EU 20 (12.2 cm)' },
      { ageLabel: '15–18 Months', footLengthCm: '12.7–13.3 cm', euSize: 'EU 21', recommendedSize: 'EU 21 (13.0 cm)' },
      { ageLabel: '18–21 Months', footLengthCm: '13.4–14.0 cm', euSize: 'EU 22', recommendedSize: 'EU 22 (13.7 cm)' },
      { ageLabel: '21–24 Months', footLengthCm: '14.1–14.7 cm', euSize: 'EU 23', recommendedSize: 'EU 23 (14.4 cm)' },
      { ageLabel: '24M+', footLengthCm: '14.8–15.4 cm', euSize: 'EU 24', recommendedSize: 'EU 24 (15.0 cm)' }
    ],
    howToMeasure: [
      { step: '1. Trace', instructions: 'Place foot on paper with heel touching a wall. Trace around the longest toe.' },
      { step: '2. Measure', instructions: 'Measure length in centimeters from wall line to longest toe trace.' },
      { step: '3. Add Room', instructions: 'Add approx. 0.6 cm so little toes have natural balance wiggle room.' }
    ]
  }
];

export const INITIAL_CLOTHING_HOMEPAGE_CMS: ClothingHomepageCMS = {
  hero: {
    eyebrow: 'THE LITTLE WARDROBE · SPRING / SUMMER',
    headline: 'Tiny fits.\nBig personality.',
    description: 'Modern, photographic everyday pieces made for crawling, running, exploring and everything in between. Tailored in pure organic double-gauze and breathable natural fibers.',
    desktopImage: 'https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?q=80&w=1400&auto=format&fit=crop',
    mobileImage: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?q=80&w=900&auto=format&fit=crop',
    primaryCtaText: 'Shop New In',
    primaryCtaLink: '/clothing/new',
    secondaryCtaText: 'Explore Baby (0–24M)',
    secondaryCtaLink: '/clothing/baby'
  },
  wardrobeTiles: [
    { title: 'Tops & Shirts', slug: 'tops', image: 'https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?q=80&w=800&auto=format&fit=crop', itemCountText: '18 Styles' },
    { title: 'Pants & Bottoms', slug: 'bottoms', image: 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?q=80&w=800&auto=format&fit=crop', itemCountText: '14 Styles' },
    { title: 'Matching Sets', slug: 'sets', image: 'https://images.unsplash.com/photo-1543332164-6e82f355badc?q=80&w=800&auto=format&fit=crop', itemCountText: '12 Sets' },
    { title: 'Rompers & Suits', slug: 'rompers', image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?q=80&w=800&auto=format&fit=crop', itemCountText: '16 Styles' },
    { title: 'First Steps Shoes', slug: 'shoes', image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=800&auto=format&fit=crop', itemCountText: '11 Styles' },
    { title: 'Knitwear & Layers', slug: 'outerwear', image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800&auto=format&fit=crop', itemCountText: '9 Styles' }
  ],
  newDropCollectionId: 'new-in',
  featuredLookId: 'look-sunday-stroll',
  materialStory: {
    headline: 'FEELS GOOD, TOO.',
    subheadline: 'Children’s skin is up to 30% thinner than adult skin. We obsess over organic breathability, non-toxic dyes, and soft inner seams.',
    cards: [
      {
        title: 'Organic Double-Gauze',
        description: 'Air-pocketed layers of pure organic cotton that absorb humidity and dry in minutes.',
        image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=800&auto=format&fit=crop'
      },
      {
        title: 'Heirloom Fine Merino',
        description: 'Australian extra-fine wool naturally balances baby body heat during chilly morning strolls.',
        image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800&auto=format&fit=crop'
      },
      {
        title: 'Enzyme-Washed Twill',
        description: 'Tough enough for playground gravel, yet softened so tender knees stay blister-free.',
        image: 'https://images.unsplash.com/photo-1471286174890-9c112ffca564?q=80&w=800&auto=format&fit=crop'
      }
    ]
  },
  seasonalEditorial: {
    title: 'Summer Little Things',
    subtitle: 'From balcony sunbaths to riverside picnics. Our lightweight summer edit is designed for easy washing and endless warm-weather curiosity.',
    image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?q=80&w=1400&auto=format&fit=crop',
    link: '/clothing/collections/summer-edit',
    ctaText: 'Discover The Summer Edit'
  }
};
