import React from 'react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../ui/hover-card';
import { Button } from '../ui/button';

export default function GameInstructionsHover() {
  return (
    <div className="flex justify-end items-center">
      <HoverCard>
        <HoverCardTrigger asChild className="w-28">
          <Button variant={'link'} className=" underline">
            Instructions
          </Button>
        </HoverCardTrigger>
        <HoverCardContent className="w-96">
          <div className="flex space-x-4">
            <div className="space-y-1">
              <h4 className="text-base font-semibold text-center">
                Musidle Multiplayer Instructions
              </h4>
              <p className="text-sm">
                There are <label className="font-bold"> 4 stages</label>, each with longer song time{' '}
                <label className="font-bold">(1 | 3 | 6 | 12 seconds)</label>. You can change the
                stage if/anytime you want with{' '}
                <label className="font-bold">&quot;Change Stage&quot;</label> button. The faster you
                guess, the more points you get. You can play the song in a stage how many times you
                want, but there are only
                <label className="font-bold"> 35 seconds</label> to make a guess.
                <label className="font-bold"> Timer starts after you play the song.</label>
              </p>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
}
