import express, { Router, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import path from 'path';
import fs from 'fs';
import axios from 'axios';
import { getCurrentUrl } from '../utils/GetCurrentUrl';
dotenv.config();

const jsonParser = bodyParser.json();

const router: Router = express.Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    return res.json({ message: 'Audio API' });
  } catch (error) {
    next(error);
  }
});
router.get('/daily', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const songId = await axios
      .get(`${getCurrentUrl()}/externalApi/daily`)
      .then(res => res.data.song.songId);
    const filePath = path.resolve(path.join(__dirname, '..', 'assets', `${songId}.mp3`));
    const stat = fs.statSync(filePath);

    res.writeHead(200, {
      'Content-Type': 'audio/mpeg',
      'Content-Length': stat.size,
    });
    const readStream = fs.createReadStream(filePath);
    return readStream.pipe(res);
  } catch (error) {
    next(error);
  }
});
router.get('/multiplayer/:roomCode', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const roomCode = req.params.roomCode;
    const songId = await axios
      .get(`${getCurrentUrl()}/externalApi/rooms/${roomCode}`)
      .then(res => res.data.songId);
    const filePath = path.resolve(path.join(__dirname, '..', 'assets', `${songId}.mp3`));
    const stat = fs.statSync(filePath);

    res.writeHead(200, {
      'Content-Type': 'audio/mpeg',
      'Content-Length': stat.size,
    });

    const readStream = fs.createReadStream(filePath);
    return readStream.pipe(res);
  } catch (error) {
    next(error);
  }
});

export default router;
