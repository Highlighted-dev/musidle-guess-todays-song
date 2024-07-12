import express, { Router, Request, Response } from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import { logger } from '../utils/Logger';
dotenv.config();

const router: Router = express.Router();
const apiKey = process.env.LASTFM_API_KEY;

const searchTracks = async (query: string) => {
  const url = `https://ws.audioscrobbler.com/2.0/?method=track.search&track=${encodeURIComponent(
    query,
  )}&api_key=${apiKey}&format=json`;

  try {
    const response = await axios.get(url);
    const tracks = response.data.results.trackmatches.track;
    return tracks;
  } catch (error) {
    logger.error(error);
    return [];
  }
};

router.get('/:query', async (req: Request, res: Response) => {
  const query = req.params.query;
  const tracks = await searchTracks(query);
  return res.json(tracks);
});

export default router;
