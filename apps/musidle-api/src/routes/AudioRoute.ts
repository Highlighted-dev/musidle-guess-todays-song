import express, { Router, Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import axios from 'axios';
import { getCurrentUrl } from '../utils/GetCurrentUrl';
import { logger } from '../utils/Logger';
dotenv.config();

const router: Router = express.Router();

// Route to get the daily song
router.get('/daily', async (req: Request, res: Response) => {
  try {
    // Fetch the songId of the daily song from the external API
    const songId = (await axios.get(`${getCurrentUrl()}/externalApi/daily`)).data.song.songId;
    const filePath = path.resolve(path.join(__dirname, '..', 'assets', `${songId}.mp3`));

    // Get the file stats (used to get the file size)
    const stat = fs.statSync(filePath);

    res.writeHead(200, {
      'Content-Type': 'audio/mpeg',
      'Content-Length': stat.size,
    });

    // Stream the song file to the response
    fs.createReadStream(filePath).pipe(res);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: 'Failed to get daily song' });
  }
});

// Route to get the song for a multiplayer room
router.get('/multiplayer/:roomCode', async (req: Request, res: Response) => {
  try {
    const roomCode = req.params.roomCode;

    // Fetch the songId for the room from the external API
    const songId = (await axios.get(`${getCurrentUrl()}/externalApi/rooms/${roomCode}`)).data
      .songId;
    const filePath = path.resolve(path.join(__dirname, '..', 'assets', `${songId}.mp3`));

    // Get the file stats (used to get the file size)
    const stat = fs.statSync(filePath);

    res.writeHead(200, {
      'Content-Type': 'audio/mpeg',
      'Content-Length': stat.size,
    });

    // Stream the song file to the response
    fs.createReadStream(filePath).pipe(res);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: 'Failed to get multiplayer song' });
  }
});

export default router;
