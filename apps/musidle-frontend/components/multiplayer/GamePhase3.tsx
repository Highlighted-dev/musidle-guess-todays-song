'use client';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React, { useState } from 'react';
import { AiOutlineCheck } from 'react-icons/ai';
import { LuChevronsUpDown } from 'react-icons/lu';
import { Button } from '../ui/button';
import { Command, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useAudioStore } from '@/stores/AudioStore';
import { useRoomStore } from '@/stores/RoomStore';
import { Toggle } from '../ui/toggle';
import { Label } from '../ui/label';
import { useTimerStore } from '@/stores/TimerStore';
import { cn } from '@/lib/utils';
import { useAnswerStore } from '@/stores/AnswerStore';
import { useGameFinalStore } from '@/stores/GameFinalStore';
import { useSession } from 'next-auth/react';
function GamePhase3() {
  const user = useSession().data?.user;
  const { currentPlayer, handleChooseCategory } = useRoomStore();
  const { handlePlay } = useAudioStore();
  const { timer } = useTimerStore();
  const { value, handleValueChange, possibleAnswers, getPossibleSongAnswers, possibleSongs } =
    useAnswerStore();
  const { handleFinalAnswerSubmit } = useGameFinalStore();
  const [open, setOpen] = useState(false);

  const handleTogglePress = (finalSongId: string) => {
    if (possibleSongs.find(song => song.songId == finalSongId)?.completed) return;
    handleChooseCategory(finalSongId, 3);
    for (let i = 1; i <= 6; i++) {
      const element = document.getElementById(`final${i}`);
      if (element && element.id != finalSongId) {
        element.setAttribute('data-state', 'off');
        element.setAttribute('aria-pressed', 'false');
      } else {
        element?.setAttribute('data-state', 'on');
        element?.setAttribute('aria-pressed', 'true');
      }
    }
  };
  return (
    <div className=" h-full">
      <div className="h-3/5">
        <CardHeader className="text-center h-1/5">
          <CardTitle className="font-bold">FINAL ROUND</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col justify-center items-center h-4/5">
          <div className="grid grid-cols-3 gap-2 w-full h-full">
            {possibleSongs
              .filter(song => song.songId.includes('final'))
              .map((song, index) => (
                <div className="w-full h-full" key={index}>
                  <Toggle
                    className="col-span-1 p-2 w-full h-full"
                    disabled={currentPlayer?._id != user?._id || song.completed}
                    id={song.songId}
                    key={`toggle${index}`}
                    defaultPressed={index + 1 == 1 ? true : false}
                    onPressedChange={() => {
                      handleTogglePress(song.songId);
                    }}
                    variant={'outline'}
                  >
                    <Label className="cursor-pointer">
                      {song.completed ? song.artist : index + 1}
                    </Label>
                  </Toggle>
                </div>
              ))}
          </div>
        </CardContent>
      </div>
      <div className="flex flex-col w-full justify-center items-center h-2/5">
        <div className="flex flex-col h-3/5 w-full justify-center items-center p-0">
          <Label className="py-2">Time left: {timer}s</Label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-[250px] justify-between"
                disabled={currentPlayer?._id != user?._id}
              >
                {value
                  ? possibleAnswers.find(song => song.value.toLowerCase() === value.toLowerCase())
                      ?.value
                  : 'Select song...'}
                <LuChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0">
              <Command shouldFilter={false}>
                <CommandInput
                  placeholder="Search song..."
                  onValueChange={value => {
                    getPossibleSongAnswers(value);
                    handleValueChange(value);
                  }}
                  value={value}
                />

                <CommandGroup>
                  {possibleAnswers.map(song => (
                    <CommandItem
                      key={song.key}
                      onSelect={currentValue => {
                        handleValueChange(currentValue === value ? '' : currentValue);
                        setOpen(false);
                      }}
                    >
                      <AiOutlineCheck
                        className={cn(
                          'mr-2 h-4 w-4',
                          value.toLowerCase() == song.value.toLowerCase()
                            ? 'opacity-100'
                            : 'opacity-0',
                        )}
                      />
                      {song.value}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
          <div className="py-2">
            <Button
              variant={'default'}
              onClick={() => {
                handleFinalAnswerSubmit();
              }}
              className={
                currentPlayer?._id != user?._id || value === ''
                  ? 'pointer-events-none w-[100%] opacity-50 min-w-[100px]'
                  : 'w-[100%] min-w-[100px]'
              }
            >
              Submit
            </Button>
          </div>
        </div>
        <div className="h-[40%] flex justify-center items-center px-2">
          <Button
            onClick={() => handlePlay()}
            className="w-[100%] min-w-[100px]"
            disabled={currentPlayer?._id != user?._id}
          >
            Play / Pause
          </Button>
        </div>
      </div>
    </div>
  );
}

export default GamePhase3;
