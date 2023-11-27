'use client';
import React from 'react';
import { Slider } from './ui/slider';
import { Label } from './ui/label';
import { cn } from '@/lib/utils';
import { useAudioStore } from '@/stores/AudioStore';

export default function AudioProgress({ maxTime }: { maxTime: number }) {
  const { audioTime } = useAudioStore();
  return (
    <div className="text-center py-4">
      <Slider
        value={[audioTime]}
        min={0}
        max={maxTime / 1000}
        disabled
        className={cn('py-4', 'h-4')}
      />
      <Label>
        {
          {
            1: 'Stage 1',
            3: 'Stage 2',
            6: 'Stage 3',
            12: 'Stage 4',
          }[maxTime / 1000]
        }
      </Label>
    </div>
  );
}
