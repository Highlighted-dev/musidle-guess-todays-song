import { create } from 'zustand';
import { Socket } from 'socket.io-client';
import { useRoomStore } from './RoomStore';
import { useAuthStore } from './AuthStore';
import { useAudioStore } from './AudioStore';
import { useAnswerStore } from './AnswerStore';
import { ISongs } from '@/@types/AnswerStore';
import { IPlayer } from '@/@types/Rooms';
import useTimerStore from './TimerStore';
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
    socket.on('updatePlayerList', (players: IPlayer[]) => {
      console.log('updatePlayerList', players);
      useRoomStore.setState({ players: players });
    });
    socket.on('togglePhaseOne', current_player => {
      if (useRoomStore.getState().currentPlayer?._id == useAuthStore.getState().user_id) return;
      if (useRoomStore.getState().isInLobby) {
        useRoomStore.getState().setCurrentPlayer(current_player);
      }
      useRoomStore.getState().setIsInLobby(false);
    });
    socket.on('skip', (time: number) => {
      if (useRoomStore.getState().currentPlayer?._id == useAuthStore.getState().user_id) return;
      useAudioStore.getState().setTime(time);
    });
    socket.on('chooseSong', (song_id: string) => {
      if (useRoomStore.getState().currentPlayer?._id == useAuthStore.getState().user_id) return;
      const setAudio = useAudioStore.getState().setAudio;
      const { setSelectMode } = useRoomStore.getState();

      setAudio(new Audio(`/music/${song_id}.mp3`));
      setSelectMode(true);
    });
    socket.on('handlePlay', () => {
      if (useRoomStore.getState().currentPlayer?._id == useAuthStore.getState().user_id) return;
      useAudioStore.getState().handlePlay();
    });
    socket.on('answerSubmit', (score: number, player: player, answer: string) => {
      if (useRoomStore.getState().currentPlayer?._id == useAuthStore.getState().user_id) return;
      useRoomStore.getState().updatePlayerScore(score, player);
      useAnswerStore.getState().setAnswer(answer);
      useAnswerStore.getState().handleAnswerSubmit();
    });
    socket.on('valueChange', (value: string) => {
      if (useRoomStore.getState().currentPlayer?._id == useAuthStore.getState().user_id) return;
      useAnswerStore.getState().handleValueChange(value);
    });
    socket.on('turnChange', () => {
      if (useRoomStore.getState().currentPlayer?._id == useAuthStore.getState().user_id) return;
      useRoomStore.getState().handleTurnChange();
    });
    socket.on('searchSong', (songs: ISongs[]) => {
      if (useRoomStore.getState().currentPlayer?._id == useAuthStore.getState().user_id) return;
      useAnswerStore.setState({ songs: songs });
    });
    socket.on('roomSettingsUpdate', (maxRoundsPhaseOne: number, maxRoundsPhaseTwo: number) => {
      if (useRoomStore.getState().currentPlayer?._id == useAuthStore.getState().user_id) return;
      useRoomStore.setState({
        maxRoundsPhaseOne: maxRoundsPhaseOne,
        maxRoundsPhaseTwo: maxRoundsPhaseTwo,
      });
    });
    socket.on('timerUpdate', (timer: number) => {
      useTimerStore.getState().setTimer(timer);
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
