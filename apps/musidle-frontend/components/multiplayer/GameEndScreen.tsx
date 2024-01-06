'use client';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRoomStore } from '@/stores/RoomStore';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
function GameEndScreen() {
  const { currentPlayer, players, spectators, leaveRoom } = useRoomStore.getState();
  const router = useRouter();
  const user = useSession().data?.user;
  return (
    <Card className="float-left flex flex-col justify-center xl:absolute top-0 left-[16.5%] items-center h-full xl:w-[67%] w-full xl:min-h-0 min-h-screen">
      <CardHeader className="text-center h-[10%]">
        <CardTitle className="font-bold">The Game Has Ended</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col  items-center h-[90%]">
        <h1 className="text-center">Winner: {currentPlayer?.name}</h1>
        <div className="p-16">
          <div className="flex flex-col">
            {players.map((player, index) => (
              <div className="flex justify-between" key={index}>
                <Label
                  className={currentPlayer?._id == player._id ? 'text-green-600 w-24' : 'w-28'}
                >
                  {player.name}
                </Label>
                <Label>{player.score}</Label>
              </div>
            ))}
            {spectators.map((spectator, index) => (
              <div className="flex justify-between" key={index}>
                <Label className="w-28">{spectator.name}</Label>
                <Label>{spectator.score}</Label>
              </div>
            ))}
          </div>
        </div>
        <div>
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => {
              leaveRoom(router, user?._id);
            }}
          >
            Leave Game
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default GameEndScreen;
