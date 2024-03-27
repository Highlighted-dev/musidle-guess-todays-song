import express from 'express';
import SearchTrackRoute from './routes/SearchTrackRoute';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http';
import https from 'https';
import UserAuthenticationRoute from './routes/UserAuthenticationRoute';
import guildRouter from './routes/GuildRoute';
import { Server } from 'socket.io';
import RoomsRoute from './routes/RoomsRoute';
import { ISocketMiddleware, IUsers } from './@types';
import errorHandler from './utils/ErrorHandler';
import axios from 'axios';
import AnswersRoute from './routes/SongsRoute';
import roomModel from './models/RoomModel';
import Timer from './utils/Timer';
import CategoriesRoute from './routes/CategoriesRoute';
import { scheduleSongUpdate } from './utils/ScheduleDailySongChange';
import DailyRoute from './routes/DailyRoute';
import AudioRoute from './routes/AudioRoute';
import { getCurrentUrl } from './utils/GetCurrentUrl';
import ArticlesRoute from './routes/ArticlesRoute';
import ImagesRoute from './routes/ImagesRoute';
import WikisRoute from './routes/WikisRoute';
import QuizesRoute from './routes/QuizesRoute';
dotenv.config();

const port = () => {
  switch (process.env.NODE_ENV) {
    case 'production':
      return process.env.PROD || 5000;
    case 'development':
      return 5000;
    default:
      return 0;
  }
};

const mongodbUrl =
  process.env.NODE_ENV == 'production'
    ? process.env.MONGODB_URL_PROD || 'musidle'
    : process.env.MONGODB_URL || 'musidle';

export const app = express();
export const server =
  process.env.NODE_ENV == 'production'
    ? https.createServer(
        {
          key: process.env.SERVER_KEY,
          ca: process.env.INTERMIDIATE_CA,
          cert: process.env.SERVER_CERT,
          keepAlive: true,
        },
        app,
      )
    : http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

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

setInterval(async () => {
  const rooms = await roomModel.find();
  const removalPromises = [];

  //Check if user is still connected to socket, if not, then remove him from users Map and add him to usersToBeDeleted Map
  for (const room of rooms) {
    if (usersToBeDeleted.size >= 1) {
      const usersToBeDeletedInRoom = Array.from(usersToBeDeleted.values()).filter(
        user => user.roomCode === room.roomCode,
      );
      for (const user of usersToBeDeletedInRoom) {
        removalPromises.push(removeUserFromRoom(user, io));
      }
    }
    const usersInRoom = Array.from(users.values()).filter(user => user.roomCode === room.roomCode);
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
    //if there is already a socket with the same id, then disconnect it
    const socketWithSameId = Array.from(users.values()).filter(user => user.id === id);
    if (socketWithSameId.length > 0) {
      socketWithSameId.forEach(user => {
        const socket = io.sockets.sockets.get(user.socketId);
        if (socket) {
          socket.disconnect();
        }
      });
    }
    // If user is already in users Map, remove him from there
    if (users.has(id)) {
      users.delete(id);
    }
    users.set(id, { id, socketId: socket.id, roomCode: roomCode });

    // If user is in usersToBeDeleted Map, remove him from there
    if (usersToBeDeleted.has(id)) {
      usersToBeDeleted.delete(id);
    }
    socket.join(roomCode);
  });
  socket.on('chooseSong', async (songId: string, roomCode, phase) => {
    const song: string = await axios
      .post(`${getCurrentUrl()}/externalApi/songs/chooseSong`, {
        roomCode: roomCode,
        songId: songId,
      })
      .then(res => {
        return res.data.songId;
      });

    await roomModel.updateOne(
      { roomCode: roomCode },
      { isInSelectMode: song.includes('final') ? true : false, songId: song },
    );
    io.to(roomCode).emit('chooseSong', song, phase);
  });
  socket.on('handlePlay', async roomCode => {
    const room = await roomModel.findOne({ roomCode: roomCode });
    Timer(roomCode, room?.maxTimer || 35, io).start();
    socket.to(roomCode).emit('handlePlay');
  });
  socket.on('changeStage', roomCode => {
    // update stage by 1
    roomModel.updateOne({ roomCode: roomCode }, { $inc: { stage: 1 } }).then(() => {
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
      roomCode: roomCode,
      songId: songId,
    });
  });
  socket.on('changeSongToCompleted', async (roomCode, songId, answer, score, currentPlayer) => {
    socket.to(roomCode).emit('changeSongToCompleted', songId, answer, score, currentPlayer);
  });
  socket.on('voteForTurnSkip', async (roomCode, playerId, songId) => {
    if (!roomCode) return;
    socket.to(roomCode).emit('voteForTurnSkip', playerId);
    //Change the player.votedForTurnSkip to true for player that voted, but only if he hasnt voted yet. If he voted, then return;
    await roomModel.findOne({ roomCode: roomCode }).then(async room => {
      if (!room) return;
      const players = room.players.filter(player => player._id === playerId);
      if (players[0].votedForTurnSkip === true) return;
      await roomModel.updateOne(
        {
          roomCode: roomCode,
          'players._id': playerId,
        },
        {
          $set: { 'players.$.votedForTurnSkip': true },
          $inc: { votesForTurnSkip: 1 },
        },
      );
    });

    //Check if all players voted for turn skip
    await roomModel.findOne({ roomCode: roomCode }).then(async room => {
      if (!room) return;
      const players = room.players.filter(player => player.votedForTurnSkip === true);
      //if there is only one player in a room or all players - 1 voted for turn skip, then call turnChange endpoint and set votedForTurnSkip to false for every player
      if (room.players.length === 1 ? 1 : room.players.length - 1 === players.length) {
        await axios.post(`${getCurrentUrl()}/externalApi/rooms/turnChange`, {
          roomCode: roomCode,
          songId: songId,
        });
        await roomModel.updateMany(
          {
            roomCode: roomCode,
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

mongoose
  .connect(mongodbUrl)
  .then(() => {
    server.listen(port(), () => {
      console.log(
        `Musidle API is listening on ${getCurrentUrl()} in ${process.env.NODE_ENV} mode.`,
      );
    });
  })
  .catch(error => {
    console.error(error);
  });
app.use(errorHandler);
const socketMiddleware: ISocketMiddleware = (req, res, next) => {
  req.io = io;
  return next;
};

server.on('request', socketMiddleware);
app.use(cookieParser());
app.use(cors());
app.use(helmet());
app.use('/externalApi/track/search/', SearchTrackRoute);
app.use('/externalApi/auth/', UserAuthenticationRoute);
app.use('/externalApi/rooms/', RoomsRoute);
app.use('/externalApi/songs/', AnswersRoute);
app.use('/externalApi/categories/', CategoriesRoute);
app.use('/externalApi/daily/', DailyRoute);
app.use('/externalApi/audio/', AudioRoute);
app.use('/externalApi/guilds', guildRouter);
app.use('/externalApi/articles', ArticlesRoute);
app.use('/externalApi/images', ImagesRoute);
app.use('/externalApi/wikis', WikisRoute);
app.use('/externalApi/quizes', QuizesRoute);
app.use(() => scheduleSongUpdate);
app.use(errorHandler);
