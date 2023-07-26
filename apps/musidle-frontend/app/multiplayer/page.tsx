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

export default function Multiplayer() {
  const { user_id, username, email, role } = useAuthStore();
  const { createRoom, joinRoom } = useRoomStore();
  const router = useRouter();

  const handleRoomJoin = async (room_id: string) => {
    if (!user_id) return;
    joinRoom(room_id).then(() => {
      router.push(`/multiplayer/${room_id}`);
    });
  };

  const handleRoomCreate = async () => {
    if (!user_id) return;
    createRoom().then(room_id => {
      router.push(`/multiplayer/${room_id}`);
    });
  };
  const [rooms, setRooms] = useState<IRoom[]>([]);

  const getRooms = async () => {
    axios
      .get('/api/rooms')
      .then(res => res.data)
      .then(res => {
        setRooms(res.data);
      });
  };

  useEffect(() => {
    const interval = setInterval(() => getRooms(), 12000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <Card className="h-4/6 w-4/6">
      <CardHeader className=" text-center">
        <CardTitle>Choose Lobby</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col h-full w-full">
        <div className="h-[80%]">
          {rooms.length > 0 ? (
            rooms.map((room, index) => (
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
        {
          <div className="flex justify-end items-center p-3 h-[8%]">
            <Button
              variant={'default'}
              onClick={() => handleRoomCreate()}
              disabled={role != 'Admin'}
            >
              Create room
            </Button>
          </div>
        }
      </CardContent>
    </Card>
  );
}
