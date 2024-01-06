'use client';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useTimerStore } from '@/stores/TimerStore';
import { useRoomStore } from '@/stores/RoomStore';
import { useAudioStore } from '@/stores/AudioStore';
import { useAnswerStore } from '@/stores/AnswerStore';
import { useSession } from 'next-auth/react';
import AnswerSelector from '../game-related/AnswerSelector';
import AudioProgress from '../game-related/AudioProgress';
import SubmitAnswerButton from '../buttons/SubmitAnswerButton';
import GameInstructionsHover from '../game-related/GameInstructionsHover';
import { Button } from '../ui/button';

function GameMultiplayerLayout() {
  const user = useSession().data?.user;
  const { timer } = useTimerStore();
  const { value, possibleSongs } = useAnswerStore();
  const { currentPlayer } = useRoomStore();
  const { audio, songId, handlePlay, audioContext, changeStage } = useAudioStore();

  return (
    <Card className="float-left flex flex-col justify-center xl:absolute top-0 left-[16.5%] items-center h-full xl:w-[67%] w-full xl:min-h-0 min-h-screen">
      <CardHeader className=" text-center w-full">
        <div className="flex justify-between items-center">
          <label className=" w-24 font-semibold text-xs flex justify-center items-center">
            v{process.env.NEXT_PUBLIC_VERSION}
          </label>
          <CardTitle className="flex justify-center items-center">Musidle - Multiplayer</CardTitle>
          <GameInstructionsHover />
        </div>
      </CardHeader>
      <CardContent className="flex h-full w-full">
        <Card className="flex justify-center items-center h-full p-4 w-full">
          <CardContent className="h-full flex flex-col">
            <div className="h-1/2">
              <AudioProgress />
              <div className="text-center w-[250px] h-[50px] flex justify-center items-center ">
                <Button
                  variant={'default'}
                  onClick={() => handlePlay()}
                  className="min-w-[80px]"
                  disabled={currentPlayer?._id != user?._id || !audio}
                >
                  {audioContext?.state == 'running' ? 'Pause' : 'Play'}
                </Button>
              </div>
            </div>
            <div className="h-1/2 flex flex-col justify-center items-center">
              <div className="p-3">
                <Label className="text-center">
                  {possibleSongs.find(song => song.songId == songId)?.artist
                    ? possibleSongs.find(song => song.songId == songId)?.artist
                    : null}
                </Label>
              </div>
              <div>
                <AnswerSelector />
                <div className="p-2 flex justify-center items-center">
                  <Label className="text-center">{timer}s</Label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </CardContent>
      <CardFooter className="flex justify-between text-center w-full">
        <Button
          variant={'outline'}
          onClick={() => changeStage()}
          className="w-[12%] min-w-[130px]"
          disabled={currentPlayer?._id != user?._id || !audioContext}
        >
          Change Stage
        </Button>
        <SubmitAnswerButton
          className={
            currentPlayer?._id != user?._id || value === ''
              ? 'pointer-events-none w-[9%] min-w-[130px] opacity-50'
              : 'w-[9%] min-w-[130px]'
          }
          disabled={!value || !audio}
        />
      </CardFooter>
    </Card>
  );
}

export default GameMultiplayerLayout;
