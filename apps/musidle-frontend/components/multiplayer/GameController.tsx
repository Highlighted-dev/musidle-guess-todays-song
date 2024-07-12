'use client';
import { useRoomStore } from '../../stores/RoomStore';
import React from 'react';
import GamePhase1 from './GamePhase1';
import GamePhase2 from './GamePhase2';
import GamePhase3 from './GamePhase3';
import GameEndScreen from './GameEndScreen';
import GameLobby from './GameLobby';
import TurnChangeDialog from '../game-related/TurnChangeDialog';
import { Session } from 'next-auth';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function GameController({
  params,
  session,
}: {
  params: any;
  session: Session | null;
}) {
  const { players, spectators, round, maxRoundsPhaseOne, maxRoundsPhaseTwo, isInLobby } =
    useRoomStore();
  const user = session?.user;

  return (
    <>
      <TurnChangeDialog />
      {
        //If game has started and user is in players array, render GamePhase, else render GameLobby
        !isInLobby &&
        round <= maxRoundsPhaseOne &&
        (players.find(player => player['id'] == user?.id) ||
          spectators.find(spectator => spectator['id'] == user?.id)) ? (
          <GamePhase1 session={session} />
        ) : !isInLobby &&
          round <= maxRoundsPhaseOne + maxRoundsPhaseTwo &&
          (players?.find(player => player['id'] == user?.id) ||
            spectators.find(spectator => spectator['id'] == user?.id)) ? (
          <GamePhase2 session={session} />
        ) : !isInLobby &&
          round <= maxRoundsPhaseOne + maxRoundsPhaseTwo + 1 &&
          (players?.find(player => player['id'] == user?.id) ||
            spectators.find(spectator => spectator['id'] == user?.id)) ? (
          <GamePhase3 session={session} />
        ) : !isInLobby &&
          (players.find(player => player['id'] == user?.id) ||
            spectators.find(spectator => spectator['id'] == user?.id)) ? (
          <GameEndScreen />
        ) : (
          <GameLobby session={session} />
        )
      }
    </>
  );
}
