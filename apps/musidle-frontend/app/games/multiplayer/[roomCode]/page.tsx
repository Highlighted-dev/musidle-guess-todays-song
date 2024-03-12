import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from 'apps/musidle-frontend/app/api/auth/[...nextauth]/route';
import GameController from 'apps/musidle-frontend/components/multiplayer/GameController';
import { RoomStoreInitializer } from 'apps/musidle-frontend/stores/RoomStore';
import Leaderboard from 'apps/musidle-frontend/components/multiplayer/Leaderboard';
import Redirecter from 'apps/musidle-frontend/components/Redirecter';
import GameChat from 'apps/musidle-frontend/components/multiplayer/GameChat';

export default async function Page({ params }: { params: { roomCode: string } }) {
  const session = await getServerSession(authOptions);
  let url;
  if (process.env.NODE_ENV === 'development') {
    url = new URL('http://localhost:4200/externalApi/rooms/');
  } else {
    url = new URL(`${process.env.NEXT_PUBLIC_API_HOST}/externalApi/rooms/`);
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
        username: session?.user.username,
      },
    }),
  })
    .then(res => res.json())
    .catch(err => console.log(err));

  if (process.env.NODE_ENV === 'development') {
    url = new URL(`http://localhost:4200/externalApi/audio/multiplayer/${params.roomCode}`);
  } else {
    url = new URL(
      `${process.env.NEXT_PUBLIC_API_HOST}/externalApi/audio/multiplayer/${params.roomCode}`,
    );
  }
  const audioArrayBuffer = await fetch(url).then(res => {
    if (res.status != 200) return null;
    return res.arrayBuffer();
  });
  const buffer = () => {
    if (audioArrayBuffer) {
      return Buffer.from(audioArrayBuffer).toString('base64');
    } else return null;
  };
  if (!data) {
    return (
      <Redirecter
        url={`/games/multiplayer`}
        message={`The room you tried to join is full, does not exist or you are already in a different room.`}
        variant={'destructive'}
      />
    );
  } else if (params.roomCode == 'null') {
    return <Redirecter url={`/games/multiplayer/${data.roomCode}`} />;
  } else
    return (
      <>
        <RoomStoreInitializer data={data} buffer={buffer()} />
        <div className="flex lg:flex-row flex-col justify-center items-center my-2">
          <GameChat />
          <GameController params={params} />
          <Leaderboard />
        </div>
      </>
    );
}
