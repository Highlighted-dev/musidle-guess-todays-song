'use client';
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
import { useTimerStore } from '@/stores/TimerStore';
import { useRoomStore } from '@/stores/RoomStore';
import { useAudioStore } from '@/stores/AudioStore';
import { useAnswerStore } from '@/stores/AnswerStore';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../ui/hover-card';
import { useSession } from 'next-auth/react';
import AnswerSelector from '../game-related/AnswerSelector';
import AudioProgress from '../game-related/AudioProgress';
import VolumeSlider from '../game-related/VolumeSlider';
import PlayAudioButton from '../buttons/PlayAudioButton';
import SubmitAnswerButton from '../buttons/SubmitAnswerButton';
import ChangeStageButton from '../buttons/ChangeStageButton';
import GameInstructionsHover from '../game-related/GameInstructionsHover';
function GameMultiplayerLayout() {
  const user = useSession().data?.user;
  const { timer } = useTimerStore();
  const { value, possibleSongs } = useAnswerStore();
  const { currentPlayer } = useRoomStore();
  const { audio, songId } = useAudioStore();

  return (
    <>
      <CardHeader className=" text-center">
        <div className="flex justify-between items-center">
          <label className=" w-24 font-semibold text-xs flex justify-center items-center">
            v0.8.0
          </label>
          <CardTitle className="flex justify-center items-center">Musidle - Multiplayer</CardTitle>
          <GameInstructionsHover />
        </div>
      </CardHeader>
      <CardContent className="h-full">
        <Card className="flex justify-center items-center h-full p-4">
          <CardContent className="h-full flex flex-col">
            <div className="h-1/2">
              <AudioProgress />
              <div className="text-center w-[250px] h-[50px] flex justify-center items-center ">
                <PlayAudioButton
                  className="min-w-[80px]"
                  disabled={currentPlayer?._id != user?._id}
                />
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
      <CardFooter className="flex justify-between text-center">
        <ChangeStageButton
          className="w-[12%] min-w-[130px]"
          disabled={currentPlayer?._id != user?._id}
        />
        <VolumeSlider divClassName="w-1/4 text-center" />
        <SubmitAnswerButton
          className={
            currentPlayer?._id != user?._id || value === ''
              ? 'pointer-events-none w-[9%] min-w-[130px] opacity-50'
              : 'w-[9%] min-w-[130px]'
          }
          disabled={!value || !audio}
        />
      </CardFooter>
    </>
  );
}

export default GameMultiplayerLayout;
