'use client';
import { useRoomStore } from '@/stores/RoomStore';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { Button } from './ui/button';

export default function JoinRoomButton({
  className,
  room_code,
}: {
  className?: string;
  room_code?: string;
}) {
  const { joinRoom } = useRoomStore();
  const router = useRouter();
  const user = useSession().data?.user;

  const handleRoomCreate = async () => {
    joinRoom(null, user).then(() => {
      if (!user?._id) return;
      router.push(`/multiplayer/${useRoomStore.getState().room_code}`);
    });
  };

  const handleRoomJoin = async (room_code: string) => {
    joinRoom(room_code, user).then(() => {
      if (!user?._id || !user?.activated) return;
      router.push(`/multiplayer/${room_code}`);
    });
  };

  return (
    <Button
      variant={'default'}
      onClick={() => {
        if (room_code) handleRoomJoin(room_code);
        else handleRoomCreate();
      }}
      className={className}
    >
      {room_code ? 'Join room' : 'Create room'}
    </Button>
  );
}
