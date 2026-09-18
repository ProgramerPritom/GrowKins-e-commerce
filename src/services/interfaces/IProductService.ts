import type {
  AdminProduct,
  CreateProductPayload,
  UpdateProductPayload,
  ProductFilterParams,
  PaginatedResponse,
  ApiResponse
} from '../../types/admin';

export interface IProductService {
  list(params?: ProductFilterParams): Promise<PaginatedResponse<AdminProduct>>;
  getById(id: string): Promise<ApiResponse<AdminProduct>>;
  create(payload: CreateProductPayload): Promise<ApiResponse<AdminProduct>>;
  update(id: string, payload: UpdateProductPayload): Promise<ApiResponse<AdminProduct>>;
  delete(id: string): Promise<ApiResponse<{ id: string }>>;
  bulkUpdateStatus(ids: string[], status: AdminProduct['status']): Promise<ApiResponse<{ updatedCount: number }>>;
}
