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
import { getCurrentUrl } from '@/utils/GetCurrentUrl';

export const metadata = {
  title: 'Musidle Daily',
};

async function getSong() {
  try {
    const song = await fetch(getCurrentUrl() + `/externalApi/audio/daily`, {
      cache: 'no-store',
    }).then(res => res.arrayBuffer());
    return song;
  } catch (err) {
    console.log(err);
    return null;
  }
}
async function getSongId() {
  try {
    const song = await fetch(getCurrentUrl() + '/externalApi/daily', {
      cache: 'no-store',
    })
      .then(res => res.json())
      .then(res => res.song);
    return song.songId;
  } catch (err) {
    console.log(err);
    return null;
  }
}

export default async function Page() {
  const song = await getSong();
  const songId: string | null = await getSongId();
  const buffer = () => {
    if (song) {
      return Buffer.from(song).toString('base64');
    } else return null;
  };

  return (
    <>
      <CardContent className="h-full ">
        <Card className="flex justify-center items-center h-full p-4">
          {getCookie('playedDaily', { cookies }) === 'true' ? (
            <AlreadyPlayed />
          ) : (
            <>
              <AudioSetter buffer={buffer()} songId={songId} />
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
