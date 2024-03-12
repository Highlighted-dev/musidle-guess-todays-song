import TurnChangeDialog from 'apps/musidle-frontend/components/game-related/TurnChangeDialog';
import { Card } from 'apps/musidle-frontend/components/ui/card';
import React from 'react';
import GameHeader from 'apps/musidle-frontend/components/multiplayer/GameHeader';
export default async function SingleplayerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex lg:flex-row flex-col justify-center items-center my-2">
      <TurnChangeDialog displayPlayerName={false} />
      <Card className="w-full flex flex-col  min-w-[200px] lg:p-0 py-6 lg:mx-2 lg:min-h-[700px] min-h-[460px]">
        <GameHeader title="Guess the song" />
        {children}
      </Card>
    </div>
  );
}
