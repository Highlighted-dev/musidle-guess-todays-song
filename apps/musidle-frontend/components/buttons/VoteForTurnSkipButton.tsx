'use client';
import React from 'react';
import { Button } from '../ui/button';
import { useRoomStore } from '@/stores/RoomStore';
import { useSocketStore } from '@/stores/SocketStore';

export default function VoteForTurnSkipButton({ className }: { className?: string }) {
  const { votesForTurnSkip, voteForTurnSkip, players } = useRoomStore();
  return (
    <Button
      variant={'outline'}
      onClick={() => {
        voteForTurnSkip(useSocketStore.getState().socket || null);
      }}
      className={className}
    >
      Vote for turn skip ({votesForTurnSkip}/{players.length > 1 ? players.length - 1 : 1})
    </Button>
  );
}
