import { create } from 'zustand';
import { Socket, io } from 'socket.io-client';

interface ISocketStore {
  socket: Socket | null;
  setSocket: (socket: Socket) => void;
}

export const useSocketStore = create<ISocketStore>(set => ({
  socket: null,
  setSocket: (socket: Socket) =>
    set(() => ({
      socket: socket,
    })),
  // emit: (event: string, data: any) => {
  //   if (useSocketStore.getState().socket) {
  //     useSocketStore.getState().socket?.emit(event, data);
  //   }
  // },
}));
