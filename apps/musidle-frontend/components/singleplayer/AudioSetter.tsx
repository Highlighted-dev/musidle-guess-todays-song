'use client';
import { useAudioStore } from '@/stores/AudioStore';
import { useEffect } from 'react';

export default function AudioSetter() {
  const { setAudio } = useAudioStore();
  useEffect(() => {
    if (typeof Audio === 'undefined') return;
    setAudio(new Audio('/music/80s-90s7.aac'));
  }, [typeof Audio]);
  return null;
}
