import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

export default function Loading() {
  return (
    <Card className="float-left xl:w-4/6 flex flex-col justify-center align-center h-full">
      <div className="h-full">
        <CardHeader>
          <CardTitle className="flex justify-center items-center font-bold">
            <Skeleton className=" w-1/6 h-7" />
          </CardTitle>
        </CardHeader>
      </div>
    </Card>
  );
}
