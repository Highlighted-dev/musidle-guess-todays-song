'use client';
import { useAudioStore } from '@/stores/AudioStore';
import { useEffect } from 'react';

export default function AudioSetter({ songId }: { songId: string | undefined }) {
  const { setAudio, setSongId } = useAudioStore();
  useEffect(() => {
    if (typeof Audio === 'undefined' || !songId) return;
    setSongId(songId);
    setAudio(new Audio(`/music/${songId}.mp3`));
  }, [typeof Audio]);
  return null;
}
