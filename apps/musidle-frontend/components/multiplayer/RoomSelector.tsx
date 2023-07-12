'use client';
import { AuthContextType } from '@/@types/AuthContext';
import { authContext } from '@/components/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@radix-ui/react-label';
import React, { useContext } from 'react';
import { gameContext } from '../contexts/GameContext';
import { GameContextType } from '@/@types/GameContext';

export default function RoomSelector() {
  const { authState } = useContext(authContext) as AuthContextType;
  const { handleRoomJoin } = useContext(gameContext) as GameContextType;
  return (
    <Card className="h-full w-full">
      <CardHeader className=" text-center">
        <CardTitle>Choose Lobby</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col h-full w-full">
        <div className=" w-full h-[10%] flex justify-between p-4">
          <Label className="text-center">HSJHE7</Label>
          <div>
            <Label className="text-center pr-4">Players: 0/8</Label>
            <Button
              id={'HSJHE7'}
              variant={'default'}
              onClick={e => handleRoomJoin(e.currentTarget.id)}
            >
              Join room
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
