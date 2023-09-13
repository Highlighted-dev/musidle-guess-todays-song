import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useRoomStore } from '@/stores/RoomStore';
import { Label } from '../ui/label';

const Leaderboard = () => {
  const { players, currentPlayer } = useRoomStore();

  return (
    <div className=" xl:w-[16%] w-full h-full flex flex-col justify-center items-center min-w-[180px] xl:absolute top-0 right-0 xl:p-0 py-6">
      <div className=" h-full w-full ">
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
