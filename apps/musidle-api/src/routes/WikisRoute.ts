import express, { Router, Request, Response, NextFunction } from 'express';
import wikiModel from '../models/WikiModel';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import axios from 'axios';
dotenv.config();

const router: Router = express.Router();

const jsonParser = bodyParser.json();

// Get all wikis
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const wikis = await wikiModel.find();
    return res.json(wikis);
  } catch (error) {
    next(error);
  }
});

// Get a wiki by id
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    if (!id || id.length !== 24) {
      return res.status(400).json({ message: 'Bad Request' });
    }
    const wiki = await wikiModel.findById(id);
    return res.json(wiki);
  } catch (error) {
    next(error);
  }
});

router.get('/name/:name', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name } = req.params;
    if (!name) {
      return res.status(400).json({ message: 'Bad Request' });
    }
    const wiki = await wikiModel.find({ name: { $regex: name, $options: 'i' } });
    return res.json(wiki);
  } catch (error) {
    next(error);
  }
});

router.get('/tag/:tag', async (req: Request, res: Response, next: NextFunction) => {
  try {
    let { tag } = req.params;
    if (!tag) {
      return res.status(400).json({ message: 'Bad Request' });
    }
    // Decode the URL-encoded string
    tag = decodeURIComponent(tag);
    // Find wikis that have the tag in their tags array, case insensitive
    const wiki = await wikiModel.find({ tags: { $regex: new RegExp(tag, 'i') } });
    return res.json(wiki);
  } catch (error) {
    next(error);
  }
});

// Create a new wiki
router.post('/', jsonParser, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { description } = req.body;
    let { name } = req.body;
    if (!name || !description) {
      req.body.name = 'Unknown Artist';
      req.body.description = 'No description available';
      const result = await wikiModel.create(req.body);
      return res.status(201).json(result);
    }

    // Get artist info from LastFM API
    const artistInfo = await axios.get(
      `https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${name}&api_key=${process.env.LASTFM_API_KEY}&format=json`,
    );

    if (artistInfo.status !== 200) {
      throw new Error('Failed to get artist info from LastFM API');
    }

    // Format the data to only include the necessary information
    req.body.relatedArtists = artistInfo.data.artist.similar.artist.map(
      (artist: { name: string }) => ({
        name: artist.name,
      }),
    );

    req.body.tags = artistInfo.data.artist.tags.tag.map((tag: { name: string }) => tag.name);

    // Get top tracks from LastFM API
    const topTracks = await axios.get(
      `https://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&artist=${name}&api_key=${process.env.LASTFM_API_KEY}&format=json`,
    );

    if (topTracks.status !== 200) {
      throw new Error('Failed to get top tracks from LastFM API');
    }

    req.body.popularSongs = topTracks.data.toptracks.track.map(
      (track: {
        artist?: { name: string; url: string };
        name?: string;
        youtubeUrl: string | null;
      }) => ({
        name: track.name,
        artist: track.artist,
        youtubeUrl: track.youtubeUrl || '',
      }),
    );

    // Get top albums from LastFM API
    const topAlbums = await axios.get(
      `https://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=${name}&api_key=${process.env.LASTFM_API_KEY}&format=json`,
    );

    if (topAlbums.status !== 200) {
      throw new Error('Failed to get top albums from LastFM API');
    }

    req.body.notableAlbums = topAlbums.data.topalbums.album.map(
      (album: { image: any[]; name: string; artist: { name: string; url: string } }) => {
        if (album.image.length < 3) {
          throw new Error('Couldnt find album image with high enough resolution');
        }
        return {
          image: album.image,
          name: album.name,
          artist: album.artist,
        };
      },
    );

    if (!req.body.coverImage.url) {
      // if name has spaces, replace them with underscores
      if (name.includes(' ')) {
        name = name.replace(/ /g, '_');
      }
      req.body.coverImage.url = `https://musidle.live/externalApi/images/${name}.jpg`;
    }

    if (!req.body.coverImage.copyright.serviceName) {
      req.body.coverImage.copyright.serviceName = 'Commons';
    }

    if (!req.body.coverImage.copyright.licenseName && !req.body.coverImage.copyright.licenseUrl) {
      req.body.coverImage.copyright.licenseName = 'CC BY-SA 2.0';
      req.body.coverImage.licenseUrl = 'https://creativecommons.org/licenses/by-sa/2.0';
    }

    const result = await wikiModel.create(req.body);
    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

// Update a wiki
router.patch('/:id', jsonParser, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { name, description, notableAlbums, popularSongs, relatedArtists, tags } = req.body;
    if (
      !id ||
      id.length !== 24 ||
      !name ||
      !description ||
      !notableAlbums ||
      !popularSongs ||
      !relatedArtists ||
      !tags
    ) {
      return res.status(400).json({ message: 'Bad Request' });
    }
    const wiki = await wikiModel.findByIdAndUpdate(id, req.body, { new: true });
    return res.status(200).json(wiki);
  } catch (error) {
    next(error);
  }
});

export default router;
