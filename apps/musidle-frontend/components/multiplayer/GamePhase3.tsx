import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React, { useState } from 'react';
import GameMultiplayerLayout from './GameMultiplayerLayout';
import { AiOutlineCheck } from 'react-icons/ai';
import { LuChevronsUpDown } from 'react-icons/lu';
import { Button } from '../ui/button';
import { Command, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useAuthStore } from '@/stores/AuthStore';
import { useAudioStore } from '@/stores/AudioStore';
import { useRoomStore } from '@/stores/RoomStore';
import { Toggle } from '../ui/toggle';
import { Label } from '../ui/label';
import useTimerStore from '@/stores/TimerStore';
import { Slider } from '../ui/slider';
import { cn } from '@/lib/utils';
import { useAnswerStore } from '@/stores/AnswerStore';
const GamePhase3 = () => {
  const { user_id } = useAuthStore();
  const { currentPlayer, renderGame } = useRoomStore();
  const { handlePlay, audio } = useAudioStore();
  const { timer } = useTimerStore();
  const { value, handleValueChange, songs, handleAnswerSubmit, getPossibleSongAnswers } =
    useAnswerStore();

  const [completedSongs, setCompletedSongs] = useState<string[]>([]);
  const [open, setOpen] = useState(false);

  const handleTogglePress = (toggle_id: string) => {
    if (toggle_id in completedSongs) return;
  };

  const renderToggles = () => {
    const buttons = [];

    for (let i = 1; i <= 6; i++) {
      buttons.push(
        <Toggle
          className="col-span-1 p-4"
          disabled={currentPlayer?._id != user_id || `toggle${i}` in completedSongs}
          id={`toggle${i}`}
          key={i}
          defaultPressed={i == 1 ? true : false}
          onPressedChange={() => {
            handleTogglePress(`toggle${i}`);
          }}
        >
          <Label className="cursor-pointer">{i}</Label>
        </Toggle>,
      );
    }

    return buttons;
  };

  return (
    <>
      {renderGame ? (
        <GameMultiplayerLayout />
      ) : (
        <Card className="h-full w-full">
          <CardHeader className="text-center">
            <CardTitle className="font-bold">FINAL ROUND</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col justify-center items-center">
            <h1 className="text-center">Finalist: {currentPlayer?.name}</h1>
            <div className="p-12">
              <div className="grid grid-cols-3 gap-4 ">{renderToggles()}</div>
            </div>
            <div className="py-2">
              <Button
                onClick={() => handlePlay()}
                className="w-[100%] min-w-[50px]"
                disabled={currentPlayer?._id != user_id}
              >
                Play / Pause
              </Button>
            </div>
            <Label className="py-2">Time left: {timer.toFixed(2)}s</Label>
          </CardContent>
          <div className="flex flex-col w-full justify-center items-center h-[150px]">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-[250px] justify-between"
                  disabled={currentPlayer?._id != user_id}
                >
                  {value
                    ? songs.find(song => song.value.toLowerCase() === value.toLowerCase())?.value
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
                    {songs.map(song => (
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
            <div className="pt-3">
              <Button
                variant={'default'}
                onClick={() => {
                  handleAnswerSubmit();
                }}
                className={
                  currentPlayer?._id != user_id || value === ''
                    ? 'pointer-events-none w-[100%] opacity-50'
                    : 'w-[100%]'
                }
              >
                Submit
              </Button>
            </div>
          </div>
          <div className="w-full flex justify-center items-center flex-col">
            <div className="w-1/4 text-center">
              <Slider
                onValueChange={value => (audio ? (audio.volume = value[0] / 100) : null)}
                min={0}
                max={100}
                step={1}
                defaultValue={[100]}
                className={cn('py-4', 'h-4')}
              />
              <Label>Volume</Label>
            </div>
          </div>
        </Card>
      )}
    </>
  );
};

export default GamePhase3;
