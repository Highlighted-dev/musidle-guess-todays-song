'use client';
import GameLobby from '@/components/multiplayer/GameLobby';
import GamePhase1 from '@/components/multiplayer/GamePhase1';
import GamePhase2 from '@/components/multiplayer/GamePhase2';
import GamePhase3 from '@/components/multiplayer/GamePhase3';
import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/AuthStore';
import { useRoomStore } from '@/stores/RoomStore';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { useAnswerStore } from '@/stores/AnswerStore';
import GameEndScreen from '@/components/multiplayer/GameEndScreen';
import { useSocketStore } from '@/stores/SocketStore';
export default function Multiplayer() {
  const {
    joinRoom,
    turnChangeDialogOpen,
    players,
    spectators,
    round,
    currentPlayer,
    maxRoundsPhaseOne,
    maxRoundsPhaseTwo,
    isInLobby,
  } = useRoomStore();
  const { user_id } = useAuthStore();
  const { value, answer, possibleAnswers } = useAnswerStore();
  const [progress, setProgress] = React.useState(0);
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
    if (
      params.room_code &&
      user_id &&
      !players.find(player => player['_id'] == user_id && !useSocketStore.getState().socket)
    ) {
      handleRoomJoin(params.room_code);
    }
  }, [user_id, params.room_code]);

  useEffect(() => {
    if (turnChangeDialogOpen) {
      //update progress bar 4 times, once every 900ms
      const timer = setInterval(() => {
        setProgress(prevProgress => (prevProgress >= 100 ? 0 : prevProgress + 25));
      }, 900);
      return () => {
        clearInterval(timer);
        setProgress(0);
      };
    }
  }, [turnChangeDialogOpen]);

  return (
    <div className="rounded-md overflow-hidden w-full h-full flex flex-col justify-center items-center min-h-[750px]">
      <Dialog
        open={turnChangeDialogOpen}
        onOpenChange={() => {
          return;
        }}
      >
        <DialogContent className="text-center">
          <DialogHeader>
            <DialogTitle className="text-center">Round {round}</DialogTitle>
          </DialogHeader>
          <h1 className="text-base text-center">
            {answer && value.toLowerCase().includes(answer.toLowerCase()) ? (
              <Label className="text-green-500 font-bold"> CORRECT</Label>
            ) : (
              <Label className="text-red-700 font-bold"> INCORRECT</Label>
            )}
          </h1>
          <Label className="text-center">
            {`You guessed: ${
              possibleAnswers.find(song => song.value.toLowerCase() === value.toLowerCase())
                ?.value ||
              value ||
              'Nothing :('
            }`}
          </Label>
          <Label className="text-center">The correct answer was: {answer}</Label>
          <br />
          <h1 className="text-bold text-base">{currentPlayer?.name}&apos;s turn</h1>
          <DialogFooter className="text-center">
            <Progress value={progress} />
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {
        //If game has started and user is in players array, render GamePhase, else render GameLobby
        !isInLobby &&
        round <= maxRoundsPhaseOne &&
        (players.find(player => player['_id'] == user_id) ||
          spectators.find(spectator => spectator['_id'] == user_id)) ? (
          <GamePhase1 />
        ) : !isInLobby &&
          round <= maxRoundsPhaseOne + maxRoundsPhaseTwo &&
          (players.find(player => player['_id'] == user_id) ||
            spectators.find(spectator => spectator['_id'] == user_id)) ? (
          <GamePhase2 />
        ) : !isInLobby &&
          round <= maxRoundsPhaseOne + maxRoundsPhaseTwo + 1 &&
          (players.find(player => player['_id'] == user_id) ||
            spectators.find(spectator => spectator['_id'] == user_id)) ? (
          <GamePhase3 />
        ) : !isInLobby &&
          (players.find(player => player['_id'] == user_id) ||
            spectators.find(spectator => spectator['_id'] == user_id)) ? (
          <GameEndScreen />
        ) : (
          <GameLobby room_code={params.room_code} />
        )
      }
    </div>
  );
}
