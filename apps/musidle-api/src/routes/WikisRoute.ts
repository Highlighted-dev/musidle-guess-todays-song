import express, { Router, Request, Response, NextFunction } from 'express';
import wikiModel from '../models/WikiModel';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import axios from 'axios';
dotenv.config();

const router: Router = express.Router();

const jsonParser = bodyParser.json();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const wikis = await wikiModel.find();
    return res.json(wikis);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.params.id || req.params.id.length !== 24) {
      return res.status(400).json({ message: 'Bad Request' });
    }
    const wiki = await wikiModel.findById(req.params.id);
    return res.json(wiki);
  } catch (error) {
    next(error);
  }
});

router.post('/', jsonParser, async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.body.name || !req.body.description) {
      return res.status(400).json({ message: 'Bad Request' });
    }
    // Now try to get things like notable albums, popular songs, related artists from lastfm api
    await axios
      .get(
        `https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${req.body.name}&api_key=${process.env.LASTFM_API_KEY}&format=json`,
      )
      .then(res => res.data)
      .then(res => {
        req.body.relatedArtists = res.artist.similar.artist;
        req.body.tags = res.artist.tags.tag;
        // remvoe "url" from tags
        req.body.tags = req.body.tags.map((tag: { name: string }) => tag.name);
      });
    await axios
      .get(
        `https://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&artist=${req.body.name}&api_key=${process.env.LASTFM_API_KEY}&format=json`,
      )
      .then(res => res.data)
      .then(res => {
        // remove playcount, listeners and streamable from toptracks
        res.toptracks.track.forEach(
          (track: {
            playcount?: string;
            listeners?: string;
            streamable?: string;
            url?: string;
          }) => {
            delete track.playcount;
            delete track.listeners;
            delete track.streamable;
            delete track.url;
          },
        );
        req.body.popularSongs = res.toptracks.track;
      });
    await axios(
      `https://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=${req.body.name}&api_key=${process.env.LASTFM_API_KEY}&format=json`,
    )
      .then(res => res.data)
      .then(res => (req.body.notableAlbums = res.topalbums.album));

    const result = await wikiModel.create(req.body);
    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

export default router;
