import { create } from 'zustand';
import { useAnswerStore } from './AnswerStore';
import { useRoomStore } from './RoomStore';
import { useAuthStore } from './AuthStore';

interface ITimerStore {
  timer: number;
  setTimer: (timer: number) => void;
}

export const useTimerStore = create<ITimerStore>(set => ({
  timer: 35.0,
  setTimer: (timer: number) =>
    set(() => ({
      timer: timer,
    })),
}));

useTimerStore.subscribe(({ timer }) => {
  const { handleAnswerSubmit } = useAnswerStore.getState();
  const { setTimer } = useTimerStore.getState();
  if (timer <= 0 && useRoomStore.getState().currentPlayer?._id == useAuthStore.getState().user_id) {
    setTimer(35);
    handleAnswerSubmit();
  }
});
