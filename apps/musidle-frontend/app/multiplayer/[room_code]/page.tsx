import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import RoomProvider from '@/components/multiplayer/RoomProvider';
import Room_code from '@/components/pages/Room_code';
import { getServerSession } from 'next-auth';

async function joinRoom(room_code: string | null) {
  const player = await getServerSession(authOptions);
  let url;
  if (process.env.NODE_ENV === 'development') {
    url = new URL('http://localhost:4200/externalApi/rooms/join');
  } else {
    url = new URL(`${process.env.NEXT_PUBLIC_API_HOST}/externalApi/rooms/join`);
  }
  const room = await fetch(url, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({
      room_code,
      player: {
        _id: player?.user?._id,
        name: player?.user?.username,
        score: 0,
      },
    }),
    cache: 'no-store',
  }).then(res => res.json());
  return room;
}

export default async function Page({ params }: { params: { room_code: string } }) {
  const room = await joinRoom(params.room_code);
  return (
    <RoomProvider room={room}>
      <div className="rounded-md overflow-hidden w-full h-full flex flex-col justify-center items-center min-h-[750px]">
        <Room_code room={room} />
      </div>
    </RoomProvider>
  );
}
