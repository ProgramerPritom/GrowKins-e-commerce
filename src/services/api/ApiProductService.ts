import type { IProductService } from '../interfaces/IProductService';
import type {
  AdminProduct,
  CreateProductPayload,
  UpdateProductPayload,
  ProductFilterParams,
  PaginatedResponse,
  ApiResponse
} from '../../types/admin';
import { apiClient } from '../../lib/api/client';
import { API_ENDPOINTS } from '../../lib/api/endpoints';

export class ApiProductService implements IProductService {
  public list(params?: ProductFilterParams): Promise<PaginatedResponse<AdminProduct>> {
    return apiClient.get<PaginatedResponse<AdminProduct>>(API_ENDPOINTS.products.list, params);
  }

  public getById(id: string): Promise<ApiResponse<AdminProduct>> {
    return apiClient.get<ApiResponse<AdminProduct>>(API_ENDPOINTS.products.detail(id));
  }

  public create(payload: CreateProductPayload): Promise<ApiResponse<AdminProduct>> {
    return apiClient.post<ApiResponse<AdminProduct>>(API_ENDPOINTS.products.create, payload);
  }

  public update(id: string, payload: UpdateProductPayload): Promise<ApiResponse<AdminProduct>> {
    return apiClient.patch<ApiResponse<AdminProduct>>(API_ENDPOINTS.products.update(id), payload);
  }

  public delete(id: string): Promise<ApiResponse<{ id: string }>> {
    return apiClient.delete<ApiResponse<{ id: string }>>(API_ENDPOINTS.products.delete(id));
  }

  public bulkUpdateStatus(ids: string[], status: AdminProduct['status']): Promise<ApiResponse<{ updatedCount: number }>> {
    return apiClient.post<ApiResponse<{ updatedCount: number }>>(API_ENDPOINTS.products.bulkStatus, { ids, status });
  }
}

export const apiProductService = new ApiProductService();
