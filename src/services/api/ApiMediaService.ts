import type { IMediaService } from '../interfaces/IMediaService';
import type {
  MediaAsset,
  MediaFilterParams,
  PaginatedResponse,
  ApiResponse
} from '../../types/admin';
import { apiClient } from '../../lib/api/client';
import { API_ENDPOINTS } from '../../lib/api/endpoints';

export class ApiMediaService implements IMediaService {
  public list(params?: MediaFilterParams): Promise<PaginatedResponse<MediaAsset>> {
    return apiClient.get<PaginatedResponse<MediaAsset>>(API_ENDPOINTS.media.list, params);
  }

  public upload(file: File, metadata?: { alt?: string }): Promise<ApiResponse<MediaAsset>> {
    const formData = new FormData();
    formData.append('file', file);
    if (metadata?.alt) {
      formData.append('alt', metadata.alt);
    }
    return apiClient.post<ApiResponse<MediaAsset>>(API_ENDPOINTS.media.upload, formData);
  }

  public delete(id: string): Promise<ApiResponse<{ id: string }>> {
    return apiClient.delete<ApiResponse<{ id: string }>>(API_ENDPOINTS.media.delete(id));
  }
}

export const apiMediaService = new ApiMediaService();
