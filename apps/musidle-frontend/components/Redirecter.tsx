'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from './ui/use-toast';

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

  useEffect(() => {
    router.replace(url);
    router.refresh();
    if (message) {
      toast({
        variant: variant || 'default',
        title: title || 'You have been redirected',
        description: message,
        style: { whiteSpace: 'pre-line' },
      });
    }
  }, [message, router, title, url, variant]);

  return null;
}
