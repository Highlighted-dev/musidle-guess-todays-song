'use client';
import { create } from 'zustand';
import { useSocketStore } from './SocketStore';
import { useRoomStore } from './RoomStore';
import { useTimerStore } from './TimerStore';
import { useNextAuthStore } from './NextAuthStore';

interface IAudioStore {
  audioContext: AudioContext | null;
  audio: AudioBufferSourceNode | null;
  arrayBuffer: ArrayBuffer | null;
  setAudio: (audio: AudioBufferSourceNode | null) => void;
  audioStartTime: number;
  time: number;
  setTime: (time: number) => void;
  audioTime: number;
  setAudioTime: (audioTime: number) => void;
  intervalId: NodeJS.Timeout | null;
  setIntervalId: (intervaldId: NodeJS.Timeout | null) => void;
  songId: string;
  setSongId: (songId: string) => void;
  handleAudioTimeUpdate: () => void;
  changeStage: () => void;
  handlePlay: () => void;
}

export const useAudioStore = create<IAudioStore>(set => ({
  audioContext: null,
  audio: null,
  arrayBuffer: null,
  setAudio: (audio: AudioBufferSourceNode | null) => {
    // if (audio) {
    //   audio.volume = useAudioStore.getState().volume;
    // }
    set(() => ({
      audio: audio,
    }));
  },
  audioStartTime: 0,
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
    const { audioContext } = useAudioStore.getState();
    if (!audioContext) return;
    const currentTime = audioContext.currentTime;
    useAudioStore.getState().setAudioTime(currentTime);
  },
  changeStage: () => {
    if (useRoomStore.getState().stage >= 4) return;
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
    useRoomStore.setState({ stage: useRoomStore.getState().stage + 1 });
    if (
      useSocketStore.getState().socket &&
      useRoomStore.getState().currentPlayer?.id == useNextAuthStore.getState().session?.user?.id
    )
      useSocketStore.getState().socket!.emit('changeStage', useRoomStore.getState().roomCode);
  },
  handlePlay: async () => {
    const { audio, audioContext } = useAudioStore.getState();
    const { maxRoundsPhaseOne, maxRoundsPhaseTwo } = useRoomStore.getState();
    const session = useNextAuthStore.getState().session;
    if (!audio || !audioContext) return;
    if (
      useRoomStore.getState().currentPlayer?.id == session?.user.id &&
      useSocketStore.getState().socket
    ) {
      useSocketStore
        .getState()
        .socket!.emit(
          'handlePlay',
          useRoomStore.getState().roomCode,
          useTimerStore.getState().timer,
        );
    }

    const getCurrentTime = () => {
      return audioContext.currentTime;
    };

    audio.context.state === 'suspended' ? audioContext.resume() : audioContext.suspend();

    if (useAudioStore.getState().intervalId) clearInterval(useAudioStore.getState().intervalId!); // Clear the previous interval
    const newIntervalId = setInterval(() => {
      useAudioStore.getState().handleAudioTimeUpdate();
      if (getCurrentTime() >= useAudioStore.getState().time / 1000) {
        const newAudioContext = new AudioContext();
        audio.stop();
        const gainNode = newAudioContext.createGain();
        gainNode.gain.value = session?.user.settings?.volume ?? 0.25;
        gainNode.connect(newAudioContext.destination);

        const newAudio = newAudioContext!.createBufferSource();
        newAudio.buffer = audio.buffer;
        newAudio.connect(gainNode);

        newAudio.start();
        newAudioContext.suspend();
        useAudioStore.setState({
          audio: newAudio,
          audioContext: newAudioContext,
        });
        clearInterval(newIntervalId);
      }
      if (
        audioContext.state === 'suspended' &&
        !(useRoomStore.getState().round <= maxRoundsPhaseOne + maxRoundsPhaseTwo)
      ) {
        clearInterval(newIntervalId);
      }
    }, 200);
    useAudioStore.getState().setIntervalId(newIntervalId);
  },
}));
