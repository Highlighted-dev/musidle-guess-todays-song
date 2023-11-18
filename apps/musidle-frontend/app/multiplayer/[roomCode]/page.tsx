import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import GameController from '@/components/multiplayer/GameController';
import { RoomStoreInitializer } from '@/stores/RoomStore';
import Leaderboard from '@/components/multiplayer/Leaderboard';
import RoomRedirecter from '@/components/multiplayer/RoomRedirecter';

export default async function Page({ params }: { params: { roomCode: string } }) {
  const session = await getServerSession(authOptions);
  let url;
  if (process.env.NODE_ENV === 'development') {
    url = new URL('http://localhost:4200/externalApi/rooms/join');
  } else {
    url = new URL(`${process.env.NEXT_PUBLIC_API_HOST}/externalApi/rooms/join`);
  }
  const data = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      roomCode: params.roomCode == 'null' ? null : params.roomCode,
      player: {
        _id: session?.user._id,
        name: session?.user.username,
        score: 0,
      },
    }),
  })
    .then(res => res.json())
    .catch(err => console.log(err));
  if (params.roomCode == 'null') {
    return <RoomRedirecter params={params} roomCode={data?.roomCode} />;
  }
  return (
    <>
      <RoomStoreInitializer data={data} />
      <GameController params={params} />
      <Leaderboard />
    </>
  );
}
