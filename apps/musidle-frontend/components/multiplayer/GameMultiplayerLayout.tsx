'use client';
import { useContext, useEffect, useState } from 'react';
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
import axios from 'axios';
import { GameContextType } from '@/@types/GameContext';
import { gameContext } from '../contexts/GameContext';
import { authContext } from '../contexts/AuthContext';
import { AuthContextType } from '@/@types/AuthContext';
export default function Game() {
  const { authState } = useContext(authContext) as AuthContextType;
  const {
    audio,
    answer,
    players,
    currentPlayer,
    handleSkip,
    time,
    handlePlay,
    audioTime,
    value,
    handleValueChange,
    songs,
    searchSong,
  } = useContext(gameContext) as GameContextType;

  const [open, setOpen] = useState(false);

  return (
    <>
      <Card className="h-full w-full">
        <CardHeader className=" text-center">
          <CardTitle>Musidle - Multiplayer</CardTitle>
          <CardDescription>
            There are 4 stages, each with longer song time: 1 | 3 | 6 | 15 seconds. The faster you
            guess, the more points you get. You can play the song in a stage how many times you
            want, but there are only 35 seconds to make a guess. Timer starts after you play the
            song, so use it wisely!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="flex justify-center items-center">
            <AlertTitle className="h-[340px]">
              <div className="py-8 text-center">
                <Slider
                  value={[audioTime]}
                  min={0}
                  max={time / 1000}
                  disabled
                  className={cn('py-4', 'h-4')}
                />
                <Label>
                  {time / 1000} {time / 1000 === 1 ? 'second' : 'seconds'}
                </Label>
              </div>
              <div className="text-center w-[250px]">
                <div className="pb-8">
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-[250px] justify-between"
                      >
                        {value
                          ? songs.find(song => song.label.toLowerCase() === value.toLowerCase())
                              ?.label
                          : 'Select song...'}
                        <LuChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[300px] p-0">
                      <Command shouldFilter={false}>
                        <CommandInput
                          placeholder="Search song..."
                          onValueChange={value => {
                            searchSong(value);
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
                                  value.toLowerCase() == song.label.toLowerCase()
                                    ? 'opacity-100'
                                    : 'opacity-0',
                                )}
                              />
                              {song.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <Button variant={'default'}>Submit</Button>
                </div>
                <div className="pt-8">
                  {value === '' ? null : value.toLowerCase() == answer ? (
                    <label className=" text-green-500">You were right!</label>
                  ) : (
                    <Label>
                      <label className=" text-red-700">You were Wrong! </label>
                      <label>
                        The correct answer was
                        <br /> {answer}
                      </label>
                    </Label>
                  )}
                </div>
              </div>
            </AlertTitle>
          </Alert>
        </CardContent>
        <CardFooter className="flex justify-between text-center">
          <Button
            variant="ghost"
            onClick={() => handleSkip()}
            className="w-[9%] min-w-[50px]"
            disabled={currentPlayer?._id != authState._id}
          >
            Skip
          </Button>
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
          <Button
            onClick={() => handlePlay()}
            className="w-[9%] min-w-[50px]"
            disabled={currentPlayer?._id != authState._id}
          >
            Play / Pause
          </Button>
        </CardFooter>
      </Card>
      <div className="fixed h-full w-1/6 top-0 right-0 flex justify-center items-center min-w-[170px]">
        <div className=" h-4/6 right-0 w-full z-2 min-h-[600px]  px-4">
          <Card className="h-full w-full">
            <CardHeader className=" text-center">
              <CardTitle>Leaderboard</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col">
                {players.map((player, index) => (
                  <div className="flex justify-between" key={index}>
                    <Label
                      className={currentPlayer?._id == player._id ? 'text-green-600' : undefined}
                    >
                      {player.name}
                    </Label>
                    <Label>100</Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
