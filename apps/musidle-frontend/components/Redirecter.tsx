'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from './ui/use-toast';

interface RedirecterProps {
  url: string;
  variant?: 'default' | 'destructive' | null;
  title?: string;
  message?: string;
}

export default function Redirecter({
  url,
  variant = 'default',
  title = 'You have been redirected',
  message,
}: RedirecterProps) {
  const router = useRouter();

  useEffect(() => {
    router.replace(url);
    router.refresh();
    if (message) {
      toast({
        variant,
        title,
        description: message,
        style: { whiteSpace: 'pre-line' },
      });
    }
  }, [url, router, variant, title, message]);

  return null;
}
