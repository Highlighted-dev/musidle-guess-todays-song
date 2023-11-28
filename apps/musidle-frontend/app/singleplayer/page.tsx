import AnswerSelector from '@/components/game-related/AnswerSelector';
import AudioProgress from '@/components/game-related/AudioProgress';
import PlayAudioButton from '@/components/buttons/PlayAudioButton';
import AudioSetter from '@/components/singleplayer/AudioSetter';
import SingleplayerFooter from '@/components/singleplayer/SingleplayerFooter';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Label } from '@/components/ui/label';
import React from 'react';
import GameInstructionsHover from '@/components/game-related/GameInstructionsHover';

export default async function Page() {
  return (
    <Card className="float-left xl:w-4/6 flex flex-col justify-center align-center h-full">
      <CardHeader className=" text-center">
        <div className="flex justify-between items-center">
          <Label className=" w-24 font-semibold text-xs flex justify-center items-center">
            v0.8.0
          </Label>
          <CardTitle className="flex justify-center items-center">Musidle Singleplayer</CardTitle>
          <GameInstructionsHover />
        </div>
      </CardHeader>
      <AudioSetter />
      <CardContent className="h-full">
        <Card className="flex justify-center items-center h-full p-4">
          <CardContent className="h-full flex flex-col">
            <div className="h-1/2">
              <AudioProgress />
              <div className="text-center w-[250px] h-[50px] flex justify-center items-center ">
                <PlayAudioButton className="min-w-[80px]" />
              </div>
            </div>
            <div className="h-1/2 flex flex-col justify-center items-center relative">
              <AnswerSelector />
            </div>
          </CardContent>
        </Card>
      </CardContent>
      <CardFooter className="flex justify-between text-center">
        <SingleplayerFooter />
      </CardFooter>
    </Card>
  );
}
