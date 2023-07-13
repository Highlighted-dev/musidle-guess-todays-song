'use client';

import { AuthContextType } from '@/@types/AuthContext';
import { authContext } from '@/components/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@radix-ui/react-label';
import React, { useContext, useEffect } from 'react';
import { gameContext } from '@/components/contexts/GameContext';
import { GameContextType } from '@/@types/GameContext';

export default function Multiplayer() {
  const { authState } = useContext(authContext) as AuthContextType;
  const { handleRoomJoin, handleRoomCreate, players } = useContext(gameContext) as GameContextType;

  return (
    <Card className="h-4/6 w-4/6">
      <CardHeader className=" text-center">
        <CardTitle>Choose Lobby</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col h-full w-full">
        <div className="h-[80%]">
          <div className=" w-full h-[15%] flex justify-between p-4">
            <Label className="text-center flex justify-center items-center">HSJHE7</Label>
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
