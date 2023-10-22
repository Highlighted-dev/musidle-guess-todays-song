import { create } from 'zustand';
import { useRoomStore } from './RoomStore';
import { useSocketStore } from './SocketStore';
import { useAudioStore } from './AudioStore';
import axios from 'axios';
import { useAnswerStore } from './AnswerStore';
import { useNextAuthStore } from './NextAuthStore';

interface IGameFinalStore {
  handleFinal: () => void;
  handleFinalAnswerSubmit: () => void;
}
//TODO remove phaseStore, move togglePhaseOne to RoomStore as startGame
export const useGameFinalStore = create<IGameFinalStore>(set => ({
  handleFinal: () => {
    const { socket } = useSocketStore.getState();
    const { players, setCurrentPlayer, room_code, handleChooseCategory } = useRoomStore.getState();
    const { setSongId, setAudio } = useAudioStore.getState();

    socket?.emit('handleFinal', room_code);
    if (useRoomStore.getState().currentPlayer) {
      //Get the player with the highest score
      const finalist = players.reduce((prev, current) =>
        prev.score > current.score ? prev : current,
      );
      setCurrentPlayer(finalist);
    }
    handleChooseCategory('final1', 3);
  },
  handleFinalAnswerSubmit: async () => {
    const { currentPlayer } = useRoomStore.getState();
    const session = useNextAuthStore.getState().session;
    const socket = useSocketStore.getState().socket;
    const { setAnswer, changeSongToCompleted } = useAnswerStore.getState();

    if (currentPlayer?._id == session?.user?._id) {
      await axios
        .post(`/externalApi/rooms/checkAnswer`, {
          room_code: useRoomStore.getState().room_code,
          player_id: currentPlayer._id,
          player_answer: useAnswerStore.getState().value,
          song_id: useAudioStore.getState().songId,
          time: useAudioStore.getState().time,
        })
        .then(res => res.data)
        .then(res => {
          setAnswer(res.data.answer || null);
          socket?.emit(
            'changeSongToCompleted',
            useRoomStore.getState().room_code,
            useAudioStore.getState().songId,
          );
          changeSongToCompleted(useAudioStore.getState().songId);
        });
    }
    if (useAudioStore.getState().audio) useAudioStore.getState().audio?.pause();
  },
}));
