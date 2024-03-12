import { Card, CardContent, CardFooter } from 'apps/musidle-frontend/components/ui/card';
import { Skeleton } from 'apps/musidle-frontend/components/ui/skeleton';
import React from 'react';

export default async function Loading() {
  return (
    <>
      <CardContent className="flex w-full">
        <Card className="flex justify-center items-center p-4 w-full min-h-[540px] mt-2" />
      </CardContent>
      <CardFooter className="flex justify-between text-center">
        <Skeleton className="w-[12%] min-w-[130px] h-10" />
        <Skeleton className="w-[12%] min-w-[130px] h-10" />
      </CardFooter>
    </>
  );
}
