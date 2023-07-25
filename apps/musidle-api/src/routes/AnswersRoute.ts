import express, { Router, Request, Response, NextFunction } from 'express';
import { Server } from 'socket.io';
import answersModel from '../models/AnswersModel';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
dotenv.config();

const jsonParser = bodyParser.json();

const router: Router = express.Router();

interface ICustomRequest extends Request {
  io: Server;
}

router.get('/:song_id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const song_id = req.params.song_id;
    const answer = await answersModel.findOne({ song_id: song_id });

    if (!answer) {
      return res.status(404).json({ message: 'Answer not found', data: null });
    }
    return res.json({ message: 'Answer found', data: answer });
  } catch (error) {
    next(error);
  }
});

router.post('/', jsonParser, async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.body.song_id || !req.body.value || !req.body.key) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const answer = await answersModel.create(req.body);
    return res.json({ message: 'Answer created', data: answer });
  } catch (error) {
    next(error);
  }
});

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const answers = await answersModel.find();
    return res.json({ message: 'Answers found', data: answers });
  } catch (error) {
    next(error);
  }
});

router.delete('/:song_id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const song_id = req.params.song_id;
    const answer = await answersModel.findOne({ song_id: song_id });

    if (!answer) {
      return res.status(404).json({ message: 'Answer not found' });
    }

    return res.json({ message: 'Answer deleted', data: answer });
  } catch (error) {
    next(error);
  }
});

export default router;
