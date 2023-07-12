import { create } from 'zustand';

interface ITimerStore {
  timer: number;
  setTimer: (timer: number) => void;
  isTimerRunning: boolean;
  setIsTimerRunning: (isTimerRunning: boolean) => void;
  timerIntervalId: NodeJS.Timeout | null;
  setTimerIntervalId: (timerIntervalId: NodeJS.Timeout | null) => void;
}

const useTimerStore = create<ITimerStore>(set => ({
  timer: 35.0,
  setTimer: (timer: number) =>
    set(() => ({
      timer: timer,
    })),
  isTimerRunning: false,
  setIsTimerRunning: (isTimerRunning: boolean) =>
    set(() => ({
      isTimerRunning: isTimerRunning,
    })),
  timerIntervalId: null,
  setTimerIntervalId: (timerIntervalId: NodeJS.Timeout | null) =>
    set(() => ({
      timerIntervalId: timerIntervalId,
    })),
}));
export default useTimerStore;
