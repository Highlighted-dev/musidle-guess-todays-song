import { AuthContextType } from '@/@types/AuthContext';
import { authContext } from '@/components/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React, { useContext } from 'react';
import { gameContext } from '../contexts/GameContext';
import { GameContextType } from '@/@types/GameContext';
import GameMultiplayerLayout from './GameMultiplayerLayout';
import { useAuthStore } from '@/stores/AuthStore';

const GamePhase2 = () => {
  const { user_id } = useAuthStore();
  const { handleChooseArtist, renderGame, currentPlayer } = useContext(
    gameContext,
  ) as GameContextType;

  const renderButtons = () => {
    const buttons = [];

    for (let i = 1; i <= 16; i++) {
      buttons.push(
        <Button
          key={i}
          variant={'secondary'}
          onClick={e => handleChooseArtist(e.currentTarget.id)}
          id={`artist${i}`}
          disabled={currentPlayer?._id == user_id ? false : true}
          className="p-[25px]"
        >
          <label className="blur-sm cursor-pointer" id={`label_artist${i}`}>
            ******* ********* *****
          </label>
        </Button>,
      );
    }

    return buttons;
  };

  return (
    <>
      {renderGame ? (
        <GameMultiplayerLayout />
      ) : (
        <Card className="h-full w-full">
          <CardHeader className=" text-center">
            <CardTitle className=" font-bold">Choose an artist</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">{renderButtons()}</div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default GamePhase2;
