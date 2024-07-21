'use client';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useAudioStore } from '@/stores/AudioStore';
import { useRoomStore } from '@/stores/RoomStore';
import { Session } from 'next-auth';

export default function ChangeStageButton({ session = null }: { session: Session | null }) {
  const { changeStage, audioContext } = useAudioStore();
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
    <Button
      variant={'secondary'}
      onClick={changeStage}
      className="w-[9%] min-w-[130px]"
      disabled={isDisabled}
    >
      Change Stage
    </Button>
  );
}
