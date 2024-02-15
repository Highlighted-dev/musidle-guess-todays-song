'use client';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useTimerStore } from '@/stores/TimerStore';
import { useRoomStore } from '@/stores/RoomStore';
import { useAudioStore } from '@/stores/AudioStore';
import { useAnswerStore } from '@/stores/AnswerStore';
import { useSession } from 'next-auth/react';
import AnswerSelector from '../game-related/AnswerSelector';
import AudioProgress from '../game-related/AudioProgress';
import SubmitAnswerButton from '../buttons/SubmitAnswerButton';
import { Button } from '../ui/button';
import GameHeader from './GameHeader';

function GameMultiplayerLayout() {
  const user = useSession().data?.user;
  const { timer } = useTimerStore();
  const { value, possibleSongs } = useAnswerStore();
  const { currentPlayer } = useRoomStore();
  const { audio, songId, handlePlay, audioContext, changeStage } = useAudioStore();

  return (
    <Card className="w-full flex flex-col  min-w-[200px] lg:p-0 py-6 lg:mx-2 min-h-[700px]">
      <GameHeader title="Guess the song" />
      <CardContent className="flex w-full">
        <Card className="flex justify-center items-center p-4 w-full min-h-[500px] mt-2">
          <CardContent className="flex flex-col">
            <div className="h-1/2">
              <AudioProgress />
              <div className="text-center w-[250px] h-[50px] flex justify-center items-center ">
                <Button
                  variant={'tertiary'}
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
