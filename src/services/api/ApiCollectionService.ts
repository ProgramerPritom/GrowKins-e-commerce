import type { ICollectionService } from '../interfaces/ICollectionService';
import type {
  AdminCollection,
  CreateCollectionPayload,
  UpdateCollectionPayload,
  PaginatedResponse,
  ApiResponse,
  QueryParams
} from '../../types/admin';
import { apiClient } from '../../lib/api/client';
import { API_ENDPOINTS } from '../../lib/api/endpoints';

export class ApiCollectionService implements ICollectionService {
  public list(params?: QueryParams): Promise<PaginatedResponse<AdminCollection>> {
    return apiClient.get<PaginatedResponse<AdminCollection>>(API_ENDPOINTS.collections.list, params);
  }

  public getById(id: string): Promise<ApiResponse<AdminCollection>> {
    return apiClient.get<ApiResponse<AdminCollection>>(API_ENDPOINTS.collections.detail(id));
  }

  public create(payload: CreateCollectionPayload): Promise<ApiResponse<AdminCollection>> {
    return apiClient.post<ApiResponse<AdminCollection>>(API_ENDPOINTS.collections.create, payload);
  }

  public update(id: string, payload: UpdateCollectionPayload): Promise<ApiResponse<AdminCollection>> {
    return apiClient.patch<ApiResponse<AdminCollection>>(API_ENDPOINTS.collections.update(id), payload);
  }

  public delete(id: string): Promise<ApiResponse<{ id: string }>> {
    return apiClient.delete<ApiResponse<{ id: string }>>(API_ENDPOINTS.collections.delete(id));
  }
}

export const apiCollectionService = new ApiCollectionService();
