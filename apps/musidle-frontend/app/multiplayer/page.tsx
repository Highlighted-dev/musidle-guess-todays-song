import { IRoom } from '@/@types/Rooms';
import JoinRoomButton from '@/components/buttons/CreateRoomButton';
import NoRooms from '@/components/NoRooms';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

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
        <div className="h-[92%]">
          {rooms?.length ? (
            rooms.map((room: IRoom, index: number) => (
              <div key={index}>
                <div className=" w-full h-[15%] flex justify-between p-4">
                  <Label className="text-center flex justify-center items-center">
                    {room.room_code}
                  </Label>
                  <div>
                    <Label className="text-center pr-4">Players: {room.players.length}/8</Label>
                    <JoinRoomButton room_code={room.room_code} />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <NoRooms />
          )}
        </div>
        {rooms?.length ? (
          <div className="flex justify-end items-center p-3 h-[8%]">
            <JoinRoomButton />
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
