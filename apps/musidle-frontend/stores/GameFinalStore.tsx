import { create } from 'zustand';
import { useRoomStore } from './RoomStore';
import { useSocketStore } from './SocketStore';
import { useAudioStore } from './AudioStore';

interface IGameFinalStore {
  handleFinal: () => void;
}
//TODO remove phaseStore, move togglePhaseOne to RoomStore as startGame
export const useGameFinalStore = create<IGameFinalStore>(set => ({
  handleFinal: () => {
    const { socket } = useSocketStore.getState();
    const { players, setCurrentPlayer, room_code } = useRoomStore.getState();
    const { setSongId, setAudio } = useAudioStore.getState();

    socket?.emit('handleFinal', room_code);
    if (useRoomStore.getState().currentPlayer) {
      //Get the player with the highest score
      const finalist = players.reduce((prev, current) =>
        prev.score > current.score ? prev : current,
      );
      setCurrentPlayer(finalist);
    }
    const song_id = 'final1';
    setSongId(song_id);
    setAudio(new Audio(`/music/${song_id}.mp3`));
  },
}));
