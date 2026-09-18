import type { AgeRange, Category, Interest, DevelopmentalBenefit, Material, Occasion } from '../index';

export type ProductStatus = 'draft' | 'active' | 'archived';

export type ProductImageType = 'primary' | 'gallery' | 'lifestyle' | 'detail' | 'scale';

export interface ProductImageItem {
  id: string;
  url: string;
  alt: string;
  type: ProductImageType;
  sortOrder: number;
}

export interface DevelopmentMilestone {
  title: string;
  description: string;
  iconName?: string;
}

export interface WhatsInsideItem {
  name: string;
  count: string;
  detail: string;
}

export interface ProductInventory {
  trackInventory: boolean;
  quantity: number;
  lowStockThreshold: number;
  allowBackorder: boolean;
  sku: string;
}

export interface AdminProduct {
  id: string;
  name: string;
  slug: string;
  subtitle?: string;
  tag?: 'BESTSELLER' | 'NEW' | 'STAFF PICK' | 'RESTOCKED' | '';
  status: ProductStatus;
  price: number;
  originalPrice?: number;
  currency: string;
  rating: number;
  reviewCount: number;

  // Age & Category
  ageBadge: string;
  ageGroup: AgeRange;
  category: Category;
  categoryId?: string;
  collectionIds?: string[];

  // Child development & materials
  interests: Interest[];
  benefits: DevelopmentalBenefit[];
  materials: Material[];
  occasions: Occasion[];

  // Editorial & details
  valueStatement: string;
  description: string;
  sensoryQuote: string;
  whyKidsLoveIt: string;
  developmentMilestones: DevelopmentMilestone[];
  whatsInside: WhatsInsideItem[];

  // Media
  images: ProductImageItem[];
  featuredImageId?: string;

  // Dimensions & Care
  dimensions: string;
  careInstructions: string;
  safetyNotes: string;

  // Inventory
  inventory: ProductInventory;
  inStock: boolean;

  // SEO & Flags
  featured?: boolean;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
  };

  createdAt: string;
  updatedAt: string;
}

export interface CreateProductPayload {
  name: string;
  slug: string;
  subtitle?: string;
  tag?: 'BESTSELLER' | 'NEW' | 'STAFF PICK' | 'RESTOCKED' | '';
  status: ProductStatus;
  price: number;
  originalPrice?: number;
  currency?: string;
  ageBadge: string;
  ageGroup: AgeRange;
  category: Category;
  categoryId?: string;
  collectionIds?: string[];
  interests: Interest[];
  benefits: DevelopmentalBenefit[];
  materials: Material[];
  occasions: Occasion[];
  valueStatement: string;
  description: string;
  sensoryQuote: string;
  whyKidsLoveIt: string;
  developmentMilestones: DevelopmentMilestone[];
  whatsInside: WhatsInsideItem[];
  images: ProductImageItem[];
  dimensions: string;
  careInstructions: string;
  safetyNotes: string;
  inventory: ProductInventory;
  featured?: boolean;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
  };
}

export type UpdateProductPayload = Partial<CreateProductPayload>;

export interface ProductFilterParams {
  search?: string;
  category?: string;
  status?: ProductStatus | 'all';
  stockStatus?: 'all' | 'in_stock' | 'low_stock' | 'out_of_stock';
  sortBy?: 'name' | 'price' | 'quantity' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}
