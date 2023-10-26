'use client';
import { useAnswerStore } from '@/stores/AnswerStore';
import { useRoomStore } from '@/stores/RoomStore';
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { Label } from '@/components/ui/label';
import GamePhase1 from '@/components/multiplayer/GamePhase1';
import GamePhase2 from '@/components/multiplayer/GamePhase2';
import GamePhase3 from '@/components/multiplayer/GamePhase3';
import GameEndScreen from '@/components/multiplayer/GameEndScreen';
import GameLobby from '@/components/multiplayer/GameLobby';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useSocketStore } from '@/stores/SocketStore';

export default function Page() {
  const {
    joinRoom,
    players,
    spectators,
    round,
    maxRoundsPhaseOne,
    maxRoundsPhaseTwo,
    isInLobby,
    turnChangeDialogOpen,
    currentPlayer,
  } = useRoomStore();
  const [progress, setProgress] = React.useState(0);
  const { value, answer, possibleAnswers } = useAnswerStore();
  const user = useSession().data?.user;
  const router = useRouter();
  const params = useParams();

  const handleRoomJoin = async (room_code: string) => {
    if (!user?._id) return;
    joinRoom(room_code, user?._id, user?.username).then(() => {
      router.push(`/multiplayer/${room_code}`);
    });
  };

  useEffect(() => {
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
    <>
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
