import { create } from 'zustand';
import { useAnswerStore } from './AnswerStore';
import { useRoomStore } from './RoomStore';
import { useAuthStore } from './AuthStore';
import { useSocketStore } from './SocketStore';

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
  const { socket } = useSocketStore.getState();
  if (isTimerRunning && timerIntervalId === null) {
    const newIntervalId = setInterval(() => {
      if (useRoomStore.getState().currentPlayer?._id == useAuthStore.getState().user_id) {
        socket?.emit(
          'timerUpdate',
          useRoomStore.getState().room_code,
          useTimerStore.getState().timer - 1,
        );
      }
      setTimer(useTimerStore.getState().timer - 1);
      if (useTimerStore.getState().timer <= 0) {
        clearInterval(newIntervalId);
        setTimer(35);
        if (useRoomStore.getState().currentPlayer?._id == useAuthStore.getState().user_id)
          handleAnswerSubmit();
        setIsTimerRunning(false);
        return;
      }
    }, 1000);

    setTimerIntervalId(newIntervalId); // Set the new interval ID
  } else if (!isTimerRunning && timerIntervalId !== null) {
    clearInterval(timerIntervalId);
    setTimerIntervalId(null); // Clear the interval ID
  }
});

export default useTimerStore;
