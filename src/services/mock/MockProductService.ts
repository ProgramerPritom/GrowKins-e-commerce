import type { IProductService } from '../interfaces/IProductService';
import type {
  AdminProduct,
  CreateProductPayload,
  UpdateProductPayload,
  ProductFilterParams,
  PaginatedResponse,
  ApiResponse
} from '../../types/admin';
import { MockDatabase } from '../../lib/mockDb/MockDatabase';
import { ValidationError, ApiError } from '../../lib/api/errors';

const delay = (ms = 180) => new Promise((res) => setTimeout(res, ms));

export class MockProductService implements IProductService {
  public async list(params: ProductFilterParams = {}): Promise<PaginatedResponse<AdminProduct>> {
    await delay();
    const {
      search = '',
      category,
      status = 'all',
      stockStatus = 'all',
      sortBy = 'updatedAt',
      sortOrder = 'desc',
      page = 1,
      limit = 10
    } = params;

    let products = [...MockDatabase.getProducts()];

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.inventory.sku.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.slug.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (category && category !== 'all') {
      products = products.filter((p) => p.category === category || p.categoryId === category);
    }

    // Status filter
    if (status && status !== 'all') {
      products = products.filter((p) => p.status === status);
    }

    // Stock Status filter
    if (stockStatus && stockStatus !== 'all') {
      if (stockStatus === 'in_stock') {
        products = products.filter((p) => p.inventory.quantity > p.inventory.lowStockThreshold);
      } else if (stockStatus === 'low_stock') {
        products = products.filter(
          (p) => p.inventory.quantity > 0 && p.inventory.quantity <= p.inventory.lowStockThreshold
        );
      } else if (stockStatus === 'out_of_stock') {
        products = products.filter((p) => p.inventory.quantity === 0);
      }
    }

    // Sort
    products.sort((a, b) => {
      let valA: any = a[sortBy as keyof AdminProduct];
      let valB: any = b[sortBy as keyof AdminProduct];

      if (sortBy === 'quantity') {
        valA = a.inventory.quantity;
        valB = b.inventory.quantity;
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    // Pagination
    const total = products.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const startIdx = (page - 1) * limit;
    const paginated = products.slice(startIdx, startIdx + limit);

    return {
      success: true,
      data: paginated,
      meta: {
        page,
        limit,
        total,
        totalPages
      }
    };
  }

  public async getById(id: string): Promise<ApiResponse<AdminProduct>> {
    await delay();
    const products = MockDatabase.getProducts();
    const found = products.find((p) => p.id === id || p.slug === id);
    if (!found) {
      throw new ApiError(`Product with ID or slug "${id}" not found.`, 404);
    }
    return { success: true, data: found };
  }

  public async create(payload: CreateProductPayload): Promise<ApiResponse<AdminProduct>> {
    await delay(250);

    // Validation
    const errors: Record<string, string[]> = {};
    if (!payload.name?.trim()) errors.name = ['Product name is required.'];
    if (!payload.price || payload.price <= 0) errors.price = ['Price must be greater than 0 BDT.'];
    if (!payload.category) errors.category = ['Category is required.'];
    if (!payload.ageGroup) errors.ageGroup = ['Age group is required.'];

    if (Object.keys(errors).length > 0) {
      throw new ValidationError('Validation failed for new product.', errors);
    }

    const slug =
      payload.slug?.trim() ||
      payload.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

    const id = slug || `prod-${Date.now()}`;
    const products = MockDatabase.getProducts();

    if (products.some((p) => p.id === id)) {
      throw new ValidationError('Duplicate slug detected.', {
        slug: ['A product with this slug already exists.']
      });
    }

    const newProduct: AdminProduct = {
      ...payload,
      id,
      slug,
      tag: (payload.tag as any) || '',
      currency: 'BDT',
      rating: 5.0,
      reviewCount: 0,
      inStock: payload.inventory.quantity > 0 || payload.inventory.allowBackorder,
      featured: payload.featured || false,
      featuredImageId: payload.images[0]?.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    MockDatabase.setProducts([newProduct, ...products]);

    return {
      success: true,
      data: newProduct,
      message: 'Product created successfully.'
    };
  }

  public async update(id: string, payload: UpdateProductPayload): Promise<ApiResponse<AdminProduct>> {
    await delay(250);
    const products = MockDatabase.getProducts();
    const index = products.findIndex((p) => p.id === id || p.slug === id);

    if (index === -1) {
      throw new ApiError(`Product with ID "${id}" not found.`, 404);
    }

    const current = products[index];

    // Compute inStock
    const updatedInventory = payload.inventory ? { ...current.inventory, ...payload.inventory } : current.inventory;
    const inStock = updatedInventory.quantity > 0 || updatedInventory.allowBackorder;

    const updatedProduct: AdminProduct = {
      ...current,
      ...payload,
      inventory: updatedInventory,
      inStock,
      updatedAt: new Date().toISOString()
    };

    products[index] = updatedProduct;
    MockDatabase.setProducts(products);

    return {
      success: true,
      data: updatedProduct,
      message: 'Product updated successfully.'
    };
  }

  public async delete(id: string): Promise<ApiResponse<{ id: string }>> {
    await delay(200);
    const products = MockDatabase.getProducts();
    const filtered = products.filter((p) => p.id !== id && p.slug !== id);

    if (filtered.length === products.length) {
      throw new ApiError(`Product with ID "${id}" not found.`, 404);
    }

    MockDatabase.setProducts(filtered);
    return {
      success: true,
      data: { id },
      message: 'Product deleted successfully.'
    };
  }

  public async bulkUpdateStatus(ids: string[], status: AdminProduct['status']): Promise<ApiResponse<{ updatedCount: number }>> {
    await delay(250);
    const products = MockDatabase.getProducts();
    let count = 0;

    const updated = products.map((p) => {
      if (ids.includes(p.id)) {
        count++;
        return { ...p, status, updatedAt: new Date().toISOString() };
      }
      return p;
    });

    MockDatabase.setProducts(updated);
    return {
      success: true,
      data: { updatedCount: count },
      message: `${count} products updated to ${status}.`
    };
  }
}

export const mockProductService = new MockProductService();
