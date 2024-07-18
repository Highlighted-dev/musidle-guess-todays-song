'use server';
import { Session } from 'next-auth';
import { getCurrentUrl } from '@/utils/GetCurrentUrl';

export const startGameAction = async (roomCode: string, session: Session | null) => {
  const response = await fetch(getCurrentUrl() + `/externalApi/rooms/start`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      roomCode: roomCode,
    }),
  });

  if (response.status !== 200) {
    return {
      status: 'Error',
      message: 'An error occurred during game start',
    };
  } else {
    return {
      status: 'Success',
      message: 'Game started successfully',
    };
  }
};
