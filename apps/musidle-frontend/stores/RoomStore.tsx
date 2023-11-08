'use client';
import axios from 'axios';
import { create } from 'zustand';
import { IRoomStore, IPlayer } from '@/@types/Rooms';
import { useSocketStore } from './SocketStore';
import { io } from 'socket.io-client';
import { useAnswerStore } from './AnswerStore';
import { useAudioStore } from './AudioStore';
import { toast } from '@/components/ui/use-toast';
import { useTimerStore } from '@/stores/TimerStore';
import { Router } from 'next/router';
import dotenv from 'dotenv';
import { useNextAuthStore } from './NextAuthStore';
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
  spectators: [],
  setSpectators: (spectators: IPlayer[]) =>
    set(() => ({
      spectators: spectators,
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
  joinRoom: async (room_code, user) => {
    const { setAudio, setSongId } = useAudioStore.getState();
    const { setTimer } = useTimerStore.getState();
    const { setPossibleSongs } = useAnswerStore.getState();
    if (!user?._id || !user?.activated) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: `Please login and activate your account to join a room`,
        style: { whiteSpace: 'pre-line' },
      });
      return;
    }

    const { data } = await axios.post(`/externalApi/rooms/join`, {
      room_code: room_code,
      player: {
        _id: user._id,
        name: user.username,
        score: 0,
      },
    });
    set(() => ({
      room_code: data.room_code,
      players: data.players,
      spectators: data.spectators,
      currentPlayer: data.current_player,
      maxRoundsPhaseOne: data.maxRoundsPhaseOne,
      maxRoundsPhaseTwo: data.maxRoundsPhaseTwo,
      round: data.round,
      isInLobby: data.isInGameLobby,
      selectMode: !data.isInSelectMode,
      votesForTurnSkip: data.votesForTurnSkip,
    }));
    setTimer(data.timer);
    useTimerStore.setState({ maxTimer: data.maxTimer });
    setPossibleSongs(data.songs);
    setSongId(data.song_id);
    setAudio(new Audio(`/music/${data.song_id}.mp3`));
    const audio = useAudioStore.getState().audio;
    if (audio) {
      audio.volume = useAudioStore.getState().volume;
    }
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

      useSocketStore.getState().socket?.emit('id', user._id, room_code);
    }
  },
  leaveRoom: async (router: Router, user_id = null) => {
    const { room_code } = useRoomStore.getState();
    if (user_id) {
      await axios.post(`/externalApi/rooms/leave`, {
        room_code: room_code,
        player_id: user_id,
      });
      useSocketStore.getState().socket?.disconnect();
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
  startGame: async () => {
    await axios.post(`/externalApi/rooms/start`, {
      room_code: useRoomStore.getState().room_code,
    });
  },
  updatePlayerScore: (points, player) => {
    const temp_players = useRoomStore.getState().players.map(p => {
      if (p._id === player._id) {
        p.score += points;
      }
      return p;
    });
    useRoomStore.setState({ players: temp_players });
  },
  handleTurnChange: async () => {
    if (!useRoomStore.getState().currentPlayer) return;

    await axios.post(`/externalApi/rooms/turnChange`, {
      room_code: useRoomStore.getState().room_code,
      song_id: useAudioStore.getState().songId,
    });
  },

  handleChooseCategory: async (song_id, phase = 1, socket = null) => {
    if (!socket) socket = useSocketStore.getState().socket;
    const { setAudio } = useAudioStore.getState();
    const { setSelectMode, room_code } = useRoomStore.getState();
    const song: string = await axios
      .post(`/externalApi/songs/chooseSong`, {
        room_code: room_code,
        song_id: song_id,
      })
      .then(res => {
        return res.data.data;
      });
    socket?.emit('chooseSong', song, room_code);
    if (phase == 3 && song_id != 'song_id') useAudioStore.getState().audio?.pause();
    useAudioStore.setState({ songId: song });
    setAudio(new Audio(`/music/${song}.mp3`));
    const audio = useAudioStore.getState().audio;
    if (audio) {
      audio.volume = useAudioStore.getState().volume;
    }
    if (phase != 3) {
      setSelectMode(true);
      return song;
    }
    useRoomStore.getState().setIsInLobby(false);
    return song;
  },
  async updateSettings(maxRoundsPhaseOne, maxRoundsPhaseTwo, maxTimer) {
    if (
      maxRoundsPhaseOne < 1 ||
      maxRoundsPhaseTwo < 1 ||
      maxRoundsPhaseOne > 400 ||
      maxRoundsPhaseTwo > 200 ||
      maxTimer < 1 ||
      maxTimer > 120
    ) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: `Please enter a valid number of\n Rounds in phase 1: 1-400\nRounds in phase 2: 1-200 \n Seconds for timer: 1-120`,
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
    const mxTimer = isNaN(maxTimer) ? useTimerStore.getState().maxTimer : maxTimer;

    await axios
      .put(`/externalApi/rooms/settings`, {
        room_code: useRoomStore.getState().room_code,
        maxRoundsPhaseOne: mxRoundsPhaseOne,
        maxRoundsPhaseTwo: mxRoundsPhaseTwo,
        maxTimer: mxTimer,
      })
      .then(res => {
        if (res.status === 200) {
          toast({
            variant: 'default',
            title: 'Success!',
            description: res.data.message,
          });
        }
        useRoomStore.setState({
          maxRoundsPhaseOne: mxRoundsPhaseOne,
          maxRoundsPhaseTwo: mxRoundsPhaseTwo,
        });
      });
  },
  votesForTurnSkip: 0,
  voteForTurnSkip(socket) {
    socket?.emit(
      'voteForTurnSkip',
      useRoomStore.getState().room_code,
      useNextAuthStore.getState().session?.user?._id,
      useAudioStore.getState().songId,
    );
    useRoomStore.setState({
      votesForTurnSkip: useRoomStore.getState().votesForTurnSkip + 1,
    });
  },
}));
