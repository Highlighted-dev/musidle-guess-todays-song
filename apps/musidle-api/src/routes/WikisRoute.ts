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
        res.artist.similar.artist.forEach((artist: { url?: string; image?: [] }) => {
          delete artist.url;
          delete artist.image;
        });
        req.body.relatedArtists = res.artist.similar.artist;
        req.body.tags = res.artist.tags.tag;
        // remove "url" from tags
        req.body.tags = req.body.tags.map((tag: { name: string }) => tag.name);
      });
    await axios
      .get(
        `https://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&artist=${req.body.name}&api_key=${process.env.LASTFM_API_KEY}&format=json`,
      )
      .then(res => res.data)
      .then(res => {
        // remove useless fields from toptracks
        res.toptracks.track.forEach(
          (track: {
            playcount?: string;
            listeners?: string;
            streamable?: string;
            url?: string;
            mbid?: string;
            image?: [];
            // eslint-disable-next-line @typescript-eslint/naming-convention
            '@attr'?: string;
            youtubeUrl: string | null;
          }) => {
            delete track.playcount;
            delete track.listeners;
            delete track.streamable;
            delete track.url;
            delete track.mbid;
            delete track.image;
            delete track['@attr'];
            track.youtubeUrl = '';
          },
        );
        req.body.popularSongs = res.toptracks.track;
      });
    await axios(
      `https://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=${req.body.name}&api_key=${process.env.LASTFM_API_KEY}&format=json`,
    )
      .then(res => res.data)
      .then(res => {
        res.topalbums.album.forEach((album: { playcount?: string; url?: string; image: any[] }) => {
          delete album.playcount;
          delete album.url;
          if (album.image.length < 3) {
            throw new Error('Couldnt find album image with high enough resolution');
          }
        }),
          (req.body.notableAlbums = res.topalbums.album);
      });

    const result = await wikiModel.create(req.body);
    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

router.patch('/:id', jsonParser, async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (
      !req.params.id ||
      req.params.id.length !== 24 ||
      !req.body.name ||
      !req.body.description ||
      !req.body.notableAlbums ||
      !req.body.popularSongs ||
      !req.body.relatedArtists ||
      !req.body.tags
    ) {
      return res.status(400).json({ message: 'Bad Request' });
    }
    const wiki = await wikiModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    return res.status(200).json(wiki);
  } catch (error) {
    next(error);
  }
});

export default router;
