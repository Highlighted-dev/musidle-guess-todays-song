'use client';
import { useRoomStore } from '../../stores/RoomStore';
import { useSession } from 'next-auth/react';
import React from 'react';
import GamePhase1 from './GamePhase1';
import GamePhase2 from './GamePhase2';
import GamePhase3 from './GamePhase3';
import GameEndScreen from './GameEndScreen';
import GameLobby from './GameLobby';
import TurnChangeDialog from '../game-related/TurnChangeDialog';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function GameController({ params }: any) {
  const { players, spectators, round, maxRoundsPhaseOne, maxRoundsPhaseTwo, isInLobby } =
    useRoomStore();
  const user = useSession().data?.user;

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
          <GameLobby roomCode={params.roomCode as string} />
        )
      }
    </>
  );
}
