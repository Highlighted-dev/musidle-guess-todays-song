import express from 'express';
import GuildModel from '../models/GuildModel';
import bodyParser from 'body-parser';
import userModel from '../models/UserModel';
import { logger } from '../utils/Logger';

const router = express.Router();
const jsonParser = bodyParser.json();

// Create a new guild
router.post('/', jsonParser, async (req, res) => {
  try {
    let { body } = req;
    if (!body.user) return res.status(400).send('Bad request');

    body = { ...body, leader: body.user, members: [body.user] };
    body.user = undefined;

    if (!body || !body.leader) {
      return res.status(400).send('Bad request');
    }
    const guild = new GuildModel(body);
    await guild.save();
    await userModel.updateOne(
      {
        _id: body.leader.id,
      },
      {
        $set: { guild: { _id: guild._id, name: guild.name } },
      },
    );
    res.status(201).json(guild);
  } catch (error) {
    logger.error(error);
    return res.status(500).send('Failed to create guild');
  }
});

// Add a member to a guild
router.post('/:name', jsonParser, async (req, res) => {
  try {
    const { body, params } = req;
    if (!body || !body.user) {
      return res.status(400).send('Bad request');
    }

    const user = await userModel.findById(body.user.id);
    if (user && user?.guild._id) {
      return res.status(400).send('User already in a guild');
    }
    const guild = await GuildModel.findOne({ name: params.name });
    if (!guild) {
      return res.status(404).send('Guild not found');
    }
    await guild.updateOne({ $push: { members: body.user } });
    await userModel.updateOne(
      {
        _id: body.user.id,
      },
      {
        $set: { guild: { _id: guild._id, name: guild.name } },
      },
    );
    res.status(200).json(guild);
  } catch (error) {
    logger.error(error);
    return res.status(500).send('Failed to add member to guild');
  }
});

// Get all guilds
router.get('/', async (req, res) => {
  try {
    const guilds = await GuildModel.find();
    res.json(guilds);
  } catch (error) {
    logger.error(error);
    return res.status(500).send('Failed to get guilds');
  }
});

// Get a guild by name
router.get('/:name', async (req, res) => {
  try {
    const { params } = req;

    const guild = await GuildModel.findOne({ name: params.name });
    if (!guild) {
      return res.status(404).send('Guild not found');
    }
    res.json(guild);
  } catch (error) {
    logger.error(error);
    return res.status(500).send('Failed to get guild');
  }
});

// Update a guild by name
router.put('/:name', jsonParser, async (req, res) => {
  try {
    const { params, body } = req;

    if (!body) {
      return res.status(400).send('Bad request');
    }
    const guild = await GuildModel.findOneAndUpdate({ name: params.name }, body, {
      new: true,
    });
    if (!guild) {
      return res.status(404).send('Guild not found');
    }
    res.status(200).json(guild);
  } catch (error) {
    logger.error(error);
    return res.status(500).send('Failed to update guild');
  }
});

// Delete a guild by id
router.delete('/:name', jsonParser, async (req, res) => {
  try {
    const { params } = req;

    const guild = await GuildModel.findOneAndDelete({ name: params.name });
    if (!guild) {
      return res.status(404).send('Guild not found');
    }
    res.status(204).send();
  } catch (error) {
    logger.error(error);
    return res.status(500).send('Failed to delete guild');
  }
});

export default router;
