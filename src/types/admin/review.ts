export type ReviewModerationStatus = 'pending' | 'approved' | 'rejected';

export interface AdminReview {
  id: string;
  productId?: string;
  productName?: string;
  author: string;
  authorRole: string;
  rating: number;
  title: string;
  content: string;
  childAge: string;
  photoUrl?: string;
  verified: boolean;
  status: ReviewModerationStatus;
  date: string;
  createdAt: string;
}

export interface ReviewFilterParams {
  productId?: string;
  status?: ReviewModerationStatus | 'all';
  rating?: number | 'all';
  search?: string;
  page?: number;
  limit?: number;
}
