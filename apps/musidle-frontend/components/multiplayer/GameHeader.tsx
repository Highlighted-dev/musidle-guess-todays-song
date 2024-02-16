import React from 'react';
import { CardHeader, CardTitle } from '../ui/card';
import GameInstructionsHover from '../game-related/GameInstructionsHover';
import { Button } from '../ui/button';

export default function GameHeader({ title }: { title: string }) {
  return (
    <CardHeader className="flex flex-row justify-between border-b w-full h-14 p-4">
      <div className="text-xs flex justify-start items-center w-28">
        <Button variant={'link'}>v{process.env.NEXT_PUBLIC_VERSION}</Button>
      </div>
      <CardTitle className="flex justify-center items-center sm:text-lg text-xs text-center">
        {title}
      </CardTitle>
      <GameInstructionsHover />
    </CardHeader>
  );
}
