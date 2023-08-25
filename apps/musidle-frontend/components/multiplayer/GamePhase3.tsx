import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React from 'react';
import GameMultiplayerLayout from './GameMultiplayerLayout';
import { Button } from '../ui/button';
import { useAuthStore } from '@/stores/AuthStore';
import { useAudioStore } from '@/stores/AudioStore';
import { useRoomStore } from '@/stores/RoomStore';
import { Toggle } from '../ui/toggle';
import { Label } from '../ui/label';
import useTimerStore from '@/stores/TimerStore';
const GamePhase3 = () => {
  const { user_id } = useAuthStore();
  const { currentPlayer, renderGame } = useRoomStore();
  const { handlePlay } = useAudioStore();
  const { timer } = useTimerStore();

  const renderToggles = () => {
    const buttons = [];

    for (let i = 1; i <= 6; i++) {
      buttons.push(
        <Toggle
          className="col-span-2 p-4"
          disabled={currentPlayer?._id != user_id}
          id={`toggle${i}`}
          key={i}
        >
          <Label className="cursor-pointer">{i}</Label>
        </Toggle>,
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
          <CardHeader className="text-center">
            <CardTitle className="font-bold">FINAL ROUND</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col justify-center items-center">
            <h1 className="text-center">Finalist: {currentPlayer?.name}</h1>
            <div className="p-16">
              <div className="grid grid-cols-4 gap-4 ">{renderToggles()}</div>
            </div>
            <div className="py-2">
              <Button
                onClick={() => handlePlay()}
                className="w-[100%] min-w-[50px]"
                disabled={currentPlayer?._id != user_id}
              >
                Play / Pause
              </Button>
            </div>
            <Label className="py-2">Time left: {timer.toFixed(2)}s</Label>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default GamePhase3;
