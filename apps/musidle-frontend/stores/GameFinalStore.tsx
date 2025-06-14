'use client';
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
export const useGameFinalStore = create<IGameFinalStore>(set => ({
  handleFinal: () => {
    const { socket } = useSocketStore.getState();
    const { players, setCurrentPlayer, roomCode, handleChooseCategory } = useRoomStore.getState();
    const { possibleSongs } = useAnswerStore.getState();

    socket?.emit('handleFinal', roomCode);
    if (useRoomStore.getState().currentPlayer) {
      //Get the player with the highest score
      const finalist = players.reduce((prev, current) =>
        prev.score > current.score ? prev : current,
      );
      setCurrentPlayer(finalist);
    }
    handleChooseCategory(
      possibleSongs.find(song => song.songId.includes('final'))?.songId || 'final1',
      3,
    );
  },
  handleFinalAnswerSubmit: async () => {
    const { currentPlayer } = useRoomStore.getState();
    if (!currentPlayer) return;
    const session = useNextAuthStore.getState().session;
    const socket = useSocketStore.getState().socket;
    const { setAnswer, changeSongToCompleted } = useAnswerStore.getState();

    if (currentPlayer?.id == session?.user?.id) {
      await axios
        .post(`/externalApi/rooms/checkAnswer`, {
          roomCode: useRoomStore.getState().roomCode,
          playerId: currentPlayer?.id,
          playerAnswer: useAnswerStore.getState().value,
          songId: useAudioStore.getState().songId,
          time: useAudioStore.getState().time,
        })
        .then(res => res.data)
        .then(res => {
          setAnswer(res.answer || null);
          useRoomStore.getState().updatePlayerScore(res.score, currentPlayer);
          socket?.emit(
            'changeSongToCompleted',
            useRoomStore.getState().roomCode,
            useAudioStore.getState().songId,
            res.answer,
            res.score,
            currentPlayer,
          );
          changeSongToCompleted(useAudioStore.getState().songId);
        });
    }
    if (useAudioStore.getState().audioContext) useAudioStore.getState().audioContext?.suspend();
  },
}));
