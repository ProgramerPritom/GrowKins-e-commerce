import type { ApparelProduct } from '../types/clothing';

export const CLOTHING_PRODUCTS: ApparelProduct[] = [
  {
    id: 'cloud-soft-pocket-shirt',
    slug: 'cloud-soft-pocket-shirt',
    commerceType: 'apparel',
    name: 'Cloud Soft Pocket Shirt',
    subtitle: 'Breathable Double-Gauze Organic Cotton with Faux Tortoise Buttons',
    productType: 'shirt',
    ageGroup: 'baby',
    ageLabel: '0–24M',
    description: 'An airy, everyday overshirt cut from premium double-gauze organic cotton. Tailored with a relaxed silhouette so crawling, reaching, and exploring feels effortless. Features soft rounded cuffs, a gentle camp collar, and natural faux-tortoise buttons that are securely cross-stitched for little fingers.\n\nPre-washed with gentle organic enzymes for a lived-in softness from day one. Perfect as a standalone summer top or layered over a ribbed bodysuit on breezy evenings.',
    price: 1250,
    compareAtPrice: 1550,
    currency: 'BDT',
    rating: 4.9,
    reviewCount: 68,
    status: 'active',
    badges: ['NEW DROP', 'ORGANIC COTTON'],
    featured: true,
    categoryIds: ['tops', 'baby'],
    collectionIds: ['new-in', 'summer-edit', 'everyday-essentials'],
    materials: [
      { name: 'Organic Double-Gauze Cotton', percentage: 100, description: 'Featherlight, breathable open-weave cotton that softens with every wash' }
    ],
    careInstructions: [
      'Machine wash cold (30°C) with like colors',
      'Gentle cycle, do not bleach',
      'Tumble dry low or line dry in the shade',
      'Warm iron if desired, though natural crinkles are celebrated'
    ],
    fit: {
      type: 'relaxed',
      stretchLevel: 'none',
      length: 'Sits gently below the hip for easy diaper coverage',
      notes: 'True to size with comfortable breathing room for active toddlers.'
    },
    colors: [
      { id: 'oat', name: 'Oatmeal Natural', hex: '#E6DFD5' },
      { id: 'terracotta', name: 'Burnt Terracotta', hex: '#C85A32' },
      { id: 'sage', name: 'Muted Sage', hex: '#94A392' },
      { id: 'denim', name: 'Soft Indigo', hex: '#637A8E' }
    ],
    sizes: [
      { id: '0-3m', label: '0–3M', system: 'clothing', cm: '62 cm', ageHint: '0–3 months' },
      { id: '3-6m', label: '3–6M', system: 'clothing', cm: '68 cm', ageHint: '3–6 months' },
      { id: '6-9m', label: '6–9M', system: 'clothing', cm: '74 cm', ageHint: '6–9 months' },
      { id: '9-12m', label: '9–12M', system: 'clothing', cm: '80 cm', ageHint: '9–12 months' },
      { id: '12-18m', label: '12–18M', system: 'clothing', cm: '86 cm', ageHint: '12–18 months' },
      { id: '18-24m', label: '18–24M', system: 'clothing', cm: '92 cm', ageHint: '18–24 months' }
    ],
    variants: [
      { id: 'csps-oat-03', sku: 'SHIRT-OAT-03', color: { id: 'oat', name: 'Oatmeal Natural', hex: '#E6DFD5' }, size: { id: '0-3m', label: '0–3M', cm: '62 cm' }, inventoryQuantity: 8, status: 'active' },
      { id: 'csps-oat-36', sku: 'SHIRT-OAT-36', color: { id: 'oat', name: 'Oatmeal Natural', hex: '#E6DFD5' }, size: { id: '3-6m', label: '3–6M', cm: '68 cm' }, inventoryQuantity: 12, status: 'active' },
      { id: 'csps-oat-69', sku: 'SHIRT-OAT-69', color: { id: 'oat', name: 'Oatmeal Natural', hex: '#E6DFD5' }, size: { id: '6-9m', label: '6–9M', cm: '74 cm' }, inventoryQuantity: 6, lowStockThreshold: 3, status: 'active' },
      { id: 'csps-oat-912', sku: 'SHIRT-OAT-912', color: { id: 'oat', name: 'Oatmeal Natural', hex: '#E6DFD5' }, size: { id: '9-12m', label: '9–12M', cm: '80 cm' }, inventoryQuantity: 0, status: 'active' },
      { id: 'csps-oat-1218', sku: 'SHIRT-OAT-1218', color: { id: 'oat', name: 'Oatmeal Natural', hex: '#E6DFD5' }, size: { id: '12-18m', label: '12–18M', cm: '86 cm' }, inventoryQuantity: 5, status: 'active' },
      { id: 'csps-oat-1824', sku: 'SHIRT-OAT-1824', color: { id: 'oat', name: 'Oatmeal Natural', hex: '#E6DFD5' }, size: { id: '18-24m', label: '18–24M', cm: '92 cm' }, inventoryQuantity: 4, status: 'active' },
      
      { id: 'csps-terra-03', sku: 'SHIRT-TER-03', color: { id: 'terracotta', name: 'Burnt Terracotta', hex: '#C85A32' }, size: { id: '0-3m', label: '0–3M', cm: '62 cm' }, inventoryQuantity: 5, status: 'active' },
      { id: 'csps-terra-36', sku: 'SHIRT-TER-36', color: { id: 'terracotta', name: 'Burnt Terracotta', hex: '#C85A32' }, size: { id: '3-6m', label: '3–6M', cm: '68 cm' }, inventoryQuantity: 9, status: 'active' },
      { id: 'csps-terra-69', sku: 'SHIRT-TER-69', color: { id: 'terracotta', name: 'Burnt Terracotta', hex: '#C85A32' }, size: { id: '6-9m', label: '6–9M', cm: '74 cm' }, inventoryQuantity: 7, status: 'active' },
      { id: 'csps-terra-912', sku: 'SHIRT-TER-912', color: { id: 'terracotta', name: 'Burnt Terracotta', hex: '#C85A32' }, size: { id: '9-12m', label: '9–12M', cm: '80 cm' }, inventoryQuantity: 4, status: 'active' },
      { id: 'csps-terra-1218', sku: 'SHIRT-TER-1218', color: { id: 'terracotta', name: 'Burnt Terracotta', hex: '#C85A32' }, size: { id: '12-18m', label: '12–18M', cm: '86 cm' }, inventoryQuantity: 2, lowStockThreshold: 3, status: 'active' },
      { id: 'csps-terra-1824', sku: 'SHIRT-TER-1824', color: { id: 'terracotta', name: 'Burnt Terracotta', hex: '#C85A32' }, size: { id: '18-24m', label: '18–24M', cm: '92 cm' }, inventoryQuantity: 3, status: 'active' },

      { id: 'csps-sage-36', sku: 'SHIRT-SAG-36', color: { id: 'sage', name: 'Muted Sage', hex: '#94A392' }, size: { id: '3-6m', label: '3–6M', cm: '68 cm' }, inventoryQuantity: 6, status: 'active' },
      { id: 'csps-sage-69', sku: 'SHIRT-SAG-69', color: { id: 'sage', name: 'Muted Sage', hex: '#94A392' }, size: { id: '6-9m', label: '6–9M', cm: '74 cm' }, inventoryQuantity: 10, status: 'active' },
      { id: 'csps-sage-912', sku: 'SHIRT-SAG-912', color: { id: 'sage', name: 'Muted Sage', hex: '#94A392' }, size: { id: '9-12m', label: '9–12M', cm: '80 cm' }, inventoryQuantity: 5, status: 'active' },
      { id: 'csps-sage-1218', sku: 'SHIRT-SAG-1218', color: { id: 'sage', name: 'Muted Sage', hex: '#94A392' }, size: { id: '12-18m', label: '12–18M', cm: '86 cm' }, inventoryQuantity: 4, status: 'active' },

      { id: 'csps-denim-36', sku: 'SHIRT-DEN-36', color: { id: 'denim', name: 'Soft Indigo', hex: '#637A8E' }, size: { id: '3-6m', label: '3–6M', cm: '68 cm' }, inventoryQuantity: 5, status: 'active' },
      { id: 'csps-denim-69', sku: 'SHIRT-DEN-69', color: { id: 'denim', name: 'Soft Indigo', hex: '#637A8E' }, size: { id: '6-9m', label: '6–9M', cm: '74 cm' }, inventoryQuantity: 8, status: 'active' },
      { id: 'csps-denim-912', sku: 'SHIRT-DEN-912', color: { id: 'denim', name: 'Soft Indigo', hex: '#637A8E' }, size: { id: '9-12m', label: '9–12M', cm: '80 cm' }, inventoryQuantity: 3, status: 'active' }
    ],
    images: [
      {
        id: 'csps-img-1',
        url: 'https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?q=80&w=900&auto=format&fit=crop',
        alt: 'Cloud Soft Pocket Shirt in Oatmeal Natural front view on wooden hanger',
        type: 'front',
        colorId: 'oat',
        sortOrder: 1
      },
      {
        id: 'csps-img-2',
        url: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=900&auto=format&fit=crop',
        alt: 'Toddler playing in the garden wearing Cloud Soft Pocket Shirt',
        type: 'lifestyle',
        colorId: 'oat',
        sortOrder: 2
      },
      {
        id: 'csps-img-3',
        url: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=900&auto=format&fit=crop',
        alt: 'Macro texture of organic double-gauze breathable cotton',
        type: 'fabric',
        colorId: 'oat',
        sortOrder: 3
      },
      {
        id: 'csps-img-4',
        url: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?q=80&w=900&auto=format&fit=crop',
        alt: 'Toddler laughing outdoors in Terracotta shirt',
        type: 'model',
        colorId: 'terracotta',
        sortOrder: 4
      }
    ],
    completeTheLookIds: ['little-explorer-cargo-pants', 'first-step-leather-sneakers'],
    relatedProductIds: ['sunday-stripe-breton-tee', 'sunny-day-matching-set'],
    createdAt: '2026-03-01T10:00:00Z',
    updatedAt: '2026-03-15T14:30:00Z'
  },
  {
    id: 'sunday-stripe-breton-tee',
    slug: 'sunday-stripe-breton-tee',
    commerceType: 'apparel',
    name: 'Sunday Stripe Breton Tee',
    subtitle: 'Ultra-Soft Combed Jersey Cotton with Shoulder Snaps',
    productType: 'tshirt',
    ageGroup: 'baby',
    ageLabel: '0–24M',
    description: 'A timeless French-inspired Breton stripe tee crafted from 100% long-staple combed cotton. Softened for sensitive newborn skin, with flatlock inner seams that will never chafe or itch.\n\nTwo hidden coconut shell shoulder snaps make changing squirmy babies painless, while the durable rib collar retains its crisp shape wash after wash.',
    price: 850,
    compareAtPrice: 1100,
    currency: 'BDT',
    rating: 4.8,
    reviewCount: 43,
    status: 'active',
    badges: ['BESTSELLER'],
    featured: true,
    categoryIds: ['tops', 'baby'],
    collectionIds: ['everyday-essentials', 'summer-edit'],
    materials: [
      { name: 'Combed Jersey Cotton', percentage: 100, description: 'Silky smooth ring-spun cotton with natural breathable stretch' }
    ],
    careInstructions: [
      'Machine wash warm (40°C) with similar colors',
      'Tumble dry low or hang dry',
      'Do not iron directly onto shoulder snaps'
    ],
    fit: {
      type: 'regular',
      stretchLevel: 'medium',
      length: 'Classic length with generous hip coverage',
      notes: 'Natural gentle stretch allows for quick over-the-head dressing.'
    },
    colors: [
      { id: 'navy-cream', name: 'Navy & Cream Stripe', hex: '#1E293B' },
      { id: 'terracotta-butter', name: 'Terracotta & Butter', hex: '#C85A32' }
    ],
    sizes: [
      { id: '0-3m', label: '0–3M', system: 'clothing', cm: '62 cm', ageHint: '0–3 months' },
      { id: '3-6m', label: '3–6M', system: 'clothing', cm: '68 cm', ageHint: '3–6 months' },
      { id: '6-9m', label: '6–9M', system: 'clothing', cm: '74 cm', ageHint: '6–9 months' },
      { id: '9-12m', label: '9–12M', system: 'clothing', cm: '80 cm', ageHint: '9–12 months' },
      { id: '12-18m', label: '12–18M', system: 'clothing', cm: '86 cm', ageHint: '12–18 months' },
      { id: '18-24m', label: '18–24M', system: 'clothing', cm: '92 cm', ageHint: '18–24 months' }
    ],
    variants: [
      { id: 'ssbt-nc-03', sku: 'TEE-NC-03', color: { id: 'navy-cream', name: 'Navy & Cream Stripe', hex: '#1E293B' }, size: { id: '0-3m', label: '0–3M', cm: '62 cm' }, inventoryQuantity: 10, status: 'active' },
      { id: 'ssbt-nc-36', sku: 'TEE-NC-36', color: { id: 'navy-cream', name: 'Navy & Cream Stripe', hex: '#1E293B' }, size: { id: '3-6m', label: '3–6M', cm: '68 cm' }, inventoryQuantity: 14, status: 'active' },
      { id: 'ssbt-nc-69', sku: 'TEE-NC-69', color: { id: 'navy-cream', name: 'Navy & Cream Stripe', hex: '#1E293B' }, size: { id: '6-9m', label: '6–9M', cm: '74 cm' }, inventoryQuantity: 8, status: 'active' },
      { id: 'ssbt-nc-912', sku: 'TEE-NC-912', color: { id: 'navy-cream', name: 'Navy & Cream Stripe', hex: '#1E293B' }, size: { id: '9-12m', label: '9–12M', cm: '80 cm' }, inventoryQuantity: 6, status: 'active' },
      { id: 'ssbt-nc-1218', sku: 'TEE-NC-1218', color: { id: 'navy-cream', name: 'Navy & Cream Stripe', hex: '#1E293B' }, size: { id: '12-18m', label: '12–18M', cm: '86 cm' }, inventoryQuantity: 3, status: 'active' },
      
      { id: 'ssbt-tb-36', sku: 'TEE-TB-36', color: { id: 'terracotta-butter', name: 'Terracotta & Butter', hex: '#C85A32' }, size: { id: '3-6m', label: '3–6M', cm: '68 cm' }, inventoryQuantity: 6, status: 'active' },
      { id: 'ssbt-tb-69', sku: 'TEE-TB-69', color: { id: 'terracotta-butter', name: 'Terracotta & Butter', hex: '#C85A32' }, size: { id: '6-9m', label: '6–9M', cm: '74 cm' }, inventoryQuantity: 7, status: 'active' },
      { id: 'ssbt-tb-912', sku: 'TEE-TB-912', color: { id: 'terracotta-butter', name: 'Terracotta & Butter', hex: '#C85A32' }, size: { id: '9-12m', label: '9–12M', cm: '80 cm' }, inventoryQuantity: 5, status: 'active' }
    ],
    images: [
      {
        id: 'ssbt-img-1',
        url: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?q=80&w=900&auto=format&fit=crop',
        alt: 'Sunday Stripe Breton Tee worn by relaxed baby',
        type: 'model',
        colorId: 'navy-cream',
        sortOrder: 1
      },
      {
        id: 'ssbt-img-2',
        url: 'https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?q=80&w=900&auto=format&fit=crop',
        alt: 'Sunday Stripe Breton Tee flat lay on linen',
        type: 'front',
        colorId: 'navy-cream',
        sortOrder: 2
      },
      {
        id: 'ssbt-img-3',
        url: 'https://images.unsplash.com/photo-1489980557514-251d61e3eeb6?q=80&w=900&auto=format&fit=crop',
        alt: 'Detail of shoulder snap on cotton tee',
        type: 'detail',
        colorId: 'navy-cream',
        sortOrder: 3
      }
    ],
    completeTheLookIds: ['little-explorer-cargo-pants', 'first-step-leather-sneakers'],
    createdAt: '2026-03-02T10:00:00Z',
    updatedAt: '2026-03-12T11:00:00Z'
  },
  {
    id: 'little-explorer-cargo-pants',
    slug: 'little-explorer-cargo-pants',
    commerceType: 'apparel',
    name: 'Little Explorer Cargo Pants',
    subtitle: 'Enzyme-Washed Twill with Elasticated Comfort Waist & Knee Patches',
    productType: 'pants',
    ageGroup: 'baby',
    ageLabel: '0–24M',
    description: 'Designed for the crawling and climbing stage. These cargo pants are crafted from durable yet feather-soft cotton twill, featuring reinforced knee patches that survive endless floor expeditions.\n\nA gentle elastic drawstring waist ensures a snug fit without pinching small bellies, while roll-up cuffs adapt as your child grows.',
    price: 1350,
    compareAtPrice: 1650,
    currency: 'BDT',
    rating: 4.9,
    reviewCount: 52,
    status: 'active',
    badges: ['ESSENTIAL', 'REINFORCED KNEES'],
    featured: true,
    categoryIds: ['bottoms', 'baby'],
    collectionIds: ['everyday-essentials', 'first-steps'],
    materials: [
      { name: 'Washed Cotton Twill', percentage: 98, description: 'Soft, tear-resistant organic cotton twill' },
      { name: 'Elastane', percentage: 2, description: 'Subtle flexible stretch for unrestrained motion' }
    ],
    careInstructions: [
      'Machine wash warm (40°C) inside out',
      'Tumble dry medium',
      'Do not dry clean'
    ],
    fit: {
      type: 'relaxed',
      stretchLevel: 'subtle',
      length: 'Slightly tapered ankle with roll-up cuffs',
      notes: 'Extra seat room accommodated for both cloth and disposable diapers.'
    },
    colors: [
      { id: 'sand', name: 'Desert Sand', hex: '#D5C8B4' },
      { id: 'olive', name: 'Olive Grove', hex: '#6B705C' },
      { id: 'charcoal', name: 'Washed Charcoal', hex: '#3E3B38' }
    ],
    sizes: [
      { id: '0-3m', label: '0–3M', system: 'clothing', cm: '62 cm' },
      { id: '3-6m', label: '3–6M', system: 'clothing', cm: '68 cm' },
      { id: '6-9m', label: '6–9M', system: 'clothing', cm: '74 cm' },
      { id: '9-12m', label: '9–12M', system: 'clothing', cm: '80 cm' },
      { id: '12-18m', label: '12–18M', system: 'clothing', cm: '86 cm' },
      { id: '18-24m', label: '18–24M', system: 'clothing', cm: '92 cm' }
    ],
    variants: [
      { id: 'lecp-sand-36', sku: 'PANT-SND-36', color: { id: 'sand', name: 'Desert Sand', hex: '#D5C8B4' }, size: { id: '3-6m', label: '3–6M', cm: '68 cm' }, inventoryQuantity: 11, status: 'active' },
      { id: 'lecp-sand-69', sku: 'PANT-SND-69', color: { id: 'sand', name: 'Desert Sand', hex: '#D5C8B4' }, size: { id: '6-9m', label: '6–9M', cm: '74 cm' }, inventoryQuantity: 9, status: 'active' },
      { id: 'lecp-sand-912', sku: 'PANT-SND-912', color: { id: 'sand', name: 'Desert Sand', hex: '#D5C8B4' }, size: { id: '9-12m', label: '9–12M', cm: '80 cm' }, inventoryQuantity: 4, lowStockThreshold: 3, status: 'active' },
      { id: 'lecp-sand-1218', sku: 'PANT-SND-1218', color: { id: 'sand', name: 'Desert Sand', hex: '#D5C8B4' }, size: { id: '12-18m', label: '12–18M', cm: '86 cm' }, inventoryQuantity: 6, status: 'active' },
      
      { id: 'lecp-olv-69', sku: 'PANT-OLV-69', color: { id: 'olive', name: 'Olive Grove', hex: '#6B705C' }, size: { id: '6-9m', label: '6–9M', cm: '74 cm' }, inventoryQuantity: 8, status: 'active' },
      { id: 'lecp-olv-912', sku: 'PANT-OLV-912', color: { id: 'olive', name: 'Olive Grove', hex: '#6B705C' }, size: { id: '9-12m', label: '9–12M', cm: '80 cm' }, inventoryQuantity: 7, status: 'active' },
      { id: 'lecp-olv-1218', sku: 'PANT-OLV-1218', color: { id: 'olive', name: 'Olive Grove', hex: '#6B705C' }, size: { id: '12-18m', label: '12–18M', cm: '86 cm' }, inventoryQuantity: 5, status: 'active' }
    ],
    images: [
      {
        id: 'lecp-img-1',
        url: 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?q=80&w=900&auto=format&fit=crop',
        alt: 'Little Explorer Cargo Pants on standing baby',
        type: 'model',
        colorId: 'sand',
        sortOrder: 1
      },
      {
        id: 'lecp-img-2',
        url: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?q=80&w=900&auto=format&fit=crop',
        alt: 'Cargo pants folded flat showing pocket and waist tie',
        type: 'front',
        colorId: 'sand',
        sortOrder: 2
      },
      {
        id: 'lecp-img-3',
        url: 'https://images.unsplash.com/photo-1471286174890-9c112ffca564?q=80&w=900&auto=format&fit=crop',
        alt: 'Detail of soft reinforced knee patch',
        type: 'detail',
        colorId: 'sand',
        sortOrder: 3
      }
    ],
    completeTheLookIds: ['cloud-soft-pocket-shirt', 'first-step-leather-sneakers'],
    createdAt: '2026-03-03T10:00:00Z',
    updatedAt: '2026-03-14T09:00:00Z'
  },
  {
    id: 'meadow-muslin-romper',
    slug: 'meadow-muslin-romper',
    commerceType: 'apparel',
    name: 'Meadow Muslin Romper',
    subtitle: 'Triple-Layer Organic Muslin One-Piece with Nickel-Free Inseam Snaps',
    productType: 'romper',
    ageGroup: 'baby',
    ageLabel: '0–18M',
    description: 'An idyllic one-piece tailored from lofty triple-layer organic muslin that feels like an airy cloud against delicate baby skin. Decorated with delicate coconut buttons and elasticated bloomer leg openings that never leave red marks.\n\nFull inseam snaps make diaper checks and changes lightning fast without needing to pull the romper over sleepy heads.',
    price: 1450,
    compareAtPrice: 1750,
    currency: 'BDT',
    rating: 5.0,
    reviewCount: 36,
    status: 'active',
    badges: ['PARENT FAVORITE', 'ORGANIC MUSLIN'],
    featured: true,
    categoryIds: ['rompers', 'baby'],
    collectionIds: ['new-in', 'summer-edit'],
    materials: [
      { name: 'Organic Cotton Muslin', percentage: 100, description: 'Naturally crinkled, high-absorbency organic cotton' }
    ],
    careInstructions: [
      'Gentle cold wash (30°C)',
      'Lay flat to dry to preserve cloud-soft volume',
      'No ironing required'
    ],
    fit: {
      type: 'relaxed',
      stretchLevel: 'none',
      length: 'Classic bloomer romper silhouette',
      notes: 'Generous ease for tummy expansion and diaper bulk.'
    },
    colors: [
      { id: 'rose', name: 'Dusty Rose', hex: '#D8A499' },
      { id: 'butter', name: 'Warm Butter', hex: '#F0DC9C' },
      { id: 'sage', name: 'Muted Sage', hex: '#94A392' }
    ],
    sizes: [
      { id: '0-3m', label: '0–3M', system: 'clothing', cm: '62 cm' },
      { id: '3-6m', label: '3–6M', system: 'clothing', cm: '68 cm' },
      { id: '6-9m', label: '6–9M', system: 'clothing', cm: '74 cm' },
      { id: '9-12m', label: '9–12M', system: 'clothing', cm: '80 cm' },
      { id: '12-18m', label: '12–18M', system: 'clothing', cm: '86 cm' }
    ],
    variants: [
      { id: 'mmr-rose-03', sku: 'ROMP-ROS-03', color: { id: 'rose', name: 'Dusty Rose', hex: '#D8A499' }, size: { id: '0-3m', label: '0–3M', cm: '62 cm' }, inventoryQuantity: 7, status: 'active' },
      { id: 'mmr-rose-36', sku: 'ROMP-ROS-36', color: { id: 'rose', name: 'Dusty Rose', hex: '#D8A499' }, size: { id: '3-6m', label: '3–6M', cm: '68 cm' }, inventoryQuantity: 10, status: 'active' },
      { id: 'mmr-rose-69', sku: 'ROMP-ROS-69', color: { id: 'rose', name: 'Dusty Rose', hex: '#D8A499' }, size: { id: '6-9m', label: '6–9M', cm: '74 cm' }, inventoryQuantity: 5, status: 'active' },
      { id: 'mmr-rose-912', sku: 'ROMP-ROS-912', color: { id: 'rose', name: 'Dusty Rose', hex: '#D8A499' }, size: { id: '9-12m', label: '9–12M', cm: '80 cm' }, inventoryQuantity: 2, lowStockThreshold: 3, status: 'active' },
      
      { id: 'mmr-but-36', sku: 'ROMP-BUT-36', color: { id: 'butter', name: 'Warm Butter', hex: '#F0DC9C' }, size: { id: '3-6m', label: '3–6M', cm: '68 cm' }, inventoryQuantity: 8, status: 'active' },
      { id: 'mmr-but-69', sku: 'ROMP-BUT-69', color: { id: 'butter', name: 'Warm Butter', hex: '#F0DC9C' }, size: { id: '6-9m', label: '6–9M', cm: '74 cm' }, inventoryQuantity: 6, status: 'active' }
    ],
    images: [
      {
        id: 'mmr-img-1',
        url: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?q=80&w=900&auto=format&fit=crop',
        alt: 'Baby resting sweetly in Meadow Muslin Romper',
        type: 'model',
        colorId: 'rose',
        sortOrder: 1
      },
      {
        id: 'mmr-img-2',
        url: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=900&auto=format&fit=crop',
        alt: 'Detail of soft muslin fabric and buttons',
        type: 'fabric',
        colorId: 'rose',
        sortOrder: 2
      }
    ],
    completeTheLookIds: ['soft-sole-walker-sandals'],
    createdAt: '2026-03-04T10:00:00Z',
    updatedAt: '2026-03-16T12:00:00Z'
  },
  {
    id: 'sunny-day-matching-set',
    slug: 'sunny-day-matching-set',
    commerceType: 'apparel',
    name: 'Sunny Day Matching Set',
    subtitle: '2-Piece Ribbed Tee & Bloomer Shorts Co-Ord',
    productType: 'set',
    ageGroup: 'baby',
    ageLabel: '0–24M',
    description: 'An effortless ready-to-wear set for sunny strolls and playdates. Made with custom wide-ribbed cotton jersey that moves with your child while keeping its flattering shape.\n\nIncludes a boxy drop-shoulder tee and matching bloomer shorts with a gentle elastic waist. Wear together for an editorial coordinated look, or mix and match with the rest of their wardrobe.',
    price: 1650,
    compareAtPrice: 1950,
    currency: 'BDT',
    rating: 4.9,
    reviewCount: 51,
    status: 'active',
    badges: ['2-PIECE SET', 'NEW DROP'],
    featured: true,
    categoryIds: ['sets', 'baby'],
    collectionIds: ['new-in', 'summer-edit'],
    materials: [
      { name: 'Ribbed Organic Cotton', percentage: 95, description: 'Soft wide-gauge rib with breathability' },
      { name: 'Elastane', percentage: 5, description: 'Recovery stretch that maintains elasticity' }
    ],
    careInstructions: [
      'Machine wash 30°C gentle cycle',
      'Wash inside out with similar shades',
      'Warm iron on reverse'
    ],
    fit: {
      type: 'relaxed',
      stretchLevel: 'high',
      notes: 'High-stretch ribbing makes dressing wiggly babies effortless.'
    },
    colors: [
      { id: 'honey', name: 'Warm Honey', hex: '#DDA15E' },
      { id: 'sky', name: 'Sky Blue', hex: '#8EADC4' },
      { id: 'clay', name: 'Soft Clay', hex: '#C48B71' }
    ],
    sizes: [
      { id: '0-3m', label: '0–3M', system: 'clothing', cm: '62 cm' },
      { id: '3-6m', label: '3–6M', system: 'clothing', cm: '68 cm' },
      { id: '6-9m', label: '6–9M', system: 'clothing', cm: '74 cm' },
      { id: '9-12m', label: '9–12M', system: 'clothing', cm: '80 cm' },
      { id: '12-18m', label: '12–18M', system: 'clothing', cm: '86 cm' },
      { id: '18-24m', label: '18–24M', system: 'clothing', cm: '92 cm' }
    ],
    variants: [
      { id: 'sdms-h-36', sku: 'SET-HNY-36', color: { id: 'honey', name: 'Warm Honey', hex: '#DDA15E' }, size: { id: '3-6m', label: '3–6M', cm: '68 cm' }, inventoryQuantity: 9, status: 'active' },
      { id: 'sdms-h-69', sku: 'SET-HNY-69', color: { id: 'honey', name: 'Warm Honey', hex: '#DDA15E' }, size: { id: '6-9m', label: '6–9M', cm: '74 cm' }, inventoryQuantity: 12, status: 'active' },
      { id: 'sdms-h-912', sku: 'SET-HNY-912', color: { id: 'honey', name: 'Warm Honey', hex: '#DDA15E' }, size: { id: '9-12m', label: '9–12M', cm: '80 cm' }, inventoryQuantity: 7, status: 'active' },
      { id: 'sdms-h-1218', sku: 'SET-HNY-1218', color: { id: 'honey', name: 'Warm Honey', hex: '#DDA15E' }, size: { id: '12-18m', label: '12–18M', cm: '86 cm' }, inventoryQuantity: 4, status: 'active' },
      
      { id: 'sdms-s-69', sku: 'SET-SKY-69', color: { id: 'sky', name: 'Sky Blue', hex: '#8EADC4' }, size: { id: '6-9m', label: '6–9M', cm: '74 cm' }, inventoryQuantity: 6, status: 'active' },
      { id: 'sdms-s-912', sku: 'SET-SKY-912', color: { id: 'sky', name: 'Sky Blue', hex: '#8EADC4' }, size: { id: '9-12m', label: '9–12M', cm: '80 cm' }, inventoryQuantity: 3, lowStockThreshold: 3, status: 'active' }
    ],
    images: [
      {
        id: 'sdms-img-1',
        url: 'https://images.unsplash.com/photo-1543332164-6e82f355badc?q=80&w=900&auto=format&fit=crop',
        alt: 'Toddler sitting happily wearing Sunny Day Matching Set',
        type: 'model',
        colorId: 'honey',
        sortOrder: 1
      },
      {
        id: 'sdms-img-2',
        url: 'https://images.unsplash.com/photo-1471286174890-9c112ffca564?q=80&w=900&auto=format&fit=crop',
        alt: 'Matching set flat lay showing ribbed texture',
        type: 'front',
        colorId: 'honey',
        sortOrder: 2
      }
    ],
    completeTheLookIds: ['first-step-leather-sneakers'],
    createdAt: '2026-03-05T10:00:00Z',
    updatedAt: '2026-03-15T15:00:00Z'
  },
  {
    id: 'first-step-leather-sneakers',
    slug: 'first-step-leather-sneakers',
    commerceType: 'apparel',
    name: 'First-Step Flexible Leather Sneakers',
    subtitle: 'Podiatrist-Approved Natural Nappa Leather with Ultra-Flexible Rubber Outsoles',
    productType: 'shoe',
    ageGroup: 'toddler',
    ageLabel: '9–24M',
    description: 'The premier shoe for tiny adventurers taking their very first wobbles and strides. Crafted from butter-soft non-toxic genuine leather that molds naturally to chubby toddler feet without restriction.\n\nFeatures a wide anatomical toe box allowing tiny toes to splay for natural balance, plus a zero-drop flexible natural rubber sole that bends fully in half. Dual adjustable velcro straps guarantee a secure, customizable fit.',
    price: 1850,
    compareAtPrice: 2200,
    currency: 'BDT',
    rating: 5.0,
    reviewCount: 74,
    status: 'active',
    badges: ['FIRST STEPS', 'PODIATRIST APPROVED'],
    featured: true,
    categoryIds: ['shoes', 'toddler'],
    collectionIds: ['first-steps', 'everyday-essentials'],
    materials: [
      { name: 'Genuine Nappa Leather', description: 'Soft, chrome-free breathable upper' },
      { name: 'Natural Rubber', description: 'Anti-slip featherweight flexible sole' }
    ],
    careInstructions: [
      'Wipe clean with a damp cloth',
      'Condition occasionally with natural beeswax leather balm',
      'Air dry away from direct heat sources'
    ],
    shoeAttributes: {
      footLengthCm: '11.5–15.0 cm',
      upperMaterial: '100% Breathable Nappa Leather',
      soleMaterial: 'Non-slip natural flex rubber',
      closureType: 'Velcro',
      firstStepCertified: true
    },
    fit: {
      type: 'regular',
      notes: 'Anatomical wide toe box allows toes to grip the floor naturally.'
    },
    colors: [
      { id: 'biscuit', name: 'Biscuit Tan', hex: '#CBB296' },
      { id: 'white', name: 'Chalk White', hex: '#F3EFEA' },
      { id: 'navy', name: 'Classic Navy', hex: '#233246' }
    ],
    sizes: [
      { id: 'eu-19', label: 'EU 19', system: 'EU', cm: '11.5 cm', ageHint: '9–12M' },
      { id: 'eu-20', label: 'EU 20', system: 'EU', cm: '12.2 cm', ageHint: '12–15M' },
      { id: 'eu-21', label: 'EU 21', system: 'EU', cm: '13.0 cm', ageHint: '15–18M' },
      { id: 'eu-22', label: 'EU 22', system: 'EU', cm: '13.7 cm', ageHint: '18–21M' },
      { id: 'eu-23', label: 'EU 23', system: 'EU', cm: '14.4 cm', ageHint: '21–24M' },
      { id: 'eu-24', label: 'EU 24', system: 'EU', cm: '15.0 cm', ageHint: '24M+' }
    ],
    variants: [
      { id: 'fss-bis-19', sku: 'SHOE-BIS-19', color: { id: 'biscuit', name: 'Biscuit Tan', hex: '#CBB296' }, size: { id: 'eu-19', label: 'EU 19', cm: '11.5 cm' }, inventoryQuantity: 8, status: 'active' },
      { id: 'fss-bis-20', sku: 'SHOE-BIS-20', color: { id: 'biscuit', name: 'Biscuit Tan', hex: '#CBB296' }, size: { id: 'eu-20', label: 'EU 20', cm: '12.2 cm' }, inventoryQuantity: 12, status: 'active' },
      { id: 'fss-bis-21', sku: 'SHOE-BIS-21', color: { id: 'biscuit', name: 'Biscuit Tan', hex: '#CBB296' }, size: { id: 'eu-21', label: 'EU 21', cm: '13.0 cm' }, inventoryQuantity: 7, status: 'active' },
      { id: 'fss-bis-22', sku: 'SHOE-BIS-22', color: { id: 'biscuit', name: 'Biscuit Tan', hex: '#CBB296' }, size: { id: 'eu-22', label: 'EU 22', cm: '13.7 cm' }, inventoryQuantity: 4, lowStockThreshold: 3, status: 'active' },
      { id: 'fss-bis-23', sku: 'SHOE-BIS-23', color: { id: 'biscuit', name: 'Biscuit Tan', hex: '#CBB296' }, size: { id: 'eu-23', label: 'EU 23', cm: '14.4 cm' }, inventoryQuantity: 3, status: 'active' },
      
      { id: 'fss-wht-20', sku: 'SHOE-WHT-20', color: { id: 'white', name: 'Chalk White', hex: '#F3EFEA' }, size: { id: 'eu-20', label: 'EU 20', cm: '12.2 cm' }, inventoryQuantity: 9, status: 'active' },
      { id: 'fss-wht-21', sku: 'SHOE-WHT-21', color: { id: 'white', name: 'Chalk White', hex: '#F3EFEA' }, size: { id: 'eu-21', label: 'EU 21', cm: '13.0 cm' }, inventoryQuantity: 6, status: 'active' },
      { id: 'fss-wht-22', sku: 'SHOE-WHT-22', color: { id: 'white', name: 'Chalk White', hex: '#F3EFEA' }, size: { id: 'eu-22', label: 'EU 22', cm: '13.7 cm' }, inventoryQuantity: 0, status: 'active' }
    ],
    images: [
      {
        id: 'fss-img-1',
        url: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=900&auto=format&fit=crop',
        alt: 'First-Step Leather Sneakers pair in Biscuit Tan',
        type: 'front',
        colorId: 'biscuit',
        sortOrder: 1
      },
      {
        id: 'fss-img-2',
        url: 'https://images.unsplash.com/photo-1516478177764-9fe5bd7e9717?q=80&w=900&auto=format&fit=crop',
        alt: 'Toddler taking first steps wearing sneakers outside',
        type: 'model',
        colorId: 'biscuit',
        sortOrder: 2
      },
      {
        id: 'fss-img-3',
        url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=900&auto=format&fit=crop',
        alt: 'Shoe flex test showing natural bend of sole',
        type: 'detail',
        colorId: 'biscuit',
        sortOrder: 3
      }
    ],
    completeTheLookIds: ['cloud-soft-pocket-shirt', 'little-explorer-cargo-pants'],
    createdAt: '2026-03-06T10:00:00Z',
    updatedAt: '2026-03-18T10:00:00Z'
  },
  {
    id: 'cozy-cable-knit-cardigan',
    slug: 'cozy-cable-knit-cardigan',
    commerceType: 'apparel',
    name: 'Cozy Cable Knit Cardigan',
    subtitle: 'Heirloom Fine Merino-Cotton Blend with Horn Buttons',
    productType: 'outerwear',
    ageGroup: 'baby',
    ageLabel: '0–24M',
    description: 'An heirloom keepsake cardigan crafted with traditional heritage cable stitches. Knitted from a featherweight Australian extra-fine merino and combed cotton blend that warms gently without overheating.\n\nFinished with ribbed plackets, ribbed cuffs that can be folded back for little wrists, and authentic carved horn buttons.',
    price: 1950,
    compareAtPrice: 2400,
    currency: 'BDT',
    rating: 4.9,
    reviewCount: 38,
    status: 'active',
    badges: ['HEIRLOOM QUALITY', 'MERINO BLEND'],
    featured: false,
    categoryIds: ['outerwear', 'baby'],
    collectionIds: ['new-in', 'everyday-essentials'],
    materials: [
      { name: 'Extra-Fine Merino Wool', percentage: 50, description: 'Naturally thermo-regulating and odor-resistant' },
      { name: 'Organic Combed Cotton', percentage: 50, description: 'Breathable, itch-free softness' }
    ],
    careInstructions: [
      'Hand wash cold or wool cycle (30°C)',
      'Dry flat on a clean towel',
      'Do not wring or hang dry'
    ],
    fit: {
      type: 'regular',
      stretchLevel: 'medium',
      notes: 'Generous layering room over bodysuits or tees.'
    },
    colors: [
      { id: 'vanilla', name: 'Vanilla Cream', hex: '#F6F1E5' },
      { id: 'heather', name: 'Heather Oat', hex: '#D2C8BA' }
    ],
    sizes: [
      { id: '0-3m', label: '0–3M', system: 'clothing', cm: '62 cm' },
      { id: '3-6m', label: '3–6M', system: 'clothing', cm: '68 cm' },
      { id: '6-9m', label: '6–9M', system: 'clothing', cm: '74 cm' },
      { id: '9-12m', label: '9–12M', system: 'clothing', cm: '80 cm' },
      { id: '12-18m', label: '12–18M', system: 'clothing', cm: '86 cm' }
    ],
    variants: [
      { id: 'ckc-v-36', sku: 'CARD-VAN-36', color: { id: 'vanilla', name: 'Vanilla Cream', hex: '#F6F1E5' }, size: { id: '3-6m', label: '3–6M', cm: '68 cm' }, inventoryQuantity: 6, status: 'active' },
      { id: 'ckc-v-69', sku: 'CARD-VAN-69', color: { id: 'vanilla', name: 'Vanilla Cream', hex: '#F6F1E5' }, size: { id: '6-9m', label: '6–9M', cm: '74 cm' }, inventoryQuantity: 8, status: 'active' },
      { id: 'ckc-v-912', sku: 'CARD-VAN-912', color: { id: 'vanilla', name: 'Vanilla Cream', hex: '#F6F1E5' }, size: { id: '9-12m', label: '9–12M', cm: '80 cm' }, inventoryQuantity: 5, status: 'active' }
    ],
    images: [
      {
        id: 'ckc-img-1',
        url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=900&auto=format&fit=crop',
        alt: 'Cable knit cardigan in vanilla cream on wooden table',
        type: 'front',
        colorId: 'vanilla',
        sortOrder: 1
      },
      {
        id: 'ckc-img-2',
        url: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=900&auto=format&fit=crop',
        alt: 'Cable stitch close-up detail',
        type: 'fabric',
        colorId: 'vanilla',
        sortOrder: 2
      }
    ],
    completeTheLookIds: ['little-explorer-cargo-pants', 'first-step-leather-sneakers'],
    createdAt: '2026-03-07T10:00:00Z',
    updatedAt: '2026-03-17T11:00:00Z'
  },
  {
    id: 'soft-sole-walker-sandals',
    slug: 'soft-sole-walker-sandals',
    commerceType: 'apparel',
    name: 'Soft-Sole Pre-Walker Sandals',
    subtitle: 'Breathable T-Strap Sandals in Vegetable-Tanned Suede',
    productType: 'shoe',
    ageGroup: 'baby',
    ageLabel: '0–18M',
    description: 'Designed specifically for early movers and pre-walkers. Soft buttery suede upper with gentle cutout vents ensures little toes stay cool in humid weather.\n\nFlexible suede soles provide tactile sensory feedback while protecting tender feet on warm pavements and carpet.',
    price: 1350,
    compareAtPrice: 1650,
    currency: 'BDT',
    rating: 4.8,
    reviewCount: 29,
    status: 'active',
    badges: ['SUMMER FAVORITE'],
    featured: false,
    categoryIds: ['shoes', 'baby'],
    collectionIds: ['summer-edit', 'first-steps'],
    materials: [
      { name: 'Vegetable-Tanned Suede', description: 'Hypoallergenic soft suede without harsh dyes' },
      { name: 'Soft Suede Sole', description: 'Sensory feedback sole with non-slip grip pads' }
    ],
    careInstructions: [
      'Brush gently with a soft suede brush',
      'Do not submerge in water'
    ],
    shoeAttributes: {
      footLengthCm: '10.5–13.0 cm',
      upperMaterial: 'Vegetable Suede',
      soleMaterial: 'Flexible sensory suede with grip pads',
      closureType: 'Velcro',
      firstStepCertified: true
    },
    colors: [
      { id: 'caramel', name: 'Warm Caramel', hex: '#B87A4B' },
      { id: 'sage', name: 'Dusty Sage', hex: '#8F9F8B' }
    ],
    sizes: [
      { id: 'eu-17', label: 'EU 17', system: 'EU', cm: '10.5 cm', ageHint: '0–6M' },
      { id: 'eu-18', label: 'EU 18', system: 'EU', cm: '11.0 cm', ageHint: '6–9M' },
      { id: 'eu-19', label: 'EU 19', system: 'EU', cm: '11.8 cm', ageHint: '9–12M' },
      { id: 'eu-20', label: 'EU 20', system: 'EU', cm: '12.5 cm', ageHint: '12–18M' }
    ],
    variants: [
      { id: 'ssws-c-17', sku: 'SAND-CAR-17', color: { id: 'caramel', name: 'Warm Caramel', hex: '#B87A4B' }, size: { id: 'eu-17', label: 'EU 17', cm: '10.5 cm' }, inventoryQuantity: 8, status: 'active' },
      { id: 'ssws-c-18', sku: 'SAND-CAR-18', color: { id: 'caramel', name: 'Warm Caramel', hex: '#B87A4B' }, size: { id: 'eu-18', label: 'EU 18', cm: '11.0 cm' }, inventoryQuantity: 10, status: 'active' },
      { id: 'ssws-c-19', sku: 'SAND-CAR-19', color: { id: 'caramel', name: 'Warm Caramel', hex: '#B87A4B' }, size: { id: 'eu-19', label: 'EU 19', cm: '11.8 cm' }, inventoryQuantity: 6, status: 'active' },
      { id: 'ssws-c-20', sku: 'SAND-CAR-20', color: { id: 'caramel', name: 'Warm Caramel', hex: '#B87A4B' }, size: { id: 'eu-20', label: 'EU 20', cm: '12.5 cm' }, inventoryQuantity: 4, status: 'active' }
    ],
    images: [
      {
        id: 'ssws-img-1',
        url: 'https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?q=80&w=900&auto=format&fit=crop',
        alt: 'Soft-Sole Walker Sandals in Caramel',
        type: 'front',
        colorId: 'caramel',
        sortOrder: 1
      }
    ],
    completeTheLookIds: ['meadow-muslin-romper'],
    createdAt: '2026-03-08T10:00:00Z',
    updatedAt: '2026-03-16T08:00:00Z'
  }
];
