import GameHeader from '@/components/game-related/GameHeader';
import TurnChangeDialog from '@/components/game-related/TurnChangeDialog';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

export default async function Loading() {
  return (
    <div className="flex lg:flex-row flex-col justify-center items-center my-2">
      <TurnChangeDialog displayPlayerName={false} />
      <Card className="w-full flex flex-col  min-w-[200px] lg:p-0 py-6 lg:mx-2 lg:min-h-[700px] min-h-[460px]">
        <GameHeader title="Guess the song" />
        <CardContent className="flex w-full">
          <Card className="flex justify-center items-center p-4 w-full min-h-[540px] mt-2" />
        </CardContent>
        <CardFooter className="flex justify-between text-center">
          <Skeleton className="w-[12%] min-w-[130px] h-10" />
          <Skeleton className="w-[12%] min-w-[130px] h-10" />
        </CardFooter>
      </Card>
    </div>
  );
}
