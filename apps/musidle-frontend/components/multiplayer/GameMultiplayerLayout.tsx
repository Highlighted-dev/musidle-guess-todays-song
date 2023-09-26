'use client';
import { useState } from 'react';
import { AiOutlineCheck } from 'react-icons/ai';
import { LuChevronsUpDown } from 'react-icons/lu';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { Command, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import useTimerStore from '@/stores/TimerStore';
import { useAuthStore } from '@/stores/AuthStore';
import { useRoomStore } from '@/stores/RoomStore';
import { useAudioStore } from '@/stores/AudioStore';
import { useAnswerStore } from '@/stores/AnswerStore';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../ui/hover-card';
import Leaderboard from './Leaderboard';
const GameMultiplayerLayout = () => {
  const { user_id } = useAuthStore();
  const { timer } = useTimerStore();
  const {
    value,
    handleValueChange,
    possibleAnswers,
    handleAnswerSubmit,
    getPossibleSongAnswers,
    possibleSongs,
    artist,
  } = useAnswerStore();
  const { players, currentPlayer } = useRoomStore();
  const { audio, time, audioTime, handleSkip, handlePlay, songId } = useAudioStore();
  const [open, setOpen] = useState(false);

  return (
    <div className="h-4/5 w-[90%] flex xl:flex-row xl:relative flex-col justify-center align-center relative min-h-[450px]">
      <Card className=" float-left xl:w-4/6 flex flex-col justify-center align-center">
        <CardHeader className=" text-center">
          <div className="flex justify-between items-center">
            <label className=" w-24 font-semibold text-xs flex justify-center items-center">
              v0.4.1
            </label>
            <CardTitle className="flex justify-center items-center">
              Musidle - Multiplayer
            </CardTitle>
            <CardDescription className="w-24">
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button variant="link">Instructions</Button>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <div className="flex space-x-4">
                    <div className="space-y-1">
                      <h4 className="text-base font-semibold">Musidle Multiplayer Instructions</h4>
                      <p className="text-sm">
                        There are <label className="font-bold"> 4 stages</label>, each with longer
                        song time: <label className="font-bold">1 | 3 | 6 | 12 seconds</label>. The
                        faster you guess, the more points you get. You can play the song in a stage
                        how many times you want, but there are only
                        <label className="font-bold"> 35 seconds</label> to make a guess.
                        <label className="font-bold"> Timer starts after you play the song.</label>
                      </p>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="h-full">
          <Alert className="flex justify-center items-center h-full">
            <AlertTitle className="h-full flex flex-col">
              <div className="h-1/2">
                <div className="text-center py-4">
                  <Slider
                    value={[audioTime]}
                    min={0}
                    max={time / 1000}
                    disabled
                    className={cn('py-4', 'h-4')}
                  />
                  <Label>
                    {
                      {
                        1: 'Stage 1',
                        3: 'Stage 2',
                        6: 'Stage 3',
                        12: 'Stage 4',
                      }[time / 1000]
                    }
                  </Label>
                </div>
                <div className="text-center w-[250px] h-[50px] flex justify-center items-center ">
                  <Button
                    onClick={e => {
                      handlePlay();
                    }}
                    className="min-w-[80px]"
                    disabled={currentPlayer?._id != user_id}
                  >
                    Play / Pause
                  </Button>
                </div>
              </div>
              <div className="h-1/2 flex flex-col justify-center items-center">
                <div className="p-3">
                  {possibleSongs.find(song => song.song_id == songId)?.artist
                    ? possibleSongs.find(song => song.song_id == songId)?.artist
                    : null}
                </div>
                <div>
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

                  <div className="p-2 flex justify-center items-center">
                    <Label className="text-center">{timer}s</Label>
                  </div>
                </div>
              </div>
            </AlertTitle>
          </Alert>
        </CardContent>
        <CardFooter className="flex justify-between text-center">
          <Button
            variant="ghost"
            onClick={() => handleSkip()}
            className="w-[10%] min-w-[50px]"
            disabled={currentPlayer?._id != user_id}
          >
            Change stage
          </Button>
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
          </div>
          <Button
            variant={'default'}
            onClick={() => {
              handleAnswerSubmit();
            }}
            className={
              currentPlayer?._id != user_id || value === ''
                ? 'pointer-events-none w-[9%] min-w-[50px] opacity-50'
                : 'w-[9%] min-w-[50px'
            }
          >
            Submit
          </Button>
        </CardFooter>
      </Card>
      <Leaderboard />
    </div>
  );
};

export default GameMultiplayerLayout;
