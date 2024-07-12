import React from 'react';
import { CardHeader, CardTitle } from '../ui/card';
import GameInstructionsHover from './GameInstructionsHover';
import { Button } from '../ui/button';

export default function GameHeader({ title }: { title: string }) {
  return (
    <CardHeader className="grid grid-cols-3 border-b w-full p-2">
      <div className="flex justify-start items-end col-span-1">
        <Button variant={'ghost'}>v{process.env.NEXT_PUBLIC_VERSION}</Button>
      </div>
      <CardTitle className="flex justify-center items-center  text-center col-span-1">
        {title}
      </CardTitle>
      <GameInstructionsHover />
    </CardHeader>
  );
}
