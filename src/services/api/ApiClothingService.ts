import type {
  IClothingService,
  ClothingFilterParams,
  ClothingProductListResult
} from '../interfaces/IClothingService';
import type {
  ApparelProduct,
  ApparelCategory,
  ApparelCollection,
  FashionLook,
  SizeGuide,
  ClothingHomepageCMS,
  ApparelVariant
} from '../../types/clothing';
import { apiClient } from '../../lib/api/client';

export class ApiClothingService implements IClothingService {
  public async getProducts(params?: ClothingFilterParams): Promise<ClothingProductListResult> {
    return apiClient.get<ClothingProductListResult>('/api/clothing/products', params as any);
  }

  public async getProductBySlug(slug: string): Promise<ApparelProduct | null> {
    return apiClient.get<ApparelProduct>(`/api/clothing/products/${slug}`);
  }

  public async getProductById(id: string): Promise<ApparelProduct | null> {
    return apiClient.get<ApparelProduct>(`/api/clothing/products/id/${id}`);
  }

  public async getCategories(): Promise<ApparelCategory[]> {
    return apiClient.get<ApparelCategory[]>('/api/clothing/categories');
  }

  public async getCollections(): Promise<ApparelCollection[]> {
    return apiClient.get<ApparelCollection[]>('/api/clothing/collections');
  }

  public async getCollectionBySlug(
    slug: string
  ): Promise<{ collection: ApparelCollection; products: ApparelProduct[] } | null> {
    return apiClient.get<{ collection: ApparelCollection; products: ApparelProduct[] }>(
      `/api/clothing/collections/${slug}`
    );
  }

  public async getLooks(): Promise<FashionLook[]> {
    return apiClient.get<FashionLook[]>('/api/clothing/lookbooks');
  }

  public async getLookById(id: string): Promise<FashionLook | null> {
    return apiClient.get<FashionLook>(`/api/clothing/lookbooks/${id}`);
  }

  public async getSizeGuides(): Promise<SizeGuide[]> {
    return apiClient.get<SizeGuide[]>('/api/clothing/size-guides');
  }

  public async getSizeGuideById(id: string): Promise<SizeGuide | null> {
    return apiClient.get<SizeGuide>(`/api/clothing/size-guides/${id}`);
  }

  public async getHomepageCMS(): Promise<ClothingHomepageCMS> {
    return apiClient.get<ClothingHomepageCMS>('/api/clothing/content/homepage');
  }

  public async createProduct(
    payload: Omit<ApparelProduct, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<ApparelProduct> {
    return apiClient.post<ApparelProduct>('/api/admin/clothing/products', payload);
  }

  public async updateProduct(id: string, payload: Partial<ApparelProduct>): Promise<ApparelProduct> {
    return apiClient.patch<ApparelProduct>(`/api/admin/clothing/products/${id}`, payload);
  }

  public async deleteProduct(id: string): Promise<boolean> {
    await apiClient.delete(`/api/admin/clothing/products/${id}`);
    return true;
  }

  public async updateVariantInventory(
    productId: string,
    variantId: string,
    quantity: number
  ): Promise<ApparelVariant> {
    return apiClient.patch<ApparelVariant>(
      `/api/admin/clothing/products/${productId}/variants/${variantId}/inventory`,
      { quantity }
    );
  }

  public async saveLook(look: FashionLook): Promise<FashionLook> {
    return apiClient.post<FashionLook>('/api/admin/clothing/lookbooks', look);
  }

  public async updateLook(id: string, look: Partial<FashionLook>): Promise<FashionLook> {
    return apiClient.patch<FashionLook>(`/api/admin/clothing/lookbooks/${id}`, look);
  }

  public async deleteLook(id: string): Promise<boolean> {
    await apiClient.delete(`/api/admin/clothing/lookbooks/${id}`);
    return true;
  }

  public async getHomepageContent(): Promise<ClothingHomepageCMS> {
    return this.getHomepageCMS();
  }

  public async saveHomepageCMS(cms: ClothingHomepageCMS): Promise<ClothingHomepageCMS> {
    return apiClient.patch<ClothingHomepageCMS>('/api/admin/clothing/content/homepage', cms);
  }

  public async updateHomepageContent(cms: Partial<ClothingHomepageCMS>): Promise<ClothingHomepageCMS> {
    return apiClient.patch<ClothingHomepageCMS>('/api/admin/clothing/content/homepage', cms);
  }

  public async saveSizeGuide(guide: SizeGuide): Promise<SizeGuide> {
    return apiClient.post<SizeGuide>('/api/admin/clothing/size-guides', guide);
  }

  public async updateSizeGuide(id: string, guide: Partial<SizeGuide>): Promise<SizeGuide> {
    return apiClient.patch<SizeGuide>(`/api/admin/clothing/size-guides/${id}`, guide);
  }

  public async saveCategory(category: ApparelCategory): Promise<ApparelCategory> {
    return apiClient.post<ApparelCategory>('/api/admin/clothing/categories', category);
  }

  public async createCategory(category: ApparelCategory): Promise<ApparelCategory> {
    return this.saveCategory(category);
  }

  public async updateCategory(id: string, category: Partial<ApparelCategory>): Promise<ApparelCategory> {
    return apiClient.patch<ApparelCategory>(`/api/admin/clothing/categories/${id}`, category);
  }

  public async saveCollection(collection: ApparelCollection): Promise<ApparelCollection> {
    return apiClient.post<ApparelCollection>('/api/admin/clothing/collections', collection);
  }

  public async createCollection(collection: ApparelCollection): Promise<ApparelCollection> {
    return this.saveCollection(collection);
  }

  public async updateCollection(id: string, collection: Partial<ApparelCollection>): Promise<ApparelCollection> {
    return apiClient.patch<ApparelCollection>(`/api/admin/clothing/collections/${id}`, collection);
  }
}

export const apiClothingService = new ApiClothingService();
