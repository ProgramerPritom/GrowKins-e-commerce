import type { IReviewService } from '../interfaces/IReviewService';
import type {
  AdminReview,
  ReviewFilterParams,
  ReviewModerationStatus,
  PaginatedResponse,
  ApiResponse
} from '../../types/admin';
import { MockDatabase } from '../../lib/mockDb/MockDatabase';
import { ApiError } from '../../lib/api/errors';

const delay = (ms = 150) => new Promise((res) => setTimeout(res, ms));

export class MockReviewService implements IReviewService {
  public async list(params: ReviewFilterParams = {}): Promise<PaginatedResponse<AdminReview>> {
    await delay();
    const { status = 'all', rating = 'all', search = '', page = 1, limit = 10 } = params;

    let reviews = [...MockDatabase.getReviews()];

    if (search.trim()) {
      const q = search.toLowerCase();
      reviews = reviews.filter(
        (r) =>
          r.author.toLowerCase().includes(q) ||
          r.title.toLowerCase().includes(q) ||
          r.content.toLowerCase().includes(q) ||
          (r.productName && r.productName.toLowerCase().includes(q))
      );
    }

    if (status && status !== 'all') {
      reviews = reviews.filter((r) => r.status === status);
    }

    if (rating && rating !== 'all') {
      reviews = reviews.filter((r) => r.rating === Number(rating));
    }

    const total = reviews.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const startIdx = (page - 1) * limit;

    return {
      success: true,
      data: reviews.slice(startIdx, startIdx + limit),
      meta: { page, limit, total, totalPages }
    };
  }

  public async updateStatus(id: string, status: ReviewModerationStatus): Promise<ApiResponse<AdminReview>> {
    await delay(180);
    const reviews = MockDatabase.getReviews();
    const index = reviews.findIndex((r) => r.id === id);
    if (index === -1) throw new ApiError(`Review "${id}" not found.`, 404);

    const updated: AdminReview = {
      ...reviews[index],
      status
    };

    reviews[index] = updated;
    MockDatabase.setReviews(reviews);

    return { success: true, data: updated, message: `Review marked as ${status}.` };
  }

  public async delete(id: string): Promise<ApiResponse<{ id: string }>> {
    await delay(180);
    const reviews = MockDatabase.getReviews();
    const filtered = reviews.filter((r) => r.id !== id);
    if (filtered.length === reviews.length) throw new ApiError(`Review "${id}" not found.`, 404);

    MockDatabase.setReviews(filtered);
    return { success: true, data: { id }, message: 'Review deleted successfully.' };
  }
}

export const mockReviewService = new MockReviewService();
