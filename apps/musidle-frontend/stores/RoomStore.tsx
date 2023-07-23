import axios from 'axios';
import { create } from 'zustand';
import { useAuthStore } from './AuthStore';
import { player } from '@/@types/GameContext';
import { useSocketStore } from './SocketStore';
import { io } from 'socket.io-client';
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
  joinRoom: (room_code: string) => Promise<void>;
  createRoom: () => Promise<void>;
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
  round: 0,
  setRound: (round: number) =>
    set(() => ({
      round: round,
    })),
  maxRounds: 0,
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
}));
