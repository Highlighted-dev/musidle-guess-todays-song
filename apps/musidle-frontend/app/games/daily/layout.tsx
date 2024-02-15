import GameInstructionsHover from '@/components/game-related/GameInstructionsHover';
import TurnChangeDialog from '@/components/game-related/TurnChangeDialog';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import React from 'react';
import GameHeader from '@/components/multiplayer/GameHeader';
export default async function SingleplayerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex lg:flex-row flex-col justify-center items-center my-2">
      <TurnChangeDialog displayPlayerName={false} />
      <Card className="w-full flex flex-col  min-w-[200px] lg:p-0 py-6 lg:mx-2 min-h-[700px]">
        <GameHeader title="Guess the song" />
        {children}
      </Card>
    </div>
  );
}
