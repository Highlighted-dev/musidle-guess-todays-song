import express, { Router, Request, Response, NextFunction } from 'express';
import { Server } from 'socket.io';
import songModel from '../models/SongModel';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import axios from 'axios';
import categoryModel from '../models/CategoryModel';
import { ISong } from '../@types/song';
dotenv.config();

const jsonParser = bodyParser.json();

const router: Router = express.Router();

interface ICustomRequest extends Request {
  io: Server;
}

router.get('/:song_id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const song_id = req.params.song_id;
    const song = await songModel.findOne({ song_id: song_id });

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
    if (!req.body.song_id || !req.body.category || !req.body.value || !req.body.key) {
      return res.status(400).json({ message: 'Missing required fields' });
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

router.delete('/:song_id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const song_id = req.params.song_id;
    const answer = await songModel.findOne({ song_id: song_id });

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
      const songs = await axios.get('http://localhost:5000/api/songs').then(res => res.data);

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
    const song_id = req.body.song_id;
    const room_code = req.body.room_code;

    const room = await axios.get(`http://localhost:5000/api/rooms/${room_code}`);

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    const songs = room.data.songs;

    //get all songs with category == song_id in songs array
    if (song_id.includes('final')) {
      const finalSongs = songs.filter((song: ISong) => song.song_id === song_id);
      return res.json({ message: 'Song found', data: finalSongs[0] });
    }

    const songsWithCategory = songs.filter((song: ISong) => song.category === song_id);

    //Now loop through the songs and choose random song that does not have song.completed === true
    const song = () => {
      for (let i = 0; i < songsWithCategory.length; i++) {
        if (songsWithCategory[i].completed === false) {
          return songsWithCategory[i];
        }
      }
    };
    if (!song()) return res.status(404).json({ message: 'Song not found' });
    return res.json({ message: 'Song found', data: song() });
  } catch (error) {
    next(error);
  }
});

export default router;
