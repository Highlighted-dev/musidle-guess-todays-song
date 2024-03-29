import express, { Router, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import { quizModel } from '../models/QuizModel';
import bodyParser from 'body-parser';

dotenv.config();

const router: Router = express.Router();
const jsonParser = bodyParser.json();

//GET route to retrieve all quizzes
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const quizzes = await quizModel.find();
    return res.json(quizzes);
  } catch (error) {
    next(error);
  }
});

//GET route to search quizzes by artist ID
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const artistId = req.params.id;
    const quiz = await quizModel.find({ artistId });
    return res.json(quiz);
  } catch (error) {
    next(error);
  }
});

// POST route to create a new quiz
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
