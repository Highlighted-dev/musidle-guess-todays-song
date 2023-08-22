import express, { NextFunction } from 'express';
import SearchTrackRoute from './routes/SearchTrackRoute';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import UserAuthenticationRoute from './routes/UserAuthenticationRoute';
import http from 'http';
import { Server } from 'socket.io';
import RoomsRoute from './routes/RoomsRoute';
import { ISocketMiddleware, IUsers } from './@types';
import errorHandler from './utils/ErrorHandler';
import axios from 'axios';
import AnswersRoute from './routes/AnswersRoute';
import roomModel from './models/RoomModel';
dotenv.config();

const port = process.env.PORT ? Number(process.env.PORT) : 5000;
const mongodb_url = process.env.MONGODB_URL || 'musidle';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

const users: IUsers[] = [];

io.on('connection', socket => {
  socket.on('id', (id, room_code) => {
    users.push({ id, socket_id: socket.id, room_code: room_code });
    socket.join(room_code);
  });
  socket.on('togglePhaseOne', async (current_player, room_code) => {
    await roomModel.updateOne(
      { room_code: room_code },
      { current_player: current_player, isInGameLobby: false },
    );
    socket.broadcast.to(room_code).emit('togglePhaseOne', current_player);
  });
  socket.on('chooseCategory', async (song_id, room_code) => {
    await roomModel.updateOne(
      { room_code: room_code },
      { isInSelectMode: false, song_id: song_id },
    );
    socket.broadcast.to(room_code).emit('chooseCategory', song_id);
  });
  socket.on('handlePlay', room_code => {
    socket.broadcast.to(room_code).emit('handlePlay');
  });
  socket.on('skip', (time, room_code) => {
    socket.broadcast.to(room_code).emit('skip', time);
  });
  socket.on('searchSong', (songs, room_code) => {
    socket.broadcast.to(room_code).emit('searchSong', songs);
  });
  socket.on('valueChange', (value, room_code) => {
    socket.broadcast.to(room_code).emit('valueChange', value);
  });
  socket.on('answerSubmit', (score, player, answer, room_code) => {
    socket.broadcast.to(room_code).emit('answerSubmit', score, player, answer);
  });
  socket.on('turnChange', async (current_player, room_code) => {
    await roomModel.updateOne(
      { room_code: room_code },
      { current_player: current_player, isInSelectMode: true, $inc: { round: 1 } },
    );
    socket.broadcast.to(room_code).emit('turnChange');
  });
  socket.on('chooseArtist', async (song_id, room_code) => {
    await roomModel.updateOne({ room_code: room_code }, { inSelectMode: false, song_id: song_id });
    socket.broadcast.to(room_code).emit('chooseArtist', song_id);
  });
  socket.on('disconnect', () => {
    // const user = users.find(user => user.socket_id === socket.id);
    // if (user) {
    //   axios.post('http://localhost:5000/api/rooms/leave', {
    //     room_code: user.room_code,
    //     player_id: user.id,
    //   });
    //   users.splice(users.indexOf(user), 1);
    // }
  });
  socket.on('changeRound', () => {
    axios.get('http://localhost:5000/api/rooms/changeRound');
  });
});

mongoose
  .connect(mongodb_url)
  .then(() => {
    server.listen(port, () => {
      console.log(`Musidle API is listening on http://localhost:${port}`);
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
app.use('/api/track/search/', SearchTrackRoute);
app.use('/api/auth/', UserAuthenticationRoute);
app.use('/api/rooms/', RoomsRoute);
app.use('/api/answers/', AnswersRoute);
app.use(errorHandler);
