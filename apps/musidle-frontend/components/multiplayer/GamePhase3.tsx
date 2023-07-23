import { AuthContextType } from '@/@types/AuthContext';
import { authContext } from '@/components/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React, { useContext } from 'react';
import { gameContext } from '../contexts/GameContext';
import { GameContextType } from '@/@types/GameContext';
import GameMultiplayerLayout from './GameMultiplayerLayout';
import { Button } from '../ui/button';
import { useAuthStore } from '@/stores/AuthStore';
import { useAudioStore } from '@/stores/AudioStore';
import { useRoomStore } from '@/stores/RoomStore';

const GamePhase3 = () => {
  const { user_id } = useAuthStore();
  const { renderGame } = useContext(gameContext) as GameContextType;
  const { currentPlayer } = useRoomStore();

  const { handlePlay } = useAudioStore();
  return (
    <>
      {renderGame ? (
        <GameMultiplayerLayout />
      ) : (
        <Card className="h-full w-full">
          <CardHeader className="text-center">
            <CardTitle className="font-bold">FINAL ROUND</CardTitle>
          </CardHeader>
          <CardContent>
            <h1 className="text-center">Finalist: {currentPlayer?.name}</h1>
            <div className="flex justify-center items-center p-4">
              <Button
                onClick={() => handlePlay()}
                className="w-[30%] min-w-[50px]"
                disabled={currentPlayer?._id != user_id}
              >
                Play / Pause
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default GamePhase3;
