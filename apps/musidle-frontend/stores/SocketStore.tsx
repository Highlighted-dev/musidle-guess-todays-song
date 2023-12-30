'use client';
import { create } from 'zustand';
import { Socket } from 'socket.io-client';
import { useRoomStore } from './RoomStore';
import { useAudioStore } from './AudioStore';
import { useAnswerStore } from './AnswerStore';
import { IAnswer } from '@/@types/AnswerStore';
import { IPlayer } from '@/@types/Rooms';
import { useTimerStore } from '@/stores/TimerStore';
import { useGameFinalStore } from './GameFinalStore';
import { useNextAuthStore } from './NextAuthStore';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

interface ISocketStore {
  socket: Socket | null;
  setSocket: (socket: Socket | null) => void;
  url: string;
  router: AppRouterInstance | null;
}
export const useSocketStore = create<ISocketStore>(set => ({
  socket: null,
  setSocket: (socket: Socket | null) =>
    set(() => ({
      socket: socket,
    })),
  url:
    process.env.NODE_ENV == 'production'
      ? process.env.NEXT_PUBLIC_API_HOST || 'http://localhost:4200'
      : 'http://localhost:4200',
  router: null,
}));

// Connect the socket and add event listeners
useSocketStore.subscribe(async ({ socket }) => {
  if (socket) {
    const { _id: userId, role } = useNextAuthStore.getState().session?.user || {};
    if (
      !useRoomStore.getState().players.find(p => p._id === userId) &&
      !useRoomStore.getState().spectators.find(p => p._id === userId)
    )
      return;
    socket.on('updatePlayerList', (players: IPlayer[], spectators: IPlayer[]) => {
      useRoomStore.setState({ players: players });
      if (spectators) useRoomStore.setState({ spectators: spectators });
    });
    socket.on('togglePhaseOne', currentPlayer => {
      if (useRoomStore.getState().isInLobby) {
        useRoomStore.getState().setCurrentPlayer(currentPlayer);
      }
      useRoomStore.getState().setIsInLobby(false);
    });
    socket.on('skip', (time: number) => {
      useAudioStore.getState().setTime(time);
    });
    socket.on('chooseSong', (songId: string, phase: number) => {
      const { setAudio, setSongId } = useAudioStore.getState();
      const setSelectMode = useRoomStore.getState().setSelectMode;
      if (phase == 3) useAudioStore.getState().audioContext?.suspend();
      setSongId(songId);
      // if (audio) {
      //   audio.volume = useAudioStore.getState().volume;
      // }
      if (phase != 3) {
        setSelectMode(true);
      }
      useRoomStore.getState().setIsInLobby(false);

      useSocketStore.getState().router?.refresh();
    });
    socket.on('handlePlay', () => {
      useAudioStore.getState().handlePlay();
    });
    socket.on('answerSubmit', (score: number, player: IPlayer, answer: string) => {
      useRoomStore.getState().updatePlayerScore(score, player);
      useAnswerStore.getState().setAnswer(answer);
      useAnswerStore.getState().handleAnswerSubmit();
    });
    socket.on('valueChange', (value: string) => {
      useAnswerStore.setState({ value: value });
    });
    socket.on('turnChange', currentPlayer => {
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

      setCurrentPlayer(currentPlayer);
      setSelectMode(false);
      setTurnChangeDialogOpen(true);
      useRoomStore.getState().votesForTurnSkip = 0;
      setTimeout(() => {
        useRoomStore.setState({ turnChangeDialogOpen: false });
        useAudioStore.getState().audioContext?.suspend();
        if (intervalId !== null) clearInterval(intervalId);
        setTime(1000);
        setAudioTime(0);
        if (useRoomStore.getState().round <= maxRoundsPhaseOne + maxRoundsPhaseTwo) setAudio(null);
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
    socket.on(
      'roomSettingsUpdate',
      (maxRoundsPhaseOne: number, maxRoundsPhaseTwo: number, maxTimer: number) => {
        if (role == 'admin') return;
        useRoomStore.setState({
          maxRoundsPhaseOne: maxRoundsPhaseOne,
          maxRoundsPhaseTwo: maxRoundsPhaseTwo,
        });
        useTimerStore.setState({ maxTimer: maxTimer });
      },
    );
    socket.on('timerUpdate', (timer: number) => {
      useTimerStore.getState().setTimer(timer);
    });
    socket.on(
      'changeSongToCompleted',
      (songId: string, answer: string, score: number, player: IPlayer) => {
        useAnswerStore.getState().revealArtist(songId);
        // Basically, if this is final round, we don't want to change the song and have the player wait for 3 seconds. The timeout is only for phase 2
        if (answer) {
          useRoomStore.getState().updatePlayerScore(score, player);
          useAnswerStore.getState().setAnswer(answer);
          useAnswerStore.getState().changeSongToCompleted(songId);
          return;
        }
        setTimeout(() => {
          useAudioStore.getState().setSongId(songId);
          useAnswerStore.getState().changeSongToCompleted(songId);
        }, 3000);
      },
    );
    socket.on('voteForTurnSkip', () => {
      useRoomStore.getState().votesForTurnSkip++;
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
