import axios from 'axios';
import { create } from 'zustand';
import { useAuthStore } from './AuthStore';
import { player } from '@/@types/GameContext';
import { useSocketStore } from './SocketStore';
import { io } from 'socket.io-client';
import { useAnswerStore } from './AnswerStore';
import { useAudioStore } from './AudioStore';
import { usePhaseStore } from './PhasesStore';
interface IRoomStore {
  room_code: string;
  setRoomCode: (room_code: string) => void;
  players: player[];
  setPlayers: (players: player[]) => void;
  round: number;
  setRound: (round: number) => void;
  maxRounds: number;
  setMaxRounds: (maxRounds: number) => void;
  isInLobby: boolean;
  setIsInLobby: (isInLobby: boolean) => void;
  currentPlayer: player | null;
  setCurrentPlayer: (player: player) => void;
  renderGame: boolean;
  setRenderGame: (renderGame: boolean) => void;
  joinRoom: (room_code: string) => Promise<void>;
  createRoom: () => Promise<void>;
  updatePlayerScore: (points: number, player: player) => void;
  handleTurnChange: () => void;
}

export const useRoomStore = create<IRoomStore>(set => ({
  room_code: '',
  setRoomCode: (room_code: string) =>
    set(() => ({
      room_code: room_code,
    })),
  players: [],
  setPlayers: (players: player[]) =>
    set(() => ({
      players: players,
    })),
  round: 1,
  setRound: (round: number) =>
    set(() => ({
      round: round,
    })),
  maxRounds: 2,
  setMaxRounds: (maxRounds: number) =>
    set(() => ({
      maxRounds: maxRounds,
    })),
  isInLobby: false,
  setIsInLobby: (isInLobby: boolean) =>
    set(() => ({
      isInLobby: isInLobby,
    })),
  currentPlayer: null,
  setCurrentPlayer: (player: player) =>
    set(() => ({
      currentPlayer: player,
    })),
  renderGame: false,
  setRenderGame: (renderGame: boolean) =>
    set(() => ({
      renderGame: renderGame,
    })),
  joinRoom: async (room_code: string) => {
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
        maxRounds: data.maxRounds,
        round: data.round,
        isInLobby: true,
      }));
      useSocketStore
        .getState()
        .setSocket(
          io(
            process.env.NODE_ENV == 'production'
              ? process.env.NEXT_PUBLIC_API_HOST!
              : 'http://localhost:5000',
          ),
        );
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
        maxRounds: data.maxRounds,
        round: data.round,
        isInLobby: true,
      }));
      useSocketStore
        .getState()
        .setSocket(
          io(
            process.env.NODE_ENV == 'production'
              ? process.env.NEXT_PUBLIC_API_HOST!
              : 'http://localhost:5000',
          ),
        );
      useSocketStore.getState().socket?.emit('id', useAuthStore.getState().user_id, data.room_code);
      return data.room_code;
      // router.push(`/multiplayer/${room_id}`);
    }
  },
  updatePlayerScore: (points: number, player: player) => {
    const temp_players = useRoomStore.getState().players.map(p => {
      if (p._id === player._id) {
        p.score += points;
      }
      return p;
    });
    useRoomStore.setState({ players: temp_players });
  },
  handleTurnChange: () => {
    const { players, currentPlayer, round, setRound, maxRounds, setCurrentPlayer, setRenderGame } =
      useRoomStore.getState();
    const { socket } = useSocketStore.getState();
    const { setAnswerDialogOpen, setValue, setAnswer, setSongs } = useAnswerStore.getState();
    const { setAudioTime, setAudio, setTime, intervalId } = useAudioStore.getState();
    const { user_id } = useAuthStore.getState();
    const {
      hasPhaseOneStarted,
      setHasPhaseOneStarted,
      setHasPhaseTwoStarted,
      setHasPhaseThreeStarted,
      handleFinal,
    } = usePhaseStore.getState();
    if (!currentPlayer) return;
    if (currentPlayer?._id == user_id) {
      socket?.emit('turnChange');
    }
    const index = players.findIndex(p => p._id === currentPlayer._id);
    if (index === players.length - 1) {
      setCurrentPlayer(players[0]);
    } else {
      setCurrentPlayer(players[index + 1]);
    }
    if (intervalId !== null) clearInterval(intervalId);
    setAnswerDialogOpen(false);
    setAudioTime(0);
    setAudio(null);
    setValue('');
    setAnswer('');
    setTime(1000);
    setSongs([
      {
        value: 'Songs will appear here',
        label: 'Songs will appear here',
        key: 'no-song',
      },
    ]);
    setRenderGame(false);
    if (maxRounds === round) {
      if (hasPhaseOneStarted) {
        setHasPhaseTwoStarted(true);
        setHasPhaseOneStarted(false);
      } else {
        handleFinal();
        setHasPhaseTwoStarted(false);
        setHasPhaseThreeStarted(true);
      }
      setRound(1);
      return;
    }
    setRound(round + 1);
  },
}));
