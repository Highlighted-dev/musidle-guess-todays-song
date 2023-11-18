import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

export default function Loading() {
  return (
    <>
      <div className="h-full ">
        <CardHeader>
          <CardTitle className="flex justify-center items-center font-bold">
            <Skeleton className=" w-1/6 h-7" />
          </CardTitle>
        </CardHeader>
      </div>
      <div className=" xl:w-[16%] w-full h-full flex flex-col justify-center items-center min-w-[180px] xl:absolute top-0 right-0 xl:p-0 py-6">
        <div className=" h-full w-full ">
          <Card className="h-full w-full">
            <CardHeader className=" text-center">
              <CardTitle>Leaderboard</CardTitle>
            </CardHeader>
            <CardContent>
              <Card className=" min-h-[100px] p-2">
                <CardTitle className="text-center pb-1 text-xs">Players</CardTitle>
                <div className="grid gap-1">
                  <Skeleton className="w-full h-4" />
                  <Skeleton className="w-full h-4" />
                  <Skeleton className="w-full h-4" />
                </div>
              </Card>
              <Card className=" min-h-[100px] p-2 mt-2">
                <CardTitle className="text-center pb-1 text-xs">Spectators</CardTitle>
                <div className="grid gap-1">
                  <Skeleton className="w-full h-4" />
                  <Skeleton className="w-full h-4" />
                  <Skeleton className="w-full h-4" />
                </div>
              </Card>
              <Button className="w-full my-2" variant={'outline'} disabled>
                Vote for turn skip (<Skeleton className="w-6 h-4" />)
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
