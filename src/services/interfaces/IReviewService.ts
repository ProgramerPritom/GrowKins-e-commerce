import type {
  AdminReview,
  ReviewFilterParams,
  ReviewModerationStatus,
  PaginatedResponse,
  ApiResponse
} from '../../types/admin';

export interface IReviewService {
  list(params?: ReviewFilterParams): Promise<PaginatedResponse<AdminReview>>;
  updateStatus(id: string, status: ReviewModerationStatus): Promise<ApiResponse<AdminReview>>;
  delete(id: string): Promise<ApiResponse<{ id: string }>>;
}
