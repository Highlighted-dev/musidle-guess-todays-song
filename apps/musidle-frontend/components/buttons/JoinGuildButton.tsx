'use client';
import React from 'react';
import { Button } from '../ui/button';
import { getCurrentUrl } from '@/utils/GetCurrentUrl';
import { useSession } from 'next-auth/react';

export default function JoinGuildButton({ name }: { name: string }) {
  const { data, update } = useSession();
  const handleJoinGuild = async () => {
    await fetch(getCurrentUrl() + `/externalApi/guilds/${name}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user: data?.user }),
    })
      .then(res => res.json())
      .then(async res => {
        if (res._id) {
          await update({
            guild: {
              _id: res._id,
              name: res.name,
            },
          });
        }
      });
  };
  return <Button onClick={handleJoinGuild}>Join Guild</Button>;
}
