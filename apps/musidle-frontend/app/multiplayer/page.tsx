import { IRoom } from '@/@types/Rooms';
import MultiplayerPage from '@/components/multiplayer/MutiplayerPage';

export async function getRooms() {
  const rooms: IRoom[] = await fetch('http://localhost:4200/api/rooms', {
    cache: 'no-store',
  })
    .then(res => res.json())
    .then(res => res.rooms);
  return rooms;
}

export default async function Page() {
  const rooms = await getRooms();

  return <MultiplayerPage data={rooms} />;
}
