import axios from 'axios';
import { create } from 'zustand';
import { useAuthStore } from './AuthStore';
import { IRoomStore, IPlayer } from '@/@types/Rooms';
import { useSocketStore } from './SocketStore';
import { io } from 'socket.io-client';
import { useAnswerStore } from './AnswerStore';
import { useAudioStore } from './AudioStore';
import { toast } from '@/components/ui/use-toast';
import { useGameFinalStore } from './GameFinalStore';
import useTimerStore from './TimerStore';
import { Router } from 'next/router';
import dotenv from 'dotenv';
dotenv.config();

export const useRoomStore = create<IRoomStore>(set => ({
  room_code: '',
  setRoomCode: (room_code: string) =>
    set(() => ({
      room_code: room_code,
    })),
  players: [],
  setPlayers: (players: IPlayer[]) =>
    set(() => ({
      players: players,
    })),
  round: 1,
  setRound: (round: number) =>
    set(() => ({
      round: round,
    })),
  maxRoundsPhaseOne: 2,
  setMaxRoundsPhaseOne: (maxRoundsPhaseOne: number) =>
    set(() => ({
      maxRoundsPhaseOne: maxRoundsPhaseOne,
    })),
  maxRoundsPhaseTwo: 2,
  setMaxRoundsPhaseTwo: (maxRoundsPhaseTwo: number) =>
    set(() => ({
      maxRoundsPhaseTwo: maxRoundsPhaseTwo,
    })),

  isInLobby: false,
  setIsInLobby: (isInLobby: boolean) =>
    set(() => ({
      isInLobby: isInLobby,
    })),
  currentPlayer: null,
  setCurrentPlayer: (player: IPlayer) =>
    set(() => ({
      currentPlayer: player,
    })),
  selectMode: false,
  setSelectMode: (selectMode: boolean) =>
    set(() => ({
      selectMode: selectMode,
    })),
  turnChangeDialogOpen: false,
  setTurnChangeDialogOpen: (turnChangeDialogOpen: boolean) =>
    set(() => ({
      turnChangeDialogOpen: turnChangeDialogOpen,
    })),
  random: 0,
  joinRoom: async (room_code: string) => {
    const { setAudio, setSongId } = useAudioStore.getState();
    const { setTimer } = useTimerStore.getState();
    if (useAuthStore.getState().user_id) {
      const { data } = await axios.post(`/api/rooms/join`, {
        room_id: room_code,
        player: {
          _id: useAuthStore.getState().user_id,
          name: useAuthStore.getState().username,
          score: 0,
        },
      });
      set(() => ({
        room_code: room_code,
        players: data.players,
        currentPlayer: data.current_player,
        maxRoundsPhaseOne: data.maxRoundsPhaseOne,
        maxRoundsPhaseTwo: data.maxRoundsPhaseTwo,
        round: data.round,
        isInLobby: data.isInGameLobby,
        selectMode: !data.isInSelectMode,
      }));
      setTimer(data.timer);
      setSongId(data.song_id);
      setAudio(new Audio(`/music/${data.song_id}.mp3`));
      //set socket the to the room
      if (!useSocketStore.getState().socket) {
        useSocketStore
          .getState()
          .setSocket(
            io(
              process.env.NODE_ENV == 'production'
                ? process.env.NEXT_PUBLIC_API_HOST ?? 'http://localhost:5000'
                : 'http://localhost:5000',
            ),
          );
      }
      useSocketStore.getState().socket?.emit('id', useAuthStore.getState().user_id, room_code);
      return;
      // router.push(`/multiplayer/${room_id}`);
    }
  },
  createRoom: async () => {
    if (useAuthStore.getState().user_id) {
      const { data } = await axios.post(`/api/rooms/create`, {
        player: {
          _id: useAuthStore.getState().user_id,
          name: useAuthStore.getState().username,
          score: 0,
        },
      });
      set(() => ({
        room_code: data.room_code,
        players: data.players,
        currentPlayer: data.current_player,
        maxRoundsPhaseOne: data.maxRoundsPhaseOne,
        maxRoundsPhaseTwo: data.maxRoundsPhaseTwo,
        round: data.round,
        isInLobby: data.isInGameLobby,
        selectMode: !data.isInSelectMode,
      }));
      if (!useSocketStore.getState().socket) {
        useSocketStore
          .getState()
          .setSocket(
            io(
              process.env.NODE_ENV == 'production'
                ? process.env.NEXT_PUBLIC_API_HOST ?? 'http://localhost:5000'
                : 'http://localhost:5000',
            ),
          );
      }
      useSocketStore.getState().socket?.emit('id', useAuthStore.getState().user_id, data.room_code);
      return data.room_code;
      // router.push(`/multiplayer/${room_id}`);
    }
  },
  leaveRoom: async (router: Router) => {
    const { room_code } = useRoomStore.getState();
    const { user_id } = useAuthStore.getState();
    if (user_id) {
      await axios.post(`/api/rooms/leave`, {
        room_code: room_code,
        player_id: user_id,
      });
      useSocketStore.getState().setSocket(null);
      router.push('/multiplayer');
      useRoomStore.setState({
        room_code: '',
        players: [],
        currentPlayer: null,
        maxRoundsPhaseOne: 2,
        maxRoundsPhaseTwo: 2,
        round: 1,
        isInLobby: false,
        selectMode: false,
      });
      return;
    }
  },
  startGame: () => {
    const { socket } = useSocketStore.getState();

    useRoomStore.getState().random = Math.floor(
      Math.random() * useRoomStore.getState().players.length,
    );
    const current_player = useRoomStore.getState().players[useRoomStore.getState().random];

    socket?.emit('togglePhaseOne', current_player, useRoomStore.getState().room_code);
    if (useRoomStore.getState().isInLobby) {
      useRoomStore.setState({ currentPlayer: current_player });
    }
    useRoomStore.getState().setIsInLobby(false);
  },
  updatePlayerScore: (points: number, player: IPlayer) => {
    const temp_players = useRoomStore.getState().players.map(p => {
      if (p._id === player._id) {
        p.score += points;
      }
      return p;
    });
    useRoomStore.setState({ players: temp_players });
  },
  handleTurnChange: () => {
    const {
      players,
      currentPlayer,
      round,
      maxRoundsPhaseOne,
      maxRoundsPhaseTwo,
      setRound,
      setCurrentPlayer,
      setSelectMode,
      setTurnChangeDialogOpen,
    } = useRoomStore.getState();
    const { socket } = useSocketStore.getState();
    const { setValue, setAnswer, setSongs, answer } = useAnswerStore.getState();
    const { setAudioTime, setAudio, setTime, intervalId } = useAudioStore.getState();
    const { user_id } = useAuthStore.getState();
    const { handleFinal } = useGameFinalStore.getState();

    if (!currentPlayer) return;

    if (round > maxRoundsPhaseOne + maxRoundsPhaseTwo) {
      //EndGame()
    }

    const index = players.findIndex(p => p._id === currentPlayer._id);
    if (index === players.length - 1) {
      setCurrentPlayer(players[0]);
    } else {
      setCurrentPlayer(players[index + 1]);
    }

    //As the state does not update immediately, we are checking if the current player WAS the user
    if (currentPlayer?._id == user_id) {
      socket?.emit(
        'turnChange',
        useRoomStore.getState().currentPlayer,
        useRoomStore.getState().room_code,
        useAudioStore.getState().songId,
        35,
      );
    }

    if (intervalId !== null) clearInterval(intervalId);
    setAudioTime(0);
    setAudio(null);
    setTime(1000);
    setSelectMode(false);
    setTurnChangeDialogOpen(true);
    setTimeout(() => {
      useRoomStore.setState({ turnChangeDialogOpen: false });
      setValue('');
      setAnswer('');
      setSongs([
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
  },

  handleChooseCategory: async (song_id: string, phase = 1) => {
    const { socket } = useSocketStore.getState();
    const { setAudio, setSongId } = useAudioStore.getState();
    const { setSelectMode, room_code } = useRoomStore.getState();
    const song = await axios
      .post(`/api/songs/chooseSong`, {
        room_code: room_code,
        song_id: song_id,
      })
      .then(res => {
        return res.data.data.song_id;
      });
    socket?.emit('chooseSong', song, room_code);
    if (phase == 3) useAudioStore.getState().audio?.pause();
    setSongId(song);
    setAudio(new Audio(`/music/${song}.mp3`));
    if (phase != 3) setSelectMode(true);
  },
  async updateSettings(maxRoundsPhaseOne: number, maxRoundsPhaseTwo: number) {
    if (
      maxRoundsPhaseOne < 1 ||
      maxRoundsPhaseTwo < 1 ||
      maxRoundsPhaseOne > 400 ||
      maxRoundsPhaseTwo > 200
    ) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: `Please enter a valid number of rounds\nPhase 1: 1-400\nPhase 2: 1-200`,
        style: { whiteSpace: 'pre-line' },
      });
      return;
    }

    //if either of maxRounds is NaN, then use the current value
    const mxRoundsPhaseOne = isNaN(maxRoundsPhaseOne)
      ? useRoomStore.getState().maxRoundsPhaseOne
      : maxRoundsPhaseOne;
    const mxRoundsPhaseTwo = isNaN(maxRoundsPhaseTwo)
      ? useRoomStore.getState().maxRoundsPhaseTwo
      : maxRoundsPhaseTwo;

    await axios
      .put(`/api/rooms/settings`, {
        room_code: useRoomStore.getState().room_code,
        maxRoundsPhaseOne: mxRoundsPhaseOne,
        maxRoundsPhaseTwo: mxRoundsPhaseTwo,
      })
      .then(res => {
        if (res.status === 200) {
          toast({
            variant: 'default',
            title: 'Success!',
            description: res.data.message,
          });
        }
      });
  },
}));
