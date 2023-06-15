'use client';
import { useEffect, useState, useRef } from 'react';
import { AiOutlinePauseCircle, AiOutlinePlayCircle } from 'react-icons/ai';
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
import { Input } from '@/components/ui/input';
export default function Index() {
  const [audio, setAudio] = useState(new Audio('/music/2.mp3'));
  const [audioTime, setAudioTime] = useState(0);
  const [time, setTime] = useState(1000);

  const handlePlay = () => {
    if (audio.currentTime >= time / 1000) audio.currentTime = 0;

    audio.paused ? audio.play() : audio.pause();
    const interval = setInterval(() => {
      if (audio.currentTime >= time / 1000) {
        audio.pause();
        clearInterval(interval);
      }
    }, 10);
  };

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
          <Alert className="grid justify-center items-center">
            <AlertTitle className="h-[340px]">
              <div className="py-8 text-center w-full">
                <Slider
                  value={[audioTime]}
                  min={0}
                  max={time / 1000}
                  disabled
                  className={cn('py-4', 'h-4')}
                />
                {time / 1000} {time / 1000 === 1 ? 'second' : 'seconds'}
              </div>
              <div className="text-center">
                <div className="pb-4">
                  <Input type="email" placeholder="Guess the song!" className={cn('text-center')} />
                </div>
                <Button className="w-full">Submit</Button>
              </div>
            </AlertTitle>
          </Alert>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="ghost" onClick={() => handleSkip()}>
            Skip
          </Button>
          <div className="w-1/4 text-center">
            <Slider
              onValueChange={value => (audio.volume = value[0] / 100)}
              min={0}
              max={100}
              step={1}
              defaultValue={[100]}
              className={cn('p-4', 'h-4')}
            />
            <Label>Volume</Label>
          </div>
          <Button onClick={() => handlePlay()}>Play / Pause</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
