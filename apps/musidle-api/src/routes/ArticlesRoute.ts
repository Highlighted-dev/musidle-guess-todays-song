import express, { Router, Request, Response } from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { articleModel } from '../models/ArticleModel';
import { logger } from '../utils/Logger';
dotenv.config();

const jsonParser = bodyParser.json();

const router: Router = express.Router();

// Route to get all articles
router.get('/', async (req: Request, res: Response) => {
  try {
    const articles = await articleModel.find();
    return res.json(articles);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: 'Failed to get articles' });
  }
});

// Route to get a specific article by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    // Validate the ID parameter
    const { id } = req.params;
    if (!id || id.length !== 24) {
      return res.status(400).json({ message: 'Bad Request' });
    }
    const article = await articleModel.findById(id);
    return res.json(article);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: 'Failed to get article' });
  }
});

// Route to create a new article
router.post('/', jsonParser, async (req: Request, res: Response) => {
  try {
    // Validate the request body
    const { author, title, content } = req.body;
    if (!author) {
      return res.status(400).json({ message: 'Bad Request' });
    }
    if (!title || !content) {
      req.body.title = 'Article Title';
      req.body.content = '';
    }
    const article = await articleModel.create(req.body);
    return res.status(200).json(article);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: 'Failed to create article' });
  }
});

// Route to update an existing article by ID
router.patch('/:id', jsonParser, async (req: Request, res: Response) => {
  try {
    // Validate the ID parameter and request body
    const { id } = req.params;
    const { title, content } = req.body;
    if (!id || id.length !== 24 || !title || !content) {
      return res.status(400).json({ message: 'Bad Request' });
    }
    const article = await articleModel.findByIdAndUpdate(
      id,
      {
        title,
        content,
      },
      { new: true },
    );
    return res.status(200).json(article);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: 'Failed to update article' });
  }
});

// Export the router
export default router;
