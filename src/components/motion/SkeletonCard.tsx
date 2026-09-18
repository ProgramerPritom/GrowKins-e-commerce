import React from 'react';

export const SkeletonCard: React.FC = () => {
  return (
    <div className="flex flex-col justify-between text-left animate-pulse">
      {/* Image container placeholder */}
      <div className="aspect-square w-full rounded-[24px] bg-[#EAE4D7] relative mb-3.5 overflow-hidden">
        {/* Shimmer gradient */}
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_1.5s_infinite]" />
      </div>

      {/* Info placeholder */}
      <div className="space-y-2 px-1">
        <div className="flex items-center justify-between">
          <div className="h-3 w-16 bg-[#E0D8C8] rounded-full" />
          <div className="h-3 w-10 bg-[#E0D8C8] rounded-full" />
        </div>

        <div className="flex items-center justify-between gap-2 pt-1">
          <div className="h-4 w-3/4 bg-[#D6CDBB] rounded-md" />
          <div className="h-4 w-12 bg-[#D6CDBB] rounded-md" />
        </div>

        <div className="h-3 w-1/2 bg-[#E0D8C8] rounded-md mt-1" />
      </div>
    </div>
  );
};
