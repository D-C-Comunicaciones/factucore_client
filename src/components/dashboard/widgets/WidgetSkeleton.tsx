"use client";
import { Skeleton } from "@/components/ui/skeleton";

interface WidgetSkeletonProps {
  size?: 'small' | 'large' | 'medium' | 'half' | 'full';
}

export function WidgetSkeleton({ size = 'small' }: WidgetSkeletonProps) {
  const getGridClass = () => {
    switch (size) {
      case 'large':
        return 'lg:row-span-2';
      case 'medium':
        return 'lg:col-span-2';
      case 'half':
        return 'lg:col-span-2';
      case 'full':
        return 'lg:col-span-4';
      default:
        return '';
    }
  };

  const isLarge = size === 'large' || size === 'full' || size === 'half';

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 ${getGridClass()}`}>
      <div className="h-full flex flex-col gap-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-32" />
          {isLarge && <Skeleton className="h-6 w-20" />}
        </div>
        
        {/* Content */}
        {size === 'small' ? (
          <Skeleton className="h-8 w-24 mt-auto" />
        ) : size === 'large' ? (
          <div className="flex gap-4 mt-auto">
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-2 w-20" />
            </div>
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-2 w-20" />
            </div>
          </div>
        ) : (
          <>
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-32 w-full flex-1" />
          </>
        )}
      </div>
    </div>
  );
}
