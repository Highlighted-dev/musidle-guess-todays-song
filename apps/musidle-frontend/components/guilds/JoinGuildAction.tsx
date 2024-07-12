'use server';

import { Session } from 'next-auth';
import dotenv from 'dotenv';
import { unstable_update } from '@/auth';
import { getCurrentUrl } from '@/utils/GetCurrentUrl';

dotenv.config();

export async function joinGuildAction(name: string, session: Session | null) {
  if (!session?.user) {
    return {
      status: 'error',
      message: 'You must be logged in to join a guild',
    };
  }

  const response = await fetch(getCurrentUrl() + `/externalApi/guilds/${name}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user: session?.user }),
  });
  if (response.status == 200) {
    const data = await response.json();
    const updatedUser = {
      ...session.user,
      guild: { _id: data._id, name: data.name },
    };
    //@ts-ignore - unstable_update seems to be wrongly typed
    await unstable_update(updatedUser);
    return {
      status: 'Success',
      message: `You have joined a guild successfully, ${updatedUser.name}!`,
    };
  } else {
    return {
      status: 'Error',
      message: `Couldnt join a guild, ${session?.user?.name}!`,
    };
  }
}
