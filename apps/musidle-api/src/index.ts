import express, { NextFunction } from 'express';
import SearchTrackRoute from './routes/SearchTrackRoute';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http';
import https from 'https';
import UserAuthenticationRoute from './routes/UserAuthenticationRoute';
import { Server } from 'socket.io';
import RoomsRoute from './routes/RoomsRoute';
import { ISocketMiddleware, IUsers } from './@types';
import errorHandler from './utils/ErrorHandler';
import axios from 'axios';
import AnswersRoute from './routes/SongsRoute';
import roomModel from './models/RoomModel';
import Timer from './utils/Timer';
import CategoriesRoute from './routes/CategoriesRoute';
dotenv.config();
const port = process.env.PORT ? Number(process.env.PORT) : 5000;
const mongodbUrl =
  process.env.NODE_ENV == 'production'
    ? process.env.MONGODB_URL_PROD || 'musidle'
    : process.env.MONGODB_URL || 'musidle';
const apiUrl = process.env.NODE_ENV == 'production' ? process.env.API_URL : 'http://localhost:5000';

const app = express();
const server =
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

const users: IUsers[] = [];
const usersToBeDeleted: IUsers[] = [];

//set interval to check if there are no users that are connected to socket in a room
//TODO This function definitly not scalable and its poorly written, should be replaced in future
setInterval(async () => {
  const rooms = await roomModel.find();
  rooms.forEach(async room => {
    //check if user is in room
    let usersInRoom = users.filter(user => user.roomCode === room.roomCode);
    if (usersInRoom.length >= 1) {
      //check if user is in room and is connected to socket
      usersInRoom.forEach(async user => {
        const socket = io.sockets.sockets.get(user.socketId);
        if (socket == undefined) {
          users.splice(users.indexOf(user), 1);
          usersToBeDeleted.push(user);
        }
      });
      return;
    }
    usersInRoom = usersToBeDeleted.filter(user => user.roomCode === room.roomCode);
    if (usersInRoom.length >= 1) {
      //Remove every user from room
      usersInRoom.forEach(async user => {
        await axios
          .post(`${apiUrl}/externalApi/rooms/leave`, {
            roomCode: user.roomCode,
            playerId: user.id,
          })
          .then(res => {
            usersToBeDeleted.splice(usersToBeDeleted.indexOf(user), 1);
            io.in(user.roomCode!).emit('updatePlayerList', res.data.players);
          });
      });
    }
    return;
  });
}, 120000);

io.on('connection', socket => {
  socket.on('id', (id, roomCode) => {
    //if user is already in users array, remove him from there
    let user = users.find(user => user.id === id);
    if (user) {
      users.splice(users.indexOf(user), 1);
    }
    users.push({ id, socketId: socket.id, roomCode: roomCode });
    //if user is in usersToBeDeleted array, remove him from there
    user = usersToBeDeleted.find(user => user.id === id);
    if (user) {
      usersToBeDeleted.splice(usersToBeDeleted.indexOf(user), 1);
    }
    socket.join(roomCode);
  });
  socket.on('chooseSong', async (songId: string, roomCode) => {
    await roomModel.updateOne(
      { roomCode: roomCode },
      { isInSelectMode: songId.includes('final') ? true : false, songId: songId },
    );
    socket.to(roomCode).emit('chooseSong', songId);
  });
  socket.on('handlePlay', async (roomCode, timer) => {
    const room = await roomModel.findOne({ roomCode: roomCode });
    Timer(roomCode, room?.maxTimer || 35, io).start();
    socket.to(roomCode).emit('handlePlay');
  });
  socket.on('skip', (time, roomCode) => {
    socket.to(roomCode).emit('skip', time);
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
  socket.on('changeSongToCompleted', async (roomCode, songId) => {
    await roomModel.updateOne(
      {
        roomCode: roomCode,
        'songs.songId': songId,
      },
      {
        $set: { 'songs.$.completed': true },
      },
    );

    if (songId.includes('final')) {
      //Check if all song with category 'final' are completed
      await roomModel.findOne({ roomCode: roomCode }).then(async room => {
        const songs = room?.songs.filter(
          song => song.category === 'final' && song.completed === true,
        );
        if (songs?.length === 6) {
          //If all songs with category 'final' are completed, then add +1 to round
          await axios.post(`${apiUrl}/externalApi/rooms/turnChange`, {
            roomCode: roomCode,
            songId: songId,
          });
          return;
        }
      });
    }
    socket.to(roomCode).emit('changeSongToCompleted', songId);
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
        await axios.post(`${apiUrl}/externalApi/rooms/turnChange`, {
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
});

mongoose
  .connect(mongodbUrl)
  .then(() => {
    server.listen(port, () => {
      console.log(
        `Musidle API is listening on ${
          process.env.NODE_ENV == 'production'
            ? `https://localhost:${port}`
            : `http://localhost:${port}`
        }`,
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
app.use(errorHandler);
