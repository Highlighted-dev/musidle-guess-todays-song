import express, { Router, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { articleModel } from '../models/ArticleModel';
dotenv.config();

const jsonParser = bodyParser.json();

const router: Router = express.Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const articles = await articleModel.find();
    return res.json(articles);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.params.id || req.params.id.length !== 24) {
      return res.status(400).json({ message: 'Bad Request' });
    }
    const article = await articleModel.findById(req.params.id);
    return res.json(article);
  } catch (error) {
    next(error);
  }
});

router.post('/', jsonParser, async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.body.author) {
      return res.status(400).json({ message: 'Bad Request' });
    }
    if (!req.body.title || !req.body.content) {
      req.body.title = 'Article Title';
      req.body.content = '';
    }
    const article = await articleModel.create(req.body);
    return res.status(200).json(article);
  } catch (error) {
    next(error);
  }
});

router.patch('/:id', jsonParser, async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.params.id || req.params.id.length !== 24 || !req.body.title || !req.body.content) {
      return res.status(400).json({ message: 'Bad Request' });
    }
    const article = await articleModel.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        content: req.body.content,
      },
      { new: true },
    );
    return res.json(article);
  } catch (error) {
    next(error);
  }
});

export default router;
