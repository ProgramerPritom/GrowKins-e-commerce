import React, { useState, useEffect } from 'react';
import { Star, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import { DataTable } from '../../common/DataTable';
import type { Column } from '../../common/DataTable';
import { StatusBadge } from '../../common/StatusBadge';
import { PageHeader } from '../../layout/PageHeader';
import { ConfirmDialog } from '../../common/ConfirmDialog';
import { useAdminToast } from '../../common/AdminToast';
import { reviewService } from '../../../../services';
import type { AdminReview, PaginationMeta, ReviewModerationStatus } from '../../../../types/admin';

export const ReviewsListPage: React.FC = () => {
  const { showToast } = useAdminToast();

  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [isLoading, setIsLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<ReviewModerationStatus | 'all'>('all');
  const [rating, setRating] = useState<string>('all');
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const fetchReviews = async (page = meta.page) => {
    setIsLoading(true);
    try {
      const res = await reviewService.list({
        search,
        status,
        rating: rating === 'all' ? 'all' : Number(rating),
        page,
        limit: 10
      });
      setReviews(res.data);
      setMeta(res.meta);
    } catch (err) {
      console.error(err);
      showToast('Failed to load reviews.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews(1);
  }, [search, status, rating]);

  const handleUpdateStatus = async (id: string, newStatus: ReviewModerationStatus) => {
    try {
      await reviewService.updateStatus(id, newStatus);
      showToast(`Review marked as ${newStatus}.`);
      fetchReviews();
    } catch (err) {
      console.error(err);
      showToast('Status update failed.', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await reviewService.delete(deleteTargetId);
      showToast('Review deleted.');
      setDeleteTargetId(null);
      fetchReviews();
    } catch (err) {
      console.error(err);
      showToast('Could not delete review.', 'error');
    }
  };

  const columns: Column<AdminReview>[] = [
    {
      key: 'product',
      header: 'Product',
      render: (r) => (
        <span className="font-bold text-xs text-[#24221F] truncate max-w-[180px] block">
          {r.productName || 'Montessori Toy'}
        </span>
      )
    },
    {
      key: 'author',
      header: 'Author',
      render: (r) => (
        <div>
          <p className="font-bold text-xs text-[#24221F]">{r.author}</p>
          <p className="text-[10px] text-[#8C8478] truncate max-w-xs">{r.authorRole}</p>
        </div>
      )
    },
    {
      key: 'rating',
      header: 'Rating',
      render: (r) => (
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-3.5 h-3.5 ${
                i < r.rating ? 'text-[#DDA428] fill-[#DDA428]' : 'text-[#E8E0D2]'
              }`}
            />
          ))}
        </div>
      )
    },
    {
      key: 'review',
      header: 'Comment',
      render: (r) => (
        <div className="max-w-md">
          <p className="font-semibold text-xs text-[#24221F] truncate">“{r.title}”</p>
          <p className="text-[11px] text-[#635E55] line-clamp-2 mt-0.5">{r.content}</p>
        </div>
      )
    },
    {
      key: 'status',
      header: 'Status',
      render: (r) => <StatusBadge status={r.status} />
    },
    {
      key: 'actions',
      header: 'Moderation',
      className: 'text-right',
      render: (r) => (
        <div className="flex items-center justify-end gap-1.5">
          {r.status !== 'approved' && (
            <button
              onClick={() => handleUpdateStatus(r.id, 'approved')}
              className="p-1 rounded-lg text-[#2D6A4F] hover:bg-[#E6EFE9] cursor-pointer"
              title="Approve Review"
            >
              <CheckCircle className="w-4 h-4" />
            </button>
          )}

          {r.status !== 'rejected' && (
            <button
              onClick={() => handleUpdateStatus(r.id, 'rejected')}
              className="p-1 rounded-lg text-[#9A7316] hover:bg-[#FCF4DB] cursor-pointer"
              title="Reject Review"
            >
              <XCircle className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => setDeleteTargetId(r.id)}
            className="p-1 rounded-lg text-[#B83A28] hover:bg-[#FBE8E5] cursor-pointer"
            title="Delete Review"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customer Reviews & UGC Moderation"
        subtitle="Moderate parent testimonials, ratings, and product feedback before public display."
        breadcrumbs={[{ label: 'Commerce' }, { label: 'Reviews' }]}
      />

      <DataTable
        columns={columns}
        data={reviews}
        keyField="id"
        meta={meta}
        isLoading={isLoading}
        onPageChange={(p) => fetchReviews(p)}
        onSearch={(q) => setSearch(q)}
        searchPlaceholder="Search reviews by parent name or text..."
        searchValue={search}
        filters={
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="px-3 py-2 text-xs bg-white border border-[#E8E0D2] rounded-xl text-[#24221F] focus:outline-none focus:border-[#1C4CB8]"
            >
              <option value="all">All Moderation States</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending Review</option>
              <option value="rejected">Rejected</option>
            </select>

            <select
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="px-3 py-2 text-xs bg-white border border-[#E8E0D2] rounded-xl text-[#24221F] focus:outline-none focus:border-[#1C4CB8]"
            >
              <option value="all">All Star Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>
        }
        emptyTitle="No reviews found"
        emptyDescription="Verified customer reviews from the storefront will appear here for approval."
      />

      <ConfirmDialog
        isOpen={!!deleteTargetId}
        title="Delete Review?"
        message="Are you sure you want to delete this customer review permanently?"
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onClose={() => setDeleteTargetId(null)}
      />
    </div>
  );
};
