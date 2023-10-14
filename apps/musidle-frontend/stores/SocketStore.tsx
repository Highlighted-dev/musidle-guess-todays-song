import { create } from 'zustand';
import { Socket } from 'socket.io-client';
import { useRoomStore } from './RoomStore';
import { useAuthStore } from './AuthStore';
import { useAudioStore } from './AudioStore';
import { useAnswerStore } from './AnswerStore';
import { IAnswer, ISong } from '@/@types/AnswerStore';
import { IPlayer } from '@/@types/Rooms';
import { useTimerStore } from '@/stores/TimerStore';
import { useGameFinalStore } from './GameFinalStore';

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
    if (
      !useRoomStore.getState().players.find(p => p._id === useAuthStore.getState().user_id) &&
      !useRoomStore.getState().spectators.find(p => p._id === useAuthStore.getState().user_id)
    )
      return;
    socket.on('updatePlayerList', (players: IPlayer[], spectators: IPlayer[]) => {
      useRoomStore.setState({ players: players });
      if (spectators) useRoomStore.setState({ spectators: spectators });
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
      const { setAudio, setSongId } = useAudioStore.getState();
      const setSelectMode = useRoomStore.getState().setSelectMode;

      const audio = new Audio(`/music/${song_id}.mp3`);
      setSongId(song_id);
      setAudio(audio);
      if (audio) {
        audio.volume = useAudioStore.getState().volume;
      }
      setSelectMode(true);
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
    socket.on('turnChange', current_player => {
      const {
        round,
        maxRoundsPhaseOne,
        maxRoundsPhaseTwo,
        setRound,
        setCurrentPlayer,
        setSelectMode,
        setTurnChangeDialogOpen,
      } = useRoomStore.getState();
      const { setValue, setAnswer, setPossibleAnswers } = useAnswerStore.getState();
      const { setAudioTime, setAudio, setTime, intervalId } = useAudioStore.getState();
      const { handleFinal } = useGameFinalStore.getState();

      setCurrentPlayer(current_player);
      setSelectMode(false);
      setTurnChangeDialogOpen(true);
      setTimeout(() => {
        useRoomStore.setState({ turnChangeDialogOpen: false });
        useAudioStore.getState().audio?.pause();
        if (intervalId !== null) clearInterval(intervalId);
        setTime(1000);
        setAudioTime(0);
        setAudio(null);
        setValue('');
        setAnswer('');
        setPossibleAnswers([
          {
            value: 'Songs will appear here',
            key: 'no-song',
          },
        ]);
      }, 4000);
      setRound(round + 1);
      if (!(useRoomStore.getState().round <= maxRoundsPhaseOne + maxRoundsPhaseTwo)) {
        handleFinal();
      }
    });
    socket.on('searchSong', (songs: IAnswer[]) => {
      useAnswerStore.setState({ possibleAnswers: songs });
    });
    socket.on('roomSettingsUpdate', (maxRoundsPhaseOne: number, maxRoundsPhaseTwo: number) => {
      if (useAuthStore.getState().role == 'admin') return;
      useRoomStore.setState({
        maxRoundsPhaseOne: maxRoundsPhaseOne,
        maxRoundsPhaseTwo: maxRoundsPhaseTwo,
      });
    });
    socket.on('timerUpdate', (timer: number) => {
      useTimerStore.getState().setTimer(timer);
    });
    socket.on('changeSongToCompleted', (song_id: string) => {
      useAnswerStore.getState().revealArtist(song_id);
      setTimeout(() => {
        useAudioStore.getState().setSongId(song_id);
        useAnswerStore.getState().changeSongToCompleted(song_id);
      }, 3000);
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
