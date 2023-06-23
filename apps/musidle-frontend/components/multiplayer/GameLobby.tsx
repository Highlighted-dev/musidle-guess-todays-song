'use client';
import { AuthContextType } from '@/@types/AuthContext';
import { GameContextType } from '@/@types/GameContext';
import { authContext } from '@/components/contexts/AuthContext';
import { gameContext } from '@/components/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React, { useContext } from 'react';

export default function GameLobby() {
  const { players, addPlayer, togglePhaseOne } = useContext(gameContext) as GameContextType;
  const { authState } = useContext(authContext) as AuthContextType;

  return (
    <Card className="h-full w-full">
      <CardHeader className=" text-center">
        <CardTitle>Game lobby</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col justify-center items-center h-full w-full">
        <div className=" w-[250px] flex justify-between p-4">
          <Button
            variant={'default'}
            onClick={() =>
              authState._id && authState.username
                ? addPlayer({ _id: authState._id, name: authState.username, score: 0 })
                : null
            }
          >
            Join game
          </Button>
          <Button variant={'default'} disabled={authState.role != 'Admin'} onClick={togglePhaseOne}>
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
