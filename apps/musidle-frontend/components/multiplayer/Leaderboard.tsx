'use client';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useRoomStore } from '../../stores/RoomStore';
import { Label } from '../ui/label';
import VoteForTurnSkipButton from '../buttons/VoteForTurnSkipButton';

function Leaderboard() {
  const { players, currentPlayer, spectators, joinAsSpectator, roomCode } = useRoomStore();
  return (
    <Card className="min-w-[220px] lg:w-auto w-full lg:min-h-[700px] min-h-[500px] h-full relative lg:mt-0 mt-2">
      <CardHeader className="border-b p-4 flex items-center h-14">
        <div className="flex-1">
          <CardTitle className="text-center">Leaderboard</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="mt-2">
        <Card className=" min-h-[100px] p-2">
          <CardTitle className="text-center pb-1 text-xs">Players</CardTitle>
          <div className="flex flex-col">
            {players?.map((player, index) => (
              <div className="flex justify-between" key={index}>
                <Label className={currentPlayer?._id == player._id ? 'text-green-600' : undefined}>
                  {player.username}
                </Label>
                <Label>{player.score}</Label>
              </div>
            ))}
          </div>
        </Card>
        <Card className=" min-h-[100px] p-2 mt-2 cursor-pointer">
          <CardTitle
            className="text-center pb-1 text-xs hr"
            onClick={() => joinAsSpectator(roomCode)}
          >
            Spectators
          </CardTitle>
          <div className="flex flex-col">
            {spectators?.map((spectator, index) => (
              <div className="flex justify-between" key={index}>
                <Label>{spectator.username}</Label>
              </div>
            ))}
          </div>
        </Card>
        <VoteForTurnSkipButton className="w-full my-2" />
      </CardContent>
    </Card>
  );
}

export default Leaderboard;
