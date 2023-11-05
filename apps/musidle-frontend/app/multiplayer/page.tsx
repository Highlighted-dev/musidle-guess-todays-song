import { IRoom } from '@/@types/Rooms';
import RoomSelector from '@/components/multiplayer/RoomSelector';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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

  return (
    <Card className="float-left xl:w-4/6 flex flex-col justify-center align-center h-full">
      <CardHeader className=" text-center">
        <CardTitle>Choose Lobby</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col h-full w-full">
        <RoomSelector data={rooms} />
      </CardContent>
    </Card>
  );
}
