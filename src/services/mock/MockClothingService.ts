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
import { MockDatabase } from '../../lib/mockDb/MockDatabase';

const delay = (ms = 120) => new Promise((resolve) => setTimeout(resolve, ms));

export class MockClothingService implements IClothingService {
  public async getProducts(params: ClothingFilterParams = {}): Promise<ClothingProductListResult> {
    await delay(80);
    let items = [...MockDatabase.getClothingProducts()];

    // Search query
    if (params.search && params.search.trim()) {
      const q = params.search.toLowerCase().trim();
      items = items.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.productType.toLowerCase().includes(q) ||
          p.colors.some((c) => c.name.toLowerCase().includes(q)) ||
          p.materials.some((m) => m.name.toLowerCase().includes(q))
      );
    }

    // Category filter
    if (params.category && params.category !== 'all') {
      const catLower = params.category.toLowerCase();
      items = items.filter((p) =>
        p.categoryIds.some((c) => c.toLowerCase() === catLower) ||
        p.productType.toLowerCase() === catLower
      );
    }

    // Age filter
    if (params.age && params.age !== 'all') {
      const ageLower = params.age.toLowerCase();
      items = items.filter(
        (p) =>
          p.ageGroup.toLowerCase() === ageLower ||
          p.sizes.some((s) => s.id.toLowerCase() === ageLower || s.label.toLowerCase() === ageLower)
      );
    }

    // Size filter
    if (params.size && params.size !== 'all') {
      const sizeLower = params.size.toLowerCase();
      items = items.filter((p) =>
        p.sizes.some(
          (s) =>
            s.id.toLowerCase() === sizeLower ||
            s.label.toLowerCase() === sizeLower
        )
      );
    }

    // Color filter
    if (params.color && params.color !== 'all') {
      const colorLower = params.color.toLowerCase();
      items = items.filter((p) =>
        p.colors.some((c) => c.id.toLowerCase() === colorLower || c.name.toLowerCase().includes(colorLower))
      );
    }

    // Material filter
    if (params.material && params.material !== 'all') {
      const matLower = params.material.toLowerCase();
      items = items.filter((p) =>
        p.materials.some((m) => m.name.toLowerCase().includes(matLower))
      );
    }

    // Collection filter
    if (params.collection && params.collection !== 'all') {
      const colLower = params.collection.toLowerCase();
      items = items.filter((p) =>
        p.collectionIds.some((c) => c.toLowerCase() === colLower)
      );
    }

    // Product Type
    if (params.productType && params.productType !== 'all') {
      const ptLower = params.productType.toLowerCase();
      items = items.filter((p) => p.productType.toLowerCase() === ptLower);
    }

    // Price range
    if (params.minPrice !== undefined) {
      items = items.filter((p) => p.price >= params.minPrice!);
    }
    if (params.maxPrice !== undefined) {
      items = items.filter((p) => p.price <= params.maxPrice!);
    }

    // In Stock filter
    if (params.inStock) {
      items = items.filter((p) =>
        p.variants.some((v) => v.inventoryQuantity > 0 && v.status === 'active')
      );
    }

    // Sorting
    switch (params.sort) {
      case 'price-asc':
        items.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        items.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'rating':
        items.sort((a, b) => b.rating - a.rating);
        break;
      case 'featured':
      default:
        items.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }

    const total = items.length;
    const page = params.page || 1;
    const limit = params.limit || 24;
    const totalPages = Math.ceil(total / limit) || 1;
    const startIdx = (page - 1) * limit;
    const paginatedItems = items.slice(startIdx, startIdx + limit);

