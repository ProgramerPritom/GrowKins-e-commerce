import type { ICategoryService } from '../interfaces/ICategoryService';
import type {
  AdminCategory,
  CreateCategoryPayload,
  UpdateCategoryPayload,
  PaginatedResponse,
  ApiResponse,
  QueryParams
} from '../../types/admin';
import { MockDatabase } from '../../lib/mockDb/MockDatabase';
import { ValidationError, ApiError } from '../../lib/api/errors';

const delay = (ms = 150) => new Promise((res) => setTimeout(res, ms));

export class MockCategoryService implements ICategoryService {
  public async list(params: QueryParams = {}): Promise<PaginatedResponse<AdminCategory>> {
    await delay();
    const { search = '', status, page = 1, limit = 20 } = params;

    let categories = [...MockDatabase.getCategories()];

    if (search.trim()) {
      const q = search.toLowerCase();
      categories = categories.filter(
        (c) => c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q)
      );
    }

    if (status && status !== 'all') {
      categories = categories.filter((c) => c.status === status);
    }

    categories.sort((a, b) => a.sortOrder - b.sortOrder);

    const total = categories.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const startIdx = (page - 1) * limit;

    return {
      success: true,
      data: categories.slice(startIdx, startIdx + limit),
      meta: { page, limit, total, totalPages }
    };
  }

  public async getById(id: string): Promise<ApiResponse<AdminCategory>> {
    await delay();
    const categories = MockDatabase.getCategories();
    const found = categories.find((c) => c.id === id || c.slug === id);
    if (!found) throw new ApiError(`Category "${id}" not found.`, 404);
    return { success: true, data: found };
  }

  public async create(payload: CreateCategoryPayload): Promise<ApiResponse<AdminCategory>> {
    await delay(200);
    if (!payload.name?.trim()) {
      throw new ValidationError('Category name is required', { name: ['Category name is required.'] });
    }

    const slug =
      payload.slug?.trim() ||
      payload.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const categories = MockDatabase.getCategories();
    const newCategory: AdminCategory = {
      id: `cat-${Date.now()}`,
      name: payload.name.trim(),
      slug,
      description: payload.description || '',
      image: payload.image,
      parentId: payload.parentId || null,
      status: payload.status || 'active',
      sortOrder: payload.sortOrder ?? categories.length + 1,
      productCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    MockDatabase.setCategories([...categories, newCategory]);
    return { success: true, data: newCategory, message: 'Category created successfully.' };
  }

  public async update(id: string, payload: UpdateCategoryPayload): Promise<ApiResponse<AdminCategory>> {
    await delay(200);
    const categories = MockDatabase.getCategories();
    const index = categories.findIndex((c) => c.id === id);
    if (index === -1) throw new ApiError(`Category "${id}" not found.`, 404);

    const updated: AdminCategory = {
      ...categories[index],
      ...payload,
      updatedAt: new Date().toISOString()
    };

    categories[index] = updated;
    MockDatabase.setCategories(categories);
    return { success: true, data: updated, message: 'Category updated successfully.' };
  }

  public async delete(id: string): Promise<ApiResponse<{ id: string }>> {
    await delay(200);
    const categories = MockDatabase.getCategories();
    const filtered = categories.filter((c) => c.id !== id);
    if (filtered.length === categories.length) throw new ApiError(`Category "${id}" not found.`, 404);

    MockDatabase.setCategories(filtered);
    return { success: true, data: { id }, message: 'Category deleted successfully.' };
  }
}

export const mockCategoryService = new MockCategoryService();
