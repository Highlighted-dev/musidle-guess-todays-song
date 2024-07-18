'use server';
import { Session } from 'next-auth';
import { getCurrentUrl } from '@/utils/GetCurrentUrl';

export const bugReportAction = async (description: string, session: Session | null) => {
  const response = await fetch(getCurrentUrl() + `/externalApi/help/report`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      description: description,
      userId: session?.user?.id,
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
