'use server';
import { Session } from 'next-auth';
import { getCurrentUrl } from '@/utils/GetCurrentUrl';

export const joinToSpectatorsAction = async (roomCode: string, session: Session | null) => {
  const response = await fetch(getCurrentUrl() + `/externalApi/rooms/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      roomCode: roomCode,
      player: {
        id: session?.user?.id,
        name: session?.user?.name,
      },
      asSpectator: true,
    }),
  });

  if (response.status !== 200) {
    return {
      status: 'Error',
      message: 'Couldnt join to spectators list',
    };
  } else {
    return {
      status: 'Success',
      message: 'Joined to spectators list successfully',
    };
  }
};
