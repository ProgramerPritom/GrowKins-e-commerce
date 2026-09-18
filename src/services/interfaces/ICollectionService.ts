import type {
  AdminCollection,
  CreateCollectionPayload,
  UpdateCollectionPayload,
  PaginatedResponse,
  ApiResponse,
  QueryParams
} from '../../types/admin';

export interface ICollectionService {
  list(params?: QueryParams): Promise<PaginatedResponse<AdminCollection>>;
  getById(id: string): Promise<ApiResponse<AdminCollection>>;
  create(payload: CreateCollectionPayload): Promise<ApiResponse<AdminCollection>>;
  update(id: string, payload: UpdateCollectionPayload): Promise<ApiResponse<AdminCollection>>;
  delete(id: string): Promise<ApiResponse<{ id: string }>>;
}
