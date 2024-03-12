'use client';
import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { useAnswerStore } from '../../stores/AnswerStore';
import { LuChevronsUpDown } from 'react-icons/lu';
import { useRoomStore } from '../../stores/RoomStore';
import { Command, CommandGroup, CommandInput, CommandItem } from '../ui/command';
import { AiOutlineCheck } from 'react-icons/ai';
import { useNextAuthStore } from '../../stores/NextAuthStore';
import { cn } from '../../lib/utils';

export default function AnswerSelector() {
  const { possibleAnswers, value, handleValueChange, getPossibleSongAnswers } = useAnswerStore();
  const { currentPlayer } = useRoomStore();
  const user = useNextAuthStore.getState().session?.user;
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[250px] justify-between whitespace-normal h-auto"
          disabled={currentPlayer != null && currentPlayer._id != user?._id}
        >
          {value
            ? possibleAnswers.find(song => song.value.toLowerCase() === value.toLowerCase())?.value
            : 'Select answer...'}
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
                    value.toLowerCase() == song.value.toLowerCase() ? 'opacity-100' : 'opacity-0',
                  )}
                />
                {song.value}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
