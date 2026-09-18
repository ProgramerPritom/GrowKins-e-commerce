import type { ICategoryService } from '../interfaces/ICategoryService';
import type {
  AdminCategory,
  CreateCategoryPayload,
  UpdateCategoryPayload,
  PaginatedResponse,
  ApiResponse,
  QueryParams
} from '../../types/admin';
import { apiClient } from '../../lib/api/client';
import { API_ENDPOINTS } from '../../lib/api/endpoints';

export class ApiCategoryService implements ICategoryService {
  public list(params?: QueryParams): Promise<PaginatedResponse<AdminCategory>> {
    return apiClient.get<PaginatedResponse<AdminCategory>>(API_ENDPOINTS.categories.list, params);
  }

  public getById(id: string): Promise<ApiResponse<AdminCategory>> {
    return apiClient.get<ApiResponse<AdminCategory>>(API_ENDPOINTS.categories.detail(id));
  }

  public create(payload: CreateCategoryPayload): Promise<ApiResponse<AdminCategory>> {
    return apiClient.post<ApiResponse<AdminCategory>>(API_ENDPOINTS.categories.create, payload);
  }

  public update(id: string, payload: UpdateCategoryPayload): Promise<ApiResponse<AdminCategory>> {
    return apiClient.patch<ApiResponse<AdminCategory>>(API_ENDPOINTS.categories.update(id), payload);
  }

  public delete(id: string): Promise<ApiResponse<{ id: string }>> {
    return apiClient.delete<ApiResponse<{ id: string }>>(API_ENDPOINTS.categories.delete(id));
  }
}

export const apiCategoryService = new ApiCategoryService();
