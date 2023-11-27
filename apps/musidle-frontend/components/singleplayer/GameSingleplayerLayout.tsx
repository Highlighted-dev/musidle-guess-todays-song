'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAnswerStore } from '@/stores/AnswerStore';
import { useAudioStore } from '@/stores/AudioStore';
import { useRoomStore } from '@/stores/RoomStore';
import { toast } from '../ui/use-toast';
import AnswerSelector from '../AnswerSelector';
import AudioProgress from '../AudioProgress';
import VolumeSlider from '../VolumeSlider';

export default function GameSingleplayerLayout() {
  const { value } = useAnswerStore();
  const { audio, setAudio, handlePlay, handleSkip, time } = useAudioStore();
  const { currentPlayer, roomCode } = useRoomStore();
  useEffect(() => {
    if (typeof Audio === 'undefined') return;
    setAudio(new Audio('/music/80s-90s7.aac'));
  }, [typeof Audio]);

  useEffect(() => {
    if (!currentPlayer) return;
    toast({
      title: `You are currently playing multiplayer in ${roomCode} room`,
      description: `You can't play singleplayer while playing multiplayer. Please leave multiplayer room to play singleplayer.`,
      variant: 'destructive',
    });
  }, [currentPlayer]);

  const [open, setOpen] = useState(false);

  return (
    <>
      <CardContent className="h-full">
        <Card className="flex justify-center items-center h-full p-4">
          <CardContent className="h-full flex flex-col">
            <div className="h-1/2">
              <AudioProgress maxTime={time} />
              <div className="text-center w-[250px] h-[50px] flex justify-center items-center ">
                <Button
                  onClick={e => {
                    handlePlay();
                  }}
                  className="min-w-[80px]"
                  disabled={!audio}
                >
                  {!audio || audio.paused ? 'Play' : 'Pause'}
                </Button>
              </div>
            </div>
            <div className="h-1/2 flex flex-col justify-center items-center relative">
              <AnswerSelector open={open} setOpen={setOpen} />
            </div>
          </CardContent>
        </Card>
      </CardContent>
      <CardFooter className="flex justify-between text-center">
        <Button variant={'outline'} onClick={() => handleSkip()} className="w-[12%] min-w-[130px]">
          Change Stage
        </Button>
        <VolumeSlider audio={audio} divClassname={'w-1/4 text-center'} />
        <Button className="w-[12%] min-w-[130px]" disabled={!value || !audio}>
          Submit
        </Button>
      </CardFooter>
    </>
  );
}
