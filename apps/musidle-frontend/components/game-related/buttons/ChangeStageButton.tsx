'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { useAudioStore } from '@/stores/AudioStore';

export default function ChangeStageButton({
  className,
  disabled = false,
}: {
  className?: string;
  disabled?: boolean;
}) {
  const { changeStage, audioContext } = useAudioStore();
  return (
    <Button
      variant={'secondary'}
      onClick={() => changeStage()}
      className={className}
      disabled={disabled || !audioContext}
    >
      Change Stage
    </Button>
  );
}
