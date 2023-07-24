import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React from 'react';
import GameMultiplayerLayout from './GameMultiplayerLayout';
import { Button } from '../ui/button';
import { useAuthStore } from '@/stores/AuthStore';
import { useAudioStore } from '@/stores/AudioStore';
import { useRoomStore } from '@/stores/RoomStore';

const GamePhase3 = () => {
  const { user_id } = useAuthStore();
  const { currentPlayer, renderGame } = useRoomStore();
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
