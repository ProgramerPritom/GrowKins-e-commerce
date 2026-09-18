import type { ICollectionService } from '../interfaces/ICollectionService';
import type {
  AdminCollection,
  CreateCollectionPayload,
  UpdateCollectionPayload,
  PaginatedResponse,
  ApiResponse,
  QueryParams
} from '../../types/admin';
import { MockDatabase } from '../../lib/mockDb/MockDatabase';
import { ValidationError, ApiError } from '../../lib/api/errors';

const delay = (ms = 150) => new Promise((res) => setTimeout(res, ms));

export class MockCollectionService implements ICollectionService {
  public async list(params: QueryParams = {}): Promise<PaginatedResponse<AdminCollection>> {
    await delay();
    const { search = '', status, page = 1, limit = 20 } = params;

    let collections = [...MockDatabase.getCollections()];

    if (search.trim()) {
      const q = search.toLowerCase();
      collections = collections.filter(
        (c) => c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q)
      );
    }

    if (status && status !== 'all') {
      collections = collections.filter((c) => c.status === status);
    }

    collections.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

    const total = collections.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const startIdx = (page - 1) * limit;

    return {
      success: true,
      data: collections.slice(startIdx, startIdx + limit),
      meta: { page, limit, total, totalPages }
    };
  }

  public async getById(id: string): Promise<ApiResponse<AdminCollection>> {
    await delay();
    const collections = MockDatabase.getCollections();
    const found = collections.find((c) => c.id === id || c.slug === id);
    if (!found) throw new ApiError(`Collection "${id}" not found.`, 404);
    return { success: true, data: found };
  }

  public async create(payload: CreateCollectionPayload): Promise<ApiResponse<AdminCollection>> {
    await delay(200);
    if (!payload.name?.trim()) {
      throw new ValidationError('Collection name is required', { name: ['Name is required.'] });
    }

    const slug =
      payload.slug?.trim() ||
      payload.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const collections = MockDatabase.getCollections();
    const newCollection: AdminCollection = {
      id: `col-${Date.now()}`,
      name: payload.name.trim(),
      slug,
      description: payload.description || '',
      image: payload.image,
      productIds: payload.productIds || [],
      status: payload.status || 'active',
      sortOrder: payload.sortOrder ?? collections.length + 1,
      featured: payload.featured || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    MockDatabase.setCollections([...collections, newCollection]);
    return { success: true, data: newCollection, message: 'Collection created successfully.' };
  }

  public async update(id: string, payload: UpdateCollectionPayload): Promise<ApiResponse<AdminCollection>> {
    await delay(200);
    const collections = MockDatabase.getCollections();
    const index = collections.findIndex((c) => c.id === id);
    if (index === -1) throw new ApiError(`Collection "${id}" not found.`, 404);

    const updated: AdminCollection = {
      ...collections[index],
      ...payload,
      updatedAt: new Date().toISOString()
    };

    collections[index] = updated;
    MockDatabase.setCollections(collections);
    return { success: true, data: updated, message: 'Collection updated successfully.' };
  }

  public async delete(id: string): Promise<ApiResponse<{ id: string }>> {
    await delay(200);
    const collections = MockDatabase.getCollections();
    const filtered = collections.filter((c) => c.id !== id);
    if (filtered.length === collections.length) throw new ApiError(`Collection "${id}" not found.`, 404);

    MockDatabase.setCollections(filtered);
    return { success: true, data: { id }, message: 'Collection deleted successfully.' };
  }
}

export const mockCollectionService = new MockCollectionService();
