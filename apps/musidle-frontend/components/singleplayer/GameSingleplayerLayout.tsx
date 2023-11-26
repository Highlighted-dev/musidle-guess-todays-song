'use client';
import { use, useEffect, useState } from 'react';
import { AiOutlineCheck } from 'react-icons/ai';
import { LuChevronsUpDown } from 'react-icons/lu';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { Command, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useAnswerStore } from '@/stores/AnswerStore';
import { useAudioStore } from '@/stores/AudioStore';
export default function GameSingleplayerLayout() {
  const { possibleAnswers, value, setValue, getPossibleSongAnswers } = useAnswerStore();
  const { audio, setAudio, handlePlay, handleSkip, time, audioTime } = useAudioStore();
  useEffect(() => {
    if (typeof Audio === 'undefined') return;
    setAudio(new Audio('/music/80s-90s7.aac'));
  }, [typeof Audio]);

  const [open, setOpen] = useState(false);

  return (
    <>
      <CardContent className="h-full">
        <Card className="flex justify-center items-center h-full p-4">
          <CardContent className="h-full flex flex-col">
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
                >
                  {!audio || audio.paused ? 'Play' : 'Pause'}
                </Button>
              </div>
            </div>
            <div className="h-1/2 flex flex-col justify-center items-center relative">
              <div>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-[250px] justify-between whitespace-normal h-auto"
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
                          setValue(value);
                        }}
                        value={value}
                      />

                      <CommandGroup>
                        {possibleAnswers.map(song => (
                          <CommandItem
                            key={song.key}
                            onSelect={currentValue => {
                              setValue(currentValue === value ? '' : currentValue);
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
              </div>
            </div>
          </CardContent>
        </Card>
      </CardContent>
      <CardFooter className="flex justify-between text-center">
        <Button variant={'outline'} onClick={() => handleSkip()} className="w-[12%] min-w-[130px]">
          Change Stage
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
        <Button className="w-[12%] min-w-[130px]">Submit</Button>
      </CardFooter>
    </>
  );
}
