'use client';
import React from 'react';
import { Button } from '../ui/button';
import { useAudioStore } from '@/stores/AudioStore';

export default function PlayAudioButton({
  className,
  disabled,
}: {
  className?: string;
  disabled?: boolean;
}) {
  const { audio, handlePlay } = useAudioStore();
  return (
    <Button onClick={handlePlay} className={className} disabled={!audio && disabled}>
      {!audio || audio.paused ? 'Play' : 'Pause'}
    </Button>
  );
}
