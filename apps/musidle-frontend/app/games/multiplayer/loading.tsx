import { Card, CardContent, CardHeader, CardTitle } from 'apps/musidle-frontend/components/ui/card';
import { Skeleton } from 'apps/musidle-frontend/components/ui/skeleton';
import React from 'react';

export default function Loading() {
  return (
    <>
      <Card className="w-full flex flex-col justify-center h-full">
        <CardHeader>
          <CardTitle className=" flex justify-center items-center">
            <Skeleton className=" w-1/6 h-5" />
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col h-full w-full overflow-y-auto min-h-[540px]">
          <div className="grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 grid-rows-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Card
                key={i}
                className="flex flex-col justify-center w-full p-4 items-center text-center"
              >
                <Skeleton className="w-16 h-5 m-2" />
                <Skeleton className="w-1/2 h-7 " />
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
