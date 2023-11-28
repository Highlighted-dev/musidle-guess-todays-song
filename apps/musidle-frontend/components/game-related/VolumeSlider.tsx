'use client';
import React from 'react';
import { Slider } from '../ui/slider';
import { useAudioStore } from '@/stores/AudioStore';
import { Label } from '../ui/label';

export default function VolumeSlider({
  divClassName,
  sliderClassName,
}: {
  divClassName: string;
  sliderClassName?: string;
}) {
  const { volume, audio } = useAudioStore.getState();
  return (
    <div className={divClassName}>
      <Slider
        onValueChange={value => (audio ? (audio.volume = value[0] / 100) : null)}
        min={0}
        max={100}
        step={1}
        defaultValue={[volume * 100 || 100]}
        className={sliderClassName || 'py-4 h-4'}
      />
      <Label>Volume</Label>
    </div>
  );
}
