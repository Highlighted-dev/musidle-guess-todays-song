'use client';
import { useEffect } from 'react';
import { useRoomStore } from '../../stores/RoomStore';
import { toast } from '../ui/use-toast';
import ChangeStageButton from './buttons/ChangeStageButton';
import SubmitAnswerButton from './buttons/SubmitAnswerButton';
import { useRouter } from 'next/navigation';

export default function SingleplayerFooter() {
  const { currentPlayer, roomCode } = useRoomStore();
  const router = useRouter();

  useEffect(() => {
    if (!currentPlayer) return;
    toast({
      title: `You are currently playing multiplayer in ${roomCode} room`,
      description: `You can't play singleplayer while playing multiplayer. Please leave multiplayer room to play singleplayer. (or hit f5 to clear room-related data)`,
      variant: 'destructive',
    });
  }, [currentPlayer]);

  return (
    <>
      <ChangeStageButton className="w-[12%] min-w-[130px]" />
      <SubmitAnswerButton className="w-[12%] min-w-[130px]" router={router} />
    </>
  );
}
