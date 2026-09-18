import type { IReviewService } from '../interfaces/IReviewService';
import type {
  AdminReview,
  ReviewFilterParams,
  ReviewModerationStatus,
  PaginatedResponse,
  ApiResponse
} from '../../types/admin';
import { apiClient } from '../../lib/api/client';
import { API_ENDPOINTS } from '../../lib/api/endpoints';

export class ApiReviewService implements IReviewService {
  public list(params?: ReviewFilterParams): Promise<PaginatedResponse<AdminReview>> {
    return apiClient.get<PaginatedResponse<AdminReview>>(API_ENDPOINTS.reviews.list, params);
  }

  public updateStatus(id: string, status: ReviewModerationStatus): Promise<ApiResponse<AdminReview>> {
    return apiClient.patch<ApiResponse<AdminReview>>(API_ENDPOINTS.reviews.updateStatus(id), { status });
  }

  public delete(id: string): Promise<ApiResponse<{ id: string }>> {
    return apiClient.delete<ApiResponse<{ id: string }>>(API_ENDPOINTS.reviews.delete(id));
  }
}

export const apiReviewService = new ApiReviewService();
