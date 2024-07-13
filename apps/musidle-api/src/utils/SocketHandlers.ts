import { Server } from 'socket.io';
import axios from 'axios';
import roomModel from '../models/RoomModel';
import Timer from './Timer';
import { IUsers } from '../@types';
import { getCurrentUrl } from './GetCurrentUrl';

const users: Map<string, IUsers> = new Map();
const usersToBeDeleted: Map<string, IUsers> = new Map();

function removeUserFromUsersMap(user: IUsers) {
  users.delete(user.socketId);
}

async function removeUserFromRoom(user: IUsers, io: Server) {
  const response = await axios.post(`${getCurrentUrl()}/externalApi/rooms/leave`, {
    roomCode: user.roomCode,
    playerId: user.id,
  });
  usersToBeDeleted.delete(user.socketId);
  io.in(user.roomCode!).emit('updatePlayerList', response.data.players);
}

const setupSocket = (server: any) => {
  const io = new Server(server, {
    cors: {
      origin: '*',
    },
  });

  setInterval(async () => {
    const rooms = await roomModel.find();
    const removalPromises = [];

    for (const room of rooms) {
      if (usersToBeDeleted.size >= 1) {
        const usersToBeDeletedInRoom = Array.from(usersToBeDeleted.values()).filter(
          user => user.roomCode === room.roomCode,
        );
        for (const user of usersToBeDeletedInRoom) {
          removalPromises.push(removeUserFromRoom(user, io));
        }
      }
      const usersInRoom = Array.from(users.values()).filter(
        user => user.roomCode === room.roomCode,
      );
      if (usersInRoom.length >= 1) {
        for (const user of usersInRoom) {
          const socket = io.sockets.sockets.get(user.socketId);
          if (!socket) {
            removeUserFromUsersMap(user);
            usersToBeDeleted.set(user.socketId, user);
          }
        }
      }
    }

    await Promise.all(removalPromises);
  }, 120000);

  io.on('connection', socket => {
    socket.on('id', (id, roomCode) => {
      const socketWithSameId = Array.from(users.values()).filter(user => user.id === id);
      if (socketWithSameId.length > 0) {
        socketWithSameId.forEach(user => {
          const socket = io.sockets.sockets.get(user.socketId);
          if (socket) {
            socket.disconnect();
          }
        });
      }
      if (users.has(id)) {
        users.delete(id);
      }
      users.set(id, { id, socketId: socket.id, roomCode });

      if (usersToBeDeleted.has(id)) {
        usersToBeDeleted.delete(id);
      }
      socket.join(roomCode);
    });

    socket.on('chooseSong', async (songId, roomCode, phase) => {
      const song = await axios
        .post(`${getCurrentUrl()}/externalApi/songs/chooseSong`, {
          roomCode,
          songId,
        })
        .then(res => res.data.songId);
      await roomModel.updateOne(
        { roomCode },
        { isInSelectMode: song.includes('final') ? true : false, songId: song },
      );
      io.to(roomCode).emit('chooseSong', song, phase);
    });

    socket.on('handlePlay', async roomCode => {
      const room = await roomModel.findOne({ roomCode });
      Timer(roomCode, room?.maxTimer || 35, io).start();
      socket.to(roomCode).emit('handlePlay');
    });

    socket.on('changeStage', roomCode => {
      roomModel.updateOne({ roomCode }, { $inc: { stage: 1 } }).then(() => {
        socket.broadcast.to(roomCode).emit('changeStage');
      });
    });

    socket.on('searchSong', (songs, roomCode) => {
      socket.to(roomCode).emit('searchSong', songs);
    });

    socket.on('valueChange', (value, roomCode) => {
      socket.to(roomCode).emit('valueChange', value);
    });

    socket.on('answerSubmit', (score, player, answer, roomCode) => {
      socket.to(roomCode).emit('answerSubmit', score, player, answer);
    });

    socket.on('turnChange', async (roomCode, songId) => {
      await axios.post(`${getCurrentUrl()}/externalApi/rooms/turnChange`, {
        roomCode,
        songId,
      });
    });

    socket.on('changeSongToCompleted', (roomCode, songId, answer, score, currentPlayer) => {
      socket.to(roomCode).emit('changeSongToCompleted', songId, answer, score, currentPlayer);
    });

    socket.on('voteForTurnSkip', async (roomCode, playerId, songId) => {
      if (!roomCode) return;
      socket.to(roomCode).emit('voteForTurnSkip', playerId);
      await roomModel.findOne({ roomCode }).then(async room => {
        if (!room) return;
        const players = room.players.filter(player => player.id === playerId);
        if (players[0].votedForTurnSkip === true) return;
        await roomModel.updateOne(
          {
            roomCode,
            'players.id': playerId,
          },
          {
            $set: { 'players.$.votedForTurnSkip': true },
            $inc: { votesForTurnSkip: 1 },
          },
        );
      });

      await roomModel.findOne({ roomCode }).then(async room => {
        if (!room) return;
        const players = room.players.filter(player => player.votedForTurnSkip === true);
        if (room.players.length === 1 ? 1 : room.players.length - 1 === players.length) {
          await axios.post(`${getCurrentUrl()}/externalApi/rooms/turnChange`, {
            roomCode,
            songId,
          });
          await roomModel.updateMany(
            {
              roomCode,
            },
            {
              $set: { 'players.$[].votedForTurnSkip': false, votesForTurnSkip: 0 },
            },
          );

          return;
        }
      });
    });

    socket.on('send-chat-message', (message, roomCode) => {
      io.to(roomCode).emit('chat-message', message);
    });
  });

  return io;
};

export default setupSocket;
