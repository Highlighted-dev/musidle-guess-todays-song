import express, { Router, Request, Response, NextFunction } from 'express';
import songModel from '../models/SongModel';
import dotenv from 'dotenv';
dotenv.config();

const router: Router = express.Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const song = await songModel
      .findOne({ wasInDaily: false, category: { $ne: 'polish' } })
      .then(res => res);
    if (!song) return res.status(404).json({ message: 'Song not found' });
    return res.json({ song });
  } catch (error) {
    next(error);
  }
});

export default router;
