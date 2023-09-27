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
import { useGameFinalStore } from '@/stores/GameFinalStore';
import Leaderboard from './Leaderboard';
const GamePhase3 = () => {
  const { user_id } = useAuthStore();
  const { currentPlayer, selectMode, handleChooseCategory } = useRoomStore();
  const { handlePlay, audio } = useAudioStore();
  const { timer } = useTimerStore();
  const { value, handleValueChange, possibleAnswers, getPossibleSongAnswers } = useAnswerStore();
  const { completedSongs, handleFinalAnswerSubmit } = useGameFinalStore();
  const [open, setOpen] = useState(false);

  const handleTogglePress = (final_song_id: string) => {
    if (completedSongs.includes(final_song_id)) return;
    handleChooseCategory(final_song_id, 3);
    for (let i = 1; i <= 6; i++) {
      const element = document.getElementById(`final${i}`);
      if (element && element.id != final_song_id) {
        element.setAttribute('data-state', 'off');
        element.setAttribute('aria-pressed', 'false');
      } else {
        element?.setAttribute('data-state', 'on');
        element?.setAttribute('aria-pressed', 'true');
      }
    }
  };

  const renderToggles = () => {
    const buttons = [];

    for (let i = 1; i <= 6; i++) {
      buttons.push(
        <div className="w-full h-full">
          <Toggle
            className="col-span-1 p-2 w-full h-full"
            disabled={currentPlayer?._id != user_id || completedSongs.includes(`final${i}`)}
            id={`final${i}`}
            key={i}
            defaultPressed={i == 1 ? true : false}
            onPressedChange={() => {
              handleTogglePress(`final${i}`);
            }}
            variant={'outline'}
          >
            <Label className="cursor-pointer">{i}</Label>
          </Toggle>
        </div>,
      );
    }

    return buttons;
  };

  return (
    <>
      <div className="h-4/5 w-[90%] flex xl:flex-row xl:relative flex-col justify-center align-center">
        <Card className="h-full w-full float-left xl:w-4/6 relative min-h-[450px]">
          <div className="h-3/5">
            <CardHeader className="text-center h-1/5">
              <CardTitle className="font-bold">FINAL ROUND</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col justify-center items-center h-4/5">
              <div className="grid grid-cols-3 gap-2 w-full h-full">{renderToggles()}</div>
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
                    disabled={currentPlayer?._id != user_id}
                  >
                    {value
                      ? possibleAnswers.find(
                          song => song.value.toLowerCase() === value.toLowerCase(),
                        )?.value
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
                    currentPlayer?._id != user_id || value === ''
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
                disabled={currentPlayer?._id != user_id}
              >
                Play / Pause
              </Button>
              {/* </div>
              <div className="w-1/4 text-center">
                <Slider
                  onValueChange={value => (audio ? (audio.volume = value[0] / 100) : null)}
                  min={0}
                  max={100}
                  step={1}
                  defaultValue={[useAudioStore.getState().volume * 100]}
                  className={cn('py-4', 'h-4')}
                />
                <Label>Volume</Label>
              </div> */}
            </div>
          </div>
        </Card>
        <Leaderboard />
      </div>
    </>
  );
};

export default GamePhase3;
