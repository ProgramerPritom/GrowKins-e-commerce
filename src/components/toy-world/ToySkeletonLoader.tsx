import React from 'react';

export const ToyGridSkeleton: React.FC<{ count?: number }> = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 sm:gap-8 w-full">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-3xl border border-gray-200 shadow-sm p-4 sm:p-5 flex flex-col justify-between space-y-4 animate-pulse"
        >
          {/* Image skeleton */}
          <div className="aspect-[4/3] bg-gray-200 rounded-2xl w-full relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
            <div className="absolute top-2.5 left-2.5 w-16 h-5 bg-gray-300 rounded-full" />
          </div>

          {/* Title & subtitle skeleton */}
          <div className="space-y-2">
            <div className="h-5 bg-gray-200 rounded-lg w-3/4" />
            <div className="h-3.5 bg-gray-100 rounded-lg w-full" />
            <div className="h-3.5 bg-gray-100 rounded-lg w-2/3" />
          </div>

          {/* Features bullets skeleton */}
          <div className="space-y-1.5 py-1">
            <div className="h-3 bg-gray-100 rounded w-4/5" />
            <div className="h-3 bg-gray-100 rounded w-3/4" />
          </div>

          {/* Price & Action skeleton */}
          <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="h-6 bg-gray-200 rounded w-20" />
              <div className="h-3 bg-gray-100 rounded w-14" />
            </div>
            <div className="h-10 bg-gray-200 rounded-2xl w-28" />
          </div>
        </div>
      ))}
    </div>
  );
};
