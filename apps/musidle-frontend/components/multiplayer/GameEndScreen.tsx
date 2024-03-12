'use client';
import React from 'react';
import { Card, CardContent } from '../ui/card';
import { useRoomStore } from '../../stores/RoomStore';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import GameHeader from './GameHeader';
function GameEndScreen() {
  const { currentPlayer, players, spectators, leaveRoom } = useRoomStore.getState();
  const router = useRouter();
  const user = useSession().data?.user;
  return (
    <Card className="w-full flex flex-col justify-center items-center min-w-[200px] lg:p-0 py-6 lg:mx-2 lg:min-h-[700px] min-h-[500px]">
      <GameHeader title="The game has ended" />
      <CardContent className="flex flex-col items-center lg:min-h-[640px] min-h-[460px]">
        <h1 className="text-center">Winner: {currentPlayer?.username}</h1>
        <div className="p-16">
          <div className="flex flex-col">
            {players.map((player, index) => (
              <div className="flex justify-between" key={index}>
                <Label
                  className={currentPlayer?._id == player._id ? 'text-green-600 w-24' : 'w-28'}
                >
                  {player.username}
                </Label>
                <Label>{player.score}</Label>
              </div>
            ))}
            {spectators.map((spectator, index) => (
              <div className="flex justify-between" key={index}>
                <Label className="w-28">{spectator.username}</Label>
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
