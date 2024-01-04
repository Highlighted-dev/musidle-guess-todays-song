'use client';
import React from 'react';
import { Slider } from '../ui/slider';
import { Label } from '../ui/label';
import { cn } from '@/lib/utils';
import { useAudioStore } from '@/stores/AudioStore';
import { useRoomStore } from '@/stores/RoomStore';

export default function AudioProgress() {
  const { audioTime, time } = useAudioStore();
  const { stage } = useRoomStore();
  return (
    <div className="text-center py-4">
      <Slider
        value={[audioTime]}
        min={0}
        max={time / 1000}
        disabled
        className={cn('py-4', 'h-4')}
      />
      <Label>{`Stage ${stage}`}</Label>
    </div>
  );
}
