'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React, { useContext } from 'react';
import { gameContext } from '../contexts/GameContext';
import { GameContextType } from '@/@types/GameContext';
import GameMultiplayerLayout from './GameMultiplayerLayout';
import { Label } from '../ui/label';
import { useAuthStore } from '@/stores/AuthStore';
import { useRoomStore } from '@/stores/RoomStore';

export default function GamePhase1() {
  const { user_id } = useAuthStore();
  const { handleChooseCategory, renderGame } = useContext(gameContext) as GameContextType;
  const { players, currentPlayer } = useRoomStore();

  return (
    <>
      {renderGame ? (
        <GameMultiplayerLayout />
      ) : (
        <>
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
                  disabled={currentPlayer?._id == user_id ? false : true}
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
              </div>
            </CardContent>
          </Card>
          <div className="fixed h-full w-1/6 top-0 right-0 flex justify-center items-center min-w-[170px]">
            <div className=" h-4/6 right-0 w-full z-2 min-h-[600px] px-4">
              <Card className="h-full w-full">
                <CardHeader className=" text-center">
                  <CardTitle>Leaderboard</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col">
                    {players.map((player, index) => (
                      <div className="flex justify-between" key={index}>
                        <Label
                          className={
                            currentPlayer?._id == player._id ? 'text-green-600' : undefined
                          }
                        >
                          {player.name}
                        </Label>
                        <Label>{player.score}</Label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}
    </>
  );
}
