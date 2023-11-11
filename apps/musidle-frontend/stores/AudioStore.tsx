import { create } from 'zustand';
import { useSocketStore } from './SocketStore';
import { useRoomStore } from './RoomStore';
import { useTimerStore } from '@/stores/TimerStore';
import { useNextAuthStore } from '@/stores/NextAuthStore';

interface IAudioStore {
  audio: HTMLAudioElement | null;
  setAudio: (audio: HTMLAudioElement | null) => void;
  time: number;
  setTime: (time: number) => void;
  audioTime: number;
  setAudioTime: (audioTime: number) => void;
  volume: number;
  setVolume: (volume: number) => void;
  intervalId: NodeJS.Timeout | null;
  setIntervalId: (intervaldId: NodeJS.Timeout | null) => void;
  songId: string;
  setSongId: (songId: string) => void;
  handleAudioTimeUpdate: () => void;
  handleSkip: () => void;
  handlePlay: () => void;
}

export const useAudioStore = create<IAudioStore>(set => ({
  audio: null,
  setAudio: (audio: HTMLAudioElement | null) =>
    set(() => ({
      audio: audio,
    })),
  time: 1000,
  setTime: (time: number) =>
    set(() => ({
      time: time,
    })),
  audioTime: 0,
  setAudioTime: (audioTime: number) =>
    set(() => ({
      audioTime: audioTime,
    })),
  volume: 0.25,
  setVolume: (volume: number) =>
    set(() => ({
      volume: volume,
    })),
  intervalId: null,
  setIntervalId: (intervalId: NodeJS.Timeout | null) =>
    set(() => ({
      intervalId: intervalId,
    })),
  songId: '',
  setSongId: (songId: string) =>
    set(() => ({
      songId: songId,
    })),
  handleAudioTimeUpdate: () => {
    if (!useAudioStore.getState().audio) return;
    useAudioStore.getState().setAudioTime(useAudioStore.getState().audio!.currentTime);
  },
  handleSkip: () => {
    // let temporary_time: number = useAudioStore.getState().time;
    switch (useAudioStore.getState().time) {
      case 1000:
        useAudioStore.setState({ time: 3000 });
        break;
      case 3000:
        useAudioStore.setState({ time: 6000 });
        break;
      case 6000:
        useAudioStore.setState({ time: 12000 });
        break;
      case 12000:
        break;
      default:
        useAudioStore.setState({ time: 1000 });
    }
    useSocketStore
      .getState()
      .socket?.emit('skip', useAudioStore.getState().time, useRoomStore.getState().roomCode);
  },
  handlePlay: async () => {
    const { audio } = useAudioStore.getState();
    const { maxRoundsPhaseOne, maxRoundsPhaseTwo } = useRoomStore.getState();
    const session = useNextAuthStore.getState().session;
    if (!audio) return;
    if (useRoomStore.getState().currentPlayer?._id == session?.user._id) {
      useSocketStore
        .getState()
        .socket?.emit(
          'handlePlay',
          useRoomStore.getState().roomCode,
          useTimerStore.getState().timer,
        );
    }

    if (audio.currentTime >= useAudioStore.getState().time / 1000) audio.currentTime = 0;

    audio.paused ? audio.play() : audio.pause();
    if (useAudioStore.getState().intervalId) clearInterval(useAudioStore.getState().intervalId!); // Clear the previous interval
    const newIntervalId = setInterval(() => {
      if (audio.currentTime >= useAudioStore.getState().time / 1000) {
        audio.pause();
        clearInterval(newIntervalId);
      }
      if (
        audio.paused &&
        !(useRoomStore.getState().round <= maxRoundsPhaseOne + maxRoundsPhaseTwo)
      ) {
        clearInterval(newIntervalId);
      }
    }, 10);
    useAudioStore.getState().setIntervalId(newIntervalId);
  },
}));

useAudioStore.subscribe(({ audio }) => {
  if (!audio) return;
  audio.addEventListener('timeupdate', useAudioStore.getState().handleAudioTimeUpdate);
  return () => {
    audio.removeEventListener('timeupdate', useAudioStore.getState().handleAudioTimeUpdate);
  };
});
