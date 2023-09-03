import { create } from 'zustand';
import { Socket } from 'socket.io-client';
import { useRoomStore } from './RoomStore';
import { useAuthStore } from './AuthStore';
import { useAudioStore } from './AudioStore';
import { useAnswerStore } from './AnswerStore';
import { ISongs } from '@/@types/AnswerStore';
interface ISocketStore {
  socket: Socket | null;
  setSocket: (socket: Socket | null) => void;
}
type player = {
  _id: string;
  name: string;
  score: number;
};

export const useSocketStore = create<ISocketStore>(set => ({
  socket: null,
  setSocket: (socket: Socket | null) =>
    set(() => ({
      socket: socket,
    })),
}));

// Connect the socket and add event listeners
useSocketStore.subscribe(({ socket }) => {
  if (socket) {
    if (!useRoomStore.getState().players.find(p => p._id === useAuthStore.getState().user_id))
      return;
    socket.on('addPlayer', (player: player) => {
      const players = useRoomStore.getState().players;
      if (players.find(p => p._id === player._id)) return;
      useRoomStore.setState({ players: [...players, player] });
    });
    socket.on('togglePhaseOne', current_player => {
      if (useRoomStore.getState().isInLobby) {
        useRoomStore.getState().setCurrentPlayer(current_player);
      }
      useRoomStore.getState().setIsInLobby(false);
    });
    socket.on('skip', (time: number) => {
      useAudioStore.getState().setTime(time);
    });
    socket.on('chooseSong', (song_id: string) => {
      const setAudio = useAudioStore.getState().setAudio;
      const { setRenderGame, renderGame } = useRoomStore.getState();

      setAudio(new Audio(`/music/${song_id}.mp3`));
      setRenderGame(!renderGame);
    });
    socket.on('handlePlay', () => {
      useAudioStore.getState().handlePlay();
    });
    socket.on('answerSubmit', (score: number, player: player, answer: string) => {
      useRoomStore.getState().updatePlayerScore(score, player);
      useAnswerStore.getState().setAnswer(answer);
      useAnswerStore.getState().handleAnswerSubmit();
    });
    socket.on('valueChange', (value: string) => {
      useAnswerStore.getState().handleValueChange(value);
    });
    socket.on('turnChange', () => {
      useRoomStore.getState().handleTurnChange();
    });
    socket.on('searchSong', (songs: ISongs[]) => {
      useAnswerStore.setState({ songs: songs });
    });
    socket.on('roomSettingsUpdate', (maxRoundsPhaseOne: number, maxRoundsPhaseTwo: number) => {
      useRoomStore.setState({
        maxRoundsPhaseOne: maxRoundsPhaseOne,
        maxRoundsPhaseTwo: maxRoundsPhaseTwo,
      });
    });

    return () => {
      socket.off('handlePlay');
      socket.off('answerSubmit');
      socket.off('valueChange');
      socket.off('turnChange');
      socket.off('searchSong');
    };
  }
});
