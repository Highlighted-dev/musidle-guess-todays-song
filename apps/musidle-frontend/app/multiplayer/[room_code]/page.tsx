'use client';
import { AuthContextType } from '@/@types/AuthContext';
import { GameContextType } from '@/@types/GameContext';
import { authContext } from '@/components/contexts/AuthContext';
import { gameContext } from '@/components/contexts/GameContext';
import GameLobby from '@/components/multiplayer/GameLobby';
import GamePhase1 from '@/components/multiplayer/GamePhase1';
import GamePhase2 from '@/components/multiplayer/GamePhase2';
import GamePhase3 from '@/components/multiplayer/GamePhase3';
import React, { useContext, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
export default function Multiplayer() {
  const { players, hasPhaseOneStarted, hasPhaseTwoStarted, hasPhaseThreeStarted, handleRoomJoin } =
    useContext(gameContext) as GameContextType;
  const { authState } = useContext(authContext) as AuthContextType;
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    //Join room on page load if not in players array
    if (params.room_code.length > 6) {
      router.push('/multiplayer');
      return;
    }
    if (params.room_code && !players.find(player => player['_id'] == authState._id)) {
      handleRoomJoin(params.room_code);
    }
  }, [authState, params.room_code]);

  return (
    <div className="rounded-md overflow-hidden w-4/6 h-4/6 min-h-[600px]">
      {
        //If game has started and user is in players array, render GamePhase1, else render GameLobby
        hasPhaseOneStarted && players.find(player => player['_id'] == authState._id) ? (
          <GamePhase1 />
        ) : hasPhaseTwoStarted && players.find(player => player['_id'] == authState._id) ? (
          <GamePhase2 />
        ) : hasPhaseThreeStarted && players.find(player => player['_id'] == authState._id) ? (
          <GamePhase3 />
        ) : (
          <GameLobby room_code={params.room_code} />
        )
      }
    </div>
  );
}
