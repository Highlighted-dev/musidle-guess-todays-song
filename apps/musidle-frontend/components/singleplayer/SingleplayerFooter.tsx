'use client';
import { useEffect } from 'react';
import { useAnswerStore } from '@/stores/AnswerStore';
import { useAudioStore } from '@/stores/AudioStore';
import { useRoomStore } from '@/stores/RoomStore';
import { toast } from '../ui/use-toast';
import VolumeSlider from '../game-related/VolumeSlider';
import ChangeStageButton from '../buttons/ChangeStageButton';
import SubmitAnswerButton from '../buttons/SubmitAnswerButton';

export default function SingleplayerFooter() {
  const { value } = useAnswerStore();
  const { audio } = useAudioStore();
  const { currentPlayer, roomCode } = useRoomStore();

  useEffect(() => {
    if (!currentPlayer) return;
    toast({
      title: `You are currently playing multiplayer in ${roomCode} room`,
      description: `You can't play singleplayer while playing multiplayer. Please leave multiplayer room to play singleplayer.`,
      variant: 'destructive',
    });
  }, [currentPlayer]);

  return (
    <>
      <ChangeStageButton className="w-[12%] min-w-[130px]" />
      <VolumeSlider divClassName={'w-1/4 text-center'} />
      <SubmitAnswerButton className="w-[12%] min-w-[130px]" disabled={!value || !audio} />
    </>
  );
}
