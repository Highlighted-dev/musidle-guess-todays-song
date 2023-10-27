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
const mongodb_url =
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
          cert: process.env.SERVER_CERT,
          ca: process.env.SERVER_CA,
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
    let usersInRoom = users.filter(user => user.room_code === room.room_code);
    if (usersInRoom.length >= 1) {
      //check if user is in room and is connected to socket
      usersInRoom.forEach(async user => {
        const socket = io.sockets.sockets.get(user.socket_id);
        if (socket == undefined) {
          users.splice(users.indexOf(user), 1);
          usersToBeDeleted.push(user);
        }
      });
      return;
    }
    usersInRoom = usersToBeDeleted.filter(user => user.room_code === room.room_code);
    if (usersInRoom.length >= 1) {
      //Remove every user from room
      usersInRoom.forEach(async user => {
        await axios
          .post(`${apiUrl}/externalApi/rooms/leave`, {
            room_code: user.room_code,
            player_id: user.id,
          })
          .then(res => {
            usersToBeDeleted.splice(usersToBeDeleted.indexOf(user), 1);
            io.in(user.room_code!).emit('updatePlayerList', res.data.players);
          });
      });
    }
    return;
  });
}, 120000);

io.on('connection', socket => {
  socket.on('id', (id, room_code) => {
    //if user is already in users array, remove him from there
    let user = users.find(user => user.id === id);
    if (user) {
      users.splice(users.indexOf(user), 1);
    }
    users.push({ id, socket_id: socket.id, room_code: room_code });
    //if user is in usersToBeDeleted array, remove him from there
    user = usersToBeDeleted.find(user => user.id === id);
    if (user) {
      usersToBeDeleted.splice(usersToBeDeleted.indexOf(user), 1);
    }
    socket.join(room_code);
  });
  socket.on('chooseSong', async (song_id: string, room_code) => {
    await roomModel.updateOne(
      { room_code: room_code },
      { isInSelectMode: song_id.includes('final') ? true : false, song_id: song_id },
    );
    socket.to(room_code).emit('chooseSong', song_id);
  });
  socket.on('handlePlay', (room_code, timer) => {
    Timer(room_code, timer, io).start();
    socket.to(room_code).emit('handlePlay');
  });
  socket.on('skip', (time, room_code) => {
    socket.to(room_code).emit('skip', time);
  });
  socket.on('searchSong', (songs, room_code) => {
    socket.to(room_code).emit('searchSong', songs);
  });
  socket.on('valueChange', (value, room_code) => {
    socket.to(room_code).emit('valueChange', value);
  });
  socket.on('answerSubmit', (score, player, answer, room_code) => {
    socket.to(room_code).emit('answerSubmit', score, player, answer);
  });
  socket.on('changeSongToCompleted', async (room_code, song_id) => {
    await roomModel.updateOne(
      {
        room_code: room_code,
        'songs.song_id': song_id,
      },
      {
        $set: { 'songs.$.completed': true },
      },
    );

    if (song_id.includes('final')) {
      //Check if all song with category 'final' are completed
      await roomModel.findOne({ room_code: room_code }).then(async room => {
        const songs = room?.songs.filter(
          song => song.category === 'final' && song.completed === true,
        );
        if (songs?.length === 6) {
          //If all songs with category 'final' are completed, then add +1 to round
          await axios.post(`${apiUrl}/externalApi/rooms/turnChange`, {
            room_code: room_code,
            song_id: song_id,
          });
          return;
        }
      });
    }
    socket.to(room_code).emit('changeSongToCompleted', song_id);
  });
});

mongoose
  .connect(mongodb_url)
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
