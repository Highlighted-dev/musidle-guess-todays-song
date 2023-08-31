import { create } from 'zustand';
import { useRoomStore } from './RoomStore';
import { useSocketStore } from './SocketStore';
import { useAudioStore } from './AudioStore';
import { useAuthStore } from './AuthStore';
import axios from 'axios';
import { useAnswerStore } from './AnswerStore';

interface IGameFinalStore {
  completedSongs: string[];
  setCompletedSongs: (completedSongs: string[]) => void;
  handleFinal: () => void;
  handleFinalAnswerSubmit: () => void;
}
//TODO remove phaseStore, move togglePhaseOne to RoomStore as startGame
export const useGameFinalStore = create<IGameFinalStore>(set => ({
  completedSongs: [],
  setCompletedSongs: (completedSongs: string[]) =>
    set(() => ({
      completedSongs: completedSongs,
    })),
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
    const user_id = useAuthStore.getState().user_id;
    const socket = useSocketStore.getState().socket;

    if (currentPlayer?._id == user_id) {
      await axios
        .post(`/api/rooms/checkAnswer`, {
          room_code: useRoomStore.getState().room_code,
          player_id: currentPlayer._id,
          player_answer: useAnswerStore.getState().value,
          song_id: useAudioStore.getState().songId,
          time: useAudioStore.getState().time,
        })
        .then(res => res.data)
        .then(res => {
          useAnswerStore.getState().setAnswer(res.data.answer || null);
          if (res.data.score > 0) {
            useGameFinalStore.setState({
              completedSongs: [
                ...useGameFinalStore.getState().completedSongs,
                useAudioStore.getState().songId,
              ],
            });
          }
          // useRoomStore.getState().updatePlayerScore(res.data.score, currentPlayer);
          // socket?.emit('answerSubmit', res.data.score, currentPlayer, res.data.answer, room_code);
        });
    }
    if (useAudioStore.getState().audio) useAudioStore.getState().audio?.pause();
  },
}));
