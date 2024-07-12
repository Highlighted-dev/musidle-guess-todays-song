import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

export default async function Loading() {
  return (
    <>
      <div className="flex lg:flex-row flex-col justify-center items-center my-2">
        <Card className="min-w-[220px] lg:w-auto w-full lg:min-h-[700px] min-h-[500px] h-full relative lg:mt-2 mb-2">
          <CardHeader className="border-b p-4 flex items-center h-14">
            <Skeleton className="w-12 h-5" />
          </CardHeader>
          <CardContent className="overflow-y-auto overflow-x-hidden w-full p-4 break-words relative lg:h-[450px] h-[300px]" />
          <CardFooter className="border-t p-4">
            <form className="flex flex-col w-full space-y-2">
              <Skeleton className="w-full h-7" />
              <Skeleton className="w-full h-7" />
            </form>
          </CardFooter>
        </Card>
        <Card className="w-full flex flex-col justify-center items-center min-w-[200px] lg:p-0 py-6 lg:mx-2 min-h-[700px]">
          <CardHeader className="flex flex-row justify-between border-b  w-full h-14 p-2">
            <div className="w-1/3 flex justify-start items-center p-4">
              <Skeleton className="w-14 h-8" />
            </div>
            <div className="w-1/3 flex justify-center">
              <Skeleton className="w-1/3 h-8" />
            </div>
            <div className="w-1/3 flex justify-end">
              <Skeleton className="w-24 h-8" />
            </div>
          </CardHeader>
          <CardContent className="flex flex-col w-full min-h-[640px]" />
        </Card>
        <Card className="min-w-[220px] lg:w-auto w-full lg:min-h-[700px] min-h-[500px] h-full relative lg:mt-0 mt-2">
          <CardHeader className="border-b p-4 flex items-center h-14">
            <Skeleton className="w-2/3 h-5" />
          </CardHeader>
          <CardContent className="mt-2">
            <Card className=" min-h-[100px] p-2">
              <CardTitle className="flex justify-center text-center pb-1 text-xs">
                <Skeleton className="w-1/3 h-5" />
              </CardTitle>
              <div className="flex flex-col">
                {[...Array(4)].map((_, i) => (
                  <div className="flex justify-between mb-1" key={i}>
                    <Skeleton className="w-2/3 h-5" />
                    <Skeleton className="w-1/6 h-5" />
                  </div>
                ))}
              </div>
            </Card>
            <Card className=" min-h-[100px] p-2 mt-2 cursor-pointer">
              <CardTitle className="flex justify-center text-center pb-1 text-xs hr">
                <Skeleton className="w-1/3 h-5" />
              </CardTitle>
              <div className="flex flex-col">
                {[...Array(4)].map((_, i) => (
                  <div className="flex mb-1" key={i}>
                    <Skeleton className="w-2/3 h-5" />
                  </div>
                ))}
              </div>
            </Card>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
