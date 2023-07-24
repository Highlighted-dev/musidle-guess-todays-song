import { create } from 'zustand';
import { useRoomStore } from './RoomStore';
import { useAuthStore } from './AuthStore';
import { useSocketStore } from './SocketStore';
import useTimerStore from './TimerStore';
import { useAudioStore } from './AudioStore';

export interface ISongs {
  value: string;
  label: string;
  key: string;
}

interface IAnswerStore {
  answer: string;
  setAnswer: (answer: string) => void;
  value: string;
  setValue: (value: string) => void;
  songs: ISongs[];
  setSongs: (songs: ISongs[]) => void;
  answerDialogOpen: boolean;
  setAnswerDialogOpen: (answerDialogOpen: boolean) => void;
  handleValueChange: (value: string) => void;
  handleAnswerSubmit: () => void;
}

export const useAnswerStore = create<IAnswerStore>(set => ({
  answer: '',
  setAnswer: (answer: string) =>
    set(() => ({
      answer: answer,
    })),
  value: '',
  setValue: (value: string) =>
    set(() => ({
      value: value,
    })),
  songs: [
    {
      value: 'Songs will appear here',
      label: 'Songs will appear here',
      key: 'no-song',
    },
  ],
  setSongs: (songs: ISongs[]) =>
    set(() => ({
      songs: songs,
    })),
  handleValueChange: (value: string) => {
    if (useRoomStore.getState().currentPlayer?._id == useAuthStore.getState().user_id) {
      useSocketStore.getState().socket?.emit('valueChange', value);
    }
    useAnswerStore.setState({ value: value });
  },
  answerDialogOpen: false,
  setAnswerDialogOpen: (answerDialogOpen: boolean) =>
    set(() => ({
      answerDialogOpen: answerDialogOpen,
    })),
  handleAnswerSubmit: () => {
    const current_player = useRoomStore.getState().currentPlayer;
    const user_id = useAuthStore.getState().user_id;
    const socket = useSocketStore.getState().socket;

    if (!current_player) return;
    useAnswerStore.setState({ answerDialogOpen: !useAnswerStore.getState().answerDialogOpen });
    if (useTimerStore.getState().timerIntervalId !== null)
      clearInterval(useTimerStore.getState().timerIntervalId!);
    useTimerStore.getState().setIsTimerRunning(false);
    useTimerStore.getState().setTimer(35.0);
    if (useAudioStore.getState().audio) useAudioStore.getState().audio?.pause();
    let points = 0;
    if (
      useAnswerStore.getState().value &&
      useAnswerStore.getState().value.toLowerCase() ==
        useAnswerStore.getState().answer.toLowerCase()
    ) {
      switch (useAudioStore.getState().time) {
        case 1000:
          points = 500;
          break;
        case 3000:
          points = 400;
          break;
        case 6000:
          points = 300;
          break;
        case 12000:
          points = 100;
          break;
        default:
          points = 0;
      }
    }
    useRoomStore.getState().updatePlayerScore(points, current_player);
    if (current_player?._id == user_id) {
      socket?.emit('answerSubmit', points, current_player);
    }
  },
}));
