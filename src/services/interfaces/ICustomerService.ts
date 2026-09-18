import type {
  AdminCustomer,
  CustomerFilterParams,
  PaginatedResponse,
  ApiResponse
} from '../../types/admin';

export interface ICustomerService {
  list(params?: CustomerFilterParams): Promise<PaginatedResponse<AdminCustomer>>;
  getById(id: string): Promise<ApiResponse<AdminCustomer>>;
}
