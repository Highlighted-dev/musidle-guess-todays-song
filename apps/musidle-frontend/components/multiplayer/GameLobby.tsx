'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/stores/AuthStore';
import { usePhaseStore } from '@/stores/PhasesStore';
import { useRoomStore } from '@/stores/RoomStore';
import React from 'react';

export default function GameLobby(params: { room_code: string }) {
  const { togglePhaseOne } = usePhaseStore();
  const { players } = useRoomStore();
  const { role } = useAuthStore();

  return (
    <Card className="h-full w-full">
      <CardHeader className=" text-center">
        <CardTitle>Game lobby</CardTitle>
        <p>Room: {params.room_code}</p>
      </CardHeader>
      <CardContent className="flex flex-col justify-center items-center h-full w-full">
        <div className="flex justify-center items-center p-4">
          <Button variant={'default'} disabled={role != 'Admin'} onClick={togglePhaseOne}>
            Start game
          </Button>
        </div>
        <div>
          <h1>Players:</h1>
          <ul>
            {players.map((player, index) => (
              <li key={index}>{player.name}</li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