    return {
      items: paginatedItems,
      total,
      page,
      totalPages
    };
  }

  public async getProductBySlug(slug: string): Promise<ApparelProduct | null> {
    await delay(50);
    const products = MockDatabase.getClothingProducts();
    return products.find((p) => p.slug === slug || p.id === slug) || null;
  }

  public async getProductById(id: string): Promise<ApparelProduct | null> {
    await delay(50);
    const products = MockDatabase.getClothingProducts();
    return products.find((p) => p.id === id) || null;
  }

  public async getCategories(): Promise<ApparelCategory[]> {
    await delay(40);
    return MockDatabase.getClothingCategories();
  }

  public async getCollections(): Promise<ApparelCollection[]> {
    await delay(40);
    return MockDatabase.getClothingCollections();
  }

  public async getCollectionBySlug(
    slug: string
  ): Promise<{ collection: ApparelCollection; products: ApparelProduct[] } | null> {
    await delay(60);
    const collections = MockDatabase.getClothingCollections();
    const collection = collections.find((c) => c.slug === slug || c.id === slug);
    if (!collection) return null;

    const allProducts = MockDatabase.getClothingProducts();
    const products = allProducts.filter((p) => collection.productIds.includes(p.id));
    return { collection, products };
  }

  public async getLooks(): Promise<FashionLook[]> {
    await delay(50);
    return MockDatabase.getClothingLooks();
  }

  public async getLookById(id: string): Promise<FashionLook | null> {
    await delay(40);
    const looks = MockDatabase.getClothingLooks();
    return looks.find((l) => l.id === id) || null;
  }

  public async getSizeGuides(): Promise<SizeGuide[]> {
    await delay(40);
    return MockDatabase.getClothingSizeGuides();
  }

  public async getSizeGuideById(id: string): Promise<SizeGuide | null> {
    await delay(40);
    const guides = MockDatabase.getClothingSizeGuides();
    return guides.find((g) => g.id === id) || null;
  }

  public async getHomepageCMS(): Promise<ClothingHomepageCMS> {
    await delay(50);
    return MockDatabase.getClothingHomepageCMS();
  }

  // Admin Methods
  public async createProduct(
    payload: Omit<ApparelProduct, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<ApparelProduct> {
    await delay(100);
    const products = MockDatabase.getClothingProducts();
    const newProduct: ApparelProduct = {
      ...payload,
      id: `apparel-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    MockDatabase.setClothingProducts([newProduct, ...products]);
    return newProduct;
  }

  public async updateProduct(id: string, payload: Partial<ApparelProduct>): Promise<ApparelProduct> {
    await delay(100);
    const products = MockDatabase.getClothingProducts();
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) throw new Error(`Product not found: ${id}`);

    const updated = {
      ...products[index],
      ...payload,
      updatedAt: new Date().toISOString()
    };
    products[index] = updated;
    MockDatabase.setClothingProducts([...products]);
    return updated;
  }

  public async deleteProduct(id: string): Promise<boolean> {
    await delay(80);
    const products = MockDatabase.getClothingProducts();
    const filtered = products.filter((p) => p.id !== id);
    MockDatabase.setClothingProducts(filtered);
    return true;
  }

  public async updateVariantInventory(
    productId: string,
    variantId: string,
    quantity: number
  ): Promise<ApparelVariant> {
    await delay(80);
    const products = MockDatabase.getClothingProducts();
    const product = products.find((p) => p.id === productId);
    if (!product) throw new Error(`Product not found: ${productId}`);

    const variant = product.variants.find((v) => v.id === variantId);
    if (!variant) throw new Error(`Variant not found: ${variantId}`);

    variant.inventoryQuantity = Math.max(0, quantity);
    MockDatabase.setClothingProducts([...products]);
    return variant;
  }

  public async saveLook(look: FashionLook): Promise<FashionLook> {
    await delay(80);
    const looks = MockDatabase.getClothingLooks();
    const existingIndex = looks.findIndex((l) => l.id === look.id);
    if (existingIndex >= 0) {
      looks[existingIndex] = look;
    } else {
      looks.push(look);
    }
    MockDatabase.setClothingLooks([...looks]);
    return look;
  }

  public async updateLook(id: string, look: Partial<FashionLook>): Promise<FashionLook> {
    await delay(60);
    const looks = MockDatabase.getClothingLooks();
    const existing = looks.find((l) => l.id === id);
    if (!existing) throw new Error(`Look not found: ${id}`);
    const updated = { ...existing, ...look } as FashionLook;
    return this.saveLook(updated);
  }

  public async deleteLook(id: string): Promise<boolean> {
    await delay(60);
    const looks = MockDatabase.getClothingLooks();
    MockDatabase.setClothingLooks(looks.filter((l) => l.id !== id));
    return true;
  }

  public async getHomepageContent(): Promise<ClothingHomepageCMS> {
    return this.getHomepageCMS();
  }

  public async saveHomepageCMS(cms: ClothingHomepageCMS): Promise<ClothingHomepageCMS> {
    await delay(80);
    MockDatabase.setClothingHomepageCMS(cms);
    return cms;
  }

  public async updateHomepageContent(cms: Partial<ClothingHomepageCMS>): Promise<ClothingHomepageCMS> {
    const current = await this.getHomepageCMS();
    const merged = { ...current, ...cms } as ClothingHomepageCMS;
    return this.saveHomepageCMS(merged);
  }

  public async saveSizeGuide(guide: SizeGuide): Promise<SizeGuide> {
    await delay(60);
    const guides = MockDatabase.getClothingSizeGuides();
    const idx = guides.findIndex((g) => g.id === guide.id);
    if (idx >= 0) {
      guides[idx] = guide;
    } else {
      guides.push(guide);
    }
    MockDatabase.setClothingSizeGuides([...guides]);
    return guide;
  }

  public async updateSizeGuide(id: string, guide: Partial<SizeGuide>): Promise<SizeGuide> {
    const guides = MockDatabase.getClothingSizeGuides();
    const existing = guides.find((g) => g.id === id);
    if (!existing) throw new Error(`Guide not found: ${id}`);
    const updated = { ...existing, ...guide } as SizeGuide;
    return this.saveSizeGuide(updated);
  }

  public async saveCategory(category: ApparelCategory): Promise<ApparelCategory> {
    await delay(60);
    const categories = MockDatabase.getClothingCategories();
    const idx = categories.findIndex((c) => c.id === category.id);
    if (idx >= 0) {
      categories[idx] = category;
    } else {
      categories.push(category);
    }
    MockDatabase.setClothingCategories([...categories]);
    return category;
  }

  public async createCategory(category: ApparelCategory): Promise<ApparelCategory> {
    return this.saveCategory(category);
  }

  public async updateCategory(id: string, category: Partial<ApparelCategory>): Promise<ApparelCategory> {
    const categories = MockDatabase.getClothingCategories();
    const existing = categories.find((c) => c.id === id);
    if (!existing) throw new Error(`Category not found: ${id}`);
    const updated = { ...existing, ...category } as ApparelCategory;
    return this.saveCategory(updated);
  }

  public async saveCollection(collection: ApparelCollection): Promise<ApparelCollection> {
    await delay(60);
    const collections = MockDatabase.getClothingCollections();
    const idx = collections.findIndex((c) => c.id === collection.id);
    if (idx >= 0) {
      collections[idx] = collection;
    } else {
      collections.push(collection);
    }
    MockDatabase.setClothingCollections([...collections]);
    return collection;
  }

  public async createCollection(collection: ApparelCollection): Promise<ApparelCollection> {
    return this.saveCollection(collection);
  }

  public async updateCollection(id: string, collection: Partial<ApparelCollection>): Promise<ApparelCollection> {
    const collections = MockDatabase.getClothingCollections();
    const existing = collections.find((c) => c.id === id);
    if (!existing) throw new Error(`Collection not found: ${id}`);
    const updated = { ...existing, ...collection } as ApparelCollection;
    return this.saveCollection(updated);
  }
}

export const mockClothingService = new MockClothingService();
