import type {
  ApparelProduct,
  ApparelCategory,
  ApparelCollection,
  FashionLook,
  SizeGuide,
  ClothingHomepageCMS,
  ApparelVariant
} from '../../types/clothing';

export interface ClothingFilterParams {
  category?: string;
  age?: string;
  size?: string;
  color?: string;
  material?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  collection?: string;
  productType?: string;
  search?: string;
  sort?: 'featured' | 'newest' | 'price-asc' | 'price-desc' | 'rating';
  page?: number;
  limit?: number;
}

export interface ClothingProductListResult {
  items: ApparelProduct[];
  total: number;
  page: number;
  totalPages: number;
}

export interface IClothingService {
  // Storefront methods
  getProducts(params?: ClothingFilterParams): Promise<ClothingProductListResult>;
  getProductBySlug(slug: string): Promise<ApparelProduct | null>;
  getProductById(id: string): Promise<ApparelProduct | null>;
  getCategories(): Promise<ApparelCategory[]>;
  getCollections(): Promise<ApparelCollection[]>;
  getCollectionBySlug(slug: string): Promise<{ collection: ApparelCollection; products: ApparelProduct[] } | null>;
  getLooks(): Promise<FashionLook[]>;
  getLookById(id: string): Promise<FashionLook | null>;
  getSizeGuides(): Promise<SizeGuide[]>;
  getSizeGuideById(id: string): Promise<SizeGuide | null>;
  getHomepageCMS(): Promise<ClothingHomepageCMS>;

  // Admin methods
  createProduct(payload: Omit<ApparelProduct, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApparelProduct>;
  updateProduct(id: string, payload: Partial<ApparelProduct>): Promise<ApparelProduct>;
  deleteProduct(id: string): Promise<boolean>;
  updateVariantInventory(productId: string, variantId: string, quantity: number): Promise<ApparelVariant>;
  saveLook(look: FashionLook): Promise<FashionLook>;
  updateLook(id: string, look: Partial<FashionLook>): Promise<FashionLook>;
  deleteLook(id: string): Promise<boolean>;
  getHomepageContent(): Promise<ClothingHomepageCMS>;
  saveHomepageCMS(cms: ClothingHomepageCMS): Promise<ClothingHomepageCMS>;
  updateHomepageContent(cms: Partial<ClothingHomepageCMS>): Promise<ClothingHomepageCMS>;
  saveSizeGuide(guide: SizeGuide): Promise<SizeGuide>;
  updateSizeGuide(id: string, guide: Partial<SizeGuide>): Promise<SizeGuide>;
  saveCategory(category: ApparelCategory): Promise<ApparelCategory>;
  createCategory(category: ApparelCategory): Promise<ApparelCategory>;
  updateCategory(id: string, category: Partial<ApparelCategory>): Promise<ApparelCategory>;
  saveCollection(collection: ApparelCollection): Promise<ApparelCollection>;
  createCollection(collection: ApparelCollection): Promise<ApparelCollection>;
  updateCollection(id: string, collection: Partial<ApparelCollection>): Promise<ApparelCollection>;
}
