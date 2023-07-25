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
  });
  socket.on('togglePhaseOne', current_player => {
    socket.broadcast.emit('togglePhaseOne', current_player);
  });
  socket.on('chooseCategory', category => {
    socket.broadcast.emit('chooseCategory', category);
  });
  socket.on('handlePlay', () => {
    socket.broadcast.emit('handlePlay');
  });
  socket.on('skip', time => {
    socket.broadcast.emit('skip', time);
  });
  socket.on('searchSong', songs => {
    socket.broadcast.emit('searchSong', songs);
  });
  socket.on('valueChange', value => {
    socket.broadcast.emit('valueChange', value);
  });
  socket.on('answerSubmit', (score, player, answer) => {
    socket.broadcast.emit('answerSubmit', score, player, answer);
  });
  socket.on('turnChange', () => {
    socket.broadcast.emit('turnChange');
  });
  socket.on('togglePhaseTwo', () => {
    socket.broadcast.emit('togglePhaseTwo');
  });
  socket.on('chooseArtist', artist => {
    socket.broadcast.emit('chooseArtist', artist);
  });
  socket.on('disconnect', () => {
    const user = users.find(user => user.socket_id === socket.id);
    if (user) {
      axios.post('http://localhost:5000/api/rooms/leave', {
        room_code: user.room_code,
        player_id: user.id,
      });
      users.splice(users.indexOf(user), 1);
    }
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
