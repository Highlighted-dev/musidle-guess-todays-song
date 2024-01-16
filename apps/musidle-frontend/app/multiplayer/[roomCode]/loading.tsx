import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import React from 'react';

export default async function Loading() {
  return (
    <>
      <div className="xl:w-[16%] w-full xl:h-full h-[20%] flex flex-col justify-center items-center min-w-[180px]  xl:p-0 py-6 flex-grow-0">
        <Card className="h-full w-full">
          <CardHeader className="text-center h-[10%]">
            <CardTitle>Chat</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col h-[90%]">
            <Card className="h-[50%] xl:h-[90%] m-1 flex flex-col overflow-y-auto overflow-x-hidden">
              <Skeleton className="w-full h-4 my-[3px]" />
              <Skeleton className="w-full h-4 my-[3px]" />
              <Skeleton className="w-full h-4 my-[3px]" />
              <Skeleton className="w-full h-4 my-[3px]" />
              <Skeleton className="w-full h-4 my-[3px]" />
              <Skeleton className="w-full h-4 my-[3px]" />
            </Card>
            <div className="flex justify-between xl:h-[10%] h-auto w-full">
              <Input className="w-[65%]" disabled />
              <Button className="w-[30%]" disabled>
                Send
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <Card className="float-left flex flex-col justify-center relative items-center xl:h-full h-[45%] xl:w-[67%] w-full flex-grow xl:mx-2">
        <CardHeader className=" text-center w-full">
          <div className="flex justify-between items-center">
            <label className=" w-24 font-semibold text-xs flex justify-center items-center">
              v{process.env.NEXT_PUBLIC_VERSION}
            </label>
            <CardTitle className="flex justify-center items-center">
              <Skeleton className="w-32 h-6" />
            </CardTitle>
            <div className="w-24">
              <Button variant="link" disabled>
                Instructions
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex h-full w-full"></CardContent>
      </Card>
      <div className=" xl:w-[16%] w-full xl:h-full h-[33%] flex flex-col justify-center items-center min-w-[180px] relative xl:p-0 py-6">
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
    </>
  );
}
