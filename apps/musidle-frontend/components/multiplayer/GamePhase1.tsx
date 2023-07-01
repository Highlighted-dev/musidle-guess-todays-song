'use client';
import { AuthContextType } from '@/@types/AuthContext';
import { authContext } from '@/components/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React, { useContext } from 'react';
import { gameContext } from '../contexts/GameContext';
import { GameContextType } from '@/@types/GameContext';
import GameMultiplayerLayout from './GameMultiplayerLayout';

export default function GamePhase1() {
  const { authState } = useContext(authContext) as AuthContextType;
  const { handleChooseCategory, renderGame, currentPlayer, togglePhaseTwo } = useContext(
    gameContext,
  ) as GameContextType;

  return (
    <>
      {renderGame ? (
        <GameMultiplayerLayout />
      ) : (
        <Card className="h-full w-full">
          <CardHeader className=" text-center">
            <CardTitle>Choose category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              <Button
                variant={'secondary'}
                onClick={e => handleChooseCategory(e.currentTarget.id)}
                id="pop2"
                disabled={currentPlayer?._id == authState._id ? false : true}
              >
                Pop
              </Button>
              <Button variant={'secondary'}>Rock</Button>
              <Button variant={'secondary'}>Hip-Hop/Rap</Button>
              <Button variant={'secondary'}>Polish songs</Button>
              <Button variant={'secondary'}>Electronic</Button>
              <Button variant={'secondary'}>Game & Movie Soundtracks</Button>
              <Button variant={'secondary'}>Jazz/Classical Music</Button>
              <Button variant={'secondary'}>Disco polo</Button>
              <Button variant={'secondary'} onClick={togglePhaseTwo}></Button>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
