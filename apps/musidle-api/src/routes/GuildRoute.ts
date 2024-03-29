import express from 'express';
import GuildModel from '../models/GuildModel';
import bodyParser from 'body-parser';
import userModel from '../models/UserModel';

const router = express.Router();
const jsonParser = bodyParser.json();

// Create a new guild
router.post('/', jsonParser, async (req, res, next) => {
  try {
    const { body } = req;
    if (!body || !body.leader) {
      return res.status(400).send('Bad request');
    }
    const guild = new GuildModel(body);
    await guild.save();
    await userModel.updateOne(
      {
        _id: body.leader._id,
      },
      {
        $set: { guild: { _id: guild._id, name: guild.name } },
      },
    );
    res.status(201).json(guild);
  } catch (err) {
    next(err);
  }
});

// Add a member to a guild
router.post('/:name', jsonParser, async (req, res, next) => {
  try {
    const { body, params } = req;
    if (!body || !body.user) {
      return res.status(400).send('Bad request');
    }
    const user = await userModel.findById(body.user._id);
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
        _id: body.user._id,
      },
      {
        $set: { guild: { _id: guild._id, name: guild.name } },
      },
    );
    res.status(201).json(guild);
  } catch (err) {
    next(err);
  }
});

// Get all guilds
router.get('/', async (req, res, next) => {
  try {
    const guilds = await GuildModel.find();
    res.json(guilds);
  } catch (err) {
    next(err);
  }
});

// Get a guild by name
router.get('/:name', async (req, res, next) => {
  try {
    const { params } = req;

    const guild = await GuildModel.findOne({ name: params.name });
    if (!guild) {
      return res.status(404).send('Guild not found');
    }
    res.json(guild);
  } catch (err) {
    next(err);
  }
});

// Update a guild by name
router.put('/:name', jsonParser, async (req, res, next) => {
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
  } catch (err) {
    next(err);
  }
});

// Delete a guild by id
router.delete('/:name', jsonParser, async (req, res, next) => {
  try {
    const { params } = req;

    const guild = await GuildModel.findOneAndDelete({ name: params.name });
    if (!guild) {
      return res.status(404).send('Guild not found');
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;
