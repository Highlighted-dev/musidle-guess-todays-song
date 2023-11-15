import { CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

export default function Loading() {
  return (
    <div className="h-full ">
      <CardHeader>
        <CardTitle className="flex justify-center items-center font-bold">
          <Skeleton className=" w-1/6 h-7" />
        </CardTitle>
      </CardHeader>
    </div>
  );
}
