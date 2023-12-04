'use client';
import React from 'react';
import { Button } from '../ui/button';
import { useAudioStore } from '@/stores/AudioStore';

export default function ChangeStageButton({
  className,
  disabled = false,
}: {
  className?: string;
  disabled?: boolean;
}) {
  const { handleSkip, audio } = useAudioStore();
  return (
    <Button
      variant={'outline'}
      onClick={() => handleSkip()}
      className={className}
      disabled={disabled || !audio}
    >
      Change Stage
    </Button>
  );
}
