import React from 'react';
import { Button } from '@/components/ui/button';
import { Session } from 'next-auth';
import { useRoomStore } from '@/stores/RoomStore';
import { useTimerStore } from '@/stores/TimerStore';
import { toast } from '@/components/ui/use-toast';
import { saveSettingsAction } from '@/components/multiplayer/actions/saveSettingsAction';

export default function SaveSettingsButton({
  roomCode,
  maxRoundsPhaseOne,
  maxRoundsPhaseTwo,
  maxTimer,
  session,
}: {
  roomCode: string;
  maxRoundsPhaseOne: number;
  maxRoundsPhaseTwo: number;
  maxTimer: number;
  session: Session | null;
}) {
  const { players } = useRoomStore();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      maxRoundsPhaseOne < 1 ||
      maxRoundsPhaseTwo < 1 ||
      maxRoundsPhaseOne > 400 ||
      maxRoundsPhaseTwo > 200 ||
      maxTimer < 1 ||
      maxTimer > 120
    ) {
      return toast({
        title: 'Error',
        description: `Please enter a valid number of\n Rounds in phase 1: 1-400\nRounds in phase 2: 1-200 \n Seconds for timer: 1-120`,
        variant: 'destructive',
      });
    }

    await saveSettingsAction(roomCode, maxRoundsPhaseOne, maxRoundsPhaseTwo, maxTimer).then(res => {
      toast({
        title: res.status,
        description: res.message,
      });
      if (res.status === 'Success') {
        useRoomStore.setState({
          maxRoundsPhaseOne: maxRoundsPhaseOne,
          maxRoundsPhaseTwo: maxRoundsPhaseTwo,
        });
        useTimerStore.setState({ maxTimer: maxTimer });
      }
    });
  };
  return (
    <form onSubmit={handleSubmit} className="flex justify-end">
      <Button disabled={players[0]?.id != session?.user.id}>Save</Button>
    </form>
  );
}
