import { create } from 'zustand';
import { useAnswerStore } from './AnswerStore';

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

useTimerStore.subscribe(({ isTimerRunning, timerIntervalId }) => {
  const { setTimer, setTimerIntervalId, setIsTimerRunning } = useTimerStore.getState();
  const { handleAnswerSubmit } = useAnswerStore.getState();

  if (isTimerRunning && timerIntervalId === null) {
    const newIntervalId = setInterval(() => {
      if (useTimerStore.getState().timer <= 0) {
        clearInterval(newIntervalId);
        setTimer(35);
        handleAnswerSubmit();
        setIsTimerRunning(false);
        return;
      }
      setTimer(useTimerStore.getState().timer - 0.1);
    }, 100);

    setTimerIntervalId(newIntervalId); // Set the new interval ID
  } else if (!isTimerRunning && timerIntervalId !== null) {
    clearInterval(timerIntervalId);
    setTimerIntervalId(null); // Clear the interval ID
  }
});

export default useTimerStore;
