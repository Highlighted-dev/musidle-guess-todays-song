'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRoomStore } from '@/stores/RoomStore';
import React from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useTimerStore } from '@/stores/TimerStore';

export default function GameLobby(params: { roomCode: string }) {
  const { maxRoundsPhaseOne, maxRoundsPhaseTwo, updateSettings, startGame, leaveRoom, roomCode } =
    useRoomStore();
  const { maxTimer } = useTimerStore();
  const user = useSession().data?.user;

  const router = useRouter();

  return (
    <Card className="float-left flex flex-col justify-center xl:absolute top-0 left-[16.5%] items-center h-full xl:w-[67%] w-full xl:min-h-0 min-h-screen">
      <CardHeader className=" text-center h-[15%]">
        <CardTitle>Game lobby</CardTitle>
        <Label className="text-popover-foreground">{roomCode.toUpperCase()}</Label>
      </CardHeader>
      <CardContent className="flex flex-col h-[85%] w-full">
        <div className="h-[90%]">
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
                  disabled={user?.role != 'Admin'}
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
                  disabled={user?.role != 'Admin'}
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
                  disabled={user?.role != 'Admin'}
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
        </div>
        <div className="flex justify-between items-center p-4">
          <Button variant={'outline'} onClick={() => leaveRoom(router, user?._id)}>
            Leave game
          </Button>
          <Button variant={'default'} disabled={user?.role != 'Admin'} onClick={() => startGame()}>
            Start game
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
