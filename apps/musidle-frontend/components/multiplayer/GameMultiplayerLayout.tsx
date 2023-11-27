'use client';
import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { useTimerStore } from '@/stores/TimerStore';
import { useRoomStore } from '@/stores/RoomStore';
import { useAudioStore } from '@/stores/AudioStore';
import { useAnswerStore } from '@/stores/AnswerStore';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../ui/hover-card';
import { useSession } from 'next-auth/react';
import AnswerSelector from '../AnswerSelector';
import AudioProgress from '../AudioProgress';
import VolumeSlider from '../VolumeSlider';
function GameMultiplayerLayout() {
  const user = useSession().data?.user;
  const { timer } = useTimerStore();
  const { value, handleAnswerSubmit, possibleSongs } = useAnswerStore();
  const { currentPlayer } = useRoomStore();
  const { audio, time, handleSkip, handlePlay, songId } = useAudioStore();
  const [open, setOpen] = useState(false);

  return (
    <>
      <CardHeader className=" text-center">
        <div className="flex justify-between items-center">
          <label className=" w-24 font-semibold text-xs flex justify-center items-center">
            v0.7.1
          </label>
          <CardTitle className="flex justify-center items-center">Musidle - Multiplayer</CardTitle>
          <CardDescription className="w-24">
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button variant="link">Instructions</Button>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="flex space-x-4">
                  <div className="space-y-1">
                    <h4 className="text-base font-semibold">Musidle Multiplayer Instructions</h4>
                    <p className="text-sm">
                      There are <label className="font-bold"> 4 stages</label>, each with longer
                      song time: <label className="font-bold">1 | 3 | 6 | 12 seconds</label>. The
                      faster you guess, the more points you get. You can play the song in a stage
                      how many times you want, but there are only
                      <label className="font-bold"> 35 seconds</label> to make a guess.
                      <label className="font-bold"> Timer starts after you play the song.</label>
                    </p>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          </CardDescription>
        </div>
      </CardHeader>
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
                  disabled={currentPlayer?._id != user?._id}
                >
                  {!audio || audio.paused ? 'Play' : 'Pause'}
                </Button>
              </div>
            </div>
            <div className="h-1/2 flex flex-col justify-center items-center">
              <div className="p-3">
                {possibleSongs.find(song => song.songId == songId)?.artist
                  ? possibleSongs.find(song => song.songId == songId)?.artist
                  : null}
              </div>
              <div>
                <AnswerSelector open={open} setOpen={setOpen} />

                <div className="p-2 flex justify-center items-center">
                  <Label className="text-center">{timer}s</Label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </CardContent>
      <CardFooter className="flex justify-between text-center">
        <Button
          variant={'outline'}
          onClick={() => handleSkip()}
          className="w-[12%] min-w-[130px]"
          disabled={currentPlayer?._id != user?._id}
        >
          Change stage
        </Button>
        <VolumeSlider audio={audio} divClassname={'w-1/4 text-center'} />
        <Button
          variant={'default'}
          onClick={() => {
            handleAnswerSubmit();
          }}
          className={
            currentPlayer?._id != user?._id || value === ''
              ? 'pointer-events-none w-[9%] min-w-[130px] opacity-50'
              : 'w-[9%] min-w-[130px]'
          }
        >
          Submit
        </Button>
      </CardFooter>
    </>
  );
}

export default GameMultiplayerLayout;
