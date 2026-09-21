export type AgeRange = '0–12M' | '1–2Y' | '3–5Y' | '6–8Y' | '9Y+';

export type Category = 
  | 'Open-ended play'
  | 'Stacking toys'
  | 'Building sets'
  | 'Art & Craft'
  | 'Sensory'
  | 'Pretend play'
  | 'Books & Storytelling';

export type Interest = 
  | 'Creating'
  | 'Building'
  | 'Exploring'
  | 'Moving'
  | 'Pretending'
  | 'Reading';

export type DevelopmentalBenefit = 
  | 'Creativity'
  | 'Fine motor'
  | 'Focus'
  | 'Language'
  | 'Balance'
  | 'Spatial thinking'
  | 'Sensory discovery';

export type Material = 
  | 'FSC beechwood'
  | 'Organic cotton'
  | 'Natural beeswax'
  | 'Recycled wool'
  | 'Plant-based silicone';

export type Occasion = 
  | 'Birthday'
  | 'Eid gift'
  | 'Akika / New baby'
  | 'Everyday play'
  | 'Travel'
  | 'Gift';

export type DeliveryZone = 'inside-dhaka' | 'outside-dhaka';

export interface Product {
  id: string;
  name: string;
  subtitle?: string;
  tag?: 'BESTSELLER' | 'NEW' | 'STAFF PICK' | 'RESTOCKED';
  price: number; // in BDT ৳
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  ageBadge: string;
  ageGroup: AgeRange;
  category: Category;
  interests: Interest[];
  benefits: DevelopmentalBenefit[];
  materials: Material[];
  occasions: Occasion[];
  valueStatement: string;
  description: string;
  sensoryQuote: string;
  whyKidsLoveIt: string;
  developmentMilestones: {
    title: string;
    description: string;
    iconName?: string;
  }[];
  whatsInside: {
    name: string;
    count: string;
    detail: string;
  }[];
  images: {
    main: string;
    secondary: string;
    childHolding?: string;
    inPlay?: string;
    detail?: string;
    scaleRef?: string;
    gallery?: string[];
  };
  dimensions: string;
  careInstructions: string;
  safetyNotes: string;
  inStock: boolean;
}

export interface CartVariantInfo {
  sku: string;
  color?: {
    id: string;
    name: string;
    hex?: string;
  };
  size?: {
    id: string;
    label: string;
    system?: string;
    cm?: string;
  };
  price?: number;
}

export interface CartItem {
  id?: string;
  product: Product;
  quantity: number;
  variant?: CartVariantInfo;
}

export * from './clothing';

export interface DeliveryDetails {
  fullName: string;
  phone: string;
  email?: string;
  deliveryZone: DeliveryZone;
  district: string;
  thanaArea: string;
  streetAddress: string;
  orderNote?: string;
  isGift?: boolean;
  giftRecipientName?: string;
  giftMessage?: string;
}

export interface Order {
  orderNumber: string;
  items: CartItem[];
  delivery: DeliveryDetails;
  subtotal: number;
  deliveryFee: number;
  total: number;
  createdAt: string;
  status: 'Order received' | 'Confirmed via Phone' | 'Packing parcel' | 'With Courier' | 'Delivered';
  paymentMethod: 'Cash on Delivery';
}

export interface ReviewItem {
  id: string;
  author: string;
  authorRole: string;
  rating: number;
  title: string;
  content: string;
  date: string;
  childAge: string;
  photoUrl?: string;
  verified: boolean;
}

export interface Personality {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  colorBg: string;
  accentColor: string;
  image: string;
  recommendedCategory: Category;
  interests: Interest[];
}

export interface StageInfo {
  id: AgeRange;
  label: string;
  persona: string;
  ageYears: string;
  tagline: string;
  description: string;
  themeColor: string;
  recommendedProductIds: string[];
}
