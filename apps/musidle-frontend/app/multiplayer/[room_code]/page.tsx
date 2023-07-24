'use client';
import GameLobby from '@/components/multiplayer/GameLobby';
import GamePhase1 from '@/components/multiplayer/GamePhase1';
import GamePhase2 from '@/components/multiplayer/GamePhase2';
import GamePhase3 from '@/components/multiplayer/GamePhase3';
import React, { useContext, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/AuthStore';
import { useRoomStore } from '@/stores/RoomStore';
import { usePhaseStore } from '@/stores/PhasesStore';
export default function Multiplayer() {
  const { hasPhaseOneStarted, hasPhaseTwoStarted, hasPhaseThreeStarted } = usePhaseStore();
  const { joinRoom } = useRoomStore();
  const { user_id } = useAuthStore();
  const { players } = useRoomStore();
  const params = useParams();
  const router = useRouter();

  const handleRoomJoin = async (room_id: string) => {
    if (!user_id) return;
    joinRoom(room_id).then(() => {
      router.push(`/multiplayer/${room_id}`);
    });
  };

  useEffect(() => {
    if (params.room_code.length > 6) {
      router.push('/multiplayer');
      return;
    }
    if (params.room_code && !players.find(player => player['_id'] == user_id)) {
      handleRoomJoin(params.room_code);
    }
  }, [user_id, params.room_code, players]);

  return (
    <div className="rounded-md overflow-hidden w-4/6 h-4/6 min-h-[600px]">
      {
        //If game has started and user is in players array, render GamePhase1, else render GameLobby
        hasPhaseOneStarted && players.find(player => player['_id'] == user_id) ? (
          <GamePhase1 />
        ) : hasPhaseTwoStarted && players.find(player => player['_id'] == user_id) ? (
          <GamePhase2 />
        ) : hasPhaseThreeStarted && players.find(player => player['_id'] == user_id) ? (
          <GamePhase3 />
        ) : (
          <GameLobby room_code={params.room_code} />
        )
      }
    </div>
  );
}
