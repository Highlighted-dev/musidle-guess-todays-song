import express, { Router, Request, Response } from 'express';
import songModel from '../models/SongModel';
import dotenv from 'dotenv';
import { logger } from '../utils/Logger';
dotenv.config();

const router: Router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const song = await songModel
      .findOne({ wasInDaily: false, category: { $ne: 'polish' } })
      .then(res => res);
    if (!song) return res.status(404).json({ message: 'Song not found' });
    return res.json({ song });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: 'Failed to get the song' });
  }
});

export default router;
