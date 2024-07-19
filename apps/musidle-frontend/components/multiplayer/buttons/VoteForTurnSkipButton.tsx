'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { useRoomStore } from '@/stores/RoomStore';
import { useSocketStore } from '@/stores/SocketStore';
import { Session } from 'next-auth';
import { useAudioStore } from '@/stores/AudioStore';

export default function VoteForTurnSkipButton({
  className,
  session,
  roomCode,
}: {
  className?: string;
  session: Session | null;
  roomCode: string;
}) {
  const { votesForTurnSkip, players, isInLobby } = useRoomStore();
  return (
    <Button
      onClick={() => {
        if (!session) return;
        useSocketStore
          .getState()
          .socket?.emit(
            'voteForTurnSkip',
            roomCode,
            session.user?.id,
            useAudioStore.getState().songId,
          );
        useRoomStore.setState({
          votesForTurnSkip: useRoomStore.getState().votesForTurnSkip + 1,
        });
      }}
      className={className}
      disabled={isInLobby || players.find(player => player.id === session?.user?.id) === undefined}
    >
      Vote for turn skip ({votesForTurnSkip}/{players.length > 1 ? players.length - 1 : 1})
    </Button>
  );
}
