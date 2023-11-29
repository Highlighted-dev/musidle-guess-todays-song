import express, { Router, Request, Response, NextFunction } from 'express';
import songModel from '../models/SongModel';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import axios from 'axios';
import categoryModel from '../models/CategoryModel';
import { ILastFmSong, ISong } from '../@types/songs';
dotenv.config();

const jsonParser = bodyParser.json();

const router: Router = express.Router();

const apiUrl = process.env.NODE_ENV == 'production' ? process.env.API_URL : 'http://localhost:5000';

router.get('/:songId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const songId = req.params.songId;
    const song = await songModel.findOne({ songId: songId });

    if (!song) {
      return res.status(404).json({ message: 'Answer not found', data: null });
    }
    return res.json({ message: 'Song found', data: song });
  } catch (error) {
    next(error);
  }
});

router.post('/', jsonParser, async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.body.songId || !req.body.category || !req.body.value) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    if (!req.body.key) {
      const possibleLastFmUrls = await axios
        .get(`${apiUrl}/externalApi/track/search/` + encodeURIComponent(req.body.value))
        .then(res => res.data);

      possibleLastFmUrls.map((song: ILastFmSong) => {
        if ((song.artist + ' - ' + song.name).toLowerCase() == req.body.value.toLowerCase()) {
          req.body.key = song.url;
          return;
        }
      });
      if (!req.body.key)
        return res
          .status(404)
          .json({ message: 'URL to LastFM not found, you have to provide it manually' });
    }

    const song = await songModel.create(req.body);
    return res.json({ message: 'Song created', data: song });
  } catch (error) {
    next(error);
  }
});

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const songs = await songModel.find();
    return res.json({ message: 'Songs found', data: songs });
  } catch (error) {
    next(error);
  }
});

router.get('/category/:category', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = req.params.category;
    const songs = await songModel.find({ category: category });
    return res.json({ message: 'Songs found', data: songs });
  } catch (error) {
    next(error);
  }
});

router.delete('/:songId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const songId = req.params.songId;
    const answer = await songModel.findOne({ songId: songId });

    if (!answer) {
      return res.status(404).json({ message: 'Answer not found' });
    }

    return res.json({ message: 'Answer deleted', data: answer });
  } catch (error) {
    next(error);
  }
});

router.post(
  '/possibleSongs',
  jsonParser,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const maxRoundsPhaseOne = req.body.maxRoundsPhaseOne;
      const maxRoundsPhaseTwo = req.body.maxRoundsPhaseTwo;
      const songs = await axios.get(`${apiUrl}/externalApi/songs`).then(res => res.data);

      const categories = await categoryModel
        .find()
        .then(res => res.map((category: { category: string }) => category.category));

      //filter songs by category
      const songsPhaseOne = songs.data.filter((song: ISong) => categories.includes(song.category));

      const songsPhaseTwo = songs.data.filter((song: ISong) => song.category === 'artists');
      const songsPhaseThree = songs.data.filter((song: ISong) => song.category === 'final');

      const shuffle = (array: ISong[]) => {
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
      };

      shuffle(songsPhaseOne);
      shuffle(songsPhaseTwo);

      const possibleSongs = {
        songs: songsPhaseOne
          .slice(0, maxRoundsPhaseOne)
          .concat(songsPhaseTwo.slice(0, maxRoundsPhaseTwo))
          .concat(songsPhaseThree),
      };
      return res.json({ message: 'Songs found', data: possibleSongs });
    } catch (error) {
      next(error);
    }
  },
);

router.post('/chooseSong', jsonParser, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const songId = req.body.songId;
    const roomCode = req.body.roomCode;

    const room = await axios.get(`${apiUrl}/externalApi/rooms/${roomCode}`);

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    const songs = room.data.songs;

    //get all songs with category == songId in songs array
    if (songId.includes('final')) {
      const finalSongs = songs.filter((song: ISong) => song.songId === songId);
      return res.json({ message: 'Song found', data: finalSongs[0].songId });
    } else if (songId.includes('artist')) {
      const artistSong = songs.filter((song: ISong) => song.songId === songId);
      return res.json({ message: 'Song found', data: artistSong[0].songId });
    }

    const songsWithCategory = songs.filter((song: ISong) => song.category === songId);

    //Now loop through the songs and choose random song that does not have song.completed === true
    const song = () => {
      for (let i = 0; i < songsWithCategory.length; i++) {
        if (songsWithCategory[i].completed === false) {
          return songsWithCategory[i];
        }
      }
    };
    if (!song()) return res.status(404).json({ message: 'Song not found' });
    return res.json({ message: 'Song found', data: song().songId });
  } catch (error) {
    next(error);
  }
});

router.get('/daily', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const song = await songModel.findOne({ wasInDaily: false });
    if (!song) return res.status(404).json({ message: 'Song not found' });
    return res.json({ song });
  } catch (error) {
    next(error);
  }
});

export default router;
