'use client';
import { create } from 'zustand';
import { useAnswerStore } from './AnswerStore';
import { useRoomStore } from './RoomStore';
import { useNextAuthStore } from './NextAuthStore';

interface ITimerStore {
  timer: number;
  setTimer: (timer: number) => void;
  maxTimer: number;
}

export const useTimerStore = create<ITimerStore>(set => ({
  timer: 35.0,
  setTimer: (timer: number) =>
    set(() => ({
      timer: timer,
    })),
  maxTimer: 35.0,
}));

useTimerStore.subscribe(async ({ timer }) => {
  const { handleAnswerSubmit } = useAnswerStore.getState();
  const { setTimer } = useTimerStore.getState();
  const session = useNextAuthStore.getState().session;
  if (timer <= 0 && useRoomStore.getState().currentPlayer?._id == session?.user?._id) {
    setTimer(useTimerStore.getState().maxTimer);
    handleAnswerSubmit();
  }
});
