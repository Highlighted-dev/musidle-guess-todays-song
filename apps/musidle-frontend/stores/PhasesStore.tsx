import { create } from 'zustand';
import { useRoomStore } from './RoomStore';
import { useSocketStore } from './SocketStore';
import { useAudioStore } from './AudioStore';
import { useAnswerStore } from './AnswerStore';

interface IPhasesStore {
  random: number;
  hasPhaseOneStarted: boolean;
  setHasPhaseOneStarted: (hasPhaseOneStarted: boolean) => void;
  hasPhaseTwoStarted: boolean;
  setHasPhaseTwoStarted: (hasPhaseTwoStarted: boolean) => void;
  hasPhaseThreeStarted: boolean;
  setHasPhaseThreeStarted: (hasPhaseThreeStarted: boolean) => void;
  togglePhaseOne: () => void;
  handleFinal: () => void;
}

export const usePhaseStore = create<IPhasesStore>(set => ({
  random: 0,
  hasPhaseOneStarted: false,
  setHasPhaseOneStarted: (hasPhaseOneStarted: boolean) =>
    set(() => ({
      hasPhaseOneStarted: hasPhaseOneStarted,
    })),
  hasPhaseTwoStarted: false,
  setHasPhaseTwoStarted: (hasPhaseTwoStarted: boolean) =>
    set(() => ({
      hasPhaseTwoStarted: hasPhaseTwoStarted,
    })),
  hasPhaseThreeStarted: false,
  setHasPhaseThreeStarted: (hasPhaseThreeStarted: boolean) =>
    set(() => ({
      hasPhaseThreeStarted: hasPhaseThreeStarted,
    })),
  togglePhaseOne: () => {
    const { socket } = useSocketStore.getState();

    usePhaseStore.getState().random = Math.floor(
      Math.random() * useRoomStore.getState().players.length,
    );
    const current_player = useRoomStore.getState().players[usePhaseStore.getState().random];

    socket?.emit('togglePhaseOne', current_player, useRoomStore.getState().room_code);
    if (!usePhaseStore.getState().hasPhaseOneStarted) {
      useRoomStore.setState({ currentPlayer: current_player });
    }
    useRoomStore.getState().setIsInLobby(false);
  },
  handleFinal: () => {
    const { socket } = useSocketStore.getState();
    const { players, setCurrentPlayer, room_code } = useRoomStore.getState();
    const { setAudio } = useAudioStore.getState();

    socket?.emit('handleFinal', room_code);
    if (useRoomStore.getState().currentPlayer) {
      //Get the player with the highest score
      const finalist = players.reduce((prev, current) =>
        prev.score > current.score ? prev : current,
      );
      setCurrentPlayer(finalist);
    }
    setAudio(new Audio(`/music/final1.mp3`));
    useAnswerStore.setState({ answer: 'Payphone - Maroon 5' });
  },
}));
