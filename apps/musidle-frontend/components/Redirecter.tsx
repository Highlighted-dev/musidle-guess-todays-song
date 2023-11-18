'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// This component is used to redirect the user to the correct room if they are creating a room
export default function Redirecter({ url }: { url: string }) {
  const router = useRouter();

  useEffect(() => {
    router.replace(url);
    router.refresh();
  });
  return null;
}
