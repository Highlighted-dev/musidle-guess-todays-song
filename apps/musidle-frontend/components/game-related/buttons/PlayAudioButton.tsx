'use client';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAudioStore } from '@/stores/AudioStore';
import { Session } from 'next-auth';
import { useRoomStore } from '@/stores/RoomStore';

export default function PlayAudioButton({ session = null }: { session: Session | null }) {
  const { handlePlay, audioContext } = useAudioStore();
  const { currentPlayer } = useRoomStore();
  const [isDisabled, setIsDisabled] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // If currentPlayer is not null, then the current user is in a multiplayer game
      if (currentPlayer) {
        setIsDisabled(currentPlayer?.id != session?.user.id || !audioContext);
      } else {
        setIsDisabled(!audioContext);
      }
    }
  }, [currentPlayer, session, audioContext]);

  return (
    <Button onClick={handlePlay} className="min-w-[80px]" disabled={isDisabled}>
      {audioContext?.state == 'running' ? 'Pause' : 'Play'}
    </Button>
  );
}
