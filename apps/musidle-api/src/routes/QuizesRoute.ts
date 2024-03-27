import express, { Router, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import axios from 'axios';
import { getCurrentUrl } from '../utils/GetCurrentUrl';
import { quizModel } from '../models/QuizModel';
import bodyParser from 'body-parser';
dotenv.config();

const router: Router = express.Router();
const jsonParser = bodyParser.json();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const quizes = await quizModel.find();
    return res.json(quizes);
  } catch (error) {
    next(error);
  }
});

//Search by ARTIST ID
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const quiz = await quizModel.find({ artistId: req.params.id });
    return res.json(quiz);
  } catch (error) {
    next(error);
  }
});

router.post('/', jsonParser, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newQuiz = new quizModel({
      question: req.body.question,
      answer: req.body.answer,
      artistId: req.body.artistId,
      options: req.body.options,
    });
    const quiz = await newQuiz.save();
    return res.json(quiz);
  } catch (error) {
    next(error);
  }
});

export default router;
