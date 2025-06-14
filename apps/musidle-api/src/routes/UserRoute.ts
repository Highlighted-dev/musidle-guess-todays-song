import express, { Router, Request, Response } from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import userModel from '../models/UserModel';
import { articleModel } from '../models/ArticleModel';
import guildModel from '../models/GuildModel';
import { logger } from '../utils/Logger';
dotenv.config();

const router: Router = express.Router();

const jsonParser = bodyParser.json();

router.get('/', async (req: Request, res: Response) => {
  try {
    const users = await userModel.find();
    res.json(users);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: 'Failed to get users' });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id || id.length !== 24) {
      return res.status(400).json({ message: 'Bad Request' });
    }
    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: 'Failed to get user' });
  }
});

router.put('/:id', jsonParser, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id || id.length !== 24) {
      return res.status(400).json({ message: 'Bad Request' });
    }
    const user = await userModel.findByIdAndUpdate(id, req.body);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (req.body.name) {
      await articleModel.updateMany({ 'author.id': user._id }, { 'author.name': req.body.name });
      await guildModel.updateMany({ 'members.id': user._id }, { 'members.$.name': req.body.name });
      await guildModel.updateMany({ 'leader.id': user._id }, { 'leader.name': req.body.name });
    }
    return res.json({ message: 'User data updated' });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: 'Failed to update user' });
  }
});

export default router;
