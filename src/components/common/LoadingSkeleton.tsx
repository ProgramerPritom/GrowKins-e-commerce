import React from 'react';

/**
 * Premium Shimmer Loading Skeletons & States for GrowKins
 */

export const Skeleton: React.FC<{
  className?: string;
  variant?: 'rectangular' | 'circular' | 'rounded';
}> = ({ className = '', variant = 'rounded' }) => {
  const variantClass =
    variant === 'circular'
      ? 'rounded-full'
      : variant === 'rectangular'
      ? 'rounded-none'
      : 'rounded-xl';

  return (
    <div
      className={`relative overflow-hidden bg-[#F4EFE6]/80 ${variantClass} ${className}`}
    >
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-gradient-to-r from-transparent via-white/50 to-transparent" />
    </div>
  );
};

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl border border-[#E8E0D2] p-4 flex flex-col justify-between shadow-2xs">
      <div className="space-y-3">
        <Skeleton className="w-full aspect-square rounded-2xl" />
        <div className="flex items-center gap-2 pt-1">
          <Skeleton className="h-4 w-16 rounded-full" />
          <Skeleton className="h-4 w-20 rounded-full" />
        </div>
        <Skeleton className="h-5 w-4/5" />
        <Skeleton className="h-3.5 w-3/5" />
      </div>
      <div className="flex items-center justify-between pt-4 mt-2 border-t border-[#FAF7F1]">
        <div className="space-y-1">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-3 w-12" />
        </div>
        <Skeleton className="h-9 w-9 rounded-full" />
      </div>
    </div>
  );
};

export const ProductGridSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6 lg:gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={`prod-skel-${i}`} />
      ))}
    </div>
  );
};

export const ProductDetailSkeleton: React.FC = () => {
  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
        {/* Left: Gallery Skeleton */}
        <div className="lg:col-span-7 space-y-4">
          <Skeleton className="aspect-square sm:aspect-[4/3] rounded-[32px] w-full" />
          <div className="grid grid-cols-5 gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={`thumb-skel-${i}`} className="aspect-square rounded-2xl" />
            ))}
          </div>
        </div>

        {/* Right: Info Panel Skeleton */}
        <div className="lg:col-span-5 space-y-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-5 w-36" />
          </div>

          <div className="space-y-3">
            <Skeleton className="h-10 w-4/5" />
            <div className="flex items-center gap-3 pt-1">
              <Skeleton className="h-8 w-28" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          </div>

          <Skeleton className="h-20 w-full rounded-2xl" />

          <div className="space-y-3 py-4 border-y border-[#E8E0D2]">
            <Skeleton className="h-4 w-40" />
            <div className="flex gap-2">
              <Skeleton className="h-7 w-28 rounded-full" />
              <Skeleton className="h-7 w-32 rounded-full" />
              <Skeleton className="h-7 w-24 rounded-full" />
            </div>
          </div>

          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
          </div>

          <div className="flex items-center gap-4 pt-4">
            <Skeleton className="h-14 w-28 rounded-full" />
            <Skeleton className="h-14 flex-1 rounded-full" />
            <Skeleton className="h-14 w-14 rounded-full" />
          </div>

          <Skeleton className="h-16 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
};

export const TableSkeleton: React.FC<{ rows?: number; columns?: number }> = ({
  rows = 6,
  columns = 5
}) => {
  return (
    <div className="w-full bg-white rounded-2xl border border-[#E8E0D2] overflow-hidden">
      {/* Table Header */}
      <div className="bg-[#FAF7F1] border-b border-[#E8E0D2] px-6 py-4 flex items-center gap-4">
        {Array.from({ length: columns }).map((_, c) => (
          <Skeleton key={`head-skel-${c}`} className="h-3.5 flex-1" />
        ))}
      </div>
      {/* Table Rows */}
      <div className="divide-y divide-[#F4EFE6]">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={`row-skel-${r}`} className="px-6 py-4 flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-xl shrink-0" />
            {Array.from({ length: columns }).map((_, c) => (
              <Skeleton
                key={`cell-skel-${r}-${c}`}
                className={`h-3.5 flex-1 ${c === 0 ? 'w-1/3' : 'w-full'}`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export const FormSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-[#E8E0D2] p-6 sm:p-8 space-y-6 max-w-4xl">
      <div className="space-y-2 pb-4 border-b border-[#F4EFE6]">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Skeleton className="h-3.5 w-1/4" />
          <Skeleton className="h-11 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-3.5 w-1/4" />
          <Skeleton className="h-11 w-full" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-3.5 w-1/6" />
        <Skeleton className="h-28 w-full" />
      </div>
      <div className="flex justify-end gap-3 pt-4 border-t border-[#F4EFE6]">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  );
};

export const MetricCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-[#E8E0D2] p-5 shadow-xs flex items-center gap-4">
      <Skeleton className="w-12 h-12 rounded-2xl shrink-0" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-6 w-1/2" />
      </div>
    </div>
  );
};

export const MediaGridSkeleton: React.FC<{ count?: number }> = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={`media-skel-${i}`} className="bg-white rounded-2xl border border-[#E8E0D2] p-3 space-y-2">
          <Skeleton className="w-full aspect-square rounded-xl" />
          <Skeleton className="h-3.5 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      ))}
    </div>
  );
};

export const PageLoadingSpinner: React.FC<{ message?: string; submessage?: string }> = ({
  message = 'Connecting to Google Sheets database…',
  submessage = 'Syncing real-time records and Drive assets'
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[360px] p-8 gap-4 text-center">
      <div className="relative flex items-center justify-center">
        <div className="w-12 h-12 border-3 border-[#E8E0D2] border-t-[#1C4CB8] rounded-full animate-spin" />
        <div className="absolute w-2.5 h-2.5 bg-[#1C4CB8] rounded-full" />
      </div>
      <div className="space-y-1">
        <p className="text-xs font-bold text-[#24221F] tracking-wide">
          {message}
        </p>
        {submessage && (
          <p className="text-[11px] text-[#8C8478]">
            {submessage}
          </p>
        )}
      </div>
    </div>
  );
};

export const InlineLoadingSpinner: React.FC<{ text?: string; className?: string }> = ({
  text = 'Saving to Google Sheets...',
  className = ''
}) => {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span className="w-3.5 h-3.5 rounded-full border-2 border-current border-t-transparent animate-spin shrink-0" />
      <span>{text}</span>
    </span>
  );
};
