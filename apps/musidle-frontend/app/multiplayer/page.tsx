import { IRoom } from '@/@types/Rooms';
import Multiplayer from '@/components/pages/Mutiplayer';

async function getRooms() {
  let url;
  if (process.env.NODE_ENV === 'development') {
    url = new URL('http://localhost:4200/externalApi/rooms');
  } else {
    url = new URL(`${process.env.NEXT_PUBLIC_API_HOST}/externalApi/rooms`);
  }
  const rooms: IRoom[] = await fetch(url, {
    cache: 'no-store',
  })
    .then(res => res.json())
    .then(res => res.rooms);
  return rooms;
}

export default async function Page() {
  const rooms: IRoom[] = await getRooms();

  return <Multiplayer data={rooms} />;
}
