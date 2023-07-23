import { create } from 'zustand';
import { Socket } from 'socket.io-client';
import { useRoomStore } from './RoomStore';
interface ISocketStore {
  socket: Socket | null;
  setSocket: (socket: Socket) => void;
}
type player = {
  _id: string;
  name: string;
  score: number;
};

export const useSocketStore = create<ISocketStore>(set => ({
  socket: null,
  setSocket: (socket: Socket) =>
    set(() => ({
      socket: socket,
    })),
}));

// Connect the socket and add event listeners
useSocketStore.subscribe(({ socket }) => {
  if (socket) {
    socket.on('addPlayer', (player: player) => {
      if (useRoomStore.getState().players.find(p => p._id === player._id)) return;
      useRoomStore.setState({ players: [...useRoomStore.getState().players, player] });
    });
  }
});
