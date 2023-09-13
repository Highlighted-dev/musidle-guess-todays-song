import { Server } from 'socket.io';
import roomModel from '../models/RoomModel';

interface ActiveTimers {
  [roomCode: string]: NodeJS.Timeout;
}

const activeTimers: ActiveTimers = {};

const Timer = (room_code: string, timer = 0, io: Server) => {
  let interval: NodeJS.Timeout;

  const start = () => {
    if (activeTimers[room_code]) {
      // A timer is already running for this room code
      return;
    }

    interval = setInterval(async () => {
      if (timer > 0) {
        timer--;
        const room = await roomModel.find({ room_code: room_code });
        if (!room) {
          stop();
          return;
        }
        await roomModel.updateOne({ room_code: room_code }, { timer: timer });
        io.in(room_code).emit('timerUpdate', timer);
      } else {
        clearInterval(interval);
        delete activeTimers[room_code];
      }
    }, 1000);

    activeTimers[room_code] = interval;
  };

  const stop = () => {
    clearInterval(activeTimers[room_code]);
    delete activeTimers[room_code];
  };

  return {
    start,
    stop,
  };
};

export default Timer;
