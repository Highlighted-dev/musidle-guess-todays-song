'use server';
import { Session } from 'next-auth';
import { getCurrentUrl } from '@/utils/GetCurrentUrl';

export const saveSettingsAction = async (
  roomCode: string,
  maxRoundsPhaseOne: number,
  maxRoundsPhaseTwo: number,
  maxTimer: number,
) => {
  const response = await fetch(getCurrentUrl() + `/externalApi/rooms/settings`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      roomCode,
      maxRoundsPhaseOne,
      maxRoundsPhaseTwo,
      maxTimer,
    }),
  });

  if (response.status !== 200) {
    return {
      status: 'Error',
      message: 'An error occurred during settings save',
    };
  } else {
    return {
      status: 'Success',
      message: 'Settings saved successfully',
    };
  }
};
