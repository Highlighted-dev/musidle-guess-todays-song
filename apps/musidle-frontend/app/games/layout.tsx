import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';

export const metadata = {
  title: 'Musidle Games',
};

export async function getNextSession() {
  const session = await getServerSession(authOptions);
  return session;
}

export default async function Layout({ children }: { children: React.ReactNode }) {
  return <div className="container py-6">{children}</div>;
}
