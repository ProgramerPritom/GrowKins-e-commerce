import type {
  AdminCategory,
  CreateCategoryPayload,
  UpdateCategoryPayload,
  PaginatedResponse,
  ApiResponse,
  QueryParams
} from '../../types/admin';

export interface ICategoryService {
  list(params?: QueryParams): Promise<PaginatedResponse<AdminCategory>>;
  getById(id: string): Promise<ApiResponse<AdminCategory>>;
  create(payload: CreateCategoryPayload): Promise<ApiResponse<AdminCategory>>;
  update(id: string, payload: UpdateCategoryPayload): Promise<ApiResponse<AdminCategory>>;
  delete(id: string): Promise<ApiResponse<{ id: string }>>;
}
