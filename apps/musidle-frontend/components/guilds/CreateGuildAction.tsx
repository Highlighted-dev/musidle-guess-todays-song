'use server';

import { Session } from 'next-auth';
import dotenv from 'dotenv';
import { unstable_update } from '@/auth';
import { getCurrentUrl } from '@/utils/GetCurrentUrl';
import { IGuildCreationForm } from './GuildCreation';
dotenv.config();

export async function createGuildAction(formData: IGuildCreationForm, session: Session | null) {
  if (!session?.user) {
    return {
      status: 'error',
      message: 'You must be logged in to create guild',
    };
  }
  formData.user = session.user;

  const response = await fetch(getCurrentUrl() + '/externalApi/guilds/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });
  if (response.status == 201) {
    const data = await response.json();
    const updatedUser = {
      ...session.user,
      guild: { _id: data._id, name: data.name },
    };
    //@ts-ignore - unstable_update seems to be wrongly typed
    await unstable_update(updatedUser);
    return {
      status: 'Success',
      message: `Guild created succesfully, ${updatedUser.name}!`,
    };
  } else {
    return {
      status: 'Error',
      message: `Guild creation failed, ${session?.user?.name}!`,
    };
  }
}
