import express, { Router, Request, Response } from 'express';
import songModel from '../models/SongModel';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import axios from 'axios';
import categoryModel from '../models/CategoryModel';
import { ILastFmSong, ISong } from '../@types/songs';
import { getCurrentUrl } from '../utils/GetCurrentUrl';
import roomModel from '../models/RoomModel';
import { IRoomSongs } from '../@types/room';
import { logger } from '../utils/Logger';
dotenv.config();

const jsonParser = bodyParser.json();

const router: Router = express.Router();

router.get('/:songId', async (req: Request, res: Response) => {
  try {
    const songId = req.params.songId;
    const song = await songModel.findOne({ songId: songId });

    if (!song) {
      return res.status(404).json({ message: 'Answer not found', song: null });
    }
    return res.status(200).json({ message: 'Song found', song });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: 'Failed to get the song' });
  }
});

router.post('/', jsonParser, async (req: Request, res: Response) => {
  try {
    if (!req.body.songId || !req.body.category || !req.body.value) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    if (!req.body.key) {
      const possibleLastFmUrls = await axios
        .get(`${getCurrentUrl()}/externalApi/track/search/` + encodeURIComponent(req.body.value))
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
    return res.json({ message: 'Song created', song });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: 'Failed to create the song' });
  }
});

router.get('/', async (req: Request, res: Response) => {
  try {
    const songs = await songModel.find();
    return res.json({ message: 'Songs found', songs });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: 'Failed to get songs' });
  }
});

router.delete('/:songId', async (req: Request, res: Response) => {
  try {
    const songId = req.params.songId;
    await songModel.findOneAndDelete({ songId: songId });
    return res.status(204).send();
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: 'Failed to delete the song' });
  }
});

router.post('/possibleSongs', jsonParser, async (req: Request, res: Response) => {
  try {
    const maxRoundsPhaseOne = req.body.maxRoundsPhaseOne;
    const maxRoundsPhaseTwo = req.body.maxRoundsPhaseTwo;
    const songs = await axios
      .get(`${getCurrentUrl()}/externalApi/songs`)
      .then(res => res.data.songs);

    const categories = await categoryModel
      .find()
      .then(res => res.map((category: { category: string }) => category.category));

    //filter songs by category
    const songsPhaseOne = songs.filter((song: ISong) => categories.includes(song.category));

    const songsPhaseTwo = songs.filter((song: ISong) => song.category === 'artists');
    const songsPhaseThree = songs.filter((song: ISong) => song.category === 'final');

    const shuffle = (array: ISong[]) => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    };

    shuffle(songsPhaseOne);
    shuffle(songsPhaseTwo);

    return res.status(200).json({
      message: 'Songs found',
      songs: songsPhaseOne
        .slice(0, maxRoundsPhaseOne)
        .concat(songsPhaseTwo.slice(0, maxRoundsPhaseTwo))
        .concat(songsPhaseThree),
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: 'Failed to get songs' });
  }
});

router.post('/chooseSong', jsonParser, async (req: Request, res: Response) => {
  try {
    const songId = req.body.songId;
    const roomCode = req.body.roomCode;

    const room = await roomModel.findOne({ roomCode: roomCode });

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    const songs = room.songs;

    //get all songs with category == songId in songs array
    if (songId.includes('final')) {
      const finalSongs = songs.filter((song: IRoomSongs) => song.songId === songId);
      return res.json({ message: 'Song found', songId: finalSongs[0].songId });
    } else if (songId.includes('artist')) {
      const artistSong = songs.filter((song: IRoomSongs) => song.songId === songId);
      return res.json({ message: 'Song found', songId: artistSong[0].songId });
    }

    const songsWithCategory = songs.filter((song: IRoomSongs) => song.category === songId);
    //Now loop through the songs and choose random song that does not have song.completed === true
    const song = () => {
      for (let i = 0; i < songsWithCategory.length; i++) {
        if (songsWithCategory[i].completed === false) {
          return songsWithCategory[i];
        }
      }
    };
    if (!song()) return res.status(404).json({ message: 'Song not found' });
    return res.json({ message: 'Song found', songId: song()?.songId });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: 'Failed to get the song' });
  }
});

export default router;
