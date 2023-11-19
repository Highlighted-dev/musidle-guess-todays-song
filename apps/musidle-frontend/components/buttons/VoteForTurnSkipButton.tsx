'use client';
import React from 'react';
import { Button } from '../ui/button';
import { useRoomStore } from '@/stores/RoomStore';
import { useSocketStore } from '@/stores/SocketStore';
import { useNextAuthStore } from '@/stores/NextAuthStore';

export default function VoteForTurnSkipButton({ className }: { className?: string }) {
  const { votesForTurnSkip, voteForTurnSkip, players, isInLobby } = useRoomStore();
  const { session } = useNextAuthStore();
  return (
    <Button
      variant={'outline'}
      onClick={() => {
        voteForTurnSkip(useSocketStore.getState().socket || null);
      }}
      className={className}
      disabled={
        isInLobby || players.find(player => player._id === session?.user?._id) === undefined
      }
    >
      Vote for turn skip ({votesForTurnSkip}/{players.length > 1 ? players.length - 1 : 1})
    </Button>
  );
}
