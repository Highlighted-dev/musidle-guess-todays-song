'use client';
import { useEffect, useState } from 'react';
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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import axios from 'axios';
export default function Index() {
  interface ISongs {
    value: string;
    label: string;
    key: string;
  }

  const [audio, setAudio] = useState(new Audio('/music/2.mp3'));
  const [audioTime, setAudioTime] = useState(0);
  const [time, setTime] = useState(1000);
  const [intervalId, setIntervalId] = useState<NodeJS.Timer | null>(null);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const [songs, setSongs] = useState<ISongs[]>([
    {
      value: 'Songs will appear here',
      label: 'Songs will appear here',
      key: 'no-song',
    },
  ]);

  const searchSong = async (query: string) => {
    if (query.length < 1) return;
    const response = axios.get(`http://localhost:5000/api/track/search/${query}`).then(res => {
      return res.data;
    });

    const data = await response;

    if (data.length > 0) {
      const temp_songs: ISongs[] = [];
      data.map((track: any) => {
        // Check if the song is already in the songs state
        if (temp_songs.find(song => song.key === track.url)) return;
        temp_songs.push({
          value: `${track.artist} - ${track.name}`,
          label: `${track.name} - ${track.artist}`,
          key: track.url,
        });
      });
      setSongs(temp_songs.slice(0, 8)); // Update the songs state with the new search results
    } else {
      setSongs([]); // Clear the songs state if there are no search results
    }
  };

  const handlePlay = () => {
    if (audio.currentTime >= time / 1000) audio.currentTime = 0;

    audio.paused ? audio.play() : audio.pause();
    if (intervalId !== null) clearInterval(intervalId); // Clear the previous interval
    const newIntervalId = setInterval(() => {
      if (audio.currentTime >= time / 1000) {
        audio.pause();
        clearInterval(newIntervalId);
      }
    }, 10);
    setIntervalId(newIntervalId); // Se
  };

  useEffect(() => {
    if (intervalId !== null) clearInterval(intervalId); // Clear the previous interval
    const newIntervalId = setInterval(() => {
      if (audio.currentTime >= time / 1000) {
        audio.pause();
        clearInterval(newIntervalId);
      }
    }, 10);
    setIntervalId(newIntervalId); // Set the new interval ID
  }, [time]);

  const handleSkip = () => {
    switch (time) {
      case 1000:
        setTime(3000);
        break;
      case 3000:
        setTime(6000);
        break;
      case 6000:
        setTime(15000);
        break;
      case 15000:
        break;
      default:
        setTime(1000);
    }
  };
  useEffect(() => {
    audio.addEventListener('timeupdate', handleAudioTimeUpdate);
    return () => {
      audio.removeEventListener('timeupdate', handleAudioTimeUpdate);
    };
  }, [audio]);
  const handleAudioTimeUpdate = () => {
    setAudioTime(audio.currentTime);
  };
  return (
    <div className="rounded-md overflow-hidden w-4/6 h-4/6 min-h-[600px]">
      <Card className="h-full w-full">
        <CardHeader className=" text-center">
          <CardTitle>Musidle - Guess Today&apos;s Music</CardTitle>
          <CardDescription>You will have 1 | 3 | 6 | 15 seconds to guess it!</CardDescription>
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
                            setValue(value);
                          }}
                          value={value}
                        />

                        <CommandGroup>
                          {songs.map(song => (
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
                </div>
                <div className="pt-8">
                  {value === '' ? null : value.toLowerCase() == 'blinding lights - the weeknd' ? (
                    <label className=" text-green-500">You were right!</label>
                  ) : (
                    <Label>
                      <label className=" text-red-700">You were Wrong! </label>
                      <label>
                        The correct answer was
                        <br /> The Weeknd - Blinding Lights
                      </label>
                    </Label>
                  )}
                </div>
              </div>
            </AlertTitle>
          </Alert>
        </CardContent>
        <CardFooter className="flex justify-between text-center">
          <Button variant="ghost" onClick={() => handleSkip()} className="w-[9%]">
            Skip
          </Button>
          <div className="w-1/4 text-center">
            <Slider
              onValueChange={value => (audio.volume = value[0] / 100)}
              min={0}
              max={100}
              step={1}
              defaultValue={[100]}
              className={cn('py-4', 'h-4')}
            />
            <Label>Volume</Label>
          </div>
          <Button onClick={() => handlePlay()} className="w-[9%]">
            Play / Pause
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
