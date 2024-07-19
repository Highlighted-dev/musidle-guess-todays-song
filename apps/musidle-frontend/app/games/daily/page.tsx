import AnswerSelector from '@/components/game-related/AnswerSelector';
import AudioProgress from '@/components/game-related/AudioProgress';
import PlayAudioButton from '@/components/game-related/buttons/PlayAudioButton';
import AudioSetter from '@/components/game-related/AudioSetter';
import SingleplayerFooter from '@/components/game-related/SingleplayerFooter';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import React from 'react';
import { AlreadyPlayed } from '@/components/game-related/AlreadyPlayed';
import { getCookie } from 'cookies-next';
import { cookies } from 'next/headers';
import { getCurrentUrl } from '@/utils/GetCurrentUrl';
import { auth } from '@/auth';
import Redirecter from '@/components/Redirecter';
import TurnChangeDialog from '@/components/game-related/TurnChangeDialog';
import GameHeader from '@/components/game-related/GameHeader';

export const metadata = {
  title: 'Musidle Daily',
  description: "Guess today's music and challenge your knowledge!",
  keywords:
    'music, games, quizzes, articles, artist wikis, wordle, music quizzes, music games, music articles, music wiki',
};

async function getSong() {
  try {
    const song = await fetch(getCurrentUrl() + `/externalApi/audio/daily`, {
      cache: 'no-cache',
    }).then(res => res.arrayBuffer());
    return song;
  } catch (err) {
    console.log(err);
    return null;
  }
}
async function getSongId() {
  try {
    const response = await fetch(getCurrentUrl() + '/externalApi/daily', {
      cache: 'no-cache',
    });
    const result = await response.json();
    return result.song ? result.song.songId : null;
  } catch (err) {
    console.log(err);
    return null;
  }
}

export default async function Page() {
  const song = await getSong();
  const songId: string | null = await getSongId();
  const session = await auth();
  if (!session)
    return (
      <Redirecter
        url={`/`}
        message={`You are not authorized to play the daily game. Please log in to play.`}
        variant={'destructive'}
      />
    );
  const buffer = () => {
    if (song) {
      return Buffer.from(song).toString('base64');
    } else return null;
  };

  return (
    <div className="flex lg:flex-row flex-col justify-center items-center my-2">
      <TurnChangeDialog displayPlayerName={false} />
      <Card className="w-full flex flex-col  min-w-[200px] lg:p-0 py-6 lg:mx-2 lg:min-h-[700px] min-h-[460px]">
        <GameHeader title="Guess the song" />
        <CardContent className="flex w-full">
          <Card className="flex justify-center items-center p-4 w-full lg:min-h-[540px] min-h-[300px] mt-2">
            {getCookie('playedDaily', { cookies }) === 'true' ? (
              <AlreadyPlayed />
            ) : (
              <>
                <AudioSetter buffer={buffer()} songId={songId} session={session} />
                <CardContent className="h-full flex flex-col">
                  <div className="min-h-[200px]">
                    <AudioProgress />
                    <div className="text-center w-[250px] h-[50px] flex justify-center items-center ">
                      <PlayAudioButton className="min-w-[80px]" />
                    </div>
                  </div>
                  <div className=" flex flex-col justify-center items-center">
                    <AnswerSelector session={session} />
                  </div>
                </CardContent>
              </>
            )}
          </Card>
        </CardContent>
        <CardFooter className="flex justify-between text-center">
          <SingleplayerFooter />
        </CardFooter>
      </Card>
    </div>
  );
}
