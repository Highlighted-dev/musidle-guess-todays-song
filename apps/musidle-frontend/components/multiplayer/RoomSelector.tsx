'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@radix-ui/react-label';
import React from 'react';
import { useRouter } from 'next/navigation';
import { IRoom } from '@/@types/Rooms';
import { useRoomStore } from '@/stores/RoomStore';
import { useSession } from 'next-auth/react';

export default function RoomSelector({ data }: { data: IRoom[] }) {
  const user = useSession().data?.user;
  const { joinRoom } = useRoomStore();
  const router = useRouter();

  const handleRoomJoin = async (room_id: string) => {
    joinRoom(room_id, user).then(() => {
      if (!user?._id || !user?.activated) return;
      router.push(`/multiplayer/${room_id}`);
    });
  };

  const handleRoomCreate = async () => {
    joinRoom(null, user).then(() => {
      if (!user?._id) return;
      router.push(`/multiplayer/${useRoomStore.getState().room_code}`);
    });
  };

  return (
    <>
      <div className="h-[92%]">
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

      <div className="flex justify-end items-center p-3 h-[8%]">
        <Button variant={'default'} onClick={() => handleRoomCreate()}>
          Create room
        </Button>
      </div>
    </>
  );
}
