'use client';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useRoomStore } from '../../stores/RoomStore';
import { Label } from '../ui/label';
import VoteForTurnSkipButton from '../buttons/VoteForTurnSkipButton';
import { Session } from 'next-auth';
import { Button } from '../ui/button';
import JoinToSpectatorsButton from '../buttons/JoinToSpectatorsButton';

function Leaderboard({ session }: { session: Session | null }) {
  const { players, currentPlayer, spectators, roomCode } = useRoomStore();
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
                <Label className={currentPlayer?.id == player.id ? 'text-green-600' : undefined}>
                  {player.name}
                </Label>
                <Label>{player.score}</Label>
              </div>
            ))}
          </div>
        </Card>
        <Card className=" min-h-[100px] p-2 mt-2 cursor-pointer">
          <CardTitle className="text-center pb-1 text-xs hr">Spectators</CardTitle>
          <div className="flex flex-col">
            {spectators?.map((spectator, index) => (
              <div className="flex justify-between" key={index}>
                <Label>{spectator.name}</Label>
              </div>
            ))}
            <div className="flex justify-center">
              {
                // if the user is in the players list, show him "join as spectator" button
                players?.find(player => player.id === session?.user.id) && (
                  <JoinToSpectatorsButton roomCode={roomCode} session={session} />
                )
              }
            </div>
          </div>
        </Card>
        <VoteForTurnSkipButton className="w-full my-2" session={session} />
      </CardContent>
    </Card>
  );
}

export default Leaderboard;
