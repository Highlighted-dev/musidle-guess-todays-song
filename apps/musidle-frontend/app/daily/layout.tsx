import GameInstructionsHover from '@/components/game-related/GameInstructionsHover';
import TurnChangeDialog from '@/components/game-related/TurnChangeDialog';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import React from 'react';

export default async function SingleplayerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-4/5 w-[90%] flex xl:flex-row xl:relative flex-col justify-center align-center relative min-h-[450px] xl:min-h-0 min-h-screen">
      <TurnChangeDialog displayPlayerName={false} />
      <Card className="float-left xl:w-4/6 flex flex-col justify-center align-center h-full">
        <CardHeader className=" text-center">
          <div className="flex justify-between items-center">
            <Label className=" w-24 font-semibold text-xs flex justify-center items-center">
              v0.8.0
            </Label>
            <CardTitle className="flex justify-center items-center">Musidle Daily</CardTitle>
            <GameInstructionsHover />
          </div>
        </CardHeader>
        {children}
      </Card>
    </div>
  );
}
