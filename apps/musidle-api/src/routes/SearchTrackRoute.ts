import express, { Router } from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
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
    console.error(error);
    return [];
  }
};

router.get('/:query', (req, res) => {
  const query = req.params.query;
  searchTracks(query).then(tracks => {
    return res.json(tracks);
  });
});

export default router;
