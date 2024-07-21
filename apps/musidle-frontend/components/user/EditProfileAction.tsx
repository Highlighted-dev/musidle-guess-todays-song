'use server';
import { Session } from 'next-auth';
import { IUserEditForm } from './ProfileCard';
import { getCurrentUrl } from '@/utils/GetCurrentUrl';
import { unstable_update } from '@/auth';

export const editProfileAction = async (formData: IUserEditForm, session: Session | null) => {
  if (!session?.user) {
    return {
      status: 'error',
      message: 'You must be logged in to edit your profile',
    };
  }

  const { name } = formData;
  if (!name) {
    return {
      status: 'Error',
      message: 'Username cannot be empty',
    };
  } else if (name.length < 3) {
    return {
      status: 'Error',
      message: 'Username too short',
    };
  } else if (name.length > 20) {
    return {
      status: 'Error',
      message: 'Username too long',
    };
  }
  const response = await fetch(getCurrentUrl() + `/externalApi/user/${session.user.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });
  if (response.status !== 200) {
    return {
      status: 'Error',
      message: 'Failed to update username',
    };
  } else {
    const updatedUser = {
      ...session.user,
      name: name,
    };
    //@ts-ignore - unstable_update seems to be wrongly typed
    await unstable_update(updatedUser);
    return {
      status: 'Success',
      message: 'Username updated',
    };
  }
};
