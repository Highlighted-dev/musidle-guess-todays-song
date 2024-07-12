'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { Button } from '../ui/button';
import { toast } from '../ui/use-toast';

export default function JoinRoomButton({
  className,
  roomCode,
}: {
  className?: string;
  roomCode?: string | null;
}) {
  const router = useRouter();
  const user = useSession().data?.user;

  const handleRoomJoin = async (roomCode: string | null = null) => {
    if (!user?.id) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: `Please login and activate your account to join a room`,
        style: { whiteSpace: 'pre-line' },
      });
      return;
    }
    router.push(`/games/multiplayer/${roomCode}`);
  };

  return (
    <Button
      variant={'default'}
      onClick={() => {
        handleRoomJoin(roomCode);
      }}
      className={className}
    >
      {roomCode ? 'Join room' : 'Create room'}
    </Button>
  );
}
