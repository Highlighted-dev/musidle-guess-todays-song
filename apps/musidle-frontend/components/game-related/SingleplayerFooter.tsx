'use client';
import { useEffect, useState } from 'react';
import { useRoomStore } from '../../stores/RoomStore';
import { toast } from '../ui/use-toast';
import ChangeStageButton from './buttons/ChangeStageButton';
import SubmitAnswerButton from './buttons/SubmitAnswerButton';
import { useRouter } from 'next/navigation';
import { Session } from 'next-auth';

export default function SingleplayerFooter({ session }: { session: Session | null }) {
  const { currentPlayer, roomCode } = useRoomStore();
  const router = useRouter();

  useEffect(() => {
    if (!currentPlayer) return;
    toast({
      title: `You are currently playing multiplayer in ${roomCode} room`,
      description: `If you want to play daily games, please hit f5 to clear multiplayer data.`,
      variant: 'destructive',
      duration: 10000,
    });
  }, [currentPlayer]);

  return (
    <>
      <ChangeStageButton session={session} />
      <SubmitAnswerButton className="w-[9%] min-w-[130px]" router={router} session={session} />
    </>
  );
}
