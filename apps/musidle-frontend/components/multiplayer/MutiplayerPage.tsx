'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@radix-ui/react-label';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { IRoom } from '@/@types/Rooms';
import { useAuthStore } from '@/stores/AuthStore';
import { useRoomStore } from '@/stores/RoomStore';
import useSWR, { SWRConfig } from 'swr';

export default function MultiplayerPage({ data }: { data: IRoom[] }) {
  const { user_id, username, email, role } = useAuthStore();
  const { joinRoom } = useRoomStore();
  const router = useRouter();

  const handleRoomJoin = async (room_id: string) => {
    if (!user_id) return;
    joinRoom(room_id, useAuthStore.getState().user_id, useAuthStore.getState().username).then(
      () => {
        router.push(`/multiplayer/${room_id}`);
      },
    );
  };

  const handleRoomCreate = async () => {
    if (!user_id) return;
    joinRoom(null, useAuthStore.getState().user_id, useAuthStore.getState().username).then(() => {
      router.push(`/multiplayer/${useRoomStore.getState().room_code}`);
    });
  };
  return (
    <Card className="h-5/6 xl:w-4/6 xl:p-0 w-[90%]">
      <CardHeader className=" text-center">
        <CardTitle>Choose Lobby</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col h-full w-full">
        <div className="h-[80%]">
          {data?.length > 0 ? (
            data.map((room: any, index: number) => (
              <div key={index}>
                <div className=" w-full h-[15%] flex justify-between p-4">
                  <Label className="text-center flex justify-center items-center">
                    {room.room_code}
                  </Label>
                  <div>
                    <Label className="text-center pr-4">Players: {room.players.length}/8</Label>
                    <Button
                      id={room.room_code}
                      variant={'default'}
                      onClick={e => handleRoomJoin(e.currentTarget.id)}
                    >
                      Join room
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex justify-center items-center h-full w-full">
              <p>No rooms available</p>
            </div>
          )}
        </div>

        <div className=" items-center p-3 h-[8%]">
          <Button variant={'default'} onClick={() => handleRoomCreate()} disabled={role != 'Admin'}>
            Create room
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
