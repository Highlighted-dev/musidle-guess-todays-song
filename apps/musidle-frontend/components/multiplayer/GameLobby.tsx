'use client';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useRoomStore } from '../../stores/RoomStore';
import React from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useTimerStore } from '../../stores/TimerStore';
import GameHeader from './GameHeader';

export default function GameLobby(params: { roomCode: string }) {
  const { maxRoundsPhaseOne, maxRoundsPhaseTwo, updateSettings, startGame, leaveRoom } =
    useRoomStore();
  const { maxTimer } = useTimerStore();
  const user = useSession().data?.user;

  const router = useRouter();

  return (
    <Card className="w-full flex flex-col justify-center items-center min-w-[200px] lg:p-0 py-6 lg:mx-2 min-h-[700px]">
      <GameHeader title="Game Lobby" />
      <CardContent className="flex flex-col w-full mt-2">
        <Card className="mb-3 min-h-[524px]">
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
                disabled={user?.role != 'admin'}
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
                disabled={user?.role != 'admin'}
                placeholder={maxRoundsPhaseTwo.toString()}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4 ">
              <Label htmlFor="name" className="text-right">
                Maximum time to guess the song (seconds)
              </Label>
              <Input
                type="number"
                step={1}
                min={1}
                max={120}
                id="mxTimer"
                className="col-span-3"
                placeholder={maxTimer.toString()}
                disabled={user?.role != 'admin'}
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
                    parseInt((document.getElementById('mxTimer') as HTMLInputElement).value),
                  );
                }}
              >
                Save
              </Button>
            </div>
          </CardContent>
        </Card>
        <div className="flex justify-between items-center p-4">
          <Button variant={'secondary'} onClick={() => leaveRoom(router, user?._id)}>
            Leave game
          </Button>
          <Button disabled={user?.role != 'admin'} onClick={() => startGame()}>
            Start game
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
