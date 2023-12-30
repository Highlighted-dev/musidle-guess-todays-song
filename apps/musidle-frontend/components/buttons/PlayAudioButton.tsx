'use client';
import React from 'react';
import { Button } from '../ui/button';
import { useAudioStore } from '@/stores/AudioStore';

export default function PlayAudioButton({
  className,
  disabled = false,
}: {
  className?: string;
  disabled?: boolean;
}) {
  const { handlePlay, audioContext, audio } = useAudioStore();
  return (
    <Button onClick={handlePlay} className={className} disabled={!audio || disabled}>
      {audioContext?.state == 'running' ? 'Pause' : 'Play'}
    </Button>
  );
}
