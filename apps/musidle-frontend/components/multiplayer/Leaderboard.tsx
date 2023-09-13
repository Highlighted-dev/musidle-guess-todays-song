import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useRoomStore } from '@/stores/RoomStore';
import { Label } from '../ui/label';

const Leaderboard = () => {
  const { players, currentPlayer } = useRoomStore();

  return (
    <div className="fixed h-full w-1/6 top-0 right-0 flex justify-center items-center min-w-[170px]">
      <div className=" h-4/6 right-0 w-full z-2 min-h-[600px]  px-4">
        <Card className="h-full w-full">
          <CardHeader className=" text-center">
            <CardTitle>Leaderboard</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col">
              {players.map((player, index) => (
                <div className="flex justify-between" key={index}>
                  <Label
                    className={currentPlayer?._id == player._id ? 'text-green-600' : undefined}
                  >
                    {player.name}
                  </Label>
                  <Label>{player.score}</Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Leaderboard;
