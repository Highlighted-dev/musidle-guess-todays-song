'use client';
import React, { useEffect, useState } from 'react';
import { CardContent } from '../ui/card';
import { Label } from '../ui/label';
import { Skeleton } from '../ui/skeleton';

export function AlreadyPlayed() {
  const [time, setTime] = useState<number>(new Date().getTime());
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    setTime(
      Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), new Date().getUTCDate() + 1) -
        Date.now(),
    );
    const timer = setInterval(() => {
      setTime(time => time - 1000);
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const hours = Math.floor(time / (1000 * 60 * 60));
  const minutes = Math.floor((time / (1000 * 60)) % 60);
  const seconds = Math.floor((time / 1000) % 60);

  return (
    <CardContent className="h-full flex flex-col justify-center items-center">
      <Label className=" text-2xl">You already played today 😔</Label>
      <div className="flex flex-col justify-center items-center p-8">
        <Label className="text-lg">Next daily in</Label>
        {hasMounted ? (
          <Label className="text-lg">
            {hours.toString().padStart(2, '0')}:{minutes.toString().padStart(2, '0')}:
            {seconds.toString().padStart(2, '0')}
          </Label>
        ) : (
          <Skeleton className="w-24 h-8" />
        )}
      </div>
    </CardContent>
  );
}
