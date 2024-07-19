'use server';
import { Session } from 'next-auth';
import { getCurrentUrl } from '@/utils/GetCurrentUrl';
import { unstable_update } from '@/auth';

export const saveUserSettingsAction = async (volume: number, session: Session | null) => {
  const response = await fetch(getCurrentUrl() + `/externalApi/user/${session?.user.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      settings: {
        volume: volume,
      },
    }),
  });
  const data = await response.json();
  if (response.status !== 200) {
    return {
      status: 'Error',
      message: data.message,
    };
  } else {
    const updatedUser = {
      ...session?.user,
      settings: {
        ...session?.user?.settings,
        volume: volume,
      },
    };
    //@ts-ignore - unstable_update seems to be wrongly typed
    await unstable_update(updatedUser);
    return {
      status: 'Success',
      message: data.message,
    };
  }
};
