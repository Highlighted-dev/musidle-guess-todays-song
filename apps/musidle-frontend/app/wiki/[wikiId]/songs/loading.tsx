import { Card } from 'apps/musidle-frontend/components/ui/card';
import { Skeleton } from 'apps/musidle-frontend/components/ui/skeleton';
import React from 'react';

export default function SongLoading() {
  return (
    <div className="flex flex-col min-h-screen h-full w-full">
      <div className="flex items-center justify-start h-20 py-10 px-4 md:px-6 lg:px-8 ">
        <Skeleton className="lg:w-1/4 w-1/2 h-7" />
      </div>
      <div className="px-4 md:px-6 lg:px-8 mb-4">
        <div className="flex justify-start">
          <Skeleton className=" lg:w-1/4 w-full lg:h-8 h-16" />
        </div>
      </div>
      <div className="space-y-4 py-10 px-4 md:px-6 lg:px-8">
        {Array.from({ length: 10 }).map((_, index) => (
          <Card
            key={index}
            className="flex items-center justify-between p-4 rounded-lg shadow w-full"
          >
            <Skeleton className="w-1/3 h-8" />
            <Skeleton className="w-10 h-10" />
          </Card>
        ))}
      </div>
    </div>
  );
}
