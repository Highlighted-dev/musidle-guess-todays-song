import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import Verify from '@/components/Verify';

async function verifyUser(user_id: string, token: string) {
  const session = await getServerSession(authOptions);
  if (session?.user?.activated) {
    return { status: 'success' };
  }
  let url;
  if (process.env.NODE_ENV === 'development') {
    url = new URL('http://localhost:4200/externalApi/auth/activate/');
  } else {
    url = new URL(`${url}/externalApi/auth/activate/`);
  }
  try {
    const res = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({ id: user_id, token: token }),
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
  }
}

export default async function Page({ params }: { params: { user_id: string; token: string } }) {
  const response = await verifyUser(params.user_id, params.token);

  return (
    <>
      <Verify response={response} />
    </>
  );
}
