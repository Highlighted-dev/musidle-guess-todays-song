import TurnChangeDialog from '@/components/game-related/TurnChangeDialog';
import React from 'react';

export default async function SingleplayerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-4/5 w-[90%] flex xl:flex-row xl:relative flex-col justify-center align-center relative min-h-[450px]">
      <TurnChangeDialog displayPlayerName={false} />
      {children}
    </div>
  );
}
