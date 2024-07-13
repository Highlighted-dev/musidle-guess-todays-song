import { useRoomStore } from '@/stores/RoomStore';
import React from 'react';
import { Button } from '../ui/button';
import { Session } from 'next-auth';
import { startGameAction } from '../actions/startGameAction';
import { toast } from '../ui/use-toast';

export default function StartGameButton({ session }: { session: Session | null }) {
  const { roomCode, players } = useRoomStore();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await startGameAction(roomCode, session).then(res => {
      toast({
        title: res.status,
        description: res.message,
      });
    });
  };
  return (
    <form onSubmit={handleSubmit}>
      <Button disabled={players[0]?.id != session?.user.id} type="submit">
        Start game
      </Button>
    </form>
  );
}
