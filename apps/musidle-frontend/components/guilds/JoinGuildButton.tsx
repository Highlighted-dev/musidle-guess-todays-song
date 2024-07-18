'use client';
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { getCurrentUrl } from '../../utils/GetCurrentUrl';

import { useForm } from 'react-hook-form';
import { auth } from '@/auth';
import { joinGuildAction } from '../guilds/JoinGuildAction';
import { Session } from 'next-auth';
import { toast } from '../ui/use-toast';
import { useRouter } from 'next/navigation';

export default function JoinGuildButton({
  name,
  session,
}: {
  name: string;
  session: Session | null;
}) {
  const {
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const onSubmit = async () => {
    setLoading(true);
    let result;
    try {
      result = await joinGuildAction(name, session);
    } catch (error) {
      console.error('Failed to create guild', error);
    } finally {
      setLoading(false);
      toast({
        title: result?.status,
        description: result?.message,
      });
      router.push(`/guilds/${name}`);
      router.refresh();
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Button type="submit">Join Guild</Button>
    </form>
  );
}
