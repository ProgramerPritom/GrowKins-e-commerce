import type { IOrderService } from '../interfaces/IOrderService';
import type {
  AdminOrder,
  OrderFilterParams,
  UpdateOrderStatusPayload,
  PaginatedResponse,
  ApiResponse
} from '../../types/admin';
import { apiClient } from '../../lib/api/client';
import { API_ENDPOINTS } from '../../lib/api/endpoints';

export class ApiOrderService implements IOrderService {
  public list(params?: OrderFilterParams): Promise<PaginatedResponse<AdminOrder>> {
    return apiClient.get<PaginatedResponse<AdminOrder>>(API_ENDPOINTS.orders.list, params);
  }

  public getById(id: string): Promise<ApiResponse<AdminOrder>> {
    return apiClient.get<ApiResponse<AdminOrder>>(API_ENDPOINTS.orders.detail(id));
  }

  public updateStatus(id: string, payload: UpdateOrderStatusPayload): Promise<ApiResponse<AdminOrder>> {
    return apiClient.patch<ApiResponse<AdminOrder>>(API_ENDPOINTS.orders.updateStatus(id), payload);
  }

  public updatePaymentStatus(id: string, paymentStatus: AdminOrder['paymentStatus']): Promise<ApiResponse<AdminOrder>> {
    return apiClient.patch<ApiResponse<AdminOrder>>(API_ENDPOINTS.orders.updatePayment(id), { paymentStatus });
  }
}

export const apiOrderService = new ApiOrderService();
