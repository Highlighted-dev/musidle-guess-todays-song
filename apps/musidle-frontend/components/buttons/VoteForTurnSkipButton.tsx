'use client';
import React from 'react';
import { Button } from '../ui/button';
import { useRoomStore } from '../../stores/RoomStore';
import { useSocketStore } from '../../stores/SocketStore';
import { useNextAuthStore } from '../../stores/NextAuthStore';
import { Session } from 'next-auth';

export default function VoteForTurnSkipButton({
  className,
  session,
}: {
  className?: string;
  session: Session | null;
}) {
  const { votesForTurnSkip, voteForTurnSkip, players, isInLobby } = useRoomStore();
  return (
    <Button
      onClick={() => {
        voteForTurnSkip(useSocketStore.getState().socket || null);
      }}
      className={className}
      disabled={isInLobby || players.find(player => player.id === session?.user?.id) === undefined}
    >
      Vote for turn skip ({votesForTurnSkip}/{players.length > 1 ? players.length - 1 : 1})
    </Button>
  );
}
