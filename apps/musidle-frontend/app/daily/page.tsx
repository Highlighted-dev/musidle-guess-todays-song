import AnswerSelector from '@/components/game-related/AnswerSelector';
import AudioProgress from '@/components/game-related/AudioProgress';
import PlayAudioButton from '@/components/buttons/PlayAudioButton';
import AudioSetter from '@/components/daily/AudioSetter';
import SingleplayerFooter from '@/components/daily/SingleplayerFooter';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import React from 'react';
import { AlreadyPlayed } from '@/components/daily/AlreadyPlayed';
import { getCookie } from 'cookies-next';
import { cookies } from 'next/headers';

export const metadata = {
  title: 'Musidle Daily',
};

async function getSong() {
  let url;
  if (process.env.NODE_ENV === 'development') {
    url = new URL('http://localhost:4200/externalApi/daily');
  } else {
    url = new URL(`${process.env.NEXT_PUBLIC_API_HOST}/externalApi/daily`);
  }
  const res = await fetch(url, {
    cache: 'no-store',
  });
  const data = await res.json();
  return data;
}

export default async function Page() {
  const { song } = await getSong();

  return (
    <>
      <CardContent className="h-full">
        <Card className="flex justify-center items-center h-full p-4">
          {getCookie('playedDaily', { cookies }) === 'true' ? (
            <AlreadyPlayed />
          ) : (
            <>
              <AudioSetter songId={song.songId} />
              <CardContent className="h-full flex flex-col">
                <div className="h-1/2">
                  <AudioProgress />
                  <div className="text-center w-[250px] h-[50px] flex justify-center items-center ">
                    <PlayAudioButton className="min-w-[80px]" />
                  </div>
                </div>
                <div className="h-1/2 flex flex-col justify-center items-center relative">
                  <AnswerSelector />
                </div>
              </CardContent>
            </>
          )}
        </Card>
      </CardContent>
      <CardFooter className="flex justify-between text-center">
        <SingleplayerFooter />
      </CardFooter>
    </>
  );
}
