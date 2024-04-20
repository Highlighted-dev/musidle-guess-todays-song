import { Skeleton } from 'apps/musidle-frontend/components/ui/skeleton';
import React from 'react';

export default function loading() {
  return (
    <div className="flex flex-col min-h-screen h-full w-full">
      <div className="flex items-center justify-start h-20 py-10 px-4 md:px-6 lg:px-8 ">
        <Skeleton className="lg:w-1/4 w-1/2 h-7" />
      </div>
      <div className="px-4 md:px-6 lg:px-8 ">
        <div className="flex justify-start">
          <Skeleton className="lg:w-1/4 w-full h-7" />
        </div>
      </div>
    </div>
  );
}
