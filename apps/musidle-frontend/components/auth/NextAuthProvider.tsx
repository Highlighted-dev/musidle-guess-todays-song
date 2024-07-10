'use client';
import { SessionProvider } from 'next-auth/react';
import { useNextAuthStore } from '../../stores/NextAuthStore';
import { Session } from 'next-auth';
export default function NextAuthProvider({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session | null;
}) {
  useNextAuthStore.getState().session = session;
  return (
    <SessionProvider session={session} refetchOnWindowFocus={false}>
      {children}
    </SessionProvider>
  );
}
