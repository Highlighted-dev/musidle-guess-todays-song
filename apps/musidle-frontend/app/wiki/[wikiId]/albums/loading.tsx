import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

export default function AlbumsLoading() {
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
      <div className="flex-1 py-10 px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index}>
              <AspectRatio ratio={1}>
                <Skeleton className="w-full h-full" />
              </AspectRatio>
              <div className="p-4">
                <Skeleton className="lg:w-1/2 w-full h-8" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
