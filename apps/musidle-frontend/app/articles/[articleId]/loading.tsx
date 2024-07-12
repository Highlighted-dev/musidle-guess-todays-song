import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

export default function Loading() {
  return (
    <div className="h-full w-full py-12">
      <div className="container px-4 md:px-6">
        <div className="flex w-full space-y-2 flex-col">
          <Skeleton className="lg:min-w-[700px] min-w-[300px] h-14" />
          <Skeleton className="lg:min-w-[700px] min-w-[300px] h-14" />
        </div>
        <hr className="my-4" />
        <div className="flex flex-col w-full space-y-2">
          <Skeleton className="w-full h-6" />
          <Skeleton className="w-full h-6" />
          <Skeleton className="w-full h-6" />
          <Skeleton className="w-full h-6" />
        </div>
      </div>
    </div>
  );
}
