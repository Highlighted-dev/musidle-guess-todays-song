import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

export default function WikiLoading() {
  return (
    <>
      <h1 className="text-3xl font-bold">Featured Artists</h1>
      <div className="grid gap-4 p-4 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 grid-rows-2 min-h-screen">
        {Array.from({ length: 8 }).map((_, index) => (
          <Card key={index}>
            <CardHeader>
              <div>
                <AspectRatio ratio={16 / 11}>
                  <Skeleton className="w-full h-full" />
                </AspectRatio>
              </div>
              <div className="mb-8 mt-2 flex flex-row items-center w-[80%] justify-between mx-auto">
                <Skeleton className="w-[30%] h-4" /> <Skeleton className="w-[30%] h-4" />
                <Skeleton className="w-[30%] h-4" />
              </div>
            </CardHeader>
            <div>
              <CardContent>
                <div className="mt-4">
                  <Skeleton className="w-1/2 h-10" />
                </div>
                <div className="mt-2">
                  <Skeleton className="w-full min-h-[100px]" />
                </div>
              </CardContent>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
