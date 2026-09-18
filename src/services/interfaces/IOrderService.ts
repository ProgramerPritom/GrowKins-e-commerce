import type {
  AdminOrder,
  OrderFilterParams,
  UpdateOrderStatusPayload,
  PaginatedResponse,
  ApiResponse
} from '../../types/admin';

export interface IOrderService {
  list(params?: OrderFilterParams): Promise<PaginatedResponse<AdminOrder>>;
  getById(id: string): Promise<ApiResponse<AdminOrder>>;
  updateStatus(id: string, payload: UpdateOrderStatusPayload): Promise<ApiResponse<AdminOrder>>;
  updatePaymentStatus(id: string, paymentStatus: AdminOrder['paymentStatus']): Promise<ApiResponse<AdminOrder>>;
}
