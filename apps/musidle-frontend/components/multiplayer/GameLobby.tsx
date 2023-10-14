'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/stores/AuthStore';
import { useRoomStore } from '@/stores/RoomStore';
import React from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { useRouter } from 'next/navigation';

export default function GameLobby(params: { room_code: string }) {
  const {
    players,
    spectators,
    maxRoundsPhaseOne,
    maxRoundsPhaseTwo,
    updateSettings,
    startGame,
    leaveRoom,
  } = useRoomStore();
  const { role } = useAuthStore();

  const router = useRouter();

  return (
    <div className="xl:p-0 p-4 w-full md:h-4/5 h-full flex xl:flex-row xl:relative flex-col justify-center align-center min-h-[750px] md:min-h-0">
      <Card className=" xl:w-4/6 w-full h-full">
        <CardHeader className=" text-center h-1/6">
          <CardTitle>Game lobby</CardTitle>
          <p>Room: {params.room_code}</p>
        </CardHeader>
        <CardContent className="flex flex-col h-5/6 w-full">
          <Card className="mb-4">
            <CardHeader className=" text-center">
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-4 items-center gap-4 ">
                <Label htmlFor="name" className="text-right">
                  Maximum rounds in phase one
                </Label>
                <Input
                  type="number"
                  step={1}
                  min={1}
                  max={400}
                  id="mxRoundsPhaseOne"
                  className="col-span-3"
                  placeholder={maxRoundsPhaseOne.toString()}
                  disabled={role != 'Admin'}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Maximum rounds in phase two
                </Label>
                <Input
                  type="number"
                  step={1}
                  min={1}
                  max={200}
                  maxLength={3}
                  id="mxRoundsPhaseTwo"
                  className="col-span-3"
                  disabled={role != 'Admin'}
                  placeholder={maxRoundsPhaseTwo.toString()}
                />
              </div>
              <div className="grid items-center gap-4">
                <Button
                  variant={'secondary'}
                  onClick={() => {
                    updateSettings(
                      parseInt(
                        (document.getElementById('mxRoundsPhaseOne') as HTMLInputElement).value,
                      ),
                      parseInt(
                        (document.getElementById('mxRoundsPhaseTwo') as HTMLInputElement).value,
                      ),
                    );
                  }}
                >
                  Save
                </Button>
              </div>
            </CardContent>
          </Card>
          <div className="flex md:flex-row flex-col justify-between items-center">
            <Card className="flex flex-col justify-center items-center m-2 md:w-1/2 w-full h-full">
              <CardHeader className=" text-center">
                <CardTitle>Players</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <ul className="grid grid-cols-2 gap-2">
                  {players.map((player, index) => (
                    <li key={index} className="text-center">
                      {player.name}
                    </li>
                  ))}
                </ul>
                {!players.find(player => player._id == useAuthStore.getState().user_id) ? (
                  <Button variant={'outline'}>Join</Button>
                ) : null}
              </CardContent>
            </Card>

            <Card className="flex flex-col justify-center items-center m-2 md:w-1/2 w-full h-full">
              <CardHeader className=" text-center">
                <CardTitle>Spectators</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <ul className="grid grid-cols-2 gap-2">
                  {spectators.map((spectator, index) => (
                    <li key={index} className="text-center">
                      {spectator.name}
                    </li>
                  ))}
                </ul>
                {!spectators.find(spectator => spectator._id == useAuthStore.getState().user_id) ? (
                  <Button variant={'outline'}>Join</Button>
                ) : null}
              </CardContent>
            </Card>
          </div>
          <div className="flex justify-between items-center p-4">
            <Button
              variant={'outline'}
              onClick={() => leaveRoom(router, useAuthStore.getState().user_id)}
            >
              Leave game
            </Button>
            <Button variant={'default'} disabled={role != 'Admin'} onClick={() => startGame()}>
              Start game
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
