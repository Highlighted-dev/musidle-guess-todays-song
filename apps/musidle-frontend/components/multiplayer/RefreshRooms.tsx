'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

export default function RefreshRooms() {
  const router = useRouter();
  const intervalRef = useRef<NodeJS.Timeout | undefined>(undefined);
  useEffect(() => {
    if (intervalRef.current) return;

    intervalRef.current = setInterval(async () => {
      router.refresh();
    }, 12000);

    return () => {
      clearInterval(intervalRef.current);
    };
  }, []);

  return <></>;
}
