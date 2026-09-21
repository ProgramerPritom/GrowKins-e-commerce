export type ApparelProductType =
  | 'shirt'
  | 'tshirt'
  | 'top'
  | 'pants'
  | 'shorts'
  | 'romper'
  | 'bodysuit'
  | 'dress'
  | 'set'
  | 'outerwear'
  | 'sleepwear'
  | 'shoe'
  | 'sock'
  | 'accessory';

export type ApparelAgeGroup =
  | 'newborn'
  | 'baby'
  | 'toddler'
  | 'kids';

export interface ApparelColor {
  id: string;
  name: string;
  hex: string;
}

export interface ApparelSize {
  id: string;
  label: string;
  system?: 'clothing' | 'EU' | 'UK' | 'US' | 'CM' | 'baby' | 'toddler' | 'shoe';
  cm?: string;
  ageHint?: string;
}

export interface ApparelVariant {
  id: string;
  sku: string;
  color: ApparelColor;
  size: ApparelSize;
  price?: number;
  compareAtPrice?: number;
  inventoryQuantity: number;
  lowStockThreshold?: number;
  status: 'active' | 'inactive';
  imageIds?: string[];
}

export interface ApparelMedia {
  id: string;
  url: string;
  alt?: string;
  altText?: string;
  type: 'front' | 'back' | 'side' | 'model' | 'lifestyle' | 'fabric' | 'detail' | 'product';
  viewAngle?: string;
  colorId?: string;
  sortOrder?: number;
}

export interface MaterialComponent {
  name: string;
  percentage?: number;
  description?: string;
}

export interface CareInstruction {
  code: string;
  label: string;
  icon?: string;
}

export interface FitDetails {
  type: 'slim' | 'regular' | 'relaxed' | 'oversized';
  stretchLevel?: 'none' | 'subtle' | 'medium' | 'high';
  length?: string;
  notes?: string;
}

export interface ShoeAttributes {
  footLengthCm: string;
  upperMaterial: string;
  soleMaterial: string;
  closureType: 'Velcro' | 'Slip-on' | 'Elastic' | 'Lace-up';
  firstStepCertified: boolean;
}

export interface ApparelProduct {
  id: string;
  slug: string;
  commerceType: 'apparel';
  name: string;
  subtitle?: string;
  productType: ApparelProductType;
  ageGroup: ApparelAgeGroup;
  ageLabel: string;
  description: string;
  price: number; // in BDT ৳
  compareAtPrice?: number;
  currency: string;
  rating: number;
  reviewCount: number;
  status: 'draft' | 'active' | 'archived';
  badges?: string[];
  
  // Categorization & Collections
  categoryIds: string[];
  collectionIds: string[];

  // Materials, Care & Fit
  materials: MaterialComponent[];
  careInstructions: string[];
  fit?: FitDetails;
  shoeAttributes?: ShoeAttributes;

  // Variants & Media
  colors: ApparelColor[];
  sizes: ApparelSize[];
  variants: ApparelVariant[];
  images: ApparelMedia[];

  // Merchandising
  featured?: boolean;
  completeTheLookIds?: string[];
  relatedProductIds?: string[];

  createdAt: string;
  updatedAt: string;
}

export interface ApparelCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  itemCount?: number;
  featured?: boolean;
  sortOrder: number;
  status?: 'active' | 'draft';
}
export type ClothingCategory = ApparelCategory;

export interface ApparelCollection {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  campaignImage?: string;
  image?: string;
  productIds: string[];
  sortOrder: number;
  status: 'active' | 'draft';
  description?: string;
}
export type ClothingCollection = ApparelCollection;

export interface LookHotspot {
  id: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  productId: string;
}

export interface FashionLook {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  hotspots: LookHotspot[];
  productIds: string[];
  status: 'active' | 'draft';
  sortOrder: number;
}

export interface SizeGuideRow {
  age?: string;
  ageLabel?: string;
  heightCm?: string;
  weightKg?: string;
  chestCm?: string;
  waistCm?: string;
  footLengthCm?: string;
  euSize?: string;
  recommendedSize?: string;
}

export interface SizeGuide {
  id: string;
  title: string;
  category: 'clothing' | 'shoes';
  description: string;
  measurementUnit: 'cm' | 'in';
  rows: SizeGuideRow[];
  howToMeasure?: {
    step: string;
    instructions: string;
  }[];
  measuringTips?: {
    title: string;
    instruction: string;
  }[];
}

export interface ClothingHomepageCMS {
  hero: {
    eyebrow: string;
    headline: string;
    description: string;
    subheadline?: string;
    desktopImage: string;
    mobileImage: string;
    primaryCtaText: string;
    ctaText?: string;
    primaryCtaLink: string;
    secondaryCtaText: string;
    secondaryCtaLink: string;
  };
  wardrobeTiles: {
    title: string;
    slug: string;
    image: string;
    itemCountText: string;
  }[];
  newDropCollectionId: string;
  featuredLookId: string;
  materialStory: {
    headline: string;
    subheadline: string;
    cards: {
      title: string;
      description: string;
      image: string;
    }[];
  };
  seasonalEditorial: {
    title: string;
    subtitle: string;
    image: string;
    link: string;
    ctaText: string;
  };
  seasonalCampaign?: {
    title: string;
    subtitle?: string;
    image: string;
    link?: string;
    ctaText: string;
  };
}
