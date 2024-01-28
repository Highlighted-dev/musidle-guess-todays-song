import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

export default async function Loading() {
  return (
    <>
      <CardContent className="h-full">
        <Card className="flex justify-center items-center h-full p-4" />
      </CardContent>
      <CardFooter className="flex justify-between text-center">
        <Skeleton className="w-[12%] min-w-[130px] h-10" />
        <Skeleton className="w-1/4 text-center h-14" />
        <Skeleton className="w-[12%] min-w-[130px] h-10" />
      </CardFooter>
    </>
  );
}
