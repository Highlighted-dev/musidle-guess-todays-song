'use client';
import { useNextAuthStore } from '@/stores/NextAuthStore';
import { useRoomStore } from '@/stores/RoomStore';
import React from 'react';

const RoomProvider = ({ room, children }: { room: any; children: any }) => {
  const session = useNextAuthStore.getState().session;
  useRoomStore.getState().joinRoom(room, session?.user?._id);
  return <>{children}</>;
};

export default RoomProvider;
