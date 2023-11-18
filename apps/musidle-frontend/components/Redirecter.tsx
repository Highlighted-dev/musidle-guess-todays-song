'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from './ui/use-toast';

// This component is used to redirect the user to the correct room if they are creating a room
export default function Redirecter({
  url,
  variant,
  title,
  message,
}: {
  url: string;
  variant?: 'default' | 'destructive' | null;
  title?: string;
  message?: string;
}) {
  const router = useRouter();
  if (message) {
    toast({
      variant: variant || 'default',
      title: title || 'You have been redirected',
      description: message,
      style: { whiteSpace: 'pre-line' },
    });
  }
  useEffect(() => {
    router.replace(url);
    router.refresh();
  });
  return null;
}
