'use client';
import GameLobby from '@/components/multiplayer/GameLobby';
import GamePhase1 from '@/components/multiplayer/GamePhase1';
import GamePhase2 from '@/components/multiplayer/GamePhase2';
import GamePhase3 from '@/components/multiplayer/GamePhase3';
import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/AuthStore';
import { useRoomStore } from '@/stores/RoomStore';
import { usePhaseStore } from '@/stores/PhasesStore';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
export default function Multiplayer() {
  const { hasPhaseOneStarted, hasPhaseTwoStarted, hasPhaseThreeStarted } = usePhaseStore();
  const { joinRoom, turnChangeDialogOpen } = useRoomStore();
  const { user_id } = useAuthStore();
  const { players, round, currentPlayer } = useRoomStore();
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
    if (params.room_code && !players.find(player => player['_id'] == user_id)) {
      handleRoomJoin(params.room_code);
    }
  }, [user_id, params.room_code, players]);

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
    <div className="rounded-md overflow-hidden w-4/6 h-4/6 min-h-[600px]">
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
          <h1 className="text-bold text-base">{currentPlayer?.name}&apos;s turn</h1>
          <DialogFooter className="text-center">
            <Progress value={progress} />
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
