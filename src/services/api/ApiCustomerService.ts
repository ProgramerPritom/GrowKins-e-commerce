import type { ICustomerService } from '../interfaces/ICustomerService';
import type {
  AdminCustomer,
  CustomerFilterParams,
  PaginatedResponse,
  ApiResponse
} from '../../types/admin';
import { apiClient } from '../../lib/api/client';
import { API_ENDPOINTS } from '../../lib/api/endpoints';

export class ApiCustomerService implements ICustomerService {
  public list(params?: CustomerFilterParams): Promise<PaginatedResponse<AdminCustomer>> {
    return apiClient.get<PaginatedResponse<AdminCustomer>>(API_ENDPOINTS.customers.list, params);
  }

  public getById(id: string): Promise<ApiResponse<AdminCustomer>> {
    return apiClient.get<ApiResponse<AdminCustomer>>(API_ENDPOINTS.customers.detail(id));
  }
}

export const apiCustomerService = new ApiCustomerService();
