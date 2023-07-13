'use client';

import { AuthContextType } from '@/@types/AuthContext';
import { authContext } from '@/components/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@radix-ui/react-label';
import React, { useContext, useEffect, useState } from 'react';
import { gameContext } from '@/components/contexts/GameContext';
import { GameContextType } from '@/@types/GameContext';
import axios from 'axios';
import { Room } from '@/@types/Rooms';

export default function Multiplayer() {
  const { authState } = useContext(authContext) as AuthContextType;
  const { handleRoomJoin, handleRoomCreate } = useContext(gameContext) as GameContextType;

  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    //Get all rooms
    axios
      .get('/api/rooms')
      .then(res => res.data)
      .then(res => {
        console.log(res);
        setRooms(res.data);
      });
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
          <div className="flex justify-end items-end p-3">
            <Button
              variant={'default'}
              onClick={() => handleRoomCreate()}
              disabled={authState.role != 'Admin'}
            >
              Create room
            </Button>
          </div>
        }
      </CardContent>
    </Card>
  );
}
