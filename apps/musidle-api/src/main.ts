import express from 'express';
import SearchTrackRoute from './routes/SearchTrackRoute';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import UserAuthenticationRoute from './routes/UserAuthenticationRoute';
import http from 'http';
import { Server } from 'socket.io';
dotenv.config();

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 5000;
const mongodb_url = process.env.MONGODB_URL || 'musidle';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

io.on('connection', socket => {
  socket.on('addPlayer', player => {
    socket.broadcast.emit('addPlayer', player);
  });
  socket.on('toggleGame', current_player => {
    socket.broadcast.emit('toggleGame', current_player);
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
  socket.on('searchSong', query => {
    socket.broadcast.emit('searchSong', query);
  });
  socket.on('valueChange', value => {
    socket.broadcast.emit('valueChange', value);
  });
});

mongoose
  .connect(mongodb_url)
  .then(() => {
    server.listen(port, host, () => {
      console.log(`Musidle API is listening on http://${host}:${port}`);
    });
  })
  .catch(error => {
    console.error(error);
  });
app.use(cookieParser());
app.use(cors());
app.use(helmet());
app.use('/api/track/search/', SearchTrackRoute);
app.use('/api/auth/', UserAuthenticationRoute);
