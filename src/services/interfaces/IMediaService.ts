import type {
  MediaAsset,
  MediaFilterParams,
  PaginatedResponse,
  ApiResponse
} from '../../types/admin';

export interface IMediaService {
  list(params?: MediaFilterParams): Promise<PaginatedResponse<MediaAsset>>;
  upload(file: File, metadata?: { alt?: string }): Promise<ApiResponse<MediaAsset>>;
  delete(id: string): Promise<ApiResponse<{ id: string }>>;
}
