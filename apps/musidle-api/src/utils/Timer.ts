import { Server } from 'socket.io';
import roomModel from '../models/RoomModel';

interface IActiveTimers {
  [roomCode: string]: NodeJS.Timeout;
}

const activeTimers: IActiveTimers = {};

const timer = (roomCode: string, timer = 0, io: Server) => {
  let interval: NodeJS.Timeout;

  const start = () => {
    if (activeTimers[roomCode]) {
      // A timer is already running for this room code
      return;
    }

    interval = setInterval(async () => {
      if (timer > 0) {
        timer--;
        const room = await roomModel.find({ roomCode: roomCode });
        if (!room) {
          stop();
          return;
        }
        await roomModel.updateOne({ roomCode: roomCode }, { timer: timer });
        io.in(roomCode).emit('timerUpdate', timer);
      } else {
        stop();
        const room = await roomModel.findOne({ roomCode: roomCode });
        await roomModel.findOneAndUpdate({ roomCode: roomCode }, { timer: room?.maxTimer || 35 });
      }
    }, 1000);

    activeTimers[roomCode] = interval;
  };

  const stop = () => {
    clearInterval(activeTimers[roomCode]);
    delete activeTimers[roomCode];
  };

  return {
    start,
    stop,
  };
};

export default timer;
