'use client';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useRoomStore } from '@/stores/RoomStore';
import { Label } from '../ui/label';
import VoteForTurnSkipButton from '../buttons/VoteForTurnSkipButton';

function Leaderboard() {
  const { players, currentPlayer, spectators, joinAsSpectator, roomCode } = useRoomStore();
  return (
    <div className=" xl:w-[16%] w-full xl:h-full h-[33%] flex flex-col justify-center items-center min-w-[180px] relative top-0 right-0 xl:p-0 py-6">
      <Card className="h-full w-full">
        <CardHeader className=" text-center">
          <CardTitle>Leaderboard</CardTitle>
        </CardHeader>
        <CardContent>
          <Card className=" min-h-[100px] p-2">
            <CardTitle className="text-center pb-1 text-xs">Players</CardTitle>
            <div className="flex flex-col">
              {players?.map((player, index) => (
                <div className="flex justify-between" key={index}>
                  <Label
                    className={currentPlayer?._id == player._id ? 'text-green-600' : undefined}
                  >
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
    </div>
  );
}

export default Leaderboard;
