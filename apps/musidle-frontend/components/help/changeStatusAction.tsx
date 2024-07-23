'use server';
import { getCurrentUrl } from '@/utils/GetCurrentUrl';

export const changeStatusAction = async (status: string, requestId: string) => {
  const response = await fetch(getCurrentUrl() + `/externalApi/help/${requestId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      status: status,
    }),
  });
  const data = await response.json();
  if (response.status !== 200) {
    return {
      status: 'Error',
      message: data.message,
    };
  } else {
    return {
      status: 'Success',
      message: data.message,
    };
  }
};
