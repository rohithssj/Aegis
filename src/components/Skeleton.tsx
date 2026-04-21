"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const Skeleton = ({ className, ...props }: SkeletonProps) => {
  return (
    <div
      className={cn(
        "animate-pulse bg-white/[0.05] rounded-md",
        className
      )}
      {...props}
    />
  );
};

export const MetricSkeleton = () => (
  <div className="p-5 md:p-6 rounded-2xl border border-white/[0.05] bg-white/[0.03] space-y-5">
    <div className="flex items-center justify-between">
      <Skeleton className="h-9 w-9 rounded-xl" />
      <Skeleton className="h-3 w-10" />
    </div>
    <div className="space-y-2">
      <Skeleton className="h-3 w-16" />
      <Skeleton className="h-8 w-24" />
    </div>
  </div>
);

export const ChartSkeleton = () => (
  <div className="h-[300px] md:h-[520px] p-6 rounded-3xl border border-white/[0.05] bg-white/[0.03] flex flex-col gap-6">
    <div className="flex items-center justify-between">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-4 w-20" />
    </div>
    <Skeleton className="flex-1 w-full rounded-2xl" />
  </div>
);

export const FeedSkeleton = ({ count = 5 }: { count?: number }) => (
  <div className="space-y-3">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="p-5 rounded-xl border border-white/[0.05] bg-white/[0.02] flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-3 w-12" />
        </div>
        <Skeleton className="h-4 w-2/3" />
      </div>
    ))}
  </div>
);
