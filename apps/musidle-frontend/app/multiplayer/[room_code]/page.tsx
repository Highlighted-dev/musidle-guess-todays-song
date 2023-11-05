'use client';
import { useRoomStore } from '@/stores/RoomStore';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import GamePhase1 from '@/components/multiplayer/GamePhase1';
import GamePhase2 from '@/components/multiplayer/GamePhase2';
import GamePhase3 from '@/components/multiplayer/GamePhase3';
import GameEndScreen from '@/components/multiplayer/GameEndScreen';
import GameLobby from '@/components/multiplayer/GameLobby';
import { useSocketStore } from '@/stores/SocketStore';
import { toast } from '@/components/ui/use-toast';
import { useSession } from 'next-auth/react';
import TurnChangeDialog from '@/components/multiplayer/TurnChangeDialog';

export default function Page() {
  const { joinRoom, players, spectators, round, maxRoundsPhaseOne, maxRoundsPhaseTwo, isInLobby } =
    useRoomStore();

  const user = useSession().data?.user;
  const router = useRouter();
  const params = useParams();

  const handleRoomJoin = async (room_code: string) => {
    joinRoom(room_code, user).then(() => {
      router.push(`/multiplayer/${room_code}`);
    });
  };

  useEffect(() => {
    if (!user?._id || !user?.activated) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: `Please login and activate your account to join a room`,
        style: { whiteSpace: 'pre-line' },
      });
    }
    if (params.room_code.length > 6) {
      router.push('/multiplayer');
      return;
    }
    if (
      params.room_code &&
      user?._id &&
      !players.find(player => player['_id'] == user?._id && !useSocketStore.getState().socket)
    ) {
      handleRoomJoin(params.room_code as string);
    }
  }, [user?._id, params.room_code]);

  return (
    <>
      <TurnChangeDialog />
      {
        //If game has started and user is in players array, render GamePhase, else render GameLobby
        !isInLobby &&
        round <= maxRoundsPhaseOne &&
        (players.find(player => player['_id'] == user?._id) ||
          spectators.find(spectator => spectator['_id'] == user?._id)) ? (
          <GamePhase1 />
        ) : !isInLobby &&
          round <= maxRoundsPhaseOne + maxRoundsPhaseTwo &&
          (players?.find(player => player['_id'] == user?._id) ||
            spectators.find(spectator => spectator['_id'] == user?._id)) ? (
          <GamePhase2 />
        ) : !isInLobby &&
          round <= maxRoundsPhaseOne + maxRoundsPhaseTwo + 1 &&
          (players?.find(player => player['_id'] == user?._id) ||
            spectators.find(spectator => spectator['_id'] == user?._id)) ? (
          <GamePhase3 />
        ) : !isInLobby &&
          (players.find(player => player['_id'] == user?._id) ||
            spectators.find(spectator => spectator['_id'] == user?._id)) ? (
          <GameEndScreen />
        ) : (
          <GameLobby room_code={params.room_code as string} />
        )
      }
    </>
  );
}
