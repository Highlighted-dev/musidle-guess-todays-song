import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

export default async function Loading() {
  return (
    <Card className="float-left xl:w-4/6 flex flex-col justify-center align-center h-full">
      <CardHeader className=" text-center">
        <div className="flex justify-between items-center">
          <Label className=" w-24 font-semibold text-xs flex justify-center items-center">
            v0.8.0
          </Label>
          <CardTitle className="flex justify-center items-center">Musidle Singleplayer</CardTitle>
          <CardDescription className="w-24">
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button variant="link">Instructions</Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="flex space-x-4">
                  <div className="space-y-1">
                    <h4 className="text-base font-semibold">Musidle Multiplayer Instructions</h4>
                    <p className="text-sm">
                      There are <label className="font-bold"> 4 stages</label>, each with longer
                      song time: <label className="font-bold">1 | 3 | 6 | 12 seconds</label>. The
                      faster you guess, the more points you get. You can play the song in a stage
                      how many times you want, but there are only
                      <label className="font-bold"> 35 seconds</label> to make a guess.
                      <label className="font-bold"> Timer starts after you play the song.</label>
                    </p>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="h-full">
        <Card className="flex justify-center items-center h-full p-4">
          <Skeleton className="h-full w-full" />
        </Card>
      </CardContent>
      <CardFooter className="flex justify-between text-center">
        <Skeleton className="w-[12%] min-w-[130px] h-10" />
        <Skeleton className="w-1/4 text-center h-14" />
        <Skeleton className="w-[12%] min-w-[130px] h-10" />
      </CardFooter>
    </Card>
  );
}
