'use client';
import { useRoomStore } from '@/stores/RoomStore';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { Button } from '../ui/button';

export default function JoinRoomButton({
  className,
  roomCode,
}: {
  className?: string;
  roomCode?: string;
}) {
  const { joinRoom } = useRoomStore();
  const router = useRouter();
  const user = useSession().data?.user;

  const handleRoomCreate = async () => {
    joinRoom(null, user).then(() => {
      if (!user?._id) return;
      router.push(`/multiplayer/${useRoomStore.getState().roomCode}`);
    });
  };

  const handleRoomJoin = async (roomCode: string) => {
    joinRoom(roomCode, user).then(() => {
      if (!user?._id || !user?.activated) return;
      router.push(`/multiplayer/${roomCode}`);
    });
  };

  return (
    <Button
      variant={'default'}
      onClick={() => {
        if (roomCode) handleRoomJoin(roomCode);
        else handleRoomCreate();
      }}
      className={className}
    >
      {roomCode ? 'Join room' : 'Create room'}
    </Button>
  );
}
