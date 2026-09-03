import React from 'react';
import { cn } from '@/lib/utils';

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-xl bg-[#2A1117]/50 border border-[#D8B4BE]/10', className)}
      {...props}
    />
  );
}

export function ItemCardSkeleton() {
  return (
    <div className="p-4 rounded-xl glass-card flex items-center justify-between gap-4">
      <div className="flex items-center gap-3.5 flex-1">
        <Skeleton className="w-4 h-4 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/4" />
        </div>
      </div>
      <Skeleton className="h-5 w-14 rounded-md" />
    </div>
  );
}