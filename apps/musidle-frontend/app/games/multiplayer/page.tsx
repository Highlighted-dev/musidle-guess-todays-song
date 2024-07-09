import { IRoom } from 'apps/musidle-frontend/@types/Rooms';
import JoinRoomButton from 'apps/musidle-frontend/components/buttons/CreateRoomButton';
import RefreshRooms from 'apps/musidle-frontend/components/multiplayer/RefreshRooms';
import NoRooms from 'apps/musidle-frontend/components/NoRooms';
import { Card, CardContent, CardHeader, CardTitle } from 'apps/musidle-frontend/components/ui/card';
import { Label } from 'apps/musidle-frontend/components/ui/label';

export const metadata = {
  title: 'Musidle Multiplayer',
};

async function getRooms() {
  let url;
  if (process.env.NODE_ENV === 'development') {
    url = new URL('http://localhost:4200/externalApi/rooms');
  } else {
    url = new URL(`${process.env.NEXT_PUBLIC_API_HOST}/externalApi/rooms`);
  }
  try {
    const rooms: IRoom[] = await fetch(url, {
      cache: 'no-cache',
    })
      .then(res => res.json())
      .then(res => res.rooms);
    return rooms;
  } catch (err) {
    console.log(err);
    return null;
  }
}

export default async function Page() {
  const rooms: IRoom[] | null = await getRooms();

  return (
    <>
      <RefreshRooms />
      <Card className="w-full flex flex-col justify-center h-full p-1">
        <CardHeader className=" text-center">
          <CardTitle>Choose Lobby</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col h-full w-full overflow-y-auto">
          {rooms?.length ? (
            <div className="grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 grid-rows-4 gap-4">
              {rooms.map((room: IRoom, index: number) => (
                <Card className="flex flex-col justify-center w-full p-4 text-center" key={index}>
                  <Label className="font-bold text-lg w-full">{room.roomCode.toUpperCase()}</Label>
                  <div>
                    <Label className="text-center pr-2">Players: {room.players.length}/8</Label>
                    <JoinRoomButton roomCode={room.roomCode} />
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <NoRooms />
          )}
          {rooms?.length ? (
            <div className="flex justify-end items-center p-3 h-[8%]">
              <JoinRoomButton />
            </div>
          ) : null}
        </CardContent>
      </Card>
    </>
  );
}
